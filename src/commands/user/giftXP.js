const { SlashCommandBuilder } = require("discord.js");
const { extractId, userExists } = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");
const XPModel = require("../../schemas/XPModel");

/**
 * Slash Command: /gift-xp [user] [amount]
 * Function: transfer `amount` xp to `user`
 *
 * case 1: Sender doesn't exist in the database
 *     --> Transfer fails
 * case 2: Sender doesn't have enough XP balance
 *     --> Transfer fails
 * case 3: Recipient doesn't exist in the database
 *     --> Register them in the database and initialize thier total points
 * case 4: Recipient exists in the database
 *     --> Fetch their point balance and increment it
 */

const commandData = new SlashCommandBuilder()
    .setName("gift-xp")
    .setDescription("Gift XP to other another user")
    .addStringOption((option) =>
        option.setName("user").setDescription("The XP recipient").setRequired(true),
    )
    .addNumberOption((option) =>
        option.setName("amount").setDescription("The XP amount").setRequired(true),
    );

// command execution
async function executeCommand(interaction, client) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.options.getString("user");
    const senderId = `<@${interaction.member.id}>`;
    const amount = interaction.options.getNumber("amount");

    // ensure amount is an integer and greater than 0
    if (!Number.isInteger(amount) || amount <= 0)
        return await interaction.followUp("Please enter a valid whole number for the amount.");

    if (userId === senderId) return await interaction.followUp("You cannot gift XP to yourself");

    // check if the userId is a valid guild member
    const exists = await userExists(client, extractId(userId));
    if (!exists) return await interaction.followUp(`${userId} doesn't exist`);

    // ensure sender exists and has enough balance
    const senderData = await findOneFromDb({ user: senderId });
    if (!senderData || senderData.points < amount)
        return await interaction.followUp(`You don't have sufficient balance`);

    // decrement the sender's balance
    senderData.points -= amount;

    // create the recipient if the userId doesn't exist in the database
    let recipientData = await findOneFromDb({ user: userId });
    !recipientData
        ? (recipientData = new XPModel({
              user: userId,
              points: amount,
          }))
        : (recipientData.points += amount); // update recipient's points if recipient exists

    const savedSenderData = await saveToDb(senderData);
    if (!savedSenderData)
        return await interaction.followUp(`Failed to gift XP due to database error`);
    const savedRecipientData = await saveToDb(recipientData);
    if (!savedRecipientData)
        return await interaction.followUp(`Failed to gift XP due to database error`);

    return await interaction.followUp(`${senderId} has gifted ${amount} XP to ${userId}.`);
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};