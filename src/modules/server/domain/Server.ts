import type { AuthHandler, HTTPReply, HTTPRequest, HTTPServer, RouteFunction } from "../types.js";
import type { ApplicationCore } from "../../../types.ts";
import fastify, { type FastifyInstance } from "fastify";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";


export default class Server {
    private server: FastifyInstance;
    private port: number;
    private host: string;
    #routeFactories: RouteFunction<HTTPServer>[] = [];

    constructor(port: number = 3000, host: string = "0.0.0.0") {
        this.port = port;
        this.host = host;
        this.server = fastify({
            logger: true,
        }).withTypeProvider<JsonSchemaToTsProvider>();
    }

    async start(): Promise<void> {
        try {
            await this.server.listen({port: this.port, host: this.host});
            console.log(`Server is running on ${this.host}:${this.port}`);
        } catch (err) {
            this.server.log.error(err);
            process.exit(1);
        }
    }

    async stop(): Promise<void> {
        try {
            await this.server.close();
            console.log("Server stopped");
        } catch (err) {
            this.server.log.error(err);
            process.exit(1);
        }
    }

    getInstance(): FastifyInstance {
        return this.server;
    }

    /**
     * Starts the loading of registered routes
     */
    loadRoutes(core: ApplicationCore): void {
        this.server.decorate("core", core);

        while (this.#routeFactories.length) {
            const routeFactory = this.#routeFactories.pop();
            if (!routeFactory) continue;
            this.server.register(routeFactory);
        }
    }

    /**
     * Register a req/res decorator
     */
    registerDecorator(key: string | symbol, value: any): void {
        this.server.decorate(key, value);
    }

    /**
     * Register decorator
     */
    registerRequestDecorator(key: string | symbol, value: any): void {
        this.server.decorateRequest(key, value);
    }

    /**
     * Register routes using a route factory (Full Declaration, NOT shorthand ones!)
     * @see https://fastify.dev/docs/latest/Reference/Routes#full-declaration
     */
    registerRoute(route: RouteFunction<HTTPServer>): void {
        this.#routeFactories.push(route);
    }

    /**
     * Register an auth-hook to use on the current route and any sub-routes registered
     * @param authHandler
     */
    useAuth(authHandler: AuthHandler) {
        this.server.addHook("onRequest", async (req, res) => {
            if (!req.routeOptions.config.jwtAuth) return console.log("No config");
            // @ts-expect-error - Should be fine
            await authHandler(req, res);
        });
    }
}