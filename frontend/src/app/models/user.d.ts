export interface UserSignupDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    salt?: string;
}

export interface UserSigninDTO {
    email: string;
    password: string;
    salt: string;
    access_token: string;
}