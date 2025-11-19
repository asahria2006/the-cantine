from flask import Flask, session, redirect
from functools import wraps

def login_required(f):
    """
    Decorate routes to require login.

    https://flask.palletsprojects.com/en/latest/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/login")
        return f(*args, **kwargs)

    return decorated_function


def obj_to_dict(obj):
    result = []
    for c in obj.__table__.columns:
        result[c.name] = getattr(obj, c.name)
    return result