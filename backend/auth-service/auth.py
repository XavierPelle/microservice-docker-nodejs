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

# Décorateur avant la requête pour vérifier le JWT
@app.before_request
def before_request():
    token = request.headers.get('Authorization')
    if token:
        token = token.split(" ")[1]  # Extraire le token après 'Bearer'
        decoded = verify_jwt(token, SECRET_KEY)
        if decoded:
            g.user = decoded  # Stocker l'utilisateur dans g pour l'accès facile
        else:
            g.user = None  # Si le token est invalide ou expiré, aucun utilisateur n'est défini
    else:
        g.user = None