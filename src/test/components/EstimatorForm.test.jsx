import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EstimatorForm from '../../components/EstimatorForm.jsx'

describe('EstimatorForm', () => {
  it('renders EstimatorForm with submit button', () => {
    render(<EstimatorForm />)
    const submitButton = screen.getByRole('button', { name: /estimate/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('renders input field', () => {
    render(<EstimatorForm />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()
  })
})
