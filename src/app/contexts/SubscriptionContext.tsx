import { createContext, useContext, useState, ReactNode } from 'react';

export type SubscriptionTier = 'light' | 'medium' | 'pro';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  setTier: (tier: SubscriptionTier) => void;
  hasAccess: (feature: SubscriptionFeature) => boolean;
}

export type SubscriptionFeature = 
  | 'advanced-offers'        // Avanserte tilbud med materialdatabase
  | 'material-database'      // Tilgang til materialdatabase
  | 'calculators'            // Avanserte kalkulatorer
  | 'portfolio'              // Porteføljesider
  | 'basic-offers'           // Grunnleggende tilbud
  | 'boligmappa-integration' // Boligmappa integrasjon
  | 'ai-assistant'           // AI-assistent
  | 'accounting-integration' // Regnskapsintegrasjon
  | 'premium-placement';     // Premium plassering i søk

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Feature access matrix
const featureAccess: Record<SubscriptionTier, SubscriptionFeature[]> = {
  light: [
    'basic-offers', // Kun grunnleggende tilbud
  ],
  medium: [
    'basic-offers',
    'portfolio',              // Porteføljetilgang
    'boligmappa-integration', // Boligmappa
    // IKKE: material-database, calculators, advanced-offers
  ],
  pro: [
    'basic-offers',
    'portfolio',
    'advanced-offers',        // Full tilbudsbygger
    'material-database',      // Materialdatabase
    'calculators',            // Alle kalkulatorer
    'boligmappa-integration',
    'ai-assistant',
    'accounting-integration',
    'premium-placement',
  ],
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  // Default to 'pro' for development - in production, get from user profile
  const [tier, setTier] = useState<SubscriptionTier>('pro');

  const hasAccess = (feature: SubscriptionFeature): boolean => {
    return featureAccess[tier].includes(feature);
  };

  return (
    <SubscriptionContext.Provider value={{ tier, setTier, hasAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
