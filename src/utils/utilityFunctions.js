const { ALLOWED_ROLES, INTEREST_RATE_PER_ANNUM } = require("./data");

// generic utility functions

function extractId(userId) {
    return userId.slice(2, userId.length - 1);
}

function isValidNumber(number) {
    if (!Number.isInteger(number) || number <= 0) return false;
    return true;
}

function getInterestAccrued(amount, timeElapsedInSeconds) {
    return amount * timeElapsedInSeconds * INTEREST_RATE_PER_ANNUM;
}

async function userExists(client, userId) {
    let user;
    try {
        user = await client.users.fetch(userId);
        if (!user.bot) return true;
    } catch (error) {
        console.error(error);
    }

    return false;
}

async function sendDirectMessage(client, userId, message) {
    try {
        const user = await client.users.fetch(userId);
        await user.send(message);
        return true;
    } catch (error) {
        console.error(error);
    }

    return false;
}

function hasPermission(interaction) {
    if (!interaction.member.roles.cache.some((role) => ALLOWED_ROLES.includes(role.id)))
        return false;
    return true;
}

module.exports = {
    extractId,
    isValidNumber,
    getInterestAccrued,
    userExists,
    sendDirectMessage,
    hasPermission,
};
