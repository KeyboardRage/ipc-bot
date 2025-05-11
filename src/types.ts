import type { Database, RealTimeDB, RealTimeQueries } from "./modules/database/index.js";
import type { AuthService } from "./modules/auth/index.js";
import type { AppCore } from "./modules/core/index.js";
import type { BotClient } from "./modules/client/index.js";
import type { InteractionService } from "./modules/interactions/index.js";
import type { RestClient } from "./modules/rest/index.js";
import type { Server } from "./modules/server/index.js";
import type { GuildService } from "./modules/system/index.js";
import type { DiscordService } from "./modules/rest/index.js";
import type { WSServer, EventBus } from "./modules/real-time/index.js";

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
    "WebSocket": WSServer;
    "EventBus": EventBus;
    "RealTimeDB": RealTimeDB;
    "RealTime": RealTimeQueries;
}

export type ApplicationCore = AppCore<ServiceMap>;

export interface IUserData {
    id: string;
    username: string;
    nickname: string | null;
    globalName: string | null;
    avatar: string | null;
}

export type AnyOriginalError = Error | TypeError | RangeError | ReferenceError | SyntaxError | URIError | EvalError;