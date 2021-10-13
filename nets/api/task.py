from os import environ
from pathlib import Path
from datetime import datetime

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase

from celery import Celery
import sqlalchemy as db


from mutcompute.scripts.run import gen_ensemble_inference


CELERY_BROKER_URL= environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")


celery = Celery('task', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

db_engine = db.create_engine(f'sqlite:///{environ["DB_URI"]}')
meta_data = db.MetaData()
nn_table = db.Table(environ['DB_NN_TABLE'], meta_data, autoload=True, autoload_with=db_engine)


# TODO I can turn this into a decorator so all you have to is pass in a net function and a few parameters 
@celery.task(name='task.run_mutcompute')
def run_mutcompute(email, pdb_code, dir='/mutcompute_2020/mutcompute/data/pdb_files', out_dir='/mutcompute_2020/mutcompute/data/inference_CSVs', fs_pdb=False):

    try: 
        df = gen_ensemble_inference(pdb_code, dir=dir, out_dir=out_dir, fs_pdb=fs_pdb)

    except Exception: 
        inference_fail_email(email, pdb_code, problem='nn')
        return False

    else:
        email_status = inference_email(email, pdb_code, df)

        stmt = db.insert(nn_table).values(
            user_email=email,
            pdb_query=pdb_code,
            query_time=datetime.now(),
            query_inf=df.to_json(orient='index'),
            query_email_sent=email_status
        )

        with db_engine.connect() as conn:
            conn.execute(stmt)
            print(f'Added query {email}, {pdb_code} to the NN_Query table.')

        return True



@celery.task(name='task.inference_email')
def inference_email(user_email, pdb_code, df=None):
    '''This is an aws ses function.'''

    subject = f'mutCompute inference for {pdb_code}'
    from_name = 'no-reply@mutcompute.com'

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = from_name
    msg['To'] = user_email

    mime_text = MIMEText("Thank you for using mutCompute!")
    msg.attach(mime_text)

    tmp_dir = Path('./tmp')
    tmp_dir. mkdir(0o777, exist_ok=True, parents=True)

    csv_file = tmp_dir / f'{pdb_code}.csv'

    print("Saving DF as CSV, pwd: ", csv_file)

    if not df is None:
        df.to_csv(csv_file)

    with csv_file.open('rb') as fp:
        attachment =  MIMEBase('text', 'csv')
        attachment.set_payload(fp.read())

    attachment.add_header('Content-Disposition', "attachment", filename=f'{pdb_code}.csv')
    msg.attach(attachment)

    server = smtplib.SMTP(environ['SES_EMAIL_HOST'])
    server.connect(environ['SES_EMAIL_HOST'], environ['SES_EMAIL_PORT'])
    server.starttls()
    server.login(environ["SES_SMTP_USERNAME"], environ["SES_SMTP_PASSWORD"])

    try:
        server.sendmail(from_name, user_email, msg.as_string())
        print(f'Sent email for {pdb_code}')

    except Exception as e:
        print('Failed to send NN email.')
        server.quit()
        return False

    if csv_file.exists():
        csv_file.unlink()

    server.quit()
    print('Sent NN email')
    return True



@celery.task(name='task.inference_fail_email')
def inference_fail_email(user_email, pdb_code, problem='nn'):

    subject = f'mutCompute inference for {pdb_code} failure'
    from_name = 'no-reply@mutcompute.com'
    recipients = [user_email, 'danny.diaz@utexas.edu']

    msg = MIMEMultipart()
    msg['Subject'] = subject
    msg['FROM'] = from_name


    message = ''
    if problem =='nn':
        message = """<br>
        <p>
            Unfortunately, we ran into a problem while computing the predictions on PDB: {0}.<br>
            We have been notified of the issue and expect an email from us over the next 48 hours 
            with more details.
            <br>
            Sorry for the inconvenience.
        </p>
        """.format(pdb_code)
    elif problem =='email':
        message = """<br>
                <p>
                    There was a problem sending email to user: {} for pdb: {}. 
                    However, the NN ran successfully.
                    <br>
                </p>
                """.format(user_email, pdb_code)
    else:
        print('unknown problem exiting... Not sending email.')
        return False

    mime_html = MIMEText(message, 'html')
    msg.attach(mime_html)

    server = smtplib.SMTP(environ['SES_EMAIL_HOST'])
    server.connect(environ['SES_EMAIL_HOST'], environ['SES_EMAIL_PORT'])
    server.starttls()
    server.login(environ["SES_SMTP_USERNAME"], environ["SES_SMTP_PASSWORD"])

    try:
        if problem=='nn':
            for recipient in recipients:
                msg['To'] = recipient
                server.sendmail(from_name, recipient, msg.as_string())

        else:
            msg['To'] = recipients[1]
            server.sendmail(from_name, recipients[1], msg.as_string()) # Sending this only to me

    except Exception as e:  
        print('Failed to send NN email.')
        server.quit()
        return False


    server.quit()
    print('Sent NN failure email')
    return True
