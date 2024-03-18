const express = require('express');
// const bodyParser = require('body-parser'); no longer needed since Express 4.16.0+
const path = require('path');
const mongoose = require('mongoose');
const app = express();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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

const Item1 = new Item({item:"Welcome to your to-do-list"})
const Item2 = new Item({item:"Hit the + button to add a new item"});
const Item3 = new Item({item:"<-- and hit this to delete a new item"});
const defaultItem = [Item1, Item2, Item3];

Item.insertMany(defaultItem).then(()=>{console.log("default item inserted");})
.catch(err=>{console.log("error in inserting default items"+err)});

// Item1.save().then(()=>{console.log("new Item saved successfully");})
// .catch(()=>{console.log("failed to save the new Item");})

// Item.deleteOne({_id:"65f825425322acbc51d6312e"})
// .then(()=>{console.log("deleted")})
// .catch(err=>{console.log("error in deleting an item "+err)})









app.get('/', (req, res) => {

    res.render('list',{DAY:"today" , newItems:newItems});
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
