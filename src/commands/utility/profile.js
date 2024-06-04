const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const BankModel = require("../../schemas/BankModel");
const { extractId, userExists, getInterestAccrued } = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const { EMBED_COLOR } = require("../../utils/data");

/**
 * Slash Command: /profile [user] (optional)
 * Function: View your or other's XP balance
 *
 * case 1: User doesn't exist in the database
 *     --> Register them in the database and display their profile
 * case 2: User exists in the database
 *     --> Display their stats
 */

const commandData = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Get your stats for the MonadeXP program")
    .addStringOption((option) => option.setName("user").setDescription("The user's discord ID"));

// command execution
async function executeCommand(interaction, client) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    let userId = interaction.options.getString("user");
    if (!userId) userId = `<@${interaction.member.id}>`;

    // check if the userId is a valid guild member
    const exists = await userExists(client, extractId(userId));
    if (!exists) return await interaction.followUp(`${userId} doesn't exist`);

    let userData = await findOneFromDb({ user: userId }, XPModel);
    if (!userData)
        userData = new XPModel({
            user: userId,
            points: 0,
        });
    await saveToDb(userData);

    let userBankData = await findOneFromDb({ user: userId }, BankModel);
    let depositedAmount = 0;
    let interestAccrued = 0;
    if (userBankData) {
        depositedAmount = userBankData.depositedPoints;
        interestAccrued = getInterestAccrued(
            userBankData.depositedPoints,
            Math.floor(Date.now() / 1000) - userBankData.lastDepositTimestamp,
        );
    }

    const userAvatarUrl = (await client.users.fetch(extractId(userId))).displayAvatarURL();
    const profileEmbed = new EmbedBuilder()
        .setTitle("Profile")
        .setColor(EMBED_COLOR)
        .setThumbnail(userAvatarUrl)
        .addFields({ name: "User", value: `${userId}` })
        .addFields({ name: "MXP", value: `${userData.points}` })
        .addFields({ name: "Bank Deposit", value: `${depositedAmount}` })
        .addFields({ name: "Interest Accrued", value: `${interestAccrued}` })
        .addFields({
            name: "Wallet Address",
            value: `${userData.walletAddress ?? ZERO_ADDRESS}`,
        });

    return await interaction.followUp({ embeds: [profileEmbed] });
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
