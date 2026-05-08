import type { Meta, StoryObj } from '@storybook/react';
import { TextFields } from './TextFields';

// ─────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────

const meta: Meta<typeof TextFields> = {
  title: 'Components/TextFields',
  component: TextFields,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**TextFields** — custom combobox/select input for LUKE Medical Center.

### Props API notes

- \`showHelper\` is **always explicit** — it is never auto-derived from \`state\`.
  You can have \`state="Error"\` without a helper, and \`state="Default"\` with one.
- Active state renders a real \`<input type="text">\` with \`caretColor\`, not a text placeholder.
- All states use \`<div role="combobox">\` for consistent semantic HTML.
- Helper row width always matches the field width (both 100% of the 361px container).

### Design decisions vs. Figma

| Decision | Figma | Code | Reason |
|---|---|---|---|
| \`showHelper\` | coupled to state | independent prop | Explicit control prevents invisible coupling |
| Helper row width | 424px (bug) | 100% / 361px | Figma bug — misaligns with field |
| Active state content | \`|\` text | \`<input type="text">\` | Functional requirement |
| Wrapper element | \`<button>\` / \`<div>\` mixed | \`<div role="combobox">\` | Consistent semantic HTML |
        `,
      },
    },
  },
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['Default', 'Hover', 'Active', 'Filled', 'Success', 'Error', 'Warning', 'Disabled'],
    },
    showHelper: {
      control: { type: 'boolean' },
      description: 'Show helper row. **Explicit only — never auto-derived from state.**',
    },
    helperMessage: {
      control: { type: 'text' },
      description: 'Override the helper message. Defaults to a state-appropriate string.',
    },
    label: { control: { type: 'text' } },
    value: { control: { type: 'text' } },
    showLeftIcon: { control: { type: 'boolean' } },
    showRightIcon: { control: { type: 'boolean' } },
  },
};

export default meta;
type Story = StoryObj<typeof TextFields>;

// ─────────────────────────────────────────────
// All 8 base states
// ─────────────────────────────────────────────

export const Default: Story = {
  args: { state: 'Default', label: 'Label' },
};

export const Hover: Story = {
  args: { state: 'Hover', label: 'Label' },
};

export const Active: Story = {
  args: { state: 'Active', label: 'Label' },
  parameters: {
    docs: {
      description: {
        story: 'Real `<input type="text">` with teal caret. Auto-focuses on mount.',
      },
    },
  },
};

export const Filled: Story = {
  args: { state: 'Filled', label: 'Label', value: 'This is filled data' },
};

export const Disabled: Story = {
  args: { state: 'Disabled', label: 'Label' },
};

// ─────────────────────────────────────────────
// Feedback states — without helper (default)
// ─────────────────────────────────────────────

export const SuccessNoHelper: Story = {
  name: 'Success — no helper',
  args: { state: 'Success', label: 'Label', value: 'This is filled data', showHelper: false },
  parameters: {
    docs: {
      description: {
        story:
          '`showHelper` defaults to `false`. State="Success" does NOT auto-show a helper.',
      },
    },
  },
};

export const ErrorNoHelper: Story = {
  name: 'Error — no helper',
  args: { state: 'Error', label: 'Label', value: 'This is filled data', showHelper: false },
};

export const WarningNoHelper: Story = {
  name: 'Warning — no helper',
  args: { state: 'Warning', label: 'Label', value: 'This is filled data', showHelper: false },
};

// ─────────────────────────────────────────────
// Feedback states — with helper (explicit)
// ─────────────────────────────────────────────

export const SuccessWithHelper: Story = {
  name: 'Success + helper',
  args: { state: 'Success', label: 'Label', value: 'This is filled data', showHelper: true },
  parameters: {
    docs: {
      description: {
        story: 'Helper row appears because `showHelper={true}` is passed explicitly.',
      },
    },
  },
};

export const ErrorWithHelper: Story = {
  name: 'Error + helper',
  args: {
    state: 'Error',
    label: 'Label',
    value: 'This is filled data',
    showHelper: true,
    helperMessage: 'Це поле обовʼязкове',
  },
};

export const WarningWithHelper: Story = {
  name: 'Warning + helper',
  args: {
    state: 'Warning',
    label: 'Label',
    value: 'This is filled data',
    showHelper: true,
    helperMessage: 'Перевірте правильність даних',
  },
};

// ─────────────────────────────────────────────
// Edge case: helper on non-feedback state
// ─────────────────────────────────────────────

export const DefaultWithHelper: Story = {
  name: 'Default + helper (edge case)',
  args: {
    state: 'Default',
    label: 'Label',
    showHelper: true,
    helperMessage: 'Введіть щонайменше 3 символи',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Because `showHelper` is independent, you can show a helper on any state — including Default.',
      },
    },
  },
};

// ─────────────────────────────────────────────
// Icon variants
// ─────────────────────────────────────────────

export const WithLeftIcon: Story = {
  name: 'With Left Icon',
  args: {
    state: 'Default',
    label: 'Label',
    showLeftIcon: true,
    showRightIcon: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Field with `showLeftIcon={true}`. The left slot is a 20×20 px placeholder — pass your icon via the component slot.',
      },
    },
  },
};

// ─────────────────────────────────────────────
// Booking flow context
// ─────────────────────────────────────────────

export const BookingFlowContext: Story = {
  name: 'Booking Flow Context',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '24px',
        background: '#f8fafa',
        borderRadius: 16,
        width: 409,
      }}
    >
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: '#161d1e',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        Booking appointment
      </span>
      <TextFields state="Filled" label="Label" value="This is filled data" />
      <TextFields state="Default" label="Label" />
      <TextFields
        state="Error"
        label="Label"
        value="This is filled data"
        showHelper={true}
        helperMessage="Це поле обовʼязкове"
      />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story:
          'TextFields in a realistic booking flow context — shows Filled, Default, and Error states together.',
      },
    },
  },
};

// ─────────────────────────────────────────────
// Sandbox (controls enabled)
// ─────────────────────────────────────────────

export const Sandbox: Story = {
  name: '⚙ Sandbox',
  args: {
    state: 'Default',
    label: 'Label',
    value: 'This is filled data',
    showHelper: false,
    showLeftIcon: false,
    showRightIcon: true,
  },
};

// ─────────────────────────────────────────────
// All states overview
// ─────────────────────────────────────────────

export const AllStates: Story = {
  name: '📋 All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['Default', 'Hover', 'Active', 'Filled', 'Disabled'] as const).map((state) => (
        <TextFields key={state} state={state} label="Label" />
      ))}
      {(['Success', 'Error', 'Warning'] as const).map((state) => (
        <TextFields
          key={state}
          state={state}
          label="Label"
          value="This is filled data"
          showHelper={true}
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All 8 states. Feedback states shown with `showHelper={true}`.',
      },
    },
  },
};
