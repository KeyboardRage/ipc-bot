import type { CoreEvents, CoreLoggingConfig, CoreConfig } from "../types";
import BaseComponent from "./BaseComponent";
import Plugin from "./Plugin";

export default class Core<CoreServiceMap> extends BaseComponent<CoreEvents<CoreServiceMap>> {
    /**
     * Logging configuration for this service
     */
    log?: CoreLoggingConfig;

    /**
     * Services from packages, components, etc.
     * @private
     */
    #services = new Map();

    /**
     * Components, Packages, etc.
     * @private
     */
    #plugins: Plugin<CoreServiceMap>[] = [];

    /**
     * The name of the core, for logging
     */
    name: string = "";

    constructor(name: string, config?: CoreConfig) {
        super();
        this.name = name;
        this.log = {
            info: !!config?.logging?.info,
        };
    }

    /**
     * Checks to see if a service is registered and available
     */
    hasService(serviceName: keyof CoreServiceMap): boolean {
        return this.#services.has(serviceName);
    }

    getService<T extends keyof CoreServiceMap>(serviceName: T): CoreServiceMap[T] {
        if (!this.#services.has(serviceName)) {
            // Throw rather than return null!
            throw new Error(`Service ${serviceName.toString()} not found`);
        }

        return this.#services.get(serviceName);
    }

    /**
     * Registers a ready set-up service (might not be started yet though)
     */
    registerService<T extends keyof CoreServiceMap>(serviceName: T, service: CoreServiceMap[T]) {
        if (this.#services.has(serviceName)) {
            throw new Error(`Service ${serviceName.toString()} already registered`);
        }

        this.#services.set(serviceName, service);
    }

    /**
     * Registers that you want to use a plugin
     */
    addPlugin(plugin: Plugin<CoreServiceMap>): void {
        if (plugin.disabled) return;
        this.#plugins.push(plugin);
    }

    /**
     * Stops the backend.
     * Performs automatic shutdown of all services that exposes a stop function, then exists the process.
     * @param [force=false] Force shutdown of service
     */
    async stop(force: boolean = false): Promise<void> {
        if (this.log?.info) console.info("===============[ SHUTDOWN ]===============");

        for (const plugin of this.#plugins) {
            if (plugin.hasHook("stop")) {
                await plugin.stop(this, force);

                if (this.log?.info) {
                    console.info(`[Plugin stopped${force
                        ? " by force"
                        : ""}] ${plugin.name}`);
                }
                this.emit("plugin.stop", plugin, force);
            }
        }

        if (!force && this.log?.info) {
            console.info([
                "------------------------------------------",
                "Gracefully shut everything down.",
                "==========================================",
            ].join("\n"));
        } else {
            console.info("Gracefully shut everything down.");
        }

        this.emit("stop", this, force);

        process.exit(0); // 0 = success, 1 = failure
    }

    /**
     * Runs all pre-loaders
     */
    async preLoad(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("preLoad")) continue;

            await Promise.resolve(plugin.preLoad(this));

            this.emit("plugin.preLoad", plugin);
            if (this.log?.info) console.info(`[Plugin Pre-Load] ${plugin.name}`);
        }
    }

    /**
     * Runs all loaders
     */
    async load(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("load")) continue;

            await Promise.resolve(plugin.load(this));

            this.emit("plugin.load", plugin);
            if (this.log?.info) console.info(`[Plugin Load] ${plugin.name}`);
        }
    }

    /**
     * Runs all post-loaders
     */
    async postLoad(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("postLoad")) continue;

            await Promise.resolve(plugin.postLoad(this));

            this.emit("plugin.postLoad", plugin);
            if (this.log?.info) console.info(`[Plugin Post-Load] ${plugin.name}`);
        }
    }

    /**
     * Runs all pre-starters
     */
    async preStart(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("preStart")) continue;

            await Promise.resolve(plugin.preStart(this));

            this.emit("plugin.preStart", plugin);
            if (this.log?.info) console.info(`[Plugin Pre-Start] ${plugin.name}`);
        }
    }

    /**
     * Runs all starter hooks
     */
    async start(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("start")) continue;

            await Promise.resolve(plugin.start(this));

            this.emit("plugin.start", plugin);
            if (this.log?.info) console.info(`[Plugin Start] ${plugin.name}`);
        }
    }

    /**
     * Runs all post-starters
     */
    async postStart(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("postStart")) continue;

            await Promise.resolve(plugin.postStart(this));

            this.emit("plugin.postLoad", plugin);
            if (this.log?.info) console.info(`[Plugin Post-Start] ${plugin.name}`);
        }
    }

    /**
     * Runs the Ready hooks + perform some cleanup when Archivian is ready
     */
    async ready(): Promise<void> {
        for (const plugin of this.#plugins) {
            if (plugin.disabled || !plugin.hasHook("ready")) continue;

            await Promise.resolve(plugin.ready(this));

            this.emit("plugin.ready", plugin);
            if (this.log?.info) console.info(`[Plugin Ready] ${plugin.name}`);
        }

        // Cleanup plugin setup container, they're no longer needed
        this.#plugins.length = 0;

        this.emit("ready", this);
    }
}