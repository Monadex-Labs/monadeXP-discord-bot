const XPModel = require("../schemas/XPModel");

async function saveToDb(dbObject) {
    try {
        await dbObject.save();
        return true;
    } catch (error) {
        console.error(error);
    }

    return false;
}

async function findOneFromDb(params) {
    try {
        return await XPModel.findOne(params);
    } catch (error) {
        console.error(error);
    }

    return null;
}

async function findManyFromDb(params) {
    try {
        return await XPModel.find(params);
    } catch (error) {
        console.error(error);
    }

    return null;
}

module.exports = {
    saveToDb,
    findOneFromDb,
    findManyFromDb,
};
