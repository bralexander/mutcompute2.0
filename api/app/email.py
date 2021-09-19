from flask_mail import Message
from flask import render_template, url_for
from app import mail, app
from threading import Thread
from app.models import User
from itsdangerous import URLSafeTimedSerializer

import smtplib
import email.utils
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase

import os
from os import getcwd

## Working with python emulated mail server
    # (venv) $ python -m smtpd -n -c DebuggingServer localhost:8025

# def send_async_email(app, msg):
#     with app.app_context():
#         mail.send(msg)

def send_email(subject, sender, recipients, text_body, html_body):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    mail.send(msg)
    #Thread(target=send_async_email, args=(app, msg)).start()

def send_password_reset_email(user):
    token = user.get_reset_password_token()
    #.decode('utf-8')
    send_email('[Mutcompute] Reset Your Password',
               sender=app.config['ADMINS'][0],
               recipients=[user.email],
               text_body=render_template('reset_pass.txt',
                                         user=user, token=token),
               html_body=render_template('reset_pass.html',
                                         user=user, token=token)
            )

def send_failure_email(email):
    send_email('[Mutcompute] Reset Your Password',
               sender=app.config['ADMINS'][0],
               recipients=[email],
               text_body=render_template('user_not_exist.txt'),
               html_body=render_template('user_not_exist.html')
    )


# SES EMAIL TOOLS
#@veggies.task
def SES_email_confirmation(user_email='bralexander@live.com',
                           html_template='email_confirmation_2.html'):
    subject = 'mutCompute_Email_Confirmation'
    sender_email = "no-reply@mutcompute.com"

    print(app.config['SES_EMAIL_HOST'])

    #confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    # token = confirm_serializer.dumps(user_email, salt=app.config['MAIL_SALT'])
    # confirm_url = url_for('confirm_email_endpoint', token=token, _external=True)
    # print(confirm_url)
    # html = render_template(html_template, confirm_url=confirm_url)

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = sender_email
    msg['To'] = str(user_email)

    #html_mime = MIMEText(html, 'html')
    #msg.attach(html_mime)

    #server = smtplib.SMTP("paste SES_EMAIL_HOST", "paste SES_EMAIL_PORT")
    server = smtplib.SMTP(app.config['SES_EMAIL_HOST'])
    #server = smtplib.SMTP(app.config['SES_EMAIL_HOST'], app.config['SES_EMAIL_PORT'])
    print(app.config['SES_EMAIL_HOST'])
    server.connect(app.config['SES_EMAIL_HOST'], app.config['SES_EMAIL_PORT'])
    #server.connect()
    server.ehlo()
    server.starttls()
    server.ehlo()
    #server.login("paste SES_SMTP_USERNAME", "paste SES_SMTP_PASSWORD")
    server.login(app.config["SES_SMTP_USERNAME"], app.config["SES_SMTP_PASSWORD"])

    try:
        server.sendmail(sender_email, user_email, 'hi')
        app.logger.info('Sent confirmation email to user: {0}'.format(user_email))
    except Exception as e:
        app.logger.error('Error in sending confirmation email to user: {0}'. \
                         format(user_email))
        server.quit()
        return False
    server.quit()
    print('Sent email')
    return True




def send_confirmation_email(user_email='danny.jesus.diaz.94@gmail.com',
                            subject='NN Web App email',
                            html_template='email_confirmation_2.html'):
    confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    # token = confirm_serializer.dumps(user_email,salt=app.config['MAIL_SALT'])
    # confirm_url = url_for('confirm_email_endpoint',token=token, _external=True)
    #print(confirm_url)
    #html = render_template(html_template,confirm_url=confirm_url)

    send_email(subject,
               [user_email,app.config['MAIL_DEFAULT_SENDER']],
               #text_body=confirm_url,
               #html_body=html
               )

    #mj_send_email(recipient=user_email,html_body=html)