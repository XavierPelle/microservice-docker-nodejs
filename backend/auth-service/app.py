from flask import Flask, request, jsonify, g
from flask_bcrypt import Bcrypt
from auth import create_jwt, generate_salt, verify_jwt, proof_of_work
import requests
import jwt
from datetime import datetime, timedelta
import uuid

app = Flask(__name__)
bcrypt = Bcrypt(app)

SECRET_KEY = 'CODE007' 
users = {}

TARGET_URL_USER = 'http://user-service:5001/users/create'
TARGET_URL_GET = 'http://user-service:5001/users/'


# Health
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "OK"}), 200


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
    else:
        g.user = None  



def get_proof_of_work(password, difficulty=3):
    nonce, proof_hash = proof_of_work(password, difficulty)
    return nonce, proof_hash


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')

    # Vérifie si l'utilisateur existe déjà dans la "base de données"
    if email in users:
        return jsonify({'message': 'Utilisateur déjà existant'}), 400
    


    # Génération du sel pour le mot de passe
    salt = generate_salt()

    # Applique le sel au mot de passe
    #salted_password = password + salt
    #hashed_password = bcrypt.generate_password_hash(salted_password).decode('utf-8')

    
    user_info = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'salt': salt
    }

    users[email] = user_info
        
    response = requests.post(TARGET_URL_USER, json=user_info) 

    return jsonify({'salt': salt}), 201

    #return jsonify({'message': 'Utilisateur créé et données envoyées', 'user': user_info, 'sel':salt}), 201
    
   

       
@app.route('/register_up', methods=['POST'])
def register_up():
    data = request.get_json()
    print(data)
    email = data.get('email')
    password = data.get('password')

    user_info = {
        'email': email,
        'password': password,
    }
    print(email)
    users[email] = user_info
    
    TARGET_URL_UPDATE = 'http://user-service:5001/users/update/email/{}'.format(email)
    print(TARGET_URL_UPDATE)
    
    response = requests.put(TARGET_URL_UPDATE, json=user_info)

    return jsonify({'message': 'Utilisateur créé et données envoyées', 'body': user_info}), 201

# @app.route('/verify_register', methods=['POST'])
# def verify_register():
#     data = request.get_json()
#     email = data.get('email')
#     proof_nonce = data.get('nonce')
#     proof_hash = data.get('proofHash')

#     # Vérifie si l'utilisateur existe
#     user = users.get(email)

#     if user:

#         expected_nonce = user['nonce']
#         expected_hash = user['proofHash']

#         if proof_nonce != expected_nonce or proof_hash != expected_hash:
#             return jsonify({"message": "Preuve de travail invalide"}), 400

#         return jsonify({"message": "Preuve de travail validée, utilisateur inscrit avec succès"}), 200
#     else:
#         return jsonify({"message": "Utilisateur non trouvé"}), 404

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email et mot de passe requis"}), 400

    url = f'http://user-service:5001/users/{email}'
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({"error": "Erreur lors de la vérification de l'utilisateur"}), 500

    user_data = response.json()
    password_from_db = user_data.get('password')
    user_first_name = user_data.get('firstName')
    user_last_name = user_data.get('lastName')
    user_id = user_data.get('id')

    if password != password_from_db:
        return jsonify({"error": "Nom d'utilisateur ou mot de passe incorrect"}), 401

    token_data = {
        "user_id": user_id,
        "email": email,
        "firstName": user_first_name,
        "lastName": user_last_name,
    }
    token_api_url = 'http://token-service:8101/add-token'
    token_response = requests.post(token_api_url, json=token_data)

    if token_response.status_code != 200:
        return jsonify({"error": "Erreur lors de la génération du token"}), 500

    token = token_response.json().get('token')

    return jsonify({"access_token": token}), 200


@app.route('/login_send', methods=['POST'])
def login_send():
    data = request.get_json()
    email = data.get('email')
    url = 'http://user-service:5001/users/{}'.format(email)


    response = requests.get(url)
    data = response.json()
    salt = data.get('salt')
    return jsonify({"salt": salt}), 200


    # # Vérifier si l'utilisateur existe dans le dictionnaire
    # user = users.get(email)
    
    # if user:
    #     salt = user['salt']
    #     return jsonify({"message": salt}), 401
    # else:
    #     return jsonify({"message": "Utilisateur non trouvé"}), 404
    

# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     #password = data.get('password')
#     proof_nonce = data.get('nonce')
#     proof_hash = data.get('proofHash')


#     # Vérifier si l'utilisateur existe dans le dictionnaire
#     user = users.get(email)

#     if user:

#          expected_nonce = user['nonce']
#          expected_hash = user['proofHash']

#          if proof_nonce != expected_nonce or proof_hash != expected_hash:
#              return jsonify({"message": "Preuve de travail invalide"}), 400
#          #token = create_jwt(email, email, SECRET_KEY)
#          return jsonify({"access_token"}), 200
#     else:
#          return jsonify({"message": "Utilisateur non trouvé"}), 404


# Route protégée
@app.route('/profile', methods=['GET'])
def profile():
    if not g.user:
        return jsonify({"message": "Utilisateur non authentifié"}), 401

    return jsonify({
        "message": "Profil utilisateur",
        "user": g.user
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)
