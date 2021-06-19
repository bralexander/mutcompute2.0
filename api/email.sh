#!/bin/bash

source venv/bin/activate

export MAIL_SERVER=localhost

export MAIL_PORT=802

python -m smtpd -n -c DebuggingServer localhost:8025