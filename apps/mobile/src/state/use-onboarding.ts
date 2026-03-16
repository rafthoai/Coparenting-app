import { useMemo, useState } from 'react';
import {
  bootstrapUser,
  createChild,
  createHousehold,
  createInitialOnboardingState,
  createInvite,
  OnboardingState
} from '../services/onboarding-service';

export type Step = 'auth' | 'household' | 'child' | 'invite' | 'today';

export function useOnboarding() {
  const [step, setStep] = useState<Step>('auth');
  const [state, setState] = useState<OnboardingState>(createInitialOnboardingState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canContinue = useMemo(() => {
    switch (step) {
      case 'auth':
        return Boolean(state.email.trim() && state.fullName.trim());
      case 'household':
        return Boolean(state.householdName.trim());
      case 'child':
        return Boolean(state.childName.trim());
      case 'invite':
        return true;
      case 'today':
        return false;
    }
  }, [state, step]);

  async function next() {
    setIsSubmitting(true);

    try {
      if (step === 'auth') {
        setState(await bootstrapUser(state));
        setStep('household');
        return;
      }

      if (step === 'household') {
        setState(await createHousehold(state));
        setStep('child');
        return;
      }

      if (step === 'child') {
        setState(await createChild(state));
        setStep('invite');
        return;
      }

      if (step === 'invite') {
        setState(await createInvite(state));
        setStep('today');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function back() {
    if (step === 'household') setStep('auth');
    if (step === 'child') setStep('household');
    if (step === 'invite') setStep('child');
    if (step === 'today') setStep('invite');
  }

  return {
    step,
    state,
    setState,
    canContinue,
    isSubmitting,
    next,
    back
  };
}
