import json
import sys
import requests
import pandas as pd
from datetime import datetime

from flask import request, redirect, url_for
from flask_praetorian import auth_required, current_user
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature

from app import app, db, guard
from app.email import send_email_confirmation, send_password_reset_email
from app.models import Users, NN_Query




# Set up some routes for the example
@app.before_request
def before_request():
    print(request.headers, file=sys.stderr)


@app.route('/api/')
def home():
    return {"Hello": "World"}, 200

  
@app.route('/api/login', methods=['POST'])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    .. example::
       $ curl http://localhost:5000/api/login -X POST 
         -d '{"username":"Yasoob","password":"strongpassword"}'
    """
    req = request.get_json(force=True)
    email = req.get('email', None)
    password = req.get('password', None)
    user = guard.authenticate(email, password)
    print(f"User praetorian: {user}", file=sys.stderr)
    if user is None or not user.check_pw(password):
        ret = {'Invalid username or password for': user.email}, 418
    else:
        token = guard.encode_jwt_token(user)
        ret = {'access_token': token}, 200
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
    req = request.get_json(force=True)

    print(req, file=sys.stderr)

    email = req.get('email', None)
    first_name = req.get('first', None)
    last_name = req.get('last', None)
    organization = req.get('org', None)
    password = req.get('password', None)
    user = Users.query.filter_by(email=email).count()

    if user > 0 and user.email_confirmed:
            return {'Email Status': "email already confirmed"}, 418

    # Add to database or overwrite if user is already present but not confirmed.
    user = Users(email=email, password=password, first_name=first_name, last_name=last_name, organization=organization)
    user.save_to_db()

    if send_email_confirmation(user.email):
        return {'Email Status': "Sent"}, 200
    
    return {'Email Status': "Failed to send"}, 500

  

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
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}, 200
    return ret
  

@app.route('/api/nn', methods=['POST'])
@auth_required
def nn():
    payload = {
        "username": current_user().email,
        "pdb_code": json.loads(request.get_data())
    }

    response = requests.post('http://nn_api:8000/inference', json=payload)

    return response.json(), response.status_code


@app.route('/api/fetch_predictions', methods=['POST'])
@auth_required
def fetch_pdb_predictions():

    pdb_id = json.loads(request.get_data())
    exist = NN_Query.query.filter_by(pdb_query=pdb_id).count()

    if exist:
        db_row = NN_Query.query.filter_by(pdb_query=pdb_id).first()

        df = pd.DataFrame.from_dict(json.loads(db_row.query_inf)).T
        csv = df.to_csv()

        resp = {'pdb': pdb_id, 'predictions': csv}, 200

    else:
        resp = {'pdb': pdb_id, 'predictions': None}, 400

    return resp


@app.route('/api/forgot', methods=['GET', 'POST'])
def forgot():
    req = request.get_json(force=True)
    email = req.get('email', None)
    user = Users.query.filter_by(email=email).first()
    print('****User:', user)
    if user is not None:
        print('user is not none')
        send_password_reset_email(user)
        message={'email sent to': email}, 200
    else:
        #should send an error email saying that the email does not exist in db
        send_failure_email(email)
        message={'email sent to': email}, 418
        
        
    return message


@app.route('/api/reset/<token>', methods=['GET', 'POST'])
def reset_password(token):
    
    user = Users.verify_reset_password_token(token)
    print(user, token)
    req = request.get_json(force=True)
    new_password = req.get('password', None)
    print(new_password)
    if user:
        #should also make sure password is not the same
        user.set_password(new_password)
        db.session.add(user)
        db.session.commit()
        message={'password reset for': user.email}, 200
    else:
        message= {'invalid token': None }, 418
    return message



@app.route('/email_confirmation/<token>')
def confirm_email(token):
    confirm_serializer = URLSafeTimedSerializer(app.config['MAIL_SECRET_KEY'])
    email = None
    try:
        email = confirm_serializer.loads(token,
                                         salt=app.config['MAIL_SALT'],
                                         max_age=86400) #604800 is 7 days

    except SignatureExpired:
        #TODO work with brad to see what he wants to do here.
        print('The confirmation link has an expired signature.')
        return {'access_token': None}, 400
        # redirect(url_for('login'))

    except BadTimeSignature:
        #TODO work with brad to see what he wants to do here.
        print('The token has expired. The token is only valid for {}'.format(email.max_age))
        return {'access_token': None}, 400
        # redirect(url_for('login'))

    else:
        user = Users.query.filter_by(email=email).first()

        print(f'Confirming email for {user.email}')

        if user.email_confirmed:
            print(f'User {user.email} has already confirmed his email')
            
        else:
            user.confirm_email()
            print(f'Email has been successfully confirmed for {user.email}')

        token = guard.encode_jwt_token(user.email)
        return {'access_token': token}, 200
    