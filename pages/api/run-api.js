import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Gemini Pro model
const genAI = new GoogleGenerativeAI(process.env.APIKEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { selectedCards, readingType, zodiacSign, selectedCard } = req.body;
    console.log('API Received Data:', { selectedCards, readingType, zodiacSign, selectedCard });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = '';
    
    if (readingType === 'love-fortune') {
      // Love Fortune by Zodiac Sign prompt
      prompt = `
      You are an expert in tarot and astrology. A person with the zodiac sign ${zodiacSign} has drawn the ${selectedCard} card to see their love fortune.
      Please interpret this person's love fortune for the year in detail, connecting the tarot card with their zodiac characteristics.

      Please include the following in your interpretation:

      # Current Love Energy
      [Current love fortune and emotional state of ${zodiacSign}]

      # Love Fortune for the Year
      [Major love opportunities or changes coming this year]
      [Periods or situations that need special attention]

      # Best Times for Finding Love
      [Favorable periods considering zodiac fortune]

      # Compatible Zodiac Signs
      [Zodiac signs that could be particularly compatible with ${zodiacSign}]

      # Advice for Improving Love Fortune
      [Practical advice based on the tarot card's message]

      Please write in a friendly and warm tone, and end with a hopeful message.
      Please keep the response within 500 characters including spaces.
      `;
    } else if (readingType === 'zodiac-spread') {
      console.log('Processing Zodiac Spread'); 
      if (!Array.isArray(selectedCards) || selectedCards.length !== 12) {
        return res.status(400).json({ message: "12 cards are required" });
      }

      prompt = `
        You are a professional tarot reader. Please interpret the 12-house zodiac spread in a kind and warm tone.

        Selected cards:
        1. Aries (Self/Identity): ${selectedCards[0]}
        2. Taurus (Values/Resources): ${selectedCards[1]}
        3. Gemini (Communication/Knowledge): ${selectedCards[2]}
        4. Cancer (Home/Emotions): ${selectedCards[3]}
        5. Leo (Creativity/Self-expression): ${selectedCards[4]}
        6. Virgo (Work/Health): ${selectedCards[5]}
        7. Libra (Relationships/Balance): ${selectedCards[6]}
        8. Scorpio (Transformation/Rebirth): ${selectedCards[7]}
        9. Sagittarius (Philosophy/Travel): ${selectedCards[8]}
        10. Capricorn (Career/Goals): ${selectedCards[9]}
        11. Aquarius (Friends/Hopes): ${selectedCards[10]}
        12. Pisces (Spirituality/Potential): ${selectedCards[11]}

        Please interpret in the following format:

        # Overall Energy Flow
        [Explanation of the general pattern and energy of the cards]

        # Interpretation by Major Areas
        ## Personal Sphere (Houses 1-3)
        [Messages from cards about self, values, and communication]

        ## Emotional Sphere (Houses 4-6)
        [Messages about home, creativity, and daily life]

        ## Relationship Sphere (Houses 7-9)
        [Messages about relationships, transformation, and expansion]

        ## Social and Spiritual (Houses 10-12)
        [Messages about social achievement, community, and inner growth]

        # Overall Advice
        [General advice and positive message]

        Please write the response in English and keep it within 900 characters including spaces.
        `;
    } else if (readingType === 'past-present-future') {
      if (!Array.isArray(selectedCards) || selectedCards.length !== 3) {
        return res.status(400).json({ message: "3 cards are required" });
      }

      prompt = `
        You are a professional tarot reader. Please interpret the tarot cards in a kind and warm tone.

        Selected cards:
        Card 1 (Past): ${selectedCards[0]}
        Card 2 (Present): ${selectedCards[1]}
        Card 3 (Future): ${selectedCards[2]}

        Please analyze the meaning of each card and the relationships between them to provide insightful advice.
        Format your response as follows:

        # Overall Flow
        [Overall flow and meaning of the cards in 2-3 sentences]

        # Detailed Interpretation by Time
        ## Past: ${selectedCards[0]}
        [Past influences and meanings]

        ## Present: ${selectedCards[1]}
        [Current situation and challenges]

        ## Future: ${selectedCards[2]}
        [Future direction and advice]

        # Overall Advice
        [General advice and positive message]

        Please write the response in English and keep it within 700 characters including spaces.
        `;
    } else {
      return res.status(400).json({ message: "Invalid reading type" });
    }

    console.log('Generated prompt:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI Response:', text.substring(0, 100) + '...');

    return res.status(200).json({ reading: text });
  } catch (error) {
    console.error("Detailed error information:", error);
    return res.status(500).json({ message: "An error occurred during the tarot reading" });
  }
}
