from models import User

def validate_fields(data, fields):
    return data and all(k in data and data[k] for k in fields)