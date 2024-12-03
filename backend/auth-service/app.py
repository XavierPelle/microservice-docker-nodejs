from flask import Flask, request, jsonify, g
from flask_bcrypt import Bcrypt
from auth import create_jwt, generate_salt, verify_jwt, proof_of_work
import requests

app = Flask(__name__)
bcrypt = Bcrypt(app)

SECRET_KEY = 'CODE007' 
users = {}

TARGET_URL_USER = 'http://user-service:5001/users/create'
TARGET_URL_UPDATE = 'http://user-service:5001/users/'


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
    password = data.get('password')
    role = data.get('role', 'user')

    # Vérifie si l'utilisateur existe déjà dans la "base de données"
    if email in users:
        return jsonify({'message': 'Utilisateur déjà existant'}), 400
    
    # Calcule le nonce et le proofHash que le client doit résoudre
    proof_nonce, proof_hash = get_proof_of_work(password)  

    # Envoie le nonce et proofHash au client pour qu'il les renvoie après avoir résolu le challenge
    response_data = {
        'nonce': proof_nonce,
        'proofHash': proof_hash
    }

    # Génération du sel pour le mot de passe
    #salt = generate_salt()

    # Applique le sel au mot de passe
    #salted_password = password + salt
    #hashed_password = bcrypt.generate_password_hash(salted_password).decode('utf-8')

    
    user_info = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'password': password,
        'nonce': proof_nonce,
        'proofHash': proof_hash,
        #'salt': salt
    }

    users[email] = user_info
        
    #return jsonify({'message': 'Utilisateur créé et données envoyées', 'user': user_info, 'proof': response_data}), 201
   
   
       
    response = requests.post(TARGET_URL_USER, json=user_info)

       
    if response.status_code == 200:
         return jsonify({'message': 'Utilisateur créé et données envoyées', 'user': user_info, 'proof': response_data}), 201
            
    else:
          return jsonify({'message': 'Utilisateur créé, mais erreur lors de l\'envoi des données', 'error': response.text}), 400
   
       


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


# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     # Vérifier si l'utilisateur existe dans le dictionnaire
#     user = users.get(email)

#     if user:
#         salted_password = password + user['salt']

#         # Vérifier si le mot de passe est correct
#         if bcrypt.check_password_hash(user['password'], salted_password):
#             # Créer un JWT
#             token = create_jwt(email, email, user['role'], SECRET_KEY)
#             return jsonify({"access_token": token}), 200
#         else:
#             return jsonify({"message": "Nom d'utilisateur ou mot de passe incorrect"}), 401
#     else:
#         return jsonify({"message": "Utilisateur non trouvé"}), 404
    

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    proof_nonce = data.get('nonce')
    proof_hash = data.get('proofHash')


    # Vérifier si l'utilisateur existe dans le dictionnaire
    user = users.get(email)

    if user:
        expected_nonce = user['nonce']
        expected_hash = user['proofHash']

        

        # Vérifier si le nonce et le prh est correct
        if proof_nonce != expected_nonce or proof_hash != expected_hash:
            # Créer un JWT
            token = create_jwt(email, email, SECRET_KEY)
            return jsonify({"access_token": token}), 200
        else:
            return jsonify({"message": "Nom d'utilisateur ou mot de passe incorrect"}), 401
    else:
        return jsonify({"message": "Utilisateur non trouvé"}), 404


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
