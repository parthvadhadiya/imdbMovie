const TestBugger = require('test-bugger');
const testBugger = new TestBugger({fileName: __filename});
const rp = require('request-promise')

const storeDB = require('./../helper/storeDB');
const fetchDB = require('../helper/fetchDB');

const updateDB = require('./../helper/update');
const Db = require('mongodb/lib/db');
const { response } = require('express');


const DBName = "moviesDB"
const CollName = "moviesColl"
const APIKEY = 'f1f2ed4f'

async function getMovie(name){
    let movieRes
    try {
        movieRes = await rp(`http://www.omdbapi.com/?apikey=${APIKEY}&t=${name}`)
    } catch (error) {
        testBugger.errorLog("Error in getting data from API")
        testBugger.errorLog(error)    
    }
    return movieRes

    
}


class handler {
    /**
     * @async
     * Represents a alive.
     * @Function
     * @param {json} req - Request comming.
     * @param {json} res - Reponse.
     * @description - This function is for test aliveness of the api.
    */
   alive(req, res) {
    testBugger.informLog("Rest API...! alive ok");
    res.status(202).send(true)
   }

   /**
     * @async
     * Represents a searchMovie .
     * @Function
     * @param {json} req - Request comming.
     * @param {json} res - Reponse.
     * @description - This function responsible to search movie by title if did'nt found find from Internet
    */
    async searchMovie(req, res){
        let response = {}
        const name = req.params.name
        let curser
        try {
            curser = await fetchDB(DBName, CollName, {"_id":name})
        } catch (error) {
            testBugger.errorLog(error)
        }
        

        while(await curser.hasNext()){
            Object.assign(response, await curser.next())
        }
        console.log(response)
        if(Object.keys(response).length === 0){
            console.log("asdas")
            let data = await getMovie(name) 
            data = JSON.parse(data)
            response._id = data['Title']
            response.imdb = data['imdbID']
            response.releasedy = data['Released'].split(" ")[2]
            response.rating = data['imdbRating']
            response.genres = data['Genre']
            try {
                await storeDB(DBName, CollName, response)
            } catch (error) {
                testBugger.errorLog(error)
            } 
        }
        res.send(response)
   }
   /**
     * @async
     * Represents a updateMovie .
     * @Function
     * @param {json} req - Request comming.
     * @param {json} res - Reponse.
     * @description - This function responsible to update movie by name
    */
   async updateMovie(req, res){
        const name = req.params.name
        const {rating, genres} = req.body
        let curser = await fetchDB(DBName, CollName, {"_id":name})
        let response = {}  
        while(await curser.hasNext()){
            Object.assign(response, await curser.next())
        }
        if(Object.keys(response).length === 0){
            response.error = "Movie is not available locally, run search query to search"
        }else{
            // console.log(name)
            let updateQ = {
                "query": {_id: name} ,
                "newValues": { $set: {
                    "rating" : rating,
                    "genres" : genres
                }}
            }
            await updateDB(DBName, CollName, updateQ )
            response = {update: "done"}
        }
        
        res.send(response)
    }

    /**
     * @async
     * Represents a searchId .
     * @Function
     * @param {json} req - Request comming.
     * @param {json} res - Reponse.
     * @description - This function responsible to search movie by id
    */
    async searchId(req, res){
        const id = req.query.id 
        let curser = await fetchDB(DBName, CollName, {"imdb":id})
        let response = {}  
        while(await curser.hasNext()){
            Object.assign(response, await curser.next())
        }
        testBugger.informLog(JSON.stringify(response))
        res.send(response)
    }
    /**
     * @async
     * Represents a searchYear .
     * @Function
     * @param {json} req - Request comming.
     * @param {json} res - Reponse.
     * @description - This function responsible to search movie by year
    */
    async searchYear(req, res){
        const year = req.query.year;
        let curser
        if(!year){
            testBugger.informLog("Search between date")
            const start = req.query.start
            const end = req.query.end
            let query = {releasedy:{ $gte:"2015"}, releasedy: { $lte: "2019" }}
            // console.log(query)
            curser = await fetchDB(DBName, CollName, query)
        }else{
            curser = await fetchDB(DBName, CollName, {"releasedy":year.toString()})
        }
        
        let response = {}  
        while(await curser.hasNext()){
            Object.assign(response, await curser.next())
        }
        testBugger.informLog(JSON.stringify(response))
        res.send(response)
    }
}

module.exports = handler