const express = require('express');
// const bodyParser = require('body-parser'); no longer needed since Express 4.16.0+
const path = require('path');
const date = require(__dirname+'/date.js');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Start now

const uri = "mongodb://localhost:27017/todolistDB";

mongoose.connect(uri).then(()=>{console.log("connected to database successfully")
}).catch(err=>console.log("ERROR WE DATABASE DID NOT CONNECTED" + err));


const dbSchema = new mongoose.Schema ({
    item:{type : String , required :true}, 
});
const Item = mongoose.model("Item", dbSchema);

const Item1 = new Item({item:"Buy groceries"})
Item1.save().then(()=>{console.log("new Item saved successfully");})
.catch(()=>{console.log("failed to save the new Item");})











app.get('/', (req, res) => {
    let day = date.getDate();
    res.render('list',{DAY:day , newItems:newItems});
});

app.post("/",(req, res) =>{
    let newItem = req.body.newItem;

    if(req.body.list === "work"){
        workItems.push(newItem);
        res.redirect('/work')
    } else{
        newItems.push(newItem);
        res.redirect("/")  
    }
});

app.get('/work',(req,res)=>{
    res.render('list',{DAY:"work list", newItems:workItems})
});

app.post('/work',(req,res)=>{
    let newItem = req.body.newItem;
    workItems.push(newItem);
    res.redirect('/work')
});


app.get("/about",(req,res)=>{
    res.render('about')
})


app.listen(3000, ()=>{
    console.log('listening on port 3000')
});
