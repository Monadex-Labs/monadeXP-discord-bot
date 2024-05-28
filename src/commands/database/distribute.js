const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const distribution = require('../../schemas/xps');


/**
 *      
 *      / Distribute Command => return the standings of the server
 *      / PUT WRITE DATA TO THE DATABASE /Distribute [user] [number]
 *  
 */


const commandData = new SlashCommandBuilder()
    .setName('distribute')
    .setDescription('Distribute XP to users')
    .addSubcommand(subcommand =>

        subcommand
            .setName('xp')
            .setDescription('distribute XP to users')
            .addStringOption(option =>
                option
                    .setName('user')
                    .setDescription('The message that gonna be sent. Note: use {member} to ping and (member) to show username')
                    .setRequired(true))
                    .addNumberOption(option => 
                        option
                                    .setName('amount')
                                    .setDescription('The amount of xps you want to reward')
                                    .setRequired(true)
                                ))


                    

// Command execution
async function executeCommand(interaction) {
    
    // Check if the user has permission to use this command to distribute XPs
    console.log("sosos",interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({ content: "You don't have permission to use this command", ephemeral: true });
    }


    const amount = interaction.options.getNumber('amount');
    const userID = interaction.options.getString('user');

    await distribution.create({

        Guild: interaction.guild.id,
        user: userID,
        points : amount 

    });
    
    await interaction.reply(`You have sent ${amount} XP to ${userID}.`);
}



// Exporting module
module.exports = {
    data: commandData,
    execute: executeCommand
};
