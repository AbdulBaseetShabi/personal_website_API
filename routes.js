require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const assert = require('assert');
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
async function getActiveBiography(callback){
    if(client.isConnected()){
        await client.db('Resume').collection('biography').findOne({'is_active': true}, (err,result)=>{
            if (err) throw err; 
             callback(result);
        });
    }else{
        throw new Error('Database Connection failed');
    }
}

async function getBiography(req, res){
    try {
       await getActiveBiography((value)=>{
        res.status(200).send(value);
       });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

async function getAllBiography(req, res){
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('biography').find({}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Database Connection failed');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function addBiography(req, res){
    try {
        let new_bio = req.body;
        assert(new_bio !== undefined, "Invalid data sent");
        assert(new_bio.data !== undefined, "Property data should be included");
        assert(new_bio.date !== undefined, "Property date should be included");
        assert(new_bio.is_active !== undefined, "Property is_active should be included");
        if(client.isConnected()){
            await client.db('Resume').collection('biography').insertOne(new_bio,(err,result)=>{
                if (err) throw err; 
                res.status(201).send(result);
            });
        }else{
            throw new Error('Database Connection failed');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

async function updateBiographyHelper(value, callback) {
    if(client.isConnected()){
        let id = value._id;
        delete value._id;
        await client.db('Resume').collection('biography').updateOne({'_id': new ObjectID(id)},{ $set: value },{ upsert: true },(err,result)=>{
            if (err) throw err; 
            callback(result);
        });
    }else{
        throw new Error('Database Connection failed');
    }
}

async function updateBiography(req, res){
    try {
        let bio = req.body;
        assert(bio !== undefined, "Invalid data sent");
        assert(bio._id !== undefined, "Property id should be included");
        assert(bio.data !== undefined, "Property data should be included");
        assert(bio.date !== undefined, "Property date should be included");
        assert(bio.is_active !== undefined, "Property is_active should be included");
        await updateBiographyHelper(bio, (result)=>{
            res.status(200).send(result);
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

async function setBiographyActive(req, res){
    try {
        let bio = req.body;
        assert(bio !== undefined, "Invalid data sent");
        assert(bio._id !== undefined, "Property id should be included");
        assert(bio.data !== undefined, "Property data should be included");
        assert(bio.date !== undefined, "Property date should be included");
        assert(bio.is_active !== undefined, "Property is_active should be included");
        if(client.isConnected()){
            await getActiveBiography(async (value)=>{
                let old_active_bio = value;
                old_active_bio.is_active = false;
                await updateBiographyHelper(bio,async (val)=>{
                    if(val){
                        await updateBiographyHelper(old_active_bio,async (value)=>{
                            res.status(200).send(value);
                        });        
                    }
                });
            });
        }else{
            throw new Error('Database Connection failed');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

async function deleteBiography (req, res) {
    try {
        let id = req.body._id
        assert(id !== undefined, "Invalid data sent");
        if(client.isConnected()){
            await client.db('Resume').collection('biography').deleteOne({'_id': new ObjectID(id)},(err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Database Connection failed');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

//PROFILE
async function getEducation (req, res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('profile').find({"is_education": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function getProgrammingLanguages (req, res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('profile').find({"is_programming_language": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function getTools (req, res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('profile').find({"is_tool": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

async function getConcepts (req, res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('profile').find({"is_concept": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

//EXPERIENCE
async function getCoopExperience (req,res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('experience').find({"is_coop": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

async function getVolunteerExperience (req,res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('experience').find({"is_volunteer": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

async function getWorkExperience (req,res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('experience').find({"is_work": true,"is_active": true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }   
}

//PROJECTS
async function getProjects (req, res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('projects').find({'is_active': true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }  
}

//CONTACT
async function getContact (req, res) {
    try {
        if(client.isConnected()){
            await client.db('Resume').collection('contact').find({'is_active': true}).toArray((err,result)=>{
                if (err) throw err; 
                res.status(200).send(result);
            });
        }else{
            throw new Error('Connection not established to DB');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports = {
    testServer,
    endPointNotFound,
    getBiography,
    getAllBiography,
    addBiography,
    updateBiography,
    setBiographyActive,
    deleteBiography,
    getEducation,
    getProgrammingLanguages,
    getTools,
    getConcepts,
    getCoopExperience,
    getWorkExperience,
    getVolunteerExperience,
    getProjects,
    getContact,
    
}