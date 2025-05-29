import nodemailer from 'nodemailer';
import { render } from '@react-email/components';

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number.parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
};

const transporter = nodemailer.createTransporter(emailConfig);

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailData) {
  try {
    const info = await transporter.sendMail({
      from: `"Worry Free Car Finder" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });

    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error as Error };
  }
}

// Email templates
export const emailTemplates = {
  vehicleCheckComplete: {
    subject: (registration: string) => `Vehicle Check Complete - ${registration}`,
    html: (data: { registration: string; riskScore: number; recommendation: string; reportUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Vehicle Check Complete</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .risk-score { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
            .recommendation { padding: 15px; border-radius: 5px; margin: 15px 0; }
            .buy { background: #dcfce7; border-left: 4px solid #16a34a; }
            .caution { background: #fef3c7; border-left: 4px solid #d97706; }
            .avoid { background: #fee2e2; border-left: 4px solid #dc2626; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 Vehicle Check Complete</h1>
              <p>Your comprehensive report for ${data.registration} is ready</p>
            </div>
            <div class="content">
              <h2>Report Summary</h2>
              <div class="risk-score">
                Risk Score: ${data.riskScore}/100
              </div>
              <div class="recommendation ${data.recommendation}">
                <strong>Recommendation:</strong> ${data.recommendation.toUpperCase()}
              </div>
              <p>Your detailed vehicle history report includes:</p>
              <ul>
                <li>✅ Stolen vehicle check</li>
                <li>✅ Outstanding finance verification</li>
                <li>✅ Write-off history</li>
                <li>✅ Mileage verification</li>
                <li>✅ Insurance claims history</li>
                <li>✅ Previous keeper information</li>
              </ul>
              <div style="text-align: center;">
                <a href="${data.reportUrl}" class="button">View Full Report</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: (data: { registration: string; riskScore: number; recommendation: string; reportUrl: string }) => `
      Vehicle Check Complete - ${data.registration}

      Your comprehensive vehicle history report is ready.

      Risk Score: ${data.riskScore}/100
      Recommendation: ${data.recommendation.toUpperCase()}

      View your full report: ${data.reportUrl}
    `
  },

  priceAlert: {
    subject: (make: string, model: string) => `Price Drop Alert - ${make} ${model}`,
    html: (data: { make: string; model: string; oldPrice: number; newPrice: number; savings: number; listingUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Price Drop Alert</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .button { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .price-change { text-align: center; margin: 20px 0; }
            .old-price { text-decoration: line-through; color: #666; }
            .new-price { font-size: 28px; font-weight: bold; color: #16a34a; }
            .savings { background: #dcfce7; padding: 15px; border-radius: 5px; text-align: center; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Price Drop Alert!</h1>
              <p>Great news! The ${data.make} ${data.model} you're watching has dropped in price</p>
            </div>
            <div class="content">
              <div class="price-change">
                <div class="old-price">Was: £${data.oldPrice.toLocaleString()}</div>
                <div class="new-price">Now: £${data.newPrice.toLocaleString()}</div>
              </div>
              <div class="savings">
                <strong>You save £${data.savings.toLocaleString()}!</strong>
              </div>
              <p>This vehicle matches your saved search criteria and is now available at a reduced price. Act quickly as good deals don't last long!</p>
              <div style="text-align: center;">
                <a href="${data.listingUrl}" class="button">View Listing</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: (data: { make: string; model: string; oldPrice: number; newPrice: number; savings: number; listingUrl: string }) => `
      Price Drop Alert - ${data.make} ${data.model}

      Great news! The vehicle you're watching has dropped in price.

      Was: £${data.oldPrice.toLocaleString()}
      Now: £${data.newPrice.toLocaleString()}
      You save: £${data.savings.toLocaleString()}

      View listing: ${data.listingUrl}
    `
  },

  searchResults: {
    subject: (count: number) => `New Search Results - ${count} vehicles found`,
    html: (data: { searchName: string; count: number; vehicles: any[]; searchUrl: string }) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>New Search Results</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .vehicle { border: 1px solid #ddd; border-radius: 5px; padding: 15px; margin: 10px 0; background: white; }
            .vehicle-title { font-weight: bold; color: #2563eb; }
            .vehicle-price { font-size: 18px; font-weight: bold; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔍 New Search Results</h1>
              <p>Found ${data.count} new vehicles for "${data.searchName}"</p>
            </div>
            <div class="content">
              <h2>Latest Matches</h2>
              ${data.vehicles.slice(0, 3).map(vehicle => `
                <div class="vehicle">
                  <div class="vehicle-title">${vehicle.title}</div>
                  <div class="vehicle-price">£${vehicle.price.toLocaleString()}</div>
                  <div>${vehicle.year} • ${vehicle.mileage?.toLocaleString() || 'Unknown'} miles • ${vehicle.fuelType}</div>
                  <div>${vehicle.location}</div>
                </div>
              `).join('')}
              ${data.count > 3 ? `<p>And ${data.count - 3} more vehicles...</p>` : ''}
              <div style="text-align: center;">
                <a href="${data.searchUrl}" class="button">View All Results</a>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: (data: { searchName: string; count: number; vehicles: any[]; searchUrl: string }) => `
      New Search Results - "${data.searchName}"

      Found ${data.count} new vehicles matching your criteria.

      View all results: ${data.searchUrl}
    `
  }
};

// Notification functions
export async function sendVehicleCheckCompleteEmail(
  userEmail: string,
  vehicleData: { registration: string; riskScore: number; recommendation: string },
  reportUrl: string
) {
  const template = emailTemplates.vehicleCheckComplete;
  const data = { ...vehicleData, reportUrl };

  return sendEmail({
    to: userEmail,
    subject: template.subject(vehicleData.registration),
    html: template.html(data),
    text: template.text(data),
  });
}

export async function sendPriceAlertEmail(
  userEmail: string,
  vehicleData: { make: string; model: string; oldPrice: number; newPrice: number },
  listingUrl: string
) {
  const template = emailTemplates.priceAlert;
  const savings = vehicleData.oldPrice - vehicleData.newPrice;
  const data = { ...vehicleData, savings, listingUrl };

  return sendEmail({
    to: userEmail,
    subject: template.subject(vehicleData.make, vehicleData.model),
    html: template.html(data),
    text: template.text(data),
  });
}

export async function sendSearchResultsEmail(
  userEmail: string,
  searchData: { searchName: string; count: number; vehicles: any[] },
  searchUrl: string
) {
  const template = emailTemplates.searchResults;
  const data = { ...searchData, searchUrl };

  return sendEmail({
    to: userEmail,
    subject: template.subject(searchData.count),
    html: template.html(data),
    text: template.text(data),
  });
}
