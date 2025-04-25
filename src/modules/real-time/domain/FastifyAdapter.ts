/**
 * A manual implementation of fastify-socker.io since the library is not compatible with fastify v5.
 */
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import type { ServerOptions } from "socket.io";
import WSServer from "./WSServer.js";


export type FastifySocketioOptions = Partial<ServerOptions> & {
    preClose?: (done: Function) => void
}

const fastifySocketIO: FastifyPluginAsync<FastifySocketioOptions> = fp(
    async function (fastify, opts: FastifySocketioOptions) {
        function defaultPreClose(done: Function) {
            (fastify as any).io.local.disconnectSockets(true)
            done()
        }

        // @ts-expect-error - It's fine, it's a thin wrapper that just proxies the constructor args
        fastify.decorate('io', new WSServer(fastify.server, opts))
        fastify.addHook('preClose', (done) => {
            if (opts.preClose) {
                return opts.preClose(done)
            }
            return defaultPreClose(done)
        })
        fastify.addHook('onClose', (fastify: FastifyInstance, done) => {
            (fastify as any).io.close()
            done()
        })
    },
    { fastify: '>=5.x.x', name: 'fastify-socket.io' },
)

export default fastifySocketIO