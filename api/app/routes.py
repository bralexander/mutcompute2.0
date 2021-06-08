import os
import flask
import flask_sqlalchemy
import flask_praetorian
import flask_cors

from app import app
from app.email import send_password_reset_email
from app.models import User
from flask_login import current_user, login_user

db = flask_sqlalchemy.SQLAlchemy()
# guard = flask_praetorian.Praetorian()
cors = flask_cors.CORS()


# A generic user model that might be used by an app powered by flask-praetorian
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.Text, unique=True)
#     #email = db.Column(db.Text, unique=True)
#     password = db.Column(db.Text)
#     roles = db.Column(db.Text)
#     is_active = db.Column(db.Boolean, default=True, server_default='true')

#     @property
#     def rolenames(self):
#         try:
#             return self.roles.split(',')
#         except Exception:
#             return []

#     @classmethod
#     def lookup(cls, email):
#         return cls.query.filter_by(email=email).one_or_none()

#     @classmethod
#     def identify(cls, id):
#         return cls.query.get(id)

#     @property
#     def identity(self):
#         return self.id

#     def get_reset_password_token(self, expires_in=600):
#         return guard.encode_jwt_token(self.id, override_access_lifespan=None, override_refresh_lifespan=None, bypass_user_check=False, is_registration_token=False, is_reset_token=False)
#         # (
#         #     {'reset_password': self.id, 'exp': time() + expires_in},
#         #     app.config['SECRET_KEY'], algorithm='HS256')

#     @staticmethod
#     def verify_reset_password_token(token):
#         try:
#             id = guard.read_token(token)
#             # , app.config['SECRET_KEY'],
#             #                 algorithms=['HS256'])['reset_password']
#         except:
#             return
#         return User.query.get(id)

#     def is_valid(self):
#         return self.is_active


# Initialize flask app for the example
# app = flask.Flask(__name__)
# app.debug = True
# app.config['SECRET_KEY'] = 'top secret'
# app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
# app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}

# # Initialize the flask-praetorian instance for the app
#guard.init_app(app, User)

# # Initialize a local database for the example
# app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.getcwd(), 'database.db')}"
# db.init_app(app)

# # Initializes CORS so that the api_tool can talk to the example app
# cors.init_app(app)

# Add users for the example
## if this isn't here, db doesn't recognize login
# with app.app_context():
#     db.create_all()
#     if db.session.query(User).filter_by(email='danny.diaz@utexas.edu').count() < 1:
#         db.session.add(User(
#           email='danny.diaz@utexas.edu',
#           password=guard.hash_password('smokesmoke'),
#           roles='admin'
#             ))
#     db.session.commit()


# Set up some routes for the example
@app.route('/api/')
def home():
    return {"Hello": "World"}, 200

  
@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"username":"Yasoob","password":"strongpassword"}'
    """
    req = flask.request.get_json(force=True)
    print(req)
    email = req.get('email', None)
    password = req.get('password', None)
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
    #if user is None or not guard.authenticate(email, password):
        ret = {'Invalid username or password'}, 418
    # ret = {'access_token': guard.encode_jwt_token(user)}, 200
    return ret


@app.route('/api/register', methods=['POST'])
def register():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST \
         -d '{"email":"Yasoob","password":"strongpassword"}'
    """
    req = flask.request.get_json(force=True)
    print(req)
    email = req.get('email', None)
    first_name = req.get('first', None)
    last_name = req.get('last', None)
    organization = req.get('org', None)
    password = req.get('password', None)
    print(req)

    if db.session.query(User).filter_by(email=email).count() >= 1:
        message={'There is already an account associated with that email': email}, 418
        #prefer not to return object
    else:
        message = {'Welcome': first_name}, 200
        user = User(email=email, first_name=first_name, last_name=last_name, organization=organization)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
    # guard.send_registration_email(email, user=User, template=None, confirmation_sender=None, confirmation_uri=None, subject=None, override_access_lifespan=None)
    #should we log user in automatically?
    
    return message
  
@app.route('/api/refresh', methods=['POST'])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    .. example::
       $ curl http://localhost:5000/api/refresh -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    print("refresh request")
    old_token = flask.request.get_data()
    # new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}
    return ret, 200
  

@app.route('/api/nn', methods=['POST'])
def nn ():
    req = flask.request.get_data()
    if isinstance(req, str):
        message = 'string'
        print(req)
    else:
        message = 'file'
        print(req)
    return message


@app.route('/api/protected')
@flask_praetorian.auth_required
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return {'message': f'protected endpoint (allowed user {flask_praetorian.current_user().email})'}

@app.route('/api/forgot', methods=['GET', 'POST'])
def reset_password_request():
    req = flask.request.get_json(force=True)
    #print(req)
    email = req.get('email', None)
    if db.session.query(User).filter_by(email=email).count() >= 1:
        # guard.send_reset_email(email, template=None, reset_sender=None, reset_uri=None, subject=None, override_access_lifespan=None)
       # send_password_reset_email(email)
        message={'email sent to': email}
    else:
        message={'something went wrong'}
    return message


@app.route('/api/reset/<token>', methods=['GET', 'POST'])
def reset_password(token):
    user = User.verify_reset_password_token(token)
    req = flask.request.get_json(force=True)
    if user:
        user.set_password(req.password)
        db.session.commit()
        message={'password reset for': user}

    return message, 200
    

# Run the example
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)