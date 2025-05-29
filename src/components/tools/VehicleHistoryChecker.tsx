"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CreditCard,
  FileText,
  Car,
  Clock,
  TrendingUp,
  Users,
  AlertCircle,
  Crown,
  Star
} from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface VehicleHistoryData {
  registration: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  colour: string;
  engineSize: string;
  fuelType: string;
  checks: {
    stolen: { status: string; details?: string };
    finance: { status: string; amount?: number; details?: string };
    writeOff: { status: string; date?: string; details?: string };
    mileage: { status: string; discrepancies?: Array<any> };
    imports: { status: string; importDate?: string; country?: string };
    recalls: { status: string; recalls?: Array<any> };
    insurance: { totalClaims: number; majorClaims: number; lastClaimDate?: string };
    keeperHistory: { totalKeepers: number; averageOwnershipPeriod: number };
  };
  riskScore: number;
  recommendation: string;
  summary: string[];
  warnings: string[];
}

const checkTypes = [
  {
    id: 'basic',
    name: 'Basic Check',
    price: '£2.99',
    features: [
      'Stolen vehicle check',
      'Outstanding finance check',
      'Write-off history',
      'Basic vehicle details'
    ],
    recommended: false
  },
  {
    id: 'premium',
    name: 'Premium Check',
    price: '£6.99',
    features: [
      'All Basic features',
      'Mileage verification',
      'Import history',
      'Outstanding recalls',
      'Insurance claims history',
      'Detailed analysis'
    ],
    recommended: true
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Check',
    price: '£12.99',
    features: [
      'All Premium features',
      'Detailed keeper history',
      'Full insurance analysis',
      'Risk assessment score',
      'Buying recommendation',
      'Priority support'
    ],
    recommended: false
  }
];

function PaymentForm({
  clientSecret,
  onPaymentSuccess,
  onPaymentError
}: {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    });

    if (result.error) {
      onPaymentError(result.error.message || 'Payment failed');
    } else {
      onPaymentSuccess();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? 'Processing...' : 'Complete Payment'}
      </Button>
    </form>
  );
}

export default function VehicleHistoryChecker() {
  const { data: session } = useSession();
  const [step, setStep] = useState<'select' | 'input' | 'payment' | 'results'>('select');
  const [selectedCheck, setSelectedCheck] = useState('premium');
  const [vehicleData, setVehicleData] = useState({
    registration: '',
    vin: ''
  });
  const [clientSecret, setClientSecret] = useState('');
  const [checkId, setCheckId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyData, setHistoryData] = useState<VehicleHistoryData | null>(null);

  const handleCheckSelection = (checkType: string) => {
    setSelectedCheck(checkType);
    setStep('input');
  };

  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setError('Please sign in to continue');
      return;
    }

    if (!vehicleData.registration.trim()) {
      setError('Vehicle registration is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/vehicle-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration: vehicleData.registration,
          vin: vehicleData.vin,
          checkType: selectedCheck,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate check');
      }

      setClientSecret(data.clientSecret);
      setCheckId(data.checkId);
      setStep('payment');
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setStep('results');
    setLoading(true);

    // Poll for results
    const pollForResults = async () => {
      try {
        const response = await fetch(`/api/vehicle-check?checkId=${checkId}`);
        const data = await response.json();

        if (data.status === 'completed' && data.data) {
          setHistoryData(data.data);
          setLoading(false);
        } else {
          // Continue polling
          setTimeout(pollForResults, 2000);
        }
      } catch (error) {
        console.error('Error polling for results:', error);
        setTimeout(pollForResults, 5000); // Retry after longer delay
      }
    };

    pollForResults();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clear':
      case 'none':
      case 'consistent':
      case 'uk_vehicle':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'outstanding':
      case 'discrepancy':
      case 'imported':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'alert':
      case 'category_n':
      case 'category_s':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Select Check Type */}
      {step === 'select' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Choose Your Vehicle History Check
              </CardTitle>
              <CardDescription>
                Select the level of detail you need for your vehicle history report
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {checkTypes.map((check) => (
              <Card
                key={check.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  check.recommended ? 'ring-2 ring-blue-500 relative' : ''
                }`}
                onClick={() => handleCheckSelection(check.id)}
              >
                {check.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {check.id === 'comprehensive' ? (
                      <Crown className="h-8 w-8 text-yellow-500" />
                    ) : check.id === 'premium' ? (
                      <Shield className="h-8 w-8 text-blue-500" />
                    ) : (
                      <FileText className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{check.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">{check.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {check.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Vehicle Input */}
      {step === 'input' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
            <CardDescription>
              Enter your vehicle information for the {checkTypes.find(c => c.id === selectedCheck)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVehicleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="registration">Vehicle Registration *</Label>
                <Input
                  id="registration"
                  placeholder="e.g., AB12 CDE"
                  value={vehicleData.registration}
                  onChange={(e) => setVehicleData(prev => ({ ...prev, registration: e.target.value.toUpperCase() }))}
                  maxLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN Number (Optional)</Label>
                <Input
                  id="vin"
                  placeholder="e.g., WVWZZZ1JZ3W386752"
                  value={vehicleData.vin}
                  onChange={(e) => setVehicleData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
                  maxLength={17}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep('select')}>
                  Back
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Processing...' : `Continue to Payment`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment */}
      {step === 'payment' && clientSecret && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Secure Payment
            </CardTitle>
            <CardDescription>
              Complete your payment for the {checkTypes.find(c => c.id === selectedCheck)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise}>
              <PaymentForm
                clientSecret={clientSecret}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Elements>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === 'results' && (
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold mb-2">Generating Your Report</h3>
                <p className="text-gray-600">
                  We're checking multiple databases to compile your comprehensive vehicle history report...
                </p>
              </CardContent>
            </Card>
          ) : historyData ? (
            <div className="space-y-6">
              {/* Vehicle Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Registration</div>
                      <div className="font-semibold">{historyData.registration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Make & Model</div>
                      <div className="font-semibold">{historyData.make} {historyData.model}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Year</div>
                      <div className="font-semibold">{historyData.year}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Fuel Type</div>
                      <div className="font-semibold">{historyData.fuelType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getRiskColor(historyData.riskScore)} mb-2`}>
                        {historyData.riskScore}/100
                      </div>
                      <div className="text-lg font-medium">Risk Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2 capitalize">
                        {historyData.recommendation}
                      </div>
                      <div className="text-sm text-gray-600">Recommendation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {historyData.checks.keeperHistory.totalKeepers}
                      </div>
                      <div className="text-sm text-gray-600">Previous Owners</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Checks */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed History Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(historyData.checks).map(([key, check]) => (
                      <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(check.status)}
                          <div>
                            <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                            <div className="text-sm text-gray-600 capitalize">{check.status.replace('_', ' ')}</div>
                          </div>
                        </div>
                        {check.amount && (
                          <div className="text-sm font-medium text-red-600">
                            £{check.amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {historyData.summary.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {historyData.warnings.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="h-5 w-5" />
                        Warnings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {historyData.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-orange-700">{warning}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Report Generation Failed</h3>
                <p className="text-gray-600">
                  There was an issue generating your vehicle history report. Please contact support.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
