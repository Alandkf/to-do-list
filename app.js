const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const uri = "mongodb://localhost:27017/todolistDB";

mongoose.connect(uri).then(() => {
    console.log("Connected to database successfully");
}).catch(err => console.log("Error connecting to the database: " + err));

const dbSchema = new mongoose.Schema({
    item: { type: String, required: true },
});
const Item = mongoose.model("Item", dbSchema);

const Item1 = new Item({ item: "Welcome to your to-do-list" })
const Item2 = new Item({ item: "Hit the + button to add a new item" });
const Item3 = new Item({ item: "<-- and hit this to delete a new item" });
const defaultItem = [Item1, Item2, Item3];

app.get('/', (req, res) => {
    Item.find({})
        .then((items) => {
            if (items.length === 0) {
                return Item.insertMany(defaultItem)
                    .then(() => {
                        console.log("Default items inserted");
                        res.render('list', { DAY: "today", newItems: defaultItem });
                    })
                    .catch((err) => {
                        console.log("Error inserting default items: " + err);
                        res.status(500).send("Internal Server Error");
                    });
            } else {
                res.render('list', { DAY: "today", newItems: items });
            }
        })
        .catch((err) => {
            console.log("Error finding items: " + err);
            res.status(500).send("Internal Server Error");
        });
});

   

    // .catch(err=>{
    //     console.log("error in finding items "+err)
    //     mongoose.connection.close()
    // });
    

app.post("/",(req, res) =>{
    const itemName = req.body.newItem;
    let newItem = new Item({ item: itemName })
    newItem.save().then(() =>{ 
        res.redirect("/")
    })
})


app.post('/delete',(req, res) =>{
    const id = req.body.checkbox;
    Item.deleteOne({_id: id}).then(()=>{
        res.redirect("/")
    })
})


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
