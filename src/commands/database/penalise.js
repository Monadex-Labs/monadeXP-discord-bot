const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const penalise = require('../../schemas/xps');


/**
 *      
 *      / Distribute Command => return the standings of the server
 *      / PUT WRITE DATA TO THE DATABASE /Distribute [user] [number]
 *  
 */


const commandData = new SlashCommandBuilder()
    .setName('penalise')
    .setDescription('Penalise users')
    .addSubcommand(subcommand =>

        subcommand
            .setName('xp')
            .setDescription('penalise users')
            .addStringOption(option =>
                option
                    .setName('user')
                    .setDescription('which user you want to penalise')
                    .setRequired(true))
                .addNumberOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of xps you want to penalise')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('The reason of the penalisation')
                        .setRequired(true)        
            ))
            
// dont allow fractinal xps 
async function executeCommand(interaction) {
    


    const amount = interaction.options.getNumber('amount');
    const userID = interaction.options.getString('user');
    const reason = interaction.options.getString('reason');

    console.log(userID)
    // Ensure amount is an integer
    if (!Number.isInteger(amount) || amount <= 0) {
    return await interaction.reply({ content: "Please enter a valid number for the amount.", ephemeral: true });
    }
    
    // check if the user exist | check if is balance > 0 
    const balance = await penalise.findOne({ user: userID });
    if (balance === null) {
        await interaction.reply(` ${userID}! he don't exist in the database`);
    } else {

        if (balance.points < amount) {
            await interaction.reply(` ${userID}! has ${balance.points} Xps, he don't have enough Xps to be penalised`);
        } else {
            await penalise.updateOne({ user: userID }, { $inc: { points: -amount } });
            await interaction.reply({ content: `${userID}! has been penalised by ${amount} Xps, reason : ${reason}`,  ephemeral: true});
        }
    }
}


module.exports = {
    data: commandData,
    execute: executeCommand
}