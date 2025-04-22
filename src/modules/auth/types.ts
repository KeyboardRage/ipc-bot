export interface IAuthData {
    _id: string; // User snowflake
    authKey: string;
    expiresAt: Date;
}