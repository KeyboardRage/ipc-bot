import type {ServiceMap} from "../../types.js";
import Plugin from "../core/domain/Plugin.js";
import InteractionService from './domain/InteractionService.js';
import * as InteractionDefinitions from "./entry-point/index.js";

export {
    InteractionService,
};

export default function() {
    return new Plugin<ServiceMap>("Interactions", {
        load(core) {
            const interactions = new InteractionService({ core });

            // Set up slash commands
            for (const SlashCommand of Object.values(InteractionDefinitions.Slash)) {
                interactions.registerCommand(SlashCommand);
            }

            core.registerService("Interactions", interactions);
        },
        postLoad(core) {
            core.getService("Interactions").loadHandlers();
        },
        start(core) {
            return core.getService("Interactions").uploadCommands();
        }
    });
}