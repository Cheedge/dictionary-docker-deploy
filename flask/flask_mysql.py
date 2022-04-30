from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import subprocess

app = Flask(__name__)

username = "root"
password = "Mysql_666"
serverip = "192.168.149.138"
#database = "FlaskTestDB"
database = "Testdb"

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://" + username + ":" + password + "@" + serverip + "/" + database
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

db = SQLAlchemy(app)

class Netstate(db.Model):
    __tablename__ = "netstate"
    id = db.Column(db.Integer, primary_key=True)
    porto = db.Column(db.String)
    addr = db.Column(db.String)
    pid = db.Column(db.Integer)
    p_name = db.Column(db.String)

class Testtb(db.Model):
    __tablename__ = "testtb"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    
@app.route('/')
def testdb():
    try:
        sghs = Testtb.query.all()
        #return sghs[0].id
        resp = ''
        for sgh in sghs:
            resp += '<li>' + str(sgh.id) + '\t' + sgh.name + '</li>'
        return resp
        #db.session.query('1').from_statement(text('SELECT 1')).all()
        #return '<h1>It works.</h1>'
    except Exception as e:
        # see Terminal for description of the error
        print("\nThe error:\n" + str(e) + "\n")
        return '<h1>Something is broken.</h1>'

if __name__ == '__main__':
    app.run(debug=True)
