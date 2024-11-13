from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
import base64
import json
import hmac
import hashlib
import time
import requests
import os


app = Flask(__name__)  
bcrypt = Bcrypt(app)

SECRET_KEY = 'CODE007'

url = "http://user-service:5001/users/create"

users = {}

def generate_salt():
    return os.urandom(16).hex()

def generate_header():
    header = {
        "alg": "HS256",  
        "typ": "JWT"     
    }
    return base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")



def generate_payload(user_id, email, role):
    payload = {
        "sub": user_id, 
        "email": email,
        "role" : role,
        "exp": int(time.time()) + 3600  # Expiration dans 1 heure
    }
    return base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")


# Fonction pour générer la signature JWT
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
    header_b64, payload_b64, signature_b64 = jwt.split(".")
    message = f"{header_b64}.{payload_b64}"
    expected_signature = generate_signature(header_b64, payload_b64, secret_key)

    if signature_b64 == expected_signature:
        payload = base64.urlsafe_b64decode(payload_b64 + "==").decode()
        return json.loads(payload)
    else:
        return None

# Route pour l'inscription des utilisateurs
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')

    if email in users:
        return jsonify({'message': 'Utilisateur déjà existant'}), 400
    
    salt = generate_salt()

    # Hasher le mot de passe
    salted_password = password + salt
    hashed_password = bcrypt.generate_password_hash(salted_password).decode('utf-8')

    # Enregistrer l'utilisateur dans la "base de données"
    user_info = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': hashed_password,
        'salt': salt,
        'role': role  # Ajouter le rôle de l'utilisateur
    }

    users[email] = user_info
    return jsonify({'message': 'Utilisateur créé', 'user': user_info}), 201

# response = requests.post(url, jsonify)

# Route pour la connexion des utilisateurs
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Vérifier si l'utilisateur existe
    user = users.get(email)

    if user :
        
        salted_password = password + user['salt']

        # Vérifier si le mot de passe est correct
        if bcrypt.check_password_hash(user['password'], salted_password):
            # Créer un JWT
            token = create_jwt(email, email, user['role'], SECRET_KEY)  
            return jsonify({"access_token": token}), 200  
        else:
            return jsonify({"message": "Nom d'utilisateur ou mot de passe incorrect"}), 401
    else:
        return jsonify({"message": "Utilisateur non trouvé"}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5004)