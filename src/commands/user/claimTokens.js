// claim faucet tokens command for use
const { SlashCommandBuilder } = require("discord.js");
const { collectTokensFromFaucet } = require("../../utils/faucetFunctions");

const commandData = new SlashCommandBuilder()
    .setName('claim-tokens')
    .setDescription('Claim 10 tokens from the faucet')
    .addStringOption((option) =>
        option
          .setName('select-token')
          .setDescription('Select a token from the list')
          .setRequired(true)
          .addChoices(
            { name: 'PEPE', value: '0x98133fc00f1A84d7AcB532cbdD5414AeC6D52513' },
            // { name: 'Token 2', value: '0xAddress2' },
            // { name: 'Token 3', value: '0xAddress3' }
          )
      ) 
    .addStringOption((option) =>
        option.setName("wallet").setDescription("The user's wallet address").setRequired(true),
    );
// command execution
async function executeCommand(interaction) {
    // defer the reply to bypass discord's 3 sec restriction on bots
    await interaction.deferReply({ ephemeral: true });
    const UserwalletAddress = interaction.options.getString("wallet");
    const tokenSelected = interaction.options.getString("select-token");

  const result = await collectTokensFromFaucet(tokenSelected, UserwalletAddress);
  
  if(result.error) {
    return await interaction.followUp(`Error: ${result.error}`);
  }
  return await interaction.followUp(`sent 10 tokens to ${UserwalletAddress}`);
    
}


module.exports = { data:commandData, execute:executeCommand };