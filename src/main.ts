import type {ApplicationCore, ServiceMap} from "./types.js";
import { AppCore } from "./modules/core/index.js";

import Errors from "./modules/errors/index.js";
import Database from "./modules/database/index.js";
import Auth from "./modules/auth/index.js";
import BotClient from "./modules/client/index.js";
import RestClient from "./modules/rest/index.js";
import Server from "./modules/server/index.js";
import System from "./modules/system/index.js";
import Interactions from "./modules/interactions/index.js";
import DevelopmentUtils from "./modules/development/index.js";

export default async function(): Promise<ApplicationCore> {
    const core = new AppCore<ServiceMap>("IPCBot", {
        logging: {
            info: true,
        },
    });

    core.addPlugin(BotClient());
    core.addPlugin(RestClient());
    core.addPlugin(Errors());
    core.addPlugin(Database());
    core.addPlugin(Auth());
    core.addPlugin(Server());
    core.addPlugin(System());
    core.addPlugin(Interactions());

    if (process.env.NODE_ENV?.trim() === "development") {
        core.addPlugin(DevelopmentUtils());
    }

    // Start loading of plugins
    await core.preLoad();
    await core.load();
    await core.postLoad();

    // Boot up the plugins
    await core.preStart();
    await core.start();
    await core.postStart();

    // Call ready hooks
    await core.ready();

    return core;
}