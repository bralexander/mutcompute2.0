
import argparse 
from app.models import Users



if __name__=="__main__":
        parser =  argparse.ArgumentParser(
                description="Manually add accounts to the Users table."
        )


        required =  parser.add_argument_group("Required Arguments")
        required.add_argument("-f","--first_name", type=str, required=True)
        required.add_argument("-l","--last_name", type=str, required=True)
        required.add_argument("-e","--email", type=str, required=True)
        required.add_argument("-p","--password", type=str, required=True)
        required.add_argument("-o","--organization", type=str, required=True)
        args = parser.parse_args()

        print(args)

        user = Users(args.first_name, args.last_name, args.email, args.password,\
                args.organization)

        user.save_to_db()

        print(f'Done adding user: {args.email}')
