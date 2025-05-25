import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../../../src/stores/userStore'
import type { User, LoginCredentials, RegisterCredentials } from '../../../src/interfaces/user'

// Mock the persistence plugin if needed
vi.mock('pinia-plugin-persistedstate', () => ({
  default: () => ({})
}))

describe('useUserStore', () => {
  let store: ReturnType<typeof useUserStore>

  const mockUser: User = {
    id: 'test-user-123',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-01-02T00:00:00.000Z'
  }

  const mockAdminUser: User = {
    id: 'admin-user-456',
    email: 'admin@admin.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-01-02T00:00:00.000Z'
  }

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useUserStore()

    // Mock timers for testing async operations
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      expect(store.user).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.quizzScores).toEqual({})
    })

    it('should be a Pinia store with correct store id', () => {
      expect(store.$id).toBe('user')
    })

    it('should have all expected state properties, computed properties, and actions', () => {
      // State
      expect(store).toHaveProperty('user')
      expect(store).toHaveProperty('isLoading')
      expect(store).toHaveProperty('quizzScores')

      // Computed
      expect(store).toHaveProperty('isAuthenticated')
      expect(store).toHaveProperty('userFullName')
      expect(store).toHaveProperty('userInitials')
      expect(store).toHaveProperty('isAdmin')

      // Actions
      expect(store).toHaveProperty('login')
      expect(store).toHaveProperty('register')
      expect(store).toHaveProperty('logout')
      expect(store).toHaveProperty('updateProfile')

      expect(typeof store.login).toBe('function')
      expect(typeof store.register).toBe('function')
      expect(typeof store.logout).toBe('function')
      expect(typeof store.updateProfile).toBe('function')
    })
  })

  describe('State Management', () => {
    it('should allow setting user', () => {
      store.user = mockUser

      expect(store.user).toEqual(mockUser)
      expect(store.user?.firstName).toBe('John')
      expect(store.user?.role).toBe('user')
    })

    it('should allow setting isLoading', () => {
      store.isLoading = true
      expect(store.isLoading).toBe(true)

      store.isLoading = false
      expect(store.isLoading).toBe(false)
    })

    it('should allow setting quizzScores', () => {
      const scores = { 'quiz-1': 85, 'quiz-2': 92, 'quiz-3': 78 }
      store.quizzScores = scores

      expect(store.quizzScores).toEqual(scores)
      expect(store.quizzScores['quiz-1']).toBe(85)
    })

    it('should maintain reactivity when state changes', () => {
      store.user = mockUser
      expect(store.user?.firstName).toBe('John')

      store.user = mockAdminUser
      expect(store.user?.firstName).toBe('Admin')
      expect(store.user?.role).toBe('admin')
    })
  })

  describe('Computed Properties', () => {
    describe('isAuthenticated', () => {
      it('should return false when user is null', () => {
        store.user = null
        expect(store.isAuthenticated).toBe(false)
      })

      it('should return true when user is set', () => {
        store.user = mockUser
        expect(store.isAuthenticated).toBe(true)
      })

      it('should be reactive to user changes', () => {
        expect(store.isAuthenticated).toBe(false)

        store.user = mockUser
        expect(store.isAuthenticated).toBe(true)

        store.user = null
        expect(store.isAuthenticated).toBe(false)
      })
    })

    describe('userFullName', () => {
      it('should return empty string when user is null', () => {
        store.user = null
        expect(store.userFullName).toBe('')
      })

      it('should return full name when user is set', () => {
        store.user = mockUser
        expect(store.userFullName).toBe('John Doe')
      })

      it('should update when user changes', () => {
        store.user = mockUser
        expect(store.userFullName).toBe('John Doe')

        store.user = mockAdminUser
        expect(store.userFullName).toBe('Admin User')
      })

      it('should handle users with different names', () => {
        const customUser: User = {
          ...mockUser,
          firstName: 'Jane',
          lastName: 'Smith'
        }
        store.user = customUser
        expect(store.userFullName).toBe('Jane Smith')
      })
    })

    describe('userInitials', () => {
      it('should return empty string when user is null', () => {
        store.user = null
        expect(store.userInitials).toBe('')
      })

      it('should return uppercase initials when user is set', () => {
        store.user = mockUser
        expect(store.userInitials).toBe('JD')
      })

      it('should handle lowercase names', () => {
        const lowercaseUser: User = {
          ...mockUser,
          firstName: 'john',
          lastName: 'doe'
        }
        store.user = lowercaseUser
        expect(store.userInitials).toBe('JD')
      })

      it('should handle single character names', () => {
        const singleCharUser: User = {
          ...mockUser,
          firstName: 'A',
          lastName: 'B'
        }
        store.user = singleCharUser
        expect(store.userInitials).toBe('AB')
      })

      it('should update when user changes', () => {
        store.user = mockUser
        expect(store.userInitials).toBe('JD')

        store.user = mockAdminUser
        expect(store.userInitials).toBe('AU')
      })
    })

    describe('isAdmin', () => {
      it('should return false when user is null', () => {
        store.user = null
        expect(store.isAdmin).toBe(false)
      })

      it('should return false when user role is "user"', () => {
        store.user = mockUser
        expect(store.isAdmin).toBe(false)
      })

      it('should return true when user role is "admin"', () => {
        store.user = mockAdminUser
        expect(store.isAdmin).toBe(true)
      })

      it('should be reactive to user role changes', () => {
        store.user = mockUser
        expect(store.isAdmin).toBe(false)

        store.user = mockAdminUser
        expect(store.isAdmin).toBe(true)
      })
    })
  })

  describe('Login Action', () => {
    const validCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    const adminCredentials: LoginCredentials = {
      email: 'admin@admin.com',
      password: 'Admin123'
    }

    it('should successfully login with valid credentials', async () => {
      const loginPromise = store.login(validCredentials)

      expect(store.isLoading).toBe(true)

      // Fast-forward the timer
      vi.advanceTimersByTime(1000)
      await loginPromise

      expect(store.isLoading).toBe(false)
      expect(store.user).not.toBeNull()
      expect(store.user?.email).toBe('test@example.com')
      expect(store.user?.firstName).toBe('John')
      expect(store.user?.lastName).toBe('Doe')
      expect(store.user?.role).toBe('user')
      expect(store.isAuthenticated).toBe(true)
    })

    it('should login admin user with admin credentials', async () => {
      const loginPromise = store.login(adminCredentials)

      vi.advanceTimersByTime(1000)
      await loginPromise

      expect(store.user?.email).toBe('admin@admin.com')
      expect(store.user?.firstName).toBe('Admin')
      expect(store.user?.lastName).toBe('User')
      expect(store.user?.role).toBe('admin')
      expect(store.isAdmin).toBe(true)
    })

    it('should set user ID and timestamps on successful login', async () => {
      const loginPromise = store.login(validCredentials)

      vi.advanceTimersByTime(1000)
      await loginPromise

      expect(store.user?.id).toBeDefined()
      expect(store.user?.createdAt).toBeDefined()
      expect(store.user?.lastLoginAt).toBeDefined()
      expect(typeof store.user?.id).toBe('string')
    })

    it('should normalize email to lowercase', async () => {
      const uppercaseEmail: LoginCredentials = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      }

      const loginPromise = store.login(uppercaseEmail)
      vi.advanceTimersByTime(1000)
      await loginPromise

      expect(store.user?.email).toBe('test@example.com')
    })

    describe('Login Validation Errors', () => {
      it('should reject when email is empty', async () => {
        await expect(async () => {
          const loginPromise = store.login({ email: '', password: 'password123' })
          vi.advanceTimersByTime(1000)
          await loginPromise
        }).rejects.toThrow('Email and password are required')

        expect(store.isLoading).toBe(false)
        expect(store.user).toBeNull()
      })

      it('should reject when password is empty', async () => {
        await expect(async () => {
          const loginPromise = store.login({ email: 'test@example.com', password: '' })
          vi.advanceTimersByTime(1000)
          await loginPromise
        }).rejects.toThrow('Email and password are required')

        expect(store.isLoading).toBe(false)
      })

      it('should reject when email format is invalid', async () => {
        await expect(async () => {
          const loginPromise = store.login({ email: 'invalid-email', password: 'password123' })
          vi.advanceTimersByTime(1000)
          await loginPromise
        }).rejects.toThrow('Please enter a valid email address')
      })

      it('should reject when password is too short', async () => {
        await expect(async () => {
          const loginPromise = store.login({ email: 'test@example.com', password: '123' })
          vi.advanceTimersByTime(1000)
          await loginPromise
        }).rejects.toThrow('Password must be at least 6 characters')
      })

      it('should reject with specific password "wrong"', async () => {
        await expect(async () => {
          const loginPromise = store.login({ email: 'test@example.com', password: 'wrong' })
          vi.advanceTimersByTime(1000)
          await loginPromise
        }).rejects.toThrow('Password must be at least 6 characters')
      })
    })

    it('should handle multiple email formats correctly', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@test-domain.org'
      ]

      for (const email of validEmails) {
        const loginPromise = store.login({ email, password: 'password123' })
        vi.advanceTimersByTime(1000)
        await loginPromise

        expect(store.user?.email).toBe(email.toLowerCase())
        store.logout() // Reset for next iteration
      }
    })
  })

  describe('Register Action', () => {
    const validRegisterCredentials: RegisterCredentials = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'password123'
    }

    it('should successfully register with valid credentials', async () => {
      const registerPromise = store.register(validRegisterCredentials)

      expect(store.isLoading).toBe(true)

      vi.advanceTimersByTime(1500)
      await registerPromise

      expect(store.isLoading).toBe(false)
      expect(store.user).not.toBeNull()
      expect(store.user?.email).toBe('jane.smith@example.com')
      expect(store.user?.firstName).toBe('Jane')
      expect(store.user?.lastName).toBe('Smith')
      expect(store.user?.role).toBe('user')
      expect(store.isAuthenticated).toBe(true)
    })

    it('should set user ID and createdAt timestamp on successful registration', async () => {
      const registerPromise = store.register(validRegisterCredentials)

      vi.advanceTimersByTime(1500)
      await registerPromise

      expect(store.user?.id).toBeDefined()
      expect(store.user?.createdAt).toBeDefined()
      expect(store.user?.lastLoginAt).toBeUndefined() // Should not be set for new registrations
      expect(typeof store.user?.id).toBe('string')
    })

    it('should normalize email to lowercase and trim names', async () => {
      const unnormalizedCredentials: RegisterCredentials = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: 'JOHN.DOE@EXAMPLE.COM',
        password: 'password123'
      }

      const registerPromise = store.register(unnormalizedCredentials)
      vi.advanceTimersByTime(1500)
      await registerPromise

      expect(store.user?.firstName).toBe('John')
      expect(store.user?.lastName).toBe('Doe')
      expect(store.user?.email).toBe('john.doe@example.com')
    })

    it('should always set role to "user" for new registrations', async () => {
      const registerPromise = store.register(validRegisterCredentials)
      vi.advanceTimersByTime(1500)
      await registerPromise

      expect(store.user?.role).toBe('user')
      expect(store.isAdmin).toBe(false)
    })

    describe('Registration Validation Errors', () => {
      it('should reject when firstName is empty', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: '',
            lastName: 'Smith',
            email: 'test@example.com',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('All fields are required')
      })

      it('should reject when lastName is empty', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: '',
            email: 'test@example.com',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('All fields are required')
      })

      it('should reject when email is empty', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: 'Smith',
            email: '',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('All fields are required')
      })

      it('should reject when password is empty', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'test@example.com',
            password: ''
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('All fields are required')
      })

      it('should reject when firstName is too short', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'J',
            lastName: 'Smith',
            email: 'test@example.com',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('First name must be at least 2 characters')
      })

      it('should reject when lastName is too short', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: 'S',
            email: 'test@example.com',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('Last name must be at least 2 characters')
      })

      it('should reject when email format is invalid', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'invalid-email',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('Please enter a valid email address')
      })

      it('should reject when password is too short (less than 8 characters)', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'test@example.com',
            password: '1234567'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('Password must be at least 8 characters')
      })

      it('should reject when email is already taken', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'taken@example.com',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('Email address is already registered')
      })

      it('should handle whitespace-only names correctly', async () => {
        await expect(async () => {
          const registerPromise = store.register({
            firstName: '   ',
            lastName: 'Smith',
            email: 'test@example.com',
            password: 'password123'
          })
          vi.advanceTimersByTime(1500)
          await registerPromise
        }).rejects.toThrow('First name must be at least 2 characters')
      })
    })
  })

  describe('Logout Action', () => {
    it('should clear user data on logout', () => {
      store.user = mockUser
      expect(store.isAuthenticated).toBe(true)

      store.logout()

      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.userFullName).toBe('')
      expect(store.userInitials).toBe('')
      expect(store.isAdmin).toBe(false)
    })

    it('should handle logout when no user is logged in', () => {
      expect(store.user).toBeNull()

      // Should not throw
      expect(() => {
        store.logout()
      }).not.toThrow()

      expect(store.user).toBeNull()
    })

    it('should not affect other state when logging out', () => {
      store.user = mockUser
      store.quizzScores = { 'quiz-1': 85 }

      store.logout()

      expect(store.user).toBeNull()
      expect(store.quizzScores).toEqual({ 'quiz-1': 85 }) // Should remain unchanged
    })
  })

  describe('UpdateProfile Action', () => {
    beforeEach(() => {
      store.user = { ...mockUser }
    })

    it('should update user firstName', () => {
      store.updateProfile({ firstName: 'Johnny' })

      expect(store.user?.firstName).toBe('Johnny')
      expect(store.user?.lastName).toBe('Doe') // Should remain unchanged
      expect(store.userFullName).toBe('Johnny Doe')
      expect(store.userInitials).toBe('JD')
    })

    it('should update user lastName', () => {
      store.updateProfile({ lastName: 'Johnson' })

      expect(store.user?.firstName).toBe('John') // Should remain unchanged
      expect(store.user?.lastName).toBe('Johnson')
      expect(store.userFullName).toBe('John Johnson')
      expect(store.userInitials).toBe('JJ')
    })

    it('should update both firstName and lastName', () => {
      store.updateProfile({ firstName: 'Jane', lastName: 'Smith' })

      expect(store.user?.firstName).toBe('Jane')
      expect(store.user?.lastName).toBe('Smith')
      expect(store.userFullName).toBe('Jane Smith')
      expect(store.userInitials).toBe('JS')
    })

    it('should not affect other user properties', () => {
      const originalEmail = store.user?.email
      const originalRole = store.user?.role
      const originalId = store.user?.id

      store.updateProfile({ firstName: 'Updated' })

      expect(store.user?.email).toBe(originalEmail)
      expect(store.user?.role).toBe(originalRole)
      expect(store.user?.id).toBe(originalId)
    })

    it('should handle empty updates gracefully', () => {
      const originalUser = { ...store.user }

      store.updateProfile({})

      expect(store.user).toEqual(originalUser)
    })

    it('should do nothing when no user is logged in', () => {
      store.user = null

      // Should not throw
      expect(() => {
        store.updateProfile({ firstName: 'Test' })
      }).not.toThrow()

      expect(store.user).toBeNull()
    })
  })

  describe('QuizzScores Management', () => {
    it('should allow setting individual quiz scores', () => {
      store.quizzScores = { 'quiz-1': 85 }
      expect(store.quizzScores['quiz-1']).toBe(85)

      store.quizzScores = { ...store.quizzScores, 'quiz-2': 92 }
      expect(store.quizzScores['quiz-1']).toBe(85)
      expect(store.quizzScores['quiz-2']).toBe(92)
    })

    it('should handle multiple quiz scores', () => {
      const scores = {
        'potions-quiz': 78,
        'spells-quiz': 91,
        'history-quiz': 65,
        'herbology-quiz': 88
      }

      store.quizzScores = scores
      expect(store.quizzScores).toEqual(scores)
    })

    it('should allow updating existing scores', () => {
      store.quizzScores = { 'quiz-1': 75 }
      expect(store.quizzScores['quiz-1']).toBe(75)

      store.quizzScores = { ...store.quizzScores, 'quiz-1': 85 }
      expect(store.quizzScores['quiz-1']).toBe(85)
    })
  })

  describe('Type Safety', () => {
    it('should maintain proper TypeScript types', () => {
      // Set state to ensure types work
      store.user = mockUser
      store.quizzScores = { 'quiz-1': 85 }

      // Access properties to ensure types are correct
      const userId: string = store.user?.id || ''
      const userEmail: string = store.user?.email || ''
      const userRole: 'user' | 'admin' = store.user?.role || 'user'
      const isAuth: boolean = store.isAuthenticated
      const fullName: string = store.userFullName
      const initials: string = store.userInitials
      const adminStatus: boolean = store.isAdmin
      const quizScore: number = store.quizzScores['quiz-1'] || 0

      expect(typeof userId).toBe('string')
      expect(typeof userEmail).toBe('string')
      expect(['user', 'admin']).toContain(userRole)
      expect(typeof isAuth).toBe('boolean')
      expect(typeof fullName).toBe('string')
      expect(typeof initials).toBe('string')
      expect(typeof adminStatus).toBe('boolean')
      expect(typeof quizScore).toBe('number')
    })

    it('should handle nullable user correctly', () => {
      store.user = null

      expect(store.user).toBeNull()
      expect(store.user?.firstName).toBeUndefined()
      expect(store.isAuthenticated).toBe(false)
      expect(store.userFullName).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('should handle special characters in names', async () => {
      const specialCharCredentials: RegisterCredentials = {
        firstName: "Jean-François",
        lastName: "O'Connor",
        email: 'jean@example.com',
        password: 'password123'
      }

      const registerPromise = store.register(specialCharCredentials)
      vi.advanceTimersByTime(1500)
      await registerPromise

      expect(store.user?.firstName).toBe("Jean-François")
      expect(store.user?.lastName).toBe("O'Connor")
      expect(store.userFullName).toBe("Jean-François O'Connor")
    })

    it('should handle very long names', async () => {
      const longNameCredentials: RegisterCredentials = {
        firstName: 'Verylongfirstnamethatexceedsnormallimits',
        lastName: 'Verylonglastnamethatexceedsnormallimits',
        email: 'long@example.com',
        password: 'password123'
      }

      const registerPromise = store.register(longNameCredentials)
      vi.advanceTimersByTime(1500)
      await registerPromise

      expect(store.user?.firstName).toBe('Verylongfirstnamethatexceedsnormallimits')
      expect(store.userInitials).toBe('VV')
    })

    it('should handle concurrent login attempts', async () => {
      const credentials1: LoginCredentials = { email: 'user1@example.com', password: 'password123' }
      const credentials2: LoginCredentials = { email: 'user2@example.com', password: 'password123' }

      const login1Promise = store.login(credentials1)
      const login2Promise = store.login(credentials2)

      vi.advanceTimersByTime(1000)

      // Both should complete, but the last one should win
      await Promise.all([login1Promise, login2Promise])

      expect(store.user?.email).toBe('user2@example.com')
    })

    it('should handle rapid login/logout cycles', async () => {
      const credentials: LoginCredentials = { email: 'test@example.com', password: 'password123' }

      const loginPromise = store.login(credentials)
      vi.advanceTimersByTime(1000)
      await loginPromise

      expect(store.isAuthenticated).toBe(true)

      store.logout()
      expect(store.isAuthenticated).toBe(false)

      const loginPromise2 = store.login(credentials)
      vi.advanceTimersByTime(1000)
      await loginPromise2

      expect(store.isAuthenticated).toBe(true)
    })
  })
})