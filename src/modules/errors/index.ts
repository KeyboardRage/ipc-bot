import type { ServiceMap } from "../../types.js";
import { Plugin } from "../core/index.js";
import ErrorService from "./domain/ErrorService.js";

export {
    ErrorService,
};

export default function() {
    return new Plugin<ServiceMap>("Error handler", {
        load(core) {
            const service = new ErrorService();
            core.registerService("ErrorService", service);
        },
    });
}