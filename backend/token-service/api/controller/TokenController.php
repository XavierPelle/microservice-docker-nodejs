<?php
class TokenController
{
    private $pdo;
    private $secret = "znvfiqzjvnlsievniuerzvbmiaonpdsok";
    private $tokenExpiration = 3600;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function addToken()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        if (!isset($data['user_id'])) {
            $this->sendResponse(400, ['error' => 'User ID is required.']);
            return;
        }

        $stmt = $this->pdo->prepare("DELETE FROM token WHERE user_id = :user_id");
        $stmt->execute([':user_id' => $data['user_id']]);

        $jwt = $this->generateJWT($data);

        $expirationTime = time() + $this->tokenExpiration;

        $stmt = $this->pdo->prepare("INSERT INTO token (user_id, token, expiration) VALUES (:user_id, :token, :expiration)");
        $stmt->execute([
            ':user_id' => $data['user_id'],
            ':token' => $jwt,
            ':expiration' => date('Y-m-d H:i:s', $expirationTime)
        ]);

        $this->sendResponse(200, ['message' => 'Token added successfully', 'token' => $jwt, 'expires_at' => date('Y-m-d H:i:s', $expirationTime)]);
    }

    public function getTokens()
    {
        $this->cleanExpiredTokens();

        $stmt = $this->pdo->query("SELECT * FROM token");
        $tokens = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($tokens) {
            $this->sendResponse(200, ['tokens' => $tokens]);
        } else {
            $this->sendResponse(200, ['message' => 'No tokens found.']);
        }
    }

    public function verifyToken()
    {
        $this->cleanExpiredTokens();

        $data = json_decode(file_get_contents('php://input'), true);
    
        if (!isset($data['token']) || !isset($data['user_id'])) {
            $this->sendResponse(400, ['error' => 'Token et user_id sont requis']);
            return;
        }

    
        $stmt = $this->pdo->prepare("SELECT * FROM token WHERE user_id = :user_id AND token = :token");
        $stmt->execute([
            'user_id' => $data['user_id'],
            'token' => $data['token']
        ]);
        $token = $stmt->fetch(PDO::FETCH_ASSOC);

    
        if ($token) {
            $this->sendResponse(200, ['message' => 'Token valide', 'token' => $token]);
        } else {
            $this->sendResponse(401, ['error' => 'Token invalide ou non trouvé']);
        }
    }

    
    private function generateJWT($data)
    {
        $header = $this->base64UrlEncode(json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]));

        $payload = $this->base64UrlEncode(json_encode([
            'user_id' => $data['user_id'],
            'first_name' => $data['firstName'] ?? '',
            'last_name' => $data['lastName'] ?? '',
            'email' => $data['email'] ?? '',
            'role' => $data['role'] ?? 'user',
            'exp' => time() + $this->tokenExpiration
        ]));

        $signature = $this->base64UrlEncode(hash_hmac('sha256', $header . "." . $payload, $this->secret, true));

        return $header . "." . $payload . "." . $signature;
    }

    private function cleanExpiredTokens()
    {
        $stmt = $this->pdo->prepare("DELETE FROM token WHERE expiration < NOW()");
        $stmt->execute();
    }

    private function base64UrlEncode($text)
    {
        return str_replace(
            ['+', '/', '='],
            ['-', '_', ''],
            base64_encode($text)
        );
    }

    private function sendResponse($statusCode, $data)
    {
        http_response_code($statusCode);
        echo json_encode($data);
    }
}
