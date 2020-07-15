var express = require("express");
var router = express.Router();
var Camp = require("../models/camp");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js"); // if you only specify a directoy, it will use automatically index.js

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("camps/new");
});

router.get("/:id", function (req, res) {
    var id = req.params.id;
    Camp.findById(id).populate("comments").exec(function (err, element) {
        if (err) {
            console.log(err);
        } else {
            console.log(element);
            res.render("camps/show", { camp: element });
        }
    });
});

router.get("/", function (req, res) {
    Camp.find({}, function (err, allCamps) {
        if (err) {
            console.log(err);
        } else {
            res.render("camps/index", { camps: allCamps });
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var img = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp = { name: name, image: img, description: description, author: author };
    Camp.create(newCamp, function (err, newCamp) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/camps");
        }
    });
});

router.get("/:id/edit", middleware.checkCampOwnership, function (req, res) {
    Camp.findById(req.params.id, function (err, foundCamp) {
        res.render("camps/edit.ejs", { camp: foundCamp });
    });
});

router.put("/:id", middleware.checkCampOwnership, function (req, res) {
    Camp.findByIdAndUpdate(req.params.id, req.body.camp, function (err, updatedCamp) {
        if (err) {
            console.log(err);
            res.redirect("/camps");
        } else {
            res.redirect("/camps/" + req.params.id);
        }

    });
});

router.delete("/:id", middleware.checkCampOwnership, function (req, res) {
    Camp.findByIdAndRemove(req.params.id, function (err, removedCamp) {
        if (err) {
            console.log(err);
            res.redirect("/camps");
        } else {
            Comment.deleteMany({ _id: { $in: removedCamp.comments } }, (err) => {
                if (err) {
                    console.log(err);
                }
                res.redirect("/camps");
            });
        }
    })
});

module.exports = router;