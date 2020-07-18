require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const mongoDBConnectionString =  `mongodb+srv://${process.env.mongoDBUsername}:${process.env.mongoDBPassword}@cluster0-cthkj.mongodb.net/${process.env.db}?retryWrites=true&w=majority`
var client = new MongoClient(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

//GENERAL
(async ()=>{
    try {
        await client.connect((err) =>{
            if (err) throw err;
            if (client.isConnected()){
                console.log('Connection established to DB');
            }else{
                throw new Error('Connection not established to DB');
            }
        });
    } catch (err) {
        console.log('Connection not established to DB');
        // console.log(err);
    }
})();

function testServer(req, res){
    try {
        res.status(200).send('Server is running...');   
    } catch (err) {
        console.log('Error');
        res.status(500).send(err);
    }
}

function endPointNotFound(req, res){
    try{
        res.status(404).send('Endpoint not found');
    }catch (err) {
        console.log('Error')
        res.status(500).send(err);
    }
}

//BIOGRAPHY
async function getActiveBiography(req, res){
    try {
        if(client.isConnected()){
            client.db('Resume').collection('biography').findOne({'is_active': true}, (err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Database Connection failed');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }  
}

//PROFILE
async function getEducation (req, res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('profile').find({"is_education": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function getProgrammingLanguages (req, res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('profile').find({"is_programming_language": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function getTools (req, res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('profile').find({"is_tool": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function getConcepts (req, res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('profile').find({"is_concept": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

//EXPERIENCE
async function getCoopExperience (req,res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('experience').find({"is_coop": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }  
}

async function getVolunteerExperience (req,res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('experience').find({"is_volunteer": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }  
}

async function getWorkExperience (req,res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('experience').find({"is_work": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }   
}

//PROJECTS
async function getProjects (req, res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('projects').find({'is_active': true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }  
}

//CONTACT
async function getContact (req, res) {
    try {
        if(client.isConnected()){
            client.db('Resume').collection('contact').find({'is_active': true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

module.exports = {
    testServer,
    endPointNotFound,
    getActiveBiography,
    getEducation,
    getProgrammingLanguages,
    getTools,
    getConcepts,
    getCoopExperience,
    getWorkExperience,
    getVolunteerExperience,
    getProjects,
    getContact
}