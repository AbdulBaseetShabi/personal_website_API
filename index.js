const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';

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
    res.status(200).send('Server is running...');
});

app.get('*', function(req, res){
    res.status(400).send(routes.endPointNotFound);
})