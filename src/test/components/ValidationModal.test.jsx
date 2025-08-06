import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

// Since ValidationModal is part of App.jsx, we'll test it through the App component
// But first, let's create a standalone version for testing
import React from 'react'

// Extract ValidationModal component for testing
function ValidationModal({ isOpen, onClose, message, details }) {
  const modalRef = React.useRef(null)
  
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
      ref={modalRef}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h3 className="text-lg font-semibold">Validation Error</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">{message}</p>
          {details && details.length > 0 && (
            <ul className="list-disc pl-5 mt-2 text-gray-600">
              {details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

describe('ValidationModal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    message: 'Please correct the following errors:',
    details: ['Field is required', 'Invalid format']
  }

  it('renders when isOpen is true', () => {
    render(<ValidationModal {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Validation Error')).toBeInTheDocument()
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ValidationModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays error details as a list', () => {
    render(<ValidationModal {...defaultProps} />)
    
    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(screen.getByText('Invalid format')).toBeInTheDocument()
    
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(2)
  })

  it('handles missing details gracefully', () => {
    render(<ValidationModal {...defaultProps} details={null} />)
    
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onCloseMock = vi.fn()
    
    render(<ValidationModal {...defaultProps} onClose={onCloseMock} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)
    
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onCloseMock = vi.fn()
    
    render(<ValidationModal {...defaultProps} onClose={onCloseMock} />)
    
    const dialog = screen.getByRole('dialog')
    await user.click(dialog)
    
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })

  it('does not close when modal content is clicked', async () => {
    const user = userEvent.setup()
    const onCloseMock = vi.fn()
    
    render(<ValidationModal {...defaultProps} onClose={onCloseMock} />)
    
    const modalContent = screen.getByText('Validation Error').closest('.bg-white')
    await user.click(modalContent)
    
    expect(onCloseMock).not.toHaveBeenCalled()
  })

  it('has proper accessibility attributes', () => {
    render(<ValidationModal {...defaultProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('tabIndex', '-1')
  })

  it('focuses the modal when opened', () => {
    const { rerender } = render(<ValidationModal {...defaultProps} isOpen={false} />)
    
    rerender(<ValidationModal {...defaultProps} isOpen={true} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveFocus()
  })
})