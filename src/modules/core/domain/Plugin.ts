import type AppCore from "./AppCore.js";

export interface PluginHooks<T> {
    /**
     * A hook to call before we execute loading.
     */
    preLoad(core: AppCore<T>): void | Promise<void>;

    /**
     * Handles loading the service/component into Archivian.
     */
    load(core: AppCore<T>): void | Promise<void>;

    /**
     * A hook to call after executing loading.
     */
    postLoad(core: AppCore<T>): void | Promise<void>;

    /**
     * A hook to call before starting up services.
     */
    preStart(core: AppCore<T>): void | Promise<void>;

    /**
     * A hook for starting, usually starting services, like execute connecting to a database and such
     */
    start(core: AppCore<T>): void | Promise<void>;

    /**
     * A hook to call after starting up services.
     */
    postStart(core?: AppCore<T>): void | Promise<void>;

   /**
     * A hook to call after everything, when the core is ready.
     */
    ready(core: AppCore<T>): void | Promise<void>;

    /**
     * A special hook to call if we want to stop the entire server, or this particular plugin.
     * @param core The core instance
     * @param forceStop Whether we want to try normal graceful shutdown, or if we want to force-close it.
     * Implementation of the force stop is up to this plugin—if it is applicable.
     */
    stop(core: AppCore<T>, forceStop?: boolean): void | Promise<void>;
}

export default class Plugin<T> {
    /**
     * Whether this plugin is temporarily disabled.
     * If true, it will not be loaded, even if you try to.
     * **Default**: false
     */
    disabled: boolean;
    /**
     * Arbitrary name for this plugin.
     * Mostly just meant in case of errors during loading.
     */
    name: string;
    /**
     * Handlers for the hooks you want to use.
     */
    hooks: Partial<PluginHooks<T>>;

    constructor(name: string, hooks: Partial<PluginHooks<T>>, disabled: boolean = false) {
        this.disabled = disabled;
        this.name = name;
        this.hooks = hooks;
    }

    /**
     * Checks to see if a hook is defined
     */
    hasHook(hookName: keyof PluginHooks<T>): boolean {
        return (hookName in this.hooks);
    }

    async preLoad(core: AppCore<T>): Promise<void> {
        if ("preLoad" in this.hooks) await this.hooks.preLoad!(core);
    }

    async load(core: AppCore<T>): Promise<void> {
        if ("load" in this.hooks) await this.hooks.load!(core);
    }

    async postLoad(core: AppCore<T>): Promise<void> {
        if ("postLoad" in this.hooks) await this.hooks.postLoad!(core);
    }

    async preStart(core: AppCore<T>): Promise<void> {
        if ("preStart" in this.hooks) await this.hooks.preStart!(core);
    }

    async start(core: AppCore<T>): Promise<void> {
        if ("start" in this.hooks) await this.hooks.start!(core);
    }

    async postStart(core: AppCore<T>): Promise<void> {
        if ("postStart" in this.hooks) await this.hooks.postStart!(core);
    }

    async ready(core: AppCore<T>): Promise<void> {
        if ("ready" in this.hooks) await this.hooks.ready!(core);
    }

    async stop(core: AppCore<T>, forceStop?: boolean): Promise<void> {
        if ("stop" in this.hooks) await this.hooks.stop!(core, forceStop);
    }
}