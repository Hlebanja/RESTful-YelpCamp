var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/cat_app", { useNewUrlParser: true });
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

var catSchema = new mongoose.Schema({
    name: String,
    age: Number,
    temperament: String
});

//create a model Cat with the schema.
var Cat = mongoose.model("Cat", catSchema);

//now we can use Cat
//for making, finding, removing and deleting cats.

var george = new Cat({
    name: "George",
    age: 11,
    temperament: "Grouchy"
});

//george is what we have created. It is what is send to the DB.
//cat, in the function's arguments, is what it is being returned from the DB
// george.save(function(err, cat) {
//     if(err){
//         console.log("SOMETHING WENT WRONG");
//     } else {
//         console.log("");
//         console.log("The cat:");
//         console.log(cat);
//         console.log("was saved to the database");
//     }
// });

//retrieve all cats from the DB
Cat.find({}, function (err, cats) {
    if (err) {
        console.log("ERROR!!!");
        console.log(err);
    } else {
        console.log("List of cats...........");
        console.log(cats);
    }
});

Cat.create({
    name: "Snow White",
    age: 15,
    temperament: "Bland"
}, function(err, cat) {
    if(err) {
        console.log(err);
    } else {
        console.log(cat);
    }
});