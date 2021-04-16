
from flask import render_template, jsonify, current_app, redirect, url_for, request, make_response
from flask_jwt_extended import (get_raw_jwt,get_jwt_identity,
                                create_access_token,create_refresh_token,
                                set_access_cookies,set_refresh_cookies,
                                verify_jwt_refresh_token_in_request,
                                unset_jwt_cookies)
from jwt import ExpiredSignatureError
from wtforms.validators import Regexp, EqualTo, ValidationError

from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from . import app,jwt,mail, veggies, gen_inference_df


import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from os import getcwd, remove, path
import re





'''JWT Authentication Helper Functions'''
# def create_JWT_n_redirect(user, redirect_page='homepage'):
#     #The user must be a database object.
#     #changed user.email to user['email'] for json
#     access_token = create_access_token(identity=user['email'], fresh=True)
#     refresh_token = create_refresh_token(identity=user['email'])

#     response = make_response(redirect(url_for(redirect_page)))
#     set_access_cookies(response, access_token)
#     set_refresh_cookies(response, refresh_token)
#     app.logger.info('Create access and refresh token, redirecting to {}'.format(redirect_page))
#     # response.headers['Authorization'] = 'Bearer {}'.format(access_token)
#     return response

#without redirect, might not use
def create_JWT(user):
    #The user must be a database object.
    #changed user.email to user['email'] for json
    access_token = create_access_token(identity=user['email'], fresh=True)
    refresh_token = create_refresh_token(identity=user['email'])

    response = make_response(user['email'])
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    app.logger.info('Create access and refresh token for {}'.format(user['email']))
    response.headers['Authorization'] = 'Bearer {}'.format(access_token)
    return response


#get username from refresh jwt and redirects to the refresh_endpoint passing the username
@jwt.expired_token_loader
def handle_expired_token():
    try:
        verify_jwt_refresh_token_in_request()
    except ExpiredSignatureError:
        print('REFRESH TOKEN has expired. Rerouting to login page...')
        response = make_response(redirect(url_for('login_page')))
        unset_jwt_cookies(response)
        return response
    #print(current_app.config['JWT_USER_CLAIMS'])
    username = get_jwt_identity()
    raw_jwt_claim = get_raw_jwt()
    print(jsonify(user= username, raw_jwt=raw_jwt_claim))
    return redirect(url_for('refresh_endpoint', username=username,
                            prev_url=request.url), code=307)



#This allows me to stop people who have not logged in yet.
@jwt.unauthorized_loader
@jwt.invalid_token_loader
def missing_JWT_token(msg):
    print('from missing_JWT_token func:', msg)
    app.logger.warning('End user attempted to access a page that requires valid JWT. '
                       '{}'.format(msg))
    message_header = "Login Required"
    message_body = "This page is only accessible to logged in users."
    response = make_response(render_template('intermediate_page.html',
                                             message_header=message_header,
                                             message_body=message_body,
                                             login=True,
                                             register=True,
                                             ))
    unset_jwt_cookies(response)
    return response
    # return "The site being accessed requires a valid JWT to view." \
    #        "Error: {}".format(msg)




#This decorator is not being used but I might use it later if I decide to refactor.
def refresh_token(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_refresh_token_in_request()
        print(current_app.config['JWT_USER_CLAIMS'])
        user = get_jwt_identity()
        #ref_token = jwt._decode_jwt_from_cookies('refresh')
        print("refresh_token_user:", user)
        return jsonify(user=user)
        #return flask response from here
    return wrapper









'''Form Validation Helper Functions'''
#This is to check if a password does not the regexp. If it does match then pw is not accepted.
class NoneRegExp(Regexp):
    def __call__(self, form, field, message=None):
        match = self.regex.match(field.data or '')
        if match:
            if message is None:
                if self.message is None:
                    message = field.gettext('Invalid input.')
                else:
                    message = self.message

            raise ValidationError(message)
        return match


#This is to make sure either the pdb_struct is provided or a pdb file is uploaded but not both.
class OrTo(EqualTo):
    """
    Compares if 2 fields are both provided when only 1 should be (the 'other' one).

    :param fieldname:
        The name of the 'other' field to compare to.
    :param message:
        Error message to raise in case of a validation error. Can be
        interpolated with `%(other_label)s` and `%(other_name)s` to provide a
        more helpful error.
    """
    def __init__(self, fieldname, message=None):
        self.fieldname = fieldname
        self.message = message

    def __call__(self, form, field):
        try:
            other = form[self.fieldname]
        except KeyError:
            raise ValidationError(field.gettext("Invalid field name '%s'.") % self.fieldname)
        if other.data and field.data:
            d = {
                'other_label': hasattr(other, 'label') and other.label.text or self.fieldname,
                'other_name': self.fieldname
            }
            message = self.message
            if message is None:
                message = field.gettext('{} and {} cannot both be provided'\
                                        .format(other.label.text,field.label.text))
            raise ValidationError(message % d)



class AcademicEmailSuffix:
    """
    Checks if the email address belongs to a list of potential suffix. 
    """

    def __init__(self, suffix_list=['.edu'], message=None):
        self.suffix_list = [suffix.strip() for suffix in suffix_list]
        self.message = message 

    def __call__(self, form, field):
        email = str(field.data).strip()
        email_suffix_re = re.compile('\w+@\w+(\..+)')
        domain = email_suffix_re.findall(email)[0]

        print('domain:', domain)
        print('Suffix List:', self.suffix_list)

        if not any([1 for suffix in self.suffix_list if suffix in domain]):
            if self.message is None: 
                self.message = 'Email address must be from an academic institution. (.edu)'
            raise ValueError(self.message)

        print('The email suffix passed validator:', email, domain)










'''EMAIL Helper Functions'''

#This is what I used for google
def send_email(subject,recipient, text_body=None, html_body=None):
    msg = Message(subject, recipients=recipient, sender=app.config['MAIL_USERNAME'])
    msg.body = text_body
    msg.html = html_body
    mail.send(msg)





#Mailjet email server settings
# def mj_send_email(recipient,sender="confirm_email_nn_app@yahoo.com",
#                   subject='Confirm your email', text_body=None, html_body=None):
#     data = {
#         'FromEmail': sender,
#         'FromName': '<no-reply-email_confirmation>',
#         'Subject': subject,
#         'Text-part': text_body,
#         'Html-part': html_body,
#         'Recipients': [
#             {
#                 "Email": recipient
#             }
#         ]
#     }
#     result = mj.send.create(data=data)
    #pass





"""
This is to send an email other than the confirmation email. The function for email
confirmation is a method in the User model. 
"""

@veggies.task
def SES_email_confirmation(user_email='danny.jesus.diaz.94@gmail.com',
                           html_template='email_confirmation_2.html'):
    subject = 'mutCompute_Email_Confirmation'
    sender_email = "no-reply@mutcompute.com"

    confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    token = confirm_serializer.dumps(user_email, salt=app.config['MAIL_SALT'])
    confirm_url = url_for('confirm_email_endpoint', token=token, _external=True)
    print(confirm_url)
    html = render_template(html_template, confirm_url=confirm_url)

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = sender_email
    msg['To'] = str(user_email)

    html_mime = MIMEText(html, 'html')

    msg.attach(html_mime)


    server = smtplib.SMTP()
    server.connect(app.config['SES_EMAIL_HOST'], app.config['SES_EMAIL_PORT'])
    server.starttls()
    server.login(app.config["SES_SMTP_USERNAME"], app.config["SES_SMTP_PASSWORD"])

    try:
        server.sendmail(sender_email, user_email, msg.as_string())
        app.logger.info('Sent confirmation email to user: {0}'.format(user_email))
    except Exception as e:
        app.logger.error('Error in sending confirmation email to user: {0}'. \
                         format(user_email))
        server.quit()
        return False
    server.quit()
    print('Sent email')
    return True






# If you do not include a df it will assume that file already exist in the tmp directory and it will send it
@veggies.task
def SES_send_NN_inference_email(user_email, pdb_code, df=None):
    subject = 'mutCompute inference for {}'.format(pdb_code)
    from_name = 'no-reply@mutcompute.com'
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = from_name
    msg['To'] = user_email

    mime_text = MIMEText("Thank you for using mutCompute!")
    msg.attach(mime_text)
    
    cwd = getcwd()
    print("Saving DF as CSV, pwd: ", cwd)
    app.logger.info("Saving DF as CSV, pwd: {}".format(cwd))
    csv_file = './tmp/{}.csv'.format(pdb_code)

    if not df is None:
        df.to_csv(csv_file)

    with open(csv_file, 'rb') as fp:
        attachment =  MIMEBase('text', 'csv')
        attachment.set_payload(fp.read())
    attachment.add_header('Content-Disposition', "attachment", filename='{}.csv'.format(pdb_code))
    msg.attach(attachment)

    server = smtplib.SMTP()
    server.connect(app.config['SES_EMAIL_HOST'], app.config['SES_EMAIL_PORT'])
    server.starttls()
    server.login(app.config["SES_SMTP_USERNAME"], app.config["SES_SMTP_PASSWORD"])
    try:
        server.sendmail(from_name, user_email, msg.as_string())
        app.logger.info('Sent email for PDB {0} to user: {1}'.format(pdb_code, user_email))
    except Exception as e:
        app.logger.error('Error in sending the email for PDB {0} to user: {1}'. \
                         format(pdb_code, user_email))
        print('Failed to send NN email.')
        server.quit()
        return False

    if path.exists(csv_file):
        remove(csv_file)
    server.quit()
    print('Sent NN email')
    return True







@veggies.task
def SES_NN_email_failed(user_email, pdb_code, problem='nn'):
    subject = 'mutCompute inference for {} failure'.format(pdb_code)
    from_name = 'no-reply@mutcompute.com'
    recipients = [user_email, 'danny.diaz@utexas.edu']
    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = from_name


    message = ''
    if problem =='nn':
        message = """<br>
        <p>
            Unfortunately, we ran into a problem while computing the predictions on PDB: {0}.<br>
            We have been notified of the issue and expect an email from us over the next 48 hours 
            with more details.
            <br>
            Sorry for the inconvenience.
        </p>
        """.format(pdb_code)
    elif problem =='email':
        message = """<br>
                <p>
                    There was a problem sending email to user: {} for pdb: {}. 
                    However, the NN ran successfully.
                    <br>
                </p>
                """.format(user_email, pdb_code)
    else:
        print('unknown problem exiting... Not sending email.')
        return False

    mime_html = MIMEText(message, 'html')
    msg.attach(mime_html)

    server = smtplib.SMTP()
    server.connect(app.config['SES_EMAIL_HOST'], app.config['SES_EMAIL_PORT'])
    server.starttls()
    server.login(app.config["SES_SMTP_USERNAME"], app.config["SES_SMTP_PASSWORD"])
    try:
        if problem=='nn':
            for recipient in recipients:
                msg['To'] = recipient
                server.sendmail(from_name, recipient, msg.as_string())
            app.logger.info('Sent email for PDB {0} to user: {1}'.format(pdb_code, user_email))
        else:
            msg['To'] = recipients[1]
            server.sendmail(from_name, recipients[1], msg.as_string()) # Sending this only to me
            app.logger.info('Sent email for PDB {0} to myself: {1}'.format(pdb_code, recipients[1]))

    except Exception as e:
        app.logger.error('Error in sending the NN Failed email for PDB {0} to user: {1} and/or myself {2}'. \
                         format(pdb_code, user_email, recipients[1]))
        print('Failed to send NN email.')
        server.quit()
        return False


    server.quit()
    print('Sent NN failure email')
    return True



def send_confirmation_email(user_email='danny.jesus.diaz.94@gmail.com',
                            subject='NN Web App email',
                            html_template='email_confirmation_2.html'):
    confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    token = confirm_serializer.dumps(user_email,salt=app.config['MAIL_SALT'])
    confirm_url = url_for('confirm_email_endpoint',token=token, _external=True)
    print(confirm_url)
    html = render_template(html_template,confirm_url=confirm_url)

    send_email(subject,
               [user_email,app.config['MAIL_DEFAULT_SENDER']],
               text_body=confirm_url,
               html_body=html)

    #mj_send_email(recipient=user_email,html_body=html)






