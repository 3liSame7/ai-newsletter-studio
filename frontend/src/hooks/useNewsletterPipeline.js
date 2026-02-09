import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook to manage the newsletter generation pipeline via SSE
 * @param {string} query - The search query
 * @returns {Object} Pipeline state with currentStep, stepData, loading, error
 */
export function useNewsletterPipeline(query) {
  const [currentStep, setCurrentStep] = useState(0)
  const [stepData, setStepData] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  })
  const [stepStatus, setStepStatus] = useState({
    1: 'wait',
    2: 'wait',
    3: 'wait',
    4: 'wait',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [completed, setCompleted] = useState(false)
  const eventSourceRef = useRef(null)

  useEffect(() => {
    if (!query) return

    setLoading(true)
    setError(null)
    setCompleted(false)
    setCurrentStep(0)
    setStepData({ 1: null, 2: null, 3: null, 4: null })
    setStepStatus({ 1: 'wait', 2: 'wait', 3: 'wait', 4: 'wait' })

    // Create EventSource connection
    const eventSource = new EventSource(`/api/search?query=${encodeURIComponent(query)}`)
    eventSourceRef.current = eventSource

    eventSource.addEventListener('step', (event) => {
      const data = JSON.parse(event.data)
      const { step, status, data: stepContent } = data

      if (status === 'processing') {
        setCurrentStep(step)
        setStepStatus(prev => ({ ...prev, [step]: 'process' }))
      } else if (status === 'completed') {
        setStepData(prev => ({ ...prev, [step]: stepContent }))
        setStepStatus(prev => ({ ...prev, [step]: 'finish' }))
      }
    })

    eventSource.addEventListener('complete', () => {
      setLoading(false)
      setCompleted(true)
      eventSource.close()
    })

    eventSource.addEventListener('error', (event) => {
      console.log('SSE error event:', event)
      if (event.data) {
        try {
          const errorData = JSON.parse(event.data)
          const errorMessage = errorData.message || 'An error occurred during processing'
          setError(errorMessage)
          console.error('Pipeline error:', errorMessage)
          if (errorData.trace) {
            console.error('Error trace:', errorData.trace)
          }
        } catch (e) {
          setError('An error occurred during processing')
        }
      }
      setLoading(false)
      eventSource.close()
    })

    eventSource.onerror = (err) => {
      console.error('EventSource connection error:', err)
      // Only set error if we haven't already received an error event
      if (!error) {
        setError('Connection to server lost. Please check if the backend is running and try again.')
      }
      setLoading(false)
      eventSource.close()
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [query])

  const retry = () => {
    setError(null)
    setLoading(true)
    setCurrentStep(0)
    setStepData({ 1: null, 2: null, 3: null, 4: null })
    setStepStatus({ 1: 'wait', 2: 'wait', 3: 'wait', 4: 'wait' })
  }

  return {
    currentStep,
    stepData,
    stepStatus,
    loading,
    error,
    completed,
    retry,
  }
}
