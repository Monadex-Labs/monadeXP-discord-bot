const { SlashCommandBuilder } = require('discord.js');
const standing = require('../../schemas/xps');




    /**
     *      
     *      / Standings Command => return the standings of the server
     *      / GET DATA FROM THE DATABASE
     *  
     */


// Exporting module
module.exports = {

    data: new SlashCommandBuilder()
        .setName('standings')
        .setDescription('return the standings of the server'),

    async execute(interaction) {
        const stand = [];
        // return all the data on the DataBase of every user => Will need a upgrade on MongoDB servers to have more Storage
        const data = await standing.find({});

        // loop through the data
        data.map(async (value) => {
            // filter the object
            const { user, points } = value;

            stand.push({ user, points });
        })
        // Sort the array based on points in descending order
        stand.sort((a, b) => b.points - a.points);

         // Construct the reply message with ranking
            let replyMessage = "Ranked users 👑 :\n";
            stand.forEach((item, index) => {
                replyMessage += `${index + 1}.  ${item.user}, **XP :** **${item.points}**\n`;
            });
        // Respond to the interaction
        await interaction.reply({
            content: replyMessage,
            ephemeral: true  // Modify as needed based on your interaction type
        });
    }
};
