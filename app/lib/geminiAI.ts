// app/lib/geminiAI.ts
const GEMINI_API_KEY = 'AIzaSyDzHhHhNNuDNlOl3T_P9g0ovti5qZ333Ak';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const getAyurvedicAIResponse = async (userMessage: string): Promise<string> => {
  console.log('🔑 API Key check:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  console.log('🌐 Full URL:', GEMINI_URL);
  
  const prompt = `You are Dr. Vaidya, an Ayurvedic expert with 30+ years of experience in medicinal plants and traditional Indian medicine.

User Question: "${userMessage}"

Provide a concise, helpful response (max 300 words) covering:
1. Sanskrit & botanical name
2. Key Ayurvedic properties (dosha effects, rasa, virya)
3. Traditional uses & benefits
4. Preparation method (churna, kwath, etc.)
5. Dosage & timing
6. Important contraindications/safety notes

Use emojis and conversational tone. Start with "🙏 Namaste!" 

Example: "🙏 Namaste! Tulsi (Ocimum sanctum), 'Vishnu Priya' in Sanskrit, is tridoshic - balances all doshas. Chew 2-3 fresh leaves at sunrise or prepare kwath (5-7 leaves boiled). Enhances immunity, purifies blood. Safe for all ages. Avoid during pregnancy in large amounts."

Be concise, authentic, and practical.`;

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Full API Response:', JSON.stringify(data, null, 2));
    
    // Check if we have candidates array
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      console.error('❌ No candidates in response:', data);
      throw new Error(`No candidates in response: ${JSON.stringify(data)}`);
    }
    
    // Check if first candidate has content
    const candidate = data.candidates[0];
    if (!candidate || !candidate.content) {
      console.error('❌ No content in first candidate:', candidate);
      throw new Error(`No content in candidate: ${JSON.stringify(candidate)}`);
    }
    
    // Handle different response formats
    const content = candidate.content;
    console.log('🔍 Content structure:', JSON.stringify(content, null, 2));
    
    // Check if content has parts (new format)
    if (content.parts && Array.isArray(content.parts) && content.parts.length > 0) {
      console.log('✅ Found parts array with', content.parts.length, 'parts');
      const firstPart = content.parts[0];
      console.log('🔍 First part:', JSON.stringify(firstPart, null, 2));
      
      if (firstPart && firstPart.text) {
        console.log('✅ Found text in first part:', firstPart.text.substring(0, 50) + '...');
        return firstPart.text;
      }
    }
    
    // Check if content has direct text (alternative format)
    if (content.text) {
      console.log('✅ Found direct text in content');
      return content.text;
    }
    
    // Check if candidate has direct text (another format)
    if (candidate.text) {
      console.log('✅ Found direct text in candidate');
      return candidate.text;
    }
    
    // Check if there's a finishReason - but still try to get content first
    if (candidate.finishReason) {
      console.log('🛡️ Finish reason:', candidate.finishReason);
      
      // For SAFETY, return error message
      if (candidate.finishReason === 'SAFETY') {
        return "I apologize, but I cannot provide information on that topic due to safety guidelines. Please try asking about specific medicinal plants like Tulsi, Neem, or Turmeric.";
      }
      
      // For MAX_TOKENS or STOP, we should still have content - don't return early
      // Just log it and continue to extract the content
      if (candidate.finishReason === 'MAX_TOKENS') {
        console.log('⚠️ Response hit max tokens, but continuing to extract content...');
      }
    }
    
    // If content only has role, it might be an empty response - check for other fields
    console.error('❌ Unexpected content structure:', content);
    console.error('❌ Full candidate:', JSON.stringify(candidate, null, 2));
    throw new Error(`No usable content found. Content: ${JSON.stringify(content)}`);
  } catch (error) {
    console.error('Gemini AI error:', error);
    
    // Fallback response
    return `🌿 I'm Dr. Vaidya, your Ayurvedic expert! I'm currently experiencing some technical difficulties, but I'd love to help you with your plant medicine questions. 

Try asking me about:
• Benefits and uses of specific herbs (Tulsi, Neem, Ashwagandha, Turmeric)
• Traditional preparation methods
• Dosages and safety guidelines
• Historical significance of plants

Please try your question again in a moment! 🙏`;
  }
};

// Helper function for quick plant info
export const getQuickPlantInfo = (plantName: string): string => {
  const quickFacts: { [key: string]: string } = {
    tulsi: "🙏 **Tulsi (Ocimum sanctum)** - *Sanskrit: Vishnu Priya* \n\n🌿 **The Sacred Queen of Herbs** - Tridoshic (balances Vata, Pitta, Kapha)\n\n**Traditional Use:** Chew 2-3 fresh leaves on empty stomach at sunrise, or prepare as kwath (decoction) - 5-7 leaves boiled in water.\n\n**Benefits:** Enhances Ojas (vital essence), purifies blood, strengthens respiratory system, calms Vata dosha.\n\n**Seasonal:** Especially beneficial during Varsha ritu (monsoon) for immunity. Safe for all ages.",
    
    cardamom: "🌿 **Cardamom (Elettaria cardamomum)** - *Sanskrit: Ela* \n\n✨ **The Queen of Spices** - Tridoshic with special affinity for Kapha\n\n**Traditional Use:** Chew 1-2 pods after meals, or add to warm milk. Prepare Elaichi chai for digestive fire (Agni).\n\n**Benefits:** Enhances Agni, freshens breath, supports heart health, balances Kapha dosha.\n\n**Seasonal:** Perfect during Shishir ritu (winter) for warming digestive fire. Excellent for post-meal digestion.",
    
    ashwagandha: "💪 **Ashwagandha (Withania somnifera)** - *Sanskrit: Ashwagandha (Horse's Strength)* \n\n🌙 **The Ultimate Rasayana** - Especially beneficial for Vata dosha\n\n**Traditional Use:** 1-3g churna with warm ghee and milk before bed. Best taken during Brahma muhurta or evening.\n\n**Benefits:** Builds Ojas, reduces Vata disorders, enhances Bala (strength), promotes restful sleep.\n\n**Contraindications:** Avoid during pregnancy, acute illness, or with stimulants. Not for Pitta excess.",
    
    turmeric: "✨ **Turmeric (Curcuma longa)** - *Sanskrit: Haridra (Golden Goddess)* \n\n🔥 **Sacred Golden Healer** - Tridoshic with special power for Kapha and Pitta\n\n**Traditional Use:** 1/4 tsp with warm milk and ghee (Haldi doodh), or as paste with honey. Take with black pepper for absorption.\n\n**Benefits:** Purifies Rakta dhatu (blood tissue), reduces Ama (toxins), enhances skin glow, supports liver.\n\n**Seasonal:** Excellent during Vasant ritu (spring) for detoxification. Caution with blood-thinning medications."
  };

  return quickFacts[plantName.toLowerCase()] || `🙏 Namaste! I'd be delighted to share the traditional Ayurvedic wisdom about ${plantName}. Please ask me specific questions about its uses, preparations, or benefits according to our ancient healing tradition.`;
};

export interface RetreatItinerary {
  title: string;
  tagline: string;
  day1: { title: string; activities: string[]; };
  day2: { title: string; activities: string[]; };
  day3: { title: string; activities: string[]; };
}

export const generateWellnessRetreat = async (
  dosha: string,
  goal: string,
  location: string,
  herb: string
): Promise<RetreatItinerary> => {
  // Get current month and season
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  
  // Map month to Ayurvedic season (Ritucharya)
  const getAyurvedicSeason = (month: string): string => {
    const seasonMap: { [key: string]: string } = {
      'January': 'Shishir (Late Winter)',
      'February': 'Shishir (Late Winter)',
      'March': 'Vasant (Spring)',
      'April': 'Vasant (Spring)',
      'May': 'Grishma (Summer)',
      'June': 'Grishma (Summer)',
      'July': 'Varsha (Monsoon)',
      'August': 'Varsha (Monsoon)',
      'September': 'Sharad (Autumn)',
      'October': 'Sharad (Autumn)',
      'November': 'Hemant (Early Winter)',
      'December': 'Hemant (Early Winter)'
    };
    return seasonMap[month] || 'Grishma (Summer)';
  };
  
  const ritucharya = getAyurvedicSeason(currentMonth);

  const prompt = `You are an expert AYUSH wellness concierge with access to a vast database of global knowledge. Create a highly personalized, 3-day wellness itinerary in real-time based on the user's profile and the current season.

**User Profile:**
- Primary Dosha: ${dosha}
- Wellness Goal: ${goal}
- Preferred Location: ${location}
- Current Month: ${currentMonth}

**Seasonal Context (Ritucharya):**
- The current month is ${currentMonth}. According to Ayurveda, this is part of the ${ritucharya} season. The plan must include advice to balance the body during this time.

**CRITICAL Climate & Dosha Compatibility Guidelines:**
1. **Kapha Dosha + Cold/Winter Climate:** If the user has Kapha dosha and the location has cold weather in ${currentMonth}, you MUST:
   - Recommend warming activities (hot stone therapy, steam baths, vigorous yoga)
   - Suggest spicy, warming foods (ginger tea, black pepper, cinnamon)
   - Include indoor heated spaces for activities
   - Avoid cold water activities or early morning outdoor sessions
   - Focus on energizing, heating practices

2. **Pitta Dosha + Hot/Summer Climate:** If the user has Pitta dosha and the location has hot weather in ${currentMonth}, you MUST:
   - Recommend cooling activities (moonlight walks, water features, gentle yoga)
   - Suggest cooling foods (coconut water, cucumber, mint)
   - Schedule activities during cooler parts of the day (early morning, evening)
   - Include shaded garden areas and air-conditioned spaces
   - Focus on calming, cooling practices

3. **Vata Dosha + Windy/Dry Climate:** If the user has Vata dosha and the location has dry/windy weather in ${currentMonth}, you MUST:
   - Recommend grounding activities (oil massage, warm baths, gentle walks)
   - Suggest warm, moist foods (soups, stews, warm milk)
   - Include sheltered, calm environments
   - Avoid high-altitude or very windy outdoor activities
   - Focus on stabilizing, warming practices

**Climate-Smart Planning:**
- Consider the actual weather conditions in ${location} during ${currentMonth}
- Adjust activity timing to avoid extreme temperatures
- Recommend appropriate clothing and preparation
- Suggest indoor alternatives when weather conflicts with dosha needs

**Instructions:**
1. **Find Real Locations:** You must find and include:
   - One real, well-known botanical garden (Day 2)
   - One real, certified AYUSH center (Day 3)
   - Real wellness resorts, yoga studios, spas, or retreat centers for Day 1 activities
   - All located within the user's preferred location (${location})

2. **CRITICAL - Every Activity MUST Include a Specific Location:**
   - ❌ WRONG: "Vigorous indoor yoga session"
   - ✅ CORRECT: "Vigorous yoga at Ayurvedic Healing Village, Coorg"
   - ❌ WRONG: "Guided forest bathing"
   - ✅ CORRECT: "Forest bathing at Mercara Gold Estate trails"
   - Always mention WHERE the activity happens (resort name, spa name, studio name, trail name, etc.)

3. **Be Specific:** Provide the full name and city for every location.
4. **Create a 3-Day Plan:** The itinerary must balance the user's Dosha and be appropriate for the current season.
5. **JSON Format Only:** You must respond ONLY in a valid JSON format. 
   - NO markdown code blocks
   - NO trailing commas
   - NO line breaks in strings
   - Use proper escaping for quotes
   - Do not add any extra text before or after the JSON

**JSON Response Structure (CRITICAL: Keep activities SHORT and POWERFUL):**
{
  "title": "A catchy, personalized title",
  "tagline": "A short, inspiring tagline",
  "day1": {
    "title": "Day theme (3-5 words)",
    "activities": [
      "Morning: [Activity] at [Specific Resort/Spa Name] in [City]",
      "Afternoon: [Activity] at [Specific Studio/Location Name]",
      "Evening: [Activity] at [Specific Venue Name]"
    ]
  },
  "day2": {
    "title": "Day theme (3-5 words)",
    "activities": [
      "Morning: Visit [Botanical Garden Full Name] in [City] - [2-3 word specialty]",
      "Afternoon: [Activity] at [Specific Location]",
      "Evening: [Activity] at [Specific Venue]"
    ]
  },
  "day3": {
    "title": "Day theme (3-5 words)",
    "activities": [
      "Morning: Consultation at [AYUSH Center Full Name] in [City] - [2-3 word specialty]",
      "Afternoon: [Treatment Name] at [Center Name]",
      "Evening: [Activity] at [Venue Name]"
    ]
  }
}

EXAMPLE (FOLLOW THIS FORMAT):
"Morning: Yoga at Ayurvedic Healing Village in Coorg"
"Afternoon: Forest walk at Mercara Gold Estate trails"
"Evening: Tea ceremony at Orange County Resort"

CRITICAL RULES:
- Each activity: MAX 15 words
- No long explanations
- Use powerful, action-oriented language
- Focus on WHAT and WHERE, not WHY
- Be specific but brief`;

  try {
    console.log('🚀 Generating wellness retreat...');
    
    // Using gemini-2.5-flash which is confirmed available
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          role: "user", 
          parts: [{ text: prompt }] 
        }],
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 4096,
          topK: 40,
          topP: 0.95
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 API Response:', JSON.stringify(data, null, 2));
    
    // Check for safety blocks or other issues
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      throw new Error('Content was blocked by safety filters. Please try different inputs.');
    }
    
    // Check for max tokens issue
    if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      console.error('❌ Response was cut off due to token limit');
      throw new Error('AI response was too long and got cut off. Please try again with a simpler request.');
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error('❌ No text in response:', data);
      console.error('❌ Finish reason:', data.candidates?.[0]?.finishReason);
      throw new Error('No response from AI. Please try again.');
    }

    console.log('📝 AI Response Text:', text);

    // Try to extract JSON from the response (handle markdown code blocks)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').replace(/```/g, '');
    
    // Extract JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('❌ No JSON found in text:', text);
      throw new Error('AI response was not in the expected format. Please try again.');
    }

    let cleanJson = jsonMatch[0];
    
    // Aggressive JSON cleaning
    // Remove trailing commas before closing braces/brackets
    cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1');
    // Remove any control characters and zero-width spaces
    cleanJson = cleanJson.replace(/[\x00-\x1F\x7F\u200B-\u200D\uFEFF]/g, '');
    // Fix common quote issues
    cleanJson = cleanJson.replace(/[\u2018\u2019]/g, "'"); // Smart single quotes
    cleanJson = cleanJson.replace(/[\u201C\u201D]/g, '"'); // Smart double quotes
    // Remove any non-breaking spaces
    cleanJson = cleanJson.replace(/\u00A0/g, ' ');
    
    console.log('🧹 Cleaned JSON:', cleanJson);

    let itinerary: RetreatItinerary;
    try {
      itinerary = JSON.parse(cleanJson);
    } catch (parseError: any) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('❌ Problematic JSON:', cleanJson);
      console.error('❌ Character at error position:', cleanJson.charAt(2522));
      console.error('❌ Context around error:', cleanJson.substring(2510, 2535));
      
      // Try one more time with even more aggressive cleaning
      try {
        // Replace all quotes with standard ones
        const ultraClean = cleanJson
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'")
          .replace(/\s+/g, ' '); // Normalize all whitespace
        
        console.log('🔧 Trying ultra-clean version...');
        itinerary = JSON.parse(ultraClean);
        console.log('✅ Ultra-clean parse succeeded!');
      } catch (secondError) {
        throw new Error(`Failed to parse AI response: ${parseError.message}. Please try again.`);
      }
    }
    
    console.log('✅ Parsed itinerary:', itinerary);
    
    return itinerary;
  } catch (error) {
    console.error('❌ Retreat generation error:', error);
    throw error;
  }
};
