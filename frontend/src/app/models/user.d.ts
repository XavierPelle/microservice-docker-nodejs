export interface UserSignupDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    salt?: string;
    role?: string;
}

export interface UserSigninDTO {
    email: string;
    password: string;
    salt: string;
    role: string;
    access_token: string;
}