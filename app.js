//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const _ = require('lodash');
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  const uri = process.env.DB_URL;

  await mongoose.connect(uri);
}

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('Item', itemSchema);

const item1 = new Item({ name: "welcome to your todo list!" })
const item2 = new Item({ name: "just add something" })
const item3 = new Item({ name: "hit the checkbox to delete" })

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const List = mongoose.model('List', listSchema);


app.get("/", function (req, res) {

  Item.find(function (err, items) {

    if (items.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log("successfuly added defaultItems")
          res.redirect("/")
        }
      })
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  })

  // const day = date.getDate();

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem
  const listName = req.body.list

  const item = new Item({
    name: itemName
  })
  if (listName === "Today") {
    item.save()
    res.redirect("/")
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      // console.log(foundlist.items)
      foundList.items.push(item)
      foundList.save()
      res.redirect("/" + listName)
    })
  }



});

app.post("/delete", function (req, res) {
  const listName = req.body.list
  const itemToRemoveID = req.body.checkbox
  if (listName === "Today") {
    //remove from main items db

    Item.findByIdAndRemove(itemToRemoveID, function (err) {
      if (err) {
        console.log(err)
      }
      else {
        console.log("Removed User : " + itemToRemoveID);
      }
    });

    res.redirect("/")
  } else {
    // find the right list, then remove item by id from the list
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemToRemoveID } } }, function (err, foundList) {
      if (!err) {
        res.redirect("/" + listName)
      }

    })
  }

});

app.get("/:customListName", function (req, res) {
  // const customListName = _.capitalize(req.params.customListName)
  const customListName = req.params.customListName
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        console.log('no list was found, creating new one')
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + customListName)

      } else {
        // show existing list
        console.log('list was found, rendering it now')
        res.render(__dirname + "/views/list", { listTitle: req.params.customListName, newListItems: foundList.items });
      }
    }
  })




});

app.get("/about", function (req, res) {
  res.render("about");
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function() {
  console.log("Server started on port " + port);
});

// this is how to delete collection: db.lists.drop()
