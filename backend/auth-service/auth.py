from flask import Flask, request, jsonify, g
from flask_bcrypt import Bcrypt
from functools import wraps
import base64
import json
import hmac
import hashlib
import time
import os

app = Flask(__name__)
bcrypt = Bcrypt(app)

SECRET_KEY = 'CODE007'

users = {}

# Fonction pour générer un sel
def generate_salt():
    return os.urandom(16).hex()

# Fonction pour générer le header du JWT
def generate_header():
    header = {
        "alg": "HS256",  
        "typ": "JWT"     
    }
    return base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")

# Fonction pour générer le payload du JWT
def generate_payload(user_id, email, role):
    payload = {
        "sub": user_id, 
        "email": email,
        "role": role,
        "exp": int(time.time()) + 3600  # Expiration dans 1 heure
    }
    return base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")

# Fonction pour générer la signature du JWT
def generate_signature(header_b64, payload_b64, secret_key):
    message = f"{header_b64}.{payload_b64}"
    signature = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).digest()
    return base64.urlsafe_b64encode(signature).decode().rstrip("=")

# Fonction pour créer un JWT
def create_jwt(user_id, email, role, secret_key):
    header_b64 = generate_header()
    payload_b64 = generate_payload(user_id, email, role)
    signature = generate_signature(header_b64, payload_b64, secret_key)
    jwt = f"{header_b64}.{payload_b64}.{signature}"
    return jwt

# Fonction pour vérifier un JWT
def verify_jwt(jwt, secret_key):
    try:
        header_b64, payload_b64, signature_b64 = jwt.split(".")
        message = f"{header_b64}.{payload_b64}"
        expected_signature = generate_signature(header_b64, payload_b64, secret_key)

        if signature_b64 == expected_signature:
            payload = base64.urlsafe_b64decode(payload_b64 + "==").decode()
            return json.loads(payload)
        else:
            return None
    except Exception as e:
        print(f"Erreur lors de la vérification du token: {e}")
        return None

def proof_of_work(data, difficulty=3):
    nonce = 0
    target = '0' * difficulty 
    
    while True:
        data_n = f"{data}{nonce}".encode('utf-8') 
        hash_result = hashlib.sha256(data_n).hexdigest()  
        
        if hash_result.startswith(target):  
            return nonce, hash_result  
        nonce += 1
        if nonce % 1000 == 0: 
            time.sleep(0.1)



@app.before_request
def before_request():
    token = request.headers.get('Authorization')
    if token:
        token = token.split(" ")[1]  
        decoded = verify_jwt(token, SECRET_KEY)
        if decoded:
            g.user = decoded  
        else:
            g.user = None  
        g.user = None