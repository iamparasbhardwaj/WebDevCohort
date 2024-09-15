const fs = require("fs");
const CustomPromise = require("./CustomPromise.js");

function callBack(contents){
    console.log(contents);
}

function readTheFile(sendTheFinalValueHere){
    fs.readFile("a.txt","utf-8",function(err,data){
        sendTheFinalValueHere(data);
    })
}

function readFile(){
    return new CustomPromise(readTheFile);
}
const p = readFile();

p.then(callBack);