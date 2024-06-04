const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { EMBED_COLOR, INTEREST_RATE_PER_ANNUM, SECONDS_IN_A_YEAR } = require("../../utils/data");

/**
 * Slash Command: /help
 * Function: Displays information about all the slash commands the bot can respond to
 */

const commandData = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays information about all the available commands");

// command execution
async function executeCommand(interaction) {
    // create the MonadeXP display image
    const file = new AttachmentBuilder("./src/assets/monadexp.png");
    // the XP documentation link
    const monadexpLink = "https://monadex.gitbook.io/monadex/features/monadexp-campaign";

    const helpEmbed = new EmbedBuilder()
        .setTitle("Available Commands")
        .setColor(EMBED_COLOR)
        .setImage("attachment://monadexp.png")
        .setDescription(
            "Being an active contributor in the Monadex community will allow you to earn MXP rewards." +
                `You can read more about it [here](${monadexpLink}). Additionally, here is a list of all the commands available to you`,
        )
        // the available commands will be added as fields
        .addFields({
            name: "/profile",
            value: "Displays your stats for the MonadeXP program",
        })
        .addFields({
            name: "/gift-xp",
            value: "Allows you to gift some of your MXP to another user",
        })
        .addFields({
            name: "/deposit",
            value: `You can deposit your MXP into the bank and earn interest at a rate of ${INTEREST_RATE_PER_ANNUM * 100 * SECONDS_IN_A_YEAR} % per annum`,
        })
        .addFields({
            name: "/withdraw",
            value: "Withdraw your MXP from the bank along with any accrued interest",
        })
        .addFields({
            name: "/set-wallet-address",
            value: "Allows you to set your wallet address. At the end of the MXP program, your portion of the $MDX rewards will be directed to this account. So make sure it is a valid Monad address!",
        })
        .addFields({
            name: "/leaderboard",
            value: "Displays the MonadeXP leaderboard",
        })
        .addFields({
            name: "/allocate-mxp",
            value: "Allocates MXP to a single user. Admin-only command",
        })
        .addFields({
            name: "/penalise",
            value: "Penalises a single user. Admin-only command",
        });

    return await interaction.reply({ embeds: [helpEmbed], files: [file], ephemeral: true });
}

// export module
module.exports = {
    data: commandData,
    execute: executeCommand,
};
