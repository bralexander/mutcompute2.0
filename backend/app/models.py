from sqlalchemy.sql.schema import DefaultClause
import jwt
#import pandas as pd

from app import db, login, app
from time import time
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

from sqlalchemy.schema import CheckConstraint
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt

# pdb db
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, FileField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email, EqualTo, length, Regexp, Optional


bcrypt = Bcrypt()

# guard = flask_praetorian.Praetorian()

# helps Flask-Login load a user
@login.user_loader
def load_user(id):
    return Users.query.get(int(id))

class Users(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, unique=True)
    first_name = db.Column(db.String(length=255))
    last_name = db.Column(db.String(length=255))
    organization = db.Column(db.Text)
    password = db.Column(db.String(128))
    registered_on = db.Column(db.DateTime, nullable=False, default=datetime.now())
    confirmation_link_sent_on = db.Column(db.DateTime, nullable=True)
    email_confirmed = db.Column(db.Boolean, nullable=True, default=False)
    email_confirmed_on = db.Column(db.DateTime, nullable=True)
    queries = db.relationship("NN_Query",backref="user", lazy='dynamic')

# init function not working/ not needed?
    def __init__(self, first_name, last_name,email,password,organization, confirmation_link_sent_on=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode()
        self.registered_on = datetime.now()
        self.organization = organization
        self.confirmation_link_sent_on = confirmation_link_sent_on
        self.email_confirmed = False
        self.email_confirmed_on = None

    def __repr__(self):
        return '<User {}>'.format(self.email)

    @classmethod
    def lookup(cls, username):
        """
        *Required Method*

        flask-praetorian requires that the user class implements a ``lookup()``
        class method that takes a single ``username`` argument and returns a user
        instance if there is one that matches or ``None`` if there is not.
        """
        return cls.query.filter_by(email=username).one_or_none()

    @classmethod
    def identify(cls, id):
        """
        *Required Method*

        flask-praetorian requires that the user class implements an ``identify()``
        class method that takes a single ``id`` argument and returns user instance if
        there is one that matches or ``None`` if there is not.
        """
        return cls.query.get(id)

    @property
    def identity(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has an ``identity`` instance
        attribute or property that provides the unique id of the user instance
        """
        return self.id

    
    @property
    def rolenames(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``rolenames`` instance
        attribute or property that provides a list of strings that describe the roles
        attached to the user instance
        """
        try:
            return 'protein-engineer'
        except Exception:
            return []

    #hashed password
    def set_password(self, password):
        self.password = generate_password_hash(password)
        

    # def check_password(self, password):
    #     return check_password_hash(self.password, password)
        


    def get_login_token(self, expires_in=1800):
        return jwt.encode({'access_token': self.id, 'exp': time() + expires_in},
            app.config['SECRET_KEY'], algorithm='HS256')

    def get_reset_password_token(self, expires_in=600):
        return jwt.encode(
            {'reset_password': self.id, 'exp': time() + expires_in},
            app.config['SECRET_KEY'], algorithm='HS256')

    @staticmethod
    def verify_reset_password_token(token):
        try:
            id = jwt.decode(token, app.config['SECRET_KEY'],
                            algorithms=['HS256'])['reset_password']
        except:
            return
        return Users.query.get(id)

    # Mutcompute model
    # def __repr__(self):
    #     return '<User %s %s <%s> from %s>' % \
    #            (self.first_name, self.last_name, self.email, self.organization)


    def encode_auth_token(self, user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(days=0,minutes=30,seconds=0),
                'iat': datetime.utcnow(),
                'sub': user_id
            }

            return jwt.encode(payload=payload,
                              key=app.config.get('JWT_SECRET_KEY'),
                              algorithm='HS256'
                              )

        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Validates the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token,key=app.config.get('JWT_SECRET_KEY'))
            return payload['sub']

        except jwt.ExpiredSignatureError:
            return "Signature Expired. Please login again."

        except jwt.InvalidTokenError:
            return "Invalid Token. Please login again."


    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        app.logger.info('Successfully saved to DB.')


    def check_pw(self,form_pw):
        return bcrypt.check_password_hash(self.password, form_pw)


    def check_user_confirmed(self):
        app.logger.info('check if user confirmed: {}'.format(self.email_confirmed))
        return self.email_confirmed


    def confirm_email(self):
        self.email_confirmed = True
        self.save_to_db()
        app.logger.info('Email confirmed and updated DB: {}'.format(self.email_confirmed))
        return self.email_confirmed


    def send_confirmation_email(self):
        if SES_email_confirmation(user_email=self.email):
            app.logger.info('successfully sent email confirmation link to : {}'.format(self.email))
            return True

        

@login.user_loader
def load_user(id):
    return Users.query.get(int(id))

# PDB DB
class NN_Query(db.Model):

    __tablename__ = "NN_Query"

    id= db.Column(db.Integer,primary_key=True)
    #ToDo I need to assign the time stamp in the init not as class variable.
    user_email = db.Column(db.Integer, db.ForeignKey(Users.email))
    pdb_query = db.Column(db.String(length=8),nullable=True)
    query_time = db.Column(db.DateTime, index=True, nullable=False)
    query_inf = db.Column(db.Text(4294000000), nullable=True)
    query_email_sent = db.Column(db.Boolean, default=False)



    __table_args__ = CheckConstraint('NOT(pdb_query IS NULL AND query_inf IS NULL)'),


    def __init__(self,user_email,pdb_query,query_inf,query=None, inference=None):
        self.user_email = user_email
        #self.pdb_query = pdb_query
        self.pdb_query = query
        self.query_time = datetime.now()
        self.query_inf = query_inf
        # try:
        #     self.query_inf = inference.to_json(orient='index')
        # except Exception:
        #     app.logger.warning('Unable to generate inference json for {}'.format(self.pdb_query))

        # if isinstance(inference,pd.DataFrame):
        #     app.logger.info('Inference Data frame was passed in as parameter for PDB {}'.format(self.pdb_query))
        #     self.query_inf = inference.to_json(orient='index')


    def __repr__(self):
        return "<NN_Query {}>".format(self.pdb_query)

    ##  need function that gets query_inf based on pdb_id(pdb_query?)
    def get_csv(self):
        return self.query_inf

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        app.logger.info('Successfully saved query: {0} from user: {1} to DB'.format(self.pdb_query, self.user_email))



# class NNForm(FlaskForm):
#     #Todo The validator for email must be pulled from a sql database/JWT from the user.

#     #ToDo need to figure out the validators to use for the protein submission.
#     pdb_struct = StringField('PDB Structure', validators=[
#                                         Optional("Please provide a PDB structure."),
#                                         ])

#     cryst_struct_file = FileField("Crystal Structure File" )

#     submit = SubmitField('Submit')

#     # This allows us to only accept PDB file codes.
#     def validate(self):
#         if self.pdb_struct.data and self.cryst_struct_file.data:
#             self.cryst_struct_file.errors ="Form only accepts a PDB structure or a " \
#                                           "crystal structure file but not both.",
#             return False
#         elif self.pdb_struct.data:
#                 if len(self.pdb_struct.data) == 4:
#                     self.query = self.pdb_struct.data.upper()
#                     return True
#                 else:
#                     self.pdb_struct.errors = 'Invalid PDB ID: longer or shorter than 4 characters.',
#                     return False
#         elif self.cryst_struct_file.data:
#             self.cryst_struct_file.errors = "This feature is still in development. Sorry for the " \
#                                             "inconvenience. Please provide a PDB 4 letter code.",
#             return False
#         else:
#             return False
