const { SlashCommandBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const { ADMIN_ROLE } = require("../../utils/data");

/**
 * Slash Command: /penalise xp [user] [amount]
 * Function: Applies a penalty of `amount` xp on `user`
 *
 * case 1: User doesn't exist in the database
 *     --> No penalty is applicable
 * case 2: User's current balance is lesser than the penalty amount
 *     --> Penalisation fails
 * case 3: User's current balance is greater than or equal to the penalty amount
 *     --> Penalisation succeeds
 */

const commandData = new SlashCommandBuilder()
    .setName("penalise")
    .setDescription("Penalise a single user")
    .addStringOption((option) =>
        option.setName("user").setDescription("The user to penalize").setRequired(true),
    )
    .addNumberOption((option) =>
        option.setName("amount").setDescription("The penalty amount").setRequired(true),
    )
    .addStringOption((option) =>
        option.setName("reason").setDescription("The penalisation reason").setRequired(true),
    );

// command execution
async function executeCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userID = interaction.options.getString("user");
    const amount = interaction.options.getNumber("amount");
    const reason = interaction.options.getString("reason");

    // check if the user has the right role to use this command
    if (!interaction.member.roles.cache.some((role) => role.id === ADMIN_ROLE))
        return await interaction.followUp("You don't have permission to use this command");

    // ensure amount is an integer
    if (!Number.isInteger(amount) || amount <= 0)
        return await interaction.followUp("Please enter a valid whole number for the amount.");

    // check if the user exists
    const userData = await XPModel.findOne({ user: userID });
    if (!userData) {
        return await interaction.followUp(`${userID}'s balance is 0`);
    } else {
        // check if the balance is greater than or equal to the penalty amount
        if (userData.points < amount)
            return await interaction.followUp(
                `Penalty amount exceeds the ${userID}'s current balance`,
            );
        else {
            userData.points -= amount;
            await userData.save();

            return await interaction.followUp(
                `${userID} has been penalised for ${amount} XP\nReason for penalisation: ${reason}`,
            );
        }
    }
}

module.exports = {
    data: commandData,
    execute: executeCommand,
};
