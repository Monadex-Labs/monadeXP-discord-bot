const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
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
async function executeCommand(interaction) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    let userID = interaction.options.getString("user");
    if (!userID) userID = `<@${interaction.member.id}>`;

    let userData = await XPModel.findOne({ user: userID });
    if (!userData)
        userData = new XPModel({
            guild: interaction.guild.id,
            user: userID,
            points: 0,
        });
    await userData.save();

    const profileEmbed = new EmbedBuilder()
        .setTitle("Profile")
        .setColor(EMBED_COLOR)
        .addFields({ name: "User", value: `${userID}` })
        .addFields({ name: "Points", value: `${userData.points}` })
        .addFields({ name: "Wallet Address", value: `${userData.walletAddress ?? ZERO_ADDRESS}` });

    return await interaction.followUp({ embeds: [profileEmbed] });
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
