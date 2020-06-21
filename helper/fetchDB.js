const createDynamicModel = require('./dbConnection');
const TestBugger = require('test-bugger');
const testBugger = new TestBugger({"filename": __filename});
const config = require('./../config/project.config')

let url = config.mongoRoot


async function fetchDB(MONGO_DB_NAME, COLLNAME, search) {
    let collections;
    try {
        collections = await createDynamicModel(url, MONGO_DB_NAME, COLLNAME)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in getting Collection OBJ")
    }
    let output;
    try {
        // output = await collections.find({releasedy:{ $gte:"1990", $lt: "2019" }});
        output = await collections.find(search)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in data fetching from " + COLLNAME)
    }

    if (output == undefined) {
        console.log("Data fatched from" + COLLNAME)
        return true
    }
    return output
}

module.exports = fetchDB