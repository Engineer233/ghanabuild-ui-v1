import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3001'

// Mock framer-motion to avoid issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: (props) => React.createElement('div', props),
    section: (props) => React.createElement('section', props),
    h2: (props) => React.createElement('h2', props),
    p: (props) => React.createElement('p', props),
    ul: (props) => React.createElement('ul', props),
    li: (props) => React.createElement('li', props),
    button: (props) => React.createElement('button', props),
  },
  AnimatePresence: ({ children }) => children,
}))

// Global test utilities
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))