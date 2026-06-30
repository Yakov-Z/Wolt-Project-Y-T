const mongoose = require('mongoose');
// Adjust these paths if your Models folder is located elsewhere
const Restaurant = require('./Models/Restaurant'); 
const Product = require('./Models/Product');
const User = require('./Models/User');

const seedDatabase = async () => {
    try {
        // Check if there are any restaurants in the database
        const restaurantCount = await Restaurant.countDocuments();

        if (restaurantCount === 0) {
            console.log("Database is empty. Starting to seed initial Chikobyte data...");

            // 1. Create a dummy owner user for the restaurants
            const dummyOwner = new User({
                username: "admin_chiko",
                realname: "Chikobyte Admin",
                mail: "admin@chikobyte.com",
                phonenumber: "0500000000",
                password: "dummy_password_hash",
                isadmin: true,
                image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                // Adding a valid address to satisfy the AddressSchema requirements
                address: {
                    city: "Ramat Gan",
                    street: "Herzl",
                    number: "10",
                    latitude: 32.0833,
                    longitude: 34.8167
                }
            });
            const savedOwner = await dummyOwner.save();

            // 2. Create the first restaurant (Burgers)
            const burgerRestaurant = new Restaurant({
                owner: savedOwner._id,
                name: "Chiko Burger",
                description: "The best local burgers in town. 100% premium beef.",
                // The address must match the AddressSchema precisely
                address: { 
                    city: "Ramat Gan", 
                    street: "Jabotinsky", 
                    number: "1",
                    latitude: 32.0853,
                    longitude: 34.8143
                },
                category: "Burgers",
                kosher: true,
                image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
                logo: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=150&q=80",
                menu: []
            });
            const savedBurgerRest = await burgerRestaurant.save();

            // Create products for the burger restaurant
            const burger1 = new Product({
                name: "Classic Chiko",
                description: "200g beef patty with lettuce, tomato, and secret sauce.",
                price: 55,
                category: "Main",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
                restaurantID: savedBurgerRest._id
            });
            const burger2 = new Product({
                name: "Crispy Fries",
                description: "Golden crispy french fries served with ketchup.",
                price: 22,
                category: "Sides",
                image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=80",
                restaurantID: savedBurgerRest._id
            });
            
            const savedB1 = await burger1.save();
            const savedB2 = await burger2.save();

            // Update the restaurant's menu array
            savedBurgerRest.menu.push(savedB1._id, savedB2._id);
            await savedBurgerRest.save();

            // 3. Create the second restaurant (Sushi)
            const sushiRestaurant = new Restaurant({
                owner: savedOwner._id,
                name: "Sushi Ninja",
                description: "Authentic Asian cuisine and fresh sushi rolls.",
                // The address must match the AddressSchema precisely
                address: { 
                    city: "Ramat Gan", 
                    street: "Bialik", 
                    number: "20",
                    latitude: 32.0838,
                    longitude: 34.8118
                },
                category: "Asian",
                kosher: true,
                image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
                logo: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=150&q=80",
                menu: []
            });
            const savedSushiRest = await sushiRestaurant.save();

            // Create products for the sushi restaurant
            const sushi1 = new Product({
                name: "Salmon Roll",
                description: "8 pcs of fresh salmon with avocado and cucumber.",
                price: 42,
                category: "Sushi",
                image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=80",
                restaurantID: savedSushiRest._id
            });
            const sushi2 = new Product({
                name: "Spicy Tuna",
                description: "8 pcs of spicy tuna roll wrapped in seaweed.",
                price: 46,
                category: "Sushi",
                image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=500&q=80",
                restaurantID: savedSushiRest._id
            });
            
            const savedS1 = await sushi1.save();
            const savedS2 = await sushi2.save();

            // Update the restaurant's menu array
            savedSushiRest.menu.push(savedS1._id, savedS2._id);
            await savedSushiRest.save();

            console.log("Database seeded successfully with initial restaurants and products.");
        } else {
            console.log("Database already contains data. Skipping seed process.");
        }
    } catch (error) {
        console.error("Error during database seeding:", error);
    }
};

module.exports = seedDatabase;