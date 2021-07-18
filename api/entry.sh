#!/bin/bash
# source venv/bin/activate
# flask db upgrade
#yarn start-api
# flask translate compile
exec gunicorn -b :5000 api:app