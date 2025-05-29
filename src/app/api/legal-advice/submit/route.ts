import { type NextRequest, NextResponse } from 'next/server';
import { legalEmailService } from '@/lib/services/legal-email-service';
import type { LegalSubmission } from '@/lib/email-templates/legal-assessment';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['issueType', 'timeframe', 'vehicleValue', 'lossAmount', 'description', 'urgency', 'contactMethod', 'fullName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address'
        },
        { status: 400 }
      );
    }

    // Validate phone number (basic UK format)
    const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
    if (!phoneRegex.test(data.phone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number'
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const vehicleValue = Number(data.vehicleValue);
    const lossAmount = Number(data.lossAmount);

    if (isNaN(vehicleValue) || vehicleValue < 0 || vehicleValue > 1000000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid vehicle value (must be between £0 and £1,000,000)'
        },
        { status: 400 }
      );
    }

    if (isNaN(lossAmount) || lossAmount < 0 || lossAmount > vehicleValue * 2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid loss amount'
        },
        { status: 400 }
      );
    }

    // Create legal submission object
    const submission: LegalSubmission = {
      issueType: data.issueType,
      timeframe: data.timeframe,
      vehicleValue,
      lossAmount,
      description: data.description.trim(),
      actionsTaken: Array.isArray(data.actionsTaken) ? data.actionsTaken : [],
      urgency: data.urgency,
      contactMethod: data.contactMethod,
      fullName: data.fullName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      serviceOption: data.serviceOption || 'free'
    };

    // Process the submission (sends emails, creates case, etc.)
    const result = await legalEmailService.processLegalSubmission(submission);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process submission'
        },
        { status: 500 }
      );
    }

    // Generate assessment for immediate response
    const assessment = legalEmailService.generateAssessment(submission);

    // Log submission for development
    console.log('📋 LEGAL ADVICE SUBMISSION');
    console.log('Case ID:', result.caseId);
    console.log('Client:', submission.fullName, '-', submission.email);
    console.log('Issue:', submission.issueType);
    console.log('Assessment:', assessment);
    console.log('---');

    return NextResponse.json({
      success: true,
      caseId: result.caseId,
      message: 'Your legal issue has been submitted successfully. You will receive a confirmation email shortly.',
      assessment: {
        strength: assessment.strength,
        successRate: assessment.successRate,
        estimatedTimeframe: getEstimatedTimeframe(submission.issueType, submission.urgency),
        nextSteps: getImmediateNextSteps(submission.issueType),
        urgentAction: assessment.urgentAction
      }
    });

  } catch (error) {
    console.error('Error in legal advice submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

function getEstimatedTimeframe(issueType: string, urgency: string): string {
  if (urgency === 'critical') {
    return '4-6 hours (emergency response)';
  }

  const timeframes: Record<string, string> = {
    'faulty-car': '24-48 hours',
    'refund-dispute': '24-48 hours',
    'warranty-claim': '2-3 business days',
    'finance-issue': '2-3 business days',
    'insurance-dispute': '3-5 business days',
    'private-sale': '24-48 hours',
    'fraud-scam': '4-6 hours (urgent)',
    'other': '2-3 business days'
  };

  return timeframes[issueType] || '2-3 business days';
}

function getImmediateNextSteps(issueType: string): string[] {
  const steps: Record<string, string[]> = {
    'faulty-car': [
      'Do not drive the vehicle if it\'s unsafe',
      'Document all faults with photos/videos',
      'Keep all paperwork safe',
      'Do not accept any settlement offers yet'
    ],
    'refund-dispute': [
      'Stop using any payment methods with the dealer',
      'Keep all correspondence',
      'Do not sign any new agreements',
      'Contact your bank/credit card company'
    ],
    'finance-issue': [
      'Continue making payments to avoid default',
      'Keep detailed records of all payments',
      'Do not sign any new agreements',
      'Check your credit file'
    ],
    'insurance-dispute': [
      'Do not accept the settlement offer',
      'Get an independent valuation',
      'Keep all damage photos',
      'Do not authorize any repairs yet'
    ],
    'fraud-scam': [
      'Report to Action Fraud immediately',
      'Contact your bank/card company',
      'Preserve all evidence',
      'Do not make any further payments'
    ]
  };

  return steps[issueType] || [
    'Preserve all documentation',
    'Do not sign anything new',
    'Keep detailed records',
    'Avoid making commitments'
  ];
}
