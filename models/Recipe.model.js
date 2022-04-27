const { model, Schema } = require("mongoose");

const recipeSchema = new Schema ({

    title: {
        type: String,
        required: true,
    },
    totalTime: {
        type: String,
    },
    ingredients: {
        type: String,
    },
    instructions: {
        type: String,
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