/ ============================================
// Recipe Finder App - Clean & Functional
// ============================================

// State Management
const AppState = {
    recipes: [],
    savedRecipes: JSON.parse(localStorage.getItem('savedRecipes')) || [],
    currentRecipe: null,
    theme: localStorage.getItem('theme') || 'light',
    currentPage: null
};

// DOM Elements
const elements = {
    // Theme
    themeToggle: document.getElementById('theme-toggle'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    surpriseBtn: document.getElementById('surprise-btn'),
    
    // Recipes
    recipesGrid: document.getElementById('recipes-grid'),
    loadingState: document.getElementById('loading-state'),
    
    // Modal
    modalOverlay: document.getElementById('modal-overlay'),
    recipeModal: document.getElementById('recipe-modal'),
    modalClose: document.getElementById('modal-close'),
    modalContent: document.getElementById('modal-content'),
    modalTitle: document.getElementById('modal-title'),
    
    // Pages
    pagesContainer: document.getElementById('pages-container'),
    
    // Footer
    footerLinks: document.querySelectorAll('.footer-link'),
    newsletterEmail: document.getElementById('newsletter-email'),
    subscribeBtn: document.getElementById('subscribe-btn'),
    
    // Toast
    toastContainer: document.getElementById('toast-container')
};

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadFeaturedRecipes();
    setupEventListeners();
});

function initializeApp() {
    // Set theme
    document.documentElement.setAttribute('data-theme', AppState.theme);
    updateThemeIcon();
}

// ============================================
// Recipe Management
// ============================================

async function loadFeaturedRecipes() {
    showLoading(true);
    
    try {
        // Try MealDB API (free, no API key needed)
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await response.json();
        
        if (data.meals && data.meals.length > 0) {
            // Use real data
            AppState.recipes = data.meals.slice(0, 6).map(meal => ({
                id: meal.idMeal,
                title: meal.strMeal,
                category: meal.strCategory,
                area: meal.strArea,
                image: meal.strMealThumb,
                prepTime: Math.floor(Math.random() * 45) + 15,
                difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                description: meal.strInstructions?.substring(0, 100) + '...' || 'Delicious recipe from ' + meal.strArea
            }));
        } else {
            // Fallback to mock data
            loadMockRecipes();
        }
    } catch (error) {
        console.log('Using mock recipes');
        loadMockRecipes();
    }
    
    renderRecipes();
    showLoading(false);
}

function loadMockRecipes() {
    AppState.recipes = [
        {
            id: '1',
            title: 'Classic Spaghetti Carbonara',
            category: 'Pasta',
            area: 'Italian',
            image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            prepTime: 25,
            difficulty: 'Medium',
            rating: '4.7',
            description: 'Creamy pasta with eggs, cheese, and pancetta.'
        },
        {
            id: '2',
            title: 'Chicken Stir Fry',
            category: 'Asian',
            area: 'Chinese',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            prepTime: 20,
            difficulty: 'Easy',
            rating: '4.5',
            description: 'Quick and healthy chicken with vegetables.'
        },
        {
            id: '3',
            title: 'Avocado Toast',
            category: 'Breakfast',
            area: 'American',
            image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            prepTime: 10,
            difficulty: 'Easy',
            rating: '4.8',
            description: 'Simple toast with mashed avocado and seasonings.'
        },
        {
            id: '4',
            title: 'Vegetable Curry',
            category: 'Curry',
            area: 'Indian',
            image: 'https://images.unsplash.com/photo-1585937421612-70ca003675ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            prepTime: 35,
            difficulty: 'Medium',
            rating: '4.6',
            description: 'Spicy vegetable curry with coconut milk.'
        },
        {
            id: '5',
            title: 'Chocolate Chip Cookies',
            category: 'Dessert',
            area: 'American',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            prepTime: 30,
            difficulty: 'Easy',
            rating: '4.9',
            description: 'Classic homemade chocolate chip cookies.'
        },
        {
            id: '6',
            title: 'Greek Salad',
            category: 'Salad',
            area: 'Greek',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            prepTime: 15,
            difficulty: 'Easy',
            rating: '4.4',
            description: 'Fresh vegetables with feta cheese and olives.'
        }
    ];
}

function renderRecipes() {
    const grid = elements.recipesGrid;
    grid.innerHTML = '';
    
    AppState.recipes.forEach((recipe, index) => {
        const card = createRecipeCard(recipe, index);
        grid.appendChild(card);
    });
}

function createRecipeCard(recipe, index) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const isSaved = AppState.savedRecipes.some(r => r.id === recipe.id);
    
    card.innerHTML = `
        <div class="recipe-image">
            <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
            <button class="save-btn" data-id="${recipe.id}" title="${isSaved ? 'Remove from saved' : 'Save recipe'}">
                <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
            </button>
        </div>
        <div class="recipe-content">
            <h3 class="recipe-title">${recipe.title}</h3>
            <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.prepTime} min</span>
                <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                <span><i class="fas fa-globe"></i> ${recipe.area}</span>
            </div>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-actions">
                <div class="recipe-rating">
                    <i class="fas fa-star"></i>
                    <span>${recipe.rating}</span>
                </div>
                <button class="view-recipe-btn" data-id="${recipe.id}">
                    View Recipe <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// Modal Functions
// ============================================

function openRecipeModal(recipeId) {
    const recipe = AppState.recipes.find(r => r.id === recipeId) || AppState.recipes[0];
    AppState.currentRecipe = recipe;
    
    // Update modal title
    elements.modalTitle.textContent = recipe.title;
    
    // Load modal content
    loadRecipeModalContent(recipe);
    
    // Show modal
    elements.modalOverlay.classList.add('active');
    elements.recipeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function loadRecipeModalContent(recipe) {
    const isSaved = AppState.savedRecipes.some(r => r.id === recipe.id);
    
    elements.modalContent.innerHTML = `
        <div class="recipe-detail">
            <div class="recipe-image-large">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
            
            <div class="recipe-header">
                <h2>${recipe.title}</h2>
                <div class="recipe-stats">
                    <div class="stat">
                        <i class="fas fa-clock"></i>
                        <span>${recipe.prepTime} minutes</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-signal"></i>
                        <span>${recipe.difficulty}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-user-friends"></i>
                        <span>2-4 servings</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-globe"></i>
                        <span>${recipe.area}</span>
                    </div>
                </div>
            </div>
            
            <div class="recipe-actions-modal">
                <button class="recipe-action-btn primary" id="start-cooking">
                    <i class="fas fa-play-circle"></i>
                    Start Cooking
                </button>
                <button class="recipe-action-btn" id="save-recipe-modal" data-saved="${isSaved}">
                    <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                    ${isSaved ? 'Saved' : 'Save'}
                </button>
                <button class="recipe-action-btn" id="share-recipe">
                    <i class="fas fa-share-alt"></i>
                    Share
                </button>
                <button class="recipe-action-btn" id="download-recipe">
                    <i class="fas fa-download"></i>
                    Download
                </button>
            </div>
            
            <div class="recipe-tabs">
                <button class="recipe-tab active" data-tab="ingredients">Ingredients</button>
                <button class="recipe-tab" data-tab="instructions">Instructions</button>
                <button class="recipe-tab" data-tab="nutrition">Nutrition</button>
            </div>
            
            <div class="tab-content active" id="ingredients-tab">
                <div class="ingredients-list">
                    <div class="ingredient-item">
                        <input type="checkbox" id="ing-1">
                        <label for="ing-1">2 cups ${recipe.title.split(' ')[0].toLowerCase()}</label>
                        <span class="ingredient-amount">main ingredient</span>
                    </div>
                    <div class="ingredient-item">
                        <input type="checkbox" id="ing-2">
                        <label for="ing-2">1 onion, chopped</label>
                        <span class="ingredient-amount">medium</span>
                    </div>
                    <div class="ingredient-item">
                        <input type="checkbox" id="ing-3">
                        <label for="ing-3">2 cloves garlic</label>
                        <span class="ingredient-amount">minced</span>
                    </div>
                    <div class="ingredient-item">
                        <input type="checkbox" id="ing-4">
                        <label for="ing-4">2 tbsp olive oil</label>
                        <span class="ingredient-amount">for cooking</span>
                    </div>
                    <div class="ingredient-item">
                        <input type="checkbox" id="ing-5">
                        <label for="ing-5">Salt and pepper</label>
                        <span class="ingredient-amount">to taste</span>
                    </div>
                </div>
                <button class="btn btn-secondary" id="add-to-list">
                    <i class="fas fa-cart-plus"></i>
                    Add to Shopping List
                </button>
            </div>
            
            <div class="tab-content" id="instructions-tab">
                <div class="instruction-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <p>Prepare all ingredients by washing and chopping as needed.</p>
                    </div>
                </div>
                <div class="instruction-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <p>Heat oil in a pan over medium heat. Add onions and garlic, cook until fragrant.</p>
                    </div>
                </div>
                <div class="instruction-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <p>Add main ingredient and cook for 10-15 minutes until tender.</p>
                    </div>
                </div>
                <div class="instruction-step">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <p>Season with salt and pepper. Stir well and cook for another 5 minutes.</p>
                    </div>
                </div>
                <div class="instruction-step">
                    <div class="step-number">5</div>
                    <div class="step-content">
                        <p>Serve hot and enjoy your delicious ${recipe.title}!</p>
                    </div>
                </div>
            </div>
            
            <div class="tab-content" id="nutrition-tab">
                <div class="nutrition-grid">
                    <div class="nutrition-item">
                        <span class="nutrition-label">Calories</span>
                        <span class="nutrition-value">${Math.floor(Math.random() * 300) + 200}</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Protein</span>
                        <span class="nutrition-value">${Math.floor(Math.random() * 20) + 5}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Carbs</span>
                        <span class="nutrition-value">${Math.floor(Math.random() * 40) + 10}g</span>
                    </div>
                    <div class="nutrition-item">
                        <span class="nutrition-label">Fat</span>
                        <span class="nutrition-value">${Math.floor(Math.random() * 15) + 5}g</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Attach modal event listeners
    attachModalEventListeners();
}

function closeModal() {
    elements.modalOverlay.classList.remove('active');
    elements.recipeModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// Download Functionality
// ============================================

function setupDownload() {
    // Remove old download listeners
    document.getElementById('download-recipe')?.addEventListener('click', handleDownloadClick);
    
    // Add listener for download options
    elements.modalContent.addEventListener('click', (e) => {
        if (e.target.closest('.download-option')) {
            const option = e.target.closest('.download-option');
            document.querySelectorAll('.download-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        }
        
        if (e.target.closest('#download-recipe')) {
            handleDownloadClick();
        }
    });
}

function handleDownloadClick() {
    if (!AppState.currentRecipe) return;
    
    const downloadOptions = document.querySelectorAll('.download-option');
    const activeOption = Array.from(downloadOptions).find(opt => opt.classList.contains('active'));
    
    if (!activeOption) {
        showToast('error', 'Select Format', 'Please select a download format first');
        return;
    }
    
    const format = activeOption.dataset.format || 'pdf';
    downloadRecipe(AppState.currentRecipe, format);
}

function downloadRecipe(recipe, format) {
    // Create download content based on format
    let content, filename, mimeType;
    
    switch(format) {
        case 'pdf':
            content = createPDFContent(recipe);
            filename = `${recipe.title.replace(/\s+/g, '_')}.pdf`;
            mimeType = 'application/pdf';
            break;
        case 'txt':
            content = createTextContent(recipe);
            filename = `${recipe.title.replace(/\s+/g, '_')}.txt`;
            mimeType = 'text/plain';
            break;
        case 'json':
            content = createJSONContent(recipe);
            filename = `${recipe.title.replace(/\s+/g, '_')}.json`;
            mimeType = 'application/json';
            break;
        default:
            content = createPDFContent(recipe);
            filename = `${recipe.title.replace(/\s+/g, '_')}.pdf`;
            mimeType = 'application/pdf';
    }
    
    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('success', 'Download Started', `Recipe downloaded as ${format.toUpperCase()}`);
}

function createPDFContent(recipe) {
    // Simple PDF-like content (in real app, use a PDF library)
    return `
        RECIPE: ${recipe.title}
        
        Preparation Time: ${recipe.prepTime} minutes
        Difficulty: ${recipe.difficulty}
        Cuisine: ${recipe.area}
        
        INGREDIENTS:
        - 2 cups main ingredient
        - 1 onion, chopped
        - 2 cloves garlic, minced
        - 2 tbsp olive oil
        - Salt and pepper to taste
        
        INSTRUCTIONS:
        1. Prepare all ingredients
        2. Heat oil and cook onions and garlic
        3. Add main ingredient and cook
        4. Season and serve
        
        NUTRITION (per serving):
        Calories: ${Math.floor(Math.random() * 300) + 200}
        Protein: ${Math.floor(Math.random() * 20) + 5}g
        Carbs: ${Math.floor(Math.random() * 40) + 10}g
        Fat: ${Math.floor(Math.random() * 15) + 5}g
        
        Enjoy your meal!
        
        Downloaded from What's Cooking
        ${new Date().toLocaleDateString()}
    `;
}

function createTextContent(recipe) {
    return `
        ${recipe.title}
        ================
        
        Prep Time: ${recipe.prepTime} min
        Difficulty: ${recipe.difficulty}
        
        Description: ${recipe.description}
        
        Ingredients:
        • Main ingredient
        • Onion
        • Garlic
        • Olive oil
        • Salt and pepper
        
        Instructions:
        1. Prepare ingredients
        2. Cook as directed
        3. Serve and enjoy!
    `;
}

function createJSONContent(recipe) {
    return JSON.stringify({
        title: recipe.title,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty,
        area: recipe.area,
        ingredients: ["Main ingredient", "Onion", "Garlic", "Olive oil", "Salt and pepper"],
        instructions: ["Prepare ingredients", "Cook as directed", "Serve and enjoy"],
        downloadedAt: new Date().toISOString()
    }, null, 2);
}

// ============================================
// Page Functions
// ============================================

function loadPage(pageName) {
    AppState.currentPage = pageName;
    
    // Create page content
    const pages = {
        'explore': createExplorePage(),
        'categories': createCategoriesPage(),
        'seasonal': createSeasonalPage(),
        'meal-planner': createMealPlannerPage(),
        'shopping': createShoppingListPage(),
        'techniques': createTechniquesPage(),
        'about': createAboutPage(),
        'contact': createContactPage(),
        'privacy': createPrivacyPage()
    };
    
    const pageContent = pages[pageName] || createDefaultPage();
    
    elements.pagesContainer.innerHTML = `
        <button class="page-close" id="page-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="page-content">
            ${pageContent}
        </div>
    `;
    
    elements.pagesContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add close listener
    document.getElementById('page-close').addEventListener('click', closePage);
}

function closePage() {
    elements.pagesContainer.classList.remove('active');
    document.body.style.overflow = '';
    AppState.currentPage = null;
}

function createExplorePage() {
    return `
        <div class="page-header">
            <h2>Explore Recipes</h2>
            <p>Browse recipes by category, cuisine, or dietary preferences</p>
        </div>
        
        <div class="categories-grid">
            <div class="category-card">
                <i class="fas fa-utensils"></i>
                <h3>Main Dishes</h3>
                <p>100+ recipes</p>
            </div>
            <div class="category-card">
                <i class="fas fa-leaf"></i>
                <h3>Vegetarian</h3>
                <p>50+ recipes</p>
            </div>
            <div class="category-card">
                <i class="fas fa-bolt"></i>
                <h3>Quick Meals</h3>
                <p>75+ recipes</p>
            </div>
            <div class="category-card">
                <i class="fas fa-heart"></i>
                <h3>Healthy</h3>
                <p>60+ recipes</p>
            </div>
        </div>
    `;
}

function createCategoriesPage() {
    return `
        <div class="page-header">
            <h2>Recipe Categories</h2>
            <p>Find recipes by category</p>
        </div>
        
        <div class="category-list">
            <div class="category-item">
                <span>🍝 Pasta</span>
                <span>45 recipes</span>
            </div>
            <div class="category-item">
                <span>🍗 Chicken</span>
                <span>32 recipes</span>
            </div>
            <div class="category-item">
                <span>🥗 Salad</span>
                <span>28 recipes</span>
            </div>
            <div class="category-item">
                <span>🍲 Soup</span>
                <span>24 recipes</span>
            </div>
            <div class="category-item">
                <span>🧁 Dessert</span>
                <span>38 recipes</span>
            </div>
            <div class="category-item">
                <span>🥤 Smoothie</span>
                <span>15 recipes</span>
            </div>
        </div>
    `;
}

function createSeasonalPage() {
    return `
        <div class="page-header">
            <h2>Seasonal Picks</h2>
            <p>Fresh recipes for this season</p>
        </div>
        
        <div class="seasonal-content">
            <h3>🍂 Fall Recipes</h3>
            <ul>
                <li>Pumpkin Soup</li>
                <li>Apple Crisp</li>
                <li>Butternut Squash Pasta</li>
                <li>Hot Apple Cider</li>
            </ul>
            
            <h3>❄️ Winter Favorites</h3>
            <ul>
                <li>Hearty Beef Stew</li>
                <li>Hot Chocolate</li>
                <li>Gingerbread Cookies</li>
                <li>Roasted Vegetables</li>
            </ul>
        </div>
    `;
}

function createMealPlannerPage() {
    return `
        <div class="page-header">
            <h2>Meal Planner</h2>
            <p>Plan your weekly meals</p>
        </div>
        
        <div class="meal-planner">
            <div class="week-grid">
                <div class="day">Monday</div>
                <div class="day">Tuesday</div>
                <div class="day">Wednesday</div>
                <div class="day">Thursday</div>
                <div class="day">Friday</div>
                <div class="day">Saturday</div>
                <div class="day">Sunday</div>
            </div>
            
            <button class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Plan This Week
            </button>
        </div>
    `;
}

function createShoppingListPage() {
    return `
        <div class="page-header">
            <h2>Shopping List</h2>
            <p>Your grocery shopping list</p>
        </div>
        
        <div class="shopping-list">
            <div class="list-item">
                <input type="checkbox" id="item-1">
                <label for="item-1">Chicken breast</label>
                <span>500g</span>
            </div>
            <div class="list-item">
                <input type="checkbox" id="item-2">
                <label for="item-2">Broccoli</label>
                <span>1 head</span>
            </div>
            <div class="list-item">
                <input type="checkbox" id="item-3">
                <label for="item-3">Carrots</label>
                <span>4 pieces</span>
            </div>
            <div class="list-item">
                <input type="checkbox" id="item-4">
                <label for="item-4">Rice</label>
                <span>1kg</span>
            </div>
            
            <div class="add-item">
                <input type="text" placeholder="Add new item...">
                <button class="btn btn-secondary">Add</button>
            </div>
        </div>
    `;
}

function createTechniquesPage() {
    return `
        <div class="page-header">
            <h2>Cooking Techniques</h2>
            <p>Learn essential cooking skills</p>
        </div>
        
        <div class="techniques-list">
            <div class="technique">
                <h3>🧑‍🍳 Knife Skills</h3>
                <p>Learn how to chop, dice, and mince safely and efficiently.</p>
            </div>
            <div class="technique">
                <h3>🍳 Sautéing</h3>
                <p>Quick-cooking in a small amount of oil over high heat.</p>
            </div>
            <div class="technique">
                <h3>🔥 Roasting</h3>
                <p>Cooking food in an oven using dry heat.</p>
            </div>
            <div class="technique">
                <h3>🥘 Braising</h3>
                <p>Slow-cooking in liquid at low temperature.</p>
            </div>
        </div>
    `;
}

function createAboutPage() {
    return `
        <div class="page-header">
            <h2>Our Story</h2>
            <p>Making cooking simple and enjoyable for everyone</p>
        </div>
        
        <div class="about-content">
            <p>Welcome to What's Cooking! We believe that everyone should be able to cook delicious meals, regardless of their experience level.</p>
            
            <h3>Our Mission</h3>
            <p>To simplify cooking by providing easy-to-follow recipes, helpful tips, and meal planning tools.</p>
            
            <h3>Features</h3>
            <ul>
                <li>Easy recipe search by ingredients</li>
                <li>Step-by-step instructions</li>
                <li>Meal planning tools</li>
                <li>Grocery list generator</li>
                <li>Recipe saving and sharing</li>
            </ul>
            
            <p>Start cooking today and discover the joy of homemade meals!</p>
        </div>
    `;
}

function createContactPage() {
    return `
        <div class="page-header">
            <h2>Contact Us</h2>
            <p>We'd love to hear from you</p>
        </div>
        
        <div class="contact-content">
            <h3>Get in Touch</h3>
            <p>Email: hello@whatscooking.com</p>
            <p>Phone: (555) 123-4567</p>
            
            <h3>Feedback</h3>
            <p>Have suggestions or found a bug? Let us know!</p>
            
            <div class="contact-form">
                <input type="text" placeholder="Your Name">
                <input type="email" placeholder="Your Email">
                <textarea placeholder="Your Message" rows="4"></textarea>
                <button class="btn btn-primary">Send Message</button>
            </div>
        </div>
    `;
}

function createPrivacyPage() {
    return `
        <div class="page-header">
            <h2>Privacy Policy</h2>
            <p>How we handle your information</p>
        </div>
        
        <div class="privacy-content">
            <h3>Information We Collect</h3>
            <p>We only collect information necessary to provide our service:</p>
            <ul>
                <li>Recipe preferences and saves</li>
                <li>Meal plans you create</li>
                <li>Optional email for newsletter</li>
            </ul>
            
            <h3>How We Use Your Information</h3>
            <p>To provide personalized recipe recommendations and improve our service.</p>
            
            <h3>Your Rights</h3>
            <p>You can delete your saved data at any time through the app settings.</p>
            
            <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
        </div>
    `;
}

function createDefaultPage() {
    return `
        <div class="page-header">
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
        </div>
        
        <div class="page-content">
            <p>Return to the main page to continue exploring recipes.</p>
            <button class="btn btn-primary" id="go-home">
                Go Home
            </button>
        </div>
    `;
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Search
    elements.searchBtn?.addEventListener('click', handleSearch);
    elements.surpriseBtn?.addEventListener('click', handleSurpriseMe);
    elements.searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Tags
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            elements.searchInput.value = tag.dataset.ingredient;
            handleSearch();
        });
    });
    
    // Modal
    elements.modalClose?.addEventListener('click', closeModal);
    elements.modalOverlay?.addEventListener('click', closeModal);
    
    // Escape key to close modal/pages
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closePage();
        }
    });
    
    // Footer links
    elements.footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                loadPage(page);
            }
        });
    });
    
    // Newsletter
    elements.subscribeBtn?.addEventListener('click', handleNewsletter);
    elements.newsletterEmail?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleNewsletter();
    });
    
    // Event delegation for dynamic content
    document.addEventListener('click', (e) => {
        // Recipe card click
        if (e.target.closest('.view-recipe-btn')) {
            const btn = e.target.closest('.view-recipe-btn');
            const recipeId = btn.dataset.id;
            openRecipeModal(recipeId);
        }
        
        // Save button in card
        if (e.target.closest('.save-btn')) {
            const btn = e.target.closest('.save-btn');
            const recipeId = btn.dataset.id;
            toggleSaveRecipe(recipeId, btn);
        }
        
        // Tab switching in modal
        if (e.target.classList.contains('recipe-tab')) {
            const tab = e.target;
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        }
        
        // Download option selection
        if (e.target.closest('.download-option')) {
            const option = e.target.closest('.download-option');
            document.querySelectorAll('.download-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        }
        
        // Download button
        if (e.target.closest('#download-recipe')) {
            handleDownloadClick();
        }
        
        // Add to shopping list
        if (e.target.closest('#add-to-list')) {
            showToast('success', 'Added to List', 'Ingredients added to shopping list');
        }
        
        // Start cooking
        if (e.target.closest('#start-cooking')) {
            showToast('info', 'Cooking Mode', 'Starting step-by-step guide');
            switchTab('instructions');
        }
    });
}

function attachModalEventListeners() {
    // Save recipe in modal
    const saveBtn = document.getElementById('save-recipe-modal');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const recipeId = AppState.currentRecipe?.id;
            if (recipeId) {
                toggleSaveRecipe(recipeId, saveBtn, true);
            }
        });
    }
    
    // Share recipe
    const shareBtn = document.getElementById('share-recipe');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const recipe = AppState.currentRecipe;
            if (recipe && navigator.share) {
                navigator.share({
                    title: recipe.title,
                    text: `Check out this recipe: ${recipe.title}`,
                    url: window.location.href
                }).catch(console.error);
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(`${recipe.title} - ${window.location.href}`);
                showToast('success', 'Link Copied', 'Recipe link copied to clipboard');
            }
        });
    }
    
    // Download recipe
    const downloadBtn = document.getElementById('download-recipe');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownloadClick);
    }
    
    // Tab switching
    document.querySelectorAll('.recipe-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.recipe-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Show active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// ============================================
// Core Functions
// ============================================

function toggleTheme() {
    AppState.theme = AppState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', AppState.theme);
    localStorage.setItem('theme', AppState.theme);
    updateThemeIcon();
    showToast('info', 'Theme Changed', `${AppState.theme.charAt(0).toUpperCase() + AppState.theme.slice(1)} mode activated`);
}

function updateThemeIcon() {
    const icon = elements.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function handleSearch() {
    const query = elements.searchInput.value.trim();
    if (!query) {
        showToast('error', 'Empty Search', 'Please enter some ingredients');
        return;
    }
    
    showLoading(true);
    
    // Simulate search
    setTimeout(() => {
        const filteredRecipes = AppState.recipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query.toLowerCase()) ||
            recipe.category.toLowerCase().includes(query.toLowerCase()) ||
            recipe.area.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredRecipes.length > 0) {
            const tempRecipes = [...AppState.recipes];
            AppState.recipes = filteredRecipes;
            renderRecipes();
            AppState.recipes = tempRecipes;
            showToast('success', 'Search Results', `Found ${filteredRecipes.length} recipes`);
        } else {
            showToast('info', 'No Results', 'Try different ingredients');
        }
        
        showLoading(false);
    }, 800);
}

function handleSurpriseMe() {
    showLoading(true);
    
    // Shuffle and show random recipes
    setTimeout(() => {
        const shuffled = [...AppState.recipes].sort(() => Math.random() - 0.5);
        const tempRecipes = [...AppState.recipes];
        AppState.recipes = shuffled;
        renderRecipes();
        AppState.recipes = tempRecipes;
        showLoading(false);
        showToast('success', 'Surprise!', 'Here are some random recipes for you');
    }, 600);
}

function toggleSaveRecipe(recipeId, button, isInModal = false) {
    const recipe = AppState.recipes.find(r => r.id === recipeId) || AppState.recipes[0];
    const isSaved = AppState.savedRecipes.some(r => r.id === recipeId);
    
    if (isSaved) {
        // Remove
        AppState.savedRecipes = AppState.savedRecipes.filter(r => r.id !== recipeId);
        if (isInModal) {
            button.innerHTML = '<i class="far fa-bookmark"></i> Save';
        } else {
            button.innerHTML = '<i class="far fa-bookmark"></i>';
        }
        showToast('info', 'Removed', 'Recipe removed from saved');
    } else {
        // Add
        AppState.savedRecipes.push(recipe);
        if (isInModal) {
            button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        } else {
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
        }
        showToast('success', 'Saved', 'Recipe added to saved');
    }
    
    localStorage.setItem('savedRecipes', JSON.stringify(AppState.savedRecipes));
    
    // Animate button
    button.classList.add('bounce');
    setTimeout(() => button.classList.remove('bounce'), 300);
}

function handleNewsletter() {
    const email = elements.newsletterEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showToast('error', 'Email Required', 'Please enter your email address');
        return;
    }
    
    if (!emailRegex.test(email)) {
        showToast('error', 'Invalid Email', 'Please enter a valid email address');
        return;
    }
    
    // Simulate subscription
    elements.subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        elements.subscribeBtn.innerHTML = 'Subscribe';
        elements.newsletterEmail.value = '';
        showToast('success', 'Subscribed!', 'You will receive weekly recipes');
    }, 1500);
}

function showLoading(show) {
    if (show) {
        elements.loadingState.classList.add('active');
        elements.recipesGrid.style.opacity = '0.5';
    } else {
        elements.loadingState.classList.remove('active');
        elements.recipesGrid.style.opacity = '1';
    }
}

function showToast(type, title, message) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="toast-content">
            <h5>${title}</h5>
            <p>${message}</p>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove
    const autoRemove = setTimeout(() => {
        hideToast(toast);
    }, 5000);
    
    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        hideToast(toast);
    });
}

function hideToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// CSS for bounce animation
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .bounce {
        animation: bounce 0.3s ease;
    }
    
    .categories-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .category-card {
        background: var(--light-gray);
        padding: 1.5rem;
        border-radius: var(--radius);
        text-align: center;
        transition: var(--transition);
        border: 1px solid var(--border);
    }
    
    .category-card:hover {
        background: var(--border);
        transform: translateY(-4px);
    }
    
    .category-card i {
        font-size: 2rem;
        color: var(--primary);
        margin-bottom: 1rem;
    }
    
    .category-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 2rem;
    }
    
    .category-item {
        display: flex;
        justify-content: space-between;
        padding: 1rem;
        background: var(--light-gray);
        border-radius: 8px;
        transition: var(--transition);
    }
    
    .category-item:hover {
        background: var(--border);
        transform: translateX(4px);
    }
    
    .seasonal-content {
        margin-top: 2rem;
    }
    
    .seasonal-content h3 {
        margin: 1.5rem 0 1rem;
        color: var(--primary);
    }
    
    .seasonal-content ul {
        list-style: none;
        padding-left: 1rem;
    }
    
    .seasonal-content li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border);
    }
    
    .meal-planner {
        margin-top: 2rem;
    }
    
    .week-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 0.5rem;
        margin-bottom: 2rem;
    }
    
    .day {
        padding: 1rem;
        background: var(--light-gray);
        text-align: center;
        border-radius: 8px;
        font-weight: 500;
    }
    
    .shopping-list {
        margin-top: 2rem;
    }
    
    .list-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: var(--light-gray);
        border-radius: 8px;
        margin-bottom: 0.5rem;
    }
    
    .add-item {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .add-item input {
        flex: 1;
        padding: 0.75rem;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: var(--light);
        color: var(--dark);
    }
    
    .techniques-list {
        margin-top: 2rem;
    }
    
    .technique {
        background: var(--light-gray);
        padding: 1.5rem;
        border-radius: var(--radius);
        margin-bottom: 1rem;
    }
    
    .about-content, .privacy-content, .contact-content {
        margin-top: 2rem;
    }
    
    .about-content h3, .privacy-content h3, .contact-content h3 {
        margin: 1.5rem 0 1rem;
        color: var(--primary);
    }
    
    .about-content ul, .privacy-content ul {
        padding-left: 1.5rem;
        margin: 1rem 0;
    }
    
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
    }
    
    .contact-form input, .contact-form textarea {
        padding: 0.75rem;
        border: 2px solid var(--border);
        border-radius: 8px;
        background: var(--light);
        color: var(--dark);
        font-family: inherit;
    }
`;
document.head.appendChild(style);