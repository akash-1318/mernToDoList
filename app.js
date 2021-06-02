const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-akash:test123@cluster0.6d0el.mongodb.net/todolistDB",{ useNewUrlParser: true, useUnifiedTopology: true })

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Built for you."
});

const item3 = new Item({
  name: "Built with Love."
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  Item.find({},function(err,foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/")
});

app.post("/delete",function(req,res){
  // console.log(req.body);
  const checkItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkItemId,function(err){
    if(!err){
      console.log("Successfully deleted.");
      res.redirect("/");
    }
  })
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
// app.listen(port);

app.listen(process.env.PORT, function() {
  console.log("Server has started Successfully.");
});
