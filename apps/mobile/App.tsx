import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Step, useOnboarding } from './src/state/use-onboarding';

export default function App() {
  const { step, state, setState, canContinue, isSubmitting, next, back } = useOnboarding();

  const subtitle = useMemo(() => {
    switch (step) {
      case 'auth':
        return 'Start with your account basics.';
      case 'household':
        return 'Create the two-home family workspace.';
      case 'child':
        return 'Anchor the app around the child first.';
      case 'invite':
        return 'Invite the co-parent or skip for now.';
      case 'today':
        return 'This screen now reflects real onboarding state.';
      default:
        return '';
    }
  }, [step]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CoParenting App</Text>
        <Text style={styles.title}>{screenTitle(step)}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.card}>
        {renderStep({ step, state, setState })}
      </View>

      <View style={styles.footer}>
        {step !== 'auth' ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={back}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {step !== 'today' ? (
          <TouchableOpacity
            style={[styles.primaryButton, !canContinue && styles.primaryButtonDisabled]}
            onPress={next}
            disabled={!canContinue || isSubmitting}
          >
            <Text style={styles.primaryButtonText}>{isSubmitting ? 'Saving…' : step === 'invite' ? 'Continue' : 'Next'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function renderStep(props: {
  step: Step;
  state: {
    email: string;
    fullName: string;
    householdName: string;
    childName: string;
    inviteeEmail: string;
    userId?: string;
    householdId?: string;
    childId?: string;
    inviteId?: string;
  };
  setState: React.Dispatch<
    React.SetStateAction<{
      email: string;
      fullName: string;
      householdName: string;
      childName: string;
      inviteeEmail: string;
      userId?: string;
      householdId?: string;
      childId?: string;
      inviteId?: string;
    }>
  >;
}) {
  switch (props.step) {
    case 'auth':
      return (
        <>
          <Field
            label="Email"
            value={props.state.email}
            onChangeText={(value) => props.setState((current) => ({ ...current, email: value }))}
            placeholder="rafa@example.com"
          />
          <Field
            label="Full name"
            value={props.state.fullName}
            onChangeText={(value) => props.setState((current) => ({ ...current, fullName: value }))}
            placeholder="Rafael"
          />
        </>
      );
    case 'household':
      return (
        <Field
          label="Household name"
          value={props.state.householdName}
          onChangeText={(value) => props.setState((current) => ({ ...current, householdName: value }))}
          placeholder="Rafa + Co-parent"
        />
      );
    case 'child':
      return (
        <Field
          label="Child name"
          value={props.state.childName}
          onChangeText={(value) => props.setState((current) => ({ ...current, childName: value }))}
          placeholder="Emma"
        />
      );
    case 'invite':
      return (
        <Field
          label="Co-parent email"
          value={props.state.inviteeEmail}
          onChangeText={(value) => props.setState((current) => ({ ...current, inviteeEmail: value }))}
          placeholder="coparent@example.com"
        />
      );
    case 'today':
      return (
        <View style={styles.todayWrap}>
          <InfoBlock label="User" value={props.state.fullName || 'Not set'} />
          <InfoBlock label="Household" value={props.state.householdName || 'Not set'} />
          <InfoBlock label="Child" value={props.state.childName || 'Not set'} />
          <InfoBlock label="Invite status" value={props.state.inviteId ? 'Invite created' : 'No invite sent yet'} />
          <InfoBlock label="Next handoff" value="Sunday · 5:00 PM" />
        </View>
      );
  }
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="#8a8fa3"
      />
    </View>
  );
}

function InfoBlock(props: { label: string; value: string }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoLabel}>{props.label}</Text>
      <Text style={styles.infoValue}>{props.value}</Text>
    </View>
  );
}

function screenTitle(step: Step) {
  switch (step) {
    case 'auth':
      return 'Welcome';
    case 'household':
      return 'Create household';
    case 'child':
      return 'Add child';
    case 'invite':
      return 'Invite co-parent';
    case 'today':
      return 'Today + Handoff';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    padding: 20,
    justifyContent: 'space-between'
  },
  header: {
    marginTop: 24,
    gap: 8
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#667085',
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#101828'
  },
  subtitle: {
    fontSize: 16,
    color: '#475467',
    lineHeight: 22
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    gap: 16,
    shadowColor: '#101828',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  primaryButton: {
    backgroundColor: '#5b6cf9',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14
  },
  primaryButtonDisabled: {
    backgroundColor: '#b8c0ff'
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700'
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#e8ebf5'
  },
  secondaryButtonText: {
    color: '#344054',
    fontWeight: '600'
  },
  fieldWrap: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054'
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: '#101828'
  },
  todayWrap: {
    gap: 12
  },
  infoBlock: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 14,
    gap: 4
  },
  infoLabel: {
    fontSize: 13,
    color: '#667085',
    fontWeight: '600'
  },
  infoValue: {
    fontSize: 17,
    color: '#101828',
    fontWeight: '700'
  }
});
