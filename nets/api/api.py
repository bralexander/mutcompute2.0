from flask import Flask, jsonify, make_response
from flask_restful import Api, Resource, reqparse

from mutcompute.scripts.run import fetch_pdb_file
from task import run_mutcompute

nn_app = Flask(__name__)
nn_api = Api(nn_app)


class InferenceAPI(Resource):

    def __init__(self):
        self.reqparse = reqparse.RequestParser()
        # Makes sure pdb_code is passed in when calling this api endpoint. it can come either through form or json. 
        # This requirement is only enforced when a POST request is sent. 
        self.reqparse.add_argument('pdb_code', type=str, required=True, help='No pdb_code provided.', location=['form','json'])
        super().__init__()

    def get(self):
        return jsonify(Result='Ready to accept PDB codes.')

    def post(self):
        args = self.reqparse.parse_args()   # This will parse arguments passed in through a form or json.
        pdb_code = args.get('pdb_code').upper().strip()
        print("PDB Code:", pdb_code)
        if len(pdb_code) == 4:

            try:
                pdb_file = fetch_pdb_file(pdb_code, dir='/mutcompute_2020/mutcompute/data/pdb_files')

                print(f'Created PDB file: ', pdb_file)

            except FileNotFoundError:
                return make_response(
                    jsonify(
                        Result=f'Unabled to retrieve PDB file from the PDB-REDO or the RCSB servers: {pdb_code.upper()}'
                    ), 
                    400
                )

            else:
                out_csv = run_mutcompute.delay(pdb_file.name, dir='/mutcompute_2020/mutcompute/data/pdb_files', out_dir='/mutcompute_2020/mutcompute/data/inference_CSVs', fs_pdb=True)
                
                return make_response(
                    jsonify(Result=f'Successfully started inference on PDB: {pdb_code}'), 
                    201
                ) 


nn_api.add_resource(InferenceAPI, '/inference', endpoint='nn_query')


if __name__=='__main__':
    nn_app.run(host='0.0.0.0', port=8000, debug=True)
