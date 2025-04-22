import type {ApplicationCore, ServiceMap} from "./types";
import { AppCore } from "./modules/core";

import Errors from "./modules/errors";
import Database from "./modules/database";
import Auth from "./modules/auth";
import BotClient from "./modules/client";
import RestClient from "./modules/rest";
import Server from "./modules/server";
import System from "./modules/system";
import Interactions from "./modules/interactions";
import DevelopmentUtils from "./modules/development";

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