const { ActivityType } = require("discord.js");
const { PresenceUpdateStatus } = require("discord.js");
const mongoose = require("mongoose");
const { process } = require("process");

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
    once: true,
    name: "ready",
    async execute(client) {
        // Connect to MongoDB
        if (!MONGODB_URI) {
            console.log("No MongoDB URI provided.");
            return;
        }

        // Check if the bot is connected to MongoDB
        try {
            await mongoose.connect(MONGODB_URI, {});
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("Could not connect to MongoDB");
            console.error(error);
            return;
        }

        console.log(`${client.user.displayName} is online!`);

        client.user.setActivity("activities", { type: ActivityType.Watching });
        client.user.setStatus(PresenceUpdateStatus.Online);
    },
};
