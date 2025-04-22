import type { AuthHandler } from "../../server/types.js";
import type { ApplicationCore } from "../../../types.js";

export default function(core: ApplicationCore) {
    /**
     * This function is only executed if the onRequest handler checked that it needs to run this auth.
     */
    const handler: AuthHandler = async (req, res) => {
        if (!req.headers.authorization) {
            throw new Error("Missing authorization header");
        }
        if (!req.headers.authorization.toLowerCase().startsWith("bearer ")) {
            throw new Error("Invalid authorization header");
        }

        const token = req.headers.authorization.slice("bearer ".length);
        const decoded = core.getService("Auth").parse(token);
        if (decoded === null) throw new Error("Invalid token");

        req.user = decoded;
    };

    return handler;
}