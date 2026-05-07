import type { Meta, StoryObj } from '@storybook/react';
import { TextFields } from './TextFields';

// ── Meta ──────────────────────────────────────────────────────────────────

const meta: Meta<typeof TextFields> = {
  title: 'Components/TextFields',
  component: TextFields,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Form input / Select trigger.
8 states: Default, Hover, Active, Filled, Success, Error, Warning, Disabled.
Uses CSS tokens from \`src/tokens/tokens.css\`.
Node: \`1042:950\` — LukaCenter Figma DS.
        `,
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['Default', 'Hover', 'Active', 'Filled', 'Success', 'Error', 'Warning', 'Disabled'],
      description: 'Visual state of the field',
    },
    label: {
      control: 'text',
      description: 'Floating label text',
    },
    value: {
      control: 'text',
      description: 'Input value (shown in Filled/Success/Error/Warning)',
    },
    helperMessage: {
      control: 'text',
      description: 'Helper text shown below (Success / Error / Warning only)',
    },
    showLeftIcon: {
      control: 'boolean',
    },
    showRightIcon: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextFields>;

// ── Default args ──────────────────────────────────────────────────────────

const baseArgs = {
  label: 'Label',
  showLeftIcon: false,
  showRightIcon: true,
};

// ── States ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    ...baseArgs,
    state: 'Default',
  },
};

export const Hover: Story = {
  args: {
    ...baseArgs,
    state: 'Hover',
  },
};

export const Active: Story = {
  args: {
    ...baseArgs,
    state: 'Active',
    label: 'Symptom',
  },
};

export const Filled: Story = {
  args: {
    ...baseArgs,
    state: 'Filled',
    label: 'Symptom',
    value: 'This is filled data',
  },
};

export const Success: Story = {
  args: {
    ...baseArgs,
    state: 'Success',
    label: 'Symptom',
    value: 'This is filled data',
    helperMessage: 'Success text',
  },
};

export const Error: Story = {
  args: {
    ...baseArgs,
    state: 'Error',
    label: 'Symptom',
    value: 'This is filled data',
    helperMessage: 'Error text',
  },
};

export const Warning: Story = {
  args: {
    ...baseArgs,
    state: 'Warning',
    label: 'Symptom',
    value: 'This is filled data',
    helperMessage: 'Warning text',
  },
};

export const Disabled: Story = {
  args: {
    ...baseArgs,
    state: 'Disabled',
  },
};

// ── All states grid ───────────────────────────────────────────────────────

export const AllStates: Story = {
  name: '↳ All States',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: 'All 8 states side by side for visual QA.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
      {(
        [
          { state: 'Default'  as const, label: 'Label' },
          { state: 'Hover'    as const, label: 'Label' },
          { state: 'Active'   as const, label: 'Symptom' },
          { state: 'Filled'   as const, label: 'Symptom',  value: 'This is filled data' },
          { state: 'Success'  as const, label: 'Symptom',  value: 'This is filled data', helperMessage: 'Success text' },
          { state: 'Error'    as const, label: 'Symptom',  value: 'This is filled data', helperMessage: 'Error text' },
          { state: 'Warning'  as const, label: 'Symptom',  value: 'This is filled data', helperMessage: 'Warning text' },
          { state: 'Disabled' as const, label: 'Label' },
        ] satisfies Array<React.ComponentProps<typeof TextFields>>
      ).map((props) => (
        <TextFields key={props.state} showRightIcon {...props} />
      ))}
    </div>
  ),
};

// ── Booking flow context ──────────────────────────────────────────────────

export const BookingFlowContext: Story = {
  name: '↳ Booking Flow Context',
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'section' },
    docs: {
      description: {
        story: 'As used in the Symptom → Recommendation → Appointment flow.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '32px', maxWidth: '393px' }}>
      <TextFields state="Filled"  label="Symptom"         value="Headache" showRightIcon />
      <TextFields state="Default" label="Preferred date"  showRightIcon />
      <TextFields state="Error"   label="Phone number"    value="123" helperMessage="Enter a valid phone number" showRightIcon />
    </div>
  ),
};

// ── With left icon ────────────────────────────────────────────────────────

export const WithLeftIcon: Story = {
  name: '↳ With Left Icon',
  args: {
    ...baseArgs,
    state: 'Default',
    label: 'Search symptom',
    showLeftIcon: true,
  },
};
