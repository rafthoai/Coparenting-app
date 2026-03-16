import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Step = 'auth' | 'household' | 'child' | 'invite' | 'today';

export default function App() {
  const [step, setStep] = useState<Step>('auth');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [childName, setChildName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');

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
        return 'This is the first version of Today + Handoff.';
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

      <View style={styles.card}>{renderStep({ step, email, setEmail, fullName, setFullName, householdName, setHouseholdName, childName, setChildName, inviteeEmail, setInviteeEmail })}</View>

      <View style={styles.footer}>
        {step !== 'auth' ? (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(previousStep(step))}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        {step !== 'today' ? (
          <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(nextStep(step))}>
            <Text style={styles.primaryButtonText}>{step === 'invite' ? 'Continue' : 'Next'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

function renderStep(props: {
  step: Step;
  email: string;
  setEmail: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  householdName: string;
  setHouseholdName: (value: string) => void;
  childName: string;
  setChildName: (value: string) => void;
  inviteeEmail: string;
  setInviteeEmail: (value: string) => void;
}) {
  switch (props.step) {
    case 'auth':
      return (
        <>
          <Field label="Email" value={props.email} onChangeText={props.setEmail} placeholder="rafa@example.com" />
          <Field label="Full name" value={props.fullName} onChangeText={props.setFullName} placeholder="Rafael" />
        </>
      );
    case 'household':
      return <Field label="Household name" value={props.householdName} onChangeText={props.setHouseholdName} placeholder="Rafa + Co-parent" />;
    case 'child':
      return <Field label="Child name" value={props.childName} onChangeText={props.setChildName} placeholder="Emma" />;
    case 'invite':
      return <Field label="Co-parent email" value={props.inviteeEmail} onChangeText={props.setInviteeEmail} placeholder="coparent@example.com" />;
    case 'today':
      return (
        <View style={styles.todayWrap}>
          <InfoBlock label="Current caregiver" value="Parent A" />
          <InfoBlock label="Next handoff" value="Sunday · 5:00 PM" />
          <InfoBlock label="Pending approvals" value="1 swap request" />
          <InfoBlock label="Recent update" value="School pickup confirmed" />
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

function nextStep(step: Step): Step {
  switch (step) {
    case 'auth':
      return 'household';
    case 'household':
      return 'child';
    case 'child':
      return 'invite';
    case 'invite':
      return 'today';
    case 'today':
      return 'today';
  }
}

function previousStep(step: Step): Step {
  switch (step) {
    case 'auth':
      return 'auth';
    case 'household':
      return 'auth';
    case 'child':
      return 'household';
    case 'invite':
      return 'child';
    case 'today':
      return 'invite';
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
