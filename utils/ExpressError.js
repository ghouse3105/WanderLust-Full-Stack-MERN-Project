class ExpressError extends Error{
    constructor(statuscode , messsage){
        super();
        this.statuscode=statuscode;
        this.message=messsage;
    }
}
module.exports=ExpressError;