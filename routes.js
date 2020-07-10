require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const mongoDBConnectionString =  `mongodb+srv://${process.env.mongoDBUsername}:${process.env.mongoDBPassword}@cluster0-cthkj.mongodb.net/${process.env.db}?retryWrites=true&w=majority`
var client = new MongoClient(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function getExperience (req,res) {
    try {
        await client.connect((err) =>{
            if (err) throw err;
            if(client.isConnected()){
                console.log('Connection established to DB')
                client.db('Resume').collection('experience').find({}).toArray((err,result)=>{
                    if (err) throw err; 
                    res.status(200).send(result);
                });
            }else{
                throw new Error('Connection not established to DB');
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }finally{
        client.close();
    }
    return;
}

module.exports = {
    getExperience
}