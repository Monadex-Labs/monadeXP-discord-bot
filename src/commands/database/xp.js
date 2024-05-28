const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const Xps = require('../../schemas/xps');


/**
 *      
 *      / XP Command => return the XP of the user 
 *      / GET DATA FROM THE DATABASE 
 *  
 */ 

const commandData = new SlashCommandBuilder()
    .setName('xp')
    .setDescription('return XP of the nads')





    // Exporting module
module.exports = {
    data: commandData,
};
