const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const BankModel = require("../../schemas/BankModel");
const { EMBED_COLOR, LEADERBOARD_LIMIT } = require("../../utils/data");
const { getInterestAccrued } = require("../../utils/utilityFunctions");
const { findManyFromDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");

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

    // get users from the database
    let users;
    try {
        users = await findManyFromDb(XPModel);
    } catch (error) {
        console.error(error);
        return await interaction.followUp("Failed to display leaderboard due to database error");
    }

    let leaderboardEmbed = new EmbedBuilder().setTitle("Leaderboard").setColor(EMBED_COLOR);

    // add the deposited amount to the user's total point balance
    users.forEach(async (user) => {
        let userBankData = await findOneFromDb({ user: user.user }, BankModel);
        if (userBankData) {
            const interestAccrued = getInterestAccrued(
                userBankData.depositedPoints,
                Math.floor(Date.now() / 1000) - userBankData.lastDepositTimestamp,
            );
            user.points = userBankData.depositedPoints + interestAccrued;
        }
    });
    // sort users based on the amount of points they have in descending order
    users.sort((user1, user2) => -(user1.points - user2.points));

    // create a display string for the embed
    let display = "";
    for (let count = 0; count < users.length && count < LEADERBOARD_LIMIT; count++) {
        display += `${count + 1}. ${users[count].user} ${users[count].points}\n`;
    }
    leaderboardEmbed.addFields({ name: "Rankings", value: display });

    return await interaction.followUp({ embeds: [leaderboardEmbed] });
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
