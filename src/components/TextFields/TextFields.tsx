import React, { useRef, useEffect } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

/**
 * Visual state of the field.
 *
 * - `Default`  — resting, no interaction.
 * - `Hover`    — pointer is over the field. Applied externally (CSS `:hover` or parent logic).
 * - `Active`   — field is open / in edit mode. Renders a real `<input type="text">`.
 * - `Filled`   — field has a committed value, not in edit mode.
 * - `Success`  — value passed validation.
 * - `Error`    — value failed validation.
 * - `Warning`  — value is valid but requires attention.
 * - `Disabled` — field is not interactive. Rendered at 40% opacity.
 */
export type TextFieldState =
  | 'Default'
  | 'Hover'
  | 'Active'
  | 'Filled'
  | 'Success'
  | 'Error'
  | 'Warning'
  | 'Disabled';

/**
 * Props for the `TextFields` component.
 *
 * The component renders a combobox/select input with a floating label,
 * optional left/right icons, and an explicit helper row.
 */
export interface TextFieldsProps {
  /**
   * Visual state of the field.
   *
   * Controls border color, label behaviour, and whether the field
   * renders a real `<input>` (Active) or static text (all other states).
   *
   * @default 'Default'
   */
  state?: TextFieldState;

  /**
   * Floating label text shown inside the field.
   *
   * In `Default`, `Hover`, and `Disabled` states the label acts as a placeholder.
   * In `Active`, `Filled`, and feedback states it shrinks above the value.
   *
   * @default 'Label'
   */
  label?: string;

  /**
   * Committed value shown when the field is not in edit mode.
   *
   * Visible in `Filled`, `Success`, `Error`, and `Warning` states.
   * Ignored in `Default`, `Hover`, `Active`, and `Disabled`.
   *
   * @default 'This is filled data'
   */
  value?: string;

  /**
   * Whether to render the helper row below the field.
   *
   * **Always explicit — never auto-derived from `state`.**
   * You can have `state="Error"` without a helper, and `state="Default"` with one.
   * Pass `helperMessage` to override the default state-specific text.
   *
   * @default false
   */
  showHelper?: boolean;

  /**
   * Custom text for the helper row.
   *
   * When omitted, falls back to a state-appropriate default:
   * - `Success` → `'Success text'`
   * - `Error`   → `'Error text'`
   * - `Warning` → `'Warning text'`
   * - Everything else → `'Helper text'`
   *
   * Only rendered when `showHelper={true}`.
   */
  helperMessage?: string;

  /**
   * Whether to render the left icon slot.
   *
   * The slot is a 20×20 px placeholder. Pass your icon as a child
   * of the slot via `rightInstance` pattern, or extend the component.
   *
   * @default false
   */
  showLeftIcon?: boolean;

  /**
   * Whether to render the right icon.
   *
   * Shows `▾` (ArrowDown) in resting states and `▴` (ArrowUp) in `Active`.
   * Override the icon entirely with `rightInstance`.
   *
   * @default true
   */
  showRightIcon?: boolean;

  /**
   * Replaces the default right arrow icon.
   *
   * Pass any React node — an icon component, an SVG, or `null` to render nothing.
   * Takes precedence over the built-in ArrowDown / ArrowUp logic.
   *
   * @default null
   */
  rightInstance?: React.ReactNode | null;

  /**
   * Change handler for the `<input>` rendered in `Active` state.
   *
   * Fires on every keystroke. Only called when `state === 'Active'`.
   * Ignored in all other states (no input is mounted).
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Additional CSS class applied to the root wrapper `<div>`.
   *
   * Use to override width, margin, or other layout concerns from the parent.
   * Internal layout and design-token styles are not overrideable via className.
   */
  className?: string;
}

// ─────────────────────────────────────────────
// Helper config (icon + color, derived from state)
// ─────────────────────────────────────────────

type HelperConfig = {
  icon: 'check' | 'warning' | 'none';
  colorVar: string;
  defaultMessage: string;
};

const HELPER_CONFIG: Record<string, HelperConfig> = {
  Success: {
    icon: 'check',
    colorVar: 'var(--color/status/green-500, #22c55e)',
    defaultMessage: 'Success text',
  },
  Error: {
    icon: 'warning',
    colorVar: 'var(--color/error, #ef4444)',
    defaultMessage: 'Error text',
  },
  Warning: {
    icon: 'warning',
    colorVar: 'var(--color/status/yellow-500, #eab308)',
    defaultMessage: 'Warning text',
  },
};

const FALLBACK_HELPER: HelperConfig = {
  icon: 'none',
  colorVar: 'var(--color/gray-600, #4b5563)',
  defaultMessage: 'Helper text',
};

// ─────────────────────────────────────────────
// Icons (inline SVG — no external dependency)
// ─────────────────────────────────────────────

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2.5 8.5L6 12L13.5 4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M8 2L14.5 13H1.5L8 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M8 6.5V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill={color} />
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="var(--color/gray-800, #161d1e)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 12.5L10 7.5L15 12.5"
      stroke="var(--color/gray-800, #161d1e)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─────────────────────────────────────────────
// Border color per state
// ─────────────────────────────────────────────

const BORDER_COLOR: Record<string, string> = {
  Default:  'var(--input/border-default, #98dfe0)',
  Hover:    'var(--input/border-focus, #dbf9fa)',
  Active:   'var(--color/border-strong, #2e7c7d)',
  Filled:   'var(--input/border-default, #98dfe0)',
  Success:  'var(--input/border-default, #98dfe0)',
  Error:    'var(--input/border-default, #98dfe0)',
  Warning:  'var(--input/border-default, #98dfe0)',
  Disabled: 'var(--input/border-default, #98dfe0)',
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

/**
 * `TextFields` — combobox/select input for LUKE Medical Center.
 *
 * ### State machine
 * The component is **controlled by `state`**. It does not manage open/closed
 * state internally. The parent decides when to switch between states.
 *
 * ```
 * Default → Hover → Active → Filled → Success | Error | Warning
 *                                ↘ Default (on cancel)
 * Any → Disabled (external gate)
 * ```
 *
 * ### Helper row
 * `showHelper` is always explicit. Setting `state="Error"` does **not**
 * automatically show the helper. This prevents invisible coupling between
 * validation logic and UI rendering.
 *
 * ### Accessibility
 * The root element is `<div role="combobox">` with `aria-expanded` and
 * `aria-disabled` reflecting the current state. In `Active` state a real
 * `<input type="text">` is mounted and auto-focused, making it fully
 * keyboard-navigable. All decorative icons carry `aria-hidden="true"`.
 *
 * @example
 * // Controlled usage
 * const [state, setState] = useState<TextFieldState>('Default');
 * <TextFields
 *   state={state}
 *   label="Date of birth"
 *   value={selectedDate}
 *   showHelper={hasError}
 *   helperMessage="Invalid date format"
 *   onChange={(e) => setInputValue(e.target.value)}
 * />
 */
export function TextFields({
  state = 'Default',
  label = 'Label',
  value = 'This is filled data',
  showHelper = false,
  helperMessage,
  showLeftIcon = false,
  showRightIcon = true,
  rightInstance = null,
  onChange,
  className,
}: TextFieldsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering Active state
  useEffect(() => {
    if (state === 'Active') {
      inputRef.current?.focus();
    }
  }, [state]);

  const isDisabled = state === 'Disabled';
  const isActive   = state === 'Active';
  const hasValue   = ['Filled', 'Success', 'Error', 'Warning'].includes(state);

  const helperConfig = HELPER_CONFIG[state] ?? FALLBACK_HELPER;
  const resolvedMessage = helperMessage ?? helperConfig.defaultMessage;

  // ── Field wrapper ──────────────────────────────────────────────────
  const fieldStyle: React.CSSProperties = {
    backgroundColor: 'var(--input/bg, white)',
    border: `1px solid ${BORDER_COLOR[state]}`,
    borderRadius: 'var(--button, 48px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing/2, 8px)',
    height: 54,
    padding: 'var(--spacing/2, 8px) var(--spacing/6, 24px)',
    width: '100%',
    opacity: isDisabled ? 0.4 : 1,
    cursor: isDisabled ? 'not-allowed' : 'default',
    boxSizing: 'border-box',
  };

  // ── Left placeholder icon ──────────────────────────────────────────
  const LeftIcon = showLeftIcon ? (
    <div style={{ width: 20, height: 20, flexShrink: 0 }} aria-hidden="true">
      {/* Slot for left icon — pass your icon component here */}
    </div>
  ) : null;

  // ── Right arrow icon ───────────────────────────────────────────────
  const RightIcon = showRightIcon ? (
    rightInstance ?? (isActive ? <ArrowUpIcon /> : <ArrowDownIcon />)
  ) : null;

  // ── Input area ────────────────────────────────────────────────────
  const InputArea = (() => {
    if (isActive) {
      return (
        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              lineHeight: 1.4,
              color: 'var(--color/gray-800, #161d1e)',
            }}
          >
            {label}
          </span>
          <input
            ref={inputRef}
            type="text"
            defaultValue=""
            onChange={onChange}
            disabled={isDisabled}
            style={{
              fontFamily: 'Inter Tight, sans-serif',
              fontSize: 16,
              lineHeight: '20px',
              color: 'var(--color/gray-950, #050708)',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              caretColor: 'var(--color/border-strong, #2e7c7d)',
              padding: 0,
            }}
            aria-label={label}
          />
        </div>
      );
    }

    if (hasValue) {
      return (
        <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              lineHeight: 1.4,
              color: 'var(--color/gray-800, #161d1e)',
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              lineHeight: 1.5,
              color: 'var(--color/gray-950, #050708)',
            }}
          >
            {value}
          </span>
        </div>
      );
    }

    // Default / Hover / Disabled — label only
    return (
      <div style={{ flex: '1 0 0', minWidth: 0, display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            fontFamily: 'Inter Tight, sans-serif',
            fontSize: 16,
            lineHeight: '20px',
            color: 'var(--color/gray-800, #161d1e)',
            flex: '1 0 0',
            minWidth: 0,
          }}
        >
          {label}
        </span>
      </div>
    );
  })();

  // ── Helper row ────────────────────────────────────────────────────
  const HelperRow = showHelper ? (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing/50, 4px)',
        paddingLeft: 'var(--spacing/250, 20px)',
        height: 16,
        width: '100%',
      }}
    >
      {helperConfig.icon === 'check' && (
        <CheckIcon color={helperConfig.colorVar} />
      )}
      {helperConfig.icon === 'warning' && (
        <WarningIcon color={helperConfig.colorVar} />
      )}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 13,
          lineHeight: 1.4,
          color: helperConfig.colorVar,
          flex: '1 0 0',
          minWidth: 0,
        }}
      >
        {resolvedMessage}
      </span>
    </div>
  ) : null;

  // ── Root ──────────────────────────────────────────────────────────
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing/50, 4px)',
        alignItems: 'flex-start',
        width: 361,
      }}
    >
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isActive}
        aria-disabled={isDisabled}
        aria-label={label}
        style={fieldStyle}
        data-state={state.toLowerCase()}
      >
        {LeftIcon}
        {InputArea}
        {RightIcon}
      </div>
      {HelperRow}
    </div>
  );
}

export default TextFields;
