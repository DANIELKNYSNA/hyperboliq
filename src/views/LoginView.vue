<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBuilding, faBolt, faFlask, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useUserStore } from '@/stores/userStore'
import { useUiStore } from '@/stores/uiStore'

// PrimeVue components
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
// import ProgressSpinner from 'primevue/progressspinner'

library.add(faBuilding, faBolt, faFlask, faArrowRight, faEye, faEyeSlash)

const router = useRouter()
const userStore = useUserStore()
const uiStore = useUiStore()

// We need a local mode to avoid flickering on the background image when the change is made
const isDarkMode = computed(() => uiStore.isDarkMode)
const localDarkMode = ref(isDarkMode.value)

// Form state
const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Form data
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false
})

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

// Form validation
const loginErrors = ref({
  email: '',
  password: ''
})

const registerErrors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: ''
})

// Computed properties
const isLoginFormValid = computed(() => {
  return loginForm.value.email &&
         loginForm.value.password &&
         !loginErrors.value.email &&
         !loginErrors.value.password
})

const isRegisterFormValid = computed(() => {
  return registerForm.value.firstName &&
         registerForm.value.lastName &&
         registerForm.value.email &&
         registerForm.value.password &&
         registerForm.value.confirmPassword &&
         registerForm.value.agreeToTerms &&
         !Object.values(registerErrors.value).some(error => error)
})

// Methods
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateLoginForm = () => {
  loginErrors.value = { email: '', password: '' }

  if (!loginForm.value.email) {
    loginErrors.value.email = 'Email is required'
  } else if (!validateEmail(loginForm.value.email)) {
    loginErrors.value.email = 'Please enter a valid email'
  }

  if (!loginForm.value.password) {
    loginErrors.value.password = 'Password is required'
  }
}

const validateRegisterForm = () => {
  registerErrors.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  }

  if (!registerForm.value.firstName) {
    registerErrors.value.firstName = 'First name is required'
  }

  if (!registerForm.value.lastName) {
    registerErrors.value.lastName = 'Last name is required'
  }

  if (!registerForm.value.email) {
    registerErrors.value.email = 'Email is required'
  } else if (!validateEmail(registerForm.value.email)) {
    registerErrors.value.email = 'Please enter a valid email'
  }

  if (!registerForm.value.password) {
    registerErrors.value.password = 'Password is required'
  } else if (registerForm.value.password.length < 8) {
    registerErrors.value.password = 'Password must be at least 8 characters'
  }

  if (!registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Please confirm your password'
  } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
    registerErrors.value.confirmPassword = 'Passwords do not match'
  }

  if (!registerForm.value.agreeToTerms) {
    registerErrors.value.agreeToTerms = 'You must agree to the terms and conditions'
  }
}

const handleLogin = async () => {
  validateLoginForm()

  if (!isLoginFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Replace with actual login logic
    await userStore.login({
      email: loginForm.value.email,
      password: loginForm.value.password,
      rememberMe: loginForm.value.rememberMe
    })

    successMessage.value = 'Login successful! Redirecting...'

    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (error) {
    errorMessage.value = 'Invalid email or password. Please try again.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}

const handleRegister = async () => {
  validateRegisterForm()

  if (!isRegisterFormValid.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Replace with actual registration logic
    await userStore.register({
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password
    })

    successMessage.value = 'Account created successfully! Please check your email to verify your account.'

    setTimeout(() => {
      toggleMode()
    }, 2000)

  } catch (error) {
    errorMessage.value = 'Registration failed. Please try again.'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
  successMessage.value = ''

  // Reset forms
  loginForm.value = { email: '', password: '', rememberMe: false }
  registerForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  }

  // Reset errors
  loginErrors.value = { email: '', password: '' }
  registerErrors.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: ''
  }
}

onMounted(() => {
  // Watch for dark mode changes
  watch(isDarkMode, (newValue) => {
    localDarkMode.value = newValue
  })
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
    <!-- Background -->
    <div class="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat -z-30 bg-hogwarts-light"
      :class="{ 'bg-hogwarts': localDarkMode }">
    </div>

    <!-- Overlay for better readability -->
    <div class="fixed top-0 left-0 w-full h-full bg-black/20 -z-20"></div>

    <!-- Auth Card -->
    <Card class="w-full max-w-md mx-auto backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 shadow-2xl">
      <template #header>
        <div class="text-center py-6">
          <div class="flex justify-center mb-4">
            <FontAwesomeIcon
              :icon="isLogin ? 'bolt' : 'flask'"
              class="text-4xl text-primary"
            />
          </div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ isLogin ? 'Welcome Back' : 'Create Account' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-300 mt-2">
            {{ isLogin ? 'Sign in to your account' : 'Join us today' }}
          </p>
        </div>
      </template>

      <template #content>
        <!-- Error Message -->
        <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">
          {{ errorMessage }}
        </Message>

        <!-- Success Message -->
        <Message v-if="successMessage" severity="success" :closable="false" class="mb-4">
          {{ successMessage }}
        </Message>

        <!-- Login Form -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email -->
          <div>
            <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <InputText
              id="login-email"
              v-model="loginForm.email"
              type="email"
              placeholder="Enter your email"
              class="w-full"
              :class="{ 'p-invalid': loginErrors.email }"
              @blur="validateLoginForm"
            />
            <small v-if="loginErrors.email" class="p-error">{{ loginErrors.email }}</small>
          </div>

          <!-- Password -->
          <div>
            <label for="login-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Password
              id="login-password"
              v-model="loginForm.password"
              placeholder="Enter your password"
              :feedback="false"
              toggle-mask
              class="w-full"
              :class="{ 'p-invalid': loginErrors.password }"
              @blur="validateLoginForm"
            />
            <small v-if="loginErrors.password" class="p-error">{{ loginErrors.password }}</small>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <Checkbox
              id="remember-me"
              v-model="loginForm.rememberMe"
              :binary="true"
            />
            <label for="remember-me" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <!-- Login Button -->
          <Button
            type="submit"
            label="Sign In"
            :loading="isLoading"
            :disabled="!isLoginFormValid || isLoading"
            class="w-full"
            icon="pi pi-sign-in"
          />
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <InputText
                id="first-name"
                v-model="registerForm.firstName"
                placeholder="First name"
                class="w-full"
                :class="{ 'p-invalid': registerErrors.firstName }"
                @blur="validateRegisterForm"
              />
              <small v-if="registerErrors.firstName" class="p-error">{{ registerErrors.firstName }}</small>
            </div>

            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <InputText
                id="last-name"
                v-model="registerForm.lastName"
                placeholder="Last name"
                class="w-full"
                :class="{ 'p-invalid': registerErrors.lastName }"
                @blur="validateRegisterForm"
              />
              <small v-if="registerErrors.lastName" class="p-error">{{ registerErrors.lastName }}</small>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="register-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <InputText
              id="register-email"
              v-model="registerForm.email"
              type="email"
              placeholder="Enter your email"
              class="w-full"
              :class="{ 'p-invalid': registerErrors.email }"
              @blur="validateRegisterForm"
            />
            <small v-if="registerErrors.email" class="p-error">{{ registerErrors.email }}</small>
          </div>

          <!-- Password -->
          <div>
            <label for="register-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <Password
              id="register-password"
              v-model="registerForm.password"
              placeholder="Create a password"
              :feedback="true"
              toggle-mask
              class="w-full"
              :class="{ 'p-invalid': registerErrors.password }"
              @blur="validateRegisterForm"
            />
            <small v-if="registerErrors.password" class="p-error">{{ registerErrors.password }}</small>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <Password
              id="confirm-password"
              v-model="registerForm.confirmPassword"
              placeholder="Confirm your password"
              :feedback="false"
              toggle-mask
              class="w-full"
              :class="{ 'p-invalid': registerErrors.confirmPassword }"
              @blur="validateRegisterForm"
            />
            <small v-if="registerErrors.confirmPassword" class="p-error">{{ registerErrors.confirmPassword }}</small>
          </div>

          <!-- Terms Agreement -->
          <div class="flex items-start">
            <Checkbox
              id="agree-terms"
              v-model="registerForm.agreeToTerms"
              :binary="true"
              :class="{ 'p-invalid': registerErrors.agreeToTerms }"
            />
            <label for="agree-terms" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
              I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a>
              and <a href="#" class="text-primary hover:underline">Privacy Policy</a>
            </label>
          </div>
          <small v-if="registerErrors.agreeToTerms" class="p-error block">{{ registerErrors.agreeToTerms }}</small>

          <!-- Register Button -->
          <Button
            type="submit"
            label="Create Account"
            :loading="isLoading"
            :disabled="!isRegisterFormValid || isLoading"
            class="w-full"
            icon="pi pi-user-plus"
          />
        </form>

        <!-- Divider -->
        <Divider align="center" class="my-6">
          <span class="text-gray-500 dark:text-gray-400 text-sm">or</span>
        </Divider>

        <!-- Toggle Mode -->
        <div class="text-center">
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
            {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          </p>
          <Button
            :label="isLogin ? 'Create Account' : 'Sign In'"
            link
            @click="toggleMode"
            :disabled="isLoading"
            class="text-primary hover:underline"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.bg-hogwarts-light {
  background-image: url('../assets/images/hogwarts-legacy.jpg');
}

.bg-hogwarts {
  background-image: url('../assets/images/UkSkylineColour.jpg');
}

/* Custom styling for better backdrop effect */
:deep(.p-card) {
  border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.p-card-content) {
  padding: 2rem;
}

/* Loading spinner overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Form styling improvements */
:deep(.p-inputtext),
:deep(.p-password) {
  width: 100%;
}

:deep(.p-button) {
  justify-content: center;
}

/* Error styling */
.p-error {
  color: #e24c4c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

:deep(.p-invalid) {
  border-color: #e24c4c;
}
</style>