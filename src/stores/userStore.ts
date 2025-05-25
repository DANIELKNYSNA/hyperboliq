import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials, RegisterCredentials } from '@/interfaces/user'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  // Games data
  const quizzScores = ref<Record<string, number>>({})

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const userFullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
  })

  const isAdmin = computed(() => {
    return user.value?.role === 'admin'
  })

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  /**
   * Login user - Simple validation and set user
   * @param credentials - User login credentials
   * @returns Promise that resolves when login is successful
   * @throws Error if validation fails or login is unsuccessful
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    return new Promise((resolve, reject) => {
      isLoading.value = true

      setTimeout(() => {
        try {
          // Basic validation
          if (!credentials.email || !credentials.password) {
            throw new Error('Email and password are required')
          }
          if (!isValidEmail(credentials.email)) {
            throw new Error('Please enter a valid email address')
          }
          if (credentials.password.length < 6) {
            throw new Error('Password must be at least 6 characters')
          }
          // For demo purposes, reject if password is 'wrong'
          if (credentials.password === 'wrong') {
            throw new Error('Invalid email or password')
          }
          // Check if this is the admin account
          const isAdminAccount = credentials.email.toLowerCase() === 'admin@admin.com' &&
                                credentials.password === 'Admin123'

          const userData: User = {
            id: generateId(),
            email: credentials.email.toLowerCase(),
            firstName: isAdminAccount ? 'Admin' : 'John',
            lastName: isAdminAccount ? 'User' : 'Doe',
            role: isAdminAccount ? 'admin' : 'user',
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          }
          user.value = userData
          isLoading.value = false
          resolve()

        } catch (error) {
          isLoading.value = false
          reject(error)
        }
      }, 1000)
    })
  }

  /**
   * Register user - Simple validation and set user
   * @param credentials - User registration credentials
   * @returns Promise that resolves when registration is successful
   * @throws Error if validation fails or registration is unsuccessful
   */
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    return new Promise((resolve, reject) => {
      isLoading.value = true

      setTimeout(() => {
        try {
          // Basic validation
          if (!credentials.firstName || !credentials.lastName || !credentials.email || !credentials.password) {
            throw new Error('All fields are required')
          }
          if (credentials.firstName.trim().length < 2) {
            throw new Error('First name must be at least 2 characters')
          }
          if (credentials.lastName.trim().length < 2) {
            throw new Error('Last name must be at least 2 characters')
          }
          if (!isValidEmail(credentials.email)) {
            throw new Error('Please enter a valid email address')
          }
          if (credentials.password.length < 8) {
            throw new Error('Password must be at least 8 characters')
          }
          // For demo purposes, reject if email is already 'taken'
          if (credentials.email.toLowerCase() === 'taken@example.com') {
            throw new Error('Email address is already registered')
          }
          // Create new user object
          const userData: User = {
            id: generateId(),
            email: credentials.email.toLowerCase(),
            firstName: credentials.firstName.trim(),
            lastName: credentials.lastName.trim(),
            role: 'user', // New registrations are always regular users
            createdAt: new Date().toISOString()
          }
          user.value = userData

          isLoading.value = false
          resolve()

        } catch (error) {
          isLoading.value = false
          reject(error)
        }
      }, 1500)
    })
  }

  const logout = (): void => {
    user.value = null
  }

  const updateProfile = (updates: Partial<Pick<User, 'firstName' | 'lastName'>>): void => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  return {
    // State
    user,
    isLoading,
    quizzScores,
    // Getters
    isAuthenticated,
    userFullName,
    userInitials,
    isAdmin,

    // Actions
    login,
    register,
    logout,
    updateProfile
  }
}, {
  persist: true
})