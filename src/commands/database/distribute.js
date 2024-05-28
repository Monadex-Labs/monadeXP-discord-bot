const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType  } = require('discord.js');
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
            .setName('setup')
            .setDescription('Sets up the welcome system')
            .addStringOption(option => 
                option
                    .setName('user')
                    .setDescription('The message that gonna be sent. Note: use {member} to ping and (member) to show username')
                    .setRequired(true))
            .addStringOption(option => 
                option
                    .setName('reaction')
                    .setDescription('The reaction for your system')
                    .setRequired(false)))


    // Command execution
async function executeCommand(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.reply({ content: "You don't have permission to use this command", ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    const data = await welcome.findOne({ Guild: interaction.guild.id });

    if (sub === 'setup') {
        await setupCommand(interaction, data);
    } else if (sub === 'disable') {
        await disableCommand(interaction, data);
    }
}


async function setupCommand(interaction, data) {
    if (data) {
        return await interaction.reply({
            content: 'The welcome system has already been setup use **/welcome disable** to disable the welcome system.', 
            ephemeral: true
        });
    }

    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');
    const reaction = interaction.options.getString('reaction');
    const userID = message.member.id;
    
    await distribution.create({

        Guild: interaction.guild.id,
        Channel: channel.id,
        user: userID,
        // points : 
        
    });

    const embed = buildEmbed("#f7f7f7", `Your welcome system has been setup with the message: **\`${message}\`** and it will be sent to the ${channel} channel.`);
    await interaction.reply({ embeds: [embed], ephemeral: true });
}
    // Exporting module
module.exports = {
    data: commandData,
    execute: executeCommand
};
