const express = require('express');
const mongoose = require('mongoose');

// Create an Express.js application
const app = express();

// Set up middleware
app.use(express.urlencoded({ extended: true }));

const path = require("path");
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Define port
const port = 8080;

// Connect to MongoDB
main().then(() => {
    app.listen(port || 8000, () => {
        console.log(`⚙️ Server is running at port : ${port}`);
    });
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/foodNutrition');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Define the schema for your food and nutrition data
const FoodSchema = new mongoose.Schema({
    name: String,
    group: String,
    description: String,
    nutritionalInformation: Object,
    servingSize: Number,
    allergens: Array,
    ingredients: Array,
    preparationMethods: Array,
    certifications: Array,
    countryOfOrigin: String,
    brandOrManufacturer: String,
    dietaryRestrictions: Array,
    healthBenefits: Array,
    bestPractices: Array
});

// Create a model for your food and nutrition data
const Food = mongoose.model('Food', FoodSchema);

// Define a route for saving new food items
app.post('/foods', async (req, res) => {
    const food = new Food(req.body);
    await food.save();
    res.send(food);
});

// Define a route for retrieving all food items
app.get('/foods', async (req, res) => {
    const foods = await Food.find();
    res.send(foods);
});

// Define a route for retrieving a specific food item by ID
app.get('/foods/:id', async (req, res) => {
    const food = await Food.findById(req.params.id);
    res.send(food);
});

// Define a route for updating a food item
app.put('/foods/:id', async (req, res) => {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body);
    res.send(food);
});

// Define a route for deleting a food item
app.delete('/foods/:id', async (req, res) => {
    await Food.findByIdAndDelete(req.params.id);
    res.send({ message: 'Food item deleted successfully' });
});

// Start the Express.js application
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
