const { model, Schema } = require("mongoose");

const BankSchema = new Schema({
    user: {
        type: String,
        required: true,
    },
    depositedPoints: {
        type: Number,
        reuired: true,
    },
    lastDepositTimestamp: {
        type: Number,
        required: true,
    },
});

const BankModel = model("Bank", BankSchema);

module.exports = BankModel;
