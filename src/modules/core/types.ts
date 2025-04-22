import type { EventEmitter } from "eventemitter3";
import Plugin from "./domain/Plugin.js";
import Core from "./domain/AppCore.js";
export type ValidEvents = EventEmitter.ValidEventTypes;

export interface CoreEvents<CoreServiceMap> {
    /**
     * When a plugin has executed its preLoad hook
     */
    "plugin.preLoad": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its load hook
     */
    "plugin.load": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its postLoad hook
     */
    "plugin.postLoad": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its preStart hook
     */
    "plugin.preStart": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its start hook
     */
    "plugin.start": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its postStart hook
     */
    "plugin.postStart": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its ready hook
     */
    "plugin.ready": [plugin: Plugin<CoreServiceMap>];
    /**
     * When a plugin has executed its stop hook
     */
    "plugin.stop": [plugin: Plugin<CoreServiceMap>, force: boolean];
    /**
     * When all ready hooks have been executed
     */
    "ready": [core: Core<CoreServiceMap>];
    /**
     * When the service has fully stopped
     */
    "stop": [core: Core<CoreServiceMap>, force: boolean];
}

export interface CoreLoggingConfig {
    /**
     * Log Info level logs
     */
    info: boolean;
}

export interface CoreConfig {
    logging: CoreLoggingConfig;
}