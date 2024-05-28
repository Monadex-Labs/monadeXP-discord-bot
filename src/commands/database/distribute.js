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


    // Exporting module
module.exports = {
    data: commandData,
};
