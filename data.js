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
      prepTime: 20,
      cookTime: 45,
      totalTime: 65,
      servings: 6,
      difficulty: 'Medium',
      tags: ['rice', 'main-dish', 'party', 'popular'],
      description: 'The iconic West African one-pot rice dish cooked in a rich tomato sauce with aromatic spices.',
      ingredients: [
        { item: 'Long grain rice', amount: '3 cups', notes: 'washed and drained' },
        { item: 'Tomatoes', amount: '5 large', notes: 'blended' },
        { item: 'Red bell peppers', amount: '3', notes: 'blended' },
        { item: 'Scotch bonnet pepper', amount: '2', notes: 'blended, adjust to taste' },
        { item: 'Onions', amount: '2 large', notes: 'diced' },
        { item: 'Tomato paste', amount: '3 tbsp', notes: '' },
        { item: 'Vegetable oil', amount: '½ cup', notes: '' },
        { item: 'Chicken or beef stock', amount: '4 cups', notes: '' },
        { item: 'Curry powder', amount: '2 tsp', notes: '' },
        { item: 'Thyme', amount: '1 tsp', notes: 'dried' },
        { item: 'Bay leaves', amount: '2', notes: '' },
        { item: 'Salt', amount: 'to taste', notes: '' },
        { item: 'Seasoning cubes', amount: '2', notes: 'Maggi or Knorr' }
      ],
      instructions: [
        { step: 1, text: 'Heat oil in a large pot over medium-high heat. Add diced onions and sauté until translucent.' },
        { step: 2, text: 'Add tomato paste and fry for 3-4 minutes, stirring constantly to prevent burning.' },
        { step: 3, text: 'Pour in the blended tomato mixture. Cook for 15-20 minutes, stirring occasionally until the sauce reduces and oil floats to the top.' },
        { step: 4, text: 'Add curry powder, thyme, bay leaves, and seasoning cubes. Stir well.' },
        { step: 5, text: 'Pour in the stock and bring to a boil. Taste and adjust salt.' },
        { step: 6, text: 'Add the washed rice and stir to combine. Reduce heat to low, cover tightly.' },
        { step: 7, text: 'Cook for 30-35 minutes without stirring, until rice is tender and liquid is absorbed.' },
        { step: 8, text: 'Fluff with a fork and let rest for 5 minutes before serving.' }
      ],
      nutrition: {
        calories: 380,
        protein: 8,
        carbs: 65,
        fat: 10,
        fiber: 3
      },
      tips: [
        'Use parboiled rice for best results',
        'Don\'t stir the rice after adding it to prevent mushiness',
        'For smoky flavor, add a little smoked paprika'
      ]
    },
    {
      id: 'ng002',
      name: 'Egusi Soup',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      prepTime: 25,
      cookTime: 40,
      totalTime: 65,
      servings: 6,
      difficulty: 'Medium',
      tags: ['soup', 'traditional', 'protein-rich'],
      description: 'A rich Nigerian soup made from ground melon seeds, leafy vegetables, and assorted meats.',
      ingredients: [
        { item: 'Ground egusi (melon seeds)', amount: '2 cups', notes: '' },
        { item: 'Palm oil', amount: '½ cup', notes: '' },
        { item: 'Assorted meat', amount: '1 lb', notes: 'beef, goat, or chicken' },
        { item: 'Stockfish', amount: '1 cup', notes: 'soaked and shredded' },
        { item: 'Pumpkin leaves (ugu)', amount: '3 cups', notes: 'chopped' },
        { item: 'Spinach', amount: '2 cups', notes: 'chopped, optional' },
        { item: 'Onions', amount: '1 large', notes: 'chopped' },
        { item: 'Crayfish', amount: '3 tbsp', notes: 'ground' },
        { item: 'Scotch bonnet pepper', amount: '2', notes: 'blended' },
        { item: 'Seasoning cubes', amount: '3', notes: '' },
        { item: 'Salt', amount: 'to taste', notes: '' }
      ],
      instructions: [
        { step: 1, text: 'Season and cook assorted meats until tender. Reserve stock.' },
        { step: 2, text: 'Heat palm oil in a large pot. Add chopped onions and sauté briefly.' },
        { step: 3, text: 'Mix ground egusi with a little water to form a paste. Add to the pot and fry for 2-3 minutes.' },
        { step: 4, text: 'Gradually add meat stock while stirring to prevent lumps.' },
        { step: 5, text: 'Add cooked meats, stockfish, ground crayfish, and pepper. Cook for 10 minutes.' },
        { step: 6, text: 'Add chopped vegetables and stir gently. Cook for 5 minutes until wilted.' },
        { step: 7, text: 'Adjust seasoning and serve hot with pounded yam, eba, or fufu.' }
      ],
      nutrition: {
        calories: 420,
        protein: 28,
        carbs: 12,
        fat: 32,
        fiber: 5
      },
      tips: [
        'Don\'t over-stir to maintain the soup\'s texture',
        'Add vegetables towards the end to preserve nutrients'
      ]
    },
    {
      id: 'ng003',
      name: 'Suya (Nigerian Kebabs)',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
      prepTime: 30,
      cookTime: 15,
      totalTime: 45,
      servings: 4,
      difficulty: 'Easy',
      tags: ['grilled', 'street-food', 'protein', 'quick'],
      description: 'Spicy Nigerian street food - grilled skewered beef coated in aromatic peanut spice blend.',
      ingredients: [
        { item: 'Beef sirloin', amount: '2 lbs', notes: 'thinly sliced' },
        { item: 'Groundnuts (peanuts)', amount: '1 cup', notes: 'roasted' },
        { item: 'Cayenne pepper', amount: '2 tbsp', notes: '' },
        { item: 'Ground ginger', amount: '1 tbsp', notes: '' },
        { item: 'Garlic powder', amount: '1 tbsp', notes: '' },
        { item: 'Onion powder', amount: '1 tbsp', notes: '' },
        { item: 'Bouillon powder', amount: '2 tsp', notes: '' },
        { item: 'Salt', amount: '1 tsp', notes: '' },
        { item: 'Vegetable oil', amount: '3 tbsp', notes: '' },
        { item: 'Onions', amount: '2', notes: 'sliced' },
        { item: 'Tomatoes', amount: '2', notes: 'sliced' }
      ],
      instructions: [
        { step: 1, text: 'Grind roasted peanuts to a fine powder. Mix with cayenne, ginger, garlic powder, onion powder, bouillon, and salt to make suya spice.' },
        { step: 2, text: 'Thread beef slices onto skewers (pre-soaked if wooden).' },
        { step: 3, text: 'Brush meat with oil, then coat generously with suya spice mixture.' },
        { step: 4, text: 'Let marinate for at least 30 minutes (or up to 4 hours refrigerated).' },
        { step: 5, text: 'Grill over medium-high heat for 6-8 minutes, turning occasionally.' },
        { step: 6, text: 'Sprinkle with more suya spice halfway through cooking.' },
        { step: 7, text: 'Serve hot with sliced onions, tomatoes, and extra spice on the side.' }
      ],
      nutrition: {
        calories: 385,
        protein: 42,
        carbs: 8,
        fat: 20,
        fiber: 3
      },
      tips: [
        'Can also use chicken or goat meat',
        'Store leftover suya spice in an airtight container'
      ]
    },
    {
      id: 'ng004',
      name: 'Moi Moi (Bean Pudding)',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=800&q=80',
      prepTime: 40,
      cookTime: 60,
      totalTime: 100,
      servings: 8,
      difficulty: 'Medium',
      tags: ['beans', 'steamed', 'protein-rich', 'traditional'],
      description: 'A delicious steamed bean pudding made from blended black-eyed peas and spices.',
      ingredients: [
        { item: 'Black-eyed beans', amount: '3 cups', notes: 'peeled' },
        { item: 'Red bell peppers', amount: '2', notes: '' },
        { item: 'Scotch bonnet pepper', amount: '1', notes: 'adjust to taste' },
        { item: 'Onions', amount: '1 large', notes: '' },
        { item: 'Vegetable oil', amount: '½ cup', notes: '' },
        { item: 'Seasoning cubes', amount: '3', notes: '' },
        { item: 'Crayfish', amount: '2 tbsp', notes: 'ground, optional' },
        { item: 'Hard-boiled eggs', amount: '4', notes: 'quartered' },
        { item: 'Corned beef', amount: '½ cup', notes: 'optional' },
        { item: 'Salt', amount: 'to taste', notes: '' },
        { item: 'Water', amount: '2 cups', notes: 'for blending' }
      ],
      instructions: [
        { step: 1, text: 'Blend beans, peppers, and onions with water until smooth.' },
        { step: 2, text: 'Pour into a bowl. Add oil, seasoning, crayfish, and salt. Mix well.' },
        { step: 3, text: 'The consistency should be slightly thick but pourable.' },
        { step: 4, text: 'Grease moi moi containers (aluminum cups, banana leaves, or ramekins).' },
        { step: 5, text: 'Pour mixture into containers, filling ¾ full. Add egg or corned beef pieces.' },
        { step: 6, text: 'Place in a steamer or large pot with boiling water.' },
        { step: 7, text: 'Steam for 45-60 minutes until firm and cooked through.' },
        { step: 8, text: 'Let cool slightly before unmolding. Serve warm or cold.' }
      ],
      nutrition: {
        calories: 245,
        protein: 14,
        carbs: 28,
        fat: 8,
        fiber: 7
      },
      tips: [
        'Use an immersion blender for smoothest texture',
        'Test doneness by inserting a toothpick - it should come out clean'
      ]
    },
    {
      id: 'ng005',
      name: 'Pepper Soup',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
      prepTime: 15,
      cookTime: 35,
      totalTime: 50,
      servings: 4,
      difficulty: 'Easy',
      tags: ['soup', 'spicy', 'quick', 'comfort-food'],
      description: 'A spicy, aromatic Nigerian soup that warms the soul - perfect for cold days or when feeling under the weather.',
      ingredients: [
        { item: 'Goat meat or chicken', amount: '2 lbs', notes: 'cut into pieces' },
        { item: 'Pepper soup spice', amount: '3 tbsp', notes: 'or make your own blend' },
        { item: 'Scotch bonnet pepper', amount: '2', notes: 'whole or sliced' },
        { item: 'Onions', amount: '1 medium', notes: 'chopped' },
        { item: 'Uziza seeds', amount: '1 tsp', notes: 'ground, optional' },
        { item: 'Ehuru (calabash nutmeg)', amount: '3 seeds', notes: 'ground, optional' },
        { item: 'Seasoning cubes', amount: '2', notes: '' },
        { item: 'Salt', amount: 'to taste', notes: '' },
        { item: 'Water', amount: '6 cups', notes: '' },
        { item: 'Scent leaves', amount: '¼ cup', notes: 'chopped' }
      ],
      instructions: [
        { step: 1, text: 'Season meat with salt, seasoning cubes, and half the onions. Let marinate for 15 minutes.' },
        { step: 2, text: 'Place meat in a pot with water. Bring to boil and cook until tender (30-40 minutes).' },
        { step: 3, text: 'Add pepper soup spice, scotch bonnet, uziza, and ehuru. Simmer for 10 minutes.' },
        { step: 4, text: 'Add remaining onions and scent leaves. Cook for 2 more minutes.' },
        { step: 5, text: 'Adjust seasoning and serve piping hot.' }
      ],
      nutrition: {
        calories: 320,
        protein: 38,
        carbs: 6,
        fat: 16,
        fiber: 2
      },
      tips: [
        'Add yam or plantain for a heartier meal',
        'The longer it simmers, the more flavorful it becomes'
      ]
    },
    {
      id: 'ng006',
      name: 'Pounded Yam',
      category: 'nigerian',
      cuisine: 'Nigerian',
      image: 'https://images.unsplash.com/photo-1585238341710-3ef1e4c2e3e3?w=800&q=80',
      prepTime: 10,
      cookTime: 35,
      totalTime: 45,
      servings: 4,
      difficulty: 'Medium',
      tags: ['swallow', 'staple', 'traditional'],
      description: 'A smooth, stretchy Nigerian staple food made from pounded yam - perfect with soups.',
      ingredients: [
        { item: 'White yam', amount: '3 lbs', notes: 'peeled and cut into chunks' },
        { item: 'Water', amount: 'for boiling', notes: '' },
        { item: 'Salt', amount: '½ tsp', notes: 'optional' }
      ],
      instructions: [
        { step: 1, text: 'Place yam chunks in a pot and cover with water. Add salt if desired.' },
        { step: 2, text: 'Bring to boil and cook for 25-30 minutes until very soft.' },
        { step: 3, text: 'Drain water, reserving some for adjusting consistency.' },
        { step: 4, text: 'Using a potato masher or traditional mortar and pestle, pound yam until smooth and stretchy.' },
        { step: 5, text: 'Add small amounts of reserved water if too thick.' },
        { step: 6, text: 'Shape into balls and serve immediately with soup.' }
      ],
      nutrition: {
        calories: 280,
        protein: 4,
        carbs: 68,
        fat: 0.5,
        fiber: 6
      },
      tips: [
        'Modern alternative: use a stand mixer with paddle attachment',
        'Serve hot - it becomes harder as it cools'
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
      prepTime: 15,
      cookTime: 50,
      totalTime: 65,
      servings: 6,
      difficulty: 'Easy',
      tags: ['rice', 'beans', 'vegetarian-option'],
      description: 'A popular Ghanaian dish of rice and beans cooked with sorghum leaves for a unique flavor.',
      ingredients: [
        { item: 'Rice', amount: '2 cups', notes: '' },
        { item: 'Black-eyed peas', amount: '1 cup', notes: 'soaked overnight' },
        { item: 'Sorghum leaves', amount: '10', notes: 'or waakye leaves' },
        { item: 'Baking soda', amount: '½ tsp', notes: '' },
        { item: 'Salt', amount: 'to taste', notes: '' },
        { item: 'Water', amount: '5 cups', notes: '' }
      ],
      instructions: [
        { step: 1, text: 'Boil sorghum leaves in 2 cups water for 15 minutes. Strain and reserve the purple liquid.' },
        { step: 2, text: 'Cook black-eyed peas with baking soda in 3 cups water until almost tender (30 minutes).' },
        { step: 3, text: 'Add rice, reserved leaf liquid, and salt. Add more water if needed.' },
        { step: 4, text: 'Cook until rice is tender and water is absorbed (20 minutes).' },
        { step: 5, text: 'Serve with shito, gari, fried fish, and boiled eggs.' }
      ],
      nutrition: {
        calories: 320,
        protein: 12,
        carbs: 62,
        fat: 2,
        fiber: 8
      },
      tips: [
        'The leaves give it a reddish-brown color',
        'Traditionally served with a spicy pepper sauce'
      ]
    },
    {
      id: 'wa002',
      name: 'Thieboudienne (Senegalese Fish Rice)',
      category: 'west-african',
      cuisine: 'Senegalese',
      image: 'https://images.unsplash.com/photo-1633436059998-15cdccb02197?w=800&q=80',
      prepTime: 30,
      cookTime: 60,
      totalTime: 90,
      servings: 6,
      difficulty: 'Hard',
      tags: ['rice', 'fish', 'special-occasion'],
      description: 'The national dish of Senegal - a flavorful one-pot meal with fish, vegetables, and rice.',
      ingredients: [
        { item: 'Whole fish', amount: '2 lbs', notes: 'grouper or sea bass, cut into steaks' },
        { item: 'Broken rice', amount: '3 cups', notes: 'or regular rice' },
        { item: 'Tomato paste', amount: '4 tbsp', notes: '' },
        { item: 'Carrots', amount: '3', notes: 'cut in chunks' },
        { item: 'Cabbage', amount: '½ head', notes: 'cut in wedges' },
        { item: 'Eggplant', amount: '1', notes: 'cut in chunks' },
        { item: 'Cassava', amount: '1 lb', notes: 'cut in chunks' },
        { item: 'Habanero pepper', amount: '2', notes: 'whole' },
        { item: 'Onions', amount: '2', notes: 'chopped' },
        { item: 'Garlic', amount: '4 cloves', notes: 'minced' },
        { item: 'Parsley', amount: '¼ cup', notes: 'chopped' },
        { item: 'Oil', amount: '½ cup', notes: '' },
        { item: 'Fish stock', amount: '6 cups', notes: '' }
      ],
      instructions: [
        { step: 1, text: 'Stuff fish steaks with mixture of parsley, garlic, and pepper. Marinate 30 minutes.' },
        { step: 2, text: 'Fry fish in oil until golden. Set aside.' },
        { step: 3, text: 'In same pot, sauté onions, add tomato paste, and cook for 5 minutes.' },
        { step: 4, text: 'Add vegetables and stock. Simmer for 30 minutes until tender.' },
        { step: 5, text: 'Remove vegetables. Add rice to cooking liquid and cook until done.' },
        { step: 6, text: 'Serve rice on a large platter with fish and vegetables arranged on top.' }
      ],
      nutrition: {
        calories: 485,
        protein: 32,
        carbs: 58,
        fat: 14,
        fiber: 6
      },
      tips: [
        'Use berbere or nokoss (Senegalese dried fish) for authentic flavor',
        'The key is layering flavors at each step'
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
      prepTime: 5,
      cookTime: 15,
      totalTime: 20,
      servings: 2,
      difficulty: 'Easy',
      tags: ['breakfast', 'quick', 'eggs'],
      description: 'A quick Nigerian breakfast of scrambled eggs in a spicy tomato sauce served with boiled yam.',
      ingredients: [
        { item: 'Eggs', amount: '4', notes: '' },
        { item: 'Yam', amount: '1 lb', notes: 'peeled and cut' },
        { item: 'Tomatoes', amount: '2', notes: 'diced' },
        { item: 'Onions', amount: '1 small', notes: 'diced' },
        { item: 'Scotch bonnet pepper', amount: '½', notes: 'chopped' },
        { item: 'Vegetable oil', amount: '2 tbsp', notes: '' },
        { item: 'Salt', amount: 'to taste', notes: '' },
        { item: 'Seasoning cube', amount: '½', notes: 'crushed' }
      ],
      instructions: [
        { step: 1, text: 'Boil yam in salted water until tender (10-12 minutes). Drain.' },
        { step: 2, text: 'Heat oil in a pan. Sauté onions until soft.' },
        { step: 3, text: 'Add tomatoes and pepper. Cook for 3 minutes.' },
        { step: 4, text: 'Beat eggs with seasoning. Pour into pan and scramble until cooked.' },
        { step: 5, text: 'Serve hot over boiled yam.' }
      ],
      nutrition: {
        calories: 385,
        protein: 18,
        carbs: 48,
        fat: 14,
        fiber: 5
      },
      tips: [
        'Can also use plantain instead of yam',
        'Add vegetables like bell peppers for extra nutrition'
      ]
    }
  ],

  // International (with TheMealDB API integration potential)
  international: [
    {
      id: 'int001',
      name: 'Spaghetti Carbonara',
      category: 'international',
      cuisine: 'Italian',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80',
      prepTime: 10,
      cookTime: 20,
      totalTime: 30,
      servings: 4,
      difficulty: 'Medium',
      tags: ['pasta', 'italian', 'quick'],
      description: 'Classic Italian pasta with eggs, cheese, and pancetta.',
      ingredients: [
        { item: 'Spaghetti', amount: '400g', notes: '' },
        { item: 'Eggs', amount: '4 large', notes: '' },
        { item: 'Pancetta', amount: '150g', notes: 'diced' },
        { item: 'Parmesan cheese', amount: '100g', notes: 'grated' },
        { item: 'Black pepper', amount: '1 tsp', notes: 'freshly ground' },
        { item: 'Salt', amount: 'for pasta water', notes: '' }
      ],
      instructions: [
        { step: 1, text: 'Cook spaghetti in salted boiling water until al dente.' },
        { step: 2, text: 'While pasta cooks, fry pancetta until crispy.' },
        { step: 3, text: 'Beat eggs with parmesan and pepper in a bowl.' },
        { step: 4, text: 'Drain pasta, reserving 1 cup pasta water.' },
        { step: 5, text: 'Add hot pasta to pancetta pan. Remove from heat.' },
        { step: 6, text: 'Quickly mix in egg mixture, adding pasta water to create creamy sauce.' },
        { step: 7, text: 'Serve immediately with extra parmesan.' }
      ],
      nutrition: {
        calories: 520,
        protein: 24,
        carbs: 58,
        fat: 20,
        fiber: 3
      },
      tips: [
        'Don\'t let eggs scramble - the heat from pasta cooks them',
        'Work quickly after draining pasta'
      ]
    }
  ]
};

// Categories for filtering
const CATEGORIES = [
  {
    id: 'nigerian',
    name: 'Nigerian Classics',
    icon: '🇳🇬',
    color: '#008751',
    description: 'Authentic Nigerian recipes'
  },
  {
    id: 'west-african',
    name: 'West African',
    icon: '🌍',
    color: '#D97706',
    description: 'Dishes from across West Africa'
  },
  {
    id: 'quick',
    name: 'Quick Meals',
    icon: '⚡',
    color: '#059669',
    description: 'Ready in 30 minutes or less'
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    icon: '🥬',
    color: '#10B981',
    description: 'Plant-based options'
  },
  {
    id: 'soups',
    name: 'Soups & Stews',
    icon: '🍲',
    color: '#DC2626',
    description: 'Hearty Nigerian soups'
  },
  {
    id: 'street-food',
    name: 'Street Food',
    icon: '🌮',
    color: '#F59E0B',
    description: 'Popular street eats'
  }
];

// Flatten all recipes into single array
const ALL_RECIPES = [
  ...RECIPE_DATABASE.nigerian,
  ...RECIPE_DATABASE['west-african'],
  ...RECIPE_DATABASE.quick,
  ...RECIPE_DATABASE.international
];
