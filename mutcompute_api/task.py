from celery import Celery
from os import environ

from scripts.run import gen_ensemble_inference


CELERY_BROKER_URL= environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")


celery = Celery('task', broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)

@celery.task(name='task.run_mutcompute')
def run_mutcompute(pdb_code, dir='/mutcompute/data/pdb_files', out_dir='/mutcompute/data/inference_CSVs', fs_pdb=False):

    df = gen_ensemble_inference(pdb_code, dir=dir, out_dir=out_dir, fs_pdb=fs_pdb)

    print(df)

    return  df.to_json(orient='index')
