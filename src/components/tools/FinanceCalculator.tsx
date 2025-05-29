"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Calculator,
  PoundSterling,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Car,
  CreditCard,
  Calendar,
  Percent
} from "lucide-react";

interface LoanCalculation {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  apr: number;
}

interface LeaseCalculation {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  residualValue: number;
}

interface FinanceInputs {
  vehiclePrice: number;
  deposit: number;
  loanTerm: number;
  interestRate: number;
  leaseTerm: number;
  leaseRate: number;
  residualPercent: number;
  tradeinValue: number;
  extraFees: number;
}

export default function FinanceCalculator() {
  const [inputs, setInputs] = useState<FinanceInputs>({
    vehiclePrice: 20000,
    deposit: 2000,
    loanTerm: 60,
    interestRate: 6.9,
    leaseTerm: 36,
    leaseRate: 3.9,
    residualPercent: 45,
    tradeinValue: 0,
    extraFees: 500
  });

  const [activeTab, setActiveTab] = useState("loan");

  const updateInput = (field: keyof FinanceInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Loan calculations
  const calculateLoan = (): LoanCalculation => {
    const principal = inputs.vehiclePrice - inputs.deposit - inputs.tradeinValue + inputs.extraFees;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm;

    if (monthlyRate === 0) {
      const monthlyPayment = principal / numPayments;
      return {
        monthlyPayment,
        totalAmount: principal + inputs.deposit + inputs.tradeinValue,
        totalInterest: 0,
        apr: inputs.interestRate
      };
    }

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalAmount = monthlyPayment * numPayments + inputs.deposit + inputs.tradeinValue;
    const totalInterest = totalAmount - inputs.vehiclePrice;

    return {
      monthlyPayment,
      totalAmount,
      totalInterest,
      apr: inputs.interestRate
    };
  };

  // Lease calculations
  const calculateLease = (): LeaseCalculation => {
    const vehiclePrice = inputs.vehiclePrice;
    const residualValue = vehiclePrice * (inputs.residualPercent / 100);
    const depreciationAmount = vehiclePrice - residualValue;
    const principal = vehiclePrice - inputs.deposit - inputs.tradeinValue + inputs.extraFees;

    const monthlyDepreciation = depreciationAmount / inputs.leaseTerm;
    const monthlyFinanceCharge = (principal + residualValue) * (inputs.leaseRate / 100 / 12);
    const monthlyPayment = monthlyDepreciation + monthlyFinanceCharge;

    const totalAmount = monthlyPayment * inputs.leaseTerm + inputs.deposit + inputs.tradeinValue;
    const totalInterest = totalAmount - depreciationAmount;

    return {
      monthlyPayment,
      totalAmount,
      totalInterest,
      residualValue
    };
  };

  const loan = calculateLoan();
  const lease = calculateLease();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAffordabilityStatus = (monthlyPayment: number) => {
    // Basic affordability guidance - monthly payment should be max 10-15% of gross monthly income
    // We'll use £3000 as example monthly income for guidance
    const exampleIncome = 3000;
    const percentage = (monthlyPayment / exampleIncome) * 100;

    if (percentage <= 10) return { status: "excellent", color: "text-green-600", icon: CheckCircle };
    if (percentage <= 15) return { status: "good", color: "text-yellow-600", icon: AlertCircle };
    return { status: "high", color: "text-red-600", icon: AlertCircle };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-blue-600" />
          Car Finance Calculator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Compare loan and lease options to find the best financing solution for your budget.
          Calculate monthly payments, total costs, and get affordability guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Vehicle & Finance Details
              </CardTitle>
              <CardDescription>
                Enter your vehicle price and financing preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Price */}
              <div className="space-y-2">
                <Label htmlFor="vehicle-price" className="flex items-center gap-2">
                  <PoundSterling className="h-4 w-4" />
                  Vehicle Price
                </Label>
                <Input
                  id="vehicle-price"
                  type="number"
                  value={inputs.vehiclePrice}
                  onChange={(e) => updateInput("vehiclePrice", Number(e.target.value))}
                  className="text-lg font-semibold"
                />
              </div>

              {/* Deposit */}
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit</Label>
                <Input
                  id="deposit"
                  type="number"
                  value={inputs.deposit}
                  onChange={(e) => updateInput("deposit", Number(e.target.value))}
                />
                <div className="text-sm text-gray-600">
                  {((inputs.deposit / inputs.vehiclePrice) * 100).toFixed(1)}% of vehicle price
                </div>
              </div>

              {/* Trade-in Value */}
              <div className="space-y-2">
                <Label htmlFor="tradein">Trade-in Value (Optional)</Label>
                <Input
                  id="tradein"
                  type="number"
                  value={inputs.tradeinValue}
                  onChange={(e) => updateInput("tradeinValue", Number(e.target.value))}
                />
              </div>

              {/* Extra Fees */}
              <div className="space-y-2">
                <Label htmlFor="fees">Additional Fees</Label>
                <Input
                  id="fees"
                  type="number"
                  value={inputs.extraFees}
                  onChange={(e) => updateInput("extraFees", Number(e.target.value))}
                />
                <div className="text-xs text-gray-500">
                  Documentation, registration, extended warranty, etc.
                </div>
              </div>

              {/* Loan Terms */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Loan Options
                </h3>

                <div className="space-y-2">
                  <Label>Loan Term: {inputs.loanTerm} months</Label>
                  <Slider
                    value={[inputs.loanTerm]}
                    onValueChange={(value) => updateInput("loanTerm", value[0])}
                    max={84}
                    min={12}
                    step={12}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 year</span>
                    <span>7 years</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.interestRate}
                    onChange={(e) => updateInput("interestRate", Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Lease Terms */}
              <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Lease Options
                </h3>

                <div className="space-y-2">
                  <Label>Lease Term: {inputs.leaseTerm} months</Label>
                  <Slider
                    value={[inputs.leaseTerm]}
                    onValueChange={(value) => updateInput("leaseTerm", value[0])}
                    max={48}
                    min={24}
                    step={12}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>2 years</span>
                    <span>4 years</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Lease Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.leaseRate}
                    onChange={(e) => updateInput("leaseRate", Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Residual Value: {inputs.residualPercent}%</Label>
                  <Slider
                    value={[inputs.residualPercent]}
                    onValueChange={(value) => updateInput("residualPercent", value[0])}
                    max={70}
                    min={30}
                    step={5}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-600">
                    {formatCurrency(inputs.vehiclePrice * (inputs.residualPercent / 100))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="loan" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Loan
              </TabsTrigger>
              <TabsTrigger value="lease" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Lease
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Compare
              </TabsTrigger>
            </TabsList>

            {/* Loan Tab */}
            <TabsContent value="loan" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-700">Loan Calculation Results</CardTitle>
                  <CardDescription>
                    {inputs.loanTerm} month loan at {inputs.interestRate}% APR
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-600">Monthly Payment</div>
                        <div className="text-3xl font-bold text-blue-900">
                          {formatCurrency(loan.monthlyPayment)}
                        </div>
                        {(() => {
                          const affordability = getAffordabilityStatus(loan.monthlyPayment);
                          return (
                            <div className={`flex items-center gap-1 text-sm ${affordability.color}`}>
                              <affordability.icon className="h-4 w-4" />
                              {affordability.status === "excellent" && "Excellent affordability"}
                              {affordability.status === "good" && "Good affordability"}
                              {affordability.status === "high" && "High payment ratio"}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-gray-600">Total Cost</div>
                          <div className="text-lg font-semibold">{formatCurrency(loan.totalAmount)}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-gray-600">Total Interest</div>
                          <div className="text-lg font-semibold">{formatCurrency(loan.totalInterest)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Loan Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Vehicle Price:</span>
                          <span>{formatCurrency(inputs.vehiclePrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deposit:</span>
                          <span>-{formatCurrency(inputs.deposit)}</span>
                        </div>
                        {inputs.tradeinValue > 0 && (
                          <div className="flex justify-between">
                            <span>Trade-in:</span>
                            <span>-{formatCurrency(inputs.tradeinValue)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Additional Fees:</span>
                          <span>{formatCurrency(inputs.extraFees)}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Amount Financed:</span>
                          <span>{formatCurrency(inputs.vehiclePrice - inputs.deposit - inputs.tradeinValue + inputs.extraFees)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Benefits & Considerations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Loan Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• You own the car at the end</li>
                      <li>• No mileage restrictions</li>
                      <li>• Can modify the vehicle</li>
                      <li>• Build equity in the asset</li>
                      <li>• No wear and tear charges</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li>• Higher monthly payments than lease</li>
                      <li>• Responsible for all maintenance</li>
                      <li>• Vehicle depreciation risk</li>
                      <li>• Longer commitment period</li>
                      <li>• Higher insurance requirements</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Lease Tab */}
            <TabsContent value="lease" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-700">Lease Calculation Results</CardTitle>
                  <CardDescription>
                    {inputs.leaseTerm} month lease at {inputs.leaseRate}% money factor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-sm font-medium text-green-600">Monthly Payment</div>
                        <div className="text-3xl font-bold text-green-900">
                          {formatCurrency(lease.monthlyPayment)}
                        </div>
                        {(() => {
                          const affordability = getAffordabilityStatus(lease.monthlyPayment);
                          return (
                            <div className={`flex items-center gap-1 text-sm ${affordability.color}`}>
                              <affordability.icon className="h-4 w-4" />
                              {affordability.status === "excellent" && "Excellent affordability"}
                              {affordability.status === "good" && "Good affordability"}
                              {affordability.status === "high" && "High payment ratio"}
                            </div>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-gray-600">Total Cost</div>
                          <div className="text-lg font-semibold">{formatCurrency(lease.totalAmount)}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-gray-600">Residual Value</div>
                          <div className="text-lg font-semibold">{formatCurrency(lease.residualValue)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Lease Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Vehicle Price:</span>
                          <span>{formatCurrency(inputs.vehiclePrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Residual Value:</span>
                          <span>-{formatCurrency(lease.residualValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Depreciation:</span>
                          <span>{formatCurrency(inputs.vehiclePrice - lease.residualValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deposit:</span>
                          <span>-{formatCurrency(inputs.deposit)}</span>
                        </div>
                        {inputs.tradeinValue > 0 && (
                          <div className="flex justify-between">
                            <span>Trade-in:</span>
                            <span>-{formatCurrency(inputs.tradeinValue)}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span>Financed Amount:</span>
                          <span>{formatCurrency(inputs.vehiclePrice - inputs.deposit - inputs.tradeinValue + inputs.extraFees)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lease Benefits & Considerations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-800 text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Lease Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• Lower monthly payments</li>
                      <li>• Always drive newer cars</li>
                      <li>• Usually covered by warranty</li>
                      <li>• No depreciation worries</li>
                      <li>• Lower down payment</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-yellow-800 text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-yellow-700">
                      <li>• Mileage restrictions (typically 10-15k/year)</li>
                      <li>• Wear and tear charges</li>
                      <li>• No ownership equity</li>
                      <li>• Early termination fees</li>
                      <li>• Continuous payments</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="compare" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    Loan vs Lease Comparison
                  </CardTitle>
                  <CardDescription>
                    Side-by-side comparison to help you decide
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Loan Column */}
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Finance (Loan)</h3>
                        <div className="text-2xl font-bold text-blue-700">
                          {formatCurrency(loan.monthlyPayment)}
                        </div>
                        <div className="text-sm text-blue-600">per month</div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total payments:</span>
                          <span className="font-medium">{formatCurrency(loan.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest paid:</span>
                          <span className="font-medium">{formatCurrency(loan.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Term:</span>
                          <span className="font-medium">{inputs.loanTerm} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ownership:</span>
                          <span className="font-medium text-green-600">You own it</span>
                        </div>
                      </div>
                    </div>

                    {/* Lease Column */}
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h3 className="font-semibold text-green-900 mb-2">Lease</h3>
                        <div className="text-2xl font-bold text-green-700">
                          {formatCurrency(lease.monthlyPayment)}
                        </div>
                        <div className="text-sm text-green-600">per month</div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total payments:</span>
                          <span className="font-medium">{formatCurrency(lease.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest paid:</span>
                          <span className="font-medium">{formatCurrency(lease.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Term:</span>
                          <span className="font-medium">{inputs.leaseTerm} months</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ownership:</span>
                          <span className="font-medium text-orange-600">Return to dealer</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Financial Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-purple-600">Monthly savings with lease:</span>
                        <div className="font-bold">
                          {loan.monthlyPayment > lease.monthlyPayment
                            ? formatCurrency(loan.monthlyPayment - lease.monthlyPayment)
                            : "Loan is cheaper"
                          }
                        </div>
                      </div>
                      <div>
                        <span className="text-purple-600">Total cost difference:</span>
                        <div className="font-bold">
                          {formatCurrency(Math.abs(loan.totalAmount - lease.totalAmount))}
                          {loan.totalAmount > lease.totalAmount ? " (loan costs more)" : " (lease costs more)"}
                        </div>
                      </div>
                      <div>
                        <span className="text-purple-600">Best for:</span>
                        <div className="font-bold">
                          {loan.monthlyPayment < lease.monthlyPayment ? "Monthly budget: Lease" : "Total cost: Loan"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Our Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-purple-700">
                    {loan.monthlyPayment < lease.monthlyPayment ? (
                      <div>
                        <p className="font-semibold">Consider a loan if:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>You plan to keep the car for several years</li>
                          <li>You drive more than 15,000 miles per year</li>
                          <li>You want to build equity and own an asset</li>
                          <li>You don't mind being responsible for maintenance after warranty</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">Consider a lease if:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>You prefer lower monthly payments</li>
                          <li>You like driving newer cars with latest technology</li>
                          <li>You drive less than 15,000 miles per year</li>
                          <li>You prefer predictable costs with warranty coverage</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Additional Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Important Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Loan Considerations</h4>
              <ul className="space-y-1">
                <li>• Interest rates vary based on credit score and loan term</li>
                <li>• Longer terms mean lower payments but more interest</li>
                <li>• Consider gap insurance for new vehicles</li>
                <li>• Factor in maintenance costs after warranty expires</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Lease Considerations</h4>
              <ul className="space-y-1">
                <li>• Typical mileage allowance is 10,000-15,000 miles/year</li>
                <li>• Excess mileage charges are usually £0.10-£0.25 per mile</li>
                <li>• Normal wear and tear is expected, excessive damage incurs fees</li>
                <li>• Early termination can result in significant penalties</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
