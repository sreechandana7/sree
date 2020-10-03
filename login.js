var express=require("express");
var mongo=require("mongodb");

var MongoClient=mongo.MongoClient;
var app=express();
var bodyParser=require('body-parser');
let middleware=require('./middleware.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT=2121;
let db
//database connection
const url='mongodb://localhost:27017';
const dbname='hospitalmanagment';

MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`connected database: ${url}`);
    console.log(`databasename:${dbname}`);

})
// get hospital details
app.get("/hospitaldetails",middleware.checkToken,(req,res)=>{
    console.log("hospital details");
    var data=db.collection('hospitals').find().toArray().then(result=>res.json(result));
})
// get ventilator details
app.get("/ventilatordetails",middleware.checkToken,(req,res)=>{
    
    console.log("ventilator details");
    var data=db.collection('ventilator').find().toArray().then(result=>res.json(result));

})
// get ventilators with status given
app.post("/ventilatorbystatus",middleware.checkToken,(req,res)=>{
   
    var status=req.body.status;
   
    var data=db.collection("ventilator").find({"status":status}).toArray().then(result=>res.json(result));
})
//get ventilators with hospital name given
app.post("/ventilatorbyhospname",middleware.checkToken,(req,res)=>{
    var hospital=req.body.name
    console.log("ventilator by hospital");
    var data=db.collection("ventilator").find({"name":new RegExp(hospital,'i')}).toArray().then(result=>res.json(result));

})
//get hospitals with given hsptl name
app.post("/searchhosp",middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    var data=db.collection("hospitals").find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
})
//update the ventilator
app.put("/updateventilator",middleware.checkToken,(req,res)=>{
    var ventid={hId:req.body.hid};
    console.log(ventilatorId);
    var status ={ $set: {status:req.body.status} };
    db.collection("ventilator").updateOne(ventilatorId,status,(err,result)=>{
        res.json("1 doc updated");
        if(err) throw err;
    })

})
// adding the ventilator
app.post("/addventilator",middleware.checkToken,(req,res)=>{
    var vent={
        hId:req.body.hid,
        status:req.body.status,
        name:req.body.name,
    }
    
    console.log(vent);
    
    db.collection("ventilator").insertOne(vent)
   res.json("added");
})
//deleting the ventilator
app.delete("/deletevent",middleware.checkToken,(req,res)=>{
    var vent={hId:req.body.hid};
    
    db.collection("ventilator").deleteOne(vent);
    res.json("deleted");
})







app.listen(PORT,()=> console.log(`server running on port:${PORT}`));