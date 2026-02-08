# UPDATE INSTRUCTIONS - Adding African Recipes & Fixing Search

## Changes to Make:

### 1. ADD AFRICAN RECIPES FILE
- Add the `african-recipes.js` file to your project
- Load it in `index.html` BEFORE `app.js`:

```html
<script src="african-recipes.js"></script>
<script src="app.js"></script>
```

### 2. UPDATE APP.JS - Add African Recipes to Search

Find the `searchByName` or `searchWithAfricanSupport` function and update it to include African recipes:

```javascript
// Around line 195-220, UPDATE this function:
static async searchWithAfricanSupport(query) {
    // First try TheMealDB
    let results = await this.searchByName(query);
    
    // ALWAYS include African recipes in results
    const africanMatches = AFRICAN_RECIPES.filter(recipe => 
        recipe.strMeal.toLowerCase().includes(query.toLowerCase()) ||
        recipe.strArea.toLowerCase().includes(query.toLowerCase()) ||
        recipe.strTags.toLowerCase().includes(query.toLowerCase()) ||
        recipe.strCategory.toLowerCase().includes(query.toLowerCase())
    );
    
    // Combine results
    if (!results.meals) {
        results.meals = [];
    }
    results.meals = [...africanMatches, ...results.meals];
    
    return results;
}
```

### 3. REMOVE "SCAN MY FRIDGE" FEATURE

Find and REMOVE/COMMENT OUT these sections in the HTML:

```html
<!-- REMOVE THIS SECTION -->
<!--
<button class="scan-button" id="scan-fridge-btn">
    <i class="fas fa-camera"></i>
    Scan My Fridge
</button>
-->
```

In app.js, find and REMOVE/COMMENT OUT:
```javascript
// Around line 400-500, REMOVE:
// setupFridgeScanner() { ... }
// handleFridgeScan() { ... }
```

### 4. FIX SEARCH VISIBILITY

**Option A - Make search input stand out with better contrast:**

In `style.css`, find the search input styles and UPDATE:

```css
/* UPDATE THESE STYLES - Around line 500-600 */
.search-input,
#ingredient-input,
.hero-search input {
    background: #FFFFFF !important;  /* Pure white background */
    color: #1a1a1a !important;       /* Dark text */
    border: 3px solid #FF6B35 !important;  /* Bright orange border */
    padding: 1.2rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
}

.search-input::placeholder,
#ingredient-input::placeholder {
    color: #666666 !important;  /* Darker placeholder */
    opacity: 0.8;
}

.search-input:focus,
#ingredient-input:focus {
    outline: none;
    border-color: #E55A2B;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.15);
    background: #FFFFFF !important;
}

/* If search is in hero section */
.hero-section {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
```

**Option B - Add a contrasting background to the search container:**

```css
.search-container,
.hero-search {
    background: rgba(255, 255, 255, 0.95);
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}
```

### 5. UPDATE FEATURED RECIPES TO SHOW AFRICAN FIRST

In app.js, find where featured recipes load (around line 800-900):

```javascript
async displayFeaturedRecipes() {
    // Show African recipes FIRST
    const africanRecipes = AFRICAN_RECIPES.slice(0, 6);
    
    // Then add some random recipes from API
    const apiRecipes = await APIService.getMultipleRandomRecipes(6);
    
    // Combine them
    const allRecipes = [...africanRecipes, ...apiRecipes];
    
    this.renderRecipeCards(allRecipes);
}
```

### 6. ADD AFRICAN CATEGORY FILTER

In the categories/filters section, ADD:

```javascript
const categories = [
    { id: 'african', name: '🇳🇬 Nigerian & African', icon: 'fa-globe-africa' },
    { id: 'beef', name: 'Beef', icon: 'fa-drumstick-bite' },
    // ... other categories
];
```

And add filter logic:

```javascript
filterByCategory(categoryId) {
    if (categoryId === 'african') {
        this.renderRecipeCards(AFRICAN_RECIPES);
    } else {
        // existing logic for other categories
    }
}
```

## Testing Checklist:

- [ ] African recipes appear in search results
- [ ] Can search for "Jollof" and see Jollof Rice
- [ ] Can search for "Nigerian" and see all Nigerian recipes
- [ ] "Scan My Fridge" button is removed
- [ ] Search input is clearly visible (white with orange border)
- [ ] Search input doesn't blend into background
- [ ] Featured section shows some African recipes
- [ ] African category filter works
- [ ] All 10 African recipes are accessible

## Quick CSS Fix for Search Visibility:

If you just want to quickly fix the search visibility issue, add this at the END of your `style.css`:

```css
/* SEARCH VISIBILITY FIX */
.search-input,
.hero-search input,
#ingredient-input,
input[type="text"][placeholder*="ingredient"],
input[type="text"][placeholder*="recipe"] {
    background-color: #FFFFFF !important;
    color: #000000 !important;
    border: 3px solid #FF6B35 !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
}

.search-input::placeholder,
.hero-search input::placeholder,
#ingredient-input::placeholder {
    color: #555555 !important;
    opacity: 1 !important;
}
```

## Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Verify `african-recipes.js` is loaded before `app.js`
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Make sure AFRICAN_RECIPES array is accessible globally

---

**Summary of Changes:**
✅ 10 Nigerian & African recipes added  
✅ Recipes integrate with existing search  
✅ "Scan My Fridge" feature removed  
✅ Search input made highly visible  
✅ African category filter added  
