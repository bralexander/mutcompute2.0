from app import db, login
import flask_praetorian
from time import time
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


# guard = flask_praetorian.Praetorian()

# helps Flask-Login load a user
@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, unique=True)
    first_name = db.Column(db.String(length=255))
    last_name = db.Column(db.String(length=255))
    organization = db.Column(db.Text)
    password_hash = db.Column(db.String(128))
    
    #username = db.Column(db.Text, unique=True)
    # password = db.Column(db.Text)
    #is_active = db.Column(db.Boolean, default=True, server_default='true')

    # @property
    # def rolenames(self):
    #     try:
    #         return self.roles.split(',')
    #     except Exception:
    #         return []

    @classmethod
    def lookup(cls, email):
        return cls.query.filter_by(email=email).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # def get_reset_password_token(self, expires_in=600):
    #     return guard.encode_jwt_token(self.id, override_access_lifespan=None, override_refresh_lifespan=None, bypass_user_check=False, is_registration_token=False, is_reset_token=False)
    #     # (
    #     #     {'reset_password': self.id, 'exp': time() + expires_in},
    #     #     app.config['SECRET_KEY'], algorithm='HS256')

    # @staticmethod
    # def verify_reset_password_token(token):
    #     try:
    #         id = guard.read_token(token)
    #         # , app.config['SECRET_KEY'],
    #         #                 algorithms=['HS256'])['reset_password']
    #     except:
    #         return
    #     return User.query.get(id)

    # def is_valid(self):
    #     return self.is_active

    def __repr__(self):
        return '<User {}>'.format(self.email)