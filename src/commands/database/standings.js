const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const standing = require('../../schemas/xps');


/**
 *      
 *      / Standings Command => return the standings of the server
 *      / GET DATA FROM THE DATABASE
 *  
 */ 

const commandData = new SlashCommandBuilder()
    .setName('standings')
    .setDescription('standings of the server')





    // Exporting module
module.exports = {
    data: commandData,
};
