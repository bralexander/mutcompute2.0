import os
basedir = os.path.abspath(os.path.dirname(__file__))
# load_dotenv = os.path.join(basedir, '.env')

class Config(object):
    # SERVER_NAME = 'localhost:5000'
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'

    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Setup for email server
    SES_EMAIL_HOST = os.environ.get('SES_EMAIL_HOST')
    SES_EMAIL_PORT = os.environ.get('SES_EMAIL_PORT')
    SES_SMTP_USERNAME = os.environ.get("SES_SMTP_USERNAME")
    SES_SMTP_PASSWORD = os.environ.get("SES_SMTP_PASSWORD")
    