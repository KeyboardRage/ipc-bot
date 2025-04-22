import type { IAuthData } from "./types";
import AuthService from "./domain/AuthService";
import AuthKey from "./data-access/schemas/AuthKey";
import type { ServiceMap } from "../../index";
import Plugin from "../core/domain/Plugin";

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