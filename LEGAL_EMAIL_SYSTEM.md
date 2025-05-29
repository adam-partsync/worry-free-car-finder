# Legal Assessment Email System

This document describes the comprehensive email template system for the Legal Advice tool.

## Overview

The Legal Assessment Email System automatically handles the entire workflow from initial submission to case closure, providing professional communications at each stage.

## Email Templates

### 1. Submission Confirmation Email
**Trigger:** Immediately after form submission
**Purpose:** Confirm receipt and provide case reference
**Features:**
- Professional branded design with gradient header
- Case reference number generation
- Timeline of next steps
- Submission summary
- Urgency-specific messaging for critical cases
- Contact information for follow-up

### 2. Initial Assessment Email
**Trigger:** 24-48 hours after submission (3 seconds in development)
**Purpose:** Provide professional legal analysis and recommendations
**Features:**
- Case strength assessment with visual indicators
- Success likelihood percentage
- Estimated claim value
- Issue-specific legal guidance
- Your rights explanation
- Time limitation warnings
- Recommended next steps with timeline
- Service options pricing table
- Immediate action items

### 3. Urgent Follow-up Email
**Trigger:** For time-sensitive cases or critical urgency
**Purpose:** Alert users to immediate action requirements
**Features:**
- High-priority design with red alerts
- Time limit warnings
- Emergency contact information
- Critical action checklist
- Available emergency services

### 4. Case Closure Email
**Trigger:** When case is resolved
**Purpose:** Confirm case completion and gather feedback
**Features:**
- Success confirmation
- Case outcome summary
- Feedback request
- Archive instructions

## API Endpoints

### POST /api/legal-advice/submit
Handles form submissions and triggers email workflow.

**Request Body:**
```json
{
  "issueType": "faulty-car",
  "timeframe": "last-week",
  "vehicleValue": 15000,
  "lossAmount": 2500,
  "description": "Detailed issue description...",
  "actionsTaken": ["Contacted the seller/dealer"],
  "urgency": "high",
  "contactMethod": "email",
  "fullName": "John Smith",
  "email": "john.smith@example.com",
  "phone": "07123456789",
  "serviceOption": "free"
}
```

**Response:**
```json
{
  "success": true,
  "caseId": "LAD-123456",
  "message": "Your legal issue has been submitted successfully...",
  "assessment": {
    "strength": "strong",
    "successRate": 85,
    "estimatedTimeframe": "24-48 hours",
    "nextSteps": ["Document all faults...", "Send formal complaint..."],
    "urgentAction": true
  }
}
```

## Assessment Algorithm

The system automatically generates legal assessments based on:

### Issue Type Factors
- **Faulty Car from Dealer:** Strong case (85% success rate)
- **Finance Issues:** Strong case (80% success rate)
- **Fraud/Scam:** Very strong case (90% success rate)
- **Private Sale:** Weaker case (45% success rate)
- **Insurance Disputes:** Medium case (60% success rate)

### Timeframe Adjustments
- **Within 1 week:** +10% success rate (urgent action for faulty cars)
- **Within 1 month:** +5% success rate
- **1-3 months:** No adjustment
- **3-6 months:** -10% success rate
- **Over 6 months:** -30% success rate (urgent action triggered)

### Actions Taken Impact
- **No prior action:** +10% (fresh case)
- **Extensive prior action (5+ steps):** -10% (complex case)

## Email Content Features

### Professional Design
- Responsive HTML templates
- Branded color scheme (blue/purple gradients)
- Mobile-friendly layouts
- Professional typography

### Interactive Elements
- Visual strength meters
- Progress timelines
- Service pricing tables
- Call-to-action buttons
- Progress indicators

### Legal Specificity
- Issue-specific guidance for each motor trade problem
- Accurate legal rights information
- Time limitation warnings
- Recommended action sequences
- Emergency contact protocols

## Development vs Production

### Development Mode
- Emails logged to console instead of sent
- 3-second delay for assessment emails
- 5-minute delay for urgent follow-ups
- Full email content displayed in logs

### Production Mode
- Real SMTP sending via configured service
- 24-hour delay for assessment emails
- 4-hour delay for urgent follow-ups
- Email delivery confirmation

## Configuration

Set these environment variables for production:

```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password
FROM_EMAIL=legal@worryfreecars.co.uk
FROM_NAME=Worry Free Car Finder Legal Team
```

## Usage Example

```typescript
import { legalEmailService } from '@/lib/services/legal-email-service';

// Process a submission
const result = await legalEmailService.processLegalSubmission({
  issueType: 'faulty-car',
  fullName: 'John Smith',
  email: 'john@example.com',
  // ... other fields
});

// Generate manual assessment
const assessment = legalEmailService.generateAssessment(submission);

// Send specific emails
await legalEmailService.sendSubmissionConfirmation(submission);
await legalEmailService.sendInitialAssessment(submission, assessment);
await legalEmailService.sendUrgentFollowUp(submission);
await legalEmailService.sendCaseClosure(caseId, outcome, email, fullName);
```

## Legal Disclaimers

All emails include appropriate legal disclaimers:
- "This service provides general legal guidance only"
- "Does not constitute formal legal advice"
- "For complex issues, consult a qualified solicitor"
- "Time limits may apply to legal claims"

## Integration Points

### Frontend Form
- Real-time validation
- Progress indicators
- Success/error feedback
- Case reference display

### Backend Processing
- Form validation
- Assessment generation
- Email scheduling
- Case tracking

### Email Service
- Template rendering
- SMTP delivery
- Error handling
- Delivery tracking

## Success Metrics

The system tracks:
- Submission completion rates
- Email open rates (when configured)
- Response times
- Case resolution rates
- Client satisfaction scores

## Future Enhancements

Planned improvements:
- Email tracking and analytics
- Automated case status updates
- Integration with CRM systems
- SMS notifications for urgent cases
- Multi-language support
- Advanced personalization
- Machine learning for assessment accuracy
