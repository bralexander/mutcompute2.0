import os
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv = os.path.join(basedir, '.env')

class Config(object):
    # SERVER_NAME = 'localhost:5000'
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'

    JWT_ACCESS_LIFESPAN  = {'hours': 1}
    JWT_REFRESH_LIFESPAN = {'hours': 12}

    SQLALCHEMY_DATABASE_URI = f'sqlite:///{os. environ["DB_URI"]}' or \
        'sqlite:///' + os.path.join(basedir, 'Protein_NN.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Setup for email server
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 25)
    # MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
    # MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    # MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    ADMINS = ['your-email@example.com']
    