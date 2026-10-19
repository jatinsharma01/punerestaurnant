import { Drink, DrinkCategory } from "@/types/drink";

export const CATEGORIES: DrinkCategory[] = [
  "Coffee",
  "Iced Coffee",
  "Tea",
  "Matcha",
  "Fresh Juices",
  "Milkshakes",
  "Mocktails",
  "Refreshers",
];

export const EDITORIAL_ASSETS = {
  heroDrink: {
    url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1200&auto=format&fit=crop",
    alt: "Handcrafted cold brew with rich crema and ice in a minimalist glass",
  },
  coffeeBarInterior: {
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1920&auto=format&fit=crop",
    alt: "Warm minimalist coffee bar interior with ambient lighting and espresso station",
  },
  cafeInterior: {
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm minimalist Pour Club café interior with natural timber and clean lines",
  },
  baristaCraft: {
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    alt: "Pour Club barista precisely preparing an espresso extraction",
  },
  outletExterior: {
    url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
    alt: "Modern street front café terrace in Pune",
  },
  drinksFlatLay: {
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    alt: "Top-down aesthetic of iced beverages on warm textured stone",
  },
};

export const DRINKS_DATA: Drink[] = [
  {
    id: "classic-iced-latte",
    slug: "classic-iced-latte",
    name: "Classic Iced Latte",
    category: "Iced Coffee",
    tagline: "Double shot espresso, chilled milk, pure balance.",
    description:
      "Locally roasted Indian Arabica pulled into a double shot, poured gently over chilled whole milk and crystal ice. Clean, balanced, and invigorating.",
    basePrice: 179,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
    alt: "Classic Iced Latte served in a tall clear glass with layers of milk and espresso",
    prepTimeMinutes: 4,
    popular: true,
    signature: true,
    inStock: true,
    caffeineLevel: "High",
    tastingNotes: ["Dark Chocolate", "Roasted Hazelnut", "Silky Cream"],
    sizes: [
      { id: "regular", name: "Regular", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "475ml", priceModifier: 40 },
    ],
    availableSugarLevels: ["Unsweetened (0%)", "Less Sweet (50%)", "Standard (100%)"],
    availableIceLevels: ["Less Ice", "Standard Ice", "Extra Chill"],
    customizationGroups: [
      {
        id: "milk-type",
        name: "Milk Choice",
        required: false,
        type: "single",
        options: [
          { id: "regular-milk", name: "Standard Whole Milk", price: 0 },
          { id: "oat-milk", name: "Barista Oat Milk", price: 45 },
          { id: "almond-milk", name: "Creamy Almond Milk", price: 45 },
        ],
      },
      {
        id: "espresso-boost",
        name: "Espresso Additions",
        required: false,
        type: "multiple",
        options: [
          { id: "extra-shot", name: "Extra Espresso Shot (+30ml)", price: 40 },
          { id: "vanilla-syrup", name: "Madagascar Vanilla Bean", price: 30 },
        ],
      },
    ],
  },
  {
    id: "spanish-latte",
    slug: "spanish-latte",
    name: "Spanish Latte",
    category: "Iced Coffee",
    tagline: "Velvety espresso with sweetened condensed milk.",
    description:
      "A rich, comforting favourite. Double espresso fused with artisanal condensed milk and cold textured whole milk. Decadent, smooth, and gently sweet.",
    basePrice: 199,
    image:
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=800&auto=format&fit=crop",
    alt: "Spanish Latte with rich condensed milk swirl and iced espresso layer",
    prepTimeMinutes: 5,
    popular: true,
    inStock: true,
    caffeineLevel: "High",
    tastingNotes: ["Caramelized Milk", "Espresso Crema", "Vanilla Undertone"],
    sizes: [
      { id: "regular", name: "Regular", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "475ml", priceModifier: 45 },
    ],
    availableSugarLevels: ["Subtle Sweet", "Standard (Classic)", "Extra Indulgent"],
    availableIceLevels: ["Standard Ice", "Less Ice"],
    customizationGroups: [
      {
        id: "espresso-boost",
        name: "Additions",
        required: false,
        type: "multiple",
        options: [
          { id: "extra-shot", name: "Extra Ristretto Shot", price: 40 },
          { id: "cinnamon-dust", name: "Ceylon Cinnamon Dusting", price: 15 },
        ],
      },
    ],
  },
  {
    id: "cold-brew",
    slug: "cold-brew",
    name: "Signature Cold Brew",
    category: "Coffee",
    tagline: "18-hour slow steeped, remarkably smooth.",
    description:
      "Single-origin Chikmagalur Arabica steeped cold for 18 hours. Ultra-low acidity with rich notes of dark cacao and dried black cherry.",
    basePrice: 189,
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    alt: "Pure cold brew coffee over clear slow-melting ice cubes",
    prepTimeMinutes: 2,
    signature: true,
    inStock: true,
    caffeineLevel: "High",
    tastingNotes: ["Black Cherry", "Dark Cacao", "Smoked Toffee"],
    sizes: [
      { id: "regular", name: "Regular", volume: "330ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "450ml", priceModifier: 40 },
    ],
    availableIceLevels: ["Clear Block Ice (Standard)", "Light Ice", "Without Ice"],
    customizationGroups: [
      {
        id: "cold-brew-style",
        name: "Serving Finish",
        required: false,
        type: "single",
        options: [
          { id: "black", name: "Pure Black (Recommended)", price: 0 },
          { id: "sweet-cream", name: "Cold Sweet Cream Float", price: 35 },
          { id: "tonic-splash", name: "Artisanal Tonic Splash", price: 40 },
        ],
      },
    ],
  },
  {
    id: "caramel-macchiato",
    slug: "caramel-macchiato",
    name: "Caramel Macchiato",
    category: "Coffee",
    tagline: "Steamed vanilla milk marked with bold espresso.",
    description:
      "Freshly pulled espresso 'marks' textured milk infused with vanilla bean syrup, finished with a generous drizzle of house-cooked salted butter caramel.",
    basePrice: 219,
    image:
      "https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=800&auto=format&fit=crop",
    alt: "Caramel Macchiato with distinct foam top and warm caramel lattice drizzle",
    prepTimeMinutes: 5,
    popular: true,
    inStock: true,
    caffeineLevel: "Medium",
    tastingNotes: ["Salted Caramel", "Bourbon Vanilla", "Toasted Pecan"],
    sizes: [
      { id: "regular", name: "Regular", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "475ml", priceModifier: 40 },
    ],
    availableSugarLevels: ["Half Sweet", "Standard (100%)", "Extra Sweet"],
    customizationGroups: [
      {
        id: "milk-choice",
        name: "Milk Preference",
        required: false,
        type: "single",
        options: [
          { id: "regular-milk", name: "Standard Whole Milk", price: 0 },
          { id: "oat-milk", name: "Oat Milk", price: 45 },
          { id: "skim-milk", name: "Skimmed Light Milk", price: 0 },
        ],
      },
      {
        id: "toppings",
        name: "Toppings & Extra",
        required: false,
        type: "multiple",
        options: [
          { id: "extra-caramel", name: "Extra House Caramel Drizzle", price: 25 },
          { id: "extra-shot", name: "Double Espresso Shot", price: 40 },
        ],
      },
    ],
  },
  {
    id: "matcha-latte",
    slug: "matcha-latte",
    name: "Ceremonial Matcha Latte",
    category: "Matcha",
    tagline: "Stone-ground Uji matcha whisked with silky milk.",
    description:
      "First-harvest ceremonial grade Japanese matcha whisked with traditional bamboo chasen, paired with creamy milk and lightly sweetened with organic agave.",
    basePrice: 229,
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
    alt: "Vibrant emerald green ceremonial matcha latte in a ceramic cup",
    prepTimeMinutes: 4,
    signature: true,
    isNew: true,
    inStock: true,
    caffeineLevel: "Medium",
    tastingNotes: ["Sweet Umami", "Fresh Cut Grass", "Creamy Finish"],
    sizes: [
      { id: "regular", name: "Regular", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "450ml", priceModifier: 50 },
    ],
    availableSugarLevels: ["Unsweetened", "Light Agave (50%)", "Standard Agave"],
    availableIceLevels: ["Iced (Standard)", "Hot Steamed", "Light Ice"],
    customizationGroups: [
      {
        id: "milk-choice",
        name: "Milk Alternative",
        required: false,
        type: "single",
        options: [
          { id: "oat-milk", name: "Oat Milk (Barista recommended)", price: 45 },
          { id: "regular-milk", name: "Whole Milk", price: 0 },
          { id: "coconut-milk", name: "Coconut Milk", price: 40 },
        ],
      },
      {
        id: "matcha-strength",
        name: "Intensity",
        required: false,
        type: "single",
        options: [
          { id: "standard-matcha", name: "Standard (2g Ceremonial)", price: 0 },
          { id: "double-whisk", name: "Intense Double Whisk (+2g)", price: 55 },
        ],
      },
    ],
  },
  {
    id: "masala-chai",
    slug: "masala-chai",
    name: "Pour Club Masala Chai",
    category: "Tea",
    tagline: "Assam golden CTC brewed with hand-crushed spices.",
    description:
      "Strong Assam whole-leaf tea slow-simmered with freshly pounded green cardamom, ginger root, cloves, and black pepper. Authentic, warming, and comforting.",
    basePrice: 99,
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop",
    alt: "Steaming hot authentic Indian masala chai poured in a traditional glass",
    prepTimeMinutes: 3,
    inStock: true,
    caffeineLevel: "Medium",
    tastingNotes: ["Fresh Ginger", "Green Cardamom", "Malty Assam"],
    sizes: [
      { id: "standard", name: "Cutting Glass", volume: "180ml", priceModifier: 0 },
      { id: "large", name: "Full Kulhad", volume: "280ml", priceModifier: 30 },
    ],
    availableSugarLevels: ["Sugarless", "Less Sugar", "Classic Sweet (Standard)", "Jaggery (Gud)"],
    customizationGroups: [
      {
        id: "spice-profile",
        name: "Spice Emphasis",
        required: false,
        type: "single",
        options: [
          { id: "balanced", name: "Balanced Signature Blend", price: 0 },
          { id: "extra-adrak", name: "Extra Fresh Ginger Kick", price: 10 },
          { id: "extra-elaichi", name: "Extra Green Cardamom", price: 15 },
        ],
      },
    ],
  },
  {
    id: "fresh-lime-soda",
    slug: "fresh-lime-soda",
    name: "Sparkling Fresh Lime Soda",
    category: "Refreshers",
    tagline: "Squeezed Kagzi limes, crisp sparkling water.",
    description:
      "Freshly hand-pressed local Kagzi limes combined with sparkling mineral water, rock salt, and optional mint. A timeless Pune cooler.",
    basePrice: 119,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
    alt: "Sparkling fresh lime soda with fresh lime wheels and effervescent bubbles",
    prepTimeMinutes: 3,
    inStock: true,
    caffeineLevel: "None",
    tastingNotes: ["Crisp Citrus", "Effervescent", "Zesty Mineral"],
    sizes: [
      { id: "regular", name: "Standard", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large Refresher", volume: "500ml", priceModifier: 30 },
    ],
    availableSugarLevels: ["Sweet & Salt (Classic)", "Pure Salted", "Pure Sweet"],
    availableIceLevels: ["Standard Ice", "Extra Chill", "No Ice"],
    customizationGroups: [
      {
        id: "infusions",
        name: "Fresh Infusions",
        required: false,
        type: "multiple",
        options: [
          { id: "crushed-mint", name: "Crushed Garden Mint", price: 15 },
          { id: "roasted-cumin", name: "Roasted Jeera Pinch", price: 10 },
        ],
      },
    ],
  },
  {
    id: "watermelon-cooler",
    slug: "watermelon-cooler",
    name: "Watermelon Mint Cooler",
    category: "Fresh Juices",
    tagline: "Cold-pressed ripe watermelon, mint, Himalayan pink salt.",
    description:
      "100% natural, freshly cold-pressed watermelon steeped with bruised spearmint leaves and a crystal touch of Himalayan pink salt. Pure hydration.",
    basePrice: 149,
    image:
      "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?q=80&w=800&auto=format&fit=crop",
    alt: "Ruby red cold-pressed watermelon cooler with fresh mint sprig and ice",
    prepTimeMinutes: 4,
    popular: true,
    inStock: true,
    caffeineLevel: "None",
    tastingNotes: ["Crisp Melon", "Cool Mint", "Himalayan Mineral"],
    sizes: [
      { id: "regular", name: "Bottle (330ml)", volume: "330ml", priceModifier: 0 },
      { id: "large", name: "Bottle (500ml)", volume: "500ml", priceModifier: 40 },
    ],
    availableSugarLevels: ["No Added Sugar (Natural Fruit)", "Touch of Honey"],
    availableIceLevels: ["Chilled Over Ice", "Chilled Bottled (No Ice)"],
  },
  {
    id: "mango-smoothie",
    slug: "mango-smoothie",
    name: "Alphonso Mango Smoothie",
    category: "Milkshakes",
    tagline: "Ratnagiri Alphonso mango pulp, Greek yogurt, cardamom.",
    description:
      "Thick, luscious smoothie blended with pure Ratnagiri Alphonso pulp, artisanal hung curd, a touch of wildflower honey, and fragrant crushed cardamom.",
    basePrice: 189,
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=800&auto=format&fit=crop",
    alt: "Rich golden Alphonso mango smoothie in a modern glass with crushed pistachios",
    prepTimeMinutes: 5,
    popular: true,
    isNew: true,
    inStock: true,
    caffeineLevel: "None",
    tastingNotes: ["Ripe Alphonso", "Silky Curd", "Wild Honey"],
    sizes: [
      { id: "regular", name: "Regular", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "450ml", priceModifier: 40 },
    ],
    customizationGroups: [
      {
        id: "toppings",
        name: "Smoothie Boosters",
        required: false,
        type: "multiple",
        options: [
          { id: "chia-seeds", name: "Organic Chia Seeds", price: 20 },
          { id: "roasted-almonds", name: "Toasted Almond Slivers", price: 25 },
        ],
      },
    ],
  },
  {
    id: "chocolate-milkshake",
    slug: "chocolate-milkshake",
    name: "Belgian Dark Chocolate Shake",
    category: "Milkshakes",
    tagline: "70% Belgian chocolate ganache, double cream gelato.",
    description:
      "Rich 70% dark Belgian cocoa ganache churned with artisanal vanilla bean dairy ice cream and cold whole milk. Deep, velvety, and not overly sweet.",
    basePrice: 199,
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800&auto=format&fit=crop",
    alt: "Decadent dark chocolate milkshake with chocolate curls and textured cream",
    prepTimeMinutes: 5,
    inStock: true,
    caffeineLevel: "Low",
    tastingNotes: ["Dark Cocoa", "Fudge", "Toasted Buttercream"],
    sizes: [
      { id: "regular", name: "Standard", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "475ml", priceModifier: 50 },
    ],
    customizationGroups: [
      {
        id: "shake-toppings",
        name: "Indulgence Add-ons",
        required: false,
        type: "multiple",
        options: [
          { id: "whipped-cream", name: "Fresh Vanilla Whipped Cream", price: 30 },
          { id: "choco-shavings", name: "Dark Chocolate Shavings", price: 20 },
          { id: "extra-espresso", name: "Mocha Shot (Espresso add-in)", price: 40 },
        ],
      },
    ],
  },
  {
    id: "virgin-mojito",
    slug: "virgin-mojito",
    name: "Artisanal Virgin Mojito",
    category: "Mocktails",
    tagline: "Muddled mint, cane sugar, lime, crisp effervescence.",
    description:
      "Fresh garden mint muddled gently with raw turbinado sugar and fresh Persian lime juice, topped with micro-carbonated soda and crushed ice.",
    basePrice: 169,
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
    alt: "Refreshing Virgin Mojito with fresh lime wedges, mint sprig, and crushed crystal ice",
    prepTimeMinutes: 4,
    inStock: true,
    caffeineLevel: "None",
    tastingNotes: ["Garden Spearmint", "Crisp Lime", "Raw Cane"],
    sizes: [
      { id: "regular", name: "Standard", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "480ml", priceModifier: 35 },
    ],
    availableSugarLevels: ["Subtle Sweet", "Standard (100%)", "No Cane Sugar"],
    availableIceLevels: ["Standard Crushed Ice", "Less Ice"],
  },
  {
    id: "berry-lemonade",
    slug: "berry-lemonade",
    name: "Wild Berry Lemonade",
    category: "Refreshers",
    tagline: "Handcrafted blackberry & raspberry reduction, freshly squeezed lemon.",
    description:
      "Slow-cooked wild berry compote folded into tart freshly squeezed lemon juice, balanced with cane nectar and chilled sparkling spring water.",
    basePrice: 159,
    image:
      "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?q=80&w=800&auto=format&fit=crop",
    alt: "Wild berry lemonade with deep ruby gradient, lemon slice, and ice crystals",
    prepTimeMinutes: 4,
    popular: true,
    inStock: true,
    caffeineLevel: "None",
    tastingNotes: ["Tart Lemon", "Wild Blackberry", "Summer Raspberry"],
    sizes: [
      { id: "regular", name: "Regular", volume: "350ml", priceModifier: 0 },
      { id: "large", name: "Large", volume: "475ml", priceModifier: 35 },
    ],
    availableSugarLevels: ["Tart (Less Sweet)", "Standard Sweet", "Sweet Boost"],
    availableIceLevels: ["Regular Ice", "Light Ice"],
    customizationGroups: [
      {
        id: "lemonade-addons",
        name: "Refresher Enhancements",
        required: false,
        type: "multiple",
        options: [
          { id: "basil-seeds", name: "Hydrated Sabja (Sweet Basil) Seeds", price: 20 },
          { id: "extra-berries", name: "Whole Berry Fruit Garnish", price: 25 },
        ],
      },
    ],
  },
];
