var Dog = require("../models/dog");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkDogOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Dog.findById(req.params.id, function (err, foundDog) {
            if (err) {
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //owns dog?
                if (foundDog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    console.log("user not authorized");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("User not logged in");
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                //owns comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("user not authorized");
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("User not logged in");
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

module.exports = middlewareObj;