import type { ApplicationCore } from "../../../../../types.js";
import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

export default async function(interaction: ChatInputCommandInteraction, core: ApplicationCore) {
    const subCommand = interaction.options.getSubcommand(true);
    switch(subCommand) {
        case "channel": {
            return HandleSetBroadcastChannel(interaction, core);
        }
        case "receive-broadcasts": {
            return HandleSetBroadcastEnabled(interaction, core);
        }
    }
}


async function HandleSetBroadcastChannel(interaction: ChatInputCommandInteraction, core: ApplicationCore) {
    const channel = interaction.options.getChannel("channel", true, [0]);
    await core.getService("Guilds").setBroadcastChannel(interaction.guildId!, channel.id);

    return interaction.reply({
        content: `[OK] Broadcast channel set to <#${channel.id}>`,
        flags: MessageFlags.Ephemeral,
    });
}

async function HandleSetBroadcastEnabled(interaction: ChatInputCommandInteraction, core: ApplicationCore) {
    const newState = interaction.options.getBoolean("enabled", true);
    await core.getService("Guilds").setBroadcastEnabled(interaction.guildId!, newState);

    return interaction.reply({
        content: `[OK] Broadcast scanner set to [${newState ? 'ON' : 'OFF'}]`,
        flags: MessageFlags.Ephemeral,
    });
}