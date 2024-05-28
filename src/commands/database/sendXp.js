const { SlashCommandBuilder } = require('discord.js');
const send = require('../../schemas/xps');


/**
 *      
 *      / send Command => send Xp to a user
 *      / PUT FROM THE DATABASE INCREMENT OTHER USER XP BALANCE
 *  
 */

const commandData = new SlashCommandBuilder()
    .setName('send')
    .setDescription('send xps to other users if you want')
    .addStringOption(option =>
        option
            .setName('user')
            .setDescription('The user you want to gift your Xps to')
            .setRequired(true))
    .addNumberOption(option =>
        option
            .setName('amount')
            .setDescription('The amount of xps you want to reward')
            .setRequired(true)
    )

async function executeCommand(interaction) {
    
    const amount = interaction.options.getNumber('amount');
    const userID = interaction.options.getString('user');
    
    // Ensure amount is an integer
    if (!Number.isInteger(amount) || amount <= 0) {
        return await interaction.reply({ content: "Please enter a valid whole number for the amount.", ephemeral: true });
    }
    if(amount > 100){
        return await interaction.reply({ content: "you can only send 100 Xps at a time", ephemeral: true });
    }
    
    // check if the user has enough points before trandsfering them
    const { user } = interaction;
    const xp=  await send.findOne({user: `<@${user.id}>`})
    
    if(xp.points < amount) {
        await interaction.reply(`Gmonad ${user.displayName}! you don't have enough Xps`);
    }

    // create if the useriD is not exist on the db or update if it exist
    if(await send.findOne({user: userID})) {
        await send.updateOne({user: userID}, {$inc: {points: amount}});
        
        // decrement the sender balance
        await send.updateOne({user: `<@${user.id}>`}, {$inc: {points: -amount}});
    } else {

        await send.create({
            Guild :interaction.guild.id,
            user: userID,
            points : amount
        })
        // decrement the sender balance
        await send.updateOne({user: `<@${user.id}>`}, {$inc: {points: -amount}});
    }

    await interaction.reply({content :`You have sent ${amount} XP to ${userID}.`, ephemeral: true });
}

module.exports = {
    data: commandData,
    execute: executeCommand

}