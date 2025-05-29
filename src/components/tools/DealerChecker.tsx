"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PostcodeInput from "@/components/ui/PostcodeInput";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Building,
  Calendar,
  MapPin,
  Phone,
  Globe,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface DealerInfo {
  name: string;
  address: string;
  postcode: string;
  phone: string;
  website: string;
  businessAge: number;
  riskScore: number;
  fcaRegistration: {
    isRegistered: boolean;
    registrationNumber?: string;
    permissions: string[];
    status: string;
  };
  vatStatus: {
    isRegistered: boolean;
    vatNumber?: string;
    isValid: boolean;
  };
  reviews: {
    platform: string;
    rating: number;
    totalReviews: number;
    recentReviews: Array<{
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
  }[];
  warnings: string[];
  recommendations: string[];
}

export default function DealerChecker() {
  const [dealerName, setDealerName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [dealerInfo, setDealerInfo] = useState<DealerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!dealerName.trim()) {
      setError("Please enter a dealer name");
      return;
    }

    setLoading(true);
    setError("");
    setDealerInfo(null);

    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      const mockData: DealerInfo = {
        name: dealerName.trim(),
        address: "123 High Street, Sample Town",
        postcode: postcode.trim() || "SW1A 1AA",
        phone: "020 1234 5678",
        website: "www.sampledealers.co.uk",
        businessAge: 12,
        riskScore: 85, // Higher is better (0-100)
        fcaRegistration: {
          isRegistered: true,
          registrationNumber: "FCA123456",
          permissions: ["Credit Broking", "Vehicle Finance"],
          status: "Active"
        },
        vatStatus: {
          isRegistered: true,
          vatNumber: "GB123456789",
          isValid: true
        },
        reviews: [
          {
            platform: "Google Reviews",
            rating: 4.2,
            totalReviews: 127,
            recentReviews: [
              {
                rating: 5,
                comment: "Excellent service, very professional and honest throughout the process.",
                date: "2024-01-15",
                verified: true
              },
              {
                rating: 4,
                comment: "Good selection of cars, fair prices. Minor delay with paperwork.",
                date: "2024-01-10",
                verified: true
              },
              {
                rating: 2,
                comment: "Car had undisclosed issues. Eventually resolved but took time.",
                date: "2024-01-05",
                verified: false
              }
            ]
          },
          {
            platform: "Trustpilot",
            rating: 4.0,
            totalReviews: 89,
            recentReviews: []
          }
        ],
        warnings: [
          "Some negative reviews mention undisclosed vehicle issues",
          "Response time to customer queries can be slow"
        ],
        recommendations: [
          "Generally positive customer feedback",
          "Properly registered with relevant authorities",
          "Established business with good track record",
          "Request detailed vehicle history before purchase"
        ]
      };

      setDealerInfo(mockData);
      setLoading(false);
    }, 2000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskText = (score: number) => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Medium Risk";
    return "High Risk";
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Dealer Information
          </CardTitle>
          <CardDescription>
            Enter dealer details to check their credentials and reputation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dealerName">Dealer Name</Label>
              <Input
                id="dealerName"
                placeholder="e.g., Premium Motors Ltd"
                value={dealerName}
                onChange={(e) => setDealerName(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="postcode">Postcode (Optional)</Label>
              <PostcodeInput
                id="postcode"
                value={postcode}
                onChange={(value) => setPostcode(value)}
                className="mt-2"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={handleCheck}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Checking..." : "Check Dealer"}
            </Button>
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
      {dealerInfo && (
        <div className="space-y-6">
          {/* Risk Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getRiskColor(dealerInfo.riskScore)} mb-2`}>
                    {dealerInfo.riskScore}/100
                  </div>
                  <div className="text-lg font-medium mb-2">{getRiskText(dealerInfo.riskScore)}</div>
                  <Progress value={dealerInfo.riskScore} className="h-2" />
                </div>
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600 mb-2">
                    {dealerInfo.businessAge} years
                  </div>
                  <div className="text-sm text-gray-600">In Business</div>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {dealerInfo.reviews[0]?.rating.toFixed(1) || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="font-medium">{dealerInfo.address}</div>
                      <div className="text-sm text-gray-600">{dealerInfo.postcode}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div className="font-medium">{dealerInfo.phone}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <div className="font-medium">{dealerInfo.website}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* FCA Registration */}
                  <div className="flex items-center gap-2">
                    {dealerInfo.fcaRegistration.isRegistered ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">FCA Registration</div>
                      <div className="text-sm text-gray-600">
                        {dealerInfo.fcaRegistration.isRegistered
                          ? `${dealerInfo.fcaRegistration.registrationNumber} - ${dealerInfo.fcaRegistration.status}`
                          : "Not registered"
                        }
                      </div>
                    </div>
                  </div>

                  {/* VAT Status */}
                  <div className="flex items-center gap-2">
                    {dealerInfo.vatStatus.isValid ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">VAT Registration</div>
                      <div className="text-sm text-gray-600">
                        {dealerInfo.vatStatus.isRegistered
                          ? `${dealerInfo.vatStatus.vatNumber} - Valid`
                          : "Not registered"
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Customer Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dealerInfo.reviews.map((reviewSource, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{reviewSource.platform}</h4>
                        {renderStars(reviewSource.rating)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reviewSource.totalReviews} reviews
                      </div>
                    </div>

                    {reviewSource.recentReviews.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-gray-700">Recent Reviews:</h5>
                        {reviewSource.recentReviews.map((review, reviewIndex) => (
                          <div key={reviewIndex} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              {renderStars(review.rating)}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warnings and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Warnings */}
            {dealerInfo.warnings.length > 0 && (
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dealerInfo.warnings.map((warning, index) => (
                      <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <div className="text-orange-800 text-sm">{warning}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dealerInfo.recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="text-green-800 text-sm">{recommendation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <strong>About Dealer Checks:</strong> We verify FCA registration for finance dealers,
              check VAT registration status, analyze online reviews from multiple platforms, and assess
              business age and reputation. This helps you identify trustworthy dealers and avoid potential scams.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
