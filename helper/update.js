const createDynamicModel = require('./dbConnection');
const TestBugger = require('test-bugger');
const testBugger = new TestBugger({"filename": __filename});

const config = require('./../config/project.config')

let url = config.mongoRoot


async function updateDB(MONGO_DB_NAME, COLLNAME, updateQ) {
    let collections;
    try {
        
        collections = await createDynamicModel(url, MONGO_DB_NAME, COLLNAME)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("Error in getting Collection OBJ")
    }
    let output;
    try {
        // var myquery = { _id: "Guardians of the Galaxy Vol. 2" };
        // var newvalues = { $set: {"rating" : "10", "genres" : "Action, Adventure" }};
        output = await collections.updateOne(updateQ.query, updateQ.newValues)
    } catch (e) {
        testBugger.errorLog(e);
        testBugger.errorLog("error in data update on " + COLLNAME)
    }
    if (output) {
        console.log("Data updated on " + COLLNAME)
        return true
    }
    return false
}

module.exports = updateDB