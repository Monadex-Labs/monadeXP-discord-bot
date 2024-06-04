async function saveToDb(dbObject) {
    try {
        await dbObject.save();
        return true;
    } catch (error) {
        console.error(error);
    }

    return false;
}

async function findOneFromDb(params, model) {
    try {
        return await model.findOne(params);
    } catch (error) {
        console.error(error);
    }

    return null;
}

async function findManyFromDb(model) {
    try {
        return await model.find();
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
