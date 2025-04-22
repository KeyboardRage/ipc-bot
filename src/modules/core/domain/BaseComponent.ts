import { EventEmitter } from "eventemitter3";
import type { ValidEvents } from "../types";

/**
 * This is the base of every library package, component, and the core.
 * It exists for two purposes:
 * 1. Proxy to underlying EventEmitter we decide to use
 *      We simply extend the EventEmitter we decide to use, allowing us to easily swap to
 *      another or the Node.JS native one, without replacing it everywhere.
 *      Of course, methods may be different, but we can proxy that too, but usually they are
 *      made to be hot-swappable.
 * 2. To expose hooks for anything else to tap into
 *      Libraries, the core, and components may want to let us know when things happen,
 *      meaning we can also have an event-driven architecture. This will be nice for optimizations,
 *      such as when an HTTP response should be given, but we don't need to wait for processing in
 *      another service to complete.
 */
/**
 * The base component used by all packages and components.
 */
export default class BaseComponent<T extends ValidEvents> extends EventEmitter<T> {
    constructor() {
        super();
    }
}