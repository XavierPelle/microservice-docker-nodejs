#!/usr/bin/env python3
"""
Script pour créer un administrateur par défaut
Usage: python create-admin.py
"""

import requests
import json
import sys

# Configuration
USER_SERVICE_URL = "http://localhost:5001"
AUTH_SERVICE_URL = "http://localhost:5004"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123"
ADMIN_FIRST_NAME = "Admin"
ADMIN_LAST_NAME = "System"

def create_admin_user():
    """Créer un utilisateur admin dans le système"""
    
    # 1. Créer l'utilisateur de base
    user_data = {
        "firstName": ADMIN_FIRST_NAME,
        "lastName": ADMIN_LAST_NAME,
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "role": "admin"
    }
    
    try:
        # Créer l'utilisateur via le service auth
        response = requests.post(f"{AUTH_SERVICE_URL}/register", json=user_data)
        
        if response.status_code == 201:
            print("✅ Utilisateur admin créé avec succès")
            
            # Maintenant mettre à jour avec le mot de passe
            update_data = {
                'email': ADMIN_EMAIL,
                'password': ADMIN_PASSWORD
            }
            update_response = requests.post(f"{AUTH_SERVICE_URL}/register_up", json=update_data)
            
            if update_response.status_code == 201:
                print("✅ Mot de passe admin configuré avec succès")
                return True
            else:
                print(f"❌ Erreur lors de la configuration du mot de passe: {update_response.status_code}")
                return False
        
        if response.status_code == 201:
            print("✅ Utilisateur admin créé avec succès")
            return True
        elif response.status_code == 400 and "déjà existant" in response.text:
            print("⚠️  L'utilisateur admin existe déjà")
            return True
        else:
            print(f"❌ Erreur lors de la création de l'utilisateur: {response.status_code}")
            print(response.text)
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au service d'authentification")
        print("Assurez-vous que les services sont démarrés avec docker-compose")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def test_admin_login():
    """Tester la connexion admin"""
    
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(f"{AUTH_SERVICE_URL}/admin/login", json=login_data)
        
        if response.status_code == 200:
            token = response.json().get("access_token")
            print("✅ Connexion admin testée avec succès")
            print(f"Token: {token[:20]}...")
            return True
        else:
            print(f"❌ Erreur lors du test de connexion: {response.status_code}")
            print(response.text)
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au service d'authentification")
        return False
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False

def main():
    print("🔧 Création de l'administrateur par défaut")
    print("=" * 50)
    
    # Créer l'utilisateur admin
    if create_admin_user():
        print("\n🔐 Test de connexion admin...")
        if test_admin_login():
            print("\n✅ Configuration admin terminée avec succès!")
            print(f"\n📋 Informations de connexion:")
            print(f"   Email: {ADMIN_EMAIL}")
            print(f"   Mot de passe: {ADMIN_PASSWORD}")
            print(f"\n🌐 Accès frontend: http://localhost:4200/admin-login")
        else:
            print("\n❌ Échec du test de connexion")
            sys.exit(1)
    else:
        print("\n❌ Échec de la création de l'admin")
        sys.exit(1)

if __name__ == "__main__":
    main() 