const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const Xps = require('../../schemas/xps');


/**
 *      
 *      / XP Command => return the XP of the user 
 *      / GET DATA FROM THE DATABASE 
 *  
 */ 

    // Exporting module
    module.exports = {
        /**
         *      
         *      / Standings Command => return the standings of the server
         *      / GET DATA FROM THE DATABASE
         *  
         */ 
        
        data: new SlashCommandBuilder()
            .setName('xp')
            .setDescription('return xp of the nad'),
        
        
            async execute(interaction) {
                const { user } = interaction; `<@>`
                const xp=  await Xps.findOne({user: `<@${user.id}>`})
                console.log("xps", xp)
                await interaction.reply(`Hello ${user.displayName}! you have ${xp.points} Xps`);
            }    
        };
