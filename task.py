from scripts.run import gen_ensemble_inference


def run_mutcompute(pdb_code, dir='/mutcompute/data/pdb_files', out_dir='/mutcompute/data/inference_CSVs', fs_pdb=False):

    gen_ensemble_inference(pdb_code, dir='../data/pdb_files', out_dir='../data/inference_CSVs', fs_pdb=False)