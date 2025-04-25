import type { IAuthData } from "../types.js";
import type { ApplicationCore, IUserData } from "../../../types.js";
import type { Model } from "../../database/types.js";
import jwt from "jsonwebtoken";

export interface IAuthServiceDependencies {
    core: ApplicationCore;
}

export default class AuthService {
    core: ApplicationCore;
    ttl: number = 1000 * 60 * 60 * 24 * 48;

    constructor(dep: IAuthServiceDependencies) {
        this.core = dep.core;
    }

    parse(token: string): null | jwt.JwtPayload & IUserData {
        try {
            return jwt.verify(token, process.env.JWT_TOKEN) as jwt.JwtPayload & IUserData;
        } catch (_) {
            return null;
        }
    }

    get #AuthKeys(): Model<IAuthData> {
        return this.core.getService("Database").getModel("AuthKeys");
    }

    /**
     * Generates a new auth key
     */
    createKey(partialUser: IUserData): string {
        // TODO Fix expiresIn. Documentation is wrong or there's a bug, it does not work as document, so I removed it
        return jwt.sign(partialUser, process.env.JWT_TOKEN);
    }

    /**
     * Stores an auth key for a given user
     */
    async storeKey(userId: string, expiresAt: Date, key: string): Promise<void> {
        await this.#AuthKeys.create({
            _id: userId,
            authKey: key,
            expiresAt: expiresAt,
        });
    }

    /**
     * Retrieve the existing auth key, or generate on the fly if one is not found
     * @returns The auth key
     */
    async getAuthKey(partialUser: IUserData): Promise<string> {
        if (!partialUser.id) throw new Error("Missing user ID");

        const found = await this.#AuthKeys.findOne({ _id: partialUser.id }, ["authKey"]).lean().exec();
        if (found) return found.authKey;

        const key = this.createKey(partialUser);
        await this.storeKey(partialUser.id, new Date(Date.now() + this.ttl), key);

        return key;
    }

    /**
     * Invalidates a user's existing key and generates a new one
     * @returns The new auth key
     */
    async resetAuthKey(partialUser: IUserData): Promise<string> {
        const key = this.createKey(partialUser);
        await this.storeKey(partialUser.id, new Date(Date.now() + this.ttl), key);
        return key;
    }
}