var express = require("express");
var router = express.Router({ mergeParams: true }); //makes sure the :id from URL is passed as params
var Camp = require("../models/camp");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function (req, res) {
    Camp.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);;
        } else {
            res.render("comments/new", { camp: foundCamp });
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    Camp.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            req.flash("error", "Something went terribly wrong");
            console.log(err);;
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function (err, newComment) {
                if (err) {
                    console.log(err);
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCamp.comments.push(newComment);
                    foundCamp.save();
                    req.flash("success", "Successfully created comment!")
                    res.redirect("/camps/" + foundCamp._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err)
            res.redirect("back");
        } else {
            res.render("comments/edit.ejs", { comment: foundComment, campID: req.params.id });
        }
    });
});

// app.use("/camps/:id/comments/", commentRoutes);
router.put("/:comment_id", function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/camps/" + req.params.id);
        }

    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/camps/" + req.params.id);
        }
    });
})

module.exports = router;