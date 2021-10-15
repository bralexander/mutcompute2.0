from datetime import datetime

from sqlalchemy.schema import CheckConstraint, DefaultClause

from app import app, db, bcrypt


class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.Text, unique=True)
    first_name = db.Column(db.String(length=255))
    last_name = db.Column(db.String(length=255))
    organization = db.Column(db.Text)
    password = db.Column(db.String(128))
    registered_on = db.Column(db.DateTime, nullable=False, default=datetime.now())
    confirmation_link_sent_on = db.Column(db.DateTime, nullable=True)
    email_confirmed = db.Column(db.Boolean, nullable=True, default=False)
    email_confirmed_on = db.Column(db.DateTime, nullable=True)
    queries = db.relationship("NN_Query",backref="user", lazy='dynamic')


    def __init__(self, first_name, last_name,email,password,organization, confirmation_link_sent_on=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.registered_on = datetime.now()
        self.organization = organization
        self.confirmation_link_sent_on = confirmation_link_sent_on
        self.email_confirmed = False
        self.email_confirmed_on = None


    def __repr__(self):
        return f'User({self.email, self.organization})'

    @classmethod
    def lookup(cls, username):
        """
        *Required Method*

        flask-praetorian requires that the user class implements a ``lookup()``
        class method that takes a single ``username`` argument and returns a user
        instance if there is one that matches or ``None`` if there is not.
        """
        return cls.query.filter_by(email=username).one_or_none()

    @classmethod
    def identify(cls, id):
        """
        *Required Method*

        flask-praetorian requires that the user class implements an ``identify()``
        class method that takes a single ``id`` argument and returns user instance if
        there is one that matches or ``None`` if there is not.
        """
        return cls.query.get(id)

    @property
    def identity(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has an ``identity`` instance
        attribute or property that provides the unique id of the user instance
        """
        return self.id

    
    @property
    def rolenames(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``rolenames`` instance
        attribute or property that provides a list of strings that describe the roles
        attached to the user instance
        """
        try:
            return 'protein-engineer'
        except Exception:
            return []

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.save_to_db()
        return True
        

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)


    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        app.logger.info('Successfully saved to DB.')


    def confirm_email(self):
        self.email_confirmed = True
        self.email_confirmed_on = datetime.now()
        self.save_to_db()
        return self.email_confirmed
        


class NN_Query(db.Model):

    __tablename__ = "NN_Query"

    id= db.Column(db.Integer,primary_key=True)
    #ToDo I need to assign the time stamp in the init not as class variable.
    user_email = db.Column(db.Integer, db.ForeignKey(Users.email))
    pdb_query = db.Column(db.String(length=8),nullable=True)
    query_time = db.Column(db.DateTime, index=True, nullable=False)
    query_inf = db.Column(db.Text(4294000000), nullable=True)
    query_email_sent = db.Column(db.Boolean, default=False)

    __table_args__ = CheckConstraint('NOT(pdb_query IS NULL AND query_inf IS NULL)'),


    def __init__(self,user_email,pdb_query,query_inf):
        self.user_email = user_email
        self.pdb_query = pdb_query
        self.query_time = datetime.now()
        self.query_inf = query_inf


    def __repr__(self):
        return "<NN_Query {}>".format(self.pdb_query)

    ##  need function that gets query_inf based on pdb_id(pdb_query?)
    def get_csv(self):
        return self.query_inf

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
