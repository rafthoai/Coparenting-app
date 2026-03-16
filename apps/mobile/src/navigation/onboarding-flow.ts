import { authScreenSpec } from '../screens/auth-screen';
import { householdSetupScreenSpec } from '../screens/household-setup-screen';
import { childSetupScreenSpec } from '../screens/child-setup-screen';
import { inviteCoParentScreenSpec } from '../screens/invite-coparent-screen';
import { todayHandoffScreenSpec } from '../screens/today-handoff-screen';

export const onboardingFlow = [
  authScreenSpec,
  householdSetupScreenSpec,
  childSetupScreenSpec,
  inviteCoParentScreenSpec,
  todayHandoffScreenSpec
] as const;
