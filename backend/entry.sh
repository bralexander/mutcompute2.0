#!/bin/bash
# source venv/bin/activate
# flask db upgrade
#yarn start-api
# flask translate compile
exec gunicorn -b 0.0.0.0:5000 api:app 

# not working
# source venv/bin/activate
# exec python -m smtpd -n -c DebuggingServer localhost:8025 