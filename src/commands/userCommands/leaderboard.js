const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const { EMBED_COLOR } = require("../../utils/data");

const commandData = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Displays the MonadeXP leaderboard");

async function executeCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const sortedUsers = await XPModel.find().sort({ points: -1 }).limit(20);
    let display = "";
    const leaderboardEmbed = new EmbedBuilder().setTitle("Leaderboard").setColor(EMBED_COLOR);

    sortedUsers.forEach((user) => (display += `${user.user} ${user.points}\n`));
    leaderboardEmbed.addFields({ name: "Rankings", value: display });

    return await interaction.followUp({ embeds: [leaderboardEmbed] });
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
