import type { Database } from "./modules/database";
import type { AuthService } from "./modules/auth";
import type { AppCore } from "./modules/core";
import type { BotClient } from "./modules/client";
import type { InteractionService } from "./modules/interactions";
import type { RestClient } from "./modules/rest";
import type { Server } from "./modules/server";
import type { GuildService } from "./modules/system";
import type { DiscordService } from "./modules/rest";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_ID: string;
            BOT_TOKEN: string;
            NODE_ENV: "development" | "production";
            JWT_TOKEN: string;
            MONGO_URI: string;
        }
    }
}

/**
 * Service map structure for the {@link Core}
 */
export type UnknownServiceMap = Record<string, any>;

export interface ServiceMap extends UnknownServiceMap {
    "Database": Database;
    "Auth": AuthService;
    "Guilds": GuildService;
    "Bot": BotClient;
    "Interactions": InteractionService;
    "REST": RestClient;
    "Server": Server;
    "Discord": DiscordService;
}

export type ApplicationCore = AppCore<ServiceMap>;

export interface IUserData {
    id: string;
    username: string;
    nickname: string;
    globalName: string;
}

export type AnyOriginalError = Error | TypeError | RangeError | ReferenceError | SyntaxError | URIError | EvalError;