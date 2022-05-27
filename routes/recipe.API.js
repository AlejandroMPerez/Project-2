var express = require('express');
var router = express.Router();
const axios = require("axios");
const isLoggedIn = require('../middleware/isLoggedIn');
const Recipe = require("../models/Recipe.model")
require("dotenv/config")

//GET Recipe listings.
router.get("/", isLoggedIn, (req, res, next) => {
    res.render("search-recipes");
});

//POST Recipe. Input users information.
router.post("/", isLoggedIn, function(req, res, next) {

    const options = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
    params: {
        query: req.body.query,
        cuisine: req.body.cuisine,
        diet: req.body.diet,
        number: req.body.number,
        addRecipeInformation: true,
        ranking: 2,
    },
    headers: {
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.API_SECRET
    }
    };

    axios.request(options).then(function (response) {
        res.render("found-recipes", {foundRecipes: response.data.results})
    }).catch(function (error) {
        console.error(error);
    });

})

//GET Route to view that specific Recipe
router.get("/:id", isLoggedIn, (req, res, next) => {
    const recipeId = req.params.id
    const options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk',
        params: {ids: recipeId},
        headers: {
          'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.API_SECRET
        }
      };
      
      axios.request(options)
        .then(function (response) {
          let summary = response.data[0].summary.replace(/<[^>]*>/g, '') //.summary.replace(/<[^>]*>/g, '') is regex that removes HTML tags from the summary description.
          res.render("found-recipe-ID", {foundRecipe: response.data[0], summary: summary, analyzedInstructions: response.data[0].analyzedInstructions[0]})
      }).catch(function (error) {
          console.error(error);
      });
});

//POST Route to add the specific Recipe to each individual User.
router.post("/:id/save", isLoggedIn, (req, res, next) => {
    const recipeId = req.params.id
    const options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk',
        params: {ids: recipeId},
        headers: {
          'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.API_SECRET
        }
      };
      
      axios.request(options)
        .then(function (response) {
          
          Recipe.create({
            image: response.data[0].image,
            title: response.data[0].title,
            readyInMinutes: response.data[0].readyInMinutes,
            extendedIngredients: response.data[0].extendedIngredients,
            analyzedInstructions: response.data[0].analyzedInstructions[0],
            creatorId: req.session.user._id,
        })
          .then(() => {
              res.redirect("/recipes/my-recipes")
          })
          .catch((err) => {
              console.log("failed", err.message)
              res.render("search-recipes", {message: "Your Recipe was not successfuly created. Please try again."})
          })
      }).catch(function (error) {
          console.error(error);
      });
})



module.exports = router