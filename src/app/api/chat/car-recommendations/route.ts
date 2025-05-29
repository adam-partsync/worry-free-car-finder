import { type NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Message {
  type: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory: Message[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory }: ChatRequest = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // If OpenAI API key is not configured, use intelligent fallback
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using intelligent fallback');
      const fallbackResponse = generateFallbackResponse(message, conversationHistory);
      const baseResponse = `💡 **Smart Fallback** - OpenAI API quota exceeded, using intelligent car recommendations\n\n${fallbackResponse}`;
      const enhancedResponse = addSearchButtons(baseResponse);
      return NextResponse.json({ response: enhancedResponse });
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Build conversation history for context
      const messages = [
        {
          role: 'system' as const,
          content: `You are a UK car expert helping people find used cars. You should:

1. Provide specific car model recommendations with realistic UK market prices
2. Include year ranges, typical mileage, and why each car matches their needs
3. Consider reliability, running costs, insurance, and practicality
4. Use realistic UK pricing (£8k-£35k for most used cars)
5. Mention specific dealers or car buying advice when relevant
6. Be conversational and helpful
7. Always ask follow-up questions to better understand their needs

Keep responses helpful but concise (2-3 paragraphs max). Focus on actionable advice.`
        },
        // Add conversation history
        ...conversationHistory.slice(-6).map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
        // Add current message
        {
          role: 'user' as const,
          content: message
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Add search buttons to car recommendations
      const enhancedResponse = addSearchButtons(response);
      return NextResponse.json({ response: enhancedResponse });

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      // Fall back to intelligent response
      const fallbackResponse = generateFallbackResponse(message);
      return NextResponse.json({ response: fallbackResponse });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(message: string, conversationHistory: Message[] = []): string {
  const lowerMessage = message.toLowerCase();

  // Specific responses for example queries
  if (lowerMessage.includes('small cheap reliable car under £3000') || (lowerMessage.includes('small') && lowerMessage.includes('cheap') && lowerMessage.includes('3000'))) {
    return `Great choice for a budget! Here are the best reliable cars under £3000:

**🏆 Top Pick: Toyota Yaris (2006-2010)** - £2k-£3k
- Bulletproof reliability, Toyota quality
- Very cheap to run and insure
- Perfect size for city driving

**💰 Best Value: Skoda Fabia (2007-2011)** - £2.5k-£3k
- VW engineering at lower price
- Surprisingly spacious inside
- Good reliability record

**🛡️ Most Reliable: Honda Jazz (2004-2008)** - £2k-£2.8k
- Honda's legendary reliability
- Excellent visibility and safety
- Low running costs

**🚗 Alternative: Ford Fiesta (2008-2012)** - £2.2k-£3k
- Fun to drive, good availability
- Cheap parts and servicing
- Popular choice for good reason

All these should have good service history. Would you like me to give you specific things to check when viewing any of these models?`;
  }

  if (lowerMessage.includes('sporty 2 seater that\'s cheap to run') || (lowerMessage.includes('sporty') && lowerMessage.includes('2 seater') && lowerMessage.includes('cheap to run'))) {
    return `Perfect combo of fun and economy! Here are the best sporty 2-seaters that won't break the bank:

**🏁 Top Choice: Mazda MX-5 (2005-2015)** - £8k-£18k
- THE sports car for reliability and fun
- 30+ MPG, cheap insurance group 11-15
- Massive enthusiast community, easy to maintain

**⚡ Alternative: Toyota MR2 (2000-2007)** - £5k-£12k
- Mid-engine sports car, unique driving experience
- Toyota reliability, reasonable running costs
- Look for well-maintained examples

**🎯 Budget Option: Peugeot 206 CC (2001-2007)** - £3k-£7k
- Convertible fun at bargain price
- Decent fuel economy for a convertible
- More practical than pure sports cars

**🚙 Practical Sports: Mini Cooper S (2001-2006)** - £4k-£10k
- Great balance of sporty and practical
- Good fuel economy when driven sensibly
- Strong resale value

The MX-5 is the clear winner for reliability and running costs. Which budget range interests you most?`;
  }

  // Check if user is answering follow-up questions about budget
  if (lowerMessage.includes('budget') || lowerMessage.match(/£?\d+k?/)) {
    return `Based on your budget, here are my specific recommendations:

**£8k-£12k Range:**
- **2015 Honda Jazz 1.3** - Perfect reliability, low running costs
- **2014 Toyota Yaris 1.0** - Excellent first car, cheap insurance

**£12k-£18k Range:**
- **2017 Honda Civic 1.0 Turbo** - Great all-rounder, modern features
- **2016 Skoda Fabia 1.2** - Spacious, reliable, good value

**£18k+ Range:**
- **2018 Toyota Corolla Hybrid** - Future-proof, excellent economy
- **2017 Honda CR-V** - Family SUV, bulletproof reliability

Which price range interests you most? I can give you specific examples with mileage and dealer recommendations.`;
  }

  // Respond to driving type questions
  if (lowerMessage.includes('commut') || lowerMessage.includes('city') || lowerMessage.includes('motorway') || lowerMessage.includes('long') || lowerMessage.includes('weekend')) {
    if (lowerMessage.includes('city') || lowerMessage.includes('commut')) {
      return `Perfect! For city commuting, I'd recommend:

**Top Choice: Honda Jazz (2016-2018)** - £10k-£14k
- Excellent visibility for city driving
- Very reliable and economical
- Easy to park, great build quality

**Alternative: Toyota Yaris Hybrid (2017-2019)** - £12k-£16k
- Fantastic fuel economy for stop-start traffic
- Ultra-reliable, low maintenance costs

**Premium Option: Mini Cooper (2014-2017)** - £11k-£15k
- Fun to drive in the city
- Good resale value, premium feel

Would you like me to find specific examples of any of these with good service histories?`;
    }

    if (lowerMessage.includes('motorway') || lowerMessage.includes('long')) {
      return `For motorway and long-distance driving, here are my top picks:

**Best Comfort: Skoda Octavia (2016-2019)** - £13k-£18k
- Excellent motorway cruiser, very spacious
- Great fuel economy on long trips

**Most Reliable: Honda Accord (2015-2017)** - £14k-£19k
- Supremely comfortable, bulletproof reliability
- Perfect for business travel

**Best Value: Ford Mondeo (2015-2018)** - £11k-£16k
- Smooth motorway ride, good equipment levels
- Depreciation makes them great value

All of these have good availability with main dealer service histories. Which one appeals to you most?`;
    }
  }

  // Sporty car queries
  if (lowerMessage.includes('sporty') || lowerMessage.includes('sport') || lowerMessage.includes('two seat') || lowerMessage.includes('convertible')) {
    return `For sporty cars that are reliable with low running costs, I'd highly recommend:

**Mazda MX-5 (2016-2019)** - £15k-£20k. Excellent reliability, cheap to maintain, great fun to drive. 2-seater convertible that's perfect for weekend drives.

**Toyota GT86 (2017-2020)** - £18k-£24k. Very reliable, reasonable insurance, and fantastic handling. Rear-wheel drive sports car that's practical enough for daily use.

**Mini Cooper S (2014-2018)** - £12k-£18k. Good balance of sporty and practical, decent fuel economy, and lower insurance costs than many sports cars.

These are all excellent choices that balance fun with practicality. The MX-5 is the purest sports car experience, the GT86 is great for daily driving, and the Mini Cooper S offers the most practicality. Which one sounds most appealing for your needs?`;
  }

  // Family car queries
  if (lowerMessage.includes('family') || lowerMessage.includes('suv') || lowerMessage.includes('estate') || lowerMessage.includes('children')) {
    return `For reliable family cars, here are my top recommendations:

**Toyota RAV4 (2016-2019)** - £18k-£25k. Excellent reliability, great safety ratings, and good resale value. Hybrid versions available for better fuel economy.

**Honda CR-V (2015-2018)** - £15k-£22k. Very reliable, spacious interior, and good for long journeys. Lower running costs than German alternatives.

**Skoda Octavia Estate (2017-2020)** - £14k-£20k. Huge boot space, reliable VW engineering, and excellent value for money.

All of these are available with good service histories from main dealers. Would you like me to help you find specific examples in your area, or do you have questions about any of these models?`;
  }

  // Budget car queries
  if (lowerMessage.includes('cheap') || lowerMessage.includes('budget') || lowerMessage.includes('first car') || lowerMessage.includes('teenager')) {
    return `For budget-friendly, reliable first cars:

**Toyota Yaris (2014-2017)** - £8k-£12k. Extremely reliable, cheap insurance, and excellent fuel economy. Perfect size for new drivers.

**Honda Jazz (2015-2018)** - £9k-£13k. Very reliable, surprisingly spacious inside, and low running costs. Great visibility for nervous drivers.

**Mazda 2 (2015-2018)** - £8k-£12k. Fun to drive, reliable, and good build quality. More engaging than many small cars.

I'd also recommend checking insurance quotes for these before buying - young driver insurance can vary a lot between models. Would you like me to suggest some specific dealers or car buying tips for any of these?`;
  }

  // General response with specific recommendations
  return `I'll give you some excellent car recommendations right away! Here are my top picks across different categories:

**🏆 Best Overall Value:**
**Honda Civic (2017-2020)** - £14k-£19k. Extremely reliable, practical, great fuel economy. Perfect all-rounder.

**🚗 Best for Families:**
**Skoda Octavia Estate (2016-2019)** - £13k-£18k. Huge space, VW reliability, excellent value. Great for families.

**💰 Best Budget Choice:**
**Toyota Yaris (2014-2018)** - £8k-£13k. Bulletproof reliability, cheap to run, low insurance. Perfect first car.

**⚡ Best Performance:**
**Ford Focus ST (2015-2018)** - £16k-£22k. Fun to drive, practical, good performance. Best of both worlds.

What type of driving do you do most? (city commuting, long motorway trips, weekend adventures) - this will help me narrow down the perfect choice for you!`;
}

function addSearchButtons(response: string): string {
  // List of common car models to detect
  const carModels = [
    'Mazda MX-5', 'MX-5', 'Toyota GT86', 'GT86', 'Honda Civic', 'Honda Jazz', 'Toyota Yaris',
    'Skoda Octavia', 'Ford Focus', 'BMW Z4', 'Mini Cooper', 'Audi TT', 'Volkswagen Golf',
    'Toyota Corolla', 'Ford Fiesta', 'Vauxhall Corsa', 'Peugeot 208', 'Nissan Micra',
    'Honda CR-V', 'Toyota RAV4', 'Skoda Fabia', 'Seat Ibiza', 'Hyundai i30'
  ];

  let enhancedResponse = response;
  const foundCars = new Set();

  // Pattern to find car models with years/prices in response
  const carPattern = /\*\*([A-Za-z0-9\s\-]+(?:MX-5|GT86|Civic|Jazz|Yaris|Octavia|Focus|Z4|Cooper|TT|Golf|Corolla|Fiesta|Corsa|RAV4|Fabia).*?)\s+\((\d{4}[-–]\d{4}|\d{4})\)\*\*/g;

  // Find all car recommendations
  let match: RegExpExecArray | null;
  while ((match = carPattern.exec(response)) !== null) {
    const carModel = match[1];
    const yearRange = match[2];
    foundCars.add(`${carModel} ${yearRange}`);
  }

  // Add search links at the end if cars were found
  if (foundCars.size > 0) {
    enhancedResponse += '\n\n**🔍 Search for these cars:**\n';
    foundCars.forEach(car => {
      const carString = String(car);
      const searchUrl = `https://www.autotrader.co.uk/car-search?keywords=${encodeURIComponent(carString)}`;
      enhancedResponse += `• [Find ${carString} on AutoTrader](${searchUrl})\n`;
    });

    enhancedResponse += `\n💡 *Links open AutoTrader searches in new tabs*`;
  }

  return enhancedResponse;
}
