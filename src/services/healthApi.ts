import type { HealthResponse } from '../types/health'

const API_BASE_URL = 'http://localhost:8081'

export async function getHealth(
  signal: AbortSignal
): Promise<HealthResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/health`,
    { signal }
  )

  if (!response.ok) {
    throw new Error(
      `Health API failed with status ${response.status}`
    )
  }

  return (await response.json()) as HealthResponse
}
