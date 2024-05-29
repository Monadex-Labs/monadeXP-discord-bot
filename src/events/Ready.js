const mongoose = require("mongoose");
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

        // The array of activities for the bot to cycle through
        const activities = ["Playing", "Streaming", "Listening", "Watching", "Custom", "Competing"];

        setInterval(() => {
            // Randomize the activity
            const status = activities[Math.floor(Math.random() * activities.length)];
            /**
             * Bot Status Types:
             * 0 = Playing
             * 1 = Streaming
             * 2 = Listening
             * 3 = Watching
             * 4 = Custom
             * 5 = Competing
             */
            client.user.setPresence({ activities: [{ type: 0, name: `${status}` }] });
        }, 10000); // 10 seconds
    },
};
