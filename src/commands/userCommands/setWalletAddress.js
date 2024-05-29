const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * Slash Command: /setWalletAddress [user]
 * Function: Sets your wallet address
 *
 * case 1: User doesn't exist
 *     --> Register their entry with their wallet address
 * case 2: User exists in the database
 *     --> Update their wallet address
 */

const commandData = new SlashCommandBuilder()
    .setName("set-wallet-address")
    .setDescription("Set your wallet address")
    .addStringOption((option) =>
        option.setName("address").setDescription("The user's wallet address").setRequired(true),
    );

async function executeCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const walletAddress = interaction.options.getString("address");
    const userID = `<@${interaction.member.id}>`;

    let userData = await XPModel.findOne({ user: userID });
    if (!userData) {
        userData = new XPModel({
            guild: interaction.guild.id,
            user: userID,
            points: 0,
            walletAddress,
        });
    } else {
        userData.walletAddress = walletAddress;
    }

    userData.save();

    return await interaction.followUp(`${userID}'s wallet address successfully updated`);
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
