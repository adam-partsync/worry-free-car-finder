export interface LegalSubmission {
  issueType: string;
  timeframe: string;
  vehicleValue: number;
  lossAmount: number;
  description: string;
  actionsTaken: string[];
  urgency: string;
  contactMethod: string;
  fullName: string;
  email: string;
  phone: string;
  serviceOption: 'free' | 'paid-consultation' | 'letter-service';
}

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export class LegalAssessmentEmailTemplates {

  // Confirmation email sent immediately after submission
  static getSubmissionConfirmation(submission: LegalSubmission): EmailTemplate {
    const caseId = `LAD-${Date.now().toString().slice(-6)}`;

    const subject = `Legal Assessment Submitted - Case ${caseId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Assessment Confirmation</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
        .case-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .urgency-high { border-left: 4px solid #dc2626; }
        .urgency-medium { border-left: 4px solid #f59e0b; }
        .urgency-low { border-left: 4px solid #10b981; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .timeline { margin: 20px 0; }
        .timeline-step { padding: 10px 0; border-left: 3px solid #e5e7eb; padding-left: 20px; margin-left: 10px; }
        .timeline-step.active { border-left-color: #2563eb; }
        ul { padding-left: 20px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚖️ Legal Assessment Submitted</h1>
            <p>We've received your legal issue submission</p>
        </div>

        <div class="content">
            <div class="case-box">
                <h3>Case Reference: <strong>${caseId}</strong></h3>
                <p><strong>Issue Type:</strong> ${this.getIssueTypeLabel(submission.issueType)}</p>
                <p><strong>Urgency:</strong> ${submission.urgency}</p>
                <p><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}</p>
            </div>

            <p>Dear ${submission.fullName},</p>

            <p>Thank you for submitting your legal issue to Worry Free Car Finder's Legal Advisory Service. We have received your case and our legal assessment team will begin reviewing it shortly.</p>

            <h3>What Happens Next:</h3>
            <div class="timeline">
                <div class="timeline-step active">
                    <strong>✅ Step 1: Case Received</strong><br>
                    Your submission has been logged and assigned case reference ${caseId}
                </div>
                <div class="timeline-step">
                    <strong>⏳ Step 2: Initial Review (24-48 hours)</strong><br>
                    Our legal team will conduct an initial assessment of your case
                </div>
                <div class="timeline-step">
                    <strong>📞 Step 3: Response & Guidance</strong><br>
                    You'll receive our initial assessment via ${submission.contactMethod}
                </div>
            </div>

            <h3>Your Submission Summary:</h3>
            <ul>
                <li><strong>Issue Type:</strong> ${this.getIssueTypeLabel(submission.issueType)}</li>
                <li><strong>Vehicle Value:</strong> £${submission.vehicleValue.toLocaleString()}</li>
                <li><strong>Estimated Loss:</strong> £${submission.lossAmount.toLocaleString()}</li>
                <li><strong>When it happened:</strong> ${this.getTimeframeLabel(submission.timeframe)}</li>
                <li><strong>Service requested:</strong> ${this.getServiceLabel(submission.serviceOption)}</li>
            </ul>

            ${submission.urgency === 'critical' ? `
            <div class="case-box urgency-high">
                <h4>🚨 Critical Urgency Notice</h4>
                <p>We understand this is a time-sensitive matter. Our team will prioritize your case and aim to respond within 4-6 hours during business hours.</p>
                <p><strong>Emergency Contact:</strong> 0800 123 4567 (Mon-Fri 9am-6pm)</p>
            </div>
            ` : ''}

            <p><strong>Important:</strong> Please keep this email and your case reference number for your records. You'll need it for any follow-up communications.</p>

            <center>
                <a href="mailto:legal@worryfreecars.co.uk?subject=Case ${caseId}" class="button">Contact Us About This Case</a>
            </center>
        </div>

        <div class="footer">
            <p><strong>Worry Free Car Finder - Legal Advisory Service</strong></p>
            <p>📧 legal@worryfreecars.co.uk | 📞 0800 123 4567</p>
            <p><small>This email confirms receipt of your legal query. It does not constitute legal advice.</small></p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
Legal Assessment Submitted - Case ${caseId}

Dear ${submission.fullName},

Thank you for submitting your legal issue to Worry Free Car Finder's Legal Advisory Service.

Case Reference: ${caseId}
Issue Type: ${this.getIssueTypeLabel(submission.issueType)}
Urgency: ${submission.urgency}
Submitted: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}

What Happens Next:
1. ✅ Case Received - Your submission has been logged
2. ⏳ Initial Review (24-48 hours) - Our legal team will assess your case
3. 📞 Response & Guidance - You'll receive our assessment via ${submission.contactMethod}

Your Submission Summary:
- Issue Type: ${this.getIssueTypeLabel(submission.issueType)}
- Vehicle Value: £${submission.vehicleValue.toLocaleString()}
- Estimated Loss: £${submission.lossAmount.toLocaleString()}
- When it happened: ${this.getTimeframeLabel(submission.timeframe)}
- Service requested: ${this.getServiceLabel(submission.serviceOption)}

Please keep this email and case reference ${caseId} for your records.

Contact us: legal@worryfreecars.co.uk | 0800 123 4567

Worry Free Car Finder - Legal Advisory Service
This email confirms receipt of your legal query. It does not constitute legal advice.
`;

    return { subject, htmlContent, textContent };
  }

  // Initial assessment email with legal guidance
  static getInitialAssessment(submission: LegalSubmission, assessment: any): EmailTemplate {
    const caseId = `LAD-${Date.now().toString().slice(-6)}`;

    const subject = `Legal Assessment Complete - Case ${caseId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Assessment Results</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
        .assessment-box { background: #f0f9ff; border: 1px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .rights-box { background: #f0fdf4; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .warning-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .action-box { background: #fdf2f8; border: 1px solid #ec4899; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .strength-meter { display: flex; gap: 5px; margin: 10px 0; }
        .strength-bar { height: 8px; width: 20px; border-radius: 4px; }
        .strength-strong { background: #22c55e; }
        .strength-medium { background: #f59e0b; }
        .strength-weak { background: #ef4444; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        .button-secondary { background: #6b7280; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
        .timeline { margin: 20px 0; }
        .timeline-item { display: flex; align-items: center; margin: 10px 0; }
        .timeline-number { background: #2563eb; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; }
        .price-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .price-table th, .price-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .price-table th { background: #f9fafb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚖️ Legal Assessment Complete</h1>
            <p>Professional analysis of your motor trade issue</p>
        </div>

        <div class="content">
            <p>Dear ${submission.fullName},</p>

            <p>We have completed our initial legal assessment of your case. Please find our professional analysis and recommendations below.</p>

            <div class="assessment-box">
                <h3>📋 Case Assessment Summary</h3>
                <p><strong>Case:</strong> ${caseId} - ${this.getIssueTypeLabel(submission.issueType)}</p>
                <p><strong>Case Strength:</strong></p>
                <div class="strength-meter">
                    ${this.getStrengthMeter(assessment.strength)}
                </div>
                <p><strong>Likelihood of Success:</strong> ${assessment.successRate}%</p>
                <p><strong>Estimated Claim Value:</strong> £${assessment.estimatedClaim.toLocaleString()}</p>
            </div>

            ${this.getIssueSpecificGuidance(submission.issueType)}

            <div class="rights-box">
                <h3>✅ Your Rights</h3>
                <ul>
                    ${this.getRightsForIssue(submission.issueType).map(right => `<li>${right}</li>`).join('')}
                </ul>
            </div>

            ${submission.timeframe === 'over-6months' ? `
            <div class="warning-box">
                <h3>⚠️ Time Limitation Warning</h3>
                <p>Your issue occurred over 6 months ago. While you may still have rights, some time limits for certain actions may have passed. We recommend acting quickly.</p>
                <p><strong>Key time limits in motor trade disputes:</strong></p>
                <ul>
                    <li>Consumer Rights Act claims: 6 months for reversal of burden of proof</li>
                    <li>County Court claims: 6 years from date of purchase</li>
                    <li>Credit card Section 75 claims: 6 years from breach</li>
                </ul>
            </div>
            ` : ''}

            <div class="action-box">
                <h3>🎯 Recommended Next Steps</h3>
                <div class="timeline">
                    ${this.getNextSteps(submission.issueType).map((step, index) => `
                    <div class="timeline-item">
                        <div class="timeline-number">${index + 1}</div>
                        <div>${step}</div>
                    </div>
                    `).join('')}
                </div>
            </div>

            <h3>💰 Service Options to Proceed</h3>
            <table class="price-table">
                <tr>
                    <th>Service</th>
                    <th>What's Included</th>
                    <th>Cost</th>
                    <th>Timeframe</th>
                </tr>
                <tr>
                    <td><strong>Professional Letter</strong></td>
                    <td>Formal demand letter on solicitor letterhead citing your rights and demanding resolution</td>
                    <td>£149</td>
                    <td>2-3 days</td>
                </tr>
                <tr>
                    <td><strong>Full Legal Consultation</strong></td>
                    <td>30-minute consultation with qualified solicitor, detailed written advice, action plan</td>
                    <td>£99</td>
                    <td>3-5 days</td>
                </tr>
                <tr>
                    <td><strong>Case Management</strong></td>
                    <td>Full representation throughout dispute resolution process</td>
                    <td>From £299</td>
                    <td>2-8 weeks</td>
                </tr>
            </table>

            <h3>📞 Immediate Actions You Can Take</h3>
            <ul>
                <li><strong>Preserve Evidence:</strong> Keep all documents, photos, and correspondence safe</li>
                <li><strong>Do Not Accept:</strong> Unfair settlement offers or admissions of fault</li>
                <li><strong>Record Everything:</strong> Keep notes of all phone calls and meetings</li>
                <li><strong>Act Quickly:</strong> Time limits apply to many consumer rights</li>
            </ul>

            <center>
                <a href="mailto:legal@worryfreecars.co.uk?subject=Case ${caseId} - Proceed with Legal Letter" class="button">Order Legal Letter (£149)</a>
                <a href="mailto:legal@worryfreecars.co.uk?subject=Case ${caseId} - Book Consultation" class="button button-secondary">Book Consultation (£99)</a>
            </center>

            <p><strong>Important Disclaimer:</strong> This assessment provides general guidance based on the information provided. For formal legal advice specific to your circumstances, we recommend a full consultation with one of our qualified solicitors.</p>
        </div>

        <div class="footer">
            <p><strong>Worry Free Car Finder - Legal Advisory Service</strong></p>
            <p>📧 legal@worryfreecars.co.uk | 📞 0800 123 4567</p>
            <p><small>This assessment is for guidance only and does not constitute formal legal advice.</small></p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
Legal Assessment Complete - Case ${caseId}

Dear ${submission.fullName},

We have completed our initial legal assessment of your case.

CASE ASSESSMENT SUMMARY
Case: ${caseId} - ${this.getIssueTypeLabel(submission.issueType)}
Likelihood of Success: ${assessment.successRate}%
Estimated Claim Value: £${assessment.estimatedClaim.toLocaleString()}

YOUR RIGHTS
${this.getRightsForIssue(submission.issueType).map(right => `• ${right}`).join('\n')}

RECOMMENDED NEXT STEPS
${this.getNextSteps(submission.issueType).map((step, index) => `${index + 1}. ${step}`).join('\n')}

SERVICE OPTIONS
• Professional Letter (£149) - Formal demand letter on solicitor letterhead
• Full Legal Consultation (£99) - 30-minute consultation with qualified solicitor
• Case Management (From £299) - Full representation throughout dispute process

IMMEDIATE ACTIONS
• Preserve all evidence and documentation
• Do not accept unfair settlement offers
• Record all phone calls and meetings
• Act quickly as time limits apply

To proceed, reply to this email or call 0800 123 4567.

Worry Free Car Finder - Legal Advisory Service
This assessment is for guidance only and does not constitute formal legal advice.
`;

    return { subject, htmlContent, textContent };
  }

  // Follow-up email for cases requiring urgent action
  static getUrgentFollowUp(submission: LegalSubmission): EmailTemplate {
    const caseId = `LAD-${Date.now().toString().slice(-6)}`;

    const subject = `⚠️ URGENT: Time-Sensitive Action Required - Case ${caseId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .urgent-header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #dc2626; }
        .footer { background: #fef2f2; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #dc2626; border-top: none; }
        .warning-box { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .action-box { background: #fee2e2; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button-urgent { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: bold; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="urgent-header">
            <h1>🚨 URGENT ACTION REQUIRED</h1>
            <p>Time-sensitive legal matter requires immediate attention</p>
        </div>

        <div class="content">
            <p>Dear ${submission.fullName},</p>

            <div class="warning-box">
                <h3>⏰ Time Limit Warning</h3>
                <p>Based on our assessment of your case, there are critical time limits approaching that could affect your legal rights.</p>
            </div>

            <div class="action-box">
                <h3>🎯 IMMEDIATE ACTIONS REQUIRED</h3>
                <ul>
                    <li><strong>Contact the seller/dealer TODAY</strong> - Put your complaint in writing</li>
                    <li><strong>Preserve all evidence</strong> - Photos, documents, correspondence</li>
                    <li><strong>Do not sign anything</strong> - Without legal review first</li>
                    <li><strong>Consider professional legal action</strong> - Time limits are critical</li>
                </ul>
            </div>

            <h3>Why This Is Urgent:</h3>
            <p>Motor trade disputes often have strict time limits:</p>
            <ul>
                <li>Consumer Rights Act - 30 days for full refund right</li>
                <li>Credit card protection - Claims must be made promptly</li>
                <li>Court action - 6 year limit from breach of contract</li>
                <li>Evidence preservation - Becomes harder over time</li>
            </ul>

            <center>
                <a href="tel:08001234567" class="button-urgent">📞 CALL NOW: 0800 123 4567</a>
                <br>
                <a href="mailto:urgent@worryfreecars.co.uk?subject=URGENT Case ${caseId}" class="button-urgent">📧 EMAIL URGENT TEAM</a>
            </center>

            <p><strong>Available Today:</strong> Emergency legal consultation available Monday-Friday 9am-6pm, Saturday 9am-1pm.</p>
        </div>

        <div class="footer">
            <p><strong>Emergency Legal Helpline: 0800 123 4567</strong></p>
            <p>Case Reference: ${caseId}</p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
⚠️ URGENT: Time-Sensitive Action Required - Case ${caseId}

Dear ${submission.fullName},

URGENT ACTION REQUIRED

Based on our assessment, there are critical time limits approaching that could affect your legal rights.

IMMEDIATE ACTIONS REQUIRED:
• Contact the seller/dealer TODAY - Put your complaint in writing
• Preserve all evidence - Photos, documents, correspondence
• Do not sign anything - Without legal review first
• Consider professional legal action - Time limits are critical

WHY THIS IS URGENT:
Motor trade disputes have strict time limits:
• Consumer Rights Act - 30 days for full refund right
• Credit card protection - Claims must be made promptly
• Court action - 6 year limit from breach of contract
• Evidence preservation - Becomes harder over time

EMERGENCY CONTACT:
📞 0800 123 4567 (Mon-Fri 9am-6pm, Sat 9am-1pm)
📧 urgent@worryfreecars.co.uk

Case Reference: ${caseId}

Worry Free Car Finder - Emergency Legal Team
`;

    return { subject, htmlContent, textContent };
  }

  // Case closure email
  static getCaseClosure(caseId: string, outcome: string, fullName: string): EmailTemplate {
    const subject = `Case Closed - ${caseId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f0fdf4; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
        .success-box { background: #f0fdf4; border: 1px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feedback-box { background: #fef9e7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Case Successfully Resolved</h1>
            <p>Your legal matter has been concluded</p>
        </div>

        <div class="content">
            <p>Dear ${fullName},</p>

            <div class="success-box">
                <h3>🎉 Case Resolution</h3>
                <p><strong>Case:</strong> ${caseId}</p>
                <p><strong>Outcome:</strong> ${outcome}</p>
                <p><strong>Resolved:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
            </div>

            <p>We're pleased to inform you that your legal matter has been successfully resolved. We hope the outcome meets your expectations and that our service has helped you navigate this challenging situation.</p>

            <h3>What Happens Now:</h3>
            <ul>
                <li>This case is now closed in our system</li>
                <li>Keep all documentation for your records</li>
                <li>If you have any follow-up questions, please reference case ${caseId}</li>
                <li>We're here if you need legal assistance in the future</li>
            </ul>

            <div class="feedback-box">
                <h3>📝 Help Us Improve</h3>
                <p>Your feedback helps us provide better service to future clients. Would you mind taking 2 minutes to tell us about your experience?</p>
                <center>
                    <a href="https://forms.gle/feedback" class="button">Leave Feedback</a>
                </center>
            </div>

            <p>Thank you for choosing Worry Free Car Finder's Legal Advisory Service. We wish you well with your vehicle and hope you never need our services again - but we're here if you do!</p>
        </div>

        <div class="footer">
            <p><strong>Worry Free Car Finder - Legal Advisory Service</strong></p>
            <p>📧 legal@worryfreecars.co.uk | 📞 0800 123 4567</p>
            <p><small>Case ${caseId} - Closed ${new Date().toLocaleDateString('en-GB')}</small></p>
        </div>
    </div>
</body>
</html>`;

    const textContent = `
Case Successfully Resolved - ${caseId}

Dear ${fullName},

Your legal matter has been successfully resolved.

Case: ${caseId}
Outcome: ${outcome}
Resolved: ${new Date().toLocaleDateString('en-GB')}

What Happens Now:
• This case is now closed in our system
• Keep all documentation for your records
• Reference case ${caseId} for any follow-up questions
• We're here if you need legal assistance in the future

Thank you for choosing Worry Free Car Finder's Legal Advisory Service.

Contact: legal@worryfreecars.co.uk | 0800 123 4567
`;

    return { subject, htmlContent, textContent };
  }

  // Helper methods for generating content
  private static getIssueTypeLabel(issueType: string): string {
    const labels: Record<string, string> = {
      'faulty-car': 'Faulty Car from Dealer',
      'refund-dispute': 'Refund Dispute',
      'warranty-claim': 'Warranty Claim Rejected',
      'finance-issue': 'Car Finance Problem',
      'insurance-dispute': 'Insurance Claim Dispute',
      'private-sale': 'Private Sale Gone Wrong',
      'fraud-scam': 'Fraud or Scam',
      'other': 'Other Motor Trade Issue'
    };
    return labels[issueType] || issueType;
  }

  private static getTimeframeLabel(timeframe: string): string {
    const labels: Record<string, string> = {
      'last-week': 'Within the last week',
      'last-month': 'Within the last month',
      'last-3months': '1-3 months ago',
      'last-6months': '3-6 months ago',
      'over-6months': 'Over 6 months ago'
    };
    return labels[timeframe] || timeframe;
  }

  private static getServiceLabel(service: string): string {
    const labels: Record<string, string> = {
      'free': 'Free Initial Assessment',
      'paid-consultation': 'Professional Legal Advice (£99)',
      'letter-service': 'Letter Writing Service (£149)'
    };
    return labels[service] || service;
  }

  private static getStrengthMeter(strength: 'strong' | 'medium' | 'weak'): string {
    const bars = Array(5).fill(0);
    const strongBars = strength === 'strong' ? 5 : strength === 'medium' ? 3 : 1;

    return bars.map((_, i) => {
      if (i < strongBars) {
        return `<div class="strength-bar strength-${strength}"></div>`;
      }
      return `<div class="strength-bar" style="background: #e5e7eb;"></div>`;
    }).join('');
  }

  private static getIssueSpecificGuidance(issueType: string): string {
    const guidance: Record<string, string> = {
      'faulty-car': `
        <div class="assessment-box">
            <h3>🚗 Faulty Car from Dealer - Specific Guidance</h3>
            <p>Under the Consumer Rights Act 2015, you have strong protection when buying from a dealer:</p>
            <ul>
                <li><strong>First 30 days:</strong> Right to reject for full refund if car is faulty</li>
                <li><strong>After 30 days:</strong> Right to repair or replacement (dealer's choice)</li>
                <li><strong>After repair attempts:</strong> Right to partial refund or rejection</li>
                <li><strong>Burden of proof:</strong> Dealer must prove car wasn't faulty for first 6 months</li>
            </ul>
        </div>`,
      'finance-issue': `
        <div class="assessment-box">
            <h3>💳 Car Finance Problem - Specific Guidance</h3>
            <p>Car finance agreements are regulated by the FCA, giving you additional protections:</p>
            <ul>
                <li><strong>Voluntary Termination:</strong> Right to return car after paying 50% of total amount</li>
                <li><strong>Section 75 Protection:</strong> Credit card purchases over £100 give you claims against card company</li>
                <li><strong>Unfair Relationships:</strong> Court can overturn unfair credit agreements</li>
                <li><strong>Responsible Lending:</strong> Lender must check affordability before approving</li>
            </ul>
        </div>`,
      'insurance-dispute': `
        <div class="assessment-box">
            <h3>🛡️ Insurance Claim Dispute - Specific Guidance</h3>
            <p>Insurance disputes can be complex, but you have several avenues for resolution:</p>
            <ul>
                <li><strong>Policy Review:</strong> Insurer must follow policy terms exactly</li>
                <li><strong>Fair Claims Handling:</strong> Insurers must investigate fairly and promptly</li>
                <li><strong>Independent Assessment:</strong> You can get your own expert valuation</li>
                <li><strong>Financial Ombudsman:</strong> Free service to resolve insurance disputes</li>
            </ul>
        </div>`
    };

    return guidance[issueType] || '';
  }

  private static getRightsForIssue(issueType: string): string[] {
    const rights: Record<string, string[]> = {
      'faulty-car': [
        '30-day right to reject for full refund',
        'Right to repair or replacement after 30 days',
        'Right to partial refund if repair unsuccessful',
        'Protection against misleading descriptions',
        'Right to damages for consequential losses'
      ],
      'finance-issue': [
        'Right to voluntary termination after 50% paid',
        'Section 75 protection for credit card purchases',
        'Right to complain to Financial Ombudsman',
        'Protection against unfair lending practices',
        'Right to challenge unaffordable lending'
      ],
      'insurance-dispute': [
        'Right to fair claims assessment',
        'Right to challenge settlement offers',
        'Right to independent expert assessment',
        'Right to complain to Financial Ombudsman',
        'Right to see all evidence insurer relies on'
      ],
      'private-sale': [
        'Car must match description given',
        'Seller must have legal right to sell',
        'Protection against misrepresentation',
        'Right to cancel if fraudulent sale',
        'Right to damages for losses'
      ]
    };

    return rights[issueType] || [
      'Right to goods that match description',
      'Right to satisfactory quality',
      'Right to fitness for purpose',
      'Right to seek damages for losses',
      'Right to reasonable time to inspect'
    ];
  }

  private static getNextSteps(issueType: string): string[] {
    const steps: Record<string, string[]> = {
      'faulty-car': [
        'Document all faults with photos and videos',
        'Send formal written complaint to dealer citing Consumer Rights Act',
        'Give dealer reasonable opportunity to repair (usually one attempt)',
        'If repair fails, demand partial refund or rejection',
        'Consider court action if dealer refuses to comply'
      ],
      'finance-issue': [
        'Review your finance agreement carefully',
        'Calculate if you\'ve paid 50% for voluntary termination',
        'Submit complaint to finance company in writing',
        'Contact Financial Ombudsman if complaint rejected',
        'Consider professional debt advice if struggling with payments'
      ],
      'insurance-dispute': [
        'Request detailed explanation of claim decision',
        'Obtain independent valuation or assessment',
        'Submit formal complaint to insurance company',
        'Contact Financial Ombudsman if complaint rejected',
        'Consider legal action for bad faith claims handling'
      ]
    };

    return steps[issueType] || [
      'Gather all relevant documentation',
      'Send formal written complaint',
      'Set reasonable deadline for response',
      'Consider alternative dispute resolution',
      'Seek professional legal advice if needed'
    ];
  }
}
