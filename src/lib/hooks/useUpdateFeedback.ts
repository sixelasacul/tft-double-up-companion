import { useRef, useState } from "react"

type UseUpdateFeedbackOptions = {
  delay?: number;
}

type Timeout = ReturnType<typeof setTimeout>

export function useUpdateFeedback({delay = 500}: UseUpdateFeedbackOptions = {}) {
  const [shouldShowUpdateFeedback, setShouldShowUpdateFeedback] = useState(false)
  const feedbackTimeout = useRef<Timeout | null>(null)

  function triggerUpdateFeedback() {
    setShouldShowUpdateFeedback(true)
    if(feedbackTimeout.current) {
      clearTimeout(feedbackTimeout.current)
    }
    feedbackTimeout.current = setTimeout(() => {
      setShouldShowUpdateFeedback(false)
    }, delay)
  }

  return {shouldShowUpdateFeedback, triggerUpdateFeedback}
}
