const { SlashCommandBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");

/**
 * Slash Command: /send-xp [user] [amount]
 * Function: transfer `amount` xp to `user`
 *
 * case 1: Sender doesn't exist in the database
 *     --> Transfer fails
 * case 2: Sender doesn't have enough XP balance
 *     --> Transfer fails
 * case 3: Recipient doesn't exist in the database
 *     --> Register their entry in the database and increment thier total points
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

async function executeCommand(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const userID = interaction.options.getString("user");
    const senderID = `<@${interaction.member.id}>`;
    const amount = interaction.options.getNumber("amount");

    // ensure amount is an integer
    if (!Number.isInteger(amount) || amount <= 0)
        return await interaction.followUp("Please enter a valid whole number for the amount.");

    if (userID === senderID) return await interaction.followUp("You cannot gift XP to yourself");

    // ensure sender exists and has enough balance
    const senderData = await XPModel.findOne({ user: senderID });
    if (!senderData || senderData.points < amount) {
        return await interaction.followUp(`You don't have sufficient balance`);
    }

    // create the recipient if the userID doesn't exist in the database
    // or update if it exists
    let recipientData = await XPModel.findOne({ user: userID });
    if (!recipientData) {
        recipientData = new XPModel({
            guild: interaction.guild.id,
            user: userID,
            points: amount,
        });
    } else {
        recipientData.points += amount;
    }

    // decrement the sender's balance
    senderData.points -= amount;
    await senderData.save();
    await recipientData.save();

    return await interaction.followUp(`${senderID} has gifted ${amount} XP to ${userID}.`);
}

module.exports = {
    data: commandData,
    execute: executeCommand,
};