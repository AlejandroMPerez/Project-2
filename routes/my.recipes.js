var express = require('express');
var router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const Recipe = require("../models/Recipe.model")


//GET Route
router.get("/", (req, res, next) => {
    res.render("index")
})

//GET Route to Create Recipe
router.get("/create", isLoggedIn, (req, res, next) => {
    res.render("create-recipe")
})

//POST Route to Create Recipe
router.post("/create", isLoggedIn, (req, res, next) => {
    if (!req.body.title) {
        res.render("create-recipes", {message: "Please fill out the Title field."})
    }

    Recipe.create({
        title: req.body.title,
        totalTime: req.body.totalTime,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        notes: req.body.notes,
        creatorId: req.session.user._id,
    })
      .then(() => {
          res.redirect("/recipes/my-recipes")
      })
      .catch(() => {
          res.render("create-recipes", {message: "Your Recipe was not successfuly created. Please try again."})
      })
})

//GET Route for My Recipes
router.get("/my-recipes", isLoggedIn, (req, res, next) => {
    Recipe.find({ creatorId: req.session.user._id })
      .then((myRecipes) => {
          res.render("my-recipes", {myRecipes: myRecipes})
      })
      .catch((err) => {
          res.redirect("/", err.message)
      })
});

module.exports = router;