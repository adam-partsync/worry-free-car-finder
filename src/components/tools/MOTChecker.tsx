"use client";

import { useState } from "react";
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
  Calendar,
  Gauge,
  TrendingUp,
  AlertCircle,
  FileText,
  Car
} from "lucide-react";

interface MOTTest {
  completedDate: string;
  testResult: string;
  expiryDate?: string;
  odometerValue?: string;
  odometerUnit?: string;
  motTestNumber: string;
  rfrAndComments: MOTDefect[];
}

interface MOTDefect {
  text: string;
  type: string;
  dangerous: boolean;
}

interface MOTResult {
  registration: string;
  make?: string;
  model?: string;
  year?: number;
  fuelType?: string;
  engineSize?: string;
  color?: string;
  motStatus: string;
  motExpiry?: string;
  taxStatus?: string;
  taxDue?: string;
  motHistory?: MOTTest[];
  totalMOTTests?: number;
  dataSource: 'DVLA_REAL' | 'DVLA_MOT_API' | 'DEMO';
  lastChecked: string;
  warnings?: string[];
  recommendations?: string[];
}

interface MOTResponse {
  success: boolean;
  result: MOTResult;
  message: string;
  dataQuality: string;
}

export default function MOTChecker() {
  const [registration, setRegistration] = useState("");
  const [motData, setMOTData] = useState<MOTResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!registration.trim()) {
      setError("Please enter a vehicle registration");
      return;
    }

    setLoading(true);
    setError("");
    setMOTData(null);

    try {
      const response = await fetch('/api/mot-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registration: registration.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check MOT status');
      }

      if (data.success) {
        setMOTData(data);
      } else {
        throw new Error(data.error || 'MOT check failed');
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'An error occurred while checking MOT history');
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Vehicle Registration
          </CardTitle>
          <CardDescription>
            Enter a UK vehicle registration to check its MOT history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="registration">Registration Number</Label>
              <Input
                id="registration"
                placeholder="e.g., AB12 CDE"
                value={registration}
                onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                className="mt-2"
                maxLength={8}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleCheck}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Checking..." : "Check MOT"}
              </Button>
            </div>
          </div>
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

      {/* Results */}
      {motData && (
        <div className="space-y-6">
          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Registration</div>
                  <div className="font-semibold">{motData.result.registration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Make & Model</div>
                  <div className="font-semibold">{motData.result.make} {motData.result.model}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Year</div>
                  <div className="font-semibold">{motData.result.year || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fuel Type</div>
                  <div className="font-semibold">{motData.result.fuelType || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Engine Size</div>
                  <div className="font-semibold">{motData.result.engineSize || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Colour</div>
                  <div className="font-semibold">{motData.result.color || 'N/A'}</div>
                </div>
              </div>

              {/* Data Source Information */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Data Source:</div>
                  <Badge variant={motData.result.dataSource === 'DVLA_REAL' ? 'default' : 'outline'}>
                    {motData.dataQuality}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last checked: {formatDate(motData.result.lastChecked)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MOT & Tax Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                MOT & Tax Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  {motData.result.motStatus?.includes('Scrapped') || motData.result.motStatus?.includes('Exported') ? (
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  ) : motData.result.motStatus?.includes('Unknown') || motData.result.motStatus?.includes('Check Official') ? (
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  )}
                  <div className={`text-lg font-bold ${
                    motData.result.motStatus?.includes('Scrapped') || motData.result.motStatus?.includes('Exported')
                      ? 'text-red-600'
                      : 'text-orange-600'
                  }`}>
                    {motData.result.motStatus}
                  </div>
                  <div className="text-sm text-gray-600">MOT Status</div>
                  {motData.result.motExpiry && (
                    <div className="text-xs text-gray-500 mt-1">
                      Expires: {formatDate(motData.result.motExpiry)}
                    </div>
                  )}
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  {motData.result.taxStatus?.includes('Scrapped') || motData.result.taxStatus?.includes('Exported') ? (
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  )}
                  <div className={`text-xl font-bold ${
                    motData.result.taxStatus?.includes('Scrapped') || motData.result.taxStatus?.includes('Exported')
                      ? 'text-red-600'
                      : 'text-orange-600'
                  }`}>
                    {motData.result.taxStatus}
                  </div>
                  <div className="text-sm text-gray-600">Tax Status</div>
                  {motData.result.taxDue && (
                    <div className="text-xs text-gray-500 mt-1">
                      Due: {formatDate(motData.result.taxDue)}
                    </div>
                  )}
                </div>
              </div>

              {motData.result.warnings && motData.result.warnings.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Warnings
                  </h4>
                  <div className="space-y-2">
                    {motData.result.warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="text-orange-800 text-sm">{warning}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* MOT History */}
          {motData.result.motHistory && motData.result.motHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  MOT History ({motData.result.totalMOTTests} tests)
                </CardTitle>
                <CardDescription>
                  Complete MOT test history from official DVLA records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {motData.result.motHistory.map((test, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      test.testResult === 'PASSED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className={`font-semibold text-lg ${
                            test.testResult === 'PASSED' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {test.testResult}
                          </div>
                          <div className="text-sm text-gray-600">
                            Test Date: {formatDate(test.completedDate.split(' ')[0])}
                          </div>
                        </div>
                        <div className="text-right">
                          {test.odometerValue && (
                            <div className="text-sm text-gray-600">
                              Mileage: {Number.parseInt(test.odometerValue).toLocaleString()} {test.odometerUnit}
                            </div>
                          )}
                          {test.expiryDate && (
                            <div className="text-sm text-gray-600">
                              Expires: {formatDate(test.expiryDate)}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-3">
                        MOT Number: {test.motTestNumber}
                      </div>

                      {test.rfrAndComments && test.rfrAndComments.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2">Issues Found:</h5>
                          <div className="space-y-2">
                            {test.rfrAndComments.map((defect, defectIndex) => (
                              <div key={defectIndex} className={`p-2 rounded text-xs ${
                                defect.type === 'FAIL' || defect.type === 'MAJOR' || defect.type === 'DANGEROUS'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                <div className="flex justify-between items-start">
                                  <span className="flex-1">{defect.text}</span>
                                  <div className="ml-2 flex gap-1">
                                    <Badge variant={
                                      defect.type === 'DANGEROUS' ? 'destructive' :
                                      defect.type === 'MAJOR' || defect.type === 'FAIL' ? 'outline' :
                                      'secondary'
                                    } className="text-xs">
                                      {defect.type}
                                    </Badge>
                                    {defect.dangerous && (
                                      <Badge variant="destructive" className="text-xs">
                                        DANGEROUS
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {motData.result.recommendations && motData.result.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  Expert advice based on vehicle data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {motData.result.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="text-green-800 text-sm">{recommendation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Important Limitations Notice */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <strong>IMPORTANT LIMITATION:</strong> This service provides vehicle registration data from DVLA but
              <strong> cannot show actual MOT or tax status</strong>. For current MOT and tax information, you must use:
              <div className="mt-2 space-y-1">
                <div>• <strong>MOT Status:</strong> <a href="https://www.gov.uk/check-mot-status" target="_blank" rel="noopener noreferrer" className="underline">https://www.gov.uk/check-mot-status</a></div>
                <div>• <strong>Tax Status:</strong> <a href="https://www.gov.uk/check-vehicle-tax" target="_blank" rel="noopener noreferrer" className="underline">https://www.gov.uk/check-vehicle-tax</a></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>What This Service Provides:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>DVLA vehicle registration data (make, model, year, specifications)</li>
                <li>Complete MOT test history from official government records</li>
                <li>MOT test results, dates, mileage readings, and failure details</li>
                <li>Vehicle verification to help with purchasing decisions</li>
              </ul>
              <div className="mt-2">
                <strong>Note:</strong> When official MOT history is unavailable, demo data is clearly indicated.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
