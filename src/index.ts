import type { AnyOriginalError } from "./types";
export * from "./types";
import start from "./main";

// TODO Set up shorthand aliases for /modules folder in package.json

start()
    .then(core => {
        // Graceful shutdown
        process.on("SIGTERM", async () => {
            await core.stop();
            process.exit(0);
        });
        process.on("SIGINT", async (s) => {
            await core.stop();
            process.exit(s);
        });
        process.on("unhandledRejection", (reason: AnyOriginalError) => {
            core.getService("ErrorService").captureException(reason, reason);

            if ("critical" in reason) process.exit(1);
        });
        process.on("uncaughtException", (reason: AnyOriginalError) => {
            core.getService("ErrorService").captureException(reason, reason);

            if ("critical" in reason) process.exit(1);
        });
        process.on("unhandledRejection", (reason: AnyOriginalError) => {
            core.getService("ErrorService").captureException(reason, reason);

            if ("critical" in reason) process.exit(1);
        });
    })
    .catch(err => {
        console.error(err);
    });

// https://discord.com/oauth2/authorize?client_id=1364005281398390855&permissions=277025704000&integration_type=0&scope=bot