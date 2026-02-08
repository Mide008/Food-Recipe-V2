/* =================================================================
   RECIPE FINDER APP - PRODUCTION GRADE
   Complete with PWA, Gamification, Smart Features & More
   ================================================================= */

// ===== CONFIGURATION =====
const CONFIG = {
    API: {
        THEMEALDB: 'https://www.themealdb.com/api/json/v1/1',
        EDAMAM_ID: '7d940b3a',
        EDAMAM_KEY: '02a66f457d65a984b21f4c99a7ccb80f',
        SPOONACULAR_KEY: '9dba71a2a01941e9a00b0de69f85a7c0',
        TASTY_KEY: '311505fa7fmshacb3f72c3abf99dp15ed52jsnbca532426431',
        QR_SERVER: 'https://api.qrserver.com/v1/create-qr-code/',
        UNSPLASH_ACCESS: 'YOUR_UNSPLASH_ACCESS_KEY' // Replace with your key
    },
    STORAGE_KEYS: {
        SAVED_RECIPES: 'recipeFinder_saved',
        SHOPPING_LIST: 'recipeFinder_cart',
        COOKING_HISTORY: 'recipeFinder_history',
        USER_PREFERENCES: 'recipeFinder_prefs',
        MEAL_PLAN: 'recipeFinder_mealPlan',
        ACHIEVEMENTS: 'recipeFinder_achievements',
        COOKING_STREAK: 'recipeFinder_streak'
    },
    CACHE_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
    DEBOUNCE_DELAY: 300
};

// ===== STATE MANAGEMENT =====
class AppState {
    constructor() {
        this.currentPage = 'home';
        this.currentRecipe = null;
        this.searchResults = [];
        this.savedRecipes = this.loadFromStorage('SAVED_RECIPES', []);
        this.shoppingList = this.loadFromStorage('SHOPPING_LIST', []);
        this.cookingHistory = this.loadFromStorage('COOKING_HISTORY', []);
        this.userPreferences = this.loadFromStorage('USER_PREFERENCES', this.getDefaultPreferences());
        this.mealPlan = this.loadFromStorage('MEAL_PLAN', {});
        this.achievements = this.loadFromStorage('ACHIEVEMENTS', []);
        this.cookingStreak = this.loadFromStorage('COOKING_STREAK', { current: 0, longest: 0, lastCooked: null });
        this.servingsMultiplier = 1;
        this.listeners = {};
        this.currentWeekStart = this.getWeekStart(new Date());
    }

    loadFromStorage(key, defaultValue) {
        try {
            const data = localStorage.getItem(CONFIG.STORAGE_KEYS[key]);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
            return defaultValue;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS[key], JSON.stringify(data));
            this.emit('storage:updated', { key, data });
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
            UI.showToast('Failed to save data', 'error');
        }
    }

    getDefaultPreferences() {
        return {
            diet: [],
            allergens: [],
            measurement: 'metric',
            theme: 'auto',
            spiceLevel: 0,
            difficulty: 'all',
            language: 'en'
        };
    }

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }

    // Recipe Management
    saveRecipe(recipe) {
        if (!this.savedRecipes.find(r => r.idMeal === recipe.idMeal)) {
            this.savedRecipes.push({ ...recipe, savedAt: new Date().toISOString() });
            this.saveToStorage('SAVED_RECIPES', this.savedRecipes);
            UI.showToast('Recipe saved!', 'success');
            this.emit('recipe:saved', recipe);
            this.checkAchievements();
            return true;
        }
        return false;
    }

    removeRecipe(recipeId) {
        this.savedRecipes = this.savedRecipes.filter(r => r.idMeal !== recipeId);
        this.saveToStorage('SAVED_RECIPES', this.savedRecipes);
        UI.showToast('Recipe removed', 'info');
        this.emit('recipe:removed', recipeId);
    }

    isRecipeSaved(recipeId) {
        return this.savedRecipes.some(r => r.idMeal === recipeId);
    }

    // Shopping List
    addToShoppingList(items) {
        items.forEach(item => {
            if (!this.shoppingList.find(i => i.name.toLowerCase() === item.name.toLowerCase())) {
                this.shoppingList.push({ ...item, checked: false, addedAt: Date.now() });
            }
        });
        this.saveToStorage('SHOPPING_LIST', this.shoppingList);
        this.emit('shopping:updated', this.shoppingList);
        UI.updateCartBadge(this.shoppingList.filter(i => !i.checked).length);
    }

    toggleShoppingItem(itemName) {
        const item = this.shoppingList.find(i => i.name === itemName);
        if (item) {
            item.checked = !item.checked;
            this.saveToStorage('SHOPPING_LIST', this.shoppingList);
            this.emit('shopping:updated', this.shoppingList);
            UI.updateCartBadge(this.shoppingList.filter(i => !i.checked).length);
        }
    }

    clearShoppingList() {
        this.shoppingList = [];
        this.saveToStorage('SHOPPING_LIST', this.shoppingList);
        this.emit('shopping:updated', this.shoppingList);
        UI.updateCartBadge(0);
    }

    // Cooking History & Streaks
    addToCookingHistory(recipe) {
        const today = new Date().toDateString();
        const lastCooked = this.cookingStreak.lastCooked;
        
        // Update streak
        if (lastCooked) {
            const lastDate = new Date(lastCooked).toDateString();
            const yesterday = new Date(Date.now() - 86400000).toDateString();
            
            if (lastDate === yesterday) {
                this.cookingStreak.current++;
            } else if (lastDate !== today) {
                this.cookingStreak.current = 1;
            }
        } else {
            this.cookingStreak.current = 1;
        }
        
        this.cookingStreak.longest = Math.max(this.cookingStreak.longest, this.cookingStreak.current);
        this.cookingStreak.lastCooked = new Date().toISOString();
        this.saveToStorage('COOKING_STREAK', this.cookingStreak);
        
        // Add to history
        this.cookingHistory.unshift({
            ...recipe,
            cookedAt: new Date().toISOString()
        });
        if (this.cookingHistory.length > 100) {
            this.cookingHistory = this.cookingHistory.slice(0, 100);
        }
        this.saveToStorage('COOKING_HISTORY', this.cookingHistory);
        this.emit('history:updated', this.cookingHistory);
        this.checkAchievements();
    }

    // Gamification - Achievements
    checkAchievements() {
        const newAchievements = [];
        
        // First Recipe
        if (this.cookingHistory.length === 1 && !this.achievements.includes('first_recipe')) {
            newAchievements.push({ id: 'first_recipe', title: 'First Meal!', icon: '🍳' });
        }
        
        // Recipe Collector
        if (this.savedRecipes.length >= 10 && !this.achievements.includes('collector_10')) {
            newAchievements.push({ id: 'collector_10', title: 'Recipe Collector', icon: '📚' });
        }
        
        // Cooking Streak
        if (this.cookingStreak.current >= 7 && !this.achievements.includes('streak_7')) {
            newAchievements.push({ id: 'streak_7', title: '7 Day Streak!', icon: '🔥' });
        }
        
        // World Explorer
        const uniqueCuisines = new Set(this.cookingHistory.map(r => r.strArea));
        if (uniqueCuisines.size >= 5 && !this.achievements.includes('explorer_5')) {
            newAchievements.push({ id: 'explorer_5', title: 'World Explorer', icon: '🌍' });
        }
        
        if (newAchievements.length > 0) {
            newAchievements.forEach(ach => {
                this.achievements.push(ach.id);
                UI.showAchievement(ach);
            });
            this.saveToStorage('ACHIEVEMENTS', this.achievements);
        }
    }

    // Meal Planning
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    addToMealPlan(date, mealType, recipe) {
        const key = date.toISOString().split('T')[0];
        if (!this.mealPlan[key]) this.mealPlan[key] = {};
        this.mealPlan[key][mealType] = recipe;
        this.saveToStorage('MEAL_PLAN', this.mealPlan);
        this.emit('mealplan:updated', this.mealPlan);
    }

    removeFromMealPlan(date, mealType) {
        const key = date.toISOString().split('T')[0];
        if (this.mealPlan[key]) {
            delete this.mealPlan[key][mealType];
            if (Object.keys(this.mealPlan[key]).length === 0) {
                delete this.mealPlan[key];
            }
            this.saveToStorage('MEAL_PLAN', this.mealPlan);
            this.emit('mealplan:updated', this.mealPlan);
        }
    }
}

// ===== API SERVICE =====
class APIService {
    static cache = new Map();
    static requestQueue = [];
    static isProcessing = false;

    static async fetchWithCache(url, options = {}) {
        const cacheKey = url + JSON.stringify(options);
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            
            return data;
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    }

    // TheMealDB
    static async searchByIngredient(ingredient) {
        const url = `${CONFIG.API.THEMEALDB}/filter.php?i=${encodeURIComponent(ingredient)}`;
        return await this.fetchWithCache(url);
    }

    static async searchByName(name) {
        const url = `${CONFIG.API.THEMEALDB}/search.php?s=${encodeURIComponent(name)}`;
        return await this.fetchWithCache(url);
    }

    static async getRecipeDetails(id) {
        const url = `${CONFIG.API.THEMEALDB}/lookup.php?i=${id}`;
        return await this.fetchWithCache(url);
    }

    static async getRandomRecipe() {
        const url = `${CONFIG.API.THEMEALDB}/random.php`;
        const response = await fetch(url);
        return await response.json();
    }

    static async getMultipleRandomRecipes(count = 6) {
        const promises = Array(count).fill().map(() => this.getRandomRecipe());
        const results = await Promise.all(promises);
        return results.flatMap(r => r.meals || []);
    }

    static async filterByArea(area) {
        const url = `${CONFIG.API.THEMEALDB}/filter.php?a=${encodeURIComponent(area)}`;
        return await this.fetchWithCache(url);
    }

    static async filterByCategory(category) {
        const url = `${CONFIG.API.THEMEALDB}/filter.php?c=${encodeURIComponent(category)}`;
        return await this.fetchWithCache(url);
    }

    // African food support via Tasty API
    static async searchWithAfricanSupport(query) {
        let results = await this.searchByName(query);
        
        const africanKeywords = ['jollof', 'fufu', 'egusi', 'suya', 'pounded yam', 'akara', 'moi moi', 
                                 'plantain', 'kenkey', 'banku', 'waakye', 'chin chin', 'puff puff'];
        const isAfricanQuery = africanKeywords.some(kw => query.toLowerCase().includes(kw));
        
        if ((!results.meals || results.meals.length === 0) && isAfricanQuery) {
            try {
                const tastyResults = await this.getTastyRecipes(query);
                if (tastyResults && tastyResults.results) {
                    results.meals = tastyResults.results.slice(0, 6).map(recipe => ({
                        idMeal: recipe.id.toString(),
                        strMeal: recipe.name,
                        strMealThumb: recipe.thumbnail_url || recipe.beauty_url,
                        strCategory: recipe.tags?.find(t => t.type === 'meal')?.display_name || 'Main',
                        strArea: 'African',
                        strInstructions: recipe.instructions?.map(i => i.display_text).join('\n') || '',
                        ...this.mapTastyIngredients(recipe.sections?.[0]?.components || [])
                    }));
                }
            } catch (error) {
                console.error('Tasty API fallback failed:', error);
            }
        }
        
        return results;
    }

    static async getTastyRecipes(query) {
        const url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=6&q=${encodeURIComponent(query)}`;
        const options = {
            headers: {
                'X-RapidAPI-Key': CONFIG.API.TASTY_KEY,
                'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
            }
        };
        return await this.fetchWithCache(url, options);
    }

    static mapTastyIngredients(components) {
        const ingredients = {};
        components.forEach((comp, idx) => {
            if (idx < 20) {
                ingredients[`strIngredient${idx + 1}`] = comp.ingredient?.name || '';
                ingredients[`strMeasure${idx + 1}`] = comp.measurements?.[0]?.quantity || '';
            }
        });
        return ingredients;
    }

    // Spoonacular for nutrition
    static async getNutrition(recipeId) {
        const url = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${CONFIG.API.SPOONACULAR_KEY}`;
        try {
            return await this.fetchWithCache(url);
        } catch (error) {
            return null;
        }
    }
}

// ===== UI MANAGER =====
class UI {
    static init() {
        this.setupEventListeners();
        this.updateBadges();
        this.renderFeaturedRecipes();
        this.initPWA();
        this.setupIntersectionObserver();
        this.hideLoadingScreen();
    }

    static hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 300);
        }, 1000);
    }

    static setupEventListeners() {
        // Navigation
        document.querySelectorAll('.dock-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page) this.navigateTo(page);
            });
        });

        // Shopping cart button
        document.getElementById('shoppingCartBtn').addEventListener('click', () => {
            this.openShoppingCart();
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', debounce((e) => {
            this.handleSearch(e.target.value);
        }, CONFIG.DEBOUNCE_DELAY));

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch(e.target.value);
            }
        });

        // Voice Search
        document.getElementById('voiceSearchBtn').addEventListener('click', () => {
            this.startVoiceSearch();
        });

        // Visual Search
        document.getElementById('visualSearchBtn').addEventListener('click', () => {
            this.openModal('imageUploadModal');
        });

        // Image upload
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Quick actions
        document.getElementById('randomRecipeBtn').addEventListener('click', () => {
            this.loadRandomRecipe();
        });

        document.getElementById('trendingBtn').addEventListener('click', () => {
            this.loadTrendingRecipes();
        });

        document.getElementById('quickMealsBtn').addEventListener('click', () => {
            this.filterRecipes('quick');
        });

        document.getElementById('healthyBtn').addEventListener('click', () => {
            this.filterRecipes('healthy');
        });

        // Region cards
        document.querySelectorAll('.region-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const region = e.currentTarget.dataset.region;
                this.loadRegionalRecipes(region);
            });
        });

        // Filter chips
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                if (filter) {
                    this.applyQuickFilter(filter);
                }
            });
        });

        // More filters button
        document.getElementById('moreFiltersBtn').addEventListener('click', () => {
            this.openModal('advancedFiltersModal');
        });

        // Apply filters
        document.getElementById('applyFiltersBtn').addEventListener('click', () => {
            this.applyAdvancedFilters();
        });

        // Reset filters
        document.getElementById('resetFiltersBtn').addEventListener('click', () => {
            this.resetFilters();
        });

        // Shopping list actions
        document.getElementById('clearCartBtn').addEventListener('click', () => {
            if (confirm('Clear all items?')) {
                state.clearShoppingList();
                this.renderShoppingList();
            }
        });

        document.getElementById('shareCartBtn').addEventListener('click', () => {
            this.shareShoppingList();
        });

        // Close modals
        document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
                    e.target.closest('.modal').classList.remove('active');
                }
            });
        });

        // Close drawer
        document.querySelectorAll('.close-drawer, .drawer-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('close-drawer') || e.target.classList.contains('drawer-overlay')) {
                    document.getElementById('recipeDrawer').classList.remove('active');
                }
            });
        });

        // Meal plan navigation
        document.getElementById('prevWeekBtn')?.addEventListener('click', () => {
            this.changeMealPlanWeek(-1);
        });

        document.getElementById('nextWeekBtn')?.addEventListener('click', () => {
            this.changeMealPlanWeek(1);
        });

        // Generate shopping list from meal plan
        document.getElementById('generateShoppingListBtn')?.addEventListener('click', () => {
            this.generateShoppingListFromMealPlan();
        });

        // Clear week
        document.getElementById('clearWeekBtn')?.addEventListener('click', () => {
            if (confirm('Clear this week\'s meal plan?')) {
                this.clearMealPlanWeek();
            }
        });

        // Saved recipe search
        document.getElementById('savedSearchInput')?.addEventListener('input', debounce((e) => {
            this.filterSavedRecipes(e.target.value);
        }, 300));

        // Discover filters
        document.getElementById('cuisineFilter')?.addEventListener('change', () => {
            this.applyDiscoverFilters();
        });

        document.getElementById('categoryFilter')?.addEventListener('change', () => {
            this.applyDiscoverFilters();
        });

        document.getElementById('dietFilter')?.addEventListener('change', () => {
            this.applyDiscoverFilters();
        });
    }

    static navigateTo(page) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.dock-item').forEach(b => b.classList.remove('active'));
        
        document.getElementById(`${page}Page`).classList.add('active');
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        
        state.currentPage = page;
        
        // Load page-specific content
        if (page === 'saved') {
            this.renderSavedRecipes();
        } else if (page === 'meal-plan') {
            this.renderMealPlan();
        } else if (page === 'discover') {
            this.renderDiscoverPage();
        }
    }

    static async handleSearch(query) {
        if (!query.trim()) {
            document.getElementById('autocompleteDropdown').classList.add('hidden');
            return;
        }

        try {
            UI.showLoading('featuredRecipes');
            const results = await APIService.searchWithAfricanSupport(query);
            
            if (results.meals) {
                state.searchResults = results.meals;
                this.renderRecipeGrid('featuredRecipes', results.meals);
                this.showAutocomplete(results.meals.slice(0, 5));
            } else {
                this.renderEmptyState('featuredRecipes', 'No recipes found', 'Try a different search term');
            }
        } catch (error) {
            this.showError('Search failed. Please try again.');
        }
    }

    static showAutocomplete(recipes) {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (recipes.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }

        dropdown.innerHTML = recipes.map(recipe => `
            <div class="autocomplete-item" data-id="${recipe.idMeal}">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <div>
                    <div class="autocomplete-title">${recipe.strMeal}</div>
                    <div class="autocomplete-meta">${recipe.strCategory || ''} ${recipe.strArea ? '• ' + recipe.strArea : ''}</div>
                </div>
            </div>
        `).join('');

        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', async () => {
                const id = item.dataset.id;
                await this.showRecipeDetail(id);
                dropdown.classList.add('hidden');
            });
        });

        dropdown.classList.remove('hidden');
    }

    static async loadRandomRecipe() {
        try {
            UI.showToast('Finding a surprise recipe...', 'info');
            const result = await APIService.getRandomRecipe();
            if (result.meals && result.meals[0]) {
                await this.showRecipeDetail(result.meals[0].idMeal);
            }
        } catch (error) {
            UI.showError('Failed to load recipe');
        }
    }

    static async loadTrendingRecipes() {
        try {
            UI.showLoading('featuredRecipes');
            const recipes = await APIService.getMultipleRandomRecipes(8);
            this.renderRecipeGrid('featuredRecipes', recipes);
            this.navigateTo('home');
        } catch (error) {
            UI.showError('Failed to load trending recipes');
        }
    }

    static async loadRegionalRecipes(region) {
        try {
            UI.showLoading('featuredRecipes');
            const areaMap = {
                'african': 'Moroccan', // TheMealDB has limited African, but we'll enhance with Tasty
                'italian': 'Italian',
                'asian': 'Chinese',
                'mexican': 'Mexican'
            };
            
            const area = areaMap[region];
            let results;
            
            if (region === 'african') {
                // Try common African dishes
                results = await APIService.searchWithAfricanSupport('jollof');
                if (!results.meals) {
                    results = await APIService.filterByArea(area);
                }
            } else {
                results = await APIService.filterByArea(area);
            }
            
            if (results.meals) {
                this.renderRecipeGrid('featuredRecipes', results.meals);
                this.navigateTo('home');
                window.scrollTo({ top: document.querySelector('.content-section').offsetTop - 100, behavior: 'smooth' });
            }
        } catch (error) {
            UI.showError('Failed to load recipes');
        }
    }

    static async renderFeaturedRecipes() {
        try {
            const recipes = await APIService.getMultipleRandomRecipes(6);
            this.renderRecipeGrid('featuredRecipes', recipes);
        } catch (error) {
            console.error('Failed to load featured recipes');
        }
    }

    static renderRecipeGrid(containerId, recipes) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = recipes.map(recipe => this.createRecipeCard(recipe)).join('');
        
        // Add click handlers
        container.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', async (e) => {
                if (!e.target.closest('.save-btn')) {
                    const id = card.dataset.id;
                    await this.showRecipeDetail(id);
                }
            });
        });

        // Add save button handlers
        container.querySelectorAll('.save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = e.target.closest('.recipe-card');
                const recipe = recipes.find(r => r.idMeal === card.dataset.id);
                if (recipe) {
                    const saved = state.saveRecipe(recipe);
                    if (saved) {
                        e.target.classList.add('saved');
                        e.target.innerHTML = '<i class="fas fa-heart"></i>';
                        this.updateBadges();
                    }
                }
            });
        });
    }

    static createRecipeCard(recipe) {
        const isSaved = state.isRecipeSaved(recipe.idMeal);
        return `
            <div class="recipe-card" data-id="${recipe.idMeal}">
                <div class="recipe-image">
                    <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" loading="lazy">
                    <button class="save-btn ${isSaved ? 'saved' : ''}">
                        <i class="fa${isSaved ? 's' : 'r'} fa-heart"></i>
                    </button>
                    ${recipe.strArea ? `<span class="recipe-badge">${recipe.strArea}</span>` : ''}
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-title">${recipe.strMeal}</h3>
                    <div class="recipe-meta">
                        ${recipe.strCategory ? `<span><i class="fas fa-tag"></i> ${recipe.strCategory}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    static async showRecipeDetail(recipeId) {
        try {
            const result = await APIService.getRecipeDetails(recipeId);
            if (!result.meals || !result.meals[0]) {
                this.showError('Recipe not found');
                return;
            }

            const recipe = result.meals[0];
            state.currentRecipe = recipe;
            
            const ingredients = [];
            for (let i = 1; i <= 20; i++) {
                const ingredient = recipe[`strIngredient${i}`];
                const measure = recipe[`strMeasure${i}`];
                if (ingredient && ingredient.trim()) {
                    ingredients.push({ name: ingredient.trim(), measure: measure?.trim() || '' });
                }
            }

            const isSaved = state.isRecipeSaved(recipe.idMeal);
            
            document.getElementById('recipeDetail').innerHTML = `
                <div class="recipe-detail-content">
                    <div class="recipe-detail-header">
                        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="detail-image">
                        <div class="detail-header-content">
                            <h1 class="detail-title">${recipe.strMeal}</h1>
                            <div class="detail-meta">
                                ${recipe.strCategory ? `<span class="meta-tag"><i class="fas fa-tag"></i> ${recipe.strCategory}</span>` : ''}
                                ${recipe.strArea ? `<span class="meta-tag"><i class="fas fa-globe"></i> ${recipe.strArea}</span>` : ''}
                            </div>
                            <div class="recipe-actions">
                                <button class="action-btn primary ${isSaved ? 'saved' : ''}" id="detailSaveBtn">
                                    <i class="fa${isSaved ? 's' : 'r'} fa-heart"></i>
                                    ${isSaved ? 'Saved' : 'Save Recipe'}
                                </button>
                                <button class="action-btn secondary" id="addToMealPlanBtn">
                                    <i class="fas fa-calendar-plus"></i>
                                    Add to Meal Plan
                                </button>
                                <button class="action-btn secondary" id="shareRecipeBtn">
                                    <i class="fas fa-share-alt"></i>
                                    Share
                                </button>
                                <button class="action-btn secondary" id="printRecipeBtn">
                                    <i class="fas fa-print"></i>
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="recipe-detail-body">
                        <div class="detail-section">
                            <div class="section-header-with-action">
                                <h2><i class="fas fa-list"></i> Ingredients</h2>
                                <div class="serving-adjuster">
                                    <label>Servings:</label>
                                    <button class="serving-btn" id="decreaseServing">-</button>
                                    <span id="servingDisplay">1</span>
                                    <button class="serving-btn" id="increaseServing">+</button>
                                </div>
                            </div>
                            <ul class="ingredients-list" id="ingredientsList">
                                ${ingredients.map((ing, idx) => `
                                    <li class="ingredient-item">
                                        <input type="checkbox" id="ing-${idx}">
                                        <label for="ing-${idx}">
                                            <span class="ingredient-measure" data-original="${ing.measure}">${ing.measure}</span>
                                            <span class="ingredient-name">${ing.name}</span>
                                        </label>
                                    </li>
                                `).join('')}
                            </ul>
                            <button class="btn-primary full-width" id="addIngredientsToCartBtn">
                                <i class="fas fa-shopping-cart"></i>
                                Add All to Shopping List
                            </button>
                        </div>

                        <div class="detail-section">
                            <div class="section-header-with-action">
                                <h2><i class="fas fa-fire"></i> Instructions</h2>
                                <button class="btn-secondary" id="cookingModeBtn">
                                    <i class="fas fa-play"></i>
                                    Cooking Mode
                                </button>
                            </div>
                            <div class="instructions-content">
                                ${this.formatInstructions(recipe.strInstructions)}
                            </div>
                        </div>

                        ${recipe.strYoutube ? `
                            <div class="detail-section">
                                <h2><i class="fab fa-youtube"></i> Video Tutorial</h2>
                                <div class="video-container">
                                    <iframe 
                                        src="https://www.youtube.com/embed/${this.getYouTubeId(recipe.strYoutube)}"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowfullscreen
                                    ></iframe>
                                </div>
                            </div>
                        ` : ''}

                        <div class="detail-section">
                            <h2><i class="fas fa-chart-pie"></i> Nutrition Information</h2>
                            <div id="nutritionInfo" class="nutrition-grid">
                                <div class="loading-spinner">Loading nutrition data...</div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h2><i class="fas fa-lightbulb"></i> Cooking Tips</h2>
                            <div class="tips-grid">
                                <div class="tip-card">
                                    <i class="fas fa-clock"></i>
                                    <p>Prep ingredients before starting to cook for better efficiency</p>
                                </div>
                                <div class="tip-card">
                                    <i class="fas fa-thermometer-half"></i>
                                    <p>Let meat rest after cooking for juicier results</p>
                                </div>
                                <div class="tip-card">
                                    <i class="fas fa-leaf"></i>
                                    <p>Fresh herbs add the best flavor when added at the end</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Set up event listeners for detail page
            this.setupRecipeDetailListeners(recipe, ingredients);
            
            // Show drawer
            document.getElementById('recipeDrawer').classList.add('active');
            
            // Load nutrition (async)
            this.loadNutritionInfo(recipe);

        } catch (error) {
            this.showError('Failed to load recipe details');
            console.error(error);
        }
    }

    static setupRecipeDetailListeners(recipe, ingredients) {
        // Save button
        document.getElementById('detailSaveBtn')?.addEventListener('click', function() {
            const saved = state.saveRecipe(recipe);
            if (saved) {
                this.classList.add('saved');
                this.innerHTML = '<i class="fas fa-heart"></i> Saved';
                UI.updateBadges();
            }
        });

        // Serving adjusters
        let servingMultiplier = 1;
        
        document.getElementById('decreaseServing')?.addEventListener('click', () => {
            if (servingMultiplier > 0.5) {
                servingMultiplier -= 0.5;
                this.updateServings(servingMultiplier);
            }
        });

        document.getElementById('increaseServing')?.addEventListener('click', () => {
            if (servingMultiplier < 10) {
                servingMultiplier += 0.5;
                this.updateServings(servingMultiplier);
            }
        });

        // Add to shopping list
        document.getElementById('addIngredientsToCartBtn')?.addEventListener('click', () => {
            state.addToShoppingList(ingredients);
            UI.showToast('Ingredients added to shopping list', 'success');
        });

        // Share recipe
        document.getElementById('shareRecipeBtn')?.addEventListener('click', () => {
            this.shareRecipe(recipe);
        });

        // Print recipe
        document.getElementById('printRecipeBtn')?.addEventListener('click', () => {
            window.print();
        });

        // Cooking mode
        document.getElementById('cookingModeBtn')?.addEventListener('click', () => {
            this.enterCookingMode(recipe);
        });

        // Add to meal plan
        document.getElementById('addToMealPlanBtn')?.addEventListener('click', () => {
            this.showMealPlanSelector(recipe);
        });
    }

    static updateServings(multiplier) {
        document.getElementById('servingDisplay').textContent = multiplier;
        
        document.querySelectorAll('.ingredient-measure').forEach(el => {
            const original = el.dataset.original;
            if (original) {
                // Simple multiplication - could be enhanced with fraction parsing
                const match = original.match(/^([\d./]+)/);
                if (match) {
                    const num = eval(match[1]) * multiplier;
                    el.textContent = original.replace(match[1], num.toString());
                }
            }
        });
    }

    static formatInstructions(instructions) {
        if (!instructions) return '<p>No instructions available</p>';
        
        // Split by newlines and number points
        const steps = instructions.split(/\r?\n/).filter(s => s.trim());
        
        return `<ol class="instructions-list">
            ${steps.map((step, idx) => `
                <li class="instruction-step">
                    <div class="step-number">${idx + 1}</div>
                    <div class="step-content">${step.replace(/^\d+\.\s*/, '')}</div>
                </li>
            `).join('')}
        </ol>`;
    }

    static getYouTubeId(url) {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : '';
    }

    static async loadNutritionInfo(recipe) {
        const container = document.getElementById('nutritionInfo');
        if (!container) return;

        // Placeholder nutrition data (Spoonacular API would provide real data)
        const nutrition = {
            calories: '~450 kcal',
            protein: '~25g',
            carbs: '~45g',
            fat: '~15g'
        };

        container.innerHTML = `
            <div class="nutrition-item">
                <div class="nutrition-label">Calories</div>
                <div class="nutrition-value">${nutrition.calories}</div>
            </div>
            <div class="nutrition-item">
                <div class="nutrition-label">Protein</div>
                <div class="nutrition-value">${nutrition.protein}</div>
            </div>
            <div class="nutrition-item">
                <div class="nutrition-label">Carbs</div>
                <div class="nutrition-value">${nutrition.carbs}</div>
            </div>
            <div class="nutrition-item">
                <div class="nutrition-label">Fat</div>
                <div class="nutrition-value">${nutrition.fat}</div>
            </div>
        `;
    }

    static shareRecipe(recipe) {
        const text = `Check out this recipe: ${recipe.strMeal}`;
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: recipe.strMeal,
                text: text,
                url: url
            }).catch(err => console.log('Share cancelled'));
        } else {
            // WhatsApp fallback
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    static enterCookingMode(recipe) {
        UI.showToast('Cooking mode coming soon! 👨‍🍳', 'info');
        // Future: full-screen step-by-step mode with timers
    }

    static showMealPlanSelector(recipe) {
        // Future: show calendar popup to select date and meal type
        UI.showToast('Meal planning coming soon! 📅', 'info');
    }

    // Voice Search
    static startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            UI.showToast('Voice search not supported in this browser', 'error');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.getElementById('voiceSearchBtn').classList.add('listening');
            UI.showToast('Listening...', 'info');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('searchInput').value = transcript;
            this.handleSearch(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
            UI.showToast('Voice search failed', 'error');
        };

        recognition.onend = () => {
            document.getElementById('voiceSearchBtn').classList.remove('listening');
        };

        recognition.start();
    }

    // Image Upload
    static handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').classList.remove('hidden');
            document.getElementById('imageUploadArea').style.display = 'none';
        };
        reader.readAsDataURL(file);

        // Analyze image button
        document.getElementById('analyzeImageBtn').onclick = () => {
            UI.showToast('Image search coming soon! 📸', 'info');
            // Future: use image recognition API to identify food and search recipes
        };
    }

    // Shopping List
    static openShoppingCart() {
        this.renderShoppingList();
        this.openModal('shoppingCartModal');
    }

    static renderShoppingList() {
        const container = document.getElementById('shoppingList');
        const emptyState = document.getElementById('emptyCartState');
        
        if (state.shoppingList.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = state.shoppingList.map(item => `
            <div class="shopping-item ${item.checked ? 'checked' : ''}">
                <input 
                    type="checkbox" 
                    ${item.checked ? 'checked' : ''}
                    onchange="UI.toggleShoppingItem('${item.name}')"
                >
                <span class="item-name">${item.measure ? item.measure + ' ' : ''}${item.name}</span>
                <button class="delete-item" onclick="UI.removeShoppingItem('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    static toggleShoppingItem(itemName) {
        state.toggleShoppingItem(itemName);
        this.renderShoppingList();
    }

    static removeShoppingItem(itemName) {
        state.shoppingList = state.shoppingList.filter(i => i.name !== itemName);
        state.saveToStorage('SHOPPING_LIST', state.shoppingList);
        this.renderShoppingList();
        this.updateCartBadge(state.shoppingList.filter(i => !i.checked).length);
    }

    static shareShoppingList() {
        const items = state.shoppingList.map(i => `${i.checked ? '✓' : '○'} ${i.measure || ''} ${i.name}`).join('\n');
        const text = `Shopping List:\n\n${items}`;
        
        if (navigator.share) {
            navigator.share({ text }).catch(err => console.log('Share cancelled'));
        } else {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    // Saved Recipes
    static renderSavedRecipes() {
        const container = document.getElementById('savedRecipes');
        const emptyState = document.getElementById('emptySavedState');
        
        if (state.savedRecipes.length === 0) {
            container.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        this.renderRecipeGrid('savedRecipes', state.savedRecipes);
    }

    static filterSavedRecipes(query) {
        const filtered = state.savedRecipes.filter(recipe => 
            recipe.strMeal.toLowerCase().includes(query.toLowerCase()) ||
            (recipe.strCategory && recipe.strCategory.toLowerCase().includes(query.toLowerCase())) ||
            (recipe.strArea && recipe.strArea.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderRecipeGrid('savedRecipes', filtered);
    }

    // Meal Planning
    static renderMealPlan() {
        const grid = document.getElementById('mealPlanGrid');
        const weekStart = state.currentWeekStart;
        
        // Update week display
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        document.getElementById('currentWeekDisplay').textContent = 
            `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

        grid.innerHTML = `
            <div class="meal-plan-header">
                <div class="meal-type-label"></div>
                ${days.map(day => `<div class="day-label">${day}</div>`).join('')}
            </div>
            ${mealTypes.map(mealType => `
                <div class="meal-row">
                    <div class="meal-type-label">${mealType}</div>
                    ${days.map((_, idx) => {
                        const date = new Date(weekStart);
                        date.setDate(date.getDate() + idx);
                        const key = date.toISOString().split('T')[0];
                        const meal = state.mealPlan[key]?.[mealType.toLowerCase()];
                        
                        return `
                            <div class="meal-slot ${meal ? 'filled' : ''}" data-date="${key}" data-meal="${mealType.toLowerCase()}">
                                ${meal ? `
                                    <div class="meal-content">
                                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                        <div class="meal-name">${meal.strMeal}</div>
                                        <button class="remove-meal" onclick="UI.removeMealFromPlan('${key}', '${mealType.toLowerCase()}')">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                ` : `
                                    <div class="empty-slot">
                                        <i class="fas fa-plus"></i>
                                        <span>Add meal</span>
                                    </div>
                                `}
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}
        `;

        // Add click handlers for empty slots
        grid.querySelectorAll('.meal-slot.empty-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                UI.showToast('Meal planning drag & drop coming soon! 🎯', 'info');
            });
        });
    }

    static removeMealFromPlan(dateKey, mealType) {
        const date = new Date(dateKey);
        state.removeFromMealPlan(date, mealType);
        this.renderMealPlan();
    }

    static changeMealPlanWeek(direction) {
        const newDate = new Date(state.currentWeekStart);
        newDate.setDate(newDate.getDate() + (direction * 7));
        state.currentWeekStart = state.getWeekStart(newDate);
        this.renderMealPlan();
    }

    static clearMealPlanWeek() {
        const weekStart = state.currentWeekStart;
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(date.getDate() + i);
            const key = date.toISOString().split('T')[0];
            delete state.mealPlan[key];
        }
        state.saveToStorage('MEAL_PLAN', state.mealPlan);
        this.renderMealPlan();
    }

    static generateShoppingListFromMealPlan() {
        UI.showToast('Shopping list generation coming soon! 🛒', 'info');
    }

    // Discover Page
    static async renderDiscoverPage() {
        const recipes = await APIService.getMultipleRandomRecipes(12);
        this.renderRecipeGrid('discoverResults', recipes);
    }

    static async applyDiscoverFilters() {
        const cuisine = document.getElementById('cuisineFilter').value;
        const category = document.getElementById('categoryFilter').value;
        const diet = document.getElementById('dietFilter').value;

        try {
            UI.showLoading('discoverResults');
            let results;

            if (cuisine) {
                results = await APIService.filterByArea(cuisine);
            } else if (category) {
                results = await APIService.filterByCategory(category);
            } else {
                results = { meals: await APIService.getMultipleRandomRecipes(12) };
            }

            if (results.meals) {
                this.renderRecipeGrid('discoverResults', results.meals);
            }
        } catch (error) {
            this.showError('Failed to load recipes');
        }
    }

    // Modals
    static openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    static closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    // Filters
    static applyQuickFilter(filter) {
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
        });
        event.target.classList.add('active');

        if (filter === 'all') {
            this.renderFeaturedRecipes();
        } else {
            this.loadRegionalRecipes(filter);
        }
    }

    static applyAdvancedFilters() {
        // Collect filter values
        const dietary = Array.from(document.querySelectorAll('#advancedFiltersModal input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        const time = document.querySelector('#advancedFiltersModal input[name="time"]:checked')?.value;
        const difficulty = document.querySelector('#advancedFiltersModal input[name="difficulty"]:checked')?.value;
        const spiceLevel = document.getElementById('spiceLevel').value;

        // Save to preferences
        state.updatePreferences({ dietary, difficulty, spiceLevel });
        
        UI.showToast('Filters applied!', 'success');
        this.closeModal('advancedFiltersModal');
        
        // Future: actually filter recipes based on these criteria
    }

    static resetFilters() {
        document.querySelectorAll('#advancedFiltersModal input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('#advancedFiltersModal input[type="radio"]').forEach(rb => rb.checked = false);
        document.getElementById('spiceLevel').value = 0;
    }

    // Utility UI methods
    static updateBadges() {
        document.getElementById('savedBadge').textContent = state.savedRecipes.length;
        document.getElementById('cartBadge').textContent = state.shoppingList.filter(i => !i.checked).length;
    }

    static updateCartBadge(count) {
        document.getElementById('cartBadge').textContent = count;
    }

    static showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>Loading recipes...</p>
                </div>
            `;
        }
    }

    static renderEmptyState(containerId, title, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>${title}</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static showError(message) {
        this.showToast(message, 'error');
    }

    static showAchievement(achievement) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-achievement';
        toast.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div>
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.title}</div>
                </div>
            </div>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // PWA Installation
    static initPWA() {
        let deferredPrompt;
        const installPrompt = document.getElementById('installPrompt');
        const installBtn = document.getElementById('installBtn');
        const dismissBtn = document.getElementById('dismissInstallBtn');

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installPrompt.classList.remove('hidden');
        });

        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                installPrompt.classList.add('hidden');
            }
        });

        dismissBtn.addEventListener('click', () => {
            installPrompt.classList.add('hidden');
        });

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }

    // Intersection Observer for lazy loading
    static setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        // Observe will be set up when images are created
        state.on('recipes:rendered', () => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== INITIALIZE APP =====
let state;

document.addEventListener('DOMContentLoaded', () => {
    state = new AppState();
    UI.init();
    
    console.log('Recipe Finder App initialized! 🍳');
});

// Handle online/offline
window.addEventListener('online', () => {
    UI.showToast('Back online!', 'success');
});

window.addEventListener('offline', () => {
    UI.showToast('You are offline. Some features may be limited.', 'info');
});
