var mongoose = require("mongoose");
var Camp = require("./models/camp");
var Comment = require("./models/comment");
var User = require("./models/user");

var data = [
    {
        name: "Cloud Camp",
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Above the clouds.",
    },
    {
        name: "Fjords",
        image: "https://images.unsplash.com/photo-1526491109672-74740652b963?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Norway"
    },
    {
        name: "Sky scanner",
        image: "https://images.unsplash.com/photo-1499363536502-87642509e31b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        description: "Far away"
    },
    {
        name: "Endless landscape",
        image: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        description: "finally free"
    },
    {
        name: "Asia",
        image: "https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
        description: "Happiness is only real when shared"
    }
]

function cleanDB() {
    //Remove all camps
    Camp.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed camps!");
        }
    });
    User.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("users removed!");
        }
    });
}

function createUser() {
    User.register({ username: "potato"}, "12", function (err, newUser) {
        if (err) {
            console.log(err);
        } else {
            console.log("User added!");
        }
    });
}

function seedDB() {
    cleanDB();
    createUser();
    //Adding camps  
    User.register({ username: "jones" }, "12", function (err, newUser) {
        if (err) {
            console.log(err);
        } else {
            console.log("user registered!");
            data.forEach(function (seed) {
                Camp.create(seed, function (err, camp) {
                    if (err) {
                        console.log(err);
                    } else {
                        camp.author.id = newUser._id;
                        camp.author.username = newUser.username;
                        console.log("Added campsite!");
                        //Create comment here
                        Comment.create({ text: "This is the best campsite!" }, function (err, newComment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    newComment.author.username = newUser.username;
                                    newComment.author.id = newUser._id;
                                    newComment.save();
                                    camp.comments.push(newComment)
                                    camp.save();
                                    console.log("Created new comment");
                                }
                            }
                        );
                    }
                })
            });
        }
    });
}

module.exports = seedDB;