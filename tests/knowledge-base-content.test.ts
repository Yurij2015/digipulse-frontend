import { describe, expect, it } from 'vitest'
import { resolveKnowledgeBaseArticleHtml } from '../app/utils/knowledge-base-content'

describe('resolveKnowledgeBaseArticleHtml', () => {
  it('renders HTML string per locale', () => {
    const content = { en: '<p>Hi</p>', uk: '<p>Привіт</p>' }
    expect(resolveKnowledgeBaseArticleHtml(content, 'uk')).toBe('<p>Привіт</p>')
  })

  it('renders TipTap doc object for locale', () => {
    const doc = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }],
    }
    const content = { en: doc }
    const html = resolveKnowledgeBaseArticleHtml(content, 'en')
    expect(html).toContain('Hello')
    expect(html).toContain('<p>')
  })

  it('unwraps bare block array as doc body', () => {
    const blocks = [{ type: 'paragraph', content: [{ type: 'text', text: 'Arr' }] }]
    const content = { en: blocks }
    expect(resolveKnowledgeBaseArticleHtml(content, 'en')).toContain('Arr')
  })

  it('accepts whole payload as single doc (no locale map)', () => {
    const content = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Root' }] }],
    }
    expect(resolveKnowledgeBaseArticleHtml(content, 'en')).toContain('Root')
  })

  it('parses JSON string doc', () => {
    const doc = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Json' }] }],
    }
    const str = JSON.stringify(doc)
    expect(resolveKnowledgeBaseArticleHtml(str, 'en')).toContain('Json')
  })
})
