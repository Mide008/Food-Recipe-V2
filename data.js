// COMPREHENSIVE RECIPE DATABASE
const RECIPE_DATABASE = {
  nigerian: [
    {
      id: 'ng001',
      name: 'Jollof Rice',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      strMeal: 'Jollof Rice',
      strMealThumb: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800',
      strCategory: 'Rice',
      strArea: 'Nigerian',
      prepTime: 20,
      cookTime: 45,
      tags: ['rice', 'main-dish', 'party'],
      description: 'Iconic West African one-pot rice dish.',
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
        { item: 'Thyme', amount: '1 tsp' }
      ],
      instructions: [
        { text: 'Heat oil and sauté onions until translucent.' },
        { text: 'Add tomato paste and fry for 3-4 minutes.' },
        { text: 'Pour in blended tomato mixture. Cook 15-20 minutes.' },
        { text: 'Add curry powder, thyme, and seasoning.' },
        { text: 'Pour in stock and bring to boil.' },
        { text: 'Add rice, reduce heat, cover tightly.' },
        { text: 'Cook 30-35 minutes until rice is tender.' },
        { text: 'Fluff with fork and serve.' }
      ]
    },
    {
      id: 'ng002',
      name: 'Egusi Soup',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      strMeal: 'Egusi Soup',
      strMealThumb: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
      strCategory: 'Soup',
      strArea: 'Nigerian',
      prepTime: 25,
      cookTime: 40,
      tags: ['soup', 'traditional'],
      description: 'Rich Nigerian soup made from ground melon seeds.',
      ingredients: [
        { item: 'Ground egusi', amount: '2 cups' },
        { item: 'Palm oil', amount: '½ cup' },
        { item: 'Assorted meat', amount: '1 lb' },
        { item: 'Stockfish', amount: '1 cup' },
        { item: 'Pumpkin leaves', amount: '3 cups' },
        { item: 'Spinach', amount: '2 cups' },
        { item: 'Onions', amount: '1 large' },
        { item: 'Crayfish', amount: '3 tbsp' }
      ],
      instructions: [
        { text: 'Season and cook meats until tender.' },
        { text: 'Heat palm oil, add onions.' },
        { text: 'Mix egusi with water, fry for 2-3 minutes.' },
        { text: 'Add meat stock gradually.' },
        { text: 'Add cooked meats, crayfish, pepper.' },
        { text: 'Add vegetables and stir gently.' },
        { text: 'Serve hot with pounded yam or fufu.' }
      ]
    },
    {
      id: 'ng003',
      name: 'Suya',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
      strMeal: 'Suya',
      strMealThumb: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
      strCategory: 'Beef',
      strArea: 'Nigerian',
      prepTime: 30,
      cookTime: 15,
      tags: ['grilled', 'street-food', 'quick'],
      description: 'Spicy Nigerian street food - grilled skewered beef.',
      ingredients: [
        { item: 'Beef sirloin', amount: '2 lbs' },
        { item: 'Groundnuts', amount: '1 cup' },
        { item: 'Cayenne pepper', amount: '2 tbsp' },
        { item: 'Ground ginger', amount: '1 tbsp' },
        { item: 'Garlic powder', amount: '1 tbsp' },
        { item: 'Vegetable oil', amount: '3 tbsp' }
      ],
      instructions: [
        { text: 'Grind roasted peanuts to fine powder.' },
        { text: 'Thread beef slices onto skewers.' },
        { text: 'Brush with oil, coat with suya spice.' },
        { text: 'Marinate for 30 minutes.' },
        { text: 'Grill over medium-high heat 6-8 minutes.' },
        { text: 'Serve hot with onions and tomatoes.' }
      ]
    }
  ],
  'west-african': [
    {
      id: 'wa001',
      name: 'Waakye',
      category: 'west-african',
      cuisine: 'Ghanaian',
      image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800',
      strMeal: 'Waakye',
      strMealThumb: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=800',
      strCategory: 'Rice',
      strArea: 'Ghanaian',
      prepTime: 15,
      cookTime: 50,
      tags: ['rice', 'beans'],
      description: 'Popular Ghanaian dish of rice and beans.',
      ingredients: [
        { item: 'Rice', amount: '2 cups' },
        { item: 'Black-eyed peas', amount: '1 cup' },
        { item: 'Sorghum leaves', amount: '10' },
        { item: 'Baking soda', amount: '½ tsp' }
      ],
      instructions: [
        { text: 'Boil sorghum leaves for 15 minutes.' },
        { text: 'Cook black-eyed peas until almost tender.' },
        { text: 'Add rice and reserved leaf liquid.' },
        { text: 'Cook until rice is tender.' },
        { text: 'Serve with shito and fried fish.' }
      ]
    }
  ],
  quick: [
    {
      id: 'qm001',
      name: 'Egg Sauce with Yam',
      category: 'quick',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800',
      strMeal: 'Egg Sauce',
      strMealThumb: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800',
      strCategory: 'Breakfast',
      strArea: 'Nigerian',
      prepTime: 5,
      cookTime: 15,
      tags: ['breakfast', 'quick'],
      description: 'Quick Nigerian breakfast.',
      ingredients: [
        { item: 'Eggs', amount: '4' },
        { item: 'Yam', amount: '1 lb' },
        { item: 'Tomatoes', amount: '2' },
        { item: 'Onions', amount: '1 small' }
      ],
      instructions: [
        { text: 'Boil yam until tender.' },
        { text: 'Sauté onions and tomatoes.' },
        { text: 'Scramble eggs with seasoning.' },
        { text: 'Serve over boiled yam.' }
      ]
    }
  ],
  international: [
    {
      id: 'int001',
      name: 'Spaghetti Carbonara',
      category: 'international',
      cuisine: 'Italian',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
      strMeal: 'Spaghetti Carbonara',
      strMealThumb: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
      strCategory: 'Pasta',
      strArea: 'Italian',
      prepTime: 10,
      cookTime: 20,
      tags: ['pasta', 'italian'],
      description: 'Classic Italian pasta.',
      ingredients: [
        { item: 'Spaghetti', amount: '400g' },
        { item: 'Eggs', amount: '4 large' },
        { item: 'Pancetta', amount: '150g' },
        { item: 'Parmesan cheese', amount: '100g' }
      ],
      instructions: [
        { text: 'Cook spaghetti in salted water.' },
        { text: 'Fry pancetta until crispy.' },
        { text: 'Beat eggs with parmesan.' },
        { text: 'Mix hot pasta with egg mixture.' },
        { text: 'Serve immediately.' }
      ]
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RECIPE_DATABASE;
}