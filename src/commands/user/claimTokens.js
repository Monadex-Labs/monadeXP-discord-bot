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
            { name: 'PEPE', value: '0xab1fA5cc0a7dB885BC691b60eBeEbDF59354434b' },
            { name: 'TRUMP', value: '0x951832502F0667CD00E1d1dAF1b42d163D3f17Ac' },
            { name: 'Moyaki', value: '0x59897686b2Dd2059b09642797EBeA3d21E6cE2d1' },
            { name: 'Molandak', value: '0xe9f4c0093B4e94800487cad93FBBF7C3729ccf5c' },
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