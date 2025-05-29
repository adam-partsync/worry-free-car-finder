"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Fuel,
  MapPin,
  PoundSterling,
  Calendar,
  Star,
  CheckCircle
} from "lucide-react";

interface FormData {
  budget: string;
  primaryUse: string;
  passengers: string;
  drivenAnnualMiles: string;
  fuelType: string;
  transmission: string;
  age: string;
  bodyType: string[];
  features: string[];
  location: string;
  experience: string;
}

const steps = [
  { id: 1, title: "Budget & Location", icon: PoundSterling },
  { id: 2, title: "Usage & Requirements", icon: Users },
  { id: 3, title: "Preferences", icon: Star },
  { id: 4, title: "Results", icon: CheckCircle }
];

export default function HelpMeChooseForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    budget: "",
    primaryUse: "",
    passengers: "",
    drivenAnnualMiles: "",
    fuelType: "",
    transmission: "",
    age: "",
    bodyType: [],
    features: [],
    location: "",
    experience: ""
  });

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // TODO: Process form and show recommendations
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 ${
                step.id <= currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.id <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <span className="hidden md:block text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-8">
          {/* Step 1: Budget & Location */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <PoundSterling className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Budget & Location</h2>
                <p className="text-gray-600">Let's start with your budget and where you'll be looking</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What's your maximum budget?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Under £5,000", "£5,000 - £10,000", "£10,000 - £20,000", "£20,000 - £30,000", "£30,000+"].map((budget) => (
                      <Button
                        key={budget}
                        variant={formData.budget === budget ? "default" : "outline"}
                        onClick={() => updateFormData("budget", budget)}
                        className="h-auto py-3 text-center"
                      >
                        {budget}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-base font-medium">
                    Your postcode (for local searches)
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., SW1A 1AA"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    How experienced are you with buying cars?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: "first-time", label: "First-time buyer" },
                      { value: "some", label: "Some experience" },
                      { value: "experienced", label: "Very experienced" }
                    ].map((exp) => (
                      <Button
                        key={exp.value}
                        variant={formData.experience === exp.value ? "default" : "outline"}
                        onClick={() => updateFormData("experience", exp.value)}
                        className="h-auto py-3"
                      >
                        {exp.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Usage & Requirements */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Usage & Requirements</h2>
                <p className="text-gray-600">Tell us how you'll use your car</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    What will you primarily use the car for?
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Daily commuting",
                      "Weekend trips",
                      "Family transport",
                      "Business use",
                      "Occasional use",
                      "Long distance travel"
                    ].map((use) => (
                      <Button
                        key={use}
                        variant={formData.primaryUse === use ? "default" : "outline"}
                        onClick={() => updateFormData("primaryUse", use)}
                        className="h-auto py-3"
                      >
                        {use}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    How many passengers do you typically carry?
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Just me", "2 people", "3-4 people", "5+ people"].map((passengers) => (
                      <Button
                        key={passengers}
                        variant={formData.passengers === passengers ? "default" : "outline"}
                        onClick={() => updateFormData("passengers", passengers)}
                        className="h-auto py-3"
                      >
                        {passengers}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Annual mileage (approximately)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Under 5,000", "5,000 - 10,000", "10,000 - 15,000", "15,000+"].map((miles) => (
                      <Button
                        key={miles}
                        variant={formData.drivenAnnualMiles === miles ? "default" : "outline"}
                        onClick={() => updateFormData("drivenAnnualMiles", miles)}
                        className="h-auto py-3"
                      >
                        {miles} miles
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
                <p className="text-gray-600">Let's refine the search based on your preferences</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Fuel type preference
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Petrol", "Diesel", "Hybrid", "Electric", "No preference"].map((fuel) => (
                      <Button
                        key={fuel}
                        variant={formData.fuelType === fuel ? "default" : "outline"}
                        onClick={() => updateFormData("fuelType", fuel)}
                        className="h-auto py-3"
                      >
                        {fuel}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Transmission preference
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Manual", "Automatic", "No preference"].map((trans) => (
                      <Button
                        key={trans}
                        variant={formData.transmission === trans ? "default" : "outline"}
                        onClick={() => updateFormData("transmission", trans)}
                        className="h-auto py-3"
                      >
                        {trans}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Car body types you'd consider (select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Hatchback", "Saloon", "Estate", "SUV", "Convertible", "Coupe"].map((body) => (
                      <Button
                        key={body}
                        variant={formData.bodyType.includes(body) ? "default" : "outline"}
                        onClick={() => toggleArrayField("bodyType", body)}
                        className="h-auto py-3"
                      >
                        {body}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Important features (select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Air conditioning",
                      "Parking sensors",
                      "Bluetooth",
                      "Navigation system",
                      "Cruise control",
                      "Heated seats",
                      "Good fuel economy",
                      "Reliability",
                      "Low insurance cost"
                    ].map((feature) => (
                      <Button
                        key={feature}
                        variant={formData.features.includes(feature) ? "default" : "outline"}
                        onClick={() => toggleArrayField("features", feature)}
                        className="h-auto py-3 text-sm"
                      >
                        {feature}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your Car Recommendations</h2>
                <p className="text-gray-600">Based on your answers, here are our suggestions</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">Your Profile Summary:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Budget:</strong> {formData.budget}</div>
                  <div><strong>Primary use:</strong> {formData.primaryUse}</div>
                  <div><strong>Passengers:</strong> {formData.passengers}</div>
                  <div><strong>Annual mileage:</strong> {formData.drivenAnnualMiles}</div>
                  <div><strong>Fuel type:</strong> {formData.fuelType}</div>
                  <div><strong>Transmission:</strong> {formData.transmission}</div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>🎯 Perfect Match Cars</CardTitle>
                  <CardDescription>
                    These cars match all your criteria and are highly recommended
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-4">
                    AI recommendations will be generated based on your profile...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={nextStep} className="flex items-center">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex items-center bg-green-600 hover:bg-green-700">
                Find My Cars
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
