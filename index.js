const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT || '3000';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true,limit: '2gb'}));
app.use(bodyParser.json({limit:'2gb'}));
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
})

app.listen(port, function(){
    console.log(`Server is running on port ${port}`);    
});

//GET
app.get('/', routes.testServer);
app.get('*',  routes.endPointNotFound);

//POST
app.post('/addData', routes.addDataToDB);
app.post('/removeData', routes.removeDataFromDB);
app.post('/getData', routes.getDataFromDB);
app.post('/biography/update', routes.updateBiography);
app.post('/biography/active', routes.setBiographyActive);
