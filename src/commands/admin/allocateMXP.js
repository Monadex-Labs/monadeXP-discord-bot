const { SlashCommandBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const {
    extractId,
    isValidNumber,
    userExists,
    sendDirectMessage,
    hasPermission,
} = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");

/**
 * Slash Command: /allocate-mxp [user] [amount]
 * Function: Allocates `amount` xp to `user`
 *
 * case 1: Recipient doesn't exist in the database
 *     --> Register them in the database and initialise thier total points
 * case 2: Recipient exists in the database
 *     --> Fetch existing data from database and increment their total points
 */

const commandData = new SlashCommandBuilder()
    .setName("allocate-mxp")
    .setDescription("Allocate   MXP to a single user")
    .addStringOption((option) =>
        option.setName("user").setDescription("The MXP recipient").setRequired(true),
    )
    .addNumberOption((option) =>
        option.setName("amount").setDescription("The MXP amount").setRequired(true),
    );

// command execution
async function executeCommand(interaction, client) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString("user");
    const amount = interaction.options.getNumber("amount");

    // check if the user has the right role to use this command
    if (!hasPermission(interaction))
        return await interaction.followUp("You don't have permission to use this command");

    // ensure amount is an integer and greater than 0
    if (!isValidNumber(amount))
        return await interaction.followUp("Please enter a valid whole number for the amount");

    // check if the userId is a valid guild member
    const exists = await userExists(client, extractId(userId));
    if (!exists) return await interaction.followUp(`${userId} doesn't exist`);

    // create user if the userId doesn't exist on the database
    let userData = await findOneFromDb({ user: userId }, XPModel);
    !userData
        ? (userData = new XPModel({
              user: userId,
              points: amount,
          }))
        : (userData.points += amount); // or update, if it exists

    // save data to database
    const saved = await saveToDb(userData);
    if (!saved) return await interaction.followUp(`Failed to allocate MXP due to database error`);

    // notify the user about the MXP allocation
    const reply = `${interaction.member.displayName} has allocated ${amount} MXP to you on the Monadex server`;
    await sendDirectMessage(client, extractId(userId), reply);

    return await interaction.followUp(
        `<@${interaction.member.id}>, you have sent ${amount} MXP to ${userId}`,
    );
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
