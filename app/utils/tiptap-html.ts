/**
 * Minimal TipTap / ProseMirror document → HTML for Knowledge Base article bodies
 * (Filament RichEditor stores JSON per locale, not HTML strings).
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarks(text: string, marks?: Array<{ type: string; attrs?: Record<string, unknown> }>): string {
  if (!marks?.length) {
    return escapeHtml(text)
  }
  let out = escapeHtml(text)
  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        out = `<strong>${out}</strong>`
        break
      case 'italic':
        out = `<em>${out}</em>`
        break
      case 'strike':
        out = `<s>${out}</s>`
        break
      case 'underline':
        out = `<u>${out}</u>`
        break
      case 'code':
        out = `<code>${out}</code>`
        break
      case 'link': {
        const href = typeof mark.attrs?.href === 'string' ? mark.attrs.href : ''
        const safeHref = escapeHtml(href)
        const target = mark.attrs?.target === '_blank' ? ' target="_blank" rel="noopener noreferrer"' : ''
        out = `<a href="${safeHref}"${target}>${out}</a>`
        break
      }
      default:
        break
    }
  }
  return out
}

function renderNode(node: any): string {
  if (!node || typeof node !== 'object') {
    return ''
  }

  switch (node.type) {
    case 'doc':
      return (node.content ?? []).map(renderNode).join('')
    case 'paragraph':
      return `<p>${(node.content ?? []).map(renderNode).join('')}</p>`
    case 'heading': {
      const level = node.attrs?.level === 3 ? 3 : 2
      return `<h${level}>${(node.content ?? []).map(renderNode).join('')}</h${level}>`
    }
    case 'text':
      return renderMarks(node.text ?? '', node.marks)
    case 'bulletList':
      return `<ul>${(node.content ?? []).map(renderNode).join('')}</ul>`
    case 'orderedList':
      return `<ol>${(node.content ?? []).map(renderNode).join('')}</ol>`
    case 'listItem':
      return `<li>${(node.content ?? []).map(renderNode).join('')}</li>`
    case 'blockquote':
      return `<blockquote>${(node.content ?? []).map(renderNode).join('')}</blockquote>`
    case 'codeBlock': {
      const parts = (node.content ?? []).map((c: any) => {
        if (c?.type === 'text') {
          return escapeHtml(c.text ?? '')
        }
        return renderNode(c)
      })
      const lang = node.attrs?.language ? `${escapeHtml(String(node.attrs.language))}\n` : ''
      return `<pre><code>${lang}${parts.join('')}</code></pre>`
    }
    case 'hardBreak':
      return '<br />'
    case 'horizontalRule':
      return '<hr />'
    case 'image': {
      const src = typeof node.attrs?.src === 'string' ? escapeHtml(node.attrs.src) : ''
      const alt = typeof node.attrs?.alt === 'string' ? escapeHtml(node.attrs.alt) : ''
      return src ? `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" />` : ''
    }
    default:
      if (Array.isArray(node.content)) {
        return node.content.map(renderNode).join('')
      }
      return ''
  }
}

export function tipTapDocToHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object') {
    return ''
  }
  const d = doc as { type?: string }
  if (d.type !== 'doc') {
    return ''
  }
  return renderNode(doc)
}
