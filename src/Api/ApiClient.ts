type Primitive = string | number | boolean | null

interface PostOptions {
  parameters?: { [key: string]: Primitive }
  serializer?: 'formData' | 'json' | 'raw'
}

interface PutOptions {
  parameters?: { [key: string]: Primitive | Primitive[] }
  serializer?: 'formData' | 'json' | 'raw'
  data: { [key: string]: Primitive | Primitive[] }
}

export interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
}

export interface IApiClient {
  get<T>(url: string, parameters?: { [key: string]: Primitive }): Promise<ApiResponse<T>>
  post<T>(url: string, data: { [key: string]: Primitive }, options?: PostOptions): Promise<ApiResponse<T>>
  put<T>(url: string, options: PutOptions): Promise<ApiResponse<T>>
  delete<T>(url: string, parameters?: { [key: string]: Primitive }): Promise<ApiResponse<T>>
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public response?: Response
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ErrorWithStatus extends Error {
  status: number
}

export default class ApiClient implements IApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json;charset=utf-8',
  }
  protected serviceName: string = ''

  constructor() {
    this.baseURL = 'https://wizard-world-api.herokuapp.com/'
  }

  private createUrl(url: string, parameters?: { [key: string]: Primitive | Primitive[] }): string {
    const fullUrl = `${this.baseURL}${this.serviceName}${url}`

    if (!parameters) return fullUrl

    // Build query string
    const searchParams = new URLSearchParams()
    Object.entries(parameters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${fullUrl}?${queryString}` : fullUrl
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T

    // Check if response has content
    const contentType = response.headers.get('content-type')
    const hasJsonContent = contentType?.includes('application/json')
    const hasTextContent = contentType?.includes('text/')

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`

      try {
        if (hasJsonContent) {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } else if (hasTextContent) {
          errorMessage = await response.text() || errorMessage
        }
      } catch {
        // If parsing error response fails, use default message
      }

      throw new ApiError(errorMessage, response.status, response.statusText, response)
    }

    // Parse successful response
    try {
      if (hasJsonContent) {
        data = await response.json()
      } else if (hasTextContent) {
        data = (await response.text()) as unknown as T
      } else {
        // For responses with no content (like 204 No Content)
        data = null as unknown as T
      }
    } catch (error) {
      console.error('Error parsing response:', error)
      throw new ApiError(
        'Failed to parse response',
        response.status,
        response.statusText,
        response,
      )
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    }
  }

  async get<T>(url: string, parameters?: { [key: string]: Primitive }): Promise<ApiResponse<T>> {
    const finalUrl = this.createUrl(url, parameters)

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
      },
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(
    url: string,
    data: { [key: string]: Primitive },
    options: PostOptions = {}
  ): Promise<ApiResponse<T>> {
    const { parameters, serializer = 'json' } = options
    const finalUrl = this.createUrl(url, parameters)

    let body: string | FormData
    const headers: Record<string, string> = { ...this.defaultHeaders }

    // Prepare body based on serializer
    switch (serializer) {
      case 'json':
        body = JSON.stringify(data)
        headers['Content-Type'] = 'application/json;charset=utf-8'
        break

      case 'formData':
        body = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            ;(body as FormData).append(key, String(value))
          }
        })
        // Remove Content-Type header for FormData (browser sets it automatically)
        delete headers['Content-Type']
        break

      case 'raw':
        body = data as unknown as string
        headers['Content-Type'] = 'text/plain'
        break

      default:
        body = JSON.stringify(data)
        headers['Content-Type'] = 'application/json;charset=utf-8'
    }

    const response = await fetch(finalUrl, {
      method: 'POST',
      headers,
      body,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(url: string, options: PutOptions): Promise<ApiResponse<T>> {
    const { parameters, serializer = 'json', data } = options
    const finalUrl = this.createUrl(url, parameters)

    let body: string | FormData
    const headers: Record<string, string> = { ...this.defaultHeaders }

    // Prepare body based on serializer
    switch (serializer) {
      case 'json':
        body = JSON.stringify(data)
        headers['Content-Type'] = 'application/json;charset=utf-8'
        break

      case 'formData':
        body = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach(item => (body as FormData).append(key, String(item)))
            } else {
              ;(body as FormData).append(key, String(value))
            }
          }
        })
        delete headers['Content-Type']
        break

      case 'raw':
        body = data as unknown as string
        headers['Content-Type'] = 'text/plain'
        break

      default:
        body = JSON.stringify(data)
        headers['Content-Type'] = 'application/json;charset=utf-8'
    }

    const response = await fetch(finalUrl, {
      method: 'PUT',
      headers,
      body,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(url: string, parameters?: { [key: string]: Primitive }): Promise<ApiResponse<T>> {
    const finalUrl = this.createUrl(url, parameters)

    const response = await fetch(finalUrl, {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
      },
    })

    return this.handleResponse<T>(response)
  }

  // Helper method to set authorization header
  setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`,
    }
  }

  // Helper method to remove authorization header
  clearAuthToken(): void {
    const headers = { ...this.defaultHeaders }
    delete headers['Authorization']
    this.defaultHeaders = headers
  }
}

// Updated QueryClient.ts - Same as before
import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as ErrorWithStatus).status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})
