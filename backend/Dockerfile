FROM python:slim

LABEL maintainer="Brad Alexander"

<<<<<<< HEAD:backend/Dockerfile
SHELL ["/bin/bash", "-c"]

COPY . /app/

WORKDIR /app

ENV FLASK_APP api.py

RUN pip install -r requirements.txt

# RUN useradd mutcompute

# USER mutcompute
=======
COPY . /app/

WORKDIR /app

ENV FLASK_APP api.py

RUN pip install -r requirements.txt

>>>>>>> upstream/dev-models:api/Dockerfile.api

EXPOSE 5000


# cannot use with mounted containers?
# ENTRYPOINT [ "./entry.sh" ]


# RUN pip install -r requirements.txt
# #should be moved to req.txt


# COPY api.py config.py email.sh entry.sh ./

# RUN chmod +x boot.sh


