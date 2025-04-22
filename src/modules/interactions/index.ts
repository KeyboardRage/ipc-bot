import type {ServiceMap} from "../../types";
import Plugin from "../core/domain/Plugin";
import InteractionService from './domain/InteractionService';
import * as InteractionDefinitions from "./entry-point";

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