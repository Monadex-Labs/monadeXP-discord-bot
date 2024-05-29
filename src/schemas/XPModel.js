const { model, Schema } = require("mongoose");

const XPSchema = new Schema({
    guild: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        required: true,
    },
    walletAddress: String,
});

const XPModel = model("XP", XPSchema);

module.exports = XPModel;
