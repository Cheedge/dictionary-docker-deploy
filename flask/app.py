from crypt import methods
from datetime import datetime
from urllib import request
from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
from flask_caching import Cache



app = Flask(__name__)

class Config(object):
	# slave mysql database so cannot modify data.
	SQLALCHEMY_DATABASE_URI="mysql+pymysql://root:Mysql_666@192.168.149.138:3306/Dictionary"
	SQLALCHEMY_TRACK_MODIFICATIONS=True

cache_config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "RedisCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 600,
	"CACHE_REDIS_HOST": "192.168.149.136",
	"CACHE_REDIS_PORT": "6379",
	"CACHE_REDIS_PASSWORD": "redis666"
}

# tell Flask to use the above defined config
app.config.from_mapping(cache_config)
cache = Cache(app)

# export FLASK_ENV=development
app.debug = True
app.config.from_object(Config)
db = SQLAlchemy(app)

##############################################################
# engine = create_engine("mysql+pymysql://root:Mysql_666@192.168.149.138:3306/Dictionary")

# metadata_obj = MetaData()

# user_dict = Table(user_name, metadata_obj,
#     Column('id', Integer, nullable=False, primary_key=True),
#     Column('German', String(256), nullable=False),
# 	Column('Englihs', String(256), nullable=False),
#     Column('Note', Text)
# )
# user_dict.create(engine)
##############################################################
# root dictionary
class Root_Dict(db.Model):
	# __tablename__ = "tb_root_dict"
	__tablename__ = "de_en_81683"
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	German = db.Column(db.String(256), nullable=False)
	English = db.Column(db.String(256), nullable=False)
	Note = db.Column(db.Text)

# user dictionary
class User_Dict(db.Model):
	__tablename__ = "tb_user_testdict"
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	German = db.Column(db.String(256), nullable=False)
	English = db.Column(db.String(256), nullable=False)
	Note = db.Column(db.Text)

# user database
class User(db.Model):
	__tablename__ = "user_info"
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	user_name = db.Column(db.String(32), nullable=False)
	user_password = db.Column(db.String(32), nullable=False)

@app.route("/test")
def test():
	return render_template("rememberpage.html")

@app.route("/register", methods=['POST'])
def register():
	register_form = request.form
	register_name = register_form["register_name"]
	register_password = register_form["register_password"]
	register_password_confirm = register_form["register_password_confirm"]
	if (register_password==register_password_confirm):
		db.session.add(User(user_name=register_name, user_password=register_password))
		db.session.commit()
		# user = User.query.filter(user_name=register_name).first()
		# User_Dict(user["id"]+"_"+user["user_name"])
		# class MyDict(User_Dict, db.Model):
		# 	__tablename__=user["id"]+"_"+user["user_name"]
	else:
		return "password not consistent"
	return "successfully registered"

@app.route("/login", methods=["POST"])
def login():
	# print(request.form.keys())
	login_form = request.form
	user_name = login_form["user_name"]
	user_password = login_form["user_passwd"]
	db.session.add(User(user_name=user_name, user_password=user_password))
	db.session.commit()
	# print(user_name, user_passwd)
	return "successfully login"

@app.route("/delete", methods=["POST"])
def delete():
	word = request.get_json(force=True)
	usr_word = User_Dict.query.filter(User_Dict.German==word["German"]).first()# & User_Dict.English==word["English"]).delete()
	db.session.delete(usr_word)
	db.session.commit()
	return "successfully DELETE word: "+word["German"]


@app.route("/add", methods=['POST'])
def add():
	# need force=True to get json!!!
	word = request.get_json(force=True)
	# if set PK, don't need to worry auto_increment
	db.session.add(User_Dict(German=word["German"], English=word["English"], Note=word["Note"]))
	db.session.commit()
	return word["German"] + " successfully stored in your dictionary"


@app.route("/search")
def search():
	search = request.args.get("search_word")
	try:
		# if in redis, get it
		if cache.get(search):
			words = cache.get(search)
			print("data from Redis")
		# if not in redis, search in mysql then store in redis
		else:
			words = Root_Dict.query.filter(Root_Dict.German.startswith(search)).limit(10).all()
			print("data from Mysql")
		ger_list, eng_list, note_list = list(), list(), list()
		# store in redis
		cache.set(search, words)

		for word in words:
			ger_list.append(word.German)
			eng_list.append(word.English)
			note_list.append(word.Note)
		return render_template("search.html", search_zip_list=zip(ger_list, eng_list, note_list))
		# return words.German
		# return '<li>' + str(words.German) + '\t' + words.English + '\t' + words.Note + '</li>'
		# resp = ''
		# for word in words:
		# 	resp += '<li>' + str(word.German) + '\t' + word.English + '\t' + word.Note + '</li>'
		# return resp
		#db.session.query('1').from_statement(text('SELECT 1')).all()
	except Exception as e:
		# see Terminal for description of the error
		print("\nERROR:\n" + str(e) + "\n")
		return 'No such words in dictionary'


@app.route("/user/<user_name>")
def user_home(user_name):
	user = User.query.filter_by(user_name=user_name).first_or_404()
	try:
		total_words = Root_Dict.query.limit(10).all()
		usr_words = User_Dict.query.limit(10).all()
		total_ger_list, total_eng_list, total_note_list = list(), list(), list()
		ger_list, eng_list, note_list = list(), list(), list()
		for word in total_words:
			total_ger_list.append(word.German)
			total_eng_list.append(word.English)
			total_note_list.append(word.Note)
			
		for word in usr_words:
			ger_list.append(word.German)
			eng_list.append(word.English)
			note_list.append(word.Note)
		return render_template("rememberpage.html", \
								total_zip_list = zip(total_ger_list, total_eng_list, total_note_list),\
								 zip_list=zip(ger_list, eng_list, note_list), user=user)
	except Exception as e:
		print("\nERROR:\n" + str(e) + "\n")
		return '<h1>Something is broken.</h1>'


@app.route("/")
def home():
	try:
		total_words = Root_Dict.query.limit(10).all()
		usr_words = User_Dict.query.limit(10).all()
		# return words.German
		# return '<li>' + str(words.German) + '\t' + words.English + '\t' + words.Note + '</li>'
		total_ger_list, total_eng_list, total_note_list = list(), list(), list()
		ger_list, eng_list, note_list = list(), list(), list()
		for word in total_words:
			total_ger_list.append(word.German)
			total_eng_list.append(word.English)
			total_note_list.append(word.Note)
			
		for word in usr_words:
			ger_list.append(word.German)
			eng_list.append(word.English)
			note_list.append(word.Note)
		# resp = ''
		# for word in words:
		# 	resp += '<li>' + str(word.German) + '\t' + word.English + '\t' + word.Note + '</li>'
		# return resp
		return render_template("rememberpage.html", \
								total_zip_list = zip(total_ger_list, total_eng_list, total_note_list),\
								 zip_list=zip(ger_list, eng_list, note_list))
	except Exception as e:
		# see Terminal for description of the error
		print("\nERROR:\n" + str(e) + "\n")
		return '<h1>Something is broken.</h1>'


if __name__ == '__main__':
	app.run(debug=True)
