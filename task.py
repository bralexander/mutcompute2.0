from api import celery
from scripts.run import gen_ensemble_inference

from worker import veggies 


@veggies.task
def run_mutcompute(pdb_code, dir='/mutcompute/data/pdb_files', out_dir='/mutcompute/data/inference_CSVs', fs_pdb=False):

    df = gen_ensemble_inference(pdb_code, dir=dir, out_dir=out_dir, fs_pdb=fs_pdb)

    print(df)

    return df
