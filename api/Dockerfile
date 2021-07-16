FROM python:slim

LABEL maintainer="Brad Alexander"

RUN useradd mutcompute

WORKDIR /home/mutcompute

COPY . /home/mutcompute

ENV FLASK_APP api.py

RUN chown -R mutcompute:mutcompute /home/mutcompute && \
    chmod +x ./entry.sh && \
    pip install -r requirements.txt

USER mutcompute

EXPOSE 5000

ENTRYPOINT [ "./entry.sh" ]




# RUN pip install -r requirements.txt
# #should be moved to req.txt


# COPY api.py config.py email.sh entry.sh ./

# RUN chmod +x boot.sh


