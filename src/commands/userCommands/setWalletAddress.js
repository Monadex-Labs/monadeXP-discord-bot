const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
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
    const userID = `<@${interaction.member.id}>`;

    let userData = await XPModel.findOne({ user: userID });
    !userData
        ? (userData = new XPModel({
              guild: interaction.guild.id,
              user: userID,
              points: 0,
              walletAddress,
          }))
        : (userData.walletAddress = walletAddress);

    userData.save();

    return await interaction.followUp(`${userID}'s wallet address successfully updated`);
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
