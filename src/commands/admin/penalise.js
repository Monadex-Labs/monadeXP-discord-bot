const { SlashCommandBuilder } = require("discord.js");
const { extractId, userExists, sendDirectMessage } = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");
const { ADMIN_ROLE } = require("../../utils/data");

/**
 * Slash Command: /penalise [user] [amount]
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
async function executeCommand(interaction, client) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString("user");
    const amount = interaction.options.getNumber("amount");
    const reason = interaction.options.getString("reason");

    // check if the user has the right role to use this command
    if (!interaction.member.roles.cache.some((role) => role.id === ADMIN_ROLE))
        return await interaction.followUp("You don't have permission to use this command");

    // ensure amount is an integer and greater than 0
    if (!Number.isInteger(amount) || amount <= 0)
        return await interaction.followUp("Please enter a valid whole number for the amount");

    // check if the userId is a valid guild member
    const exists = await userExists(client, extractId(userId));
    if (!exists) return await interaction.followUp(`${userId} doesn't exist`);

    // check if the user exists in the database
    const userData = await findOneFromDb({ user: userId });
    if (!userData) return await interaction.followUp(`${userId} doesn't have any XP`);
    else {
        // check if the balance is less than the penalty amount
        // if yes, penalisation fails
        if (userData.points < amount)
            return await interaction.followUp(
                `Penalty amount exceeds the ${userId}'s current balance`,
            );
        else {
            // if the user's point balance is greater than or equal to the penalisation amount
            // deduct points
            userData.points -= amount;

            const saved = await saveToDb(userData);
            if (!saved)
                return await interaction.followUp(`Failed to penalise user due to database error`);

            const reply =
                `${interaction.member.displayName} has penalised you for ${amount} MXP on the Monadex server` +
                `\nReason: ${reason}`;
            await sendDirectMessage(client, extractId(userId), reply);

            return await interaction.followUp(
                `${userId} has been penalised for ${amount} MXP\nReason for penalisation: ${reason}`,
            );
        }
    }
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
