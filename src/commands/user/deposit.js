const { SlashCommandBuilder } = require("discord.js");
const XPModel = require("../../schemas/XPModel");
const BankModel = require("../../schemas/BankModel");
const { isValidNumber, getInterestAccrued } = require("../../utils/utilityFunctions");
const { saveToDb, findOneFromDb } = require("../../utils/dbUtilityFunctions");

/**
 * Slash Command: /deposit [amount]
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
    .setName("deposit")
    .setDescription("Deposit MXP into the bank and earn interest")
    .addNumberOption((option) => option.setName("amount").setDescription("The MXP amount"));

// command execution
async function executeCommand(interaction) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });

    const userId = `<@${interaction.member.id}>`;
    let amount = interaction.options.getNumber("amount");

    // check if the user exists
    const userData = await findOneFromDb({ user: userId }, XPModel);
    if (!userData) return await interaction.followUp("You don't have sufficient balance");

    if (!amount) amount = userData.points;

    // ensure amount is an integer and greater than 0
    if (!isValidNumber(amount))
        return await interaction.followUp("Please enter a valid whole number for the amount");

    // check if the user has sufficient balance
    if (userData.points < amount)
        return await interaction.followUp("You don't have sufficient balance");

    // deduct deposit amount
    userData.points -= amount;
    const saved = await saveToDb(userData);
    if (!saved) return await interaction.followUp(`Failed to allocate MXP due to database error`);

    // deposit into the bank
    let userBankData = await findOneFromDb({ user: userId }, BankModel);
    if (!userBankData)
        userBankData = new BankModel({
            user: userId,
            depositedPoints: amount,
            lastDepositTimestamp: Math.floor(Date.now() / 1000),
        });
    else {
        // add the interest accrued to the last deposit amount
        const interestAccrued = getInterestAccrued(
            userBankData.depositedPoints,
            Math.floor(Date.now() / 1000) - userBankData.lastDepositTimestamp,
        );
        userBankData.depositedPoints += interestAccrued;
        userBankData.depositedPoints += amount;

        // update the timestamp
        userBankData.lastDepositTimestamp = Math.floor(Date.now() / 1000);
    }

    const bankDataSaved = await saveToDb(userBankData);
    if (!bankDataSaved)
        return await interaction.followUp(`Failed to allocate MXP due to database error`);

    return await interaction.followUp(`${userId}, you have deposited ${amount} MXP into the bank`);
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
