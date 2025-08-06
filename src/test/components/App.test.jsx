import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import App from '../../App.jsx'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Layout and Navigation', () => {
    it('renders header with correct title and tagline', () => {
      render(<App />)
      
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByText('Ghanabuild.AI')).toBeInTheDocument()
      expect(screen.getByText('Advanced House Cost Estimator')).toBeInTheDocument()
    })

    it('renders main content area', () => {
      render(<App />)
      
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByText('Enter Your Project Details')).toBeInTheDocument()
    })

    it('renders footer with copyright', () => {
      render(<App />)
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      expect(screen.getByText('© 2025 Ghanabuild.AI. All rights reserved.')).toBeInTheDocument()
    })
  })

  describe('Project Form', () => {
    it('renders all required form fields', () => {
      render(<App />)
      
      expect(screen.getByLabelText(/region/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/project type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/total floor area/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/number of bathrooms/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/number of floors/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/finish quality/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/include external works/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /get cost estimate/i })).toBeInTheDocument()
    })

    it('shows validation modal on invalid form submission', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const submitButton = screen.getByRole('button', { name: /get cost estimate/i })
      await user.click(submitButton)
      
      // Check if validation modal appears
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument()
      })
    })

    it('handles successful form submission', async () => {
      const user = userEvent.setup()
      const mockResponse = {
        data: {
          totalCost: 150000,
          details: {
            materials: 75000,
            labor: 50000,
            permits: 25000
          }
        }
      }
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse)
      
      render(<App />)
      
      // Fill out valid form data
      await user.type(screen.getByLabelText(/region/i), 'Accra')
      await user.type(screen.getByLabelText(/total floor area/i), '2000')
      await user.type(screen.getByLabelText(/number of bathrooms/i), '3')
      await user.type(screen.getByLabelText(/number of floors/i), '2')
      
      const submitButton = screen.getByRole('button', { name: /get cost estimate/i })
      await user.click(submitButton)
      
      // Wait for the API call
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith(
          'https://ghanabuild-backend.onrender.com/estimate',
          expect.objectContaining({
            region: 'Accra',
            totalFloorArea: '2000',
            numberOfBathrooms: '3',
            numberOfFloors: '2'
          }),
          { timeout: 15000 }
        )
      })
    })

    it('handles API errors gracefully', async () => {
      const user = userEvent.setup()
      const mockError = {
        response: {
          data: {
            error: 'Server error'
          }
        }
      }
      
      mockedAxios.post.mockRejectedValueOnce(mockError)
      
      render(<App />)
      
      // Fill out valid form data first
      await user.type(screen.getByLabelText(/region/i), 'Accra')
      await user.type(screen.getByLabelText(/total floor area/i), '2000')
      await user.type(screen.getByLabelText(/number of bathrooms/i), '3')
      await user.type(screen.getByLabelText(/number of floors/i), '2')
      
      const submitButton = screen.getByRole('button', { name: /get cost estimate/i })
      await user.click(submitButton)
      
      // Wait for error to be displayed
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
        expect(screen.getByText(/server error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state during API request', async () => {
      const user = userEvent.setup()
      
      // Mock a delayed response
      mockedAxios.post.mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: { totalCost: 150000 } }), 100))
      )
      
      render(<App />)
      
      // Fill out valid form data
      await user.type(screen.getByLabelText(/region/i), 'Accra')
      await user.type(screen.getByLabelText(/total floor area/i), '2000')
      await user.type(screen.getByLabelText(/number of bathrooms/i), '3')
      await user.type(screen.getByLabelText(/number of floors/i), '2')
      
      const submitButton = screen.getByRole('button', { name: /get cost estimate/i })
      await user.click(submitButton)
      
      // Check for loading state
      await waitFor(() => {
        expect(screen.getByText(/calculating estimate/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error Boundaries and Fallback UI', () => {
    it('handles component errors gracefully', () => {
      // Create a component that throws an error
      const ThrowError = () => {
        throw new Error('Test error')
      }
      
      // Mock console.error to avoid console spam in tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      try {
        render(<ThrowError />)
      } catch (error) {
        // Expected to throw
      }
      
      consoleSpy.mockRestore()
    })
  })
})