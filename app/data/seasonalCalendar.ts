// app/data/seasonalCalendar.ts
export const ayurvedicSeasons = {
  vasant: {
    name: "Vasant (Spring)",
    months: [2, 3, 4], // ≈ mid-Feb → mid-Apr
    characteristics: "Kapha season - warming & detoxifying",
    element: "🌸",
    colors: ["#10b981", "#059669"],
    recommendedHerbs: [
      {
        plant: "tulsi",
        name: "Tulsi (Holy Basil)",
        reason: "Respiratory health, immunity boost",
        preparation: "Fresh tulsi tea with honey",
        timing: "Morning",
        dosage: "2-3 fresh leaves or 1 cup tea",
        benefits: ["Boosts immunity", "Clears respiratory tract", "Reduces stress"]
      },
      {
        plant: "turmeric", 
        name: "Turmeric (Haldi)",
        reason: "Anti-inflammatory, liver detox",
        preparation: "Golden milk with black pepper",
        timing: "Evening before bed",
        dosage: "1 tsp powder with warm milk",
        benefits: ["Liver detoxification", "Anti-inflammatory", "Skin glow"]
      },
      {
        plant: "cardamom",
        name: "Cardamom (Elaichi)",
        reason: "Digestive aid, breath freshener",
        preparation: "Cardamom tea or chew pods",
        timing: "After meals",
        dosage: "2-3 pods or 1 cup tea",
        benefits: ["Digestive health", "Fresh breath", "Heart health"]
      }
    ],
    lifestyle: [
      "Eat light, warm foods",
      "Practice regular exercise",
      "Avoid heavy, oily foods",
      "Wake up with sunrise"
    ],
    clothing: {
      fabrics: ["Light cotton", "Breathable linen", "Soft khadi"],
      colors: ["Bright colors", "Yellow", "Orange", "Pink"],
      style: "Light layers that can be removed as day warms",
      avoid: "Heavy woolens, synthetic fabrics"
    },
    dailyRoutine: {
      wakeTime: "Before sunrise (5:30-6:00 AM)",
      exercise: "Vigorous exercise, yoga, brisk walking",
      meals: "Light breakfast, moderate lunch, early light dinner",
      sleep: "Early to bed (10:00 PM), 7-8 hours"
    },
    commonIssues: ["Allergies", "Cold & cough", "Skin problems", "Sluggish digestion"],
    festivals: [
      {
        name: "Holi",
        plantUse: "Turmeric and natural colors from flowers",
        significance: "Celebrating spring with plant-based colors",
        plants: ["turmeric", "flowers"]
      }
    ],
    weatherTriggers: {
      temperature: { min: 20, max: 30 },
      humidity: { min: 40, max: 70 },
      notifications: [
        "🌸 Spring is here! Time for Tulsi to boost your immunity",
        "🌿 Perfect weather for cardamom tea - aid your digestion naturally"
      ]
    }
  },

  grishma: {
    name: "Grishma (Summer)",
    months: [4, 5, 6], // ≈ mid-Apr → mid-Jun
    characteristics: "Pitta season - cooling & hydrating",
    element: "☀️",
    colors: ["#f59e0b", "#d97706"],
    recommendedHerbs: [
      {
        plant: "mint",
        name: "Mint (Pudina)",
        reason: "Cooling, digestive aid",
        preparation: "Fresh mint water or chutney",
        timing: "Throughout the day",
        dosage: "10-15 fresh leaves",
        benefits: ["Body cooling", "Digestive aid", "Fresh breath"]
      },
      {
        plant: "coriander",
        name: "Coriander (Dhania)",
        reason: "Cooling, detoxifying",
        preparation: "Coriander seed water",
        timing: "Night soaking, morning drink",
        dosage: "1 tsp seeds soaked overnight",
        benefits: ["Natural cooling", "Kidney health", "Skin soothing"]
      }
    ],
    lifestyle: [
      "Eat cooling foods like cucumber, watermelon",
      "Avoid excessive heat exposure",
      "Stay well hydrated",
      "Wear light, cotton clothing"
    ],
    clothing: {
      fabrics: ["Pure cotton", "Light muslin", "Breathable khadi"],
      colors: ["White", "Light blue", "Pastel shades", "Avoid dark colors"],
      style: "Loose-fitting, airy clothes; wide-brimmed hats",
      avoid: "Synthetic fabrics, tight clothing, dark colors"
    },
    dailyRoutine: {
      wakeTime: "Early morning (5:00-5:30 AM) before heat",
      exercise: "Early morning or evening only, swimming ideal",
      meals: "Light meals, cooling foods, avoid spicy",
      sleep: "Afternoon nap recommended, sleep in cool room"
    },
    commonIssues: ["Heat exhaustion", "Acidity", "Skin rashes", "Dehydration"],
    weatherTriggers: {
      temperature: { min: 30, max: 45 },
      notifications: [
        "☀️ Summer heat rising! Cool down with mint water",
        "🥒 Hot day ahead - try cooling coriander water"
      ]
    }
  },

  varsha: {
    name: "Varsha (Monsoon)",
    months: [6, 7, 8], // ≈ mid-Jun → mid-Aug  
    characteristics: "Vata season - immunity & digestion focus",
    element: "🌧️",
    colors: ["#3b82f6", "#1d4ed8"],
    recommendedHerbs: [
      {
        plant: "giloy",
        name: "Giloy (Guduchi)",
        reason: "Ultimate immunity booster, fever prevention",
        preparation: "Fresh giloy juice or powder with honey",
        timing: "Morning on empty stomach",
        dosage: "1-2 tsp juice or ½ tsp powder",
        benefits: ["Immunity boost", "Fever prevention", "Digestive health"]
      },
      {
        plant: "ginger",
        name: "Ginger (Adrak)",
        reason: "Digestive fire, prevents cold",
        preparation: "Ginger tea with tulsi and honey",
        timing: "Multiple times daily",
        dosage: "1-inch piece fresh or ½ tsp powder",
        benefits: ["Digestive strength", "Cold prevention", "Circulation boost"]
      },
      {
        plant: "ashwagandha",
        name: "Ashwagandha",
        reason: "Strength building, immunity",
        preparation: "Powder with warm milk and ghee",
        timing: "Before bedtime",
        dosage: "½ tsp powder",
        benefits: ["Strength building", "Stress relief", "Better sleep"]
      }
    ],
    lifestyle: [
      "Eat warm, freshly cooked foods",
      "Avoid raw foods and salads",
      "Keep digestive fire strong",
      "Stay dry and warm"
    ],
    clothing: {
      fabrics: ["Cotton with light wool blend", "Water-resistant outer layer"],
      colors: ["Warm colors", "Earth tones", "Avoid white"],
      style: "Layered clothing, waterproof footwear, umbrella",
      avoid: "Heavy wet fabrics, open footwear"
    },
    dailyRoutine: {
      wakeTime: "6:00-6:30 AM",
      exercise: "Indoor yoga, light stretching, avoid getting wet",
      meals: "Warm soups, ginger tea, avoid street food",
      sleep: "Regular schedule, keep room dry and ventilated"
    },
    commonIssues: ["Digestive problems", "Cold & flu", "Joint pain", "Fungal infections"],
    festivals: [
      {
        name: "Raksha Bandhan",
        plantUse: "Turmeric-dyed threads for protection",
        significance: "Traditional plant-based protective elements",
        plants: ["turmeric"]
      }
    ],
    weatherTriggers: {
      humidity: { min: 80, max: 95 },
      notifications: [
        "🌧️ Monsoon alert! Boost immunity with Giloy",
        "☔ Rainy season - strengthen digestion with ginger"
      ]
    }
  },

  sharad: {
    name: "Sharad (Autumn)",
    months: [8, 9, 10], // ≈ mid-Aug → mid-Oct
    characteristics: "Pitta transition - balancing season",
    element: "🍂",
    colors: ["#f59e0b", "#d97706"],
    recommendedHerbs: [
      {
        plant: "amla",
        name: "Amla (Indian Gooseberry)",
        reason: "Vitamin C powerhouse, immunity preparation",
        preparation: "Fresh amla juice or amla pickle",
        timing: "Morning",
        dosage: "1 fresh fruit or 2 tbsp juice",
        benefits: ["Vitamin C boost", "Hair health", "Eye health"]
      }
    ],
    lifestyle: [
      "Prepare body for winter",
      "Eat warming spices",
      "Maintain regular sleep schedule",
      "Practice oil massage"
    ],
    clothing: {
      fabrics: ["Medium cotton", "Light wool", "Silk blends"],
      colors: ["Warm autumn colors", "Orange", "Brown", "Gold"],
      style: "Transitional layers, light shawls for evening",
      avoid: "Very light summer wear, heavy winter clothes"
    },
    dailyRoutine: {
      wakeTime: "5:30-6:00 AM",
      exercise: "Moderate exercise, oil massage before bath",
      meals: "Balanced meals with warming spices",
      sleep: "Regular 7-8 hours, oil massage before bed"
    },
    commonIssues: ["Seasonal allergies", "Dry skin", "Joint stiffness"],
    festivals: [
      {
        name: "Diwali",
        plantUse: "Sesame oil lamps, marigold decorations",
        significance: "Traditional plant oils for health and prosperity",
        plants: ["sesame", "marigold"]
      }
    ]
  },

  shishir: {
    name: "Shishir (Pre-winter)",
    months: [10, 11, 12], // ≈ mid-Oct → mid-Dec
    characteristics: "Kapha building - nourishing season",
    element: "❄️",
    colors: ["#06b6d4", "#0891b2"],
    recommendedHerbs: [
      {
        plant: "ashwagandha",
        name: "Ashwagandha",
        reason: "Strength building for winter",
        preparation: "Powder with ghee and warm milk",
        timing: "Evening",
        dosage: "½-1 tsp powder",
        benefits: ["Winter strength", "Joint health", "Deep sleep"]
      }
    ],
    lifestyle: [
      "Eat nourishing, warm foods",
      "Practice oil massage daily",
      "Stay warm and cozy",
      "Build strength for winter"
    ],
    clothing: {
      fabrics: ["Wool", "Thick cotton", "Fleece"],
      colors: ["Warm colors", "Red", "Maroon", "Deep orange"],
      style: "Layered warm clothing, scarves, caps",
      avoid: "Light fabrics, exposed skin"
    },
    dailyRoutine: {
      wakeTime: "6:00-6:30 AM (can be slightly later)",
      exercise: "Moderate indoor exercise, oil massage",
      meals: "Nourishing warm meals, ghee, nuts",
      sleep: "8 hours, warm bedding"
    },
    commonIssues: ["Cold sensitivity", "Joint stiffness", "Low energy"]
  },

  shishira: {
    name: "Shishira (Deep Winter)",
    months: [12, 1, 2], // ≈ mid-Dec → mid-Feb
    characteristics: "Kapha season - warming & strengthening",
    element: "🌨️",
    colors: ["#06b6d4", "#0891b2"],
    recommendedHerbs: [
      {
        plant: "ginger",
        name: "Ginger (Adrak)",
        reason: "Internal heat, circulation boost",
        preparation: "Ginger powder with honey",
        timing: "Morning",
        dosage: "½ tsp powder with 1 tsp honey",
        benefits: ["Internal warming", "Better circulation", "Joint mobility"]
      }
    ],
    lifestyle: [
      "Focus on warming foods",
      "Practice heating yoga poses",
      "Use warming spices",
      "Maintain body heat"
    ],
    clothing: {
      fabrics: ["Heavy wool", "Cashmere", "Thermal wear"],
      colors: ["Dark warm colors", "Deep red", "Black", "Brown"],
      style: "Multiple warm layers, full coverage, woolen accessories",
      avoid: "Light fabrics, cotton alone, exposed areas"
    },
    dailyRoutine: {
      wakeTime: "6:30-7:00 AM (later wake acceptable)",
      exercise: "Vigorous indoor exercise, heating yoga",
      meals: "Rich warm foods, ghee, sesame oil, hot beverages",
      sleep: "8-9 hours, very warm bedding"
    },
    commonIssues: ["Cold extremities", "Sluggish metabolism", "Winter blues"]
  }
};

// Helper functions
export const getCurrentSeason = () => {
  const month = new Date().getMonth() + 1;
  
  for (const [key, season] of Object.entries(ayurvedicSeasons)) {
    if (season.months.includes(month)) {
      return { key, ...season };
    }
  }
  
  return null;
};

export const getSeasonalQuestions = (season: any) => {
  if (!season) return [];
  
  return season.recommendedHerbs.map((herb: any, index: number) => ({
    id: `seasonal_${season.key}_${index}`,
    question: `Which herb is especially beneficial during ${season.name} for ${herb.reason.toLowerCase()}?`,
    correctAnswer: herb.plant,
    options: [
      { id: herb.plant, name: herb.name, imageSrc: `/plants/${herb.plant}.jpg` },
      // Add other options from different seasons
      ...getRandomOptionsFromOtherSeasons(herb.plant, 3)
    ],
    seasonalContext: {
      season: season.name,
      timing: herb.timing,
      preparation: herb.preparation,
      benefits: herb.benefits
    }
  }));
};

const getRandomOptionsFromOtherSeasons = (excludePlant: string, count: number) => {
  const allHerbs: any[] = [];
  Object.values(ayurvedicSeasons).forEach(season => {
    season.recommendedHerbs?.forEach((herb: any) => {
      if (herb.plant !== excludePlant && !allHerbs.some((h: any) => h.plant === herb.plant)) {
        allHerbs.push(herb);
      }
    });
  });
  
  return allHerbs
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((herb: any) => ({
      id: herb.plant,
      name: herb.name,
      imageSrc: `/plants/${herb.plant}.jpg`
    }));
};
