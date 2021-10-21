import argparse 
import pandas as pd
from pathlib import Path

from app.models import NN_Query


def update_predictions(pdb_id: str, csv: Path=Path('')):

        if csv.is_file() and csv.suffix == ".csv":
                query_inf = pd.read_csv(csv, index_col=0).to_json(orient='index')

        else:
                print(f'Prediction file is invalid.')
                return None

        count = NN_Query.query.filter(NN_Query.pdb_query.like(pdb_id)).count()
        if count > 0:
                print(f'Predictions for PDB id: {pdb_id} exist {count} times. Inserting new csv data.')

                rows = NN_Query.query.filter(NN_Query.pdb_query.like(pdb_id)).all()

                for row in rows:
                        row.query_inf = query_inf 
                        row.save_to_db()
        else:
                print(f'Predictions for PDB id: {args.pdb_id} is not present in the NN_Query table.')
        
        return None




if __name__=="__main__":

        parser =  argparse.ArgumentParser(
                description="Manually update predictions for a PDB id."
        )

        required =  parser.add_argument_group("Required Arguments")
        required.add_argument("--pdb-id", type=str, required=True)
        required.add_argument("--pred-csv", type=Path, required=False)

        args = parser.parse_args()
        
        print(args)

        assert len(args.pdb_id)==4, "PDB id argument is not 4 characters."

        update_predictions(args.pdb_id, args.pred_csv)
       
