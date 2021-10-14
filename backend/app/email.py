from flask_mail import Message
from flask import render_template
from app import app
from app.models import Users

## Working with python emulated mail server
    # (venv) $ python -m smtpd -n -c DebuggingServer localhost:8025

# def send_async_email(app, msg):
#     with app.app_context():
#         mail.send(msg)


# TODO rewrite with AWS SES
# def send_email(subject, sender, recipients, text_body, html_body):
#     msg = Message(subject, sender=sender, recipients=recipients)
#     msg.body = text_body
#     msg.html = html_body
#     mail.send(msg)
#     #Thread(target=send_async_email, args=(app, msg)).start()

def send_password_reset_email(user):
    pass
#     token = user.get_reset_password_token()
#     #.decode('utf-8')
#     send_email('[Mutcompute] Reset Your Password',
#                sender=app.config['ADMINS'][0],
#                recipients=[user.email],
#                text_body=render_template('reset_pass.txt',
#                                          user=user, token=token),
#                html_body=render_template('reset_pass.html',
#                                          user=user, token=token)
#             )

def send_failure_email(email):
    pass
#     send_email('[Mutcompute] Reset Your Password',
#                sender=app.config['ADMINS'][0],
#                recipients=[email],
#                text_body=render_template('user_not_exist.txt'),
#                html_body=render_template('user_not_exist.html')
#     )