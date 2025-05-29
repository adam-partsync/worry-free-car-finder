import { db } from '@/lib/db';
import { sendPriceAlertEmail, sendSearchResultsEmail, sendVehicleCheckCompleteEmail } from '@/lib/email';
import { getEbayScraper } from '@/lib/scrapers/ebay-scraper';

interface PriceAlert {
  userId: string;
  userEmail: string;
  vehicleId: string;
  make: string;
  model: string;
  currentPrice: number;
  alertThreshold: number;
  lastChecked: Date;
}

interface SavedSearchAlert {
  userId: string;
  userEmail: string;
  searchId: string;
  searchName: string;
  filters: any;
  lastRun: Date;
  lastResultCount: number;
}

export class NotificationScheduler {
  private isRunning = false;
  private interval: NodeJS.Timeout | null = null;

  constructor(private checkIntervalMinutes = 60) {} // Check every hour by default

  start() {
    if (this.isRunning) {
      console.log('Notification scheduler already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting notification scheduler...');

    // Run immediately
    this.runChecks();

    // Schedule regular checks
    this.interval = setInterval(() => {
      this.runChecks();
    }, this.checkIntervalMinutes * 60 * 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Notification scheduler stopped');
  }

  private async runChecks() {
    try {
      console.log('Running scheduled notification checks...');

      await Promise.allSettled([
        this.checkPriceAlerts(),
        this.checkSavedSearches(),
        this.checkVehicleCheckStatus(),
        this.sendWeeklyDigests()
      ]);

    } catch (error) {
      console.error('Error in notification scheduler:', error);
    }
  }

  private async checkPriceAlerts() {
    try {
      // In production, you'd have a PriceAlerts table
      // For now, simulate price alerts from saved searches

      console.log('Checking price alerts...');

      // Mock price alerts - in production these would come from your database
      const mockPriceAlerts: PriceAlert[] = [
        {
          userId: 'user1',
          userEmail: 'user@example.com',
          vehicleId: 'vehicle1',
          make: 'Toyota',
          model: 'Corolla',
          currentPrice: 15000,
          alertThreshold: 14000,
          lastChecked: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        }
      ];

      for (const alert of mockPriceAlerts) {
        try {
          // Check if price has dropped below threshold
          const currentMarketPrice = await this.getCurrentMarketPrice(alert.make, alert.model);

          if (currentMarketPrice && currentMarketPrice < alert.alertThreshold) {
            await sendPriceAlertEmail(
              alert.userEmail,
              {
                make: alert.make,
                model: alert.model,
                oldPrice: alert.currentPrice,
                newPrice: currentMarketPrice
              },
              `https://worryfreecars.com/vehicle/${alert.vehicleId}`
            );

            console.log(`Price alert sent to ${alert.userEmail} for ${alert.make} ${alert.model}`);
          }
        } catch (error) {
          console.error(`Failed to process price alert for user ${alert.userId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  }

  private async checkSavedSearches() {
    try {
      console.log('Checking saved searches for new results...');

      // Get all searches that have alerts enabled
      const savedSearches = await db.search.findMany({
        where: {
          // In production, you'd have an alertsEnabled field
          // For now, check all recent searches
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        include: {
          user: true
        }
      });

      for (const search of savedSearches) {
        try {
          if (!search.user.email) continue;

          // Run the search again to check for new results
          const newResults = await this.runSavedSearch(search.filters);
          const previousResultCount = (search.results as any)?.length || 0;

          // If there are new results, send notification
          if (newResults.length > previousResultCount) {
            const newVehicles = newResults.slice(0, newResults.length - previousResultCount);

            await sendSearchResultsEmail(
              search.user.email,
              {
                searchName: search.query || 'Saved Search',
                count: newVehicles.length,
                vehicles: newVehicles
              },
              `https://worryfreecars.com/search/results/${search.id}`
            );

            // Update the search with new results
            await db.search.update({
              where: { id: search.id },
              data: { results: newResults as any }
            });

            console.log(`Search alert sent to ${search.user.email} - ${newVehicles.length} new vehicles`);
          }
        } catch (error) {
          console.error(`Failed to process saved search for user ${search.userId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error checking saved searches:', error);
    }
  }

  private async checkVehicleCheckStatus() {
    try {
      console.log('Checking vehicle check status...');

      // Get completed vehicle checks that haven't sent notifications
      const completedChecks = await db.vehicleCheck.findMany({
        where: {
          status: 'completed',
          // In production, you'd have a notificationSent field
        },
        include: {
          user: true
        }
      });

      for (const check of completedChecks) {
        try {
          if (!check.user.email || !check.results) continue;

          const results = check.results as any;

          await sendVehicleCheckCompleteEmail(
            check.user.email,
            {
              registration: check.registration,
              riskScore: results.riskScore || 85,
              recommendation: results.recommendation || 'buy'
            },
            `https://worryfreecars.com/vehicle-check/report/${check.id}`
          );

          console.log(`Vehicle check notification sent to ${check.user.email} for ${check.registration}`);
        } catch (error) {
          console.error(`Failed to send vehicle check notification for ${check.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error checking vehicle check status:', error);
    }
  }

  private async sendWeeklyDigests() {
    // Only run on Mondays
    const now = new Date();
    if (now.getDay() !== 1) return; // 1 = Monday

    try {
      console.log('Sending weekly digests...');

      // Get active users who want weekly updates
      const activeUsers = await db.user.findMany({
        where: {
          // In production, you'd have email preferences
          createdAt: {
            lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // At least a week old
          }
        }
      });

      for (const user of activeUsers) {
        try {
          if (!user.email) continue;

          // Get user's activity for the week
          const weeklyStats = await this.getUserWeeklyStats(user.id);

          if (weeklyStats.hasActivity) {
            // Send weekly digest email
            console.log(`Weekly digest sent to ${user.email}`);
          }
        } catch (error) {
          console.error(`Failed to send weekly digest to user ${user.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error sending weekly digests:', error);
    }
  }

  private async getCurrentMarketPrice(make: string, model: string): Promise<number | null> {
    try {
      const scraper = getEbayScraper();
      const results = await scraper.searchCars({ make, model }, 10);

      if (results.length === 0) return null;

      // Calculate average price
      const prices = results.map(r => r.price).filter(p => p > 0);
      return prices.reduce((sum, price) => sum + price, 0) / prices.length;
    } catch (error) {
      console.error('Error getting current market price:', error);
      return null;
    }
  }

  private async runSavedSearch(filters: any): Promise<any[]> {
    try {
      const scraper = getEbayScraper();
      const results = await scraper.searchCars(filters, 50);
      return results;
    } catch (error) {
      console.error('Error running saved search:', error);
      return [];
    }
  }

  private async getUserWeeklyStats(userId: string) {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
      const [searches, motChecks, vehicleChecks, dealerChecks] = await Promise.all([
        db.search.count({ where: { userId, createdAt: { gte: weekAgo } } }),
        db.mOTCheck.count({ where: { userId, createdAt: { gte: weekAgo } } }),
        db.vehicleCheck.count({ where: { userId, createdAt: { gte: weekAgo } } }),
        db.dealerCheck.count({ where: { userId, createdAt: { gte: weekAgo } } })
      ]);

      return {
        hasActivity: searches + motChecks + vehicleChecks + dealerChecks > 0,
        stats: { searches, motChecks, vehicleChecks, dealerChecks }
      };
    } catch (error) {
      console.error('Error getting user weekly stats:', error);
      return { hasActivity: false, stats: {} };
    }
  }
}

// Singleton instance
let schedulerInstance: NotificationScheduler | null = null;

export function getNotificationScheduler(): NotificationScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new NotificationScheduler();
  }
  return schedulerInstance;
}

// Auto-start in production
if (process.env.NODE_ENV === 'production' && process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true') {
  const scheduler = getNotificationScheduler();
  scheduler.start();

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Shutting down notification scheduler...');
    scheduler.stop();
  });
}
