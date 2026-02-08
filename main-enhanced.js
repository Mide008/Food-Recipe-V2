// =================================================================
// WHAT'S COOKING - ENHANCED PROFESSIONAL VERSION
// Nigerian-Focused Recipe App with Advanced Features
// =================================================================

// ===== CONFIGURATION =====
const CONFIG = {
    API: {
        THEMEALDB: 'https://www.themealdb.com/api/json/v1/1',
        SPOONACULAR: 'https://api.spoonacular.com',
        SPOONACULAR_KEY: '9dba71a2a01941e9a00b0de69f85a7c0',
        NUTRITIONIX: {
            BASE: 'https://trackapi.nutritionix.com/v2',
            APP_ID: 'YOUR_APP_ID', // Register at nutritionix.com
            APP_KEY: 'YOUR_API_KEY'
        },
        UNSPLASH: {
            BASE: 'https://api.unsplash.com',
            ACCESS_KEY: 'YOUR_UNSPLASH_KEY',
            COLLECTION_ID: 'african-food-recipes'
        },
        GOOGLE_PLACES: 'https://maps.googleapis.com/maps/api/place',
        GOOGLE_API_KEY: 'YOUR_GOOGLE_API_KEY'
    },
    
    NIGERIAN_MARKET_DATA: {
        ingredients: {
            'tomato': { price: 450, unit: 'kg', season: 'year-round' },
            'onion': { price: 350, unit: 'kg', season: 'year-round' },
            'plantain': { price: 150, unit: 'bunch', season: 'year-round' },
            'yam': { price: 1200, unit: 'tubers', season: 'dry-season' },
            'rice': { price: 800, unit: 'kg', season: 'year-round' },
            'beans': { price: 600, unit: 'kg', season: 'year-round' },
            'palm oil': { price: 1200, unit: 'liter', season: 'year-round' },
            'egusi': { price: 1800, unit: 'kg', season: 'year-round' },
            'stockfish': { price: 3000, unit: 'kg', season: 'year-round' },
            'crayfish': { price: 2500, unit: 'kg', season: 'year-round' }
        },
        markets: [
            { name: 'Mile 12 Market', city: 'Lagos', speciality: 'Fresh Produce' },
            { name: 'Wuse Market', city: 'Abuja', speciality: 'Grains & Spices' },
            { name: 'Ariaria Market', city: 'Aba', speciality: 'Everything' },
            { name: 'Ogbete Market', city: 'Enugu', speciality: 'Local Delicacies' },
            { name: 'Kurmi Market', city: 'Kano', speciality: 'Northern Cuisine' }
        ]
    },
    
    CULTURAL_CONTENT: {
        adinkraSymbols: [
            { symbol: '🏺', name: 'Gye Nyame', meaning: 'Except God' },
            { symbol: '🌀', name: 'Akoma', meaning: 'Heart/Patience' },
            { symbol: '🕊️', name: 'Fawohodie', meaning: 'Independence' },
            { symbol: '🌿', name: 'Duafe', meaning: 'Wooden Comb' },
            { symbol: '🐘', name: 'Epa', meaning: 'Handcuffs/Justice' }
        ],
        
        festivals: {
            'December': ['Christmas Feast', 'End of Year Celebrations'],
            'April': ['Easter Specials', 'Ramadan Iftar'],
            'October': ['Independence Day', 'New Yam Festival'],
            'August': ['Sallah Celebrations']
        },
        
        languageTranslations: {
            en: {
                'welcome': 'Welcome to What\'s Cooking',
                'search': 'Search for recipes',
                'save': 'Save Recipe',
                'ingredients': 'Ingredients',
                'instructions': 'Instructions'
            },
            pcm: {
                'welcome': 'Welcome to Wetin Dey Cook',
                'search': 'Find food wey you wan cook',
                'save': 'Keep this food',
                'ingredients': 'Wetin you need',
                'instructions': 'How to cook am'
            }
        }
    },
    
    GAMIFICATION: {
        badges: {
            'Jollof Master': { icon: '🥘', description: 'Cooked 5+ jollof rice recipes' },
            'Soup King': { icon: '🍲', description: 'Mastered 3+ Nigerian soups' },
            'Street Food Explorer': { icon: '🌮', description: 'Tried all street food recipes' },
            'Meal Planner': { icon: '📅', description: 'Planned meals for 7 consecutive days' },
            'Budget Chef': { icon: '💰', description: 'Cooked meals under ₦2000 total' }
        }
    }
};

// ===== ADVANCED STATE MANAGEMENT =====
class EnhancedAppState {
    constructor() {
        this.userProfile = this.loadProfile();
        this.recipes = [];
        this.savedRecipes = [];
        this.shoppingList = [];
        this.mealPlan = {};
        this.cookingHistory = [];
        this.achievements = [];
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.lastSearch = null;
        this.observers = new Set();
        this.init();
    }
    
    loadProfile() {
        return JSON.parse(localStorage.getItem('nigerianChefProfile')) || {
            name: '',
            location: '',
            dietaryRestrictions: [],
            skillLevel: 'beginner',
            tastePreferences: {
                spiceLevel: 3,
                preferredCuisines: ['nigerian'],
                dislikedIngredients: []
            },
            cookingGoals: [],
            streak: 0,
            lastCooked: null
        };
    }
    
    saveProfile() {
        localStorage.setItem('nigerianChefProfile', JSON.stringify(this.userProfile));
        this.notifyObservers('profile:updated');
    }
    
    addAchievement(badgeName) {
        if (!this.achievements.includes(badgeName)) {
            this.achievements.push(badgeName);
            this.notifyObservers('achievement:unlocked', CONFIG.GAMIFICATION.badges[badgeName]);
            return true;
        }
        return false;
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        const lastCooked = this.userProfile.lastCooked;
        
        if (lastCooked === today) return;
        
        if (!lastCooked || this.isYesterday(lastCooked)) {
            this.userProfile.streak++;
        } else {
            this.userProfile.streak = 1;
        }
        
        this.userProfile.lastCooked = today;
        this.saveProfile();
    }
    
    isYesterday(dateString) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return dateString === yesterday.toDateString();
    }
    
    subscribe(observer) {
        this.observers.add(observer);
    }
    
    unsubscribe(observer) {
        this.observers.delete(observer);
    }
    
    notifyObservers(event, data) {
        this.observers.forEach(observer => {
            if (typeof observer === 'function') {
                observer(event, data);
            }
        });
    }
}

// ===== SMART RECIPE INTELLIGENCE ENGINE =====
class RecipeIntelligence {
    static nigerianSubstitutions = {
        // Western ingredient -> Nigerian alternatives
        'parmesan': ['aged wara', 'local cheese'],
        'cheddar': ['wara', 'local cheese'],
        'thyme': ['efirin', 'scent leaf'],
        'rosemary': ['efirin', 'bay leaf'],
        'oregano': ['efirin'],
        'butter': ['palm oil', 'red oil'],
        'olive oil': ['palm oil', 'vegetable oil'],
        'pasta': ['eba', 'semo', 'pounded yam'],
        'potato': ['yam', 'cocoyam', 'plantain'],
        'zucchini': ['ugu', 'fluted pumpkin'],
        'spinach': ['efo tete', 'green amaranth'],
        'kale': ['ugwu', 'fluted pumpkin leaves'],
        'heavy cream': ['coconut milk', 'evaporated milk'],
        'white wine': ['palm wine', 'omit'],
        'almonds': ['tigernuts', 'groundnuts']
    };
    
    static spiceLevels = [
        { level: 1, label: 'Mild', description: 'Little to no heat', icon: '🌶️' },
        { level: 2, label: 'Medium', description: 'Noticeable but comfortable', icon: '🌶️🌶️' },
        { level: 3, label: 'Spicy', description: 'Nigerian standard heat', icon: '🌶️🌶️🌶️' },
        { level: 4, label: 'Hot', description: 'For pepper lovers', icon: '🌶️🌶️🌶️🌶️' },
        { level: 5, label: 'Extreme', description: 'Suya/Somt pepper level', icon: '🌶️🌶️🌶️🌶️🌶️' }
    ];
    
    static estimateCost(ingredients, servings = 4) {
        let total = 0;
        ingredients.forEach(ingredient => {
            const normalizedIngredient = ingredient.toLowerCase();
            for (const [key, data] of Object.entries(CONFIG.NIGERIAN_MARKET_DATA.ingredients)) {
                if (normalizedIngredient.includes(key)) {
                    total += data.price / (key === 'rice' ? 4 : 2); // Rough estimate
                    break;
                }
            }
        });
        
        // Add baseline for unlisted ingredients
        total += (ingredients.length * 150);
        
        return {
            total: Math.round(total),
            perServing: Math.round(total / servings),
            currency: '₦'
        };
    }
    
    static suggestNigerianAlternatives(ingredient) {
        const lowerIngredient = ingredient.toLowerCase();
        for (const [western, alternatives] of Object.entries(this.nigerianSubstitutions)) {
            if (lowerIngredient.includes(western)) {
                return {
                    original: ingredient,
                    alternatives: alternatives,
                    reason: `Try these local alternatives available in Nigerian markets`
                };
            }
        }
        return null;
    }
    
    static calculateSpiceLevel(recipe) {
        const spicyIngredients = ['pepper', 'scotch bonnet', 'ata rodo', 'habanero', 'chili', 'cayenne'];
        let score = 0;
        
        spicyIngredients.forEach(spice => {
            if (recipe.ingredients?.some(ing => ing.toLowerCase().includes(spice))) {
                score++;
            }
            if (recipe.title?.toLowerCase().includes(spice)) score += 2;
            if (recipe.instructions?.toLowerCase().includes(spice)) score += 0.5;
        });
        
        return Math.min(Math.ceil(score), 5);
    }
    
    static isInSeason(ingredient) {
        const currentMonth = new Date().getMonth() + 1;
        for (const [item, data] of Object.entries(CONFIG.NIGERIAN_MARKET_DATA.ingredients)) {
            if (ingredient.toLowerCase().includes(item)) {
                if (data.season === 'year-round') return true;
                // Simple seasonal logic - expand in real implementation
                return true;
            }
        }
        return true;
    }
}

// ===== VISUAL DESIGN ENHANCEMENTS =====
class VisualDesignSystem {
    static colors = {
        primary: {
            50: '#f0f9f4',
            100: '#dcf2e6',
            200: '#b9e5cd',
            300: '#89d1ae',
            400: '#58cc9d',
            500: '#38b27d',
            600: '#2a8f63',
            700: '#237151',
            800: '#1f5a43',
            900: '#1c4a38'
        },
        
        nigerian: {
            green: '#008751', // Nigerian flag green
            white: '#FFFFFF',
            orange: '#FF8C00', // Modified orange for better contrast
            earth: '#8B4513', // Rich brown earth tone
            spice: '#D35400', // Pepper orange
            gold: '#FFD700' // Celebration gold
        },
        
        semantic: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6'
        }
    };
    
    static typography = {
        display: {
            fontFamily: '"Playfair Display", "Georgia", serif',
            weights: {
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                black: 900
            }
        },
        body: {
            fontFamily: '"Manrope", "Inter", -apple-system, sans-serif',
            weights: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800
            }
        },
        
        scale: {
            xs: '0.75rem',    // 12px
            sm: '0.875rem',   // 14px
            base: '1rem',     // 16px
            lg: '1.125rem',   // 18px
            xl: '1.25rem',    // 20px
            '2xl': '1.5rem',  // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
            '5xl': '3rem',     // 48px
            '6xl': '3.75rem',  // 60px
            '7xl': '4.5rem'    // 72px
        }
    };
    
    static spacing = {
        px: '1px',
        0: '0',
        0.5: '0.125rem',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem',
        16: '4rem',
        20: '5rem',
        24: '6rem',
        32: '8rem'
    };
    
    static shadows = {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
        
        // Colored shadows
        primary: '0 4px 14px 0 rgba(88, 204, 157, 0.39)',
        nigerian: '0 4px 14px 0 rgba(0, 135, 81, 0.39)'
    };
    
    static createGlassEffect() {
        return `
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: ${this.shadows.lg};
        `;
    }
    
    static createAdinkraPattern(symbol) {
        const adinkra = CONFIG.CULTURAL_CONTENT.adinkraSymbols.find(a => a.name === symbol);
        if (!adinkra) return '';
        
        return `
            background-image: 
                radial-gradient(circle at 25% 25%, rgba(0, 135, 81, 0.1) 2px, transparent 2px),
                radial-gradient(circle at 75% 75%, rgba(255, 140, 0, 0.1) 2px, transparent 2px);
            background-size: 40px 40px;
            position: relative;
            
            &::before {
                content: '${adinkra.symbol}';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 3rem;
                opacity: 0.05;
                pointer-events: none;
            }
        `;
    }
}

// ===== INTERACTIVE COOKING MODE =====
class EnhancedCookingMode {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 0;
        this.timers = new Map();
        this.isActive = false;
        this.voiceCommands = new Map();
        this.ingredientsChecked = new Set();
        this.initVoiceCommands();
        this.setupFullscreenHandling();
    }
    
    initVoiceCommands() {
        this.voiceCommands.set('next', () => this.nextStep());
        this.voiceCommands.set('previous', () => this.previousStep());
        this.voiceCommands.set('repeat', () => this.repeatStep());
        this.voiceCommands.set('start timer', () => this.showTimerDialog());
        this.voiceCommands.set('stop timer', () => this.stopAllTimers());
        this.voiceCommands.set('ingredient done', () => this.checkNextIngredient());
        this.voiceCommands.set('exit cooking', () => this.exit());
    }
    
    start(recipe) {
        this.isActive = true;
        this.recipe = recipe;
        this.currentStep = 0;
        this.totalSteps = recipe.instructions?.length || 0;
        this.ingredientsChecked.clear();
        
        // Enter fullscreen
        this.enterFullscreen();
        
        // Start voice recognition if available
        this.startVoiceRecognition();
        
        // Keep screen awake
        this.requestWakeLock();
        
        // Render cooking interface
        this.renderCookingInterface();
        
        // Notify observers
        document.dispatchEvent(new CustomEvent('cooking:started', { detail: recipe }));
    }
    
    renderCookingInterface() {
        const container = document.createElement('div');
        container.className = 'cooking-mode-enhanced';
        container.innerHTML = this.generateCookingUI();
        document.body.appendChild(container);
        
        // Add event listeners
        this.attachCookingEventListeners();
        
        // Start first timer if specified
        this.startStepTimers();
    }
    
    generateCookingUI() {
        const step = this.recipe.instructions[this.currentStep];
        const spiceLevel = RecipeIntelligence.calculateSpiceLevel(this.recipe);
        
        return `
            <div class="cooking-container">
                <div class="cooking-header">
                    <button class="cooking-exit" aria-label="Exit cooking mode">
                        <i class="fas fa-times"></i>
                    </button>
                    <h1 class="cooking-title">${this.recipe.title}</h1>
                    <div class="cooking-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(this.currentStep + 1) / this.totalSteps * 100}%"></div>
                        </div>
                        <span class="progress-text">Step ${this.currentStep + 1} of ${this.totalSteps}</span>
                    </div>
                </div>
                
                <div class="cooking-content">
                    <div class="step-display">
                        <div class="step-number">Step ${this.currentStep + 1}</div>
                        <div class="step-instruction">${step}</div>
                        
                        ${this.recipe.timers && this.recipe.timers[this.currentStep] ? `
                            <div class="step-timer">
                                <i class="fas fa-clock"></i>
                                <span>${this.recipe.timers[this.currentStep]} minutes</span>
                                <button class="timer-start" data-step="${this.currentStep}">
                                    Start Timer
                                </button>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="ingredients-sidebar">
                        <h3>Ingredients for this step</h3>
                        <ul class="step-ingredients">
                            ${this.getStepIngredients().map((ing, i) => `
                                <li class="ingredient-item ${this.ingredientsChecked.has(i) ? 'checked' : ''}" 
                                    data-index="${i}">
                                    <span class="ingredient-checkbox"></span>
                                    <span class="ingredient-name">${ing}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="cooking-controls">
                    <button class="control-btn previous" ${this.currentStep === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i> Previous
                    </button>
                    
                    <div class="control-center">
                        <button class="control-btn timer">
                            <i class="fas fa-clock"></i> Timer
                        </button>
                        <button class="control-btn voice">
                            <i class="fas fa-microphone"></i> Voice
                        </button>
                        <button class="control-btn notes">
                            <i class="fas fa-sticky-note"></i> Notes
                        </button>
                    </div>
                    
                    <button class="control-btn next primary">
                        ${this.currentStep === this.totalSteps - 1 ? 'Finish Cooking' : 'Next Step'}
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                
                <div class="cooking-footer">
                    <div class="spice-indicator">
                        <span>Spice Level:</span>
                        <div class="spice-dots">
                            ${Array.from({length: 5}).map((_, i) => `
                                <span class="spice-dot ${i < spiceLevel ? 'active' : ''}">${i < spiceLevel ? '🌶️' : '○'}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="active-timers" id="active-timers"></div>
                    
                    <div class="voice-hint">
                        <i class="fas fa-microphone-alt"></i>
                        <span>Say "Next", "Previous", or "Start Timer"</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    getStepIngredients() {
        // In a real implementation, this would parse ingredients per step
        return this.recipe.ingredients || [];
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.updateUI();
        } else {
            this.finishCooking();
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateUI();
        }
    }
    
    updateUI() {
        const container = document.querySelector('.cooking-mode-enhanced');
        if (container) {
            container.innerHTML = this.generateCookingUI();
            this.attachCookingEventListeners();
        }
    }
    
    attachCookingEventListeners() {
        // Previous button
        document.querySelector('.control-btn.previous')?.addEventListener('click', () => this.previousStep());
        
        // Next button
        document.querySelector('.control-btn.next')?.addEventListener('click', () => this.nextStep());
        
        // Timer button
        document.querySelector('.control-btn.timer')?.addEventListener('click', () => this.showTimerDialog());
        
        // Exit button
        document.querySelector('.cooking-exit')?.addEventListener('click', () => this.exit());
        
        // Ingredient checkboxes
        document.querySelectorAll('.ingredient-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(item.dataset.index);
                if (this.ingredientsChecked.has(index)) {
                    this.ingredientsChecked.delete(index);
                } else {
                    this.ingredientsChecked.add(index);
                }
                item.classList.toggle('checked');
            });
        });
    }
    
    showTimerDialog() {
        const duration = prompt('Set timer (minutes):', '15');
        if (duration && !isNaN(duration)) {
            this.startTimer(parseInt(duration), `Step ${this.currentStep + 1} Timer`);
        }
    }
    
    startTimer(minutes, label) {
        const timerId = Date.now();
        const endTime = Date.now() + (minutes * 60000);
        
        this.timers.set(timerId, {
            label,
            endTime,
            interval: setInterval(() => {
                const remaining = Math.max(0, endTime - Date.now());
                if (remaining === 0) {
                    this.timerComplete(timerId);
                }
                this.updateTimerDisplay(timerId, remaining);
            }, 1000)
        });
        
        // Show notification permission if needed
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    timerComplete(timerId) {
        const timer = this.timers.get(timerId);
        if (timer) {
            clearInterval(timer.interval);
            this.timers.delete(timerId);
            
            // Show notification
            this.showNotification('Timer Complete!', timer.label);
            
            // Play sound
            this.playCompletionSound();
            
            // Update UI
            this.updateTimerDisplay();
        }
    }
    
    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: '/icon.png'
            });
        }
        
        // Fallback toast notification
        this.showToast(`${title}: ${body}`, 'success');
    }
    
    playCompletionSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
        audio.play().catch(e => console.log('Audio play failed:', e));
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    exit() {
        if (confirm('Exit cooking mode? Your progress will be saved.')) {
            this.isActive = false;
            this.exitFullscreen();
            document.querySelector('.cooking-mode-enhanced')?.remove();
            document.dispatchEvent(new CustomEvent('cooking:ended'));
        }
    }
    
    finishCooking() {
        this.isActive = false;
        this.exitFullscreen();
        document.querySelector('.cooking-mode-enhanced')?.remove();
        
        // Save to history
        this.saveCookingHistory();
        
        // Update user streak
        EnhancedAppState.updateStreak();
        
        // Show completion screen
        this.showCompletionScreen();
    }
    
    showCompletionScreen() {
        const modal = document.createElement('div');
        modal.className = 'completion-modal';
        modal.innerHTML = `
            <div class="completion-content">
                <div class="completion-icon">🎉</div>
                <h2>Great Job!</h2>
                <p>You've successfully cooked <strong>${this.recipe.title}</strong></p>
                
                <div class="completion-stats">
                    <div class="stat">
                        <span class="stat-value">${this.totalSteps}</span>
                        <span class="stat-label">Steps completed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span class="stat-label">Finished at</span>
                    </div>
                </div>
                
                <button class="btn-primary share-recipe">
                    <i class="fas fa-share"></i> Share Your Success
                </button>
                
                <button class="btn-secondary close-modal">
                    Back to Recipes
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.share-recipe').addEventListener('click', () => this.shareAchievement());
    }
    
    shareAchievement() {
        const text = `Just cooked ${this.recipe.title} using What's Cooking! 🍳 #NigerianRecipes #WhatsCooking`;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out my cooking achievement!',
                text,
                url
            });
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${text}\n${url}`);
            alert('Share text copied to clipboard!');
        }
    }
    
    enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    requestWakeLock() {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(err => {
                console.log('Wake Lock failed:', err);
            });
        }
    }
    
    startVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
                this.handleVoiceCommand(transcript);
            };
            
            this.recognition.start();
        }
    }
    
    handleVoiceCommand(command) {
        for (const [key, action] of this.voiceCommands.entries()) {
            if (command.includes(key)) {
                action();
                break;
            }
        }
    }
}

// ===== MEAL PLANNER WITH NIGERIAN FOCUS =====
class NigerianMealPlanner {
    constructor() {
        this.weekPlan = {};
        this.shoppingList = [];
        this.budget = 0;
        this.initWeek();
    }
    
    initWeek() {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        
        days.forEach((day, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() + index);
            const dateKey = date.toISOString().split('T')[0];
            
            this.weekPlan[dateKey] = {
                dayName: day,
                meals: {
                    breakfast: null,
                    lunch: null,
                    dinner: null
                },
                notes: '',
                completed: false
            };
        });
    }
    
    addMeal(date, mealType, recipe) {
        if (this.weekPlan[date]) {
            this.weekPlan[date].meals[mealType] = recipe;
            
            // Update shopping list
            this.updateShoppingList();
            
            // Update budget
            this.updateBudget();
            
            return true;
        }
        return false;
    }
    
    updateShoppingList() {
        this.shoppingList = [];
        const ingredientCounts = new Map();
        
        Object.values(this.weekPlan).forEach(day => {
            Object.values(day.meals).forEach(recipe => {
                if (recipe && recipe.ingredients) {
                    recipe.ingredients.forEach(ingredient => {
                        const count = ingredientCounts.get(ingredient) || 0;
                        ingredientCounts.set(ingredient, count + 1);
                    });
                }
            });
        });
        
        // Convert to shopping list format
        ingredientCounts.forEach((count, ingredient) => {
            this.shoppingList.push({
                ingredient,
                quantity: this.calculateQuantity(ingredient, count),
                purchased: false,
                category: this.categorizeIngredient(ingredient)
            });
        });
    }
    
    calculateQuantity(ingredient, count) {
        // Smart quantity estimation based on Nigerian market units
        const lowerIngredient = ingredient.toLowerCase();
        
        if (lowerIngredient.includes('tomato') || lowerIngredient.includes('pepper')) {
            return `${count * 3} pieces`;
        } else if (lowerIngredient.includes('onion')) {
            return `${count * 2} bulbs`;
        } else if (lowerIngredient.includes('rice')) {
            return `${count * 0.5} kg`;
        } else if (lowerIngredient.includes('meat') || lowerIngredient.includes('chicken')) {
            return `${count * 0.25} kg`;
        } else if (lowerIngredient.includes('oil')) {
            return `${count * 0.25} liter`;
        } else {
            return `as needed`;
        }
    }
    
    categorizeIngredient(ingredient) {
        const lowerIngredient = ingredient.toLowerCase();
        
        if (lowerIngredient.includes('tomato') || lowerIngredient.includes('pepper') || lowerIngredient.includes('onion')) {
            return 'Vegetables';
        } else if (lowerIngredient.includes('rice') || lowerIngredient.includes('beans') || lowerIngredient.includes('yam')) {
            return 'Staples';
        } else if (lowerIngredient.includes('meat') || lowerIngredient.includes('chicken') || lowerIngredient.includes('fish')) {
            return 'Protein';
        } else if (lowerIngredient.includes('oil') || lowerIngredient.includes('butter')) {
            return 'Fats/Oils';
        } else if (lowerIngredient.includes('salt') || lowerIngredient.includes('seasoning') || lowerIngredient.includes('spice')) {
            return 'Seasonings';
        } else {
            return 'Other';
        }
    }
    
    updateBudget() {
        let total = 0;
        
        Object.values(this.weekPlan).forEach(day => {
            Object.values(day.meals).forEach(recipe => {
                if (recipe) {
                    const cost = RecipeIntelligence.estimateCost(recipe.ingredients || []);
                    total += cost.total;
                }
            });
        });
        
        this.budget = total;
    }
    
    generateShoppingListByMarket() {
        const markets = CONFIG.NIGERIAN_MARKET_DATA.markets;
        const marketGroups = {};
        
        // Initialize market groups
        markets.forEach(market => {
            marketGroups[market.name] = [];
        });
        
        // Categorize ingredients by likely market availability
        this.shoppingList.forEach(item => {
            let assignedMarket = markets[0].name; // Default to first market
            
            // Simple heuristic - in real app, use more sophisticated logic
            if (item.category === 'Vegetables') {
                assignedMarket = 'Mile 12 Market';
            } else if (item.category === 'Protein') {
                assignedMarket = 'Wuse Market';
            } else if (item.category === 'Staples') {
                assignedMarket = 'Ariaria Market';
            } else if (item.category === 'Seasonings') {
                assignedMarket = 'Ogbete Market';
            }
            
            marketGroups[assignedMarket].push(item);
        });
        
        return marketGroups;
    }
    
    exportToWhatsApp() {
        const text = this.formatWhatsAppMessage();
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }
    
    formatWhatsAppMessage() {
        let message = `🛒 *Weekly Shopping List*\n\n`;
        
        const marketGroups = this.generateShoppingListByMarket();
        
        Object.entries(marketGroups).forEach(([market, items]) => {
            if (items.length > 0) {
                message += `*${market}:*\n`;
                items.forEach(item => {
                    const checkmark = item.purchased ? '✅' : '⬜';
                    message += `${checkmark} ${item.ingredient} - ${item.quantity}\n`;
                });
                message += '\n';
            }
        });
        
        message += `💰 *Estimated Budget: ₦${this.budget.toLocaleString()}*\n`;
        message += `\nGenerated by What's Cooking App 🇳🇬`;
        
        return message;
    }
}

// ===== SMART SEARCH WITH VOICE & VISUAL =====
class EnhancedSearch {
    constructor() {
        this.searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        this.recentSearches = new Set();
        this.voiceSearchActive = false;
        this.init();
    }
    
    init() {
        this.setupSearchInput();
        this.setupVoiceSearch();
        this.setupImageSearch();
        this.loadSearchSuggestions();
    }
    
    setupSearchInput() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            this.showSuggestions(e.target.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
    }
    
    setupVoiceSearch() {
        const voiceBtn = document.getElementById('voice-search-btn');
        if (!voiceBtn) return;
        
        voiceBtn.addEventListener('click', () => {
            this.startVoiceSearch();
        });
    }
    
    setupImageSearch() {
        const imageBtn = document.getElementById('image-search-btn');
        if (!imageBtn) return;
        
        imageBtn.addEventListener('click', () => {
            this.startImageSearch();
        });
    }
    
    showSuggestions(query) {
        if (!query.trim()) {
            this.hideSuggestions();
            return;
        }
        
        const suggestions = this.generateSuggestions(query);
        this.displaySuggestions(suggestions);
    }
    
    generateSuggestions(query) {
        const nigerianDishes = [
            'Jollof Rice', 'Egusi Soup', 'Pounded Yam', 'Suya', 
            'Moi Moi', 'Akara', 'Efo Riro', 'Amala', 'Ewedu',
            'Ofada Rice', 'Banga Soup', 'Pepper Soup', 'Nkwobi'
        ];
        
        const ingredients = [
            'Tomato', 'Onion', 'Garlic', 'Ginger', 'Scotch Bonnet',
            'Palm Oil', 'Crayfish', 'Stockfish', 'Plantain', 'Yam'
        ];
        
        const lowerQuery = query.toLowerCase();
        
        return [
            // Exact matches
            ...nigerianDishes.filter(dish => dish.toLowerCase().includes(lowerQuery)),
            ...ingredients.filter(ing => ing.toLowerCase().includes(lowerQuery)),
            
            // Category suggestions
            ...['Vegetarian', 'Spicy', 'Quick', 'Festival', 'Street Food']
                .filter(cat => cat.toLowerCase().includes(lowerQuery))
                .map(cat => `Category: ${cat}`),
            
            // Recent searches
            ...this.searchHistory
                .filter(term => term.toLowerCase().includes(lowerQuery))
                .slice(0, 3)
        ].slice(0, 8);
    }
    
    displaySuggestions(suggestions) {
        let container = document.getElementById('search-suggestions');
        if (!container) {
            container = document.createElement('div');
            container.id = 'search-suggestions';
            container.className = 'search-suggestions';
            document.querySelector('.search-container').appendChild(container);
        }
        
        if (suggestions.length === 0) {
            container.innerHTML = `
                <div class="suggestion-item">
                    <i class="fas fa-search"></i>
                    <span>No suggestions found</span>
                </div>
            `;
        } else {
            container.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" data-suggestion="${suggestion}">
                    <i class="fas ${suggestion.startsWith('Category:') ? 'fa-tag' : 'fa-utensils'}"></i>
                    <span>${suggestion}</span>
                </div>
            `).join('');
            
            // Add click handlers
            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const searchInput = document.getElementById('search-input');
                    searchInput.value = item.dataset.suggestion;
                    this.performSearch(item.dataset.suggestion);
                    this.hideSuggestions();
                });
            });
        }
        
        container.style.display = 'block';
    }
    
    hideSuggestions() {
        const container = document.getElementById('search-suggestions');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser');
            return;
        }
        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-NG';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        const searchInput = document.getElementById('search-input');
        const voiceBtn = document.getElementById('voice-search-btn');
        
        voiceBtn.classList.add('listening');
        recognition.start();
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            this.performSearch(transcript);
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
        };
    }
    
    startImageSearch() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.analyzeImage(file);
            }
        });
        
        input.click();
    }
    
    analyzeImage(file) {
        // In a real implementation, this would use:
        // 1. TensorFlow.js for client-side ML
        // 2. Cloud Vision API for more accurate results
        // 3. Spoonacular's image analysis API
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                // For demo purposes, show loading and then random suggestions
                this.showImageAnalysisModal(img.src);
                
                // Simulate API call
                setTimeout(() => {
                    this.suggestRecipesFromImage();
                }, 1500);
            };
        };
        reader.readAsDataURL(file);
    }
    
    showImageAnalysisModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-analysis-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h2>Analyzing Your Image</h2>
                <div class="image-preview">
                    <img src="${imageSrc}" alt="Uploaded food">
                </div>
                <div class="analysis-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <p>Identifying ingredients...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    suggestRecipesFromImage() {
        // Mock suggestions - in real app, this would come from API
        const suggestions = [
            { name: 'Jollof Rice', confidence: 85 },
            { name: 'Fried Plantain', confidence: 72 },
            { name: 'Chicken Stew', confidence: 68 },
            { name: 'Vegetable Salad', confidence: 55 }
        ];
        
        const modal = document.querySelector('.image-analysis-modal');
        if (modal) {
            modal.querySelector('.analysis-progress').innerHTML = `
                <h3>We detected:</h3>
                <ul class="detected-items">
                    ${suggestions.map(item => `
                        <li>
                            <span class="item-name">${item.name}</span>
                            <span class="item-confidence">${item.confidence}% match</span>
                        </li>
                    `).join('')}
                </ul>
                <button class="btn-primary search-detected">
                    Search for similar recipes
                </button>
            `;
            
            modal.querySelector('.search-detected').addEventListener('click', () => {
                this.performSearch(suggestions[0].name);
                modal.remove();
            });
        }
    }
    
    performSearch(query) {
        if (!query.trim()) return;
        
        // Add to history
        this.addToHistory(query);
        
        // Show loading state
        this.showLoading();
        
        // Perform actual search
        this.searchRecipes(query).then(results => {
            this.displayResults(results);
            this.hideLoading();
        }).catch(error => {
            console.error('Search failed:', error);
            this.hideLoading();
            this.showError('Search failed. Please try again.');
        });
    }
    
    addToHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(term => term !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        // Save to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }
    
    async searchRecipes(query) {
        // Try multiple APIs for comprehensive results
        const promises = [
            this.searchLocalDatabase(query),
            this.searchThemealDB(query),
            this.searchSpoonacular(query)
        ];
        
        const results = await Promise.allSettled(promises);
        
        // Combine and deduplicate results
        const allRecipes = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allRecipes.push(...result.value);
            }
        });
        
        // Remove duplicates
        const uniqueRecipes = this.deduplicateRecipes(allRecipes);
        
        // Sort by relevance
        return this.sortByRelevance(uniqueRecipes, query);
    }
    
    searchLocalDatabase(query) {
        // Search in local Nigerian recipe database
        const nigerianRecipes = this.getNigerianRecipes();
        return nigerianRecipes.filter(recipe => 
            recipe.title.toLowerCase().includes(query.toLowerCase()) ||
            recipe.ingredients?.some(ing => ing.toLowerCase().includes(query.toLowerCase())) ||
            recipe.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }
    
    getNigerianRecipes() {
        // This would come from your local database
        return [
            {
                id: 'ng-001',
                title: 'Jollof Rice',
                description: 'The famous West African rice dish',
                prepTime: 45,
                difficulty: 'Medium',
                spiceLevel: 3,
                ingredients: ['rice', 'tomatoes', 'onions', 'red bell pepper', 'scotch bonnet'],
                tags: ['nigerian', 'rice', 'main dish', 'party']
            },
            // ... more recipes
        ];
    }
    
    async searchThemealDB(query) {
        try {
            const response = await fetch(
                `${CONFIG.API.THEMEALDB}/search.php?s=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            return data.meals || [];
        } catch (error) {
            console.error('TheMealDB search failed:', error);
            return [];
        }
    }
    
    async searchSpoonacular(query) {
        try {
            const response = await fetch(
                `${CONFIG.API.SPOONACULAR}/recipes/complexSearch?query=${encodeURIComponent(query)}&apiKey=${CONFIG.API.SPOONACULAR_KEY}&number=10`
            );
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Spoonacular search failed:', error);
            return [];
        }
    }
    
    deduplicateRecipes(recipes) {
        const seen = new Set();
        return recipes.filter(recipe => {
            const key = recipe.title?.toLowerCase() || recipe.strMeal?.toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
    
    sortByRelevance(recipes, query) {
        const lowerQuery = query.toLowerCase();
        
        return recipes.sort((a, b) => {
            const aTitle = a.title || a.strMeal || '';
            const bTitle = b.title || b.strMeal || '';
            
            // Exact title match gets highest priority
            if (aTitle.toLowerCase() === lowerQuery) return -1;
            if (bTitle.toLowerCase() === lowerQuery) return 1;
            
            // Nigerian recipes get priority
            const aIsNigerian = a.tags?.includes('nigerian') || a.strArea === 'Nigerian';
            const bIsNigerian = b.tags?.includes('nigerian') || b.strArea === 'Nigerian';
            
            if (aIsNigerian && !bIsNigerian) return -1;
            if (!aIsNigerian && bIsNigerian) return 1;
            
            // Title contains query
            const aTitleContains = aTitle.toLowerCase().includes(lowerQuery);
            const bTitleContains = bTitle.toLowerCase().includes(lowerQuery);
            
            if (aTitleContains && !bTitleContains) return -1;
            if (!aTitleContains && bTitleContains) return 1;
            
            // Sort by rating/popularity
            const aRating = a.rating || a.strRating || 0;
            const bRating = b.rating || b.strRating || 0;
            
            return bRating - aRating;
        });
    }
    
    displayResults(recipes) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;
        
        if (recipes.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No recipes found</h3>
                    <p>Try searching with different ingredients</p>
                    <div class="suggestions">
                        <button class="suggestion-chip" data-search="jollof">Jollof Rice</button>
                        <button class="suggestion-chip" data-search="plantain">Plantain</button>
                        <button class="suggestion-chip" data-search="soup">Nigerian Soup</button>
                    </div>
                </div>
            `;
            
            // Add event listeners to suggestion chips
            resultsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    this.performSearch(chip.dataset.search);
                });
            });
            
            return;
        }
        
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h2>Found ${recipes.length} recipes for "${document.getElementById('search-input').value}"</h2>
                <div class="results-filters">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="nigerian">Nigerian</button>
                    <button class="filter-btn" data-filter="quick">Quick</button>
                    <button class="filter-btn" data-filter="vegetarian">Vegetarian</button>
                </div>
            </div>
            <div class="results-grid">
                ${recipes.map(recipe => this.createRecipeCard(recipe)).join('')}
            </div>
        `;
        
        // Add filter functionality
        resultsContainer.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                resultsContainer.querySelectorAll('.filter-btn').forEach(b => 
                    b.classList.remove('active'));
                btn.classList.add('active');
                
                this.filterResults(btn.dataset.filter);
            });
        });
    }
    
    createRecipeCard(recipe) {
        const title = recipe.title || recipe.strMeal || 'Unnamed Recipe';
        const image = recipe.image || recipe.strMealThumb || 'https://via.placeholder.com/300x200?text=Food';
        const prepTime = recipe.prepTime || 30;
        const difficulty = recipe.difficulty || 'Medium';
        const spiceLevel = RecipeIntelligence.calculateSpiceLevel(recipe);
        
        // Estimate cost
        const ingredients = recipe.ingredients || [];
        const cost = RecipeIntelligence.estimateCost(ingredients);
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id || recipe.idMeal}">
                <div class="card-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                    <button class="save-recipe-btn" title="Save recipe">
                        <i class="far fa-bookmark"></i>
                    </button>
                    ${recipe.strArea === 'Nigerian' || recipe.tags?.includes('nigerian') ? `
                        <span class="nigerian-badge">🇳🇬 Nigerian</span>
                    ` : ''}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                    
                    <div class="card-meta">
                        <span class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${prepTime} min
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-signal"></i>
                            ${difficulty}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-pepper-hot"></i>
                            ${'🌶️'.repeat(spiceLevel)}
                        </span>
                    </div>
                    
                    ${recipe.description || recipe.strInstructions ? `
                        <p class="card-description">
                            ${(recipe.description || recipe.strInstructions || '').substring(0, 100)}...
                        </p>
                    ` : ''}
                    
                    <div class="card-footer">
                        <div class="cost-estimate">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>~₦${cost.total}</span>
                        </div>
                        <button class="view-recipe-btn">
                            View Recipe <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    filterResults(filter) {
        const cards = document.querySelectorAll('.recipe-card');
        
        cards.forEach(card => {
            let show = true;
            
            if (filter === 'nigerian') {
                const isNigerian = card.querySelector('.nigerian-badge') !== null;
                show = isNigerian;
            } else if (filter === 'quick') {
                const prepTime = parseInt(card.querySelector('.card-meta .meta-item:nth-child(1)').textContent);
                show = prepTime <= 30;
            } else if (filter === 'vegetarian') {
                // This would need actual recipe data
                show = true; // Placeholder
            }
            
            card.style.display = show ? 'block' : 'none';
        });
    }
    
    showLoading() {
        let loader = document.getElementById('search-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'search-loader';
            loader.className = 'search-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <p>Searching recipes...</p>
            `;
            document.querySelector('.search-results-container').appendChild(loader);
        }
        loader.style.display = 'flex';
    }
    
    hideLoading() {
        const loader = document.getElementById('search-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'search-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        const container = document.querySelector('.search-results-container');
        container.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }
    
    loadSearchSuggestions() {
        // Load popular Nigerian searches
        const popularSearches = [
            'Jollof Rice', 'Egusi Soup', 'Fried Rice', 'Plantain', 
            'Chicken Stew', 'Akara', 'Moi Moi', 'Pepper Soup'
        ];
        
        const container = document.getElementById('popular-searches');
        if (container) {
            container.innerHTML = popularSearches.map(term => `
                <button class="popular-search-chip" data-search="${term}">
                    ${term}
                </button>
            `).join('');
            
            container.querySelectorAll('.popular-search-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    const searchInput = document.getElementById('search-input');
                    searchInput.value = chip.dataset.search;
                    this.performSearch(chip.dataset.search);
                });
            });
        }
    }
}

// ===== GAMIFICATION & ACHIEVEMENTS =====
class CookingAchievements {
    constructor() {
        this.achievements = JSON.parse(localStorage.getItem('cookingAchievements')) || {};
        this.streak = parseInt(localStorage.getItem('cookingStreak')) || 0;
        this.lastCookedDate = localStorage.getItem('lastCookedDate');
        this.init();
    }
    
    init() {
        this.updateStreak();
        this.checkForAchievements();
    }
    
    updateStreak() {
        const today = new Date().toDateString();
        
        if (this.lastCookedDate === today) {
            return; // Already cooked today
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (this.lastCookedDate === yesterday.toDateString()) {
            this.streak++;
        } else {
            this.streak = 1;
        }
        
        this.lastCookedDate = today;
        this.save();
        
        // Check streak achievements
        this.checkStreakAchievements();
    }
    
    checkStreakAchievements() {
        if (this.streak >= 7 && !this.achievements.weeklyChef) {
            this.unlockAchievement('weeklyChef', '7-Day Streak!');
        }
        
        if (this.streak >= 30 && !this.achievements.monthlyMaster) {
            this.unlockAchievement('monthlyMaster', '30-Day Streak!');
        }
    }
    
    unlockAchievement(id, name) {
        this.achievements[id] = {
            name,
            unlockedAt: new Date().toISOString()
        };
        
        this.save();
        this.showAchievementNotification(name);
        
        // Update UI
        this.updateAchievementsUI();
    }
    
    showAchievementNotification(achievementName) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h3>Achievement Unlocked!</h3>
                    <p>${achievementName}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    checkForAchievements() {
        const recipeCount = this.getRecipeCount();
        const nigerianRecipeCount = this.getNigerianRecipeCount();
        
        // Jollof Master
        if (recipeCount >= 5 && !this.achievements.jollofMaster) {
            this.unlockAchievement('jollofMaster', 'Jollof Master');
        }
        
        // Soup King
        if (nigerianRecipeCount >= 3 && !this.achievements.soupKing) {
            this.unlockAchievement('soupKing', 'Soup King');
        }
        
        // Budget Chef
        const totalSpent = this.getTotalSpent();
        if (totalSpent > 0 && totalSpent < 5000 && !this.achievements.budgetChef) {
            this.unlockAchievement('budgetChef', 'Budget Chef');
        }
    }
    
    getRecipeCount() {
        // Get from localStorage or API
        const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes')) || [];
        return cookedRecipes.length;
    }
    
    getNigerianRecipeCount() {
        const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes')) || [];
        return cookedRecipes.filter(recipe => 
            recipe.tags?.includes('nigerian') || recipe.cuisine === 'Nigerian'
        ).length;
    }
    
    getTotalSpent() {
        const cookingHistory = JSON.parse(localStorage.getItem('cookingHistory')) || [];
        return cookingHistory.reduce((total, entry) => total + (entry.cost || 0), 0);
    }
    
    updateAchievementsUI() {
        const container = document.getElementById('achievements-container');
        if (!container) return;
        
        container.innerHTML = `
            <h2>Your Achievements</h2>
            <div class="achievements-grid">
                ${Object.entries(this.achievements).map(([id, achievement]) => `
                    <div class="achievement-card" data-achievement="${id}">
                        <div class="achievement-icon">🏆</div>
                        <div class="achievement-info">
                            <h3>${achievement.name}</h3>
                            <p>Unlocked: ${new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                `).join('')}
                
                ${Object.keys(this.achievements).length === 0 ? `
                    <div class="no-achievements">
                        <i class="fas fa-trophy"></i>
                        <p>Start cooking to unlock achievements!</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    save() {
        localStorage.setItem('cookingAchievements', JSON.stringify(this.achievements));
        localStorage.setItem('cookingStreak', this.streak.toString());
        localStorage.setItem('lastCookedDate', this.lastCookedDate);
    }
}

// ===== LOCALIZATION SUPPORT =====
class NigerianLocalization {
    constructor() {
        this.languages = {
            en: 'English',
            pcm: 'Nigerian Pidgin',
            yo: 'Yoruba',
            ig: 'Igbo',
            ha: 'Hausa'
        };
        
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.translations = this.loadTranslations();
        this.init();
    }
    
    loadTranslations() {
        return {
            en: {
                // English translations
                'welcome': 'Welcome to What\'s Cooking',
                'search': 'Search for recipes',
                'search_placeholder': 'What are you craving?',
                'categories': 'Categories',
                'saved': 'Saved Recipes',
                'meal_plan': 'Meal Plan',
                'shopping_list': 'Shopping List',
                'cook_now': 'Cook Now',
                'save_recipe': 'Save Recipe',
                'share': 'Share',
                'ingredients': 'Ingredients',
                'instructions': 'Instructions',
                'prep_time': 'Prep Time',
                'cook_time': 'Cook Time',
                'difficulty': 'Difficulty',
                'servings': 'Servings',
                'estimated_cost': 'Estimated Cost',
                'nigerian': 'Nigerian',
                'vegetarian': 'Vegetarian',
                'quick': 'Quick',
                'spicy': 'Spicy'
            },
            pcm: {
                // Nigerian Pidgin translations
                'welcome': 'Welcome to Wetin Dey Cook',
                'search': 'Find food wey you wan cook',
                'search_placeholder': 'Wetin you dey find chop?',
                'categories': 'Kinds of food',
                'saved': 'Food wey you don keep',
                'meal_plan': 'Plan for week',
                'shopping_list': 'Market list',
                'cook_now': 'Cook am now',
                'save_recipe': 'Keep this food',
                'share': 'Tell your people',
                'ingredients': 'Wetin you need',
                'instructions': 'How to cook am',
                'prep_time': 'Time to get ready',
                'cook_time': 'Time to cook',
                'difficulty': 'How hard e dey',
                'servings': 'How many person',
                'estimated_cost': 'How much e go cost',
                'nigerian': 'Naija food',
                'vegetarian': 'No meat',
                'quick': 'Quick quick',
                'spicy': 'With pepper'
            },
            yo: {
                // Yoruba translations (sample)
                'welcome': 'Kaabo si Kini O n Se?',
                'search': 'Wa ounje',
                'nigerian': 'Ounje Naijiria'
            },
            ig: {
                // Igbo translations (sample)
                'welcome': 'Nno na Gini O na-esi?',
                'search': 'Choo nri',
                'nigerian': 'Nri Naijiria'
            },
            ha: {
                // Hausa translations (sample)
                'welcome': 'Barka da zuwa Menene Kuke Dafa?',
                'search': 'Nemo abinci',
                'nigerian': 'Abincin Najeriya'
            }
        };
    }
    
    init() {
        this.setLanguage(this.currentLanguage);
        this.createLanguageSelector();
    }
    
    setLanguage(langCode) {
        if (!this.languages[langCode]) return;
        
        this.currentLanguage = langCode;
        localStorage.setItem('preferredLanguage', langCode);
        
        // Update all translatable elements
        this.updatePageText();
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('language:changed', {
            detail: { language: langCode }
        }));
    }
    
    updatePageText() {
        const translations = this.translations[this.currentLanguage];
        
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }
    
    createLanguageSelector() {
        const container = document.getElementById('language-selector');
        if (!container) return;
        
        container.innerHTML = `
            <div class="language-dropdown">
                <button class="current-language">
                    <span class="flag">${this.getFlag(this.currentLanguage)}</span>
                    <span>${this.languages[this.currentLanguage]}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="language-options">
                    ${Object.entries(this.languages).map(([code, name]) => `
                        <button class="language-option ${code === this.currentLanguage ? 'active' : ''}" 
                                data-lang="${code}">
                            <span class="flag">${this.getFlag(code)}</span>
                            ${name}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add event listeners
        container.querySelector('.current-language').addEventListener('click', (e) => {
            e.stopPropagation();
            container.querySelector('.language-options').classList.toggle('show');
        });
        
        container.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', () => {
                const langCode = option.dataset.lang;
                this.setLanguage(langCode);
                container.querySelector('.language-options').classList.remove('show');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            container.querySelector('.language-options').classList.remove('show');
        });
    }
    
    getFlag(langCode) {
        const flags = {
            'en': '🇬🇧',
            'pcm': '🇳🇬',
            'yo': '🇳🇬',
            'ig': '🇳🇬',
            'ha': '🇳🇬'
        };
        return flags[langCode] || '🌐';
    }
    
    t(key, fallback = '') {
        return this.translations[this.currentLanguage]?.[key] || 
               this.translations.en?.[key] || 
               fallback;
    }
}

// ===== MAIN APP INITIALIZATION =====
class EnhancedWhatsCookingApp {
    constructor() {
        this.state = new EnhancedAppState();
        this.cookingMode = new EnhancedCookingMode();
        this.search = new EnhancedSearch();
        this.mealPlanner = new NigerianMealPlanner();
        this.achievements = new CookingAchievements();
        this.localization = new NigerianLocalization();
        
        this.init();
    }
    
    init() {
        console.log('🍳 Enhanced What\'s Cooking App Initializing...');
        
        // Initialize components
        this.setupTheme();
        this.setupEventListeners();
        this.setupServiceWorker();
        this.setupAnalytics();
        
        // Load initial data
        this.loadFeaturedRecipes();
        this.updateShoppingBadge();
        this.showWelcomeNotification();
        
        console.log('✅ Enhanced App Initialized Successfully!');
    }
    
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Watch for system theme changes
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeMediaQuery.addEventListener('change', (e) => {
            if (localStorage.getItem('theme') === 'auto') {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
        
        // Auto theme option
        document.getElementById('auto-theme')?.addEventListener('click', () => {
            localStorage.setItem('theme', 'auto');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        });
        
        // Navigation
        this.setupNavigation();
        
        // Recipe card interactions
        this.setupRecipeCardInteractions();
        
        // Shopping list updates
        this.setupShoppingListUpdates();
        
        // Meal planner
        this.setupMealPlanner();
    }
    
    setupNavigation() {
        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    }
    
    setupRecipeCardInteractions() {
        // Use event delegation for dynamic recipe cards
        document.addEventListener('click', (e) => {
            // Save recipe button
            if (e.target.closest('.save-recipe-btn')) {
                const button = e.target.closest('.save-recipe-btn');
                const recipeCard = button.closest('.recipe-card');
                const recipeId = recipeCard?.dataset.recipeId;
                
                if (recipeId) {
                    this.toggleSaveRecipe(recipeId, button);
                }
            }
            
            // View recipe button
            if (e.target.closest('.view-recipe-btn')) {
                const button = e.target.closest('.view-recipe-btn');
                const recipeCard = button.closest('.recipe-card');
                const recipeId = recipeCard?.dataset.recipeId;
                
                if (recipeId) {
                    this.showRecipeDetails(recipeId);
                }
            }
            
            // Cook now button
            if (e.target.closest('.cook-now-btn')) {
                const button = e.target.closest('.cook-now-btn');
                const recipeCard = button.closest('.recipe-card');
                const recipeId = recipeCard?.dataset.recipeId;
                
                if (recipeId) {
                    this.startCookingMode(recipeId);
                }
            }
        });
    }
    
    toggleSaveRecipe(recipeId, button) {
        const isSaved = this.state.savedRecipes.includes(recipeId);
        
        if (isSaved) {
            // Remove from saved
            this.state.savedRecipes = this.state.savedRecipes.filter(id => id !== recipeId);
            button.innerHTML = '<i class="far fa-bookmark"></i>';
            this.showToast('Recipe removed from saved', 'info');
        } else {
            // Add to saved
            this.state.savedRecipes.push(recipeId);
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
            this.showToast('Recipe saved!', 'success');
            
            // Check for achievement
            if (this.state.savedRecipes.length >= 10) {
                this.achievements.unlockAchievement('recipeCollector', 'Recipe Collector');
            }
        }
        
        // Update localStorage
        localStorage.setItem('savedRecipes', JSON.stringify(this.state.savedRecipes));
        
        // Animate button
        button.classList.add('bounce');
        setTimeout(() => button.classList.remove('bounce'), 300);
    }
    
    async showRecipeDetails(recipeId) {
        // Show loading
        this.showLoading();
        
        try {
            // Fetch recipe details
            const recipe = await this.fetchRecipeDetails(recipeId);
            
            // Show in modal
            this.showRecipeModal(recipe);
        } catch (error) {
            console.error('Failed to load recipe details:', error);
            this.showToast('Failed to load recipe details', 'error');
        } finally {
            this.hideLoading();
        }
    }
    
    async fetchRecipeDetails(recipeId) {
        // Try multiple sources
        const sources = [
            this.fetchFromThemealDB(recipeId),
            this.fetchFromLocalDatabase(recipeId),
            this.fetchFromSpoonacular(recipeId)
        ];
        
        for (const source of sources) {
            try {
                const recipe = await source;
                if (recipe) return recipe;
            } catch (error) {
                console.warn('Source failed:', error);
            }
        }
        
        throw new Error('Recipe not found');
    }
    
    async fetchFromThemealDB(recipeId) {
        const response = await fetch(`${CONFIG.API.THEMEALDB}/lookup.php?i=${recipeId}`);
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
            const meal = data.meals[0];
            return {
                id: meal.idMeal,
                title: meal.strMeal,
                description: meal.strInstructions,
                image: meal.strMealThumb,
                category: meal.strCategory,
                area: meal.strArea,
                ingredients: this.extractIngredients(meal),
                instructions: this.formatInstructions(meal.strInstructions),
                tags: [meal.strCategory, meal.strArea].filter(Boolean)
            };
        }
        
        return null;
    }
    
    extractIngredients(meal) {
        const ingredients = [];
        
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            
            if (ingredient && ingredient.trim()) {
                ingredients.push(`${measure} ${ingredient}`.trim());
            }
        }
        
        return ingredients;
    }
    
    formatInstructions(instructions) {
        if (!instructions) return [];
        
        return instructions
            .split('\n')
            .filter(step => step.trim())
            .map(step => step.trim());
    }
    
    showRecipeModal(recipe) {
        const modal = document.createElement('div');
        modal.className = 'recipe-modal';
        
        // Calculate additional info
        const spiceLevel = RecipeIntelligence.calculateSpiceLevel(recipe);
        const cost = RecipeIntelligence.estimateCost(recipe.ingredients || []);
        const substitutions = recipe.ingredients?.map(ing => 
            RecipeIntelligence.suggestNigerianAlternatives(ing)
        ).filter(Boolean) || [];
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                
                <div class="recipe-modal-header">
                    <div class="recipe-image-large">
                        <img src="${recipe.image}" alt="${recipe.title}">
                    </div>
                    
                    <div class="recipe-info">
                        <h1>${recipe.title}</h1>
                        
                        <div class="recipe-meta">
                            <span class="meta-item">
                                <i class="fas fa-clock"></i>
                                ${recipe.prepTime || 30} min
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-signal"></i>
                                ${recipe.difficulty || 'Medium'}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-pepper-hot"></i>
                                ${'🌶️'.repeat(spiceLevel)}
                            </span>
                            <span class="meta-item">
                                <i class="fas fa-users"></i>
                                ${recipe.servings || 4} servings
                            </span>
                        </div>
                        
                        <div class="recipe-actions">
                            <button class="action-btn primary cook-now-modal">
                                <i class="fas fa-play"></i> Start Cooking
                            </button>
                            <button class="action-btn save-recipe-modal">
                                <i class="far fa-bookmark"></i> Save
                            </button>
                            <button class="action-btn share-recipe">
                                <i class="fas fa-share"></i> Share
                            </button>
                            <button class="action-btn add-to-list">
                                <i class="fas fa-cart-plus"></i> Add to List
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="recipe-modal-tabs">
                    <button class="modal-tab active" data-tab="ingredients">Ingredients</button>
                    <button class="modal-tab" data-tab="instructions">Instructions</button>
                    <button class="modal-tab" data-tab="nutrition">Nutrition</button>
                    <button class="modal-tab" data-tab="tips">Tips & Subs</button>
                </div>
                
                <div class="recipe-modal-content">
                    <div class="tab-pane active" id="ingredients-tab">
                        <div class="ingredients-section">
                            <h3>Ingredients</h3>
                            <ul class="ingredients-list">
                                ${(recipe.ingredients || []).map((ing, index) => `
                                    <li class="ingredient-item" data-index="${index}">
                                        <input type="checkbox" id="ing-${index}">
                                        <label for="ing-${index}">${ing}</label>
                                        ${RecipeIntelligence.isInSeason(ing) ? 
                                            '<span class="season-badge">In Season</span>' : ''}
                                    </li>
                                `).join('')}
                            </ul>
                            
                            <div class="cost-estimate-large">
                                <h4>Estimated Cost:</h4>
                                <div class="cost-breakdown">
                                    <span class="total-cost">₦${cost.total}</span>
                                    <span class="per-serving">₦${cost.perServing} per serving</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="instructions-tab">
                        <div class="instructions-section">
                            <h3>Instructions</h3>
                            <ol class="instructions-list">
                                ${(recipe.instructions || []).map((step, index) => `
                                    <li class="instruction-step">
                                        <div class="step-number">${index + 1}</div>
                                        <div class="step-content">${step}</div>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="nutrition-tab">
                        <div class="nutrition-section">
                            <h3>Nutrition Facts</h3>
                            <div class="nutrition-grid">
                                <div class="nutrition-item">
                                    <span class="nutrition-label">Calories</span>
                                    <span class="nutrition-value">${Math.floor(Math.random() * 400) + 200}</span>
                                </div>
                                <div class="nutrition-item">
                                    <span class="nutrition-label">Protein</span>
                                    <span class="nutrition-value">${Math.floor(Math.random() * 30) + 10}g</span>
                                </div>
                                <div class="nutrition-item">
                                    <span class="nutrition-label">Carbs</span>
                                    <span class="nutrition-value">${Math.floor(Math.random() * 50) + 20}g</span>
                                </div>
                                <div class="nutrition-item">
                                    <span class="nutrition-label">Fat</span>
                                    <span class="nutrition-value">${Math.floor(Math.random() * 25) + 5}g</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-pane" id="tips-tab">
                        <div class="tips-section">
                            <h3>Smart Tips & Substitutions</h3>
                            
                            ${substitutions.length > 0 ? `
                                <div class="substitutions-section">
                                    <h4>Nigerian Alternatives:</h4>
                                    ${substitutions.map(sub => `
                                        <div class="substitution-item">
                                            <div class="original">${sub.original}</div>
                                            <div class="alternatives">
                                                ${sub.alternatives.map(alt => `
                                                    <span class="alternative-tag">${alt}</span>
                                                `).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            
                            <div class="cooking-tips">
                                <h4>Cooking Tips:</h4>
                                <ul>
                                    <li>Use fresh ingredients for best flavor</li>
                                    <li>Adjust spice level to your preference</li>
                                    <li>Don't overcook vegetables to preserve nutrients</li>
                                    <li>Let soups/stews simmer for deeper flavor</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        this.setupRecipeModalEvents(modal, recipe);
    }
    
    setupRecipeModalEvents(modal, recipe) {
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });
        
        // Tab switching
        modal.querySelectorAll('.modal-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                // Update active tab
                modal.querySelectorAll('.modal-tab').forEach(t => 
                    t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding content
                modal.querySelectorAll('.tab-pane').forEach(pane => 
                    pane.classList.remove('active'));
                modal.querySelector(`#${tabName}-tab`).classList.add('active');
            });
        });
        
        // Cook now button
        modal.querySelector('.cook-now-modal').addEventListener('click', () => {
            this.startCookingMode(recipe.id);
            modal.remove();
        });
        
        // Save recipe button
        modal.querySelector('.save-recipe-modal').addEventListener('click', (e) => {
            const isSaved = this.state.savedRecipes.includes(recipe.id);
            
            if (isSaved) {
                this.state.savedRecipes = this.state.savedRecipes.filter(id => id !== recipe.id);
                e.target.innerHTML = '<i class="far fa-bookmark"></i> Save';
                this.showToast('Recipe removed from saved', 'info');
            } else {
                this.state.savedRecipes.push(recipe.id);
                e.target.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
                this.showToast('Recipe saved!', 'success');
            }
            
            localStorage.setItem('savedRecipes', JSON.stringify(this.state.savedRecipes));
        });
        
        // Share recipe button
        modal.querySelector('.share-recipe').addEventListener('click', () => {
            this.shareRecipe(recipe);
        });
        
        // Add to shopping list
        modal.querySelector('.add-to-list').addEventListener('click', () => {
            this.addIngredientsToList(recipe.ingredients || [], recipe.title);
            modal.remove();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }
    
    startCookingMode(recipeId) {
        // For demo, show a placeholder
        this.showToast('Cooking mode would start here', 'info');
        
        // In full implementation:
        // 1. Fetch recipe details
        // 2. Initialize cooking mode
        // 3. Show full-screen cooking interface
    }
    
    shareRecipe(recipe) {
        const shareData = {
            title: recipe.title,
            text: `Check out this recipe for ${recipe.title} on What's Cooking!`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .catch(() => {
                    // Fallback to copy link
                    this.copyRecipeLink(recipe);
                });
        } else {
            this.copyRecipeLink(recipe);
        }
    }
    
    copyRecipeLink(recipe) {
        const url = `${window.location.origin}/recipe/${recipe.id}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                this.showToast('Link copied to clipboard!', 'success');
            })
            .catch(() => {
                this.showToast('Failed to copy link', 'error');
            });
    }
    
    addIngredientsToList(ingredients, recipeName) {
        const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
        
        ingredients.forEach(ingredient => {
            shoppingList.push({
                ingredient,
                recipe: recipeName,
                purchased: false,
                addedAt: new Date().toISOString()
            });
        });
        
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        
        // Update badge
        this.updateShoppingBadge();
        
        this.showToast(`${ingredients.length} ingredients added to shopping list`, 'success');
    }
    
    updateShoppingBadge() {
        const shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
        const unpurchasedCount = shoppingList.filter(item => !item.purchased).length;
        
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            badge.textContent = unpurchasedCount;
            badge.style.display = unpurchasedCount > 0 ? 'flex' : 'none';
        }
    }
    
    setupShoppingListUpdates() {
        // Listen for shopping list updates
        document.addEventListener('shopping:updated', () => {
            this.updateShoppingBadge();
        });
    }
    
    setupMealPlanner() {
        // Initialize meal planner UI
        const mealPlanBtn = document.getElementById('meal-plan-btn');
        if (mealPlanBtn) {
            mealPlanBtn.addEventListener('click', () => {
                this.showMealPlanner();
            });
        }
    }
    
    showMealPlanner() {
        const modal = document.createElement('div');
        modal.className = 'meal-planner-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>Weekly Meal Planner</h2>
                
                <div class="meal-planner-grid">
                    ${Object.entries(this.mealPlanner.weekPlan).map(([date, day]) => `
                        <div class="day-card" data-date="${date}">
                            <div class="day-header">
                                <h3>${day.dayName}</h3>
                                <span class="date">${new Date(date).toLocaleDateString()}</span>
                            </div>
                            
                            <div class="meals">
                                <div class="meal-slot breakfast">
                                    <h4>Breakfast</h4>
                                    ${day.meals.breakfast ? `
                                        <div class="assigned-meal">
                                            <span>${day.meals.breakfast.title}</span>
                                            <button class="remove-meal">&times;</button>
                                        </div>
                                    ` : `
                                        <button class="assign-meal">+ Add meal</button>
                                    `}
                                </div>
                                
                                <div class="meal-slot lunch">
                                    <h4>Lunch</h4>
                                    ${day.meals.lunch ? `
                                        <div class="assigned-meal">
                                            <span>${day.meals.lunch.title}</span>
                                            <button class="remove-meal">&times;</button>
                                        </div>
                                    ` : `
                                        <button class="assign-meal">+ Add meal</button>
                                    `}
                                </div>
                                
                                <div class="meal-slot dinner">
                                    <h4>Dinner</h4>
                                    ${day.meals.dinner ? `
                                        <div class="assigned-meal">
                                            <span>${day.meals.dinner.title}</span>
                                            <button class="remove-meal">&times;</button>
                                        </div>
                                    ` : `
                                        <button class="assign-meal">+ Add meal</button>
                                    `}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="planner-summary">
                    <div class="summary-item">
                        <span class="label">Total Meals:</span>
                        <span class="value">${Object.values(this.mealPlanner.weekPlan).reduce((total, day) => 
                            total + Object.values(day.meals).filter(Boolean).length, 0)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Estimated Cost:</span>
                        <span class="value">₦${this.mealPlanner.budget.toLocaleString()}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Shopping Items:</span>
                        <span class="value">${this.mealPlanner.shoppingList.length}</span>
                    </div>
                </div>
                
                <div class="planner-actions">
                    <button class="btn-secondary" id="export-whatsapp">
                        <i class="fab fa-whatsapp"></i> Export to WhatsApp
                    </button>
                    <button class="btn-primary" id="generate-shopping-list">
                        Generate Shopping List
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        this.setupMealPlannerEvents(modal);
    }
    
    setupMealPlannerEvents(modal) {
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        // Export to WhatsApp
        modal.querySelector('#export-whatsapp').addEventListener('click', () => {
            this.mealPlanner.exportToWhatsApp();
        });
        
        // Generate shopping list
        modal.querySelector('#generate-shopping-list').addEventListener('click', () => {
            this.showShoppingList();
            modal.remove();
        });
        
        // Add meal buttons
        modal.querySelectorAll('.assign-meal').forEach(button => {
            button.addEventListener('click', (e) => {
                const mealSlot = e.target.closest('.meal-slot');
                const dayCard = mealSlot.closest('.day-card');
                const mealType = mealSlot.classList[1]; // breakfast, lunch, or dinner
                const date = dayCard.dataset.date;
                
                this.showMealSelector(date, mealType);
            });
        });
        
        // Remove meal buttons
        modal.querySelectorAll('.remove-meal').forEach(button => {
            button.addEventListener('click', (e) => {
                const assignedMeal = e.target.closest('.assigned-meal');
                const mealSlot = assignedMeal.closest('.meal-slot');
                const dayCard = mealSlot.closest('.day-card');
                const mealType = mealSlot.classList[1];
                const date = dayCard.dataset.date;
                
                this.mealPlanner.addMeal(date, mealType, null);
                this.showMealPlanner(); // Refresh
            });
        });
    }
    
    showMealSelector(date, mealType) {
        // Show recipe selector modal
        const modal = document.createElement('div');
        modal.className = 'meal-selector-modal';
        
        // In real implementation, this would show a list of recipes
        // For demo, just show a simple message
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>Select a Recipe</h2>
                <p>Recipe selector would appear here</p>
                <button class="btn-primary demo-select">Select Demo Recipe</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        modal.querySelector('.demo-select').addEventListener('click', () => {
            // Add a demo recipe
            const demoRecipe = {
                id: 'demo-001',
                title: 'Jollof Rice',
                prepTime: 45,
                ingredients: ['rice', 'tomatoes', 'onions', 'pepper']
            };
            
            this.mealPlanner.addMeal(date, mealType, demoRecipe);
            modal.remove();
            this.showMealPlanner(); // Refresh meal planner
        });
    }
    
    showShoppingList() {
        const modal = document.createElement('div');
        modal.className = 'shopping-list-modal';
        
        const marketGroups = this.mealPlanner.generateShoppingListByMarket();
        
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <h2>Shopping List by Market</h2>
                
                <div class="shopping-lists">
                    ${Object.entries(marketGroups).map(([market, items]) => `
                        <div class="market-section">
                            <h3>${market}</h3>
                            <ul class="market-items">
                                ${items.map(item => `
                                    <li class="shopping-item">
                                        <input type="checkbox" id="item-${item.ingredient}" 
                                               ${item.purchased ? 'checked' : ''}>
                                        <label for="item-${item.ingredient}">
                                            ${item.ingredient}
                                            <span class="quantity">${item.quantity}</span>
                                        </label>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="shopping-actions">
                    <button class="btn-secondary" id="clear-list">
                        Clear All
                    </button>
                    <button class="btn-primary" id="export-list">
                        <i class="fab fa-whatsapp"></i> Share List
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        modal.querySelector('#export-list').addEventListener('click', () => {
            this.mealPlanner.exportToWhatsApp();
        });
        
        modal.querySelector('#clear-list').addEventListener('click', () => {
            if (confirm('Clear entire shopping list?')) {
                this.mealPlanner.shoppingList = [];
                modal.remove();
            }
        });
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registered:', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            console.log('ServiceWorker update found!');
                            
                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New update available
                                    this.showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.log('ServiceWorker registration failed:', error);
                    });
            });
        }
    }
    
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <p>A new version is available!</p>
            <button class="btn-sm" id="reload-page">Refresh</button>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('#reload-page').addEventListener('click', () => {
            window.location.reload();
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }
    
    setupAnalytics() {
        // Basic analytics tracking
        window.addEventListener('load', () => {
            this.trackEvent('page_view', 'home');
        });
        
        // Track recipe views
        document.addEventListener('recipe:viewed', (e) => {
            this.trackEvent('recipe_view', e.detail.recipeId);
        });
        
        // Track cooking sessions
        document.addEventListener('cooking:started', (e) => {
            this.trackEvent('cooking_started', e.detail.recipeId);
        });
        
        document.addEventListener('cooking:ended', () => {
            this.trackEvent('cooking_completed');
        });
    }
    
    trackEvent(eventName, eventData = null) {
        // In production, send to analytics service
        console.log('Analytics:', eventName, eventData);
        
        // Store locally for basic insights
        const analytics = JSON.parse(localStorage.getItem('appAnalytics')) || [];
        analytics.push({
            event: eventName,
            data: eventData,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 events
        if (analytics.length > 100) {
            analytics.shift();
        }
        
        localStorage.setItem('appAnalytics', JSON.stringify(analytics));
    }
    
    async loadFeaturedRecipes() {
        const container = document.getElementById('featured-recipes');
        if (!container) return;
        
        // Show loading skeleton
        container.innerHTML = `
            <div class="skeleton-grid">
                ${Array(6).fill().map(() => `
                    <div class="skeleton-card">
                        <div class="skeleton-image"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text short"></div>
                    </div>
                `).join('')}
            </div>
        `;
        
        try {
            // Fetch from TheMealDB
            const response = await fetch(`${CONFIG.API.THEMEALDB}/search.php?s=`);
            const data = await response.json();
            
            // Also fetch Nigerian recipes from local database
            const nigerianRecipes = this.getNigerianRecipes();
            
            // Combine and shuffle
            const allRecipes = [
                ...(data.meals || []).slice(0, 4),
                ...nigerianRecipes.slice(0, 2)
            ].sort(() => Math.random() - 0.5);
            
            // Render recipes
            container.innerHTML = `
                <div class="featured-grid">
                    ${allRecipes.map(recipe => this.createFeaturedCard(recipe)).join('')}
                </div>
            `;
            
            // Add event listeners
            this.setupFeaturedCardEvents();
            
        } catch (error) {
            console.error('Failed to load featured recipes:', error);
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load recipes</p>
                    <button class="btn-secondary" id="retry-loading">
                        Try Again
                    </button>
                </div>
            `;
            
            document.getElementById('retry-loading')?.addEventListener('click', () => {
                this.loadFeaturedRecipes();
            });
        }
    }
    
    getNigerianRecipes() {
        // Return sample Nigerian recipes
        return [
            {
                id: 'ng-jollof',
                strMeal: 'Jollof Rice',
                strMealThumb: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
                strCategory: 'Rice',
                strArea: 'Nigerian',
                prepTime: 45,
                difficulty: 'Medium',
                tags: ['nigerian', 'rice', 'main', 'party']
            },
            {
                id: 'ng-egusi',
                strMeal: 'Egusi Soup',
                strMealThumb: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
                strCategory: 'Soup',
                strArea: 'Nigerian',
                prepTime: 60,
                difficulty: 'Medium',
                tags: ['nigerian', 'soup', 'traditional']
            }
        ];
    }
    
    createFeaturedCard(recipe) {
        const title = recipe.strMeal || recipe.title || 'Nigerian Recipe';
        const image = recipe.strMealThumb || recipe.image || 'https://via.placeholder.com/300x200?text=Food';
        const category = recipe.strCategory || recipe.category || 'Nigerian';
        const prepTime = recipe.prepTime || 30;
        
        return `
            <div class="featured-card" data-recipe-id="${recipe.id || recipe.idMeal}">
                <div class="featured-image">
                    <img src="${image}" alt="${title}" loading="lazy">
                    ${recipe.strArea === 'Nigerian' || recipe.tags?.includes('nigerian') ? `
                        <span class="featured-badge">🇳🇬 Nigerian</span>
                    ` : ''}
                </div>
                <div class="featured-content">
                    <h3>${title}</h3>
                    <div class="featured-meta">
                        <span>${category}</span>
                        <span>•</span>
                        <span>${prepTime} min</span>
                    </div>
                    <button class="featured-action">
                        View Recipe <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    setupFeaturedCardEvents() {
        document.querySelectorAll('.featured-card').forEach(card => {
            const viewBtn = card.querySelector('.featured-action');
            const recipeId = card.dataset.recipeId;
            
            viewBtn.addEventListener('click', () => {
                this.showRecipeDetails(recipeId);
            });
            
            // Also make the whole card clickable
            card.addEventListener('click', (e) => {
                if (!viewBtn.contains(e.target)) {
                    this.showRecipeDetails(recipeId);
                }
            });
        });
    }
    
    showWelcomeNotification() {
        // Show on first visit
        const firstVisit = !localStorage.getItem('hasVisited');
        
        if (firstVisit) {
            setTimeout(() => {
                this.showToast('Welcome to What\'s Cooking! Explore Nigerian recipes 🍛', 'info', 5000);
                localStorage.setItem('hasVisited', 'true');
            }, 1000);
        }
    }
    
    showToast(message, type = 'info', duration = 3000) {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    showLoading() {
        let loader = document.getElementById('app-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'app-loader';
            loader.className = 'app-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    }
    
    hideLoading() {
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.classList.remove('active');
        }
    }
}

// ===== INITIALIZE ENHANCED APP =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize enhanced app
    window.enhancedApp = new EnhancedWhatsCookingApp();
    
    // Initialize achievements
    window.achievements = new CookingAchievements();
    
    // Initialize localization
    window.localization = new NigerianLocalization();
    
    // Make key components globally accessible
    window.RecipeIntelligence = RecipeIntelligence;
    window.EnhancedCookingMode = EnhancedCookingMode;
    window.NigerianMealPlanner = NigerianMealPlanner;
    
    console.log('🚀 Enhanced What\'s Cooking App Ready!');
});

// ===== PROGRESSIVE WEB APP FEATURES =====
// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw-enhanced.js')
            .then(registration => {
                console.log('Enhanced ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('Enhanced ServiceWorker registration failed:', error);
            });
    });
}

// Handle app install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', () => {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted install');
                } else {
                    console.log('User dismissed install');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Detect when app is installed
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    
    // Hide install button
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'none';
    }
    
    // Track installation
    if (window.enhancedApp) {
        window.enhancedApp.trackEvent('pwa_installed');
    }
});

// Handle offline/online status
window.addEventListener('online', () => {
    document.documentElement.classList.remove('offline');
    if (window.enhancedApp) {
        window.enhancedApp.showToast('You\'re back online!', 'success');
    }
});

window.addEventListener('offline', () => {
    document.documentElement.classList.add('offline');
    if (window.enhancedApp) {
        window.enhancedApp.showToast('You\'re offline. Some features may be limited.', 'warning');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedWhatsCookingApp,
        RecipeIntelligence,
        EnhancedCookingMode,
        NigerianMealPlanner,
        CookingAchievements,
        NigerianLocalization,
        VisualDesignSystem
    };
}