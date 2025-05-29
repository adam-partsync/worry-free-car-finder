"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Car,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Target,
  DollarSign,
  Users,
  MapPin,
  Fuel,
  Zap,
  Clock,
  Heart,
  Star
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'range';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

interface QuizAnswer {
  questionId: string;
  value: string | string[] | number;
}

// This interface should be compatible with ApiCarRecommendation from the API
interface CarRecommendation {
  make: string;
  model: string;
  year: string; // Or number
  price: string; // Or an object like {min: number, max: number, currency: string}
  matchScore: number;
  reasons: string[];
  pros: string[];
  cons: string[];
  suitability: string;
  image: string;
  fuelType: string;
  bodyType: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "primary-use",
    question: "What will be your primary use for this car?",
    type: "single",
    options: [
      "Daily commuting to work",
      "Family trips and school runs",
      "Weekend leisure and hobbies",
      "Business travel and meetings",
      "Mixed use - bit of everything"
    ]
  },
  {
    id: "budget",
    question: "What's your maximum budget?",
    type: "single",
    options: [
      "Under £10,000",
      "£10,000 - £20,000",
      "£20,000 - £35,000",
      "£35,000 - £50,000",
      "Over £50,000"
    ]
  },
  {
    id: "passengers",
    question: "How many people do you typically need to transport?",
    type: "single",
    options: [
      "Just me (1 person)",
      "Me + 1 other (2 people)",
      "Small family (3-4 people)",
      "Large family (5-7 people)",
      "Varies depending on occasion"
    ]
  },
  {
    id: "driving-distance",
    question: "How many miles do you drive per year approximately?",
    type: "single",
    options: [
      "Under 5,000 miles",
      "5,000 - 10,000 miles",
      "10,000 - 15,000 miles",
      "15,000 - 25,000 miles",
      "Over 25,000 miles"
    ]
  },
  {
    id: "body-type",
    question: "Which body types appeal to you? (Select all that apply)",
    type: "multiple",
    options: [
      "Hatchback",
      "Saloon",
      "Estate",
      "SUV/Crossover",
      "Convertible",
      "Coupe",
      "MPV/People Carrier"
    ]
  },
  {
    id: "fuel-type",
    question: "What fuel type preference do you have?",
    type: "single",
    options: [
      "Petrol - familiar and convenient",
      "Diesel - better fuel economy",
      "Hybrid - best of both worlds",
      "Electric - environmentally conscious",
      "No preference - just want best value"
    ]
  },
  {
    id: "age-preference",
    question: "How old can the car be?",
    type: "single",
    options: [
      "Brand new or nearly new (0-2 years)",
      "Recent model (2-4 years)",
      "Mature but modern (4-7 years)",
      "Older but reliable (7-10 years)",
      "Age doesn't matter if it's good value"
    ]
  },
  {
    id: "features",
    question: "Which features are most important to you? (Select all that apply)",
    type: "multiple",
    options: [
      "Air conditioning/climate control",
      "Bluetooth/smartphone connectivity",
      "Sat nav/GPS",
      "Parking sensors/camera",
      "Cruise control",
      "Automatic transmission",
      "Leather seats",
      "Sunroof/panoramic roof",
      "Premium audio system",
      "Safety features (autonomous braking, etc.)"
    ]
  },
  {
    id: "reliability",
    question: "How important is reliability vs other factors?",
    type: "single",
    options: [
      "Most important - I need dependability above all",
      "Very important - but I want some style too",
      "Important - balanced with performance/looks",
      "Somewhat important - I like taking some risks",
      "Not critical - I prioritize other factors"
    ]
  },
  {
    id: "performance",
    question: "What's your preference for driving experience?",
    type: "single",
    options: [
      "Comfortable and smooth ride",
      "Sporty and responsive handling",
      "Powerful acceleration and speed",
      "Efficient and economical driving",
      "Balanced mix of comfort and performance"
    ]
  }
];


export function CarRecommendationQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (questionId: string, value: string | string[] | number) => {
    const newAnswers = answers.filter(a => a.questionId !== questionId);
    newAnswers.push({ questionId, value });
    setAnswers(newAnswers);
  };

  const getCurrentAnswer = (questionId: string) => {
    return answers.find(a => a.questionId === questionId)?.value;
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations(); // This will now be async
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    setShowResults(false); // Hide previous results/errors immediately
    try {
      const response = await fetch('/api/cars/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers), // Send quiz answers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error details
        console.error("API Error Response:", errorData);
        throw new Error(errorData.details || `Network response was not ok (status: ${response.status})`);
      }
      const data: CarRecommendation[] = await response.json();
      setRecommendations(data);
      setShowResults(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch recommendations: ${err.message}. Please try again.`);
      } else {
        setError('Failed to fetch recommendations due to an unknown error. Please try again.');
      }
      setShowResults(false); // Ensure results are not shown on error
      console.error("Generate Recommendations Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setRecommendations([]);
    setError(null);
    setLoading(false);
  };
  
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-center py-10">
        <div className="flex justify-center items-center mb-4">
          <Car className="h-12 w-12 animate-pulse text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold">Fetching Your Recommendations...</h2>
        <p className="text-gray-600">Please wait a moment while we analyze your answers.</p>
        <Progress value={progress} className="w-full max-w-md mx-auto mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 text-center py-10">
        <Alert variant="destructive">
          <AlertDescription className="font-semibold">
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={restartQuiz} variant="outline" size="lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Try Quiz Again
        </Button>
      </div>
    );
  }

  if (showResults && recommendations.length > 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h2 className="text-3xl font-bold mb-4">Your Perfect Car Matches!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your answers, here are our top recommendations tailored specifically for you.
          </p>
        </div>

        <div className="space-y-6">
          {recommendations.map((car, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-800">
                          #{index + 1} Match
                        </Badge>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(car.matchScore / 20)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {car.matchScore}% match
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold">{car.make} {car.model}</h3>
                      <p className="text-gray-600">{car.year} • {car.fuelType} • {car.bodyType}</p>
                      <p className="text-xl font-semibold text-blue-600 mt-2">{car.price}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 italic">{car.suitability}</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">🎯 Why This Car?</h4>
                      <ul className="text-sm space-y-1">
                        {car.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-600" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">✅ Pros</h4>
                      <ul className="text-sm space-y-1">
                        {car.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="outline">
                      Learn More
                    </Button>
                    <Button>
                      <Search className="h-4 w-4 mr-2" />
                      Find This Car
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center space-y-4">
          <Button onClick={restartQuiz} variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
          <p className="text-sm text-gray-600">
            Want different results? Retake the quiz with different preferences!
          </p>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const currentAnswer = getCurrentAnswer(question.id);
  const isAnswered = currentAnswer !== undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Find Your Perfect Car</h2>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <span className="text-blue-600 font-bold">{currentQuestion + 1}</span>
            </div>
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {question.type === 'single' && (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, option)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    currentAnswer === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'multiple' && (
            <div className="space-y-2">
              {question.options?.map((option, index) => {
                const selectedOptions = (currentAnswer as string[]) || [];
                const isSelected = selectedOptions.includes(option);

                return (
                  <button
                    key={index}
                    onClick={() => {
                      const current = (currentAnswer as string[]) || [];
                      const updated = isSelected
                        ? current.filter(item => item !== option)
                        : [...current, option];
                      handleAnswer(question.id, updated);
                    }}
                    className={`w-full p-4 text-left border rounded-lg transition-colors flex items-center gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 border-2 rounded ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    } flex items-center justify-center`}>
                      {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                    </div>
                    {option}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={nextQuestion}
          disabled={!isAnswered}
        >
          {currentQuestion === quizQuestions.length - 1 ? (
            <>
              <Target className="h-4 w-4 mr-2" />
              Get My Recommendations
            </>
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          Take your time answering these questions. The more accurate your responses,
          the better we can match you with your perfect car!
        </AlertDescription>
      </Alert>
    </div>
  );
}
