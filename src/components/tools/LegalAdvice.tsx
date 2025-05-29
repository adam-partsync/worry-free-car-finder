"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Scale,
  Search,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  ExternalLink,
  Book,
  Users,
  Clock,
  Info,
  HelpCircle,
  MessageSquare,
  Gavel,
  User,
  Upload,
  Send,
  PaperclipIcon,
  Calendar
} from "lucide-react";

interface LegalTopic {
  id: string;
  category: string;
  title: string;
  description: string;
  content: string;
  severity: 'info' | 'warning' | 'urgent';
  relatedRights: string[];
  nextSteps: string[];
  resources: Array<{
    title: string;
    url: string;
    type: 'government' | 'legal' | 'consumer';
  }>;
}

interface LegalQuery {
  category: string;
  description: string;
  urgency: string;
  amount: string;
  documents: string[];
}

interface GetHelpForm {
  issueType: string;
  timeframe: string;
  vehicleValue: string;
  lossAmount: string;
  description: string;
  actionsTaken: string[];
  urgency: string;
  contactMethod: string;
  fullName: string;
  email: string;
  phone: string;
  serviceOption: string;
}

interface SubmissionResult {
  success: boolean;
  caseId?: string;
  message?: string;
  assessment?: {
    strength: string;
    successRate: number;
    estimatedTimeframe: string;
    nextSteps: string[];
    urgentAction: boolean;
  };
  error?: string;
}

// Mock legal topics database
const legalTopics: LegalTopic[] = [
  {
    id: "1",
    category: "Consumer Rights",
    title: "Faulty Car from Dealer - Your Rights",
    description: "What to do when you buy a faulty car from a dealer",
    content: "Under the Consumer Rights Act 2015, you have strong protection when buying from a dealer. If the car is faulty, not as described, or not fit for purpose, you have the right to reject it within 30 days for a full refund. After 30 days, you can still claim repair or replacement.",
    severity: "info",
    relatedRights: [
      "30-day right to reject",
      "Right to repair or replacement",
      "Right to partial refund after 6 months",
      "Protection against misleading descriptions"
    ],
    nextSteps: [
      "Document all faults with photos and videos",
      "Contact the dealer in writing immediately",
      "Keep all receipts and paperwork",
      "Seek independent mechanical assessment if needed"
    ],
    resources: [
      {
        title: "Consumer Rights Act 2015 - Gov.uk",
        url: "https://www.gov.uk/consumer-protection-rights",
        type: "government"
      },
      {
        title: "Citizens Advice - Faulty Cars",
        url: "https://www.citizensadvice.org.uk",
        type: "consumer"
      }
    ]
  },
  {
    id: "2",
    category: "Private Sales",
    title: "Buying from Private Seller - Risks & Rights",
    description: "Limited rights when buying privately - what you need to know",
    content: "When buying from a private seller, you have very limited legal protection. The car must match its description and the seller must have legal right to sell it. However, there's no automatic right to return the car if it develops faults.",
    severity: "warning",
    relatedRights: [
      "Car must match description given",
      "Seller must have legal right to sell",
      "Protection against misrepresentation",
      "Right to cancel if fraudulent sale"
    ],
    nextSteps: [
      "Get everything in writing",
      "Check V5C registration document carefully",
      "Arrange independent inspection before buying",
      "Verify seller's identity and address"
    ],
    resources: [
      {
        title: "DVLA Vehicle Registration",
        url: "https://www.gov.uk/check-vehicle-tax",
        type: "government"
      },
      {
        title: "RAC Car Buying Guide",
        url: "https://www.rac.co.uk/buying-a-car",
        type: "consumer"
      }
    ]
  },
  {
    id: "3",
    category: "Finance & Credit",
    title: "Car Finance Disputes and Problems",
    description: "Issues with car finance agreements and your options",
    content: "Car finance agreements are regulated by the FCA. You have rights if the finance company misled you, if the car is faulty, or if you're struggling with payments. Section 75 of the Consumer Credit Act may also provide protection.",
    severity: "info",
    relatedRights: [
      "Right to voluntary termination after 50% paid",
      "Section 75 protection for credit purchases",
      "Right to complain to Financial Ombudsman",
      "Protection against unfair lending practices"
    ],
    nextSteps: [
      "Review your finance agreement carefully",
      "Contact finance company to discuss options",
      "Consider voluntary termination if eligible",
      "Seek debt advice if struggling with payments"
    ],
    resources: [
      {
        title: "Financial Conduct Authority",
        url: "https://www.fca.org.uk",
        type: "government"
      },
      {
        title: "Financial Ombudsman Service",
        url: "https://www.financial-ombudsman.org.uk",
        type: "government"
      }
    ]
  },
  {
    id: "4",
    category: "Insurance Claims",
    title: "Insurance Disputes and Claims Issues",
    description: "When insurance companies refuse claims or offer unfair settlements",
    content: "If your insurance company refuses a claim unfairly or offers a settlement that's too low, you have rights. The Financial Ombudsman Service can investigate complaints about insurance companies for free.",
    severity: "warning",
    relatedRights: [
      "Right to fair claims assessment",
      "Right to challenge settlement offers",
      "Right to complain to Financial Ombudsman",
      "Right to independent engineer assessment"
    ],
    nextSteps: [
      "Get all claim decisions in writing",
      "Request detailed explanation of refusal",
      "Obtain independent valuation if needed",
      "File complaint with insurance company first"
    ],
    resources: [
      {
        title: "Association of British Insurers",
        url: "https://www.abi.org.uk",
        type: "consumer"
      },
      {
        title: "Financial Ombudsman Service",
        url: "https://www.financial-ombudsman.org.uk",
        type: "government"
      }
    ]
  },
  {
    id: "5",
    category: "Trading Standards",
    title: "Reporting Dodgy Dealers and Fraud",
    description: "How to report fraudulent dealers and get help",
    content: "If a dealer has misled you, sold you a stolen car, or engaged in fraudulent practices, you can report them to Trading Standards and Action Fraud. This helps protect other consumers and may result in prosecution.",
    severity: "urgent",
    relatedRights: [
      "Right to report fraudulent activity",
      "Right to Trading Standards investigation",
      "Right to police investigation for fraud",
      "Right to compensation through court action"
    ],
    nextSteps: [
      "Report to Action Fraud immediately",
      "Contact local Trading Standards",
      "Gather all evidence and documentation",
      "Consider civil action for compensation"
    ],
    resources: [
      {
        title: "Action Fraud",
        url: "https://www.actionfraud.police.uk",
        type: "government"
      },
      {
        title: "Trading Standards",
        url: "https://www.tradingstandards.uk",
        type: "government"
      }
    ]
  }
];

const legalCategories = [
  "Consumer Rights",
  "Private Sales",
  "Finance & Credit",
  "Insurance Claims",
  "Trading Standards",
  "Warranty Issues",
  "Accident Claims",
  "Vehicle Defects"
];

export default function LegalAdvice() {
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [legalQuery, setLegalQuery] = useState<LegalQuery>({
    category: "",
    description: "",
    urgency: "",
    amount: "",
    documents: []
  });
  const [getHelpForm, setGetHelpForm] = useState<GetHelpForm>({
    issueType: "",
    timeframe: "",
    vehicleValue: "",
    lossAmount: "",
    description: "",
    actionsTaken: [],
    urgency: "",
    contactMethod: "",
    fullName: "",
    email: "",
    phone: "",
    serviceOption: "free"
  });
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState(legalTopics);

  const handleSearch = () => {
    let filtered = legalTopics;

    if (selectedCategory) {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTopics(filtered);
  };

  const handleActionTakenChange = (action: string, checked: boolean) => {
    setGetHelpForm(prev => ({
      ...prev,
      actionsTaken: checked
        ? [...prev.actionsTaken, action]
        : prev.actionsTaken.filter(a => a !== action)
    }));
  };

  const handleGetHelpSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await fetch('/api/legal-advice/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...getHelpForm,
          vehicleValue: Number(getHelpForm.vehicleValue),
          lossAmount: Number(getHelpForm.lossAmount)
        })
      });

      const result: SubmissionResult = await response.json();
      setSubmissionResult(result);

      if (result.success) {
        // Clear form on success
        setGetHelpForm({
          issueType: "",
          timeframe: "",
          vehicleValue: "",
          lossAmount: "",
          description: "",
          actionsTaken: [],
          urgency: "",
          contactMethod: "",
          fullName: "",
          email: "",
          phone: "",
          serviceOption: "free"
        });
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        error: 'Failed to submit your request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Important</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800">Information</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <Shield className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'government':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'legal':
        return <Scale className="h-4 w-4 text-purple-600" />;
      case 'consumer':
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <Scale className="h-8 w-8 text-blue-600" />
          Legal Advice for Motor Trade
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get expert legal guidance for car buying, selling, and motor trade issues.
          Know your rights, understand regulations, and get help with disputes.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="browse">Browse Topics</TabsTrigger>
          <TabsTrigger value="ask">Ask Question</TabsTrigger>
          <TabsTrigger value="get-help">Get Help</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Help</TabsTrigger>
          <TabsTrigger value="resources">Legal Resources</TabsTrigger>
        </TabsList>

        {/* Browse Topics Tab */}
        <TabsContent value="browse" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Legal Guidance
              </CardTitle>
              <CardDescription>
                Search for legal advice on car buying, selling, and motor trade issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {legalCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="search">Search Terms</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      placeholder="e.g., faulty car, refund, warranty"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Topics */}
          <div className="space-y-4">
            {filteredTopics.map((topic) => (
              <Card key={topic.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(topic.severity)}
                      <div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{topic.category}</Badge>
                      {getSeverityBadge(topic.severity)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{topic.content}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">Your Rights:</h4>
                      <ul className="space-y-1">
                        {topic.relatedRights.map((right, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {right}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                      <ul className="space-y-1">
                        {topic.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center justify-center font-semibold">
                              {index + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {topic.resources.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Helpful Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {topic.resources.map((resource, index) => (
                          <Button key={index} variant="outline" size="sm" className="flex items-center gap-2">
                            {getResourceIcon(resource.type)}
                            {resource.title}
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Ask Question Tab */}
        <TabsContent value="ask" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Submit Legal Query
              </CardTitle>
              <CardDescription>
                Describe your situation and get guidance on your legal options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="queryCategory">Category</Label>
                  <Select value={legalQuery.category} onValueChange={(value) => setLegalQuery(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {legalCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <Select value={legalQuery.urgency} onValueChange={(value) => setLegalQuery(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General inquiry</SelectItem>
                      <SelectItem value="medium">Medium - Need advice soon</SelectItem>
                      <SelectItem value="high">High - Urgent legal issue</SelectItem>
                      <SelectItem value="emergency">Emergency - Immediate help needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Amount Involved (£)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="e.g., 15000"
                  value={legalQuery.amount}
                  onChange={(e) => setLegalQuery(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Describe Your Situation</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide details about your legal issue, including dates, amounts, and any actions you've already taken..."
                  value={legalQuery.description}
                  onChange={(e) => setLegalQuery(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Disclaimer:</strong> This service provides general legal guidance only and should not be considered as formal legal advice.
                  For complex issues or formal representation, please consult a qualified solicitor.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Query
                </Button>
                <Button variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Find a Solicitor
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Get Help Tab */}
        <TabsContent value="get-help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Have an Issue? Get Help
              </CardTitle>
              <CardDescription>
                Submit your specific legal issue and get personalized advice and next steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Issue Type Selection */}
              {/* Submission Result */}
              {submissionResult && (
                <Alert className={submissionResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  {submissionResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={submissionResult.success ? "text-green-800" : "text-red-800"}>
                    {submissionResult.success ? (
                      <div>
                        <strong>✅ Submission Successful!</strong>
                        <p className="mt-2">{submissionResult.message}</p>
                        <p className="mt-1"><strong>Case Reference:</strong> {submissionResult.caseId}</p>
                        {submissionResult.assessment && (
                          <div className="mt-3">
                            <p><strong>Initial Assessment:</strong></p>
                            <ul className="mt-1 ml-4 list-disc">
                              <li>Case strength: <strong>{submissionResult.assessment.strength}</strong></li>
                              <li>Success likelihood: <strong>{submissionResult.assessment.successRate}%</strong></li>
                              <li>Response time: <strong>{submissionResult.assessment.estimatedTimeframe}</strong></li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <strong>❌ Submission Failed</strong>
                        <p className="mt-1">{submissionResult.error}</p>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issueType">Type of Issue</Label>
                  <Select value={getHelpForm.issueType} onValueChange={(value) => setGetHelpForm(prev => ({ ...prev, issueType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faulty-car">Faulty Car from Dealer</SelectItem>
                      <SelectItem value="refund-dispute">Refund Dispute</SelectItem>
                      <SelectItem value="warranty-claim">Warranty Claim Rejected</SelectItem>
                      <SelectItem value="finance-issue">Car Finance Problem</SelectItem>
                      <SelectItem value="insurance-dispute">Insurance Claim Dispute</SelectItem>
                      <SelectItem value="private-sale">Private Sale Gone Wrong</SelectItem>
                      <SelectItem value="fraud-scam">Fraud or Scam</SelectItem>
                      <SelectItem value="other">Other Motor Trade Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeframe">When Did This Happen?</Label>
                  <Select value={getHelpForm.timeframe} onValueChange={(value) => setGetHelpForm(prev => ({ ...prev, timeframe: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Within the last week</SelectItem>
                      <SelectItem value="last-month">Within the last month</SelectItem>
                      <SelectItem value="last-3months">1-3 months ago</SelectItem>
                      <SelectItem value="last-6months">3-6 months ago</SelectItem>
                      <SelectItem value="over-6months">Over 6 months ago</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Financial Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleValue">Vehicle Value/Purchase Price (£)</Label>
                  <Input
                    id="vehicleValue"
                    type="number"
                    placeholder="e.g., 15000"
                    value={getHelpForm.vehicleValue}
                    onChange={(e) => setGetHelpForm(prev => ({ ...prev, vehicleValue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lossAmount">Estimated Loss/Damage (£)</Label>
                  <Input
                    id="lossAmount"
                    type="number"
                    placeholder="e.g., 2500"
                    value={getHelpForm.lossAmount}
                    onChange={(e) => setGetHelpForm(prev => ({ ...prev, lossAmount: e.target.value }))}
                  />
                </div>
              </div>

              {/* Issue Description */}
              <div>
                <Label htmlFor="issueDescription">Describe Your Issue in Detail</Label>
                <Textarea
                  id="issueDescription"
                  placeholder="Please provide a detailed description of your issue including:
• What happened and when
• What you purchased and from whom
• What went wrong
• Any communication with the seller/dealer
• Steps you've already taken
• What outcome you're seeking"
                  rows={8}
                  value={getHelpForm.description}
                  onChange={(e) => setGetHelpForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Actions Taken */}
              <div>
                <Label htmlFor="actionsTaken">What Actions Have You Already Taken?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {[
                    "Contacted the seller/dealer",
                    "Sent written complaint",
                    "Contacted manufacturer",
                    "Spoke to finance company",
                    "Contacted insurance",
                    "Sought independent assessment",
                    "Contacted Trading Standards",
                    "Consulted Citizens Advice",
                    "Obtained legal advice",
                    "Started court proceedings"
                  ].map((action) => (
                    <label key={action} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={getHelpForm.actionsTaken.includes(action)}
                        onChange={(e) => handleActionTakenChange(action, e.target.checked)}
                      />
                      <span className="text-sm">{action}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <Label htmlFor="documents">Upload Supporting Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Upload purchase agreements, receipts, correspondence, photos, etc. (Max 10MB per file)
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <PaperclipIcon className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>

              {/* Urgency and Contact Preference */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="urgency">How Urgent Is This?</Label>
                  <Select value={getHelpForm.urgency} onValueChange={(value) => setGetHelpForm(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General advice needed</SelectItem>
                      <SelectItem value="medium">Medium - Need response within a few days</SelectItem>
                      <SelectItem value="high">High - Need urgent advice</SelectItem>
                      <SelectItem value="critical">Critical - Time-sensitive legal issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactMethod">Preferred Contact Method</Label>
                  <Select value={getHelpForm.contactMethod} onValueChange={(value) => setGetHelpForm(prev => ({ ...prev, contactMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How should we contact you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email response</SelectItem>
                      <SelectItem value="phone">Phone consultation</SelectItem>
                      <SelectItem value="video">Video consultation</SelectItem>
                      <SelectItem value="written">Written legal advice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={getHelpForm.fullName}
                    onChange={(e) => setGetHelpForm(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={getHelpForm.phone}
                    onChange={(e) => setGetHelpForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={getHelpForm.email}
                  onChange={(e) => setGetHelpForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              {/* Service Options */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Service Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-semibold">Free Initial Assessment</h4>
                      <p className="text-sm text-gray-600">Basic guidance and next steps</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">FREE</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-semibold">Professional Legal Advice</h4>
                      <p className="text-sm text-gray-600">Detailed consultation with qualified solicitor</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">£99</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <h4 className="font-semibold">Letter Writing Service</h4>
                      <p className="text-sm text-gray-600">Professional demand letter on solicitor letterhead</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">£149</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Legal Disclaimer */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> By submitting this form, you understand that this is for initial guidance only.
                  Formal legal advice requires a proper consultation with a qualified solicitor. All information provided will be treated confidentially.
                </AlertDescription>
              </Alert>

              {/* Submit Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setGetHelpForm(prev => ({ ...prev, serviceOption: 'free' }));
                    handleGetHelpSubmit();
                  }}
                  disabled={isSubmitting || !getHelpForm.issueType || !getHelpForm.fullName || !getHelpForm.email || !getHelpForm.description}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit for Free Assessment
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setGetHelpForm(prev => ({ ...prev, serviceOption: 'paid-consultation' }));
                    handleGetHelpSubmit();
                  }}
                  disabled={isSubmitting || !getHelpForm.issueType || !getHelpForm.fullName || !getHelpForm.email || !getHelpForm.description}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Paid Consultation (£99)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Review & Assessment</h4>
                  <p className="text-sm text-gray-600">
                    Our legal team reviews your case within 24 hours and assesses your options.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Initial Guidance</h4>
                  <p className="text-sm text-gray-600">
                    You receive initial guidance on your rights, options, and recommended next steps.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Professional Support</h4>
                  <p className="text-sm text-gray-600">
                    If needed, we can connect you with qualified solicitors for formal representation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Help Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Emergency Legal Situations</strong> - If you need immediate legal help with a motor trade issue
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Immediate Action Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Action Fraud</p>
                      <p className="text-sm text-gray-600">0300 123 2040</p>
                      <p className="text-xs text-gray-500">Report fraud immediately</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Trading Standards</p>
                      <p className="text-sm text-gray-600">03454 04 05 06</p>
                      <p className="text-xs text-gray-500">Report dodgy dealers</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <Gavel className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-semibold">Emergency Legal Aid</p>
                      <p className="text-sm text-gray-600">0345 345 4 345</p>
                      <p className="text-xs text-gray-500">24/7 legal helpline</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What Constitutes an Emergency?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">You've been sold a stolen vehicle</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Dealer has disappeared with your money</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Court proceedings issued against you</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Vehicle seized by authorities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Threatened with immediate legal action</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Legal Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Government Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Gov.uk Consumer Rights
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  DVLA Vehicle Check
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Trading Standards
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Financial Ombudsman
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Consumer Organizations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Citizens Advice
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Which? Legal
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  RAC Legal Services
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  AA Legal Advice
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-purple-600" />
                  Legal Professionals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Law Society Find a Solicitor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Legal Aid Agency
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Motor Legal Protection
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Free Legal Advice Centres
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Important Legal Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-2">
              <p>• This service provides general guidance only and should not be considered formal legal advice</p>
              <p>• Every legal situation is unique and may require professional assessment</p>
              <p>• Time limits may apply to legal claims - seek advice promptly</p>
              <p>• For representation in court or complex disputes, consult a qualified solicitor</p>
              <p>• Emergency situations may require immediate professional legal help</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
