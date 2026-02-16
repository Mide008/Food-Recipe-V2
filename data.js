// ============================================
// COMPREHENSIVE RECIPE DATABASE
// Nigerian, African & International Recipes
// ============================================

const RECIPE_DATABASE = {
  // Nigerian Recipes
  nigerian: [
    {
      id: 'ng001',
      name: 'Jollof Rice',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
      strMeal: 'Jollof Rice',
      strMealThumb: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
      strCategory: 'Rice',
      strArea: 'Nigerian',
      prepTime: 20,
      cookTime: 45,
      totalTime: 65,
      servings: 6,
      difficulty: 'Medium',
      tags: ['rice', 'main-dish', 'party', 'popular'],
      description: 'The iconic West African one-pot rice dish cooked in a rich tomato sauce with aromatic spices.',
      ingredients: [
        { item: 'Long grain rice', amount: '3 cups' },
        { item: 'Tomatoes', amount: '5 large' },
        { item: 'Red bell peppers', amount: '3' },
        { item: 'Scotch bonnet pepper', amount: '2' },
        { item: 'Onions', amount: '2 large' },
        { item: 'Tomato paste', amount: '3 tbsp' },
        { item: 'Vegetable oil', amount: '½ cup' },
        { item: 'Chicken stock', amount: '4 cups' },
        { item: 'Curry powder', amount: '2 tsp' },
        { item: 'Thyme', amount: '1 tsp' },
        { item: 'Bay leaves', amount: '2' },
        { item: 'Seasoning cubes', amount: '2' }
      ],
      instructions: [
        { text: 'Heat oil in a large pot over medium-high heat. Add diced onions and sauté until translucent.' },
        { text: 'Add tomato paste and fry for 3-4 minutes, stirring constantly to prevent burning.' },
        { text: 'Pour in the blended tomato mixture. Cook for 15-20 minutes, stirring occasionally until the sauce reduces.' },
        { text: 'Add curry powder, thyme, bay leaves, and seasoning cubes. Stir well.' },
        { text: 'Pour in the stock and bring to a boil. Taste and adjust salt.' },
        { text: 'Add the washed rice and stir to combine. Reduce heat to low, cover tightly.' },
        { text: 'Cook for 30-35 minutes without stirring, until rice is tender and liquid is absorbed.' },
        { text: 'Fluff with a fork and let rest for 5 minutes before serving.' }
      ]
    },
    {
      id: 'ng002',
      name: 'Egusi Soup',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      strMeal: 'Egusi Soup',
      strMealThumb: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      strCategory: 'Soup',
      strArea: 'Nigerian',
      prepTime: 25,
      cookTime: 40,
      totalTime: 65,
      servings: 6,
      difficulty: 'Medium',
      tags: ['soup', 'traditional', 'protein-rich'],
      description: 'A rich Nigerian soup made from ground melon seeds, leafy vegetables, and assorted meats.',
      ingredients: [
        { item: 'Ground egusi', amount: '2 cups' },
        { item: 'Palm oil', amount: '½ cup' },
        { item: 'Assorted meat', amount: '1 lb' },
        { item: 'Stockfish', amount: '1 cup' },
        { item: 'Pumpkin leaves', amount: '3 cups' },
        { item: 'Spinach', amount: '2 cups' },
        { item: 'Onions', amount: '1 large' },
        { item: 'Crayfish', amount: '3 tbsp' },
        { item: 'Scotch bonnet', amount: '2' },
        { item: 'Seasoning cubes', amount: '3' }
      ],
      instructions: [
        { text: 'Season and cook assorted meats until tender. Reserve stock.' },
        { text: 'Heat palm oil in a large pot. Add chopped onions and sauté briefly.' },
        { text: 'Mix ground egusi with water to form a paste. Add to pot and fry for 2-3 minutes.' },
        { text: 'Gradually add meat stock while stirring to prevent lumps.' },
        { text: 'Add cooked meats, stockfish, ground crayfish, and pepper. Cook for 10 minutes.' },
        { text: 'Add chopped vegetables and stir gently. Cook for 5 minutes until wilted.' },
        { text: 'Adjust seasoning and serve hot with pounded yam, eba, or fufu.' }
      ]
    },
    {
      id: 'ng003',
      name: 'Suya (Nigerian Kebabs)',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
      strMeal: 'Suya',
      strMealThumb: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
      strCategory: 'Beef',
      strArea: 'Nigerian',
      prepTime: 30,
      cookTime: 15,
      totalTime: 45,
      servings: 4,
      difficulty: 'Easy',
      tags: ['grilled', 'street-food', 'protein', 'quick'],
      description: 'Spicy Nigerian street food - grilled skewered beef coated in aromatic peanut spice blend.',
      ingredients: [
        { item: 'Beef sirloin', amount: '2 lbs' },
        { item: 'Groundnuts', amount: '1 cup' },
        { item: 'Cayenne pepper', amount: '2 tbsp' },
        { item: 'Ground ginger', amount: '1 tbsp' },
        { item: 'Garlic powder', amount: '1 tbsp' },
        { item: 'Onion powder', amount: '1 tbsp' },
        { item: 'Bouillon powder', amount: '2 tsp' },
        { item: 'Vegetable oil', amount: '3 tbsp' },
        { item: 'Onions', amount: '2' },
        { item: 'Tomatoes', amount: '2' }
      ],
      instructions: [
        { text: 'Grind roasted peanuts to fine powder. Mix with spices to make suya spice.' },
        { text: 'Thread beef slices onto skewers.' },
        { text: 'Brush meat with oil, then coat generously with suya spice mixture.' },
        { text: 'Let marinate for at least 30 minutes.' },
        { text: 'Grill over medium-high heat for 6-8 minutes, turning occasionally.' },
        { text: 'Sprinkle with more suya spice halfway through cooking.' },
        { text: 'Serve hot with sliced onions and tomatoes.' }
      ]
    },
    {
      id: 'ng004',
      name: 'Moi Moi (Bean Pudding)',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&q=80',
      strMeal: 'Moi Moi',
      strMealThumb: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&q=80',
      strCategory: 'Vegetarian',
      strArea: 'Nigerian',
      prepTime: 40,
      cookTime: 60,
      totalTime: 100,
      servings: 8,
      difficulty: 'Medium',
      tags: ['beans', 'steamed', 'protein-rich', 'traditional'],
      description: 'A delicious steamed bean pudding made from blended black-eyed peas and spices.',
      ingredients: [
        { item: 'Black-eyed beans', amount: '3 cups' },
        { item: 'Red bell peppers', amount: '2' },
        { item: 'Scotch bonnet pepper', amount: '1' },
        { item: 'Onions', amount: '1 large' },
        { item: 'Vegetable oil', amount: '½ cup' },
        { item: 'Seasoning cubes', amount: '3' },
        { item: 'Crayfish', amount: '2 tbsp' },
        { item: 'Hard-boiled eggs', amount: '4' }
      ],
      instructions: [
        { text: 'Blend peeled beans, peppers, and onions with water until smooth.' },
        { text: 'Pour into bowl, add oil, seasoning, crayfish, and salt. Mix well.' },
        { text: 'Grease moi moi containers.' },
        { text: 'Pour mixture into containers, filling ¾ full. Add egg pieces.' },
        { text: 'Place in steamer or large pot with boiling water.' },
        { text: 'Steam for 45-60 minutes until firm and cooked through.' },
        { text: 'Let cool slightly before unmolding. Serve warm or cold.' }
      ]
    },
    {
      id: 'ng005',
      name: 'Pepper Soup',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      strMeal: 'Pepper Soup',
      strMealThumb: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      strCategory: 'Soup',
      strArea: 'Nigerian',
      prepTime: 15,
      cookTime: 35,
      totalTime: 50,
      servings: 4,
      difficulty: 'Easy',
      tags: ['soup', 'spicy', 'quick', 'comfort-food'],
      description: 'A spicy, aromatic Nigerian soup that warms the soul.',
      ingredients: [
        { item: 'Goat meat', amount: '2 lbs' },
        { item: 'Pepper soup spice', amount: '3 tbsp' },
        { item: 'Scotch bonnet', amount: '2' },
        { item: 'Onions', amount: '1 medium' },
        { item: 'Uziza seeds', amount: '1 tsp' },
        { item: 'Seasoning cubes', amount: '2' },
        { item: 'Scent leaves', amount: '¼ cup' }
      ],
      instructions: [
        { text: 'Season meat with salt, seasoning, and onions. Let marinate 15 minutes.' },
        { text: 'Place in pot with water, cook until tender (30-40 min).' },
        { text: 'Add pepper soup spice, scotch bonnet, uziza. Simmer 10 minutes.' },
        { text: 'Add remaining onions and scent leaves. Cook 2 minutes.' },
        { text: 'Serve hot.' }
      ]
    }
  ],

  // West African Recipes
  'west-african': [
    {
      id: 'wa001',
      name: 'Waakye (Rice and Beans)',
      category: 'west-african',
      cuisine: 'Ghanaian',
      image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80',
      strMeal: 'Waakye',
      strMealThumb: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800&q=80',
      strCategory: 'Rice',
      strArea: 'Ghanaian',
      prepTime: 15,
      cookTime: 50,
      totalTime: 65,
      servings: 6,
      difficulty: 'Easy',
      tags: ['rice', 'beans', 'vegetarian-option'],
      description: 'Popular Ghanaian dish of rice and beans cooked with sorghum leaves.',
      ingredients: [
        { item: 'Rice', amount: '2 cups' },
        { item: 'Black-eyed peas', amount: '1 cup' },
        { item: 'Sorghum leaves', amount: '10' },
        { item: 'Baking soda', amount: '½ tsp' },
        { item: 'Salt', amount: 'to taste' }
      ],
      instructions: [
        { text: 'Boil sorghum leaves in water for 15 minutes. Strain and reserve liquid.' },
        { text: 'Cook black-eyed peas with baking soda until almost tender (30 min).' },
        { text: 'Add rice, reserved leaf liquid, and salt.' },
        { text: 'Cook until rice is tender and water absorbed (20 min).' },
        { text: 'Serve with shito, gari, fried fish, and boiled eggs.' }
      ]
    },
    {
      id: 'wa002',
      name: 'Thieboudienne',
      category: 'west-african',
      cuisine: 'Senegalese',
      image: 'https://images.unsplash.com/photo-1633436059998-15cdccb02197?w=800&q=80',
      strMeal: 'Thieboudienne',
      strMealThumb: 'https://images.unsplash.com/photo-1633436059998-15cdccb02197?w=800&q=80',
      strCategory: 'Seafood',
      strArea: 'Senegalese',
      prepTime: 30,
      cookTime: 60,
      totalTime: 90,
      servings: 6,
      difficulty: 'Hard',
      tags: ['rice', 'fish', 'special-occasion'],
      description: 'The national dish of Senegal - flavorful one-pot meal with fish, vegetables, and rice.',
      ingredients: [
        { item: 'Whole fish', amount: '2 lbs' },
        { item: 'Broken rice', amount: '3 cups' },
        { item: 'Tomato paste', amount: '4 tbsp' },
        { item: 'Carrots', amount: '3' },
        { item: 'Cabbage', amount: '½ head' },
        { item: 'Eggplant', amount: '1' },
        { item: 'Cassava', amount: '1 lb' },
        { item: 'Habanero', amount: '2' },
        { item: 'Onions', amount: '2' },
        { item: 'Garlic', amount: '4 cloves' },
        { item: 'Parsley', amount: '¼ cup' },
        { item: 'Oil', amount: '½ cup' }
      ],
      instructions: [
        { text: 'Stuff fish with parsley, garlic, and pepper. Marinate 30 min.' },
        { text: 'Fry fish in oil until golden. Set aside.' },
        { text: 'In same pot, sauté onions, add tomato paste, cook 5 min.' },
        { text: 'Add vegetables and stock. Simmer 30 min until tender.' },
        { text: 'Remove vegetables. Add rice to cooking liquid, cook until done.' },
        { text: 'Serve rice on platter with fish and vegetables on top.' }
      ]
    }
  ],

  // Quick Meals
  quick: [
    {
      id: 'qm001',
      name: 'Egg Sauce with Yam',
      category: 'quick',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80',
      strMeal: 'Egg Sauce with Yam',
      strMealThumb: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&q=80',
      strCategory: 'Breakfast',
      strArea: 'Nigerian',
      prepTime: 5,
      cookTime: 15,
      totalTime: 20,
      servings: 2,
      difficulty: 'Easy',
      tags: ['breakfast', 'quick', 'eggs'],
      description: 'Quick Nigerian breakfast of scrambled eggs in spicy tomato sauce with boiled yam.',
      ingredients: [
        { item: 'Eggs', amount: '4' },
        { item: 'Yam', amount: '1 lb' },
        { item: 'Tomatoes', amount: '2' },
        { item: 'Onions', amount: '1 small' },
        { item: 'Scotch bonnet pepper', amount: '½' },
        { item: 'Vegetable oil', amount: '2 tbsp' },
        { item: 'Salt', amount: 'to taste' }
      ],
      instructions: [
        { text: 'Boil yam in salted water until tender (10-12 minutes). Drain.' },
        { text: 'Heat oil in pan. Sauté onions until soft.' },
        { text: 'Add tomatoes and pepper. Cook for 3 minutes.' },
        { text: 'Beat eggs with seasoning. Pour into pan and scramble until cooked.' },
        { text: 'Serve hot over boiled yam.' }
      ]
    }
  ],

  // International
  international: [
    {
      id: 'int001',
      name: 'Spaghetti Carbonara',
      category: 'international',
      cuisine: 'Italian',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
      strMeal: 'Spaghetti Carbonara',
      strMealThumb: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
      strCategory: 'Pasta',
      strArea: 'Italian',
      prepTime: 10,
      cookTime: 20,
      totalTime: 30,
      servings: 4,
      difficulty: 'Medium',
      tags: ['pasta', 'italian', 'quick'],
      description: 'Classic Italian pasta with eggs, cheese, and pancetta.',
      ingredients: [
        { item: 'Spaghetti', amount: '400g' },
        { item: 'Eggs', amount: '4 large' },
        { item: 'Pancetta', amount: '150g' },
        { item: 'Parmesan cheese', amount: '100g' },
        { item: 'Black pepper', amount: '1 tsp' },
        { item: 'Salt', amount: 'for pasta water' }
      ],
      instructions: [
        { text: 'Cook spaghetti in salted boiling water until al dente.' },
        { text: 'While pasta cooks, fry pancetta until crispy.' },
        { text: 'Beat eggs with parmesan and pepper in bowl.' },
        { text: 'Drain pasta, reserving 1 cup pasta water.' },
        { text: 'Add hot pasta to pancetta pan. Remove from heat.' },
        { text: 'Quickly mix in egg mixture, adding pasta water to create creamy sauce.' },
        { text: 'Serve immediately with extra parmesan.' }
      ]
    }
  ]
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RECIPE_DATABASE;
}
