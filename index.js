const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');

const host = process.env.host || 'localhost';
const port = process.env.port || '3000';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true,limit: '2gb'}));
app.use(bodyParser.json({limit:'2gb'}));
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
})

app.listen(port,host,function(){
    console.log(`Server is running on port ${port}`);    
});

//GET
app.get('/', function(req, res){
    try {
        res.status(200).send('Server is running...');   
    } catch (err) {
        console.log('Error')
    }finally{
        res.end();
    }
});

app.get('/experience', routes.getExperience);

app.get('*', function(req, res){
    try{
        res.status(404).send('Endpoint not found');
    }catch (err) {
        console.log('Error')
    }finally{
        res.end();
    }
})