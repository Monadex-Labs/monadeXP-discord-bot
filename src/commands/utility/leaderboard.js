const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const { EMBED_COLOR, LEADERBOARD_LIMIT } = require("../../utils/data");

/**
 * Slash Command: /leaderboard
 * Function: Display MonadeXP leaderboard
 */

const commandData = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Displays the MonadeXP leaderboard");

// command execution
async function executeCommand(interaction) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    // get 20 users with the highest XP from the database
    let sortedUsers;
    try {
        sortedUsers = await XPModel.find().sort({ points: -1 }).limit(LEADERBOARD_LIMIT);
    } catch (error) {
        console.error(error);
        return await interaction.reply("Failed to display leaderboard due to database error");
    }

    let display = "";
    const leaderboardEmbed = new EmbedBuilder().setTitle("Leaderboard").setColor(EMBED_COLOR);
    let count = 1;

    sortedUsers.forEach((user) => {
        display += `${count}. ${user.user} ${user.points}\n`;
        count++;
    });
    leaderboardEmbed.addFields({ name: "Rankings", value: display });

    return await interaction.followUp({ embeds: [leaderboardEmbed] });
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
