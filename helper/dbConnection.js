'use strict';
var MongoClient = require('mongodb').MongoClient;


const TestBugger = require('test-bugger');
const testBugger = new TestBugger({'fileName': __filename});

/**
 * This function establishes connection with databse and keeps track of connection status
 * @param {string} dbUrl Mongo's DB URL
 * @param {string} db database name
 * @param {string} col collection name
 * @return {object} Mongo DB Connection Object
 */
function getCollections(dbUrl, db, col){
    return new Promise(async (res, rej)=>{
        var url = dbUrl;
        const client =  new MongoClient(url, { useUnifiedTopology: true })
        try{
            await client.connect()
        }catch (e) {
            testBugger.errorLog("error in client connection")
        }
        let database = ""
        try{
            database = client.db(db)
        }catch (e) {
            testBugger.errorLog("error in db connections")
        }
        let coll = ""
        try{
           
            coll = database.collection(col)
        }catch (e) {
            testBugger.errorLog("error in collections getting")
            testBugger.errorLog(e)
        }
        res(coll)
    })
}

module.exports = getCollections;