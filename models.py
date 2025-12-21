from sqlalchemy import create_engine, Integer, String, Float, Column, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False)

    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    section = Column(String, nullable=False)
    tier = Column(Integer)

    email = Column(String, nullable=False)
    hashcode = Column(String, nullable=False)
    lastlogin = Column(DateTime, nullable=False)
    balance = Column(Float)

class Tier(Base):
    __tablename__ = 'tier_price'
    tier = Column(Integer, primary_key=True, nullable=False)
    price_per_meal = Column(Float, nullable=False)

class Reservation(Base):
    __tablename__ = 'reservation'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id  = Column(Integer, ForeignKey('users.id'), nullable=False)
    date = Column(DateTime, nullable=False)

class Recharge_code(Base):
    __tablename__ = 'recharge_code'
    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String, nullable=False)
    valid = Column(Boolean, nullable=False)
    amount = Column(Integer, nullable=False)


# new_user = User(
#         username = user_data.get("username"),
#         firstname = user_data.get("firstname"),
#         lastname = user_data.get("lastname"),
#         section = user_data.get("studentClass"),
#         tier = user_data.get("tier"),
#         hashcode = generate_password_hash(password),
#         lastlogin = datetime.now(),
#         balance = float(50)
#     )



    