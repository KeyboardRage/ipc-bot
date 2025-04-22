import type { ApplicationCore } from "../../../../../types";
import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

export default async function(interaction: ChatInputCommandInteraction, core: ApplicationCore) {
    const key = await core.getService("Auth").getAuthKey({
        id: interaction.user.id,
        // @ts-expect-error - It exists, but might be null
        nickname: interaction.member.nickname,
        username: interaction.user.username,
        globalName: interaction.user.globalName || interaction.user.username,
    });

    return interaction.reply({
        content: `Here's your secret key
DO NOT SHARE THIS WITH ANYONE!
\`\`\`${key}\`\`\``,
        flags: MessageFlags.Ephemeral,
    });
}