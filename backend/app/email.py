import sys
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase

from flask import render_template, url_for
from itsdangerous import URLSafeTimedSerializer

from app import app


def send_email_confirmation(user_email='danny.jesus.diaz.94@gmail.com',
                           html_template='email_confirmation.html'):
                           
    subject = 'MutCompute email confirmation'
    sender_email = "no-reply@mutcompute.com"

    confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    token = confirm_serializer.dumps(user_email, salt=app.config['MAIL_SALT'])

    # TODO rewrite this line so it does not default to backend:5000
    confirm_url = f"http://localhost:3000{url_for('confirm_email', token=token)}" 

    html = render_template(html_template, confirm_url=confirm_url)

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = sender_email
    msg['To'] = str(user_email)

    html_mime = MIMEText(html, 'html')

    msg.attach(html_mime)

    server = smtplib.SMTP(app.config['SES_EMAIL_HOST'])
    server.connect(app.config['SES_EMAIL_HOST'], app.config['SES_EMAIL_PORT'])
    server.starttls()
    server.login(app.config["SES_SMTP_USERNAME"], app.config["SES_SMTP_PASSWORD"])

    print("Confirmation url: ", confirm_url, file=sys.stderr)

    try:
        server.sendmail(sender_email, user_email, msg.as_string())

    except Exception as e:
        print(f'Error in sending confirmation email to user: {user_email}')
        server.quit()
        return False

    server.quit()
    print('Sent email')
    return True


def send_password_reset_email(user_email):
    pass
#     send_email('[Mutcompute] Reset Your Password',
#                sender=app.config['ADMINS'][0],
#                recipients=[email],
#                text_body=render_template('user_not_exist.txt'),
#                html_body=render_template('user_not_exist.html')
#     )
