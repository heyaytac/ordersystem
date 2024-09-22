// menu-data.js

export const kebabShopMenu = {
  Kebab: [
    { 
      id: 1, 
      name: 'Chicken Kebab', 
      price: 8.99,
      customizations: [
        { 
          name: 'Sauce', 
          type: 'single',
          options: ['Garlic', 'Chili', 'Yogurt', 'No Sauce'] 
        },
        { 
          name: 'Add-ons', 
          type: 'multiple',
          options: ['Extra Meat', 'Cheese', 'Vegetables'], 
          extraCost: 1.00 
        },
        { 
          name: 'Remove Ingredients', 
          type: 'multiple',
          options: ['Onions', 'Tomatoes', 'Lettuce'] 
        },
      ],
    },
    { 
      id: 2, 
      name: 'Lamb Kebab', 
      price: 9.99,
      customizations: [
        { 
          name: 'Sauce', 
          type: 'single',
          options: ['Garlic', 'Chili', 'Yogurt', 'No Sauce'] 
        },
        { 
          name: 'Add-ons', 
          type: 'multiple',
          options: ['Extra Meat', 'Cheese', 'Vegetables'], 
          extraCost: 1.00 
        },
        { 
          name: 'Remove Ingredients', 
          type: 'multiple',
          options: ['Onions', 'Tomatoes', 'Lettuce'] 
        },
      ],
    },
  ],
  Pizza: [
    { 
      id: 3, 
      name: 'Margherita', 
      price: 10.99,
      customizations: [
        { 
          name: 'Size', 
          type: 'single',
          options: ['Small', 'Medium', 'Large'],
          priceModifier: { 'Small': -2.00, 'Medium': 0.00, 'Large': 2.00 },
        },
        { 
          name: 'Crust', 
          type: 'single',
          options: ['Thin', 'Regular', 'Stuffed Crust'],
          priceModifier: { 'Thin': 0.00, 'Regular': 0.00, 'Stuffed Crust': 2.50 },
        },
        { 
          name: 'Extra Toppings', 
          type: 'multiple',
          options: ['Extra Cheese', 'Mushrooms', 'Olives', 'Basil'],
          extraCost: 1.50,
        },
      ],
    },
    { 
      id: 4, 
      name: 'Pepperoni', 
      price: 12.99,
      customizations: [
        { 
          name: 'Size', 
          type: 'single',
          options: ['Small', 'Medium', 'Large'],
          priceModifier: { 'Small': -2.00, 'Medium': 0.00, 'Large': 2.00 },
        },
        { 
          name: 'Crust', 
          type: 'single',
          options: ['Thin', 'Regular', 'Stuffed Crust'],
          priceModifier: { 'Thin': 0.00, 'Regular': 0.00, 'Stuffed Crust': 2.50 },
        },
        { 
          name: 'Extra Toppings', 
          type: 'multiple',
          options: ['Extra Cheese', 'Mushrooms', 'Olives', 'Onions'],
          extraCost: 1.50,
        },
      ],
    },
  ],
  Salads: [
    { 
      id: 5, 
      name: 'Greek Salad', 
      price: 7.99,
      customizations: [
        { 
          name: 'Dressing', 
          type: 'single',
          options: ['Vinaigrette', 'Ranch', 'No Dressing'],
        },
        { 
          name: 'Add-ons', 
          type: 'multiple',
          options: ['Grilled Chicken', 'Avocado', 'Feta Cheese'],
          extraCost: 2.00,
        },
        { 
          name: 'Remove Ingredients', 
          type: 'multiple',
          options: ['Olives', 'Feta Cheese', 'Cucumbers'],
        },
      ],
    },
    { 
      id: 6, 
      name: 'Caesar Salad', 
      price: 8.99,
      customizations: [
        { 
          name: 'Dressing', 
          type: 'single',
          options: ['Caesar', 'Ranch', 'No Dressing'],
        },
        { 
          name: 'Add-ons', 
          type: 'multiple',
          options: ['Grilled Chicken', 'Bacon Bits', 'Parmesan Cheese'],
          extraCost: 2.00,
        },
        { 
          name: 'Remove Ingredients', 
          type: 'multiple',
          options: ['Croutons', 'Parmesan Cheese'],
        },
      ],
    },
  ],
  Pide: [
    { 
      id: 7, 
      name: 'Cheese Pide', 
      price: 9.99,
      customizations: [
        { 
          name: 'Size', 
          type: 'single',
          options: ['Regular', 'Large'],
          priceModifier: { 'Regular': 0.00, 'Large': 2.00 },
        },
        { 
          name: 'Add-ons', 
          type: 'multiple',
          options: ['Extra Cheese', 'Spicy Peppers', 'Olives'],
          extraCost: 1.00,
        },
        { 
          name: 'Remove Ingredients', 
          type: 'multiple',
          options: ['Tomatoes', 'Bell Peppers'],
        },
      ],
    },
    { 
      id: 8, 
      name: 'Meat Pide', 
      price: 11.99,
      customizations: [
        { 
          name: 'Size', 
          type: 'single',
          options: ['Regular', 'Large'],
          priceModifier: { 'Regular': 0.00, 'Large': 2.00 },
        },
        { 
          name: 'Add-ons', 
          type: 'multiple',
          options: ['Extra Meat', 'Spicy Peppers', 'Cheese'],
          extraCost: 1.50,
        },
        { 
          name: 'Remove Ingredients', 
          type: 'multiple',
          options: ['Onions', 'Tomatoes'],
        },
      ],
    },
  ],
  Drinks: [
    { 
      id: 9, 
      name: 'Cola', 
      price: 2.99,
      customizations: [
        { 
          name: 'Size', 
          type: 'single',
          options: ['Small', 'Medium', 'Large'],
          priceModifier: { 'Small': -0.50, 'Medium': 0.00, 'Large': 0.50 },
        },
        { 
          name: 'Ice', 
          type: 'single',
          options: ['No Ice', 'Less Ice', 'Regular Ice'],
        },
      ],
    },
    { 
      id: 10, 
      name: 'Water', 
      price: 1.99,
      customizations: [
        { 
          name: 'Size', 
          type: 'single',
          options: ['Small', 'Medium', 'Large'],
          priceModifier: { 'Small': -0.50, 'Medium': 0.00, 'Large': 0.50 },
        },
        { 
          name: 'Temperature', 
          type: 'single',
          options: ['Cold', 'Room Temperature'],
        },
      ],
    },
  ],
};