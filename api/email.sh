#!/bin/bash

source venv/bin/activate

python -m smtpd -n -c DebuggingServer localhost:8025