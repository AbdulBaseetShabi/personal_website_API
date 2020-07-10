require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const mongoDBConnectionString =  `mongodb+srv://${process.env.mongoDBUsername}:${process.env.mongoDBPassword}@cluster0-cthkj.mongodb.net/${process.env.db}?retryWrites=true&w=majority`
var client = new MongoClient(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

(async ()=>{
    try{
        await client.connect(); 
    }catch(err){
        console.log(`MongoDB Error: ${err.message}`);
    }finally{
        if(client.isConnected()){
            console.log('Connection established to DB')
        }else{
            console.log('Connection not established to DB')
        }
    }
})();


module.exports = {
}