import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../../../src/components/common/AppFooter.vue'

describe('Footer Component', () => {
  it('renders without props', () => {
    const wrapper = mount(Footer)

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('footer').exists()).toBe(true)
    expect(wrapper.find('p').text()).toBe('')
  })

  it('renders with text prop', () => {
    const testText = 'Welcome to the Wizarding World'
    const wrapper = mount(Footer, {
      props: {
        text: testText
      }
    })

    expect(wrapper.find('p').text()).toBe(testText)
  })

  it('has correct CSS classes applied', () => {
    const wrapper = mount(Footer)

    const footer = wrapper.find('footer')
    expect(footer.classes()).toContain('bg-gray-800')
    expect(footer.classes()).toContain('text-white')
    expect(footer.classes()).toContain('py-6')
    expect(footer.classes()).toContain('mt-12')
  })

  it('has correct container structure', () => {
    const wrapper = mount(Footer)

    const container = wrapper.find('.container')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('mx-auto')
    expect(container.classes()).toContain('px-4')
    expect(container.classes()).toContain('text-center')
  })

  it('handles empty string prop', () => {
    const wrapper = mount(Footer, {
      props: {
        text: ''
      }
    })

    expect(wrapper.find('p').text()).toBe('')
  })

  it('handles long text prop', () => {
    const longText = 'This is a very long footer text that should still be rendered correctly in the footer component regardless of its length'
    const wrapper = mount(Footer, {
      props: {
        text: longText
      }
    })

    expect(wrapper.find('p').text()).toBe(longText)
  })

  it('renders paragraph element inside container', () => {
    const wrapper = mount(Footer)

    const container = wrapper.find('.container')
    const paragraph = container.find('p')

    expect(paragraph.exists()).toBe(true)
    expect(container.element.contains(paragraph.element)).toBe(true)
  })
})