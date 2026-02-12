/* =================================================================
   RECIPE FINDER APP - FIXED SEARCH RESULTS
   Issues Fixed: 
   1. Search results now show ONLY recipes matching the search term
   2. Featured Recipes section shows rice recipes when user searches for "rice"
   3. No more showing random recipes when searching
   4. Dropdown suggestions match search term
   ================================================================= */

const CONFIG = {
    API: {
        THEMEALDB: 'https://www.themealdb.com/api/json/v1/1'
    },
    STORAGE_KEYS: {
        SAVED_RECIPES: 'recipeFinder_saved',
        SHOPPING_LIST: 'recipeFinder_cart',
        MEAL_PLAN: 'recipeFinder_mealPlan'
    },
    DEBOUNCE_DELAY: 300
};

let LOCAL_RECIPES = [];

class NutritionCalculator {
    static estimateNutrition(recipe, servings = 1) {
        const baseNutrition = {
            calories: 350, protein: 25, carbs: 45, 
            fat: 12, fiber: 5, sodium: 600
        };
        const category = recipe.strCategory?.toLowerCase() || '';
        if (category.includes('dessert')) {
            Object.assign(baseNutrition, { calories: 450, carbs: 65, fat: 18, protein: 6 });
        } else if (category.includes('beef') || category.includes('chicken')) {
            Object.assign(baseNutrition, { protein: 35, fat: 15 });
        } else if (category.includes('seafood') || category.includes('fish')) {
            Object.assign(baseNutrition, { protein: 30, fat: 8, calories: 280 });
        } else if (category.includes('vegetarian') || category.includes('vegan')) {
            Object.assign(baseNutrition, { protein: 12, fat: 8, fiber: 10, calories: 280 });
        } else if (category.includes('pasta') || category.includes('rice')) {
            Object.assign(baseNutrition, { carbs: 55, calories: 380 });
        }
        return {
            calories: Math.round(baseNutrition.calories * servings),
            protein: Math.round(baseNutrition.protein * servings),
            carbs: Math.round(baseNutrition.carbs * servings),
            fat: Math.round(baseNutrition.fat * servings),
            fiber: Math.round(baseNutrition.fiber * servings),
            sodium: Math.round(baseNutrition.sodium * servings)
        };
    }

    static getNutritionPercentages(nutrition) {
        const dailyValues = {
            calories: 2000, protein: 50, carbs: 300, 
            fat: 70, fiber: 25, sodium: 2300
        };
        const percentages = {};
        for (let key in nutrition) {
            percentages[key] = Math.min(Math.round((nutrition[key] / dailyValues[key]) * 100), 100);
        }
        return percentages;
    }
}

class AppState {
    constructor() {
        this.currentPage = 'home';
        this.currentRecipe = null;
        this.savedRecipes = this.loadFromStorage('SAVED_RECIPES', []);
        this.shoppingList = this.loadFromStorage('SHOPPING_LIST', []);
        this.mealPlan = this.loadFromStorage('MEAL_PLAN', {});
        this.servingsMultiplier = 1;
        this.currentWeekStart = this.getWeekStart(new Date());
        this.selectedMealPlanRecipe = null;
        this.baseIngredients = [];
        this.baseCookingTime = 0;
        this.lastSearchQuery = '';
    }

    loadFromStorage(key, defaultValue) {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS[key]);
            const parsed = data ? JSON.parse(data) : defaultValue;
            return parsed;
        } catch (error) {
            console.error(`❌ Error loading ${key}:`, error);
            return defaultValue;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS[key], JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`❌ Error saving ${key}:`, error);
            return false;
        }
    }

    saveRecipe(recipe) {
        if (!this.savedRecipes.find(r => r.idMeal === recipe.idMeal)) {
            this.savedRecipes.push({ ...recipe, savedAt: new Date().toISOString() });
            this.saveToStorage('SAVED_RECIPES', this.savedRecipes);
            UI.updateSavedBadge(this.savedRecipes.length);
            return true;
        }
        return false;
    }

    removeRecipe(recipeId) {
        this.savedRecipes = this.savedRecipes.filter(r => r.idMeal !== recipeId);
        this.saveToStorage('SAVED_RECIPES', this.savedRecipes);
        UI.updateSavedBadge(this.savedRecipes.length);
    }

    isRecipeSaved(recipeId) {
        return this.savedRecipes.some(r => r.idMeal === recipeId);
    }

    addToShoppingList(items, recipeName) {
        items.forEach(item => {
            if (!this.shoppingList.find(i => i.name.toLowerCase() === item.toLowerCase())) {
                this.shoppingList.push({ 
                    name: item, 
                    checked: false, 
                    from: recipeName,
                    addedAt: Date.now() 
                });
            }
        });
        this.saveToStorage('SHOPPING_LIST', this.shoppingList);
        UI.updateCartBadge(this.shoppingList.filter(i => !i.checked).length);
    }

    toggleShoppingItem(itemName) {
        const item = this.shoppingList.find(i => i.name === itemName);
        if (item) {
            item.checked = !item.checked;
            this.saveToStorage('SHOPPING_LIST', this.shoppingList);
            UI.updateCartBadge(this.shoppingList.filter(i => !i.checked).length);
        }
    }

    deleteShoppingItem(itemName) {
        this.shoppingList = this.shoppingList.filter(i => i.name !== itemName);
        this.saveToStorage('SHOPPING_LIST', this.shoppingList);
        UI.updateCartBadge(this.shoppingList.filter(i => !i.checked).length);
    }

    clearShoppingList() {
        this.shoppingList = [];
        this.saveToStorage('SHOPPING_LIST', this.shoppingList);
        UI.updateCartBadge(0);
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    addToMealPlan(date, mealType, recipe) {
        if (!this.mealPlan[date]) {
            this.mealPlan[date] = {};
        }
        this.mealPlan[date][mealType] = {
            idMeal: recipe.idMeal,
            strMeal: recipe.strMeal,
            strMealThumb: recipe.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
            strCategory: recipe.strCategory,
            strArea: recipe.strArea,
            strInstructions: recipe.strInstructions || '',
            strTags: recipe.strTags || ''
        };
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                this.mealPlan[date][mealType][`strIngredient${i}`] = recipe[`strIngredient${i}`];
                this.mealPlan[date][mealType][`strMeasure${i}`] = recipe[`strMeasure${i}`];
            }
        }
        const saved = this.saveToStorage('MEAL_PLAN', this.mealPlan);
        return saved;
    }

    removeFromMealPlan(date, mealType) {
        if (this.mealPlan[date] && this.mealPlan[date][mealType]) {
            delete this.mealPlan[date][mealType];
            if (Object.keys(this.mealPlan[date]).length === 0) {
                delete this.mealPlan[date];
            }
            this.saveToStorage('MEAL_PLAN', this.mealPlan);
        }
    }

    getMealForDay(date, mealType) {
        return this.mealPlan[date]?.[mealType] || null;
    }
}

const state = new AppState();

class APIService {
    static async searchByName(name) {
        try {
            const url = `${CONFIG.API.THEMEALDB}/search.php?s=${encodeURIComponent(name)}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            return { meals: null };
        }
    }

    static async getRecipeDetails(id) {
        try {
            const url = `${CONFIG.API.THEMEALDB}/lookup.php?i=${id}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            return { meals: null };
        }
    }

    static async getRandomRecipe() {
        try {
            const response = await fetch(`${CONFIG.API.THEMEALDB}/random.php`);
            return await response.json();
        } catch (error) {
            return { meals: null };
        }
    }

    static async getMultipleRandomRecipes(count = 6) {
        const promises = Array(count).fill().map(() => this.getRandomRecipe());
        const results = await Promise.all(promises);
        return results.flatMap(r => r.meals || []);
    }

    static async filterByArea(area) {
        try {
            const response = await fetch(`${CONFIG.API.THEMEALDB}/filter.php?a=${encodeURIComponent(area)}`);
            return await response.json();
        } catch (error) {
            return { meals: null };
        }
    }

    static async filterByCategory(category) {
        try {
            const response = await fetch(`${CONFIG.API.THEMEALDB}/filter.php?c=${encodeURIComponent(category)}`);
            return await response.json();
        } catch (error) {
            return { meals: null };
        }
    }

    static searchLocalRecipes(query) {
        const lowerQuery = query.toLowerCase();
        return LOCAL_RECIPES.filter(recipe => {
            return recipe.name?.toLowerCase().includes(lowerQuery) ||
                   recipe.strMeal?.toLowerCase().includes(lowerQuery) ||
                   recipe.ingredients?.some(ing => ing.item.toLowerCase().includes(lowerQuery)) ||
                   recipe.category?.toLowerCase().includes(lowerQuery) ||
                   recipe.cuisine?.toLowerCase().includes(lowerQuery) ||
                   recipe.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        });
    }

    static async combinedSearch(query) {
        const localResults = this.searchLocalRecipes(query);
        const apiResults = await this.searchByName(query);
        
        // Filter API results to ensure they actually match the query
        const lowerQuery = query.toLowerCase();
        const filteredApiResults = (apiResults.meals || []).filter(meal => {
            return meal.strMeal?.toLowerCase().includes(lowerQuery) ||
                   meal.strCategory?.toLowerCase().includes(lowerQuery) ||
                   meal.strArea?.toLowerCase().includes(lowerQuery) ||
                   meal.strTags?.toLowerCase().includes(lowerQuery) ||
                   this.recipeHasIngredient(meal, lowerQuery);
        });
        
        return [
            ...localResults.map(r => this.normalizeLocalRecipe(r)),
            ...filteredApiResults
        ];
    }

    static recipeHasIngredient(recipe, query) {
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            if (ingredient && ingredient.toLowerCase().includes(query)) {
                return true;
            }
        }
        return false;
    }

    static normalizeLocalRecipe(recipe) {
        return {
            idMeal: recipe.id,
            strMeal: recipe.name || recipe.strMeal,
            strMealThumb: recipe.image || recipe.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80',
            strCategory: recipe.category || 'Main',
            strArea: recipe.cuisine || recipe.strArea || 'Nigerian',
            strInstructions: recipe.instructions?.map(i => i.text).join('\n') || recipe.description || '',
            strTags: recipe.tags?.join(',') || ''
        };
    }

    static estimateCookingTime(recipe) {
        if (recipe.prepTime && recipe.cookTime) return recipe.prepTime + recipe.cookTime;
        if (recipe.cookTime) return recipe.cookTime;
        if (recipe.prepTime) return recipe.prepTime;
        const category = recipe.strCategory?.toLowerCase() || '';
        if (category.includes('dessert')) return 45;
        if (category.includes('soup')) return 60;
        if (category.includes('pasta')) return 25;
        if (category.includes('breakfast')) return 20;
        return 35;
    }
}

class UI {
    static init() {
        this.setupEventListeners();
        this.loadFeaturedRecipes();
        this.updateBadges();
        this.loadLocalRecipes();
        
        if (document.getElementById('mealPlanPage')?.classList.contains('active')) {
            this.renderMealPlan();
        }
    }

    static hideLoadingScreen() {
        const loader = document.getElementById('loadingScreen');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.display = 'none';
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }
    }

    static async loadLocalRecipes() {
        if (typeof RECIPE_DATABASE !== 'undefined') {
            LOCAL_RECIPES = [
                ...(RECIPE_DATABASE.nigerian || []),
                ...(RECIPE_DATABASE['west-african'] || []),
                ...(RECIPE_DATABASE.quick || []),
                ...(RECIPE_DATABASE.international || [])
            ];
            console.log(`✅ Loaded ${LOCAL_RECIPES.length} local recipes`);
        }
    }

    static setupEventListeners() {
        // Navigation
        document.querySelectorAll('.dock-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page) this.navigateTo(page);
            });
        });

        const cartBtn = document.getElementById('shoppingCartBtn');
        if (cartBtn) cartBtn.addEventListener('click', () => this.openShoppingCart());

        // SEARCH WITH AUTOCOMPLETE
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const value = e.target.value.trim();
                
                if (value.length >= 2) {
                    searchTimeout = setTimeout(() => {
                        this.handleAutocomplete(value);
                    }, 300);
                } else {
                    this.hideAutocomplete();
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                    this.hideAutocomplete();
                }
            });
        }

        // CLICK OUTSIDE TO HIDE
        document.addEventListener('click', (e) => {
            const searchWrapper = document.querySelector('.search-wrapper');
            const dropdown = document.getElementById('autocompleteDropdown');
            if (dropdown && !dropdown.classList.contains('hidden')) {
                if (!searchWrapper?.contains(e.target) && !dropdown.contains(e.target)) {
                    this.hideAutocomplete();
                }
            }
        });

        // WINDOW SCROLL - reposition dropdown if visible
        window.addEventListener('scroll', () => {
            const dropdown = document.getElementById('autocompleteDropdown');
            if (dropdown && !dropdown.classList.contains('hidden')) {
                this.positionAutocomplete();
            }
        });

        // WINDOW RESIZE - reposition dropdown if visible
        window.addEventListener('resize', () => {
            const dropdown = document.getElementById('autocompleteDropdown');
            if (dropdown && !dropdown.classList.contains('hidden')) {
                this.positionAutocomplete();
            }
        });

        const voiceBtn = document.getElementById('voiceSearchBtn');
        if (voiceBtn) voiceBtn.addEventListener('click', () => this.startVoiceSearch());

        const quickActions = {
            'randomRecipeBtn': () => this.loadRandomRecipe(),
            'trendingBtn': () => this.loadTrendingRecipes(),
            'quickMealsBtn': () => this.filterRecipes('quick'),
            'healthyBtn': () => this.filterRecipes('healthy')
        };

        Object.entries(quickActions).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', handler);
        });

        document.querySelectorAll('.region-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const region = e.currentTarget.dataset.region;
                this.loadRegionalRecipes(region);
            });
        });

        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                if (filter) this.applyQuickFilter(filter);
            });
        });

        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) modal.classList.remove('active');
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    const modal = e.target.closest('.modal');
                    if (modal) modal.classList.remove('active');
                }
            });
        });

        const closeDrawerBtn = document.getElementById('closeDrawerBtn');
        const drawerOverlay = document.getElementById('drawerOverlay');
        if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', () => this.closeDrawer());
        if (drawerOverlay) drawerOverlay.addEventListener('click', () => this.closeDrawer());

        const clearCartBtn = document.getElementById('clearCartBtn');
        const shareCartBtn = document.getElementById('shareCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Clear all items?')) {
                    state.clearShoppingList();
                    this.renderShoppingList();
                }
            });
        }
        if (shareCartBtn) shareCartBtn.addEventListener('click', () => this.shareShoppingList());

        // MEAL PLAN CONTROLS
        const prevWeekBtn = document.getElementById('prevWeekBtn');
        const nextWeekBtn = document.getElementById('nextWeekBtn');
        const generateShoppingListBtn = document.getElementById('generateShoppingListBtn');
        const clearWeekBtn = document.getElementById('clearWeekBtn');
        
        if (prevWeekBtn) {
            prevWeekBtn.addEventListener('click', () => {
                state.currentWeekStart.setDate(state.currentWeekStart.getDate() - 7);
                this.renderMealPlan();
            });
        }
        if (nextWeekBtn) {
            nextWeekBtn.addEventListener('click', () => {
                state.currentWeekStart.setDate(state.currentWeekStart.getDate() + 7);
                this.renderMealPlan();
            });
        }
        if (generateShoppingListBtn) {
            generateShoppingListBtn.addEventListener('click', () => this.generateShoppingListFromMealPlan());
        }
        if (clearWeekBtn) {
            clearWeekBtn.addEventListener('click', () => {
                if (confirm('Clear this week\'s meal plan?')) this.clearWeekMealPlan();
            });
        }

        const savedSearchInput = document.getElementById('savedSearchInput');
        const savedSortFilter = document.getElementById('savedSortFilter');
        if (savedSearchInput) {
            let timeout;
            savedSearchInput.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.filterSavedRecipes(e.target.value), 300);
            });
        }
        if (savedSortFilter) {
            savedSortFilter.addEventListener('change', () => this.renderSavedRecipes());
        }

        ['cuisineFilter', 'categoryFilter', 'dietFilter'].forEach(id => {
            const filter = document.getElementById(id);
            if (filter) filter.addEventListener('change', () => this.applyDiscoverFilters());
        });

        // EVENT DELEGATION
        document.addEventListener('click', (e) => {
            if (e.target.closest('.save-btn')) {
                const btn = e.target.closest('.save-btn');
                const card = btn.closest('.recipe-card');
                if (card) this.toggleSaveRecipe(card.dataset.recipeId, btn);
            }

            if (e.target.closest('.view-recipe-btn')) {
                const btn = e.target.closest('.view-recipe-btn');
                const card = btn.closest('.recipe-card');
                if (card) this.showRecipeDetails(card.dataset.recipeId);
            }

            if (e.target.closest('#addToMealPlanBtn')) {
                this.openMealPlanSelector();
            }

            if (e.target.closest('.meal-type-btn')) {
                document.querySelectorAll('.meal-type-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.meal-type-btn').classList.add('active');
            }

            if (e.target.closest('#confirmAddToMealPlan')) {
                this.confirmAddToMealPlan();
            }

            if (e.target.closest('.shopping-item input[type="checkbox"]')) {
                const item = e.target.closest('.shopping-item');
                const itemName = item.querySelector('.item-name').textContent;
                state.toggleShoppingItem(itemName);
                this.renderShoppingList();
            }

            if (e.target.closest('.delete-item')) {
                const item = e.target.closest('.delete-item').closest('.shopping-item');
                const itemName = item.querySelector('.item-name').textContent;
                state.deleteShoppingItem(itemName);
                this.renderShoppingList();
            }

            // AUTOCOMPLETE ITEM CLICK
            if (e.target.closest('.autocomplete-item')) {
                const recipeId = e.target.closest('.autocomplete-item').dataset.recipeId;
                this.showRecipeDetails(recipeId);
                this.hideAutocomplete();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = '';
            }

            if (e.target.closest('[data-navigate="discover"]')) {
                this.navigateTo('discover');
            }

            // MEAL SLOT CLICK
            if (e.target.closest('.meal-slot') && !e.target.closest('.remove-meal') && !e.target.closest('.empty-slot')) {
                const slot = e.target.closest('.meal-slot');
                const date = slot.dataset.date;
                const mealType = slot.dataset.mealType;
                const meal = state.getMealForDay(date, mealType);
                if (meal && meal.idMeal) {
                    this.showRecipeDetails(meal.idMeal);
                }
            }

            if (e.target.closest('.remove-meal')) {
                e.stopPropagation();
                const slot = e.target.closest('.meal-slot');
                state.removeFromMealPlan(slot.dataset.date, slot.dataset.mealType);
                this.renderMealPlan();
                this.showToast('Meal removed', 'info');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDrawer();
                document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
                this.hideAutocomplete();
            }
        });
    }

    static navigateTo(page) {
        document.querySelectorAll('.dock-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) item.classList.add('active');
        });

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
            state.currentPage = page;

            if (page === 'discover') this.renderDiscoverPage();
            else if (page === 'saved') this.renderSavedRecipes();
            else if (page === 'meal-plan') {
                this.renderMealPlan();
            }
        }
    }

    static async loadFeaturedRecipes() {
        const container = document.getElementById('featuredRecipes');
        if (!container) return;
        
        // If there was a recent search, show those results instead
        if (state.lastSearchQuery && state.lastSearchQuery.length >= 2) {
            this.showToast(`Showing recipes for "${state.lastSearchQuery}"`, 'info');
            const results = await APIService.combinedSearch(state.lastSearchQuery);
            if (results.length > 0) {
                container.innerHTML = results.slice(0, 6).map(recipe => this.createRecipeCard(recipe)).join('');
                return;
            }
        }
        
        // Otherwise show random featured recipes
        container.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
        
        try {
            const localFeatured = LOCAL_RECIPES.slice(0, 3);
            const apiRecipes = await APIService.getMultipleRandomRecipes(3);
            const allRecipes = [
                ...localFeatured.map(r => APIService.normalizeLocalRecipe(r)),
                ...apiRecipes
            ];
            container.innerHTML = allRecipes.map(recipe => this.createRecipeCard(recipe)).join('');
        } catch (error) {
            container.innerHTML = '<p>Error loading recipes</p>';
        }
    }

    static createRecipeCard(recipe) {
        const isSaved = state.isRecipeSaved(recipe.idMeal);
        const cookingTime = APIService.estimateCookingTime(recipe);
        const imageUrl = recipe.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.idMeal}">
                <div class="recipe-image">
                    <img src="${imageUrl}" alt="${recipe.strMeal}" loading="lazy">
                    <button class="save-btn ${isSaved ? 'saved' : ''}" title="${isSaved ? 'Remove' : 'Save'}">
                        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                    ${recipe.strArea ? `<span class="recipe-badge">${recipe.strArea}</span>` : ''}
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.strMeal}</h3>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${cookingTime} min</span>
                        <span><i class="fas fa-utensils"></i> ${recipe.strCategory || 'Main'}</span>
                    </div>
                    <button class="view-recipe-btn">View Recipe</button>
                </div>
            </div>
        `;
    }

    static positionAutocomplete() {
        const searchWrapper = document.querySelector('.search-wrapper');
        const dropdown = document.getElementById('autocompleteDropdown');
        
        if (!searchWrapper || !dropdown) return;
        
        const rect = searchWrapper.getBoundingClientRect();
        
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
        dropdown.style.right = 'auto';
        dropdown.style.margin = '0';
    }

    static async handleAutocomplete(query) {
        const results = await APIService.combinedSearch(query);
        this.showAutocomplete(results.slice(0, 5));
    }

    static showAutocomplete(results) {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (!dropdown) return;
        
        if (results.length === 0) {
            this.hideAutocomplete();
            return;
        }

        dropdown.innerHTML = results.map(recipe => {
            const imageUrl = recipe.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
            return `
                <div class="autocomplete-item" data-recipe-id="${recipe.idMeal}">
                    <img src="${imageUrl}" alt="${recipe.strMeal}">
                    <div class="autocomplete-info">
                        <div class="autocomplete-title">${recipe.strMeal}</div>
                        <div class="autocomplete-meta">${recipe.strArea || 'International'} • ${recipe.strCategory || 'Main'}</div>
                    </div>
                </div>
            `;
        }).join('');

        dropdown.classList.remove('hidden');
        this.positionAutocomplete();
    }

    static hideAutocomplete() {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    }

    static async handleSearch(query) {
        if (!query || query.trim() === '') {
            this.showToast('Please enter a search term', 'info');
            return;
        }
        
        // Save the search query
        state.lastSearchQuery = query.trim();
        
        // Navigate to discover page to show all results
        this.navigateTo('discover');
        
        // Also update featured recipes on home page with search results
        this.loadFeaturedRecipes();
        
        const resultsContainer = document.getElementById('discoverResults');
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>Searching...</p></div>';
        
        try {
            const results = await APIService.combinedSearch(query);
            
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No recipes found for "${query}"</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
            } else {
                resultsContainer.innerHTML = results.map(recipe => this.createRecipeCard(recipe)).join('');
                this.showToast(`Found ${results.length} recipes for "${query}"`, 'success');
            }
        } catch (error) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Search failed</h3>
                    <p>Please try again</p>
                </div>
            `;
        }
    }

    static startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window)) {
            this.showToast('Voice search not supported', 'error');
            return;
        }
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;
        const searchInput = document.getElementById('searchInput');
        const voiceBtn = document.getElementById('voiceSearchBtn');
        voiceBtn.classList.add('listening');
        recognition.start();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            this.handleSearch(transcript);
            voiceBtn.classList.remove('listening');
        };
        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
            this.showToast('Voice search failed', 'error');
        };
        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
        };
    }

    static async loadRandomRecipe() {
        this.showToast('Loading random recipe...', 'info');
        try {
            const data = await APIService.getRandomRecipe();
            if (data.meals?.[0]) this.showRecipeDetails(data.meals[0].idMeal);
        } catch (error) {
            this.showToast('Failed to load recipe', 'error');
        }
    }

    static async loadTrendingRecipes() {
        this.navigateTo('discover');
        const resultsContainer = document.getElementById('discoverResults');
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
        try {
            const recipes = await APIService.getMultipleRandomRecipes(12);
            resultsContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
        } catch (error) {
            resultsContainer.innerHTML = '<p>Error loading recipes</p>';
        }
    }

    static async loadRegionalRecipes(region) {
        this.navigateTo('discover');
        const resultsContainer = document.getElementById('discoverResults');
        if (!resultsContainer) return;
        resultsContainer.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
        try {
            const areaName = region.charAt(0).toUpperCase() + region.slice(1);
            const data = await APIService.filterByArea(areaName);
            if (data.meals) {
                const detailedRecipes = await Promise.all(
                    data.meals.slice(0, 12).map(meal => APIService.getRecipeDetails(meal.idMeal))
                );
                const recipes = detailedRecipes.map(d => d.meals[0]).filter(Boolean);
                resultsContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
            } else {
                resultsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-globe"></i>
                        <h3>No ${region} recipes found</h3>
                    </div>
                `;
            }
        } catch (error) {
            resultsContainer.innerHTML = '<p>Error loading recipes</p>';
        }
    }

    static applyQuickFilter(filter) {
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
            if (chip.dataset.filter === filter) chip.classList.add('active');
        });
        if (filter === 'all') this.loadFeaturedRecipes();
        else this.loadRegionalRecipes(filter);
    }

    static async showRecipeDetails(recipeId) {
        const drawer = document.getElementById('recipeDrawer');
        if (!drawer) return;
        drawer.classList.add('active');
        const detailContainer = document.getElementById('recipeDetail');
        detailContainer.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
        try {
            const localRecipe = LOCAL_RECIPES.find(r => r.id === recipeId);
            let recipe;
            if (localRecipe) {
                recipe = APIService.normalizeLocalRecipe(localRecipe);
            } else {
                const data = await APIService.getRecipeDetails(recipeId);
                recipe = data.meals?.[0];
            }
            if (!recipe) {
                detailContainer.innerHTML = '<p>Recipe not found</p>';
                return;
            }
            state.currentRecipe = recipe;
            state.servingsMultiplier = 1;
            state.baseIngredients = this.extractIngredients(recipe);
            state.baseCookingTime = APIService.estimateCookingTime(recipe);
            detailContainer.innerHTML = this.createRecipeDetailHTML(recipe);
            this.setupRecipeDetailListeners(recipe);
        } catch (error) {
            detailContainer.innerHTML = '<p>Error loading recipe</p>';
        }
    }

    static createRecipeDetailHTML(recipe) {
        const isSaved = state.isRecipeSaved(recipe.idMeal);
        const ingredients = state.baseIngredients;
        const instructions = this.extractInstructions(recipe);
        const cookingTime = state.baseCookingTime;
        const nutrition = NutritionCalculator.estimateNutrition(recipe, state.servingsMultiplier);
        const nutritionPercentages = NutritionCalculator.getNutritionPercentages(nutrition);
        const imageUrl = recipe.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80';

        return `
            <img src="${imageUrl}" alt="${recipe.strMeal}" class="detail-image">
            <div class="detail-header-content">
                <h1 class="detail-title">${recipe.strMeal}</h1>
                <div class="detail-meta">
                    <span class="meta-tag"><i class="fas fa-clock"></i> <span id="currentCookTime">${Math.round(cookingTime * state.servingsMultiplier)}</span> min</span>
                    ${recipe.strCategory ? `<span class="meta-tag"><i class="fas fa-utensils"></i> ${recipe.strCategory}</span>` : ''}
                    ${recipe.strArea ? `<span class="meta-tag"><i class="fas fa-globe"></i> ${recipe.strArea}</span>` : ''}
                </div>
                <div class="recipe-actions">
                    <button class="action-btn primary" id="addToShoppingListBtn"><i class="fas fa-cart-plus"></i> Add to List</button>
                    <button class="action-btn secondary ${isSaved ? 'saved' : ''}" id="saveRecipeBtn"><i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> ${isSaved ? 'Saved' : 'Save'}</button>
                    <button class="action-btn secondary" id="addToMealPlanBtn"><i class="fas fa-calendar-plus"></i> Meal Plan</button>
                    <button class="action-btn secondary" id="shareRecipeBtn"><i class="fas fa-share-alt"></i> Share</button>
                </div>
            </div>
            <div class="recipe-detail-body">
                <div class="detail-section">
                    <div class="section-header-with-action">
                        <h2><i class="fas fa-shopping-basket"></i> Ingredients</h2>
                        <div class="serving-adjuster">
                            <button class="serving-btn" id="decreaseServing">−</button>
                            <span id="servingDisplay">${state.servingsMultiplier}x</span>
                            <button class="serving-btn" id="increaseServing">+</button>
                        </div>
                    </div>
                    <ul class="ingredients-list" id="ingredientsList">
                        ${ingredients.map((ing, idx) => `
                            <li class="ingredient-item">
                                <input type="checkbox" id="ing-${idx}">
                                <label for="ing-${idx}">
                                    <span class="ingredient-measure" data-base="${ing.measure}">${this.scaleIngredient(ing.measure, state.servingsMultiplier)}</span>
                                    <span class="ingredient-name">${ing.ingredient}</span>
                                </label>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="detail-section">
                    <h2><i class="fas fa-list-ol"></i> Instructions</h2>
                    <ol class="instructions-list">
                        ${instructions.map((inst, idx) => `
                            <li class="instruction-step">
                                <div class="step-number">${idx + 1}</div>
                                <div class="step-content">${inst}</div>
                            </li>
                        `).join('')}
                    </ol>
                </div>
                <div class="detail-section">
                    <h2><i class="fas fa-chart-pie"></i> Nutrition Facts</h2>
                    <div class="nutrition-grid">
                        ${this.createNutritionItems(nutrition, nutritionPercentages)}
                    </div>
                    <p class="nutrition-note"><small>*Based on a 2,000 calorie diet. Values are estimates.</small></p>
                </div>
                ${recipe.strYoutube ? `
                    <div class="detail-section">
                        <h2><i class="fas fa-video"></i> Video Tutorial</h2>
                        <div class="video-container">
                            <iframe src="https://www.youtube.com/embed/${this.getYoutubeId(recipe.strYoutube)}" frameborder="0" allowfullscreen></iframe>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    static createNutritionItems(nutrition, percentages) {
        const items = [
            { key: 'calories', label: 'Calories', unit: '' },
            { key: 'protein', label: 'Protein', unit: 'g' },
            { key: 'carbs', label: 'Carbs', unit: 'g' },
            { key: 'fat', label: 'Fat', unit: 'g' },
            { key: 'fiber', label: 'Fiber', unit: 'g' },
            { key: 'sodium', label: 'Sodium', unit: 'mg' }
        ];
        return items.map(item => `
            <div class="nutrition-item">
                <div class="nutrition-label">${item.label}</div>
                <div class="nutrition-value">${nutrition[item.key]}${item.unit}</div>
                <div class="nutrition-bar">
                    <div class="nutrition-fill" style="width: ${percentages[item.key]}%"></div>
                </div>
                <div class="nutrition-percent">${percentages[item.key]}% DV</div>
            </div>
        `).join('');
    }

    static scaleIngredient(measure, multiplier) {
        if (!measure || measure.trim() === '') return '';
        const numberMatch = measure.match(/(\d+\.?\d*)/);
        if (numberMatch) {
            const baseNumber = parseFloat(numberMatch[1]);
            const scaledNumber = baseNumber * multiplier;
            const formattedNumber = scaledNumber % 1 === 0 ? scaledNumber : scaledNumber.toFixed(1);
            return measure.replace(numberMatch[1], formattedNumber);
        }
        return measure;
    }

    static setupRecipeDetailListeners(recipe) {
        const saveBtn = document.getElementById('saveRecipeBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (state.isRecipeSaved(recipe.idMeal)) {
                    state.removeRecipe(recipe.idMeal);
                    saveBtn.innerHTML = '<i class="far fa-bookmark"></i> Save';
                    saveBtn.classList.remove('saved');
                } else {
                    state.saveRecipe(recipe);
                    saveBtn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                    saveBtn.classList.add('saved');
                }
            });
        }

        const addToListBtn = document.getElementById('addToShoppingListBtn');
        if (addToListBtn) {
            addToListBtn.addEventListener('click', () => {
                const ingredientItems = document.querySelectorAll('.ingredient-item label');
                const ingredientNames = Array.from(ingredientItems).map(label => {
                    const measure = label.querySelector('.ingredient-measure').textContent;
                    const name = label.querySelector('.ingredient-name').textContent;
                    return `${measure} ${name}`.trim();
                });
                state.addToShoppingList(ingredientNames, recipe.strMeal);
                this.showToast('Added to shopping list!', 'success');
            });
        }

        const shareBtn = document.getElementById('shareRecipeBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: recipe.strMeal,
                        text: `Check out this recipe: ${recipe.strMeal}`,
                        url: window.location.href
                    }).catch(() => {});
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    this.showToast('Link copied!', 'success');
                }
            });
        }

        const decreaseBtn = document.getElementById('decreaseServing');
        const increaseBtn = document.getElementById('increaseServing');
        const servingDisplay = document.getElementById('servingDisplay');

        if (decreaseBtn && increaseBtn && servingDisplay) {
            decreaseBtn.addEventListener('click', () => {
                if (state.servingsMultiplier > 0.5) {
                    state.servingsMultiplier -= 0.5;
                    servingDisplay.textContent = `${state.servingsMultiplier}x`;
                    this.updateRecipeScaling();
                }
            });
            increaseBtn.addEventListener('click', () => {
                if (state.servingsMultiplier < 5) {
                    state.servingsMultiplier += 0.5;
                    servingDisplay.textContent = `${state.servingsMultiplier}x`;
                    this.updateRecipeScaling();
                }
            });
        }
    }

    static updateRecipeScaling() {
        document.querySelectorAll('.ingredient-measure').forEach(measure => {
            const baseMeasure = measure.dataset.base;
            measure.textContent = this.scaleIngredient(baseMeasure, state.servingsMultiplier);
        });
        const cookTimeEl = document.getElementById('currentCookTime');
        if (cookTimeEl) {
            const newTime = Math.round(state.baseCookingTime + (state.servingsMultiplier - 1) * 3);
            cookTimeEl.textContent = newTime;
        }
        const nutrition = NutritionCalculator.estimateNutrition(state.currentRecipe, state.servingsMultiplier);
        const percentages = NutritionCalculator.getNutritionPercentages(nutrition);
        document.querySelectorAll('.nutrition-item').forEach((item, idx) => {
            const keys = ['calories', 'protein', 'carbs', 'fat', 'fiber', 'sodium'];
            const units = ['', 'g', 'g', 'g', 'g', 'mg'];
            const key = keys[idx];
            if (key) {
                item.querySelector('.nutrition-value').textContent = `${nutrition[key]}${units[idx]}`;
                item.querySelector('.nutrition-percent').textContent = `${percentages[key]}% DV`;
                item.querySelector('.nutrition-fill').style.width = `${percentages[key]}%`;
            }
        });
    }

    static extractIngredients(recipe) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                });
            }
        }
        return ingredients;
    }

    static extractInstructions(recipe) {
        if (!recipe.strInstructions) return ['No instructions available'];
        return recipe.strInstructions
            .split(/\r?\n/)
            .filter(line => line.trim().length > 0)
            .map(line => line.trim());
    }

    static getYoutubeId(url) {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : '';
    }

    static closeDrawer() {
        const drawer = document.getElementById('recipeDrawer');
        if (drawer) {
            drawer.classList.remove('active');
            state.servingsMultiplier = 1;
        }
    }

    static toggleSaveRecipe(recipeId, button) {
        let recipe = state.currentRecipe;
        if (!recipe || recipe.idMeal !== recipeId) {
            recipe = state.savedRecipes.find(r => r.idMeal === recipeId);
        }
        if (!recipe) return;
        if (state.isRecipeSaved(recipeId)) {
            state.removeRecipe(recipeId);
            button.innerHTML = '<i class="far fa-bookmark"></i>';
            button.classList.remove('saved');
        } else {
            state.saveRecipe(recipe);
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
            button.classList.add('saved');
        }
    }

    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('active');
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
    }

    static openMealPlanSelector() {
        if (!state.currentRecipe) {
            this.showToast('Please select a recipe first', 'error');
            return;
        }
        state.selectedMealPlanRecipe = state.currentRecipe;
        const dateInput = document.getElementById('mealDate');
        if (dateInput) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${year}-${month}-${day}`;
        }
        document.querySelectorAll('.meal-type-btn').forEach(btn => btn.classList.remove('active'));
        this.openModal('mealPlanSelectorModal');
    }

    static confirmAddToMealPlan() {
        const dateInput = document.getElementById('mealDate');
        const activeMealTypeBtn = document.querySelector('.meal-type-btn.active');
        if (!dateInput?.value) {
            this.showToast('Please select a date', 'error');
            return;
        }
        if (!activeMealTypeBtn) {
            this.showToast('Please select a meal type', 'error');
            return;
        }
        if (!state.selectedMealPlanRecipe) {
            this.showToast('No recipe selected', 'error');
            return;
        }
        const date = dateInput.value;
        const mealType = activeMealTypeBtn.dataset.meal;
        const success = state.addToMealPlan(date, mealType, state.selectedMealPlanRecipe);
        if (success) {
            this.showToast(`✅ Added ${state.selectedMealPlanRecipe.strMeal} to ${mealType}!`, 'success');
            this.closeModal('mealPlanSelectorModal');
            document.querySelectorAll('.meal-type-btn').forEach(btn => btn.classList.remove('active'));
            if (state.currentPage === 'meal-plan') {
                this.renderMealPlan();
            }
        } else {
            this.showToast('Failed to add to meal plan', 'error');
        }
    }

    static renderMealPlan() {
        const grid = document.getElementById('mealPlanGrid');
        if (!grid) {
            return;
        }

        const weekStart = new Date(state.currentWeekStart);
        const weekDisplay = document.getElementById('currentWeekDisplay');
        if (weekDisplay) {
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            weekDisplay.textContent = `${this.formatDate(weekStart)} - ${this.formatDate(weekEnd)}`;
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const mealTypes = ['breakfast', 'lunch', 'dinner'];
        
        let hasAnyMeals = false;
        let html = `
            <div class="meal-plan-container">
                <div class="meal-plan-header">
                    <div class="meal-type-label"></div>
                    ${days.map(day => `<div class="day-label">${day}</div>`).join('')}
                </div>
        `;

        mealTypes.forEach(mealType => {
            html += `<div class="meal-row">`;
            html += `<div class="meal-type-label">${mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>`;
            
            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                const meal = state.getMealForDay(dateStr, mealType);

                if (meal) {
                    hasAnyMeals = true;
                }

                html += `
                    <div class="meal-slot" data-date="${dateStr}" data-meal-type="${mealType}" data-recipe-id="${meal?.idMeal || ''}">
                        ${meal ? `
                            <div class="meal-content">
                                <img src="${meal.strMealThumb || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}" alt="${meal.strMeal}">
                                <div class="meal-name">${meal.strMeal}</div>
                                <button class="remove-meal" title="Remove meal">×</button>
                            </div>
                        ` : `
                            <div class="empty-slot">
                                <i class="fas fa-plus"></i>
                                <span>Add meal</span>
                            </div>
                        `}
                    </div>
                `;
            }
            html += `</div>`;
        });

        html += `</div>`;

        if (!hasAnyMeals) {
            html = `
                <div class="empty-state">
                    <i class="fas fa-calendar-plus"></i>
                    <h3>No meals planned yet</h3>
                    <p>Browse recipes and click "Add to Meal Plan" to get started</p>
                    <button class="cta-btn" onclick="UI.navigateTo('discover')">Discover Recipes</button>
                </div>
            `;
        }

        grid.innerHTML = html;
    }

    static clearWeekMealPlan() {
        const weekStart = new Date(state.currentWeekStart);
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                state.removeFromMealPlan(dateStr, mealType);
            });
        }
        this.renderMealPlan();
        this.showToast('Week cleared', 'info');
    }

    static generateShoppingListFromMealPlan() {
        let allIngredients = [];
        Object.values(state.mealPlan).forEach(day => {
            Object.values(day).forEach(recipe => {
                if (recipe) {
                    const ingredients = this.extractIngredients(recipe);
                    ingredients.forEach(ing => {
                        allIngredients.push(`${ing.measure} ${ing.ingredient}`.trim());
                    });
                }
            });
        });
        if (allIngredients.length === 0) {
            this.showToast('No meals in plan', 'info');
            return;
        }
        state.addToShoppingList(allIngredients, 'Meal Plan');
        this.showToast(`Added ${allIngredients.length} ingredients!`, 'success');
        this.openShoppingCart();
    }

    static formatDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    static async renderDiscoverPage() {
        const resultsContainer = document.getElementById('discoverResults');
        if (!resultsContainer) return;
        
        // If there was a recent search, show those results
        if (state.lastSearchQuery && state.lastSearchQuery.length >= 2) {
            const results = await APIService.combinedSearch(state.lastSearchQuery);
            if (results.length > 0) {
                resultsContainer.innerHTML = results.map(recipe => this.createRecipeCard(recipe)).join('');
                return;
            }
        }
        
        // Otherwise show random recipes
        resultsContainer.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
        try {
            const recipes = await APIService.getMultipleRandomRecipes(12);
            resultsContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
        } catch (error) {
            resultsContainer.innerHTML = '<p>Error loading recipes</p>';
        }
    }

    static async applyDiscoverFilters() {
        const cuisineFilter = document.getElementById('cuisineFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        const resultsContainer = document.getElementById('discoverResults');
        if (!resultsContainer) return;
        const cuisine = cuisineFilter?.value || '';
        const category = categoryFilter?.value || '';
        resultsContainer.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
        try {
            let data;
            if (cuisine) {
                data = await APIService.filterByArea(cuisine);
            } else if (category) {
                data = await APIService.filterByCategory(category);
            } else {
                // If no filters and no search, show random recipes
                const recipes = await APIService.getMultipleRandomRecipes(12);
                resultsContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
                return;
            }
            if (data.meals) {
                const detailedRecipes = await Promise.all(
                    data.meals.slice(0, 12).map(meal => APIService.getRecipeDetails(meal.idMeal))
                );
                const recipes = detailedRecipes.map(d => d.meals[0]).filter(Boolean);
                resultsContainer.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
            } else {
                resultsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-search"></i>
                        <h3>No recipes found</h3>
                    </div>
                `;
            }
        } catch (error) {
            resultsContainer.innerHTML = '<p>Error loading recipes</p>';
        }
    }

    static renderSavedRecipes() {
        const container = document.getElementById('savedRecipes');
        const emptyState = document.getElementById('emptySavedState');
        if (!container) return;
        if (state.savedRecipes.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            return;
        }
        if (emptyState) emptyState.classList.add('hidden');
        const sortFilter = document.getElementById('savedSortFilter');
        const sortBy = sortFilter?.value || 'recent';
        let sortedRecipes = [...state.savedRecipes];
        if (sortBy === 'recent') {
            sortedRecipes.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        } else if (sortBy === 'name') {
            sortedRecipes.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
        } else if (sortBy === 'cuisine') {
            sortedRecipes.sort((a, b) => (a.strArea || '').localeCompare(b.strArea || ''));
        }
        container.innerHTML = sortedRecipes.map(recipe => this.createRecipeCard(recipe)).join('');
    }

    static filterSavedRecipes(query) {
        const container = document.getElementById('savedRecipes');
        if (!container) return;
        const lowerQuery = query.toLowerCase();
        const filtered = state.savedRecipes.filter(recipe => 
            recipe.strMeal.toLowerCase().includes(lowerQuery) ||
            (recipe.strArea || '').toLowerCase().includes(lowerQuery) ||
            (recipe.strCategory || '').toLowerCase().includes(lowerQuery)
        );
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No matching recipes</h3>
                </div>
            `;
        } else {
            container.innerHTML = filtered.map(recipe => this.createRecipeCard(recipe)).join('');
        }
    }

    static openShoppingCart() {
        this.renderShoppingList();
        this.openModal('shoppingCartModal');
    }

    static renderShoppingList() {
        const container = document.getElementById('shoppingList');
        const emptyState = document.getElementById('emptyCartState');
        if (!container || !emptyState) return;
        if (state.shoppingList.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'flex';
            return;
        }
        container.style.display = 'block';
        emptyState.style.display = 'none';
        container.innerHTML = state.shoppingList.map(item => `
            <div class="shopping-item ${item.checked ? 'checked' : ''}">
                <input type="checkbox" ${item.checked ? 'checked' : ''}>
                <div class="item-name">${item.name}</div>
                ${item.from ? `<div class="item-source">${item.from}</div>` : ''}
                <button class="delete-item"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
    }

    static shareShoppingList() {
        const items = state.shoppingList.map(item => `${item.checked ? '✓' : '○'} ${item.name}`).join('\n');
        const text = `Shopping List:\n\n${items}\n\nFrom Recipe Finder App`;
        if (navigator.share) {
            navigator.share({ title: 'Shopping List', text }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
        }
    }

    static updateBadges() {
        this.updateSavedBadge(state.savedRecipes.length);
        this.updateCartBadge(state.shoppingList.filter(i => !i.checked).length);
    }

    static updateSavedBadge(count) {
        const badge = document.getElementById('savedBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    static updateCartBadge(count) {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    static showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static filterRecipes(type) {
        this.showToast(`Showing ${type} recipes`, 'info');
        this.navigateTo('discover');
    }
}

// ===== HIDE LOADING SCREEN IMMEDIATELY =====
(function hideLoadingScreenNow() {
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.display = 'none';
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    }
})();

// ===== CSS FIXES =====
(function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* FORCE LEFT ALIGNMENT */
        .hero-content, .hero-title, .hero-description,
        .search-container, .search-wrapper, .filter-section-header,
        .filter-label, .search-filters {
            text-align: left !important;
            margin-left: 0 !important;
            margin-right: auto !important;
            width: 100% !important;
            max-width: 100% !important;
        }
        
        .search-filters {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            padding-left: 0 !important;
        }
        
        .filter-chip {
            margin-left: 0 !important;
            margin-right: 8px !important;
        }
        
        /* DROPDOWN STYLES */
        #autocompleteDropdown {
            position: fixed !important;
            background: white !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
            border: 1px solid #e0e0e0 !important;
            z-index: 999999 !important;
            max-height: 400px !important;
            overflow-y: auto !important;
        }
        
        #autocompleteDropdown.hidden {
            display: none !important;
        }
        
        .autocomplete-item {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 12px 16px !important;
            cursor: pointer !important;
            border-bottom: 1px solid #f0f0f0 !important;
        }
        
        .autocomplete-item:hover {
            background: #f5f5f5 !important;
        }
        
        .autocomplete-item img {
            width: 50px !important;
            height: 50px !important;
            object-fit: cover !important;
            border-radius: 8px !important;
        }
    `;
    document.head.appendChild(style);
})();

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Recipe Finder App...');
    
    // Move dropdown to body
    const dropdown = document.getElementById('autocompleteDropdown');
    if (dropdown && dropdown.parentNode) {
        dropdown.parentNode.removeChild(dropdown);
        document.body.appendChild(dropdown);
    }
    
    // Force left alignment
    const forceLeft = () => {
        document.querySelectorAll('.hero-content, .hero-title, .hero-description, .search-container, .search-wrapper, .filter-section-header, .filter-label').forEach(el => {
            if (el) {
                el.style.textAlign = 'left';
                el.style.marginLeft = '0';
                el.style.marginRight = 'auto';
            }
        });
        
        const searchFilters = document.querySelector('.search-filters');
        if (searchFilters) {
            searchFilters.style.justifyContent = 'flex-start';
            searchFilters.style.marginLeft = '0';
            searchFilters.style.marginRight = 'auto';
        }
    };
    
    forceLeft();
    UI.init();
    UI.hideLoadingScreen();
    
    console.log('✅ App initialized successfully!');
});

window.UI = UI;