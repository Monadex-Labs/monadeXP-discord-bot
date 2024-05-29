const XPModel = require("../schemas/XPModel");

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const data = await XPModel.findOne({ guild: member.guild.id });
        if (!data) return;

        const channel = await member.guild.channels.cache.get(data.Channel);
        if (!channel) return;
        const message = await channel
            .send({
                content: `
			${data.Message.replace("{member}", member).replace("(member)", member.user.username)}`,
            })
            .catch((error) => {
                console.log(error);
            });

        if (data.Reaction) {
            await message.react(data.Reaction).catch((error) => {
                console.log(error);
            });
        }
    },
};
