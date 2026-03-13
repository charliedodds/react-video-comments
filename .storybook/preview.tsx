import type { Preview } from '@storybook/react'
import { VideoCommentProvider } from '../src/components/VideoCommentProvider'
import { lightTheme, darkTheme } from '../src/utils/theme'

export const globalTypes = {
  vcTheme: {
    name: 'Theme',
    description: 'react-video-comments colour theme',
    toolbar: {
      icon: 'circlehollow' as const,
      items: [
        { value: 'light', title: 'Light', icon: 'sun' as const },
        { value: 'dark', title: 'Dark', icon: 'moon' as const },
      ],
      dynamicTitle: true,
    },
  },
}

export const globals = {
  vcTheme: 'dark',
}

const preview: Preview = {
  initialGlobals: globals,
  globalTypes,

  decorators: [
    (Story, context) => {
      const isDark = (context.globals.vcTheme ?? 'dark') === 'dark'
      const theme = isDark ? darkTheme : lightTheme
      const bg = isDark ? '#0f0f0f' : '#f5f5f5'

      return (
        <div
          style={{
            minHeight: '100vh',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
            boxSizing: 'border-box',
            background: bg,
          }}
        >
          <VideoCommentProvider theme={theme}>
            <Story />
          </VideoCommentProvider>
        </div>
      )
    },
  ],

  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f0f0f' },
        { name: 'light', value: '#f5f5f5' },
      ],
    },
    layout: 'fullscreen',
  },
}

export default preview
