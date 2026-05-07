import React, { useId } from 'react';
import './TextFields.css';

// ── Icons ────────────────────────────────────────────────────────────────

const ChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronUp = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M15 12.5L10 7.5L5 12.5" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSuccess = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8L6.5 11.5L13 5" stroke="#22C55E" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconError = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="#EF4444" strokeWidth="1.3" />
    <path d="M8 5V8.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="#EF4444" />
  </svg>
);

const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="#EAB308" strokeWidth="1.3"
      strokeLinejoin="round" />
    <path d="M8 6.5V9.5" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.75" fill="#EAB308" />
  </svg>
);

// ── Types ────────────────────────────────────────────────────────────────

export type TextFieldsState =
  | 'Default'
  | 'Hover'
  | 'Active'
  | 'Filled'
  | 'Success'
  | 'Error'
  | 'Warning'
  | 'Disabled';

export interface TextFieldsProps {
  /** Floating label text */
  label: string;
  /** Current input value */
  value?: string;
  /** Controlled state — drives visual appearance */
  state?: TextFieldsState;
  /** Helper message shown below for Success / Error / Warning */
  helperMessage?: string;
  /** Show left icon slot */
  showLeftIcon?: boolean;
  /** Show right chevron icon */
  showRightIcon?: boolean;
  /** Replaces right icon in Active state (e.g. clear button) */
  rightInstance?: React.ReactNode;
  /** Left icon node — rendered when showLeftIcon=true */
  leftIcon?: React.ReactNode;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Focus handler */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Blur handler */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Additional class name */
  className?: string;
  /** Accessible label override (defaults to label prop) */
  'aria-label'?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────

const helperStatusMap: Record<string, { icon: React.ReactNode; modifier: string }> = {
  Success: { icon: <IconSuccess />, modifier: 'tf-helper--success' },
  Error:   { icon: <IconError />,   modifier: 'tf-helper--error'   },
  Warning: { icon: <IconWarning />, modifier: 'tf-helper--warning' },
};

const hasHelper = (state: TextFieldsState) =>
  state === 'Success' || state === 'Error' || state === 'Warning';

const showChevronUp = (state: TextFieldsState) =>
  state === 'Hover' || state === 'Active';

// ── Component ─────────────────────────────────────────────────────────────

export const TextFields = ({
  label,
  value = '',
  state = 'Default',
  helperMessage,
  showLeftIcon = false,
  showRightIcon = true,
  rightInstance,
  leftIcon,
  onChange,
  onFocus,
  onBlur,
  className,
  'aria-label': ariaLabel,
}: TextFieldsProps) => {
  const uid = useId();
  const inputId = `tf-${uid}`;
  const helperId = `tf-helper-${uid}`;

  const isDisabled  = state === 'Disabled';
  const isActive    = state === 'Active';
  const isFloating  = state === 'Active' || state === 'Filled' || hasHelper(state);
  const withHelper  = hasHelper(state);
  const helperInfo  = withHelper ? helperStatusMap[state] : null;

  // Root wrapper class
  const rootClass = [
    'tf-root',
    `tf-root--${state.toLowerCase()}`,
    className,
  ].filter(Boolean).join(' ');

  // Right icon node
  const rightNode = (() => {
    if (!showRightIcon) return null;
    if (isActive && rightInstance) return rightInstance;
    return showChevronUp(state) ? <ChevronUp /> : <ChevronDown />;
  })();

  return (
    <div
      className={withHelper ? 'tf-wrapper' : undefined}
      data-state={state}
    >
      {/* ── Field row ── */}
      <div
        className={rootClass}
        role="combobox"
        aria-expanded={isActive || state === 'Hover'}
        aria-disabled={isDisabled}
        aria-describedby={withHelper ? helperId : undefined}
      >
        {/* Left icon */}
        {showLeftIcon && (
          <span className="tf-icon-left" aria-hidden="true">
            {leftIcon ?? <ChevronDown />}
          </span>
        )}

        {/* Input area */}
        <div className="tf-input-area">
          <label
            htmlFor={inputId}
            className={['tf-label', isFloating ? 'tf-label--float' : ''].join(' ')}
          >
            {label}
          </label>

          {isActive ? (
            <input
              id={inputId}
              className="tf-input"
              type="text"
              defaultValue={value}
              disabled={isDisabled}
              aria-label={ariaLabel ?? label}
              onChange={onChange}
              onFocus={onFocus}
              onBlur={onBlur}
              autoFocus
            />
          ) : (
            value && (
              <span className="tf-value">{value}</span>
            )
          )}
        </div>

        {/* Right icon */}
        {rightNode && (
          <span className="tf-icon-right" aria-hidden="true">
            {rightNode}
          </span>
        )}
      </div>

      {/* ── Helper row ── */}
      {withHelper && helperInfo && (
        <div
          id={helperId}
          className={['tf-helper', helperInfo.modifier].join(' ')}
          role="alert"
          aria-live="polite"
        >
          <span className="tf-helper-icon">{helperInfo.icon}</span>
          <span className="tf-helper-text">
            {helperMessage ?? `${state} text`}
          </span>
        </div>
      )}
    </div>
  );
};

export default TextFields;
