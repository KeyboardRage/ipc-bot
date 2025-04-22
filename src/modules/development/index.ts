import type { ServiceMap } from "../../types";
import { Plugin } from "../core";

/**
 * Services and utilities only available in local development mode.
 */
export default function() {
    if (process.env.NODE_ENV !== "development") throw new Error("This module is not supposed to be loaded in any other environment than development.");

    return new Plugin<ServiceMap>("Development Environment Utils", {
        load(core) {

        },
    });
}