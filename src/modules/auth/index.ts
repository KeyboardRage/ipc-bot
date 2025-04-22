import type { IAuthData } from "./types.js";
import AuthService from "./domain/AuthService.js";
import AuthKey from "./data-access/schemas/AuthKey.js";
import type { ServiceMap } from "../../types.js";
import Plugin from "../core/domain/Plugin.js";

export {
    AuthService,
};

export default function() {
    return new Plugin<ServiceMap>("Auth Service", {
        load(core) {
            const service = new AuthService({ core });
            core.registerService("Auth", service);

            // Register schema or user
            core.getService("Database").registerModel<IAuthData>("AuthKeys", AuthKey);
        },
        postLoad(core) {
            // Register HTTP decorator
            core.getService("Server").registerRequestDecorator("user", null);
        },
    });
}