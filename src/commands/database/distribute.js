const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const distribution = require("../../schemas/xps");

/**
 *
 *      / Distribute Command => return the standings of the server
 *      / PUT WRITE DATA TO THE DATABASE /Distribute [user] [number]
 *
 */

const commandData = new SlashCommandBuilder()
  .setName("distribute")
  .setDescription("Distribute XP to users")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("xp")
      .setDescription("distribute XP to users")
      .addStringOption((option) =>
        option
          .setName("user")
          .setDescription("which user you want to reward")
          .setRequired(true)
      )
      .addNumberOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount of xps you want to reward")
          .setRequired(true)
      )
  );

// Command execution
async function executeCommand(interaction) {


   

  const amount = interaction.options.getNumber("amount");
  const userID = interaction.options.getString("user");

   // Check if the user has the right role to use this command
   if (!interaction.member.roles.cache.some((role) => role.id === "1245068458891415562")) {
    

    return await interaction.reply({
        content: "You don't have permission to use this command",
        ephemeral: true,
      });

  } 

  // Ensure amount is an integer
  if (!Number.isInteger(amount) || amount <= 0) {
    return await interaction.reply({
      content: "Please enter a valid whole number for the amount.",
      ephemeral: true,
    });
  }

  // create if the useriD is not exist on the db or update if it exist
  if (await distribution.findOne({ user: userID })) {
    await distribution.updateOne(
      { user: userID },
      { $inc: { points: amount } }
    );
  } else {
    await distribution.create({
      Guild: interaction.guild.id,
      user: userID,
      points: amount,
    });
  }

  await interaction.reply(`You have sent ${amount} XP to ${userID}.`);
}

// Exporting module
module.exports = {
  data: commandData,
  execute: executeCommand,
};
