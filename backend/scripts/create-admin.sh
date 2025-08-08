#!/bin/bash

# Configuration
AUTH_SERVICE_URL="http://localhost:5004"
EMAIL="admin@amazur.com"
PASSWORD="admin123"
FIRST_NAME="Admin"
LAST_NAME="System"

echo "🔧 Création de l'administrateur par défaut"
echo "=========================================="

# Étape 1 : Création de l'utilisateur
echo "➡️  Création de l'utilisateur..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$AUTH_SERVICE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{
        \"firstName\": \"$FIRST_NAME\",
        \"lastName\": \"$LAST_NAME\",
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\",
        \"role\": \"admin\"
      }")

if [[ "$RESPONSE" == "201" ]]; then
  echo "✅ Utilisateur admin créé avec succès"
elif [[ "$RESPONSE" == "400" ]]; then
  echo "⚠️  L'utilisateur existe déjà ou requête invalide"
else
  echo "❌ Erreur lors de la création de l'utilisateur (code $RESPONSE)"
  exit 1
fi

# Étape 2 : Mise à jour du mot de passe
echo "➡️  Configuration du mot de passe..."

UPDATE_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$AUTH_SERVICE_URL/register_up" \
  -H "Content-Type: application/json" \
  -d "{
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
      }")

if [[ "$UPDATE_RESPONSE" == "201" ]]; then
  echo "✅ Mot de passe configuré avec succès"
else
  echo "❌ Erreur lors de la configuration du mot de passe (code $UPDATE_RESPONSE)"
  exit 1
fi

# Étape 3 : Connexion de test
echo "➡️  Test de connexion admin..."

LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_SERVICE_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d "{
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
      }")

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -oP '(?<="access_token":")[^"]+')

if [[ -n "$TOKEN" ]]; then
  echo "✅ Connexion réussie"
  echo "🔐 Token (début) : ${TOKEN:0:20}..."
  echo ""
  echo "📋 Identifiants admin :"
  echo "   Email : $EMAIL"
  echo "   Mot de passe : $PASSWORD"
  echo "🌐 Accès frontend : http://localhost:4200/admin-login"
else
  echo "❌ Échec de la connexion admin"
  echo "Réponse brute : $LOGIN_RESPONSE"
  exit 1
fi
