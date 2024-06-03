// generic utility functions

function extractId(userId) {
    return userId.slice(2, userId.length - 1);
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
    let user;
    try {
        await client.users.fetch(userId).send(message);
        return true;
    } catch (error) {
        console.error(error);
    }

    return false;
}

module.exports = {
    extractId,
    userExists,
    sendDirectMessage,
};
