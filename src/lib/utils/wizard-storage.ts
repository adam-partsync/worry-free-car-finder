interface WizardProgress {
  currentStep: number;
  wizardData: {
    budget: number;
    monthlyBudget: number;
    financingType: 'loan' | 'lease' | 'cash' | null;
    needs: string[];
    lifestyle: string[];
    preferredMakes: string[];
    bodyTypes: string[];
    fuelTypes: string[];
    transmissionType: string[];
    minYear: number;
    maxMileage: number;
    selectedVehicles: any[];
    matchingVehicles: any[];
    towingNeeds: boolean;
    towingCapacity: number;
    maintenancePlan: any;
    legalQuestions: any[];
    quizResults: any;
  };
  completedSteps: string[];
  lastSaved: string;
  version: number;
}

const WIZARD_STORAGE_KEY = 'car-buying-wizard-progress';
const STORAGE_VERSION = 1;

export const WizardStorage = {
  // Save current wizard progress to localStorage
  saveProgress: (currentStep: number, wizardData: any, completedSteps: string[]): void => {
    try {
      const progress: WizardProgress = {
        currentStep,
        wizardData,
        completedSteps,
        lastSaved: new Date().toISOString(),
        version: STORAGE_VERSION
      };

      localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(progress));
      console.log('✅ Wizard progress saved:', progress);
    } catch (error) {
      console.error('❌ Failed to save wizard progress:', error);
    }
  },

  // Load wizard progress from localStorage
  loadProgress: (): WizardProgress | null => {
    try {
      const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (!saved) return null;

      const progress: WizardProgress = JSON.parse(saved);

      // Check version compatibility
      if (progress.version !== STORAGE_VERSION) {
        console.warn('⚠️ Wizard progress version mismatch, clearing old data');
        WizardStorage.clearProgress();
        return null;
      }

      // Validate progress structure
      if (!progress.wizardData || typeof progress.currentStep !== 'number') {
        console.warn('⚠️ Invalid wizard progress structure, clearing data');
        WizardStorage.clearProgress();
        return null;
      }

      console.log('✅ Wizard progress loaded:', progress);
      return progress;
    } catch (error) {
      console.error('❌ Failed to load wizard progress:', error);
      WizardStorage.clearProgress();
      return null;
    }
  },

  // Clear saved progress
  clearProgress: (): void => {
    try {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
      console.log('✅ Wizard progress cleared');
    } catch (error) {
      console.error('❌ Failed to clear wizard progress:', error);
    }
  },

  // Check if there's saved progress
  hasProgress: (): boolean => {
    try {
      return localStorage.getItem(WIZARD_STORAGE_KEY) !== null;
    } catch (error) {
      return false;
    }
  },

  // Get last saved date
  getLastSavedDate: (): Date | null => {
    try {
      const progress = WizardStorage.loadProgress();
      return progress ? new Date(progress.lastSaved) : null;
    } catch (error) {
      return null;
    }
  },

  // Get progress summary for display
  getProgressSummary: (): { step: number; totalSteps: number; lastSaved: string; completedCount: number } | null => {
    try {
      const progress = WizardStorage.loadProgress();
      if (!progress) return null;

      const lastSavedDate = new Date(progress.lastSaved);
      const now = new Date();
      const diffMs = now.getTime() - lastSavedDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      let lastSavedText = '';
      if (diffDays > 0) {
        lastSavedText = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        lastSavedText = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        lastSavedText = 'Less than an hour ago';
      }

      return {
        step: progress.currentStep + 1,
        totalSteps: 10, // Total number of wizard steps
        lastSaved: lastSavedText,
        completedCount: progress.completedSteps.length
      };
    } catch (error) {
      return null;
    }
  }
};
