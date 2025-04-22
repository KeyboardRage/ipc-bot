import type { ServiceMap } from "../../types";
import { Plugin } from "../core";
import ErrorService from "./domain/ErrorService";

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