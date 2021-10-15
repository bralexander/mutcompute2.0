from os import environ, urandom

mail_secret_key = urandom(24)
mail_salt       = urandom(24)

class Config(object):
    SECRET_KEY = environ.get('SECRET_KEY') or 'you-will-never-guess'

    JWT_ACCESS_LIFESPAN  = {'hours': 1}
    JWT_REFRESH_LIFESPAN = {'hours': 12}

    SQLALCHEMY_DATABASE_URI = f'sqlite:///{ environ["DB_URI"]}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SECRET_KEY = mail_secret_key
    MAIL_SALT       = mail_salt

    SES_EMAIL_HOST      = environ["SES_EMAIL_HOST"] 
    SES_EMAIL_PORT      = environ["SES_EMAIL_PORT"] 
    SES_SMTP_USERNAME   = environ["SES_SMTP_USERNAME"] 
    SES_SMTP_PASSWORD   = environ["SES_SMTP_PASSWORD"] 
    