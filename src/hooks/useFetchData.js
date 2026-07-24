import { useEffect, useState } from 'react'

// Generic data-loading hook used by every page. Adds a short artificial delay
// so the loading skeletons (required by the brief) are visible even against
// the fast local JSON fallback.
export function useFetchData(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const minDelay = new Promise((resolve) => setTimeout(resolve, 500))

    Promise.all([fetchFn(), minDelay])
      .then(([result]) => {
        if (!cancelled) {
          setData(result)
          setError(null)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
