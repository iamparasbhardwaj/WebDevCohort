/*
* Imports
*/
const express = require('express');
const fs = require('fs');
const config = require('./config');
const BadRequestError = require('./exceptions/BadRequestError');
const AppConstants = require('./constants/appConstants');

/*
* Declaration
*/
var idCounter = 0;
const app = express();
app.use(express.json());

/**
 * Commit all the changes on response end.
 */
app.use(function(req, res, next) {
    res.on("finish", function() {
        updateFile();
    });
    next();
});

/*
* Load data object in memory.
*/
var dataObject = JSON.parse(fs.readFileSync(config.db.path,'utf-8'));

/*
* Get All todos.
*/
app.get('/', function (req, res) {
    res.send(dataObject);
});

/*
* Create a task.
*/
app.post('/', function (req, res) {
    persistTodo(req.body);
    res.status(201).send("");
});

/*
* DELETE all todos.
*/
app.delete('/', function (req, res) {
    deleteAllTodos(req.body);
    res.status(200).send("");
});

/*
* DELETE a specific todo.
*/
app.delete('/id/:id', function (req, res) {
    deleteTodo(req.params.id);
    res.status(200).send("");
});

/*
* handle api errors.
*/
app.use(function(err,req,res,next){
    console.log(err);
   if(AppConstants.BAD_REQUEST_ERROR == err.name){
        res.status(422).send(err.message);
   } else {
        res.status(500).send('Something broke!');
   }
});


app.listen(config.app.port);
console.log(config.app.name+" listening on "+config.app.port);

/**
 * Save newly added todo.
 * 
 * @param {*} body 
 */
function persistTodo(body){
    validateRequest(body);
    body.id=++idCounter;
    dataObject.push(body);

}

/**
 * Validate incoming request
 * 
 * @param {*} body 
 */
function validateRequest(body){
    if(body.title==null){
        throw new BadRequestError("Cannot Create a todo without title.");
    }
}

/**
 * Delete all todos.
 */
function deleteAllTodos(){
    dataObject = [];
}

/**
 * Delete a specific todo.
 * 
 * @param id 
 */
function deleteTodo(id){
    let deleted = false;
    for (let i =0;i<dataObject.length;i++){
        if(dataObject[i].id==id){
            dataObject.splice(i,1); 
            deleted = true;
        }
    }
    if(!deleted)
        throw new BadRequestError("Todo Does not exist.");
}

/*
* Commit all the changes in data file.
*/
function updateFile(){
    fs.writeFileSync(config.db.path,JSON.stringify(dataObject));
}