const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const standing = require('../../schemas/xps');





    // Exporting module
module.exports = {
/**
 *      
 *      / Standings Command => return the standings of the server
 *      / GET DATA FROM THE DATABASE
 *  
 */ 

data: new SlashCommandBuilder()
    .setName('standings')
    .setDescription('return the standings of the server'),


    async execute(interaction) {
        const stand = [];

        // return all the data on the DataBase of every user => Will need a upgrade on MongoDB servers to have more Storage
        const data = await standing.find({});

        // loop through the data
        data.map((value) => {
            // filter the object
            const { user, points } = value;
            
            stand.push({ user, points });
            // push the data in an array
        
        })
        console.log(stand)
    }    
};
