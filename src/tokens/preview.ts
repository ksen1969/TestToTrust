import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',   value: '#FFFFFF' },
        { name: 'section', value: '#EEF7F7' },
        { name: 'dark',    value: '#125051' },
      ],
    },
  },
};

export default preview;
