const { SlashCommandBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const BankModel = require("../../schemas/BankModel");
const { isValidNumber, getInterestAccrued } = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");

/**
 * Slash Command: /withdraw [amount]
 * Function: Deposit `amount` mxp in the bank to accrue interest over time
 *
 * case 1: User doesn't exist in the database
 *     --> Deposit fails
 * case 2: User exists in the database but their points are less than the deposit amount
 *     --> Deposit fails
 * case 3: User exists in the database and their points are more than the deposit amount
 *     --> Deposit succeeds
 */

const commandData = new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw MXP from the bank")
    .addNumberOption((option) => option.setName("amount").setDescription("The MXP amount"));

// command execution
async function executeCommand(interaction) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    const userId = `<@${interaction.member.id}>`;
    let amount = interaction.options.getNumber("amount");

    // check if the user has bank balance
    let userBankData = await findOneFromDb({ user: userId }, BankModel);
    if (!userBankData) return await interaction.followUp("You don't have sufficient balance");
    userBankData.depositedPoints += getInterestAccrued(
        userBankData.depositedPoints,
        Math.floor(Date.now() / 1000) - userBankData.lastDepositTimestamp,
    );
    userBankData.lastDepositTimestamp = Math.floor(Date.now() / 1000);
    if (!amount) amount = Math.floor(userBankData.depositedPoints);

    // ensure amount is an integer and greater than 0
    if (!isValidNumber(amount))
        return await interaction.followUp("Please enter a valid whole number for the amount");

    // check if the user has sufficient balance
    if (userBankData.depositedPoints < amount)
        return await interaction.followUp("Withdraw amount exceeds balance");

    // withdraw points
    const userData = await findOneFromDb({ user: userId }, XPModel);
    if (!userData)
        return await interaction.followUp("Failed to withdraw MXP due to database error");
    userData.points += amount;
    userBankData.depositedPoints -= amount;

    // save to database
    const saved = await saveToDb(userData);
    if (!saved) return await interaction.followUp("Failed to withdraw MXP due to database error");

    const bankDataSaved = await saveToDb(userBankData);
    if (!bankDataSaved)
        return await interaction.followUp("Failed to withdraw MXP due to database error");

    return await interaction.followUp(`${userId}, you have withdrawn ${amount} MXP from the bank`);
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
