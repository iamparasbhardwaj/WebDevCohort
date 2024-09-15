module.exports = class CustomPromise {
    // Cunstructor
    constructor(fn){
        fn(this.afterDone.bind(this));
    }
    // Call back consumer
    then(callback){
        this.resolve=callback;
    }
    // Call resolve with whatever arguments received.
    afterDone(){
        // Extract all arguments and call resolve method.
        let argumentString = "";
        for(let i=0;i<arguments.length;i++){
            if(argumentString!="")
                argumentString+=",";
            argumentString+="\""+arguments[i]+"\"";
        }
        eval("this.resolve("+argumentString+")")
    }
}