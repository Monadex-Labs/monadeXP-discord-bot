const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const { extractId, userExists } = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Slash Command: /setWalletAddress [address]
 * Function: Sets your wallet address
 *
 * case 1: User doesn't exist
 *     --> Register them with their wallet address in the database
 * case 2: User exists in the database
 *     --> Update their wallet address
 */

const commandData = new SlashCommandBuilder()
    .setName("set-wallet-address")
    .setDescription("Set your wallet address")
    .addStringOption((option) =>
        option.setName("address").setDescription("The user's wallet address").setRequired(true),
    );

// command execution
async function executeCommand(interaction) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    const walletAddress = interaction.options.getString("address");
    const userId = `<@${interaction.member.id}>`;

    let userData = await findOneFromDb({ user: userId });
    !userData
        ? (userData = new XPModel({
              user: userId,
              points: 0,
              walletAddress,
          }))
        : (userData.walletAddress = walletAddress);

    const saved = await saveToDb(userData);
    if (!saved)
        return await interaction.followUp(`Cannot update wallet address due to database error`);

    return await interaction.followUp(`${userId}'s wallet address was successfully updated`);
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
