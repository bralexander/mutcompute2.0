from flask import Flask

from flask_mail import Mail
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
mail = Mail(app)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app import models

# to start an emulated server, enter into terminal $ python -m smtpd -n -c DebuggingServer localhost:8025
# set environment variables:
# $ export MAIL_SERVER=localhost
# $ export MAIL_PORT=8025