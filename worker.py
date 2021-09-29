from celery import Celery
from os import environ

from scripts.run import gen_ensemble_inference


CELERY_BROKER_URL= environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

# Initialize Celery
def make_celery():
    # app = app or create_app()
    celery = Celery(
        "nn_app",
        # backend=nn_app.config.get('CELERY_SQLITE_BACKEND_URI', 'db+sqlite:///../data/celery.sqlite'),
        # backend="redis://localhost:6379/0",
        broker=CELERY_BROKER_URL,
        backend=CELERY_RESULT_BACKEND,
        include=['api.task']           # Making sure this line was right is how I got Celery to work with DC
    )

    # celery.conf.update(nn_app.config)
    # class ContextTask(celery.Task):
    #     def __call__(self, *args, **kwargs):
    #         with nn_app.app_context():
    #             return self.run(*args, **kwargs)

    # celery.Task = ContextTask

    return celery

veggies = make_celery()
