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
app.get('/biography', routes.getActiveBiography);
app.get('/profile/education', routes.getEducation);
app.get('/profile/programminglanguages', routes.getProgrammingLanguages);
app.get('/profile/tools', routes.getTools);
app.get('/profile/concepts', routes.getConcepts);
app.get('/experience/work', routes.getWorkExperience);
app.get('/experience/coop', routes.getCoopExperience);
app.get('/experience/volunteer', routes.getVolunteerExperience);
app.get('/projects', routes.getProjects);
app.get('/contact', routes.getContact);

app.get('*',  routes.endPointNotFound);

//POST
app.post('/biography', routes.addBiography);