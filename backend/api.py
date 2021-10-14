from app import app, db
from app.models import Users


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Users': Users}


if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)