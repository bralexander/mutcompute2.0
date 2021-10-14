import os

basedir = os.path.abspath(os.path.dirname(__file__))

mail_secret_key = os.urandom(24)
mail_salt       = os.urandom(24)

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'

    JWT_ACCESS_LIFESPAN  = {'hours': 1}
    JWT_REFRESH_LIFESPAN = {'hours': 12}

    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os. environ["DB_URI"]}' or \
        'sqlite:///' + os.path.join(basedir, 'Protein_NN.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SECRET_KEY = mail_secret_key
    MAIL_SALT       = mail_salt

    SES_EMAIL_HOST      = os.environ["SES_EMAIL_HOST"] 
    SES_EMAIL_PORT      = os.environ["SES_EMAIL_PORT"] 
    SES_SMTP_USERNAME   = os.environ["SES_SMTP_USERNAME"] 
    SES_SMTP_PASSWORD   = os.environ["SES_SMTP_PASSWORD"] 
    