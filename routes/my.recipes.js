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

    let instructionsArr = req.body.analyzedInstructions.split(".")

    Recipe.create({
        image: req.body.image,
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        extendedIngredients: req.body.extendedIngredients,
        analyzedInstructions: instructionsArr,
        notes: req.body.notes,
        creatorId: req.session.user._id,
    })
      .then(() => {
          res.redirect("/recipes/my-recipes")
      })
      .catch((err) => {
          res.render("create-recipe", {message: "Your Recipe was not successfuly created. Please try again."})
      })
})

//GET Route for My Recipes
router.get("/my-recipes", isLoggedIn, (req, res, next) => {
    Recipe.find({ creatorId: req.session.user._id })
      .then((myRecipes) => {
          console.log(myRecipes)
          res.render("my-recipes", {myRecipes: myRecipes})
      })
      .catch((err) => {
          res.redirect("/", err.message)
      })
});

//GET Route to Edit Recipes
router.get("/my-recipes/:id/edit", isLoggedIn, (req, res, next) => {
    Recipe.findById(req.params.id)
      .then((editRecipe) => {
        res.render("edit-recipe", {editRecipe: editRecipe})
      })
      .catch((err) => {
        res.render("my-recipes", err.message)
      })
})

//GET Route to Edit Recipes
router.post("/my-recipes/:id/edit", isLoggedIn, (req, res, next) => {
    Recipe.findByIdAndUpdate(req.params.id, {
        image: req.body.image,
        title: req.body.title,
        readyInMinutes: req.body.readyInMinutes,
        extendedIngredients: req.body.extendedIngredients,
        analyzedInstructions: req.body.analyzedInstructions,
        notes: req.body.notes,
    })
      .then(() => {
          res.redirect("/recipes/my-recipes")
      })
      .catch((err) => {
          res.redirect("/recipes/my-recipes", err.message)
      })
})

//POST Route to Delete a Recipe
router.post("/my-recipes/:id/edit/delete", isLoggedIn, (req, res, next) => {
    Recipe.findByIdAndRemove(req.params.id)
      .then(() => {
        res.redirect("/recipes/my-recipes")
      })
      .catch((err) => {
        console.log(err.message)
      })
})

module.exports = router;