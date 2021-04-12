from flask import url_for,render_template, redirect,request, jsonify,flash,\
                    make_response, session, send_from_directory

from flask_jwt_extended import (create_access_token, create_refresh_token,
                            jwt_required, get_jwt_identity, get_jwt_claims,
                            set_access_cookies,set_refresh_cookies,
                            unset_jwt_cookies, get_raw_jwt,
                            jwt_refresh_token_required, jwt_optional,
                            verify_jwt_in_request_optional,
                            verify_jwt_refresh_token_in_request)

# breaks proxy connection
# from flask_cors import CORS

from sqlalchemy.exc import IntegrityError
from itsdangerous import URLSafeTimedSerializer,SignatureExpired, BadTimeSignature
from datetime import datetime
from time import sleep
from forms import RegisterForm, LoginForm, NNForm
from models import Users, NN_Query
from task import run_NN
from tools import *

from . import app, db, jwt


#goes in init.py?
# app= Flask(__name__, static_folder='../public/index.html', static_url_path='/')

@app.route('/',  methods=['GET'])
def countdown_page():
   return render_template('countdown.html')

@app.errorhandler(404)
def not_found(e):
    return ass.send_static_file('index.html')


@app.route('/login/', methods=['GET','POST'])
@app.route('/login', methods=['GET','POST'])
@jwt_optional
def login_page():
    form = LoginForm(request.form)
    app.logger.debug("Request Method and form: {}, {}".format(request.method, request.form))
    if request.method == "POST":
        #This checks if the user is in the db and returns the user obj.
        #Need to write logic to redirect to a page to resend a link if link is lost or expired.
        #user = form.validate_on_submit()
        user = request.json
        # app.logger.warning("Form errors: {}".format(form.errors))
        if user:
            # for key, value in user.items():
            print(user['email'])
            print('Form validated, user obtained: {}'.format(user['email']))
            app.logger.info('Form validated, logging in user: {}'.format(user['email']))
            return create_JWT_n_redirect(user, redirect_page='home')
            # access_token = create_access_token(identity=user.email, fresh=True)
            # refresh_token = create_refresh_token(identity=user.email)
            #
            # response = make_response(redirect(url_for('NN_page')))
            # set_access_cookies(response, access_token)
            # set_refresh_cookies(response, refresh_token)
            # #response.headers['Authorization'] = 'Bearer {}'.format(access_token)
            # print(response)
            # return response
            # #return jsonify({'access_token':access_token})
            # #return redirect((url_for("NN_page")))
        app.logger.warning('Unsuccessful login attempt by user.')
    app.logger.info('Active Page: Login Page.')
    return render_template('login_page.html', active_page='Login', form=form)
    # return send_from_directory()






@app.route('/register', methods=['GET','POST'])
def register_page():
    #ToDo this logic needs to be checked for correct user registration and validation.
    form = RegisterForm(request.form)
    app.logger.debug(request.form)
    app.logger.info( "Register page submission and validation: {}, {}" \
                     .format(request.method, form.validate_on_submit()))
    app.logger.warning("Form errors: {}".format(form.errors))
    if request.method == "POST" and form.validate_on_submit():
        try:
            user = Users(form.first_name.data, form.last_name.data, \
                         form.email.data, form.password.data, form.organization.data)
            user.save_to_db()
            email_sent =user.send_confirmation_email()
            if email_sent:
                app.logger.info('Sent confirmation email to: {}'.format(user.email))
                message_header =  "An email confirmation link has been sent to {}. ".format(user.email)
                message_body = "Please allow up to 5 minutes and check your spam folder."
                message_body_2 = "If you have still not received your confirmation email, " \
                                 "please attempt to log in order to trigger an additional " \
                                 "confirmation email to be sent."
                return render_template("intermediate_page.html",
                                            message_header=message_header,
                                            message_body=message_body,
                                            message_body_2=message_body_2,
                                            login=True,
                                       )

            else:
                app.logger.error('Registration failed for: {}. Unable to send email.'.format(user.email))
                return "Registration Failed. Try Again"

        except IntegrityError:
            db.session.rollback()
            app.logger.error('Email: {} already exists in the user db.'.format(request.form['email']))
            flash("ERROR! Email: {} already exists.".format(form.email),category='error')
            message_header = "User: {} already exists.".format(user.email)
            message_body = "It appears that this email address is already linked to an account. If you need an " \
                           "additional confirmation email sent, you can trigger a new confirmation email by " \
                           "attempting to login."

            return render_template("intermediate_page.html",
                                   message_header=message_header,
                                   message_body=message_body,
                                   login=True,
                                   )

    # elif request.method == "POST":
    #     return "Registration Failed"
    app.logger.info('Active Page: Registration Page.')
    return render_template('register.html',active_page='Register', form=form, )





@app.route('/FAQ')
@jwt_optional
def FAQ_page():
    app.logger.info('Active Page: FAQ')
    current_user = get_jwt_identity() or None
    app.logger.info('Current User: {}'.format(current_user))
    return render_template("newFaq.html", active_page='FAQ', current_user=current_user)





@app.route('/logged_out',methods=['GET','POST'])
def logout_page():
    #print("session:", session.viewitems())
    #print(session.pop('successful_logout',False))
    # if session.pop('successful_logout' == True:
    #     return render_template('logout_page.html')
    # else:
    #    return redirect(url_for('homepage'))

    if request.cookies.get('refresh_token_cookie',False):
        app.logger.debug('Forwarding request to logout endpoint.')
        return redirect(url_for('logout_endpoint'))
    elif session.has_key('successful_logout'):
        session.pop('successful_logout')
        app.logger.info('User: {} successfully logged out.'.format(request.args.get('username', '')))
        return render_template('logout_page.html'
                               , username=request.args.get('username','User'))
    else:
        app.logger.info('Unauthenticated user has attempted to reach logged out page.')
        return redirect(url_for('login_page'))
        #raise Exception('Shit is fucked','Cookies:',request.cookies,
        #                'Session:', session.viewitems())



@app.route('/home')
@app.route('/')
@jwt_optional
def home():
    # return '<h1>home page</h1>'
    return render_template("newHomePage.html")


# compvis section (NGL) -- dynamic rendering
# @app.route('/compvis')
# def compvis():
# 	return render_template('compvis.html', pdb_file='6ij6.pdb', pdb_csv='6ij6.csv')

# dynamically renders url for each pdb

@app.route('/ngl')
@jwt_optional
def ngl():
    jwt_claims = get_raw_jwt()
    current_user = get_jwt_identity() or None
    app.logger.info('Active Page: viewer, current user: {}'.format(current_user))
    return render_template("loadscript.html", pdb_file='2isk.pdb', pdb_csv='2isk.csv')

# @app.route('/viewer')
# @jwt_required
# def viewer():
#     jwt_claims = get_raw_jwt()
#     current_user = get_jwt_identity() or None
#     app.logger.info('Active Page: viewer, current user: {}'.format(current_user))
#     return render_template("embedded.html", pdb_file='6ar1.pdb', pdb_csv='6ar1.csv')

# @app.route('/viewer/<pdb_id>')
# @jwt_optional
# def dynamic_viewer(pdb_id):
#     pdb_id   = pdb_id.lower()
#     pdb_file = pdb_id + ".pdb"
#     pdb_csv  = pdb_id + ".csv"
#     app.logger.info('{0} {1}'.format(pdb_file, pdb_csv))
#     return render_template("embedded.html", pdb_file=pdb_file, pdb_csv=pdb_csv)



@app.route('/NN/', methods=['GET','POST'])
@jwt_required
def NN_page():
    jwt_claims = get_raw_jwt()
    #print(jwt_claims)
    #print('cookie keys:', request.cookies.get('refresh_token_cookie'))
    current_user = get_jwt_identity() or None
    app.logger.info('Active Page: NN, current user: {}'.format(current_user))
    form = NNForm(request.form)
    app.logger.info("Request data: {}".format(form.data))
    app.logger.info('Form method: {}, form validate on submit: {}'.format(request.method, form.validate_on_submit()))
    if request.method == "POST":
        if form.validate_on_submit():
            run_NN.delay(current_user, form.query)
            sleep(2)
            return redirect(url_for('success_NN_submission'))
            #return "Submission successful" #redirect(url_for("success_NN_submission"))
        # return redirect(url_for('failed_NN_submission'))
    return render_template('NN_page.html', active_page='NN',form=form, current_user=current_user)




@app.errorhandler(404)
def not_found_error(error):
    #ToDo need to create this html page
    app.logger.warning('User accessed a page that does not exist, 404')
    return jsonify(Error=404, msg='Page Not Found.'), 404


@app.errorhandler(500)
def not_found_error(error):
    #ToDo need to create this html page
    app.logger.warning('There was a server error, 500')
    return jsonify(Error=500, msg='Server Error.'), 500



@app.route('/submission-successful')
def success_NN_submission():
    session['prev_url'] = 'success_NN_submission'
    if request.cookies.get('refresh_token_cookie',False):
        app.logger.debug('Forwarding request to logout endpoint.')
        return redirect(url_for('logout_after_submission_endpoint'))

    return "The submitted structure has been accepted by the neural net. " \
           "You will receive an email with the results upon completion. "



@app.route('/submission-failed')
def failed_NN_submission():
    session['prev_url'] = 'failed_NN_submission'
    if request.cookies.get('refresh_token_cookie', False):
        app.logger.debug('Forwarding request to logout endpoint.')
        return redirect(url_for('logout_after_submission_endpoint'))
    return "The submitted structure was not accepted by the neural network. " \
           "This is most likely due to a syntax or formatting error. Please " \
           "try again."





# ToDo When the token expires I get an HTTP status code of 401 I can use expired_token_loader refresh token.
@app.route('/token/refresh', methods=['GET', 'POST'])
@jwt_refresh_token_required
def refresh_endpoint():
    # Create the new access token from refresh token username passed in.
    username = request.args['username']
    app.logger.info('refresh_endpoint.. creating new access token for user: {}'.format(username))
    access_token = create_access_token(username)

    # #Set the JWT access cookie in the response
    response = make_response(redirect(request.args['prev_url']))
    set_access_cookies(response, access_token)
    app.logger.info('Created new access cookie.')
    return response

    # trouble shooting code
    # ref_token = request.cookies.get('refresh_token_cookie')
    # csrftoken = request.cookies.get('csrftoken')
    # decode_ref_token = decode_token(ref_token)
    # print('ref_token:', ref_token)
    # print('current_user:', current_user, get_raw_jwt())





@app.route('/token/remove', methods=['GET', 'POST'])
@jwt_required
def logout_after_submission_endpoint():
    # ToDo Still need to build the logout page.
    # response = make_response(redirect(url_for('logout_page')))
    app.logger.info('Endpoint: Logout')
    verify_jwt_refresh_token_in_request()
    current_user = get_jwt_identity()
    app.logger.info('Current User: {}'.format(current_user))
    if session.has_key('prev_url'):
        response = make_response(redirect(url_for(session['prev_url'])))
    else:
        response = make_response(redirect(url_for('logout_page')))

    unset_jwt_cookies(response)
    session['successful_logout'] = True
    app.logger.info('Logging out current user: {}'.format(current_user))
    return response






@app.route('/token/remove', methods=['GET', 'POST'])
@jwt_required
def logout_endpoint():
    # ToDo Still need to build the logout page.
    # response = make_response(redirect(url_for('logout_page')))
    app.logger.info('Endpoint: Logout')
    verify_jwt_refresh_token_in_request()
    current_user = get_jwt_identity()
    app.logger.info('Current User: {}'.format(current_user))

    response = make_response(redirect(url_for('logout_page')))
    session['successful_logout'] = True
    app.logger.info('Logging out current user: {}'.format(current_user))
    return response







@app.route('/email_confirmation/<token>')
def confirm_email_endpoint(token):
    app.logger.info('Endpoint: Confirm Email')
    confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    email = None
    try:
        email = confirm_serializer.loads(token,
                                         salt=app.config['MAIL_SALT'],
                                         max_age=86400) #604800 is 7 days
    except SignatureExpired:
        print('The confirmation link has an expired signature.')
        app.logger.error('The confirmation link has an expired signature.')
        flash('The confirmation link is invalid or has expired.',category='error')
        redirect(url_for('login_page'))

    except BadTimeSignature:
        print('The token has expired. The token is only valid for {}'.format(email.max_age))
        app.logger.error('The token has expired. The token is only valid for {}'.format(email.max_age))


    user = Users.query.filter_by(email=email).first()

    print('Confirming email for {}'.format(user.email))
    app.logger.error('confirming email for: {}'.format(user.email))
    if user.email_confirmed:
        print('User {} has already confirmed his email'.format(user.email))
        app.logger.warning('User {} has already confirmed his email'.format(user.email))
        flash('User {} has already confirmed his email'.format(user.email), category='info')
        #ToDo I need to create a already confirmed email page.
        return redirect(url_for('login_page'))
    else:
        user.email_confirmed = True
        user.email_confirmed_on = datetime.now()
        user.save_to_db()
        print('Email has been successfully confirmed for {}'.format(user.email))
        app.logger.info('Email has been successfully confirmed for {}'.format(user.email))
        flash('Thank you for confirming your email!',category='message')
        return create_JWT_n_redirect(user, redirect_page='NN_page')

    #redirect(url_for('login_page'))



# @app.route('/intermediate_page/')
# def intermediate_page(header,body):
#     message_header = 'The passed user is {}'.format(user)
#     message_body = 'This is the message body.'
#     return render_template('intermediate_page.html',
#                            message_header=message_header,
#                            message_body=message_body)






























#
# @app.route('/homepage')
# @jwt_optional
# def homepage():
#     app.logger.info('Active Page: Homepage.')
#     current_user = get_jwt_identity() or None
#     # Trouble shooting code
#     # if current_user == None:
#     #     raise Exception('Anonymous User!!')
#     # else:
#     #return jsonify(current_user=current_user)
#     app.logger.info('Current User: {}'.format(current_user))
#     return render_template('homepage.html', active_page='Home', current_user=current_user)
#
#
#
#
#
# @app.route('/FAQ')
# @jwt_optional
# def FAQ_page():
#     app.logger.info('Active Page: FAQ')
#     current_user = get_jwt_identity() or None
#     app.logger.info('Current User: {}'.format(current_user))
#     return render_template("FAQ_page.html", active_page='FAQ', current_user=current_user)
#
#
#
#
# @app.route('/intermediate_page/')
# def intermediate_page(header,body):
#     message_header = 'The passed user is {}'.format(user)
#     message_body = 'This is the message body.'
#     return render_template('intermediate_page.html',
#                            message_header=message_header,
#                            message_body=message_body)
#
#
#
#
# # @app.route('/register', methods=['GET','POST'])
# # def register_page():
# #     #ToDo this logic needs to be checked for correct user registration and validation.
# #     form = RegisterForm(request.form)
# #     app.logger.debug(request.form)
# #     app.logger.info( "Register page submission and validation: {}, {}" \
# #                      .format(request.method, form.validate_on_submit()))
# #     app.logger.warning("Form errors: {}".format(form.errors))
# #     if request.method == "POST" and form.validate_on_submit():
# #         try:
# #             user = Users(form.first_name.data, form.last_name.data, \
# #                          form.email.data, form.password.data, form.organization.data)
# #             user.save_to_db()
# #             email_sent =user.send_confirmation_email()
# #             if email_sent:
# #                 app.logger.info('Sent confirmation email to: {}'.format(user.email))
# #                 message_header =  "An email confirmation link has been sent to {}. ".format(user.email)
# #                 message_body = "Please allow up to 5 minutes and check your spam folder."
# #                 message_body_2 = "If you have still not received your confirmation email, " \
# #                                  "please attempt to log in order to trigger an additional " \
# #                                  "confirmation email to be sent."
# #                 return render_template("intermediate_page.html",
# #                                             message_header=message_header,
# #                                             message_body=message_body,
# #                                             message_body_2=message_body_2,
# #                                             login=True,
# #                                        )
# #
# #             else:
# #                 app.logger.error('Registration failed for: {}. Unable to send email.'.format(user.email))
# #                 return "Registration Failed. Try Again"
# #
# #         except IntegrityError:
# #             db.session.rollback()
# #             app.logger.error('Email: {} already exists in the user db.'.format(request.form['email']))
# #             flash("ERROR! Email: {} already exists.".format(form.email),category='error')
# #             message_header = "User: {} already exists.".format(user.email)
# #             message_body = "It appears that this email address is already linked to an account. If you need an " \
# #                            "additional confirmation email sent, you can trigger a new confirmation email by " \
# #                            "attempting to login."
# #
# #             return render_template("intermediate_page.html",
# #                                    message_header=message_header,
# #                                    message_body=message_body,
# #                                    login=True,
# #                                    )
# #
# #     # elif request.method == "POST":
# #     #     return "Registration Failed"
# #     app.logger.info('Active Page: Registration Page.')
# #     return render_template('register.html',active_page='Register', form=form, )
#
#
#
#
#
# # @app.route('/login/', methods=['GET','POST'])
# # @app.route('/login', methods=['GET','POST'])
# # def login_page():
# #     form = LoginForm(request.form)
# #     app.logger.debug("Request Method and form: {}, {}".format(request.method, request.form))
# #     if request.method == "POST":
# #         #This checks if the user is in the db and returns the user obj.
# #         #Need to write logic to redirect to a page to resend a link if link is lost or expired.
# #         user = form.validate_on_submit()
# #         app.logger.warning("Form errors: {}".format(form.errors))
# #         if user:
# #             print('Form validated, user obtained: {}'.format(user.email))
# #             app.logger.info('Form validated, logging in user: {}'.format(user.email))
# #             return create_JWT_n_redirect(user)
# #             # access_token = create_access_token(identity=user.email, fresh=True)
# #             # refresh_token = create_refresh_token(identity=user.email)
# #             #
# #             # response = make_response(redirect(url_for('NN_page')))
# #             # set_access_cookies(response, access_token)
# #             # set_refresh_cookies(response, refresh_token)
# #             # #response.headers['Authorization'] = 'Bearer {}'.format(access_token)
# #             # print(response)
# #             # return response
# #             # #return jsonify({'access_token':access_token})
# #             # #return redirect((url_for("NN_page")))
# #         app.logger.warning('Unsuccessful login attempt by user.')
# #     app.logger.info('Active Page: Login Page.')
# #     return render_template('login_page.html', active_page='Login', form=form)
#
#
#
#
#
#
# @app.route('/logged_out',methods=['GET','POST'])
# def logout_page():
#     #print("session:", session.viewitems())
#     #print(session.pop('successful_logout',False))
#     # if session.pop('successful_logout' == True:
#     #     return render_template('logout_page.html')
#     # else:
#     #    return redirect(url_for('homepage'))
#
#     if request.cookies.get('refresh_token_cookie',False):
#         app.logger.debug('Forwarding request to logout endpoint.')
#         return redirect(url_for('logout_endpoint'))
#     elif session.has_key('successful_logout'):
#         session.pop('successful_logout')
#         app.logger.info('User: {} successfully logged out.'.format(request.args['username']))
#         return render_template('logout_page.html',
#                                username=request.args.get('username','User'))
#     else:
#         app.logger.info('Unauthenticated user has attempted to reach logged out page.')
#         return redirect(url_for('homepage'))
#         #raise Exception('Shit is fucked','Cookies:',request.cookies,
#         #                'Session:', session.viewitems())
#
#
#
#
#
#
# @app.route('/NN/', methods=['GET','POST'])
# @jwt_required
# def NN_page():
#     jwt_claims = get_raw_jwt()
#     #print(jwt_claims)
#     #print('cookie keys:', request.cookies.get('refresh_token_cookie'))
#     current_user = get_jwt_identity() or None
#     app.logger.info('Active Page: NN, current user: {}'.format(current_user))
#     form = NNForm(request.form)
#     app.logger.info("Request data: {}".format(form.data))
#     app.logger.info('Form method: {}, form validate on submit: {}'.format(request.method, form.validate_on_submit()))
#     if request.method == "POST":
#         if form.validate_on_submit():
#             query_obj = NN_Query(user_email=current_user,query=form.query)
#             query_obj.save_to_db()
#             return redirect(url_for('success_NN_submission'))
#             #return "Submission successful" #redirect(url_for("success_NN_submission"))
#         # return redirect(url_for('failed_NN_submission'))
#     return render_template('NN_page.html', active_page='NN',form=form, current_user=current_user)
#
#
#
#
#
# #This function is to test jwt_optional functionality.
# @app.route('/partially-protected', methods=['GET'])
# @jwt_optional
# def partially_protected():
#     # If no JWT is sent in with the request, get_jwt_identity()
#     # will return None
#     current_user = get_jwt_identity()
#     print('current user PARTIALLY Protected:', current_user)
#     if current_user:
#         return jsonify(logged_in_as=current_user), 200
#     else:
#         return jsonify(logged_in_as='anonymous user'), 200
#
#
#
#
#
#
#
#
# # ToDo When the token expires I get an HTTP status code of 401 I can use expired_token_loader refresh token.
# @app.route('/token/refresh', methods=['GET', 'POST'])
# @jwt_refresh_token_required
# def refresh_endpoint():
#     # Create the new access token from refresh token username passed in.
#     username = request.args['username']
#     app.logger.info('refresh_endpoint.. creating new access token for user: {}'.format(username))
#     access_token = create_access_token(username)
#
#     # #Set the JWT access cookie in the response
#     response = make_response(redirect(request.args['prev_url']))
#     set_access_cookies(response, access_token)
#     app.logger.info('Created new access cookie.')
#     return response
#
#     # trouble shooting code
#     # ref_token = request.cookies.get('refresh_token_cookie')
#     # csrftoken = request.cookies.get('csrftoken')
#     # decode_ref_token = decode_token(ref_token)
#     # print('ref_token:', ref_token)
#     # print('current_user:', current_user, get_raw_jwt())
#
#
#
#
#
#
#
# @app.route('/token/remove', methods=['GET', 'POST'])
# @jwt_required
# def logout_endpoint():
#     # ToDo Still need to build the logout page.
#     # response = make_response(redirect(url_for('logout_page')))
#     app.logger.info('Endpoint: Logout')
#     verify_jwt_refresh_token_in_request()
#     current_user = get_jwt_identity()
#     app.logger.info('Current User: {}'.format(current_user))
#     response = make_response(redirect(url_for("logout_page", username=current_user)))
#     unset_jwt_cookies(response)
#     session['successful_logout'] = True
#     app.logger.info('Logging out current user: {}'.format(current_user))
#     return response
#
#
#
#
#
#
#
# @app.route('/email_confirmation/<token>')
# def confirm_email_endpoint(token):
#     app.logger.info('Endpoint: Confirm Email')
#     confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
#     email = None
#     try:
#         email = confirm_serializer.loads(token,
#                                          salt=app.config['MAIL_SALT'],
#                                          max_age=86400) #604800 is 7 days
#     except SignatureExpired:
#         print('The confirmation link has an expired signature.')
#         app.logger.error('The confirmation link has an expired signature.')
#         flash('The confirmation link is invalid or has expired.',category='error')
#         redirect(url_for('login_page'))
#
#     except BadTimeSignature:
#         print('The token has expired. The token is only valid for {}'.format(email.max_age))
#         app.logger.error('The token has expired. The token is only valid for {}'.format(email.max_age))
#
#
#     user = Users.query.filter_by(email=email).first()
#
#     print('Confirming email for {}'.format(user.email))
#     app.logger.error('confirming email for: {}'.format(user.email))
#     if user.email_confirmed:
#         print('User {} has already confirmed his email'.format(user.email))
#         app.logger.warning('User {} has already confirmed his email'.format(user.email))
#         flash('User {} has already confirmed his email'.format(user.email), category='info')
#         #ToDo I need to create a already confirmed email page.
#         return redirect(url_for('login_page'))
#     else:
#         user.email_confirmed = True
#         user.email_confirmed_on = datetime.now()
#         user.save_to_db()
#         print('Email has been successfully confirmed for {}'.format(user.email))
#         app.logger.info('Email has been successfully confirmed for {}'.format(user.email))
#         flash('Thank you for confirming your email!',category='message')
#         return create_JWT_n_redirect(user, 'homepage')
#
#     redirect(url_for('homepage'))
#
#
#
#
#
#
#
# @app.errorhandler(404)
# def not_found_error(error):
#     #ToDo need to create this html page
#     app.logger.warning('User accessed a page that does not exist, 404')
#     return jsonify(Error=404, msg='Page Not Found.'), 404
#
#
# @app.errorhandler(500)
# def not_found_error(error):
#     #ToDo need to create this html page
#     app.logger.warning('There was a server error, 500')
#     return jsonify(Error=500, msg='Server Error.'), 500
#
#
#
# @app.route('/submission-successful')
# def success_NN_submission():
#     return "The submitted structure has been accepted by the neural net. " \
#            "You will receive an email with the results upon completion. "
#
#
#
# @app.route('/submission-failed')
# def failed_NN_submission():
#     return "The submitted structure was not accepted by the neural network. " \
#            "This is most likely due to a syntax or formatting error. Please " \
#            "try again."
#
#
#
