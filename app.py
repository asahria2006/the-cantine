from flask import Flask, render_template, request, session, jsonify
from flask_session import Session as FlaskSession
from helpers import login_required, obj_to_dict
from datetime import datetime, timedelta, date
import calendar
from werkzeug.security import generate_password_hash, check_password_hash

#data base 
from sqlalchemy import create_engine, Select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from models import Base, User, Reservation, Tier


#database 
engine = create_engine("sqlite:///cantine.db", echo=True)
Base.metadata.create_all(engine)

DBSession = sessionmaker(bind=engine)
db_session = DBSession()



app = Flask(__name__)

#session config
# app.config["SESSION_PERMANENT"] = False
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config["SESSION_TYPE"] = "filesystem"
FlaskSession(app)




#index route
@app.route("/", methods=["GET", "POST"])
@login_required
def index():
    user = db_session.query(User).filter(User.id == session["user_id"]).first()
    return render_template("index.html", user_id=session["user_id"], user=user)


#login route
@app.route("/login", methods=["GET", "POST"])
def login():
    #clear any  existing session

    if request.method == 'POST':
        # get data from front-end
        user_data = request.get_json()

        username = user_data.get("username")
        if not username:
            return jsonify({
                'message': 'something went wrong please try again :('
            }), 400

        password = user_data.get("password")
        if not password:
            return jsonify({
                'message': 'something went wrong please try again :('
            }), 400

        # get username from db and check it
        user = db_session.query(User).filter(User.username == username).first()
        if not user:
            return jsonify({
                'message': 'username or password incorrect :('
            }), 401
        
        # verify password
        if not check_password_hash(user.hashcode, password):
            return jsonify({
                'message': 'username or password incorrect:('
            }), 401
        
        # set session user id
        session["user_id"] = user.id
        user.lastlogin = datetime.now()
        
        try:
            db_session.commit()
        except SQLAlchemyError:
            db_session.rollback()
            return jsonify({
                'message': 'internal server error :('
            }), 500
        
        # redirect to index
        return jsonify({
            'success' : True,
            'message' : 'Login successful',
            'redirect' : '/'
        })

    else:
        # render the page 
        session.clear()
        return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":
        #get user data
        user_data = request.get_json()
        
        # check for all empty field
        for key in user_data:
            if not user_data[key]: 
                return jsonify({
                    'message': 'something went wrong please try again'
                }), 400
        
        #check for password
        password = user_data.get("password")
        confirm_password = user_data.get("confirmpassword")

        if password != confirm_password:
            return jsonify({
                'message': 'password doesnt match'
            }), 400

        # tier and class check
        #username db verification
        existing_user = db_session.query(User).filter(User.username==user_data.get("username")).first()


        if existing_user:
            return jsonify({
                'message': 'Someone is already registered with same username, choise another one. :('
            }), 400
        
            
        # register to db
        new_user = User(
            username = user_data.get("username"),
            firstname = user_data.get("firstname"),
            lastname = user_data.get("lastname"),
            section = user_data.get("studentClass"),
            tier = user_data.get("tier"),
            hashcode = generate_password_hash(password),
            lastlogin = datetime.now(),
            balance = float(50)
        )

        try:
            db_session.add(new_user)
            db_session.commit()
            return jsonify({
                "success": True,
                "message": "Registration successful",
                "redirect": "/login"  # frontend will redirect
            }), 200
        
        except SQLAlchemyError:
            db_session.rollback()
            
            return jsonify({
                "success": False,
                "message": "There is an internal server error, please try again :( ",
                # "redirect": "/register"  # frontend will redirect
            }), 500
        
        

    else:
        return render_template("register.html")
    
@app.route("/reservation", methods=["GET", "POST"])
@login_required
def reservation():

    user = db_session.query(User).filter(User.id == session["user_id"]).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 400

    user_price = db_session.query(Tier.price_per_meal).filter(User.tier == Tier.tier).first()
    if not user_price:
        return jsonify({"success": False, "message": "User price not found"}), 400

    # user_reservation_list = db_session.query(Reservation).filter(Reservation.user_id == session["user_id"]).all()

    if request.method == "POST":
        if user.balance < user_price[0]:
            return jsonify({
                "success": False,
                "message": "You don't have enoght money to reserve, please recharge :(",
            }), 400
        
        reservation_data = request.get_json()

        obj_date = datetime.strptime(reservation_data.get("date"), "%d %b %Y")  # expected date format from front end : 17 Jan 2025

        today = datetime.now().date()

        if today > obj_date.date():
            return jsonify({
                "success": False,
                "message": "You cannot reserve for a past date",
            }), 400


        new_reservation = Reservation(
            user_id = user.id,
            date = obj_date
        )
        user.balance = user.balance - user_price[0]
        try:
            db_session.add(new_reservation)
            db_session.commit()
            return jsonify({
                "success": True,
                "message": "Date added",
                "redirect": "/reservation"  # frontend will redirect
            }), 200
        
        except SQLAlchemyError as e:
            db_session.rollback()
            print("SQLAlchemyError:", e)
            
            return jsonify({
                "success": False,
                "message": "There is an internal server error, please try again :( ",
            }), 500

    else:
        return render_template("reservation.html", user=user, user_id=session["user_id"])
    # C = calendar.HTMLCalendar(firstweekday=0)

    # c = C.formatmonth(year, month, withyear=True)

@app.route("/payments", methods=["GET", "POST"])
@login_required
def payments():
    user = db_session.query(User).filter(User.id == session["user_id"]).first()
    return render_template("payments.html", user=user)

@app.route("/reservation_data", methods=["GET", "POST"])
@login_required
def reservation_data():
    user_reservation_list = db_session.query(Reservation).filter(Reservation.user_id == session["user_id"]).all()
    data = []

    for r in user_reservation_list:
        date = r.date.strftime('%d %b %Y')
        data.append(
            {"date" : date}
        )

    return jsonify({
        'data' : data
    })


@app.route("/remove_reservation", methods=["GET", "POST"])
@login_required
def remove_reservation():
    user = db_session.query(User).filter(User.id == session["user_id"]).first()
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 400

    user_price = db_session.query(Tier.price_per_meal).filter(User.tier == Tier.tier).first()
    if not user_price:
        return jsonify({"success": False, "message": "User price not found"}), 400

    remove_reservation = request.get_json()
    obj_date = datetime.strptime(remove_reservation.get("date"), "%d %b %Y")  # expected date format from front end : 17 Jan 2025
    #return tuple containing the date
    reserved_date = db_session.query(Reservation).filter(Reservation.date == obj_date).first()
    if not reserved_date:
        return jsonify({
            "success": False,
            "message": "Can't remove a non reserved date !!",
        }), 500
    
    user.balance = user.balance + user_price[0]


    try:
        db_session.delete(reserved_date)
        db_session.commit()
        return jsonify({
            "success": True,
            "message": "Date removed",
            "redirect": "/reservation"  # frontend will redirect
        }), 200
    
    except SQLAlchemyError as e:
        db_session.rollback()
        print("SQLAlchemyError:", e)
        
        return jsonify({
            "success": False,
            "message": "There is an internal server error, please try again :( ",
        }), 500

