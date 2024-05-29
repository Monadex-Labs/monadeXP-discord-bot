const { SlashCommandBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const { ADMIN_ROLE } = require("../../utils/data");

/**
 * Slash Command: /allocate xp [user] [amount]
 * Function: Allocates `amount` xp to `user`
 *
 * case 1: Recipient doesn't exist in the database
 *     --> Register them in the database and increment thier total points
 * case 2: Recipient exists in the database
 *     --> Fetch existing data from database and increment the points
 */

const commandData = new SlashCommandBuilder()
    .setName("allocate-xp")
    .setDescription("Allocate XP to a single user")
    .addStringOption((option) =>
        option.setName("user").setDescription("The XP recipient").setRequired(true),
    )
    .addNumberOption((option) =>
        option.setName("amount").setDescription("The XP amount").setRequired(true),
    );

// command execution
async function executeCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userID = interaction.options.getString("user");
    const amount = interaction.options.getNumber("amount");

    // check if the user has the right role to use this command
    if (!interaction.member.roles.cache.some((role) => role.id === ADMIN_ROLE)) {
        return await interaction.followUp("You don't have permission to use this command");
    }

    // ensure amount is an integer and greater than 0
    if (!Number.isInteger(amount) || amount <= 0) {
        return await interaction.followUp("Please enter a valid whole number for the amount");
    }

    // create user if the userID doesn't exist on the database
    // or update, if it exists
    let userData = await XPModel.findOne({ user: userID });
    if (!userData) {
        userData = new XPModel({
            guild: interaction.guild.id,
            user: userID,
            points: amount,
        });
    } else {
        userData.points += amount;
    }

    await userData.save();

    return await interaction.followUp(
        `<@${interaction.member.id}> has sent ${amount} XP to ${userID}`,
    );
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
