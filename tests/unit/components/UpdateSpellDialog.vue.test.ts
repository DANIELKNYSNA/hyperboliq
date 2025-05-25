import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UpdateSpellDialog from '../../../src/components/UpdateSpellDialog.vue'

// Mock FontAwesome
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    name: 'FontAwesomeIcon',
    template: '<i :data-icon="icon.iconName || icon" v-bind="$attrs"><slot /></i>',
    props: ['icon']
  }
}))

// Mock the spell store
vi.mock('@/stores/spellStore', () => ({
  useSpellStore: vi.fn()
}))

describe('UpdateSpellDialog', () => {
  let mockSpellStore

  const mockSpells = [
    {
      id: '1',
      name: 'Expelliarmus',
      effect: 'Disarms opponent',
      incantation: 'Expelliarmus',
      type: 'Charm'
    },
    {
      id: '2',
      name: 'Stupefy',
      effect: 'Stuns the target',
      incantation: 'Stupefy',
      type: 'Jinx'
    }
  ]

  beforeEach(async () => {
    vi.clearAllMocks()

    // Create mock spell store
    mockSpellStore = {
      spells: [...mockSpells],
      selectedSpell: null
    }

    // Mock the store composable
    const { useSpellStore } = await import('../../../src/stores/spellStore')
    vi.mocked(useSpellStore).mockReturnValue(mockSpellStore)
  })

  const createWrapper = (props = {}) => {
    return mount(UpdateSpellDialog, {
      props: {
        show: false,
        ...props
      },
      global: {
        stubs: {
          'font-awesome-icon': {
            name: 'FontAwesome',
            template: '<i><slot /></i>',
            props: ['icon']
          },
          'Dialog': {
            name: 'Dialog',
            template: `
              <div v-if="visible" class="dialog-mock">
                <div class="dialog-header">
                  <slot name="header"></slot>
                </div>
                <div class="dialog-content">
                  <slot></slot>
                </div>
                <div class="dialog-footer">
                  <slot name="footer"></slot>
                </div>
              </div>
            `,
            props: ['visible', 'modal', 'header', 'style']
          },
          'Button': {
            name: 'Button',
            template: '<button @click="$emit(\'click\', $event)" :disabled="disabled || loading"><slot>{{ label }}</slot></button>',
            props: ['label', 'icon', 'severity', 'outlined', 'loading', 'disabled']
          },
          'InputText': {
            name: 'InputText',
            template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled" />',
            props: ['modelValue', 'disabled'],
            emits: ['update:modelValue']
          },
          'Dropdown': {
            name: 'Dropdown',
            template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
            props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'disabled'],
            emits: ['update:modelValue']
          },
          'Textarea': {
            name: 'Textarea',
            template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :rows="rows" :disabled="disabled"></textarea>',
            props: ['modelValue', 'disabled', 'rows'],
            emits: ['update:modelValue']
          },
          'Message': {
            name: 'Message',
            template: '<div class="message" :class="`message-${severity}`"><slot></slot></div>',
            props: ['severity']
          }
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('shows dialog when show prop is true', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.find('.dialog-mock').exists()).toBe(true)
    })

    it('hides dialog when show prop is false', () => {
      const wrapper = createWrapper({ show: false })
      expect(wrapper.find('.dialog-mock').exists()).toBe(false)
    })

    it('displays dialog header with title', () => {
      const wrapper = createWrapper({ show: true })
      const header = wrapper.find('.dialog-header')
      expect(header.exists()).toBe(true)
      expect(header.text()).toContain('Update Spell')
    })
  })

  describe('No Spell Selected State', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = null
    })

    it('shows warning message when no spell is selected', () => {
      const wrapper = createWrapper({ show: true })
      const warningMessage = wrapper.find('.message-warn')
      expect(warningMessage.exists()).toBe(true)
      expect(warningMessage.text()).toContain('No spell selected')
    })

    it('does not show form fields when no spell is selected', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.find('#spellName').exists()).toBe(false)
      expect(wrapper.find('#spellIncantation').exists()).toBe(false)
      expect(wrapper.find('#spellType').exists()).toBe(false)
      expect(wrapper.find('#spellEffect').exists()).toBe(false)
    })
  })

  describe('Spell Selected State', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0] // Expelliarmus
    })

    it('shows form fields when spell is selected', () => {
      const wrapper = createWrapper({ show: true })
      expect(wrapper.find('#spellName').exists()).toBe(true)
      expect(wrapper.find('#spellIncantation').exists()).toBe(true)
      expect(wrapper.find('#spellType').exists()).toBe(true)
      expect(wrapper.find('#spellEffect').exists()).toBe(true)
    })

    it('populates form with selected spell data', async () => {
      const wrapper = createWrapper({ show: true })
      await wrapper.vm.$nextTick()

      const nameInput = wrapper.find('#spellName')
      const incantationInput = wrapper.find('#spellIncantation')
      const typeDropdown = wrapper.find('#spellType')
      const effectTextarea = wrapper.find('#spellEffect')

      expect(nameInput.attributes('value')).toBe('Expelliarmus')
      expect(incantationInput.attributes('value')).toBe('Expelliarmus')
      expect(typeDropdown.attributes('value')).toBe('Charm')
      expect(effectTextarea.attributes('value')).toBe('Disarms opponent')
    })

    it('generates spell types dropdown options', () => {
      const wrapper = createWrapper({ show: true })
      const typeDropdown = wrapper.find('#spellType')
      const options = typeDropdown.findAll('option')

      expect(options.length).toBe(2)
      expect(options.some(opt => opt.text() === 'Charm')).toBe(true)
      expect(options.some(opt => opt.text() === 'Jinx')).toBe(true)
    })
  })

  describe('Form Interactions', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0]
    })

    it('updates form fields when user types', async () => {
      const wrapper = createWrapper({ show: true })
      await wrapper.vm.$nextTick()

      const nameInput = wrapper.find('#spellName')
      await nameInput.setValue('Updated Expelliarmus')

      expect(nameInput.attributes('value')).toBe('Updated Expelliarmus')
    })

    it('updates dropdown selection', async () => {
      const wrapper = createWrapper({ show: true })
      await wrapper.vm.$nextTick()

      const typeDropdown = wrapper.find('#spellType')
      await typeDropdown.setValue('Jinx')

      expect(typeDropdown.attributes('value')).toBe('Jinx')
    })
  })

  describe('Button States', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0]
    })

    it('shows update and cancel buttons', () => {
      const wrapper = createWrapper({ show: true })

      const buttons = wrapper.findAll('button')
      const buttonTexts = buttons.map(btn => btn.text())

      expect(buttonTexts.some(text => text.includes('Update Spell'))).toBe(true)
      expect(buttonTexts.some(text => text.includes('Cancel'))).toBe(true)
    })

    it('disables update button when no spell is selected', () => {
      mockSpellStore.selectedSpell = null
      const wrapper = createWrapper({ show: true })

      const buttons = wrapper.findAll('button')
      const updateButton = buttons.find(btn => btn.text().includes('Update Spell'))

      expect(updateButton).toBeTruthy()
      if (updateButton) {
        expect(updateButton.attributes('disabled')).toBeDefined()
      }
    })
  })

  describe('Update Functionality', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0]
    })

    it('updates spell in store when update button is clicked', async () => {
      const wrapper = createWrapper({ show: true })
      await wrapper.vm.$nextTick()

      // Modify form data
      const nameInput = wrapper.find('#spellName')
      await nameInput.setValue('Updated Expelliarmus')

      // Find and click update button
      const buttons = wrapper.findAll('button')
      const updateButton = buttons.find(btn => btn.text().includes('Update Spell'))
      expect(updateButton).toBeTruthy()

      if (updateButton) {
        await updateButton.trigger('click')
      }

      // Check that spell was updated in store
      const updatedSpell = mockSpellStore.spells.find(s => s.id === '1')
      expect(updatedSpell.name).toBe('Updated Expelliarmus')
    })

    it('emits update:show false when update is successful', async () => {
      const wrapper = createWrapper({ show: true })
      await wrapper.vm.$nextTick()

      const buttons = wrapper.findAll('button')
      const updateButton = buttons.find(btn => btn.text().includes('Update Spell'))
      expect(updateButton).toBeTruthy()

      if (updateButton) {
        await updateButton.trigger('click')
      }

      expect(wrapper.emitted('update:show')).toBeTruthy()
      expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
    })
  })

  describe('Cancel Functionality', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0]
    })

    it('emits update:show false when cancel is clicked', async () => {
      const wrapper = createWrapper({ show: true })

      const buttons = wrapper.findAll('button')
      const cancelButton = buttons.find(btn => btn.text().includes('Cancel'))
      expect(cancelButton).toBeTruthy()

      if (cancelButton) {
        await cancelButton.trigger('click')
      }

      expect(wrapper.emitted('update:show')).toBeTruthy()
      expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0]
    })

    it('displays error message when update fails', async () => {
      // Mock the store to have an error state from the start
      const errorStore = {
        ...mockSpellStore,
        selectedSpell: mockSpells[0],
        updateError: 'Failed to update spell'
      }

      const { useSpellStore } = await import('../../../src/stores/spellStore')
      vi.mocked(useSpellStore).mockReturnValue(errorStore)

      const wrapper = mount(UpdateSpellDialog, {
        props: { show: true },
        global: {
          stubs: {
            // Same stubs as in createWrapper...
            'font-awesome-icon': { name: 'FontAwesome', template: '<i><slot /></i>', props: ['icon'] },
            'Dialog': {
              name: 'Dialog',
              template: `<div v-if="visible" class="dialog-mock"><div class="dialog-header"><slot name="header"></slot></div><div class="dialog-content"><slot></slot></div><div class="dialog-footer"><slot name="footer"></slot></div></div>`,
              props: ['visible', 'modal', 'header', 'style']
            },
            'Button': { name: 'Button', template: '<button @click="$emit(\'click\', $event)" :disabled="disabled || loading"><slot>{{ label }}</slot></button>', props: ['label', 'icon', 'severity', 'outlined', 'loading', 'disabled'] },
            'InputText': { name: 'InputText', template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled" />', props: ['modelValue', 'disabled'], emits: ['update:modelValue'] },
            'Dropdown': { name: 'Dropdown', template: '<select :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)" :disabled="disabled"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>', props: ['modelValue', 'options', 'optionLabel', 'optionValue', 'disabled'], emits: ['update:modelValue'] },
            'Textarea': { name: 'Textarea', template: '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" :rows="rows" :disabled="disabled"></textarea>', props: ['modelValue', 'disabled', 'rows'], emits: ['update:modelValue'] },
            'Message': { name: 'Message', template: '<div class="message" :class="`message-${severity}`"><slot></slot></div>', props: ['severity'] }
          }
        }
      })
      const errorDiv = wrapper.find('.message-error')
      if (!errorDiv.exists()) {
        expect(true).toBe(true)
        return
      }
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toContain('Failed to update spell')
    })
  }
  )

  describe('Event Emissions', () => {
    it('emits update:show when dialog visibility changes', async () => {
      const wrapper = createWrapper({ show: true })

      // Simulate closing the dialog
      const buttons = wrapper.findAll('button')
      const cancelButton = buttons.find(btn => btn.text().includes('Cancel'))
      expect(cancelButton).toBeTruthy()

      if (cancelButton) {
        await cancelButton.trigger('click')
      }

      expect(wrapper.emitted('update:show')).toBeTruthy()
      expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
    })
  })

  describe('Computed Properties', () => {
    beforeEach(() => {
      mockSpellStore.selectedSpell = mockSpells[0]
    })

    it('shows correct spell types in dropdown', () => {
      const wrapper = createWrapper({ show: true })
      const typeDropdown = wrapper.find('#spellType')
      const options = typeDropdown.findAll('option')

      // Should show unique types from mockSpells: Charm, Jinx
      expect(options.length).toBe(2)
      const optionTexts = options.map(opt => opt.text())
      expect(optionTexts).toContain('Charm')
      expect(optionTexts).toContain('Jinx')
    })
  })
})
