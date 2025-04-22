import type { ApplicationCore } from "../../../types.js";
import { Routes } from "discord-api-types/v10";
import { Events } from "discord.js";

export interface IInteractionServiceDependencies {
    core: ApplicationCore;
}

export default class InteractionService {
    core: ApplicationCore;
    commands: Map<string, any> = new Map();
    handlers: Map<string, Function> = new Map();

    constructor(dep: IInteractionServiceDependencies) {
        this.core = dep.core;
    }

    loadHandlers() {
        this.core
            .getService("Bot")
            .on(Events.InteractionCreate, async interaction => {
                if (!interaction.isChatInputCommand()) return;

                if (this.handlers.has(interaction.commandName)) {
                    return await this.handlers.get(interaction.commandName)!(interaction, this.core);
                }
            });
    }

    async uploadCommands() {
        const commands = Array.from(this.commands.values());
        await this.core.getService("REST").put(Routes.applicationCommands(process.env.BOT_ID), { body: commands });
    }

    registerCommand(cmd: {command:{name: string; description: string;}, handler: Function}) {
        this.handlers.set(cmd.command.name, cmd.handler);
        this.commands.set(cmd.command.name, cmd.command);
    }
}