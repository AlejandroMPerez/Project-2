var express = require('express');
var router = express.Router();
const axios = require("axios");
const isLoggedIn = require('../middleware/isLoggedIn');

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
        addRecipeInformation: 'true',
        ranking: 2,
    },
    headers: {
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '7b24cdb767msh58425498d8a122fp18b3dfjsn36544a6109e3'
    }
    };

    axios.request(options).then(function (response) {
        //res.json(response.data.results)
        res.render("found-recipes", {foundRecipes: response.data.results})
    }).catch(function (error) {
        console.error(error);
    });

})

//GET Recipe ID to view more information
// router.get("/recipe/:id", (req, res, next) => {
   
// })



module.exports = router