from flask import Flask, request, jsonify, g
from flask_bcrypt import Bcrypt
from auth import create_jwt, before_request, generate_salt, verify_jwt # Assurez-vous que auth.py est dans le même répertoire

app = Flask(__name__)
bcrypt = Bcrypt(app)

SECRET_KEY = 'CODE007'
# Simuler une base de données d'utilisateurs
users = {}

# Utilisez le décorateur before_request pour appeler avant chaque requête
@app.before_request
def before_request():
    # Le code pour extraire et vérifier le JWT doit être dans cette fonction
    token = request.headers.get('Authorization')
    if token:
        token = token.split(" ")[1]  # Extraire le token après 'Bearer'
        decoded = verify_jwt(token, SECRET_KEY)
        if decoded:
            g.user = decoded  # Stocker l'utilisateur dans g pour l'accès facile
        else:
            g.user = None  # Si le token est invalide ou expiré, aucun utilisateur n'est défini
    else:
        g.user = None  # Si aucun token n'est fourni

@app.route('/', methods=['GET'])
def test():
    return ({'message'}), 201

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

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Vérifier si l'utilisateur existe
    user = users.get(email)

    if user:
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