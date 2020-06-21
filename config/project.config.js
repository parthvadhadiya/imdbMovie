const servicePort = 62062,
domain = 'localhost';


const config = {
    "servicePort" : servicePort,
    "serviceRoot" : `http://${domain}:${servicePort}`,
    "mongoRoot" : "mongodb://127.0.0.1:27017"
}

module.exports = config