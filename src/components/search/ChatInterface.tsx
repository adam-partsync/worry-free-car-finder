"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Bot, User, Loader2, Zap } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialQuery?: string;
}

export default function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      // Add welcome message and process initial query
      setMessages([
        {
          id: '1',
          type: 'assistant',
          content: "🤖 **AI Car Expert** - Powered by OpenAI for intelligent car recommendations.\n\nHi! I'm your AI car expert. I can help you find the perfect used car in the UK. Tell me what you're looking for and I'll provide personalized recommendations with realistic prices, years, and reasons why each car matches your needs.\n\n💡 **Tip**: Try the example buttons below or ask me anything about cars!",
          timestamp: new Date()
        }
      ]);

      if (initialQuery.trim()) {
        handleSendMessage(initialQuery);
      }
    }
  }, [initialQuery]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call both the chat API and the search API
      const [chatResponse, searchResponse] = await Promise.all([
        fetch('/api/chat/car-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageToSend,
            conversationHistory: messages
          }),
        }),
        fetch('/api/search/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: messageToSend
          }),
        })
      ]);

      const chatData = await chatResponse.json();
      const searchData = await searchResponse.json();

      if (chatResponse.ok) {
        // Show chat response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: chatData.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Also show vehicle listings if available
        if (searchResponse.ok && searchData.listings && searchData.listings.length > 0) {
          const vehicleListingsMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'assistant',
            content: `🚗 **Found ${searchData.listings.length} Vehicles:**\n\n${searchData.listings.slice(0, 3).map((car: {
              title: string;
              price: number;
              year: number;
              mileage?: number;
              location: string;
              rating?: number;
              fuelType: string;
              transmission: string;
              seller: string;
            }) =>
              `**${car.title}**\n` +
              `💷 £${car.price.toLocaleString()} • ${car.year} • ${car.mileage?.toLocaleString() || 'N/A'} miles\n` +
              `📍 ${car.location} • ⭐ ${car.rating?.toFixed(1) || '4.0'}\n` +
              `🔧 ${car.fuelType} • ${car.transmission}\n` +
              `🏪 ${car.seller}\n`
            ).join('\n')}\n\n💡 *Switch to "Detailed Filters" tab to see all results with images*`,
            timestamp: new Date()
          };

          setTimeout(() => {
            setMessages(prev => [...prev, vehicleListingsMessage]);
          }, 1000);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. As a fallback, I'd recommend looking at reliable brands like Toyota, Honda, or Mazda for your needs. For sporty cars, consider the Mazda MX-5, Toyota GT86, or BMW Z4 if you want something fun and reliable.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardContent className="flex flex-col h-full p-0">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b bg-blue-50">
          <Bot className="h-8 w-8 text-blue-600" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">AI Car Expert</h3>
            <p className="text-sm text-gray-600">Get personalized UK car recommendations</p>
          </div>
          <div className="text-right">
            <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              AI Powered
            </div>
            <p className="text-xs text-gray-500 mt-1">OpenAI API integrated</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-12'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-gray-600">AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Example Queries */}
        {messages.length <= 1 && (
          <div className="p-4 border-t bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Quick Search Examples</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3 bg-white hover:bg-blue-50 border-blue-200"
                onClick={() => handleSendMessage("small cheap reliable car under £3000")}
              >
                <div>
                  <div className="font-medium text-blue-900">Budget Car</div>
                  <div className="text-xs text-blue-700">Small cheap reliable car under £3000</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3 bg-white hover:bg-blue-50 border-blue-200"
                onClick={() => handleSendMessage("sporty 2 seater that's cheap to run")}
              >
                <div>
                  <div className="font-medium text-blue-900">Sporty Car</div>
                  <div className="text-xs text-blue-700">Sporty 2 seater that's cheap to run</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3 bg-white hover:bg-blue-50 border-blue-200"
                onClick={() => handleSendMessage("reliable family car under £15k with good fuel economy")}
              >
                <div>
                  <div className="font-medium text-blue-900">Family Car</div>
                  <div className="text-xs text-blue-700">Reliable family car under £15k, good fuel economy</div>
                </div>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3 bg-white hover:bg-blue-50 border-blue-200"
                onClick={() => handleSendMessage("first car for teenager, safe and reliable")}
              >
                <div>
                  <div className="font-medium text-blue-900">First Car</div>
                  <div className="text-xs text-blue-700">First car for teenager, safe and reliable</div>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about cars... e.g., 'I need a reliable family car under £15k'"
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>💡 Try: "sporty two seat car, reliable, low running costs" or "family SUV under £20k"</p>
            <p>🔑 OpenAI API integrated - May use smart fallback if quota exceeded</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
