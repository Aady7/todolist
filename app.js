const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const _ = require("lodash");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js");
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const itemsSchema={
    name:{
        type:String,
       
}}
const listSchema={
    name:String,
    listitems:[itemsSchema]
}

const Item=mongoose.model("Item", itemsSchema);
const List=mongoose.model("List", listSchema);

const work1= new Item({
    name:"Going to gym"
});
const work2=new Item({
    name:"Going to class"
});
const work3=new Item({
    name:"Having Lunch"
});
const defaultitems=[work1, work2, work3]






var works=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

app.set("view engine","ejs")



//get route


app.get("/",function(req,res){
    
   
    Item.find()
    .then((items)=>{
        if(items.length===0){
Item.insertMany(defaultitems)
.then(function(){
console.log("Items successfully submitted")
mongoose.connection.close
})
.catch((err)=>{
    console.log(err);

});   
res.redirect("/")       

        }
        else{res.render("list",
        {pagelabel:date.getdate(), newworkstodo:items }
        )   

        }

       
        
       
    })
    .catch((err)=>{
        console.log(err);
        
    })
    


});





//custom route


// Assuming you have imported the necessary modules and defined your List model.

app.get("/:customListItem", async function (req, res) {
    try {
      const customListItem = _.capitalize(req.params.customListItem);
  
      // Using await with the Promise returned by findOne
      const foundList = await List.findOne({ name: customListItem });
  
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListItem,
          listitems: defaultitems,
        });
        await list.save();
        res.redirect("/" + customListItem);
      } else {
        // Show an existing list
        res.render("list", {
          pagelabel: foundList.name,
          newworkstodo: foundList.listitems,
        });
      }
    } catch (err) {
      // Handle any errors that occur during the asynchronous operations
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  

//app.get("/:customListItem", function(req,res){
//    customListItem=(req.params.customListItem);
//    List.findOne({name:customListItem})
//    .then((found)=>{
//        if(!found.name){
//            const list=new List({
//                name:customListItem,
//                listitems:defaultitems
//            })
//            
//            list.save();
//          
//        }
//       
//        else{
//           
//        }
//
//    })
//    .catch((found)=>{
//        res.render("list",
//        {pagelabel:found.name, newworkstodo:found.listitems }
//        )   
//
//    });
//  
//})
//
//
//
//

//home route





app.post("/",function(request,res){
    const itemname=request.body.newwork;
    const listname=request.body.list;
    const item= new Item({
        name:itemname
    });
    if(listname===date.getdate()){
        
        item.save();
    
        
        res.redirect("/");
    }
    else{
        List.findOne({name:listname})
        .then((foundList)=>{
            foundList.listitems.push(item);
            foundList.save();
            res.redirect("/"+listname);

        })
    }
    

});


//delete route




app.post("/delete", function(req,res){
   const deletedid= req.body.checkbox;
   const listname=req.body.listName;
   if(listname===date.getdate()){
    Item.findByIdAndRemove(deletedid)
   .then(()=>{
    console.log("successfully deleted the requested item");
   })
   .catch((err)=>{
    console.log(err);
   });
   res.redirect("/");
   }
   else{
    List.findOneAndUpdate({name:listname},{$pull:{listitems:{_id:deletedid}}})
    .then(()=>{
        res.redirect("/"+listname);
    })
    .catch((err)=>{
        console.log(err);
    })
   }
    
})






app.listen(3000,function(){
    console.log("Listening to the port 3000");
})