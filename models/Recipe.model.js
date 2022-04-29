const { model, Schema } = require("mongoose");

const recipeSchema = new Schema ({

    image: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    readyInMinutes: {
        type: String,
    },
    extendedIngredients: {
        type: Array,
    },
    analyzedInstructions: {
        type: Array,
    },
    notes: {
        type: String,
    },
    creatorId: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },
  } 
);


const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;