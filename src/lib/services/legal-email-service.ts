import { LegalAssessmentEmailTemplates, type LegalSubmission, type EmailTemplate } from '@/lib/email-templates/legal-assessment';

export interface EmailConfig {
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  fromEmail?: string;
  fromName?: string;
}

export interface AssessmentResult {
  strength: 'strong' | 'medium' | 'weak';
  successRate: number;
  estimatedClaim: number;
  urgentAction: boolean;
  recommendations: string[];
}

export class LegalEmailService {
  private config: EmailConfig;

  constructor(config: EmailConfig = {}) {
    this.config = {
      smtpHost: process.env.SMTP_HOST || 'localhost',
      smtpPort: Number(process.env.SMTP_PORT) || 587,
      smtpUser: process.env.SMTP_USER || '',
      smtpPass: process.env.SMTP_PASS || '',
      fromEmail: process.env.FROM_EMAIL || 'legal@worryfreecars.co.uk',
      fromName: process.env.FROM_NAME || 'Worry Free Car Finder Legal Team',
      ...config
    };
  }

  /**
   * Send submission confirmation email immediately after form submission
   */
  async sendSubmissionConfirmation(submission: LegalSubmission): Promise<boolean> {
    try {
      const template = LegalAssessmentEmailTemplates.getSubmissionConfirmation(submission);

      // In development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 LEGAL SUBMISSION CONFIRMATION EMAIL');
        console.log('To:', submission.email);
        console.log('Subject:', template.subject);
        console.log('---HTML CONTENT---');
        console.log(template.htmlContent);
        console.log('---TEXT CONTENT---');
        console.log(template.textContent);
        console.log('---END EMAIL---');
        return true;
      }

      return await this.sendEmail({
        to: submission.email,
        cc: this.config.fromEmail,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent
      });
    } catch (error) {
      console.error('Error sending submission confirmation:', error);
      return false;
    }
  }

  /**
   * Send initial assessment email with legal analysis
   */
  async sendInitialAssessment(submission: LegalSubmission, assessment: AssessmentResult): Promise<boolean> {
    try {
      const template = LegalAssessmentEmailTemplates.getInitialAssessment(submission, assessment);

      // In development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 LEGAL INITIAL ASSESSMENT EMAIL');
        console.log('To:', submission.email);
        console.log('Subject:', template.subject);
        console.log('Assessment:', assessment);
        console.log('---HTML CONTENT---');
        console.log(template.htmlContent);
        console.log('---END EMAIL---');
        return true;
      }

      return await this.sendEmail({
        to: submission.email,
        cc: this.config.fromEmail,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent
      });
    } catch (error) {
      console.error('Error sending initial assessment:', error);
      return false;
    }
  }

  /**
   * Send urgent follow-up email for time-sensitive cases
   */
  async sendUrgentFollowUp(submission: LegalSubmission): Promise<boolean> {
    try {
      const template = LegalAssessmentEmailTemplates.getUrgentFollowUp(submission);

      // In development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 URGENT FOLLOW-UP EMAIL');
        console.log('To:', submission.email);
        console.log('Subject:', template.subject);
        console.log('---HTML CONTENT---');
        console.log(template.htmlContent);
        console.log('---END EMAIL---');
        return true;
      }

      return await this.sendEmail({
        to: submission.email,
        cc: this.config.fromEmail,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent,
        priority: 'high'
      });
    } catch (error) {
      console.error('Error sending urgent follow-up:', error);
      return false;
    }
  }

  /**
   * Send case closure email
   */
  async sendCaseClosure(caseId: string, outcome: string, email: string, fullName: string): Promise<boolean> {
    try {
      const template = LegalAssessmentEmailTemplates.getCaseClosure(caseId, outcome, fullName);

      // In development, log the email instead of sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 CASE CLOSURE EMAIL');
        console.log('To:', email);
        console.log('Subject:', template.subject);
        console.log('Outcome:', outcome);
        console.log('---HTML CONTENT---');
        console.log(template.htmlContent);
        console.log('---END EMAIL---');
        return true;
      }

      return await this.sendEmail({
        to: email,
        cc: this.config.fromEmail,
        subject: template.subject,
        html: template.htmlContent,
        text: template.textContent
      });
    } catch (error) {
      console.error('Error sending case closure:', error);
      return false;
    }
  }

  /**
   * Analyze legal submission and generate assessment
   */
  generateAssessment(submission: LegalSubmission): AssessmentResult {
    // Generate assessment based on issue type and other factors
    const assessments: Record<string, Partial<AssessmentResult>> = {
      'faulty-car': {
        strength: 'strong',
        successRate: 85,
        estimatedClaim: Math.min(submission.vehicleValue, submission.lossAmount * 1.2)
      },
      'refund-dispute': {
        strength: 'medium',
        successRate: 70,
        estimatedClaim: submission.lossAmount
      },
      'warranty-claim': {
        strength: 'medium',
        successRate: 65,
        estimatedClaim: submission.lossAmount
      },
      'finance-issue': {
        strength: 'strong',
        successRate: 80,
        estimatedClaim: submission.vehicleValue * 0.6
      },
      'insurance-dispute': {
        strength: 'medium',
        successRate: 60,
        estimatedClaim: submission.lossAmount
      },
      'private-sale': {
        strength: 'weak',
        successRate: 45,
        estimatedClaim: submission.lossAmount * 0.7
      },
      'fraud-scam': {
        strength: 'strong',
        successRate: 90,
        estimatedClaim: submission.vehicleValue
      }
    };

    const baseAssessment = assessments[submission.issueType] || {
      strength: 'medium' as const,
      successRate: 60,
      estimatedClaim: submission.lossAmount
    };

    // Adjust based on timeframe
    let successRateModifier = 1;
    let urgentAction = false;

    switch (submission.timeframe) {
      case 'last-week':
        successRateModifier = 1.1;
        urgentAction = submission.issueType === 'faulty-car';
        break;
      case 'last-month':
        successRateModifier = 1.05;
        urgentAction = submission.issueType === 'faulty-car';
        break;
      case 'last-3months':
        successRateModifier = 1;
        break;
      case 'last-6months':
        successRateModifier = 0.9;
        break;
      case 'over-6months':
        successRateModifier = 0.7;
        urgentAction = true; // Time limits may be approaching
        break;
    }

    // Adjust based on actions taken
    const actionsTakenCount = submission.actionsTaken.length;
    if (actionsTakenCount === 0) {
      successRateModifier *= 1.1; // Fresh case, better prospects
    } else if (actionsTakenCount > 5) {
      successRateModifier *= 0.9; // Complex case, may be harder
    }

    const finalSuccessRate = Math.min(95, Math.max(10, Math.round((baseAssessment.successRate || 60) * successRateModifier)));

    return {
      strength: finalSuccessRate > 75 ? 'strong' : finalSuccessRate > 50 ? 'medium' : 'weak',
      successRate: finalSuccessRate,
      estimatedClaim: baseAssessment.estimatedClaim || submission.lossAmount,
      urgentAction,
      recommendations: this.generateRecommendations(submission, finalSuccessRate)
    };
  }

  /**
   * Process complete legal submission workflow
   */
  async processLegalSubmission(submission: LegalSubmission): Promise<{ success: boolean; caseId: string }> {
    const caseId = `LAD-${Date.now().toString().slice(-6)}`;

    try {
      // Send immediate confirmation
      await this.sendSubmissionConfirmation(submission);

      // Generate assessment
      const assessment = this.generateAssessment(submission);

      // Send assessment after delay (simulating review time)
      if (process.env.NODE_ENV === 'development') {
        // In development, send immediately
        setTimeout(async () => {
          await this.sendInitialAssessment(submission, assessment);

          // Send urgent follow-up if needed
          if (assessment.urgentAction || submission.urgency === 'critical') {
            setTimeout(() => {
              this.sendUrgentFollowUp(submission);
            }, 1000 * 60 * 5); // 5 minutes later
          }
        }, 3000); // 3 seconds delay for demo
      } else {
        // In production, schedule for later
        setTimeout(async () => {
          await this.sendInitialAssessment(submission, assessment);

          if (assessment.urgentAction || submission.urgency === 'critical') {
            setTimeout(() => {
              this.sendUrgentFollowUp(submission);
            }, 1000 * 60 * 60 * 4); // 4 hours later
          }
        }, 1000 * 60 * 60 * 24); // 24 hours later
      }

      return { success: true, caseId };
    } catch (error) {
      console.error('Error processing legal submission:', error);
      return { success: false, caseId };
    }
  }

  private generateRecommendations(submission: LegalSubmission, successRate: number): string[] {
    const recommendations: string[] = [];

    if (successRate > 70) {
      recommendations.push('Strong case - proceed with confidence');
      recommendations.push('Consider professional letter as first step');
    } else if (successRate > 40) {
      recommendations.push('Moderate prospects - professional advice recommended');
      recommendations.push('Gather additional evidence before proceeding');
    } else {
      recommendations.push('Challenging case - careful consideration needed');
      recommendations.push('Full legal consultation recommended before action');
    }

    if (submission.timeframe === 'over-6months') {
      recommendations.push('TIME CRITICAL: Some limitation periods may have expired');
    }

    if (submission.vehicleValue > 25000) {
      recommendations.push('High value case - professional representation advised');
    }

    return recommendations;
  }

  private async sendEmail(options: {
    to: string;
    cc?: string;
    subject: string;
    html: string;
    text: string;
    priority?: 'high' | 'normal';
  }): Promise<boolean> {
    // In a real implementation, this would use nodemailer or similar
    // For now, we'll simulate email sending

    console.log(`📧 Sending email to ${options.to}`);
    console.log(`Subject: ${options.subject}`);

    // Simulate email delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return true; // Simulate successful send
  }
}

// Export singleton instance
export const legalEmailService = new LegalEmailService();
