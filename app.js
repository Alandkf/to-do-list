const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const date = require(__dirname+'/date.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let newItems = ["wake up","wash my hands","go to work"];
let workItems = [];



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
