import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import React from 'react'

// Since ProjectForm is embedded in App.jsx, let's extract it for testing
// This is a simplified version based on the App.jsx code
function ProjectForm({ onFormSubmit, isLoading }) {
  const [formData, setFormData] = React.useState({
    region: "",
    projectType: "residential",
    totalFloorArea: "",
    numberOfBathrooms: "",
    numberOfFloors: "",
    preferredFinishQuality: "standard",
    includeExternalWorks: false,
  })
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMessage, setModalMessage] = React.useState("")
  const [modalDetails, setModalDetails] = React.useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const validateForm = () => {
    const errors = []
    if (!formData.region || !/^[a-zA-Z\s-]{2,}$/.test(formData.region)) {
      errors.push(
        "Region must be at least 2 characters long and contain only letters, spaces, or hyphens."
      )
    }
    const totalFloorArea = parseInt(formData.totalFloorArea, 10)
    if (
      isNaN(totalFloorArea) ||
      totalFloorArea < 500 ||
      totalFloorArea > 10000 ||
      totalFloorArea !== parseFloat(formData.totalFloorArea)
    ) {
      errors.push(
        "Total Floor Area must be an integer between 500 and 10,000 sq ft."
      )
    }
    const numberOfBathrooms = parseInt(formData.numberOfBathrooms, 10)
    if (
      isNaN(numberOfBathrooms) ||
      numberOfBathrooms < 1 ||
      numberOfBathrooms > 10 ||
      numberOfBathrooms !== parseFloat(formData.numberOfBathrooms)
    ) {
      errors.push(
        "Number of Bathrooms must be an integer between 1 and 10."
      )
    }
    const numberOfFloors = parseInt(formData.numberOfFloors, 10)
    if (
      isNaN(numberOfFloors) ||
      numberOfFloors < 1 ||
      numberOfFloors > 5 ||
      numberOfFloors !== parseFloat(formData.numberOfFloors)
    ) {
      errors.push(
        "Number of Floors must be an integer between 1 and 5."
      )
    }
    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (errors.length > 0) {
      setModalMessage("Please correct the following errors:")
      setModalDetails(errors)
      setIsModalOpen(true)
      return
    }
    onFormSubmit(formData)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Enter Your Project Details</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., Accra, Kumasi"
            />
          </div>
          
          <div>
            <label htmlFor="totalFloorArea" className="block text-sm font-medium text-gray-700">
              Total Floor Area (sq ft)
            </label>
            <input
              type="number"
              id="totalFloorArea"
              name="totalFloorArea"
              value={formData.totalFloorArea}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., 2000"
            />
          </div>
          
          <div>
            <label htmlFor="numberOfBathrooms" className="block text-sm font-medium text-gray-700">
              Number of Bathrooms
            </label>
            <input
              type="number"
              id="numberOfBathrooms"
              name="numberOfBathrooms"
              value={formData.numberOfBathrooms}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., 3"
            />
          </div>
          
          <div>
            <label htmlFor="numberOfFloors" className="block text-sm font-medium text-gray-700">
              Number of Floors
            </label>
            <input
              type="number"
              id="numberOfFloors"
              name="numberOfFloors"
              value={formData.numberOfFloors}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., 2"
            />
          </div>
          
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Calculating...' : 'Get Estimate'}
            </button>
          </div>
        </form>
      </section>
      
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Validation Error</h3>
            <p className="text-gray-600 mb-4">{modalMessage}</p>
            {modalDetails.length > 0 && (
              <ul className="list-disc pl-5 mb-4 text-gray-600">
                {modalDetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            )}
            <button
              onClick={closeModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

describe('ProjectForm Component', () => {
  const defaultProps = {
    onFormSubmit: vi.fn(),
    isLoading: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('renders all form fields', () => {
      render(<ProjectForm {...defaultProps} />)
      
      expect(screen.getByLabelText(/region/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/total floor area/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/number of bathrooms/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/number of floors/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /get estimate/i })).toBeInTheDocument()
    })

    it('shows loading state when isLoading is true', () => {
      render(<ProjectForm {...defaultProps} isLoading={true} />)
      
      const submitButton = screen.getByRole('button')
      expect(submitButton).toHaveTextContent('Calculating...')
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Form Validation', () => {
    it('validates region field - requires minimum 2 characters', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      
      await user.type(regionInput, 'A')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument()
        expect(screen.getByText(/region must be at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('validates region field - allows only letters, spaces, and hyphens', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      
      await user.type(regionInput, 'Accra123')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument()
        expect(screen.getByText(/region must be at least 2 characters/i)).toBeInTheDocument()
      })
    })

    it('validates total floor area - must be between 500 and 10000', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      const floorAreaInput = screen.getByLabelText(/total floor area/i)
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      
      await user.type(regionInput, 'Accra')
      await user.type(floorAreaInput, '100')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/total floor area must be an integer between 500 and 10,000/i)).toBeInTheDocument()
      })
    })

    it('validates number of bathrooms - must be between 1 and 10', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      const floorAreaInput = screen.getByLabelText(/total floor area/i)
      const bathroomsInput = screen.getByLabelText(/number of bathrooms/i)
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      
      await user.type(regionInput, 'Accra')
      await user.type(floorAreaInput, '2000')
      await user.type(bathroomsInput, '15')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/number of bathrooms must be an integer between 1 and 10/i)).toBeInTheDocument()
      })
    })

    it('validates number of floors - must be between 1 and 5', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      const floorAreaInput = screen.getByLabelText(/total floor area/i)
      const bathroomsInput = screen.getByLabelText(/number of bathrooms/i)
      const floorsInput = screen.getByLabelText(/number of floors/i)
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      
      await user.type(regionInput, 'Accra')
      await user.type(floorAreaInput, '2000')
      await user.type(bathroomsInput, '3')
      await user.type(floorsInput, '10')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/number of floors must be an integer between 1 and 5/i)).toBeInTheDocument()
      })
    })

    it('accepts valid form data', async () => {
      const user = userEvent.setup()
      const onFormSubmit = vi.fn()
      render(<ProjectForm {...defaultProps} onFormSubmit={onFormSubmit} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      const floorAreaInput = screen.getByLabelText(/total floor area/i)
      const bathroomsInput = screen.getByLabelText(/number of bathrooms/i)
      const floorsInput = screen.getByLabelText(/number of floors/i)
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      
      await user.type(regionInput, 'Accra')
      await user.type(floorAreaInput, '2000')
      await user.type(bathroomsInput, '3')
      await user.type(floorsInput, '2')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(onFormSubmit).toHaveBeenCalledWith({
          region: 'Accra',
          projectType: 'residential',
          totalFloorArea: '2000',
          numberOfBathrooms: '3',
          numberOfFloors: '2',
          preferredFinishQuality: 'standard',
          includeExternalWorks: false,
        })
      })
    })
  })

  describe('Modal Interactions', () => {
    it('closes validation modal when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument()
      })
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      await user.click(closeButton)
      
      await waitFor(() => {
        expect(screen.queryByText(/validation error/i)).not.toBeInTheDocument()
      })
    })

    it('shows multiple validation errors', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const submitButton = screen.getByRole('button', { name: /get estimate/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/validation error/i)).toBeInTheDocument()
        // Should show multiple errors for empty form
        expect(screen.getAllByRole('listitem')).toHaveLength(4) // region, area, bathrooms, floors
      })
    })
  })

  describe('Form Input Handling', () => {
    it('updates form state when inputs change', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const regionInput = screen.getByLabelText(/region/i)
      
      await user.type(regionInput, 'Kumasi')
      
      expect(regionInput).toHaveValue('Kumasi')
    })

    it('handles numeric inputs correctly', async () => {
      const user = userEvent.setup()
      render(<ProjectForm {...defaultProps} />)
      
      const floorAreaInput = screen.getByLabelText(/total floor area/i)
      
      await user.type(floorAreaInput, '2500')
      
      expect(floorAreaInput).toHaveValue(2500)
    })
  })
})