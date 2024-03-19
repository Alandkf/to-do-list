const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const uri = "mongodb+srv://aland:Test123@cluster0.57ts4rh.mongodb.net/todolistDB";
// uri = "mongodb+srv://aland:Test123@cluster0.57ts4rh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(uri).then(() => {
    console.log("Connected to database successfully");
}).catch(err => console.log("Error connecting to the database: " + err));

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
const Item = mongoose.model("Item", ItemSchema);

const Item1 = new Item({ name: "Welcome to your to-do-list" })
const Item2 = new Item({ name: "Hit the + button to add a new item" });
const Item3 = new Item({ name: "<-- and hit this to delete a new item" });
const defaultItems = [Item1, Item2, Item3];

const ListSchema = new mongoose.Schema({
    name :{type: String , required : true},
    items : [ItemSchema]
})

const List = mongoose.model("List", ListSchema);

app.get('/', (req, res) => {
    Item.find({})
        .then((items) => {
            if (items.length === 0) {
                return Item.insertMany(defaultItems)
                    .then(() => {
                        console.log("Default items inserted");
                        res.render('list', { DAY: "today", newItems: defaultItems });
                    })
                    .catch((err) => {
                        console.log("Error inserting default items: " + err);
                        res.status(500).send("Internal Server Error 1");
                    });
            } else {
                res.render('list', { DAY: "today", newItems: items });
            }
        })
        .catch((err) => {
            console.log("Error finding items: " + err);
            res.status(500).send("Internal Server Error 2 ");
        });
});


app.post("/",(req, res) =>{
    const itemName = req.body.newItem;
    const listName = req.body.list
    
    const newItem = new Item({ name: itemName })

    if(listName === "today"){
        newItem.save().then(() =>{ 
            res.redirect("/");
        });
        }
    else {
        List.findOne({ name: listName}).then((foundList) =>{
            foundList.items.push(newItem)
            foundList.save().then(() =>{ 
                res.redirect("/" + listName);
            });
        })
    }

})


app.post('/delete', (req, res) => {
    const id = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "today") {
        Item.deleteOne({ _id: id }).then(() => {
            res.redirect("/");
        }).catch(err => {
            console.log("Error deleting item: " + err);
            res.status(500).send("Internal Server Error 3");
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: id } } })
            .then(() => {
                console.log("Item deleted");
                res.redirect("/" + listName);
            }).catch(err => {
                console.log("Error deleting item from list: " + err);
                res.status(500).send("Internal Server Error 4");
            });
    }
});


app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName })
        .then(foundList => {
            if (!foundList) { console.log("fine");
                // Create new list
                const newList = new List({ name: customListName, items: defaultItems });
                newList.save()
                    .then(() => {
                        console.log("New list created");
                        res.render('list', { DAY: customListName, newItems: newList.items });
                    })
                    .catch((err) => {
                        console.error(`Error creating new list: ${err}`);
                        res.status(500).send("Server error");
                    });
            } else {
                res.render('list', { DAY: foundList.name, newItems: foundList.items });
            }
        })
        .catch(err => {
            console.log("log here");
            console.log("Error finding list: " + err);
            res.status(500).send("Internal Server Error 5");
        });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,(req,res) => {
    console.log( 'App is listening on port ' );
});
