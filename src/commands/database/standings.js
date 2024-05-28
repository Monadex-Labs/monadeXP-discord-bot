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
        data.map(async (value) => {
            // filter the object
            const { user, points } = value;

            stand.push({ user, points });
            // push the data in an array

            //  await interaction.reply();
        })
        // Sort the array based on points in descending order
        stand.sort((a, b) => b.points - a.points);

         // Construct the reply message with ranking
            let replyMessage = "Ranked users 👑 :\n";
            stand.forEach((item, index) => {
                replyMessage += `${index + 1}. **User**: ${item.user}, **Points**: ${item.points}\n`;
            });
        // Respond to the interaction
        await interaction.reply({
            content: replyMessage,
            ephemeral: true  // Modify as needed based on your interaction type
        });

        // Log the sorted array
        console.log(stand)
    }
};
