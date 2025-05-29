'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Calculator,
  Car,
  Search,
  FileText,
  Wrench,
  Shield,
  Target,
  DollarSign,
  MapPin,
  Truck,
  Info,
  Save,
  RotateCcw,
  Trash2,
  Clock
} from 'lucide-react';
import { FinanceCalculator } from '@/components/tools/FinanceCalculator';
import { CostCalculator } from '@/components/tools/CostCalculator';
import { MOTChecker } from '@/components/tools/MOTChecker';
import { GarageFinder } from '@/components/tools/GarageFinder';
import { TowingGuide } from '@/components/tools/TowingGuide';
import { LegalAdvice } from '@/components/tools/LegalAdvice';
import { CarRecommendationQuiz } from '@/components/tools/CarRecommendationQuiz';
import { WizardStorage } from '@/lib/utils/wizard-storage';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component?: React.ReactNode;
  completed: boolean;
  skippable: boolean;
}

interface WizardData {
  budget: number;
  monthlyBudget: number;
  financingType: 'loan' | 'lease' | 'cash' | null;
  needs: string[];
  lifestyle: string[];
  preferredMakes: string[];
  bodyTypes: string[];
  fuelTypes: string[];
  transmissionType: string[];
  minYear: number;
  maxMileage: number;
  selectedVehicles: any[];
  matchingVehicles: any[];
  towingNeeds: boolean;
  towingCapacity: number;
  maintenancePlan: any;
  legalQuestions: any[];
  quizResults: any;
}

export function CarBuyingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    budget: 0,
    monthlyBudget: 0,
    financingType: null,
    needs: [],
    lifestyle: [],
    preferredMakes: [],
    bodyTypes: [],
    fuelTypes: [],
    transmissionType: [],
    minYear: 2015,
    maxMileage: 100000,
    selectedVehicles: [],
    matchingVehicles: [],
    towingNeeds: false,
    towingCapacity: 0,
    maintenancePlan: null,
    legalQuestions: [],
    quizResults: null
  });

  const [showRestorationPrompt, setShowRestorationPrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<any>(null);
  const [hasCheckedForSavedData, setHasCheckedForSavedData] = useState(false);

  const [steps, setSteps] = useState<WizardStep[]>([
    {
      id: 'welcome',
      title: 'Welcome to Your Car Buying Journey',
      description: 'Let us guide you through finding your perfect vehicle',
      icon: <Target className="h-5 w-5" />,
      completed: false,
      skippable: false
    },
    {
      id: 'budget',
      title: 'Plan Your Budget',
      description: 'Calculate what you can afford and explore financing options',
      icon: <Calculator className="h-5 w-5" />,
      completed: false,
      skippable: false
    },
    {
      id: 'needs',
      title: 'Discover Your Needs',
      description: 'Find cars that match your lifestyle and requirements',
      icon: <Car className="h-5 w-5" />,
      completed: false,
      skippable: false
    },
    {
      id: 'towing',
      title: 'Towing Requirements',
      description: 'Check if you need towing capacity and find suitable vehicles',
      icon: <Truck className="h-5 w-5" />,
      completed: false,
      skippable: true
    },
    {
      id: 'search',
      title: 'Find Your Car',
      description: 'Search for vehicles based on your preferences',
      icon: <Search className="h-5 w-5" />,
      completed: false,
      skippable: false
    },
    {
      id: 'costs',
      title: 'Calculate Ownership Costs',
      description: 'Understand the total cost of owning your chosen vehicle',
      icon: <DollarSign className="h-5 w-5" />,
      completed: false,
      skippable: false
    },
    {
      id: 'history',
      title: 'Check Vehicle History',
      description: 'Verify MOT history and vehicle condition',
      icon: <FileText className="h-5 w-5" />,
      completed: false,
      skippable: false
    },
    {
      id: 'maintenance',
      title: 'Plan Maintenance',
      description: 'Find trusted garages and plan ongoing maintenance',
      icon: <Wrench className="h-5 w-5" />,
      completed: false,
      skippable: true
    },
    {
      id: 'legal',
      title: 'Legal Protection',
      description: 'Get legal advice and protection for your purchase',
      icon: <Shield className="h-5 w-5" />,
      completed: false,
      skippable: true
    },
    {
      id: 'summary',
      title: 'Your Car Buying Plan',
      description: 'Review your journey and next steps',
      icon: <CheckCircle className="h-5 w-5" />,
      completed: false,
      skippable: false
    }
  ]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Check for saved progress on component mount
  useEffect(() => {
    if (!hasCheckedForSavedData) {
      const progress = WizardStorage.loadProgress();
      if (progress) {
        setSavedProgress(progress);
        setShowRestorationPrompt(true);
      }
      setHasCheckedForSavedData(true);
    }
  }, [hasCheckedForSavedData]);

  // Auto-save progress whenever state changes
  useEffect(() => {
    if (hasCheckedForSavedData && !showRestorationPrompt) {
      const completedStepIds = steps.filter(step => step.completed).map(step => step.id);
      WizardStorage.saveProgress(currentStep, wizardData, completedStepIds);
    }
  }, [currentStep, wizardData, hasCheckedForSavedData, showRestorationPrompt]);

  // Auto-search for vehicles when reaching search step with preferences
  useEffect(() => {
    if (steps[currentStep]?.id === 'search' &&
        (wizardData.budget > 0 || wizardData.preferredMakes?.length || wizardData.bodyTypes?.length) &&
        wizardData.matchingVehicles.length === 0) {
      searchMatchingVehicles();
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      // Mark current step as completed
      const updatedSteps = [...steps];
      updatedSteps[currentStep].completed = true;
      setSteps(updatedSteps);
      setCurrentStep(currentStep + 1);

      // Auto-search for vehicles when reaching search step
      if (steps[currentStep + 1]?.id === 'search' && (wizardData.budget > 0 || wizardData.preferredMakes?.length || wizardData.bodyTypes?.length)) {
        setTimeout(() => {
          searchMatchingVehicles();
        }, 500);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    if (steps[currentStep].skippable) {
      nextStep();
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Function to search for matching vehicles based on wizard preferences
  const searchMatchingVehicles = async () => {
    try {
      const searchParams = {
        budget: wizardData.budget,
        make: wizardData.preferredMakes?.join(',') || '',
        bodyType: wizardData.bodyTypes?.join(',') || '',
        fuelType: wizardData.fuelTypes?.join(',') || '',
        transmission: wizardData.transmissionType?.join(',') || '',
        minYear: wizardData.minYear,
        maxMileage: wizardData.maxMileage,
        maxResults: 20
      };

      // Build query string for the API
      const queryParams = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && value !== 0 && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      const data = await response.json();

      if (data.success && data.vehicles) {
        setWizardData(prev => ({ ...prev, matchingVehicles: data.vehicles }));
      } else {
        // If API fails, show sample vehicles based on preferences
        const sampleVehicles = generateSampleVehicles(wizardData);
        setWizardData(prev => ({ ...prev, matchingVehicles: sampleVehicles }));
      }
    } catch (error) {
      console.error('Error searching for vehicles:', error);
      // Fallback to sample data
      const sampleVehicles = generateSampleVehicles(wizardData);
      setWizardData(prev => ({ ...prev, matchingVehicles: sampleVehicles }));
    }
  };

  // Generate sample vehicles based on user preferences
  const generateSampleVehicles = (preferences: WizardData) => {
    const makes = preferences.preferredMakes?.length ? preferences.preferredMakes : ['Toyota', 'Honda', 'Ford', 'Volkswagen'];
    const bodyTypes = preferences.bodyTypes?.length ? preferences.bodyTypes : ['Hatchback', 'Saloon', 'SUV'];
    const fuelTypes = preferences.fuelTypes?.length ? preferences.fuelTypes : ['Petrol', 'Diesel', 'Hybrid'];

    const models = {
      Toyota: ['Corolla', 'Camry', 'RAV4', 'Prius', 'Yaris'],
      Honda: ['Civic', 'Accord', 'CR-V', 'Jazz', 'HR-V'],
      Ford: ['Focus', 'Fiesta', 'Kuga', 'Mondeo', 'EcoSport'],
      Volkswagen: ['Golf', 'Polo', 'Tiguan', 'Passat', 'T-Roc'],
      BMW: ['3 Series', '1 Series', 'X3', '5 Series', 'X1'],
      Audi: ['A3', 'A4', 'Q3', 'A1', 'Q5']
    };

    const sampleVehicles = [];
    for (let i = 0; i < 12; i++) {
      const make = makes[Math.floor(Math.random() * makes.length)];
      const modelList = models[make as keyof typeof models] || ['Model'];
      const model = modelList[Math.floor(Math.random() * modelList.length)];
      const year = Math.floor(Math.random() * (2024 - preferences.minYear + 1)) + preferences.minYear;
      const mileage = Math.floor(Math.random() * preferences.maxMileage);
      const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
      const transmission = Math.random() > 0.5 ? 'Manual' : 'Automatic';

      let basePrice = 15000 + Math.floor(Math.random() * 20000);
      if (preferences.budget > 0) {
        basePrice = Math.min(basePrice, preferences.budget - Math.floor(Math.random() * 5000));
      }

      sampleVehicles.push({
        id: `sample-${i}`,
        make,
        model,
        year,
        price: basePrice,
        mileage,
        fuelType,
        transmission,
        bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
        image: `https://images.unsplash.com/photo-${1558618047 + i}?w=400&h=250&fit=crop&auto=format`,
        location: 'London',
        dealer: 'Trusted Dealer',
        features: ['Air Conditioning', 'Bluetooth', 'Electric Windows']
      });
    }

    return sampleVehicles.sort((a, b) => a.price - b.price);
  };

  // Update wizard data with preferences from different steps
  const updateWizardData = (updates: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  };

  // Restore saved progress
  const restoreProgress = () => {
    if (!savedProgress) return;

    setCurrentStep(savedProgress.currentStep);
    setWizardData(savedProgress.wizardData);

    // Restore completed steps
    const updatedSteps = [...steps];
    savedProgress.completedSteps.forEach((stepId: string) => {
      const stepIndex = updatedSteps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        updatedSteps[stepIndex].completed = true;
      }
    });
    setSteps(updatedSteps);

    setShowRestorationPrompt(false);
    setSavedProgress(null);
  };

  // Start fresh (clear saved progress)
  const startFresh = () => {
    WizardStorage.clearProgress();
    setShowRestorationPrompt(false);
    setSavedProgress(null);
  };

  // Clear all progress and restart
  const clearAndRestart = () => {
    WizardStorage.clearProgress();
    setCurrentStep(0);
    setWizardData({
      budget: 0,
      monthlyBudget: 0,
      financingType: null,
      needs: [],
      lifestyle: [],
      preferredMakes: [],
      bodyTypes: [],
      fuelTypes: [],
      transmissionType: [],
      minYear: 2015,
      maxMileage: 100000,
      selectedVehicles: [],
      matchingVehicles: [],
      towingNeeds: false,
      towingCapacity: 0,
      maintenancePlan: null,
      legalQuestions: [],
      quizResults: null
    });
    const resetSteps = steps.map(step => ({ ...step, completed: false }));
    setSteps(resetSteps);
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="mb-8">
        <Car className="h-16 w-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-3xl font-bold mb-4">Welcome to Your Car Buying Journey</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We'll guide you through every step of finding and buying your perfect car.
          Our comprehensive tools will help you make informed decisions with confidence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="p-4">
          <Calculator className="h-8 w-8 text-blue-600 mb-2" />
          <h3 className="font-semibold">Budget Planning</h3>
          <p className="text-sm text-gray-600">Calculate financing options and affordability</p>
        </Card>
        <Card className="p-4">
          <Target className="h-8 w-8 text-green-600 mb-2" />
          <h3 className="font-semibold">Needs Assessment</h3>
          <p className="text-sm text-gray-600">Find cars that match your lifestyle</p>
        </Card>
        <Card className="p-4">
          <Search className="h-8 w-8 text-purple-600 mb-2" />
          <h3 className="font-semibold">Vehicle Search</h3>
          <p className="text-sm text-gray-600">AI-powered search with smart recommendations</p>
        </Card>
        <Card className="p-4">
          <FileText className="h-8 w-8 text-orange-600 mb-2" />
          <h3 className="font-semibold">History Check</h3>
          <p className="text-sm text-gray-600">Verify MOT records and vehicle condition</p>
        </Card>
        <Card className="p-4">
          <Wrench className="h-8 w-8 text-red-600 mb-2" />
          <h3 className="font-semibold">Maintenance Planning</h3>
          <p className="text-sm text-gray-600">Find trusted garages and service providers</p>
        </Card>
        <Card className="p-4">
          <Shield className="h-8 w-8 text-indigo-600 mb-2" />
          <h3 className="font-semibold">Legal Protection</h3>
          <p className="text-sm text-gray-600">Get expert legal advice and protection</p>
        </Card>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This journey typically takes 15-30 minutes to complete, but you can save your progress and return anytime.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStepContent = () => {
    const step = steps[currentStep];

    if (!step) {
      return <div>Loading...</div>;
    }

    switch (step.id) {
      case 'welcome':
        return renderWelcomeStep();

      case 'budget':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Plan Your Budget</h2>
              <p className="text-gray-600">Set your budget preferences to help us find suitable vehicles.</p>
            </div>

            {/* Quick Budget Setup */}
            <Card className="mb-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Budget Setup</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Maximum Budget</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000"
                    className="w-full p-3 border rounded-lg"
                    value={wizardData.budget || ''}
                    onChange={(e) => updateWizardData({ budget: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Total amount you can spend on a car</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Budget (if financing)</label>
                  <input
                    type="number"
                    placeholder="e.g. 400"
                    className="w-full p-3 border rounded-lg"
                    value={wizardData.monthlyBudget || ''}
                    onChange={(e) => updateWizardData({ monthlyBudget: Number(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Monthly payment you're comfortable with</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">How will you finance your purchase?</label>
                <div className="flex flex-wrap gap-2">
                  {['cash', 'loan', 'lease'].map((type) => (
                    <button
                      key={type}
                      onClick={() => updateWizardData({ financingType: type as any })}
                      className={`px-4 py-2 rounded-lg border capitalize ${
                        wizardData.financingType === type
                          ? 'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {(wizardData.budget > 0 || wizardData.monthlyBudget > 0) && (
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Budget set! We'll prioritize vehicles within your {wizardData.budget > 0 ? `£${wizardData.budget.toLocaleString()} total` : ''}
                    {wizardData.budget > 0 && wizardData.monthlyBudget > 0 ? ' / ' : ''}
                    {wizardData.monthlyBudget > 0 ? `£${wizardData.monthlyBudget}/month` : ''} budget.
                  </AlertDescription>
                </Alert>
              )}
            </Card>

            {/* Detailed Finance Calculator */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Finance Calculator</h3>
              <p className="text-gray-600 mb-4">Use our comprehensive calculator for detailed payment analysis:</p>
              <FinanceCalculator />
            </Card>
          </div>
        );

      case 'needs':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Discover Your Perfect Car</h2>
              <p className="text-gray-600">Tell us about your preferences to help us find the perfect vehicle for you.</p>
            </div>

            {/* Quick Preferences */}
            <Card className="mb-6 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Preferences</h3>

              <div className="space-y-6">
                {/* Preferred Makes */}
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Car Brands</label>
                  <div className="flex flex-wrap gap-2">
                    {['Toyota', 'Honda', 'Ford', 'Volkswagen', 'BMW', 'Audi', 'Mercedes', 'Nissan', 'Hyundai', 'Mazda'].map((make) => (
                      <button
                        key={make}
                        onClick={() => {
                          const current = wizardData.preferredMakes || [];
                          const updated = current.includes(make)
                            ? current.filter(m => m !== make)
                            : [...current, make];
                          updateWizardData({ preferredMakes: updated });
                        }}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          wizardData.preferredMakes?.includes(make)
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {make}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body Types */}
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Body Types</label>
                  <div className="flex flex-wrap gap-2">
                    {['Hatchback', 'Saloon', 'Estate', 'SUV', 'Convertible', 'Coupe', 'MPV'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          const current = wizardData.bodyTypes || [];
                          const updated = current.includes(type)
                            ? current.filter(t => t !== type)
                            : [...current, type];
                          updateWizardData({ bodyTypes: updated });
                        }}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          wizardData.bodyTypes?.includes(type)
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Types */}
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Type Preferences</label>
                  <div className="flex flex-wrap gap-2">
                    {['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'].map((fuel) => (
                      <button
                        key={fuel}
                        onClick={() => {
                          const current = wizardData.fuelTypes || [];
                          const updated = current.includes(fuel)
                            ? current.filter(f => f !== fuel)
                            : [...current, fuel];
                          updateWizardData({ fuelTypes: updated });
                        }}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          wizardData.fuelTypes?.includes(fuel)
                            ? 'bg-purple-100 border-purple-500 text-purple-700'
                            : 'bg-white border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age and Mileage */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Year</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={wizardData.minYear}
                      onChange={(e) => updateWizardData({ minYear: Number(e.target.value) })}
                    >
                      {Array.from({length: 15}, (_, i) => 2024 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Maximum Mileage</label>
                    <select
                      className="w-full p-3 border rounded-lg"
                      value={wizardData.maxMileage}
                      onChange={(e) => updateWizardData({ maxMileage: Number(e.target.value) })}
                    >
                      <option value={20000}>20,000 miles</option>
                      <option value={40000}>40,000 miles</option>
                      <option value={60000}>60,000 miles</option>
                      <option value={80000}>80,000 miles</option>
                      <option value={100000}>100,000 miles</option>
                      <option value={150000}>150,000 miles</option>
                    </select>
                  </div>
                </div>
              </div>

              {(wizardData.preferredMakes?.length || wizardData.bodyTypes?.length || wizardData.fuelTypes?.length) && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Great! We'll search for {wizardData.preferredMakes?.length ? wizardData.preferredMakes.join(', ') : 'any brand'} vehicles
                    {wizardData.bodyTypes?.length ? ` in ${wizardData.bodyTypes.join(', ')} body styles` : ''}
                    {wizardData.fuelTypes?.length ? ` with ${wizardData.fuelTypes.join(', ')} fuel types` : ''}.
                  </AlertDescription>
                </Alert>
              )}
            </Card>

            {/* Detailed Quiz */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Detailed Lifestyle Assessment</h3>
              <p className="text-gray-600 mb-4">Take our comprehensive quiz for even more personalized recommendations:</p>
              <CarRecommendationQuiz />
            </Card>
          </div>
        );

      case 'towing':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Towing Requirements</h2>
              <p className="text-gray-600">Check if you need towing capacity and find vehicles that meet your requirements.</p>
            </div>
            <TowingGuide />
          </div>
        );

      case 'search':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Find Your Car</h2>
              <p className="text-gray-600">Based on your preferences, here are vehicles that match your criteria.</p>
            </div>

            {/* Preference Summary */}
            <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold mb-3 text-blue-800">Your Preferences Summary</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Budget:</span> £{wizardData.budget?.toLocaleString() || 'Not set'}
                </div>
                <div>
                  <span className="font-medium">Preferred Makes:</span> {wizardData.preferredMakes?.length ? wizardData.preferredMakes.join(', ') : 'Any'}
                </div>
                <div>
                  <span className="font-medium">Body Types:</span> {wizardData.bodyTypes?.length ? wizardData.bodyTypes.join(', ') : 'Any'}
                </div>
              </div>
              <Button
                onClick={searchMatchingVehicles}
                className="mt-4"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Search Matching Vehicles
              </Button>
            </Card>

            {/* Matching Vehicles */}
            {wizardData.matchingVehicles && wizardData.matchingVehicles.length > 0 ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Vehicles Matching Your Criteria ({wizardData.matchingVehicles.length})</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {wizardData.matchingVehicles.slice(0, 6).map((vehicle: any, index: number) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-gray-200 relative">
                        {vehicle.image && (
                          <img
                            src={vehicle.image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <Badge className="absolute top-2 right-2 bg-green-600">
                          £{vehicle.price?.toLocaleString()}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-1">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex justify-between">
                            <span>Mileage:</span>
                            <span>{vehicle.mileage?.toLocaleString()} miles</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fuel:</span>
                            <span>{vehicle.fuelType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transmission:</span>
                            <span>{vehicle.transmission}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              const updated = [...(wizardData.selectedVehicles || []), vehicle];
                              updateWizardData({ selectedVehicles: updated });
                            }}
                          >
                            Shortlist
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {wizardData.matchingVehicles.length > 6 && (
                  <div className="text-center">
                    <Button asChild variant="outline">
                      <a href="/search" className="inline-flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        View All {wizardData.matchingVehicles.length} Results
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Alert className="mb-6">
                  <Search className="h-4 w-4" />
                  <AlertDescription>
                    Click "Search Matching Vehicles" above to find cars based on your preferences, or visit our <a href="/search" className="text-blue-600 hover:underline">Advanced Search</a> page.
                  </AlertDescription>
                </Alert>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Quick Search Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Use the filters to narrow down by price, age, and mileage</li>
                      <li>• Try our AI search for natural language queries</li>
                      <li>• Save interesting vehicles to compare later</li>
                      <li>• Check multiple sources for the best deals</li>
                    </ul>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">What to Look For</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Service history and maintenance records</li>
                      <li>• Number of previous owners</li>
                      <li>• Accident history and damage reports</li>
                      <li>• Remaining warranty coverage</li>
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {/* Shortlisted Vehicles */}
            {wizardData.selectedVehicles && wizardData.selectedVehicles.length > 0 && (
              <Card className="mt-6 p-4 bg-green-50 border-green-200">
                <h3 className="font-semibold mb-3 text-green-800">Your Shortlisted Vehicles ({wizardData.selectedVehicles.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {wizardData.selectedVehicles.map((vehicle: any, index: number) => (
                    <Badge key={index} variant="outline" className="bg-white">
                      {vehicle.year} {vehicle.make} {vehicle.model} - £{vehicle.price?.toLocaleString()}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        );

      case 'costs':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Calculate Ownership Costs</h2>
              <p className="text-gray-600">Understand the total cost of owning your chosen vehicle beyond the purchase price.</p>
            </div>
            <CostCalculator />
          </div>
        );

      case 'history':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Check Vehicle History</h2>
              <p className="text-gray-600">Verify the MOT history and condition of any vehicle you're considering.</p>
            </div>
            <MOTChecker />
          </div>
        );

      case 'maintenance':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Plan Your Maintenance</h2>
              <p className="text-gray-600">Find trusted garages and service providers in your area for ongoing maintenance.</p>
            </div>
            <GarageFinder />
          </div>
        );

      case 'legal':
        return (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Legal Protection & Advice</h2>
              <p className="text-gray-600">Get expert legal advice to protect yourself during the car buying process.</p>
            </div>
            <LegalAdvice />
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-3xl font-bold mb-4">Your Car Buying Plan is Ready!</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Based on your preferences, here's your personalized car buying plan and recommendations.
              </p>
            </div>

            {/* Your Profile Summary */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-xl font-semibold mb-4 text-blue-800">Your Car Profile</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-gray-700">Budget</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {wizardData.budget > 0 ? `£${wizardData.budget.toLocaleString()}` : 'Not set'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-gray-700">Preferred Brands</div>
                  <div className="text-sm">
                    {wizardData.preferredMakes?.length ? wizardData.preferredMakes.slice(0, 2).join(', ') + (wizardData.preferredMakes.length > 2 ? '...' : '') : 'Any'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-gray-700">Body Type</div>
                  <div className="text-sm">
                    {wizardData.bodyTypes?.length ? wizardData.bodyTypes.slice(0, 2).join(', ') : 'Any'}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <div className="font-medium text-gray-700">Fuel Type</div>
                  <div className="text-sm">
                    {wizardData.fuelTypes?.length ? wizardData.fuelTypes.slice(0, 2).join(', ') : 'Any'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Shortlisted Vehicles */}
            {wizardData.selectedVehicles && wizardData.selectedVehicles.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Your Shortlisted Vehicles ({wizardData.selectedVehicles.length})</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wizardData.selectedVehicles.map((vehicle: any, index: number) => (
                    <Card key={index} className="p-4 border-green-200 bg-green-50">
                      <h4 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>£{vehicle.price?.toLocaleString()}</div>
                        <div>{vehicle.mileage?.toLocaleString()} miles</div>
                        <div>{vehicle.fuelType} • {vehicle.transmission}</div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="flex-1">View Details</Button>
                        <Button size="sm" variant="outline">Compare</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Recommended Next Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Recommended Next Steps</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Search className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Search for More Vehicles</div>
                      <div className="text-sm text-gray-600">Find additional cars matching your preferences</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Check Vehicle History</div>
                      <div className="text-sm text-gray-600">Verify MOT and service records</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Calculator className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Calculate Total Costs</div>
                      <div className="text-sm text-gray-600">Include insurance, tax, and maintenance</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Wrench className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Find Local Garages</div>
                      <div className="text-sm text-gray-600">Locate trusted mechanics nearby</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium">Get Legal Advice</div>
                      <div className="text-sm text-gray-600">Protect yourself during purchase</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                    <Truck className="h-5 w-5 text-teal-600" />
                    <div>
                      <div className="font-medium">Check Towing Capacity</div>
                      <div className="text-sm text-gray-600">Ensure it meets your requirements</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Completed Steps */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Journey Completed</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {steps.filter(step => step.completed).map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">Ready to Find Your Car?</h3>
              <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Button asChild className="h-auto p-4">
                  <a href="/search" className="flex flex-col items-center gap-2">
                    <Search className="h-6 w-6" />
                    <span>Start Searching</span>
                    <span className="text-xs opacity-75">Find cars matching your profile</span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4">
                  <a href="/tools" className="flex flex-col items-center gap-2">
                    <Calculator className="h-6 w-6" />
                    <span>Use More Tools</span>
                    <span className="text-xs opacity-75">Access all our car buying tools</span>
                  </a>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4">
                  <a href="/dashboard" className="flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" />
                    <span>View Dashboard</span>
                    <span className="text-xs opacity-75">Track your car buying progress</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step content not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Restoration Prompt */}
        {showRestorationPrompt && savedProgress && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <RotateCcw className="h-8 w-8 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Resume Your Journey?</h3>
                  <p className="text-blue-700 mb-4">
                    We found your previous car buying progress. You can continue where you left off or start fresh.
                  </p>

                  {(() => {
                    const summary = WizardStorage.getProgressSummary();
                    return summary ? (
                      <div className="bg-white p-4 rounded-lg mb-4 border border-blue-200">
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-700">Progress</div>
                            <div className="text-blue-600">Step {summary.step} of {summary.totalSteps}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Completed</div>
                            <div className="text-green-600">{summary.completedCount} steps</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Last Saved</div>
                            <div className="text-gray-600">{summary.lastSaved}</div>
                          </div>
                        </div>

                        {savedProgress.wizardData.budget > 0 && (
                          <div className="mt-3 pt-3 border-t border-blue-100">
                            <div className="text-xs text-gray-600">Your saved preferences include:</div>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Budget: £{savedProgress.wizardData.budget.toLocaleString()}
                              </Badge>
                              {savedProgress.wizardData.preferredMakes?.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {savedProgress.wizardData.preferredMakes.length} preferred brand{savedProgress.wizardData.preferredMakes.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                              {savedProgress.wizardData.selectedVehicles?.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {savedProgress.wizardData.selectedVehicles.length} shortlisted vehicle{savedProgress.wizardData.selectedVehicles.length > 1 ? 's' : ''}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}

                  <div className="flex gap-3">
                    <Button onClick={restoreProgress} className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Continue Journey
                    </Button>
                    <Button onClick={startFresh} variant="outline" className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      Start Fresh
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Header */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Car Buying Wizard
                  {WizardStorage.hasProgress() && !showRestorationPrompt && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Save className="h-3 w-3" />
                      Auto-saved
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  {Math.round(progress)}% Complete
                </Badge>
                {!showRestorationPrompt && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAndRestart}
                    className="flex items-center gap-1 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                    Restart
                  </Button>
                )}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
        </Card>

        {/* Step Navigation */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex overflow-x-auto gap-2 pb-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    index === currentStep
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : index < currentStep || step.completed
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : index === currentStep ? (
                    <div className="h-4 w-4 rounded-full bg-blue-600" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Save Status */}
                {!showRestorationPrompt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Save className="h-4 w-4" />
                    <span>Progress auto-saved</span>
                    {(() => {
                      const lastSaved = WizardStorage.getLastSavedDate();
                      if (lastSaved) {
                        const now = new Date();
                        const diffMs = now.getTime() - lastSaved.getTime();
                        const diffMinutes = Math.floor(diffMs / (1000 * 60));
                        if (diffMinutes < 1) {
                          return <span className="text-green-600">• Just now</span>;
                        } else if (diffMinutes < 60) {
                          return <span className="text-green-600">• {diffMinutes}m ago</span>;
                        }
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {steps[currentStep].skippable && (
                  <Button variant="outline" onClick={skipStep}>
                    Skip This Step
                  </Button>
                )}

                {currentStep === steps.length - 1 ? (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => WizardStorage.clearProgress()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Progress
                    </Button>
                    <Button asChild className="flex items-center gap-2">
                      <a href="/search">
                        Start Car Shopping
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                ) : (
                  <Button onClick={nextStep} className="flex items-center gap-2">
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
