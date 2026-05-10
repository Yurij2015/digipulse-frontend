import { tipTapDocToHtml } from '~/utils/tiptap-html'

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Accept Filament/TipTap shapes: full doc, doc without explicit type, wrapped roots, or bare block arrays.
 */
function asTipTapDocRoot(input: unknown): { type: 'doc'; content: unknown[] } | null {
  if (input == null) {
    return null
  }
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return { type: 'doc', content: [] }
    }
    return { type: 'doc', content: input }
  }
  if (!isRecord(input)) {
    return null
  }
  if (input.type === 'doc' && Array.isArray(input.content)) {
    return { type: 'doc', content: input.content }
  }
  if (Array.isArray(input.content) && (input.type === undefined || input.type === 'doc')) {
    return { type: 'doc', content: input.content }
  }
  for (const key of ['body', 'state', 'document', 'json', 'tiptap']) {
    const inner = input[key]
    const doc = asTipTapDocRoot(inner)
    if (doc) {
      return doc
    }
  }
  return null
}

function tipTapToHtml(input: unknown): string {
  const root = asTipTapDocRoot(input)
  if (!root) {
    return ''
  }
  return tipTapDocToHtml(root)
}

/**
 * Resolve Knowledge Base article `content` for display: HTML string or TipTap JSON (per locale).
 */
export function resolveKnowledgeBaseArticleHtml(content: unknown, localeCode: string): string {
  if (content == null) {
    return ''
  }

  if (typeof content === 'string') {
    const t = content.trim()
    if (t.startsWith('{') && t.includes('"type"')) {
      try {
        const parsed = JSON.parse(t) as unknown
        const html = tipTapToHtml(parsed)
        if (html) {
          return html
        }
      } catch {
        /* plain string */
      }
    }
    return content
  }

  const direct = tipTapToHtml(content)
  if (direct) {
    return direct
  }

  if (isRecord(content)) {
    const pick = content[localeCode] ?? content.en ?? Object.values(content)[0]
    if (pick == null) {
      return ''
    }
    if (typeof pick === 'string') {
      return resolveKnowledgeBaseArticleHtml(pick, localeCode)
    }
    const fromPick = tipTapToHtml(pick)
    if (fromPick) {
      return fromPick
    }
  }

  return ''
}
