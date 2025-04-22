import type { ApplicationCore } from "../../../../../index";
import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

export default async function(interaction: ChatInputCommandInteraction, core: ApplicationCore) {
    const channelIds = await core.getService("Guilds").getBroadcastChannels({ exceptIds: [interaction.guildId!] });
    if (!channelIds.length) {
        return await interaction.reply({
            content: `Broadcast terminated early. No hubs online.`,
            flags: MessageFlags.Ephemeral,
        });
    }

    const message = interaction.options.getString("message");
    console.log(message);
    if (!message || !message.trim()) return interaction.reply({
        content: `Broadcast terminated early. No message provided.`,
        flags: MessageFlags.Ephemeral,
    });

    await interaction.reply({
        content: `Transmitting broadcast to ${channelIds.length} hubs`,
        flags: MessageFlags.Ephemeral,
    });

    core.getService("Discord").queueBulkSend(channelIds, {
        content: message,
    });
}