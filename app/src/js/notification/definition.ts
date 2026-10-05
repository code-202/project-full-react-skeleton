export interface TranslationText {
    id: string
    values?: Record<string, string | number>
    html?: boolean
}

export type Text = string | TranslationText

export interface Definition {
    title: Text
    content: Text | React.ReactNode
    icon?: string
    color?: 'success' | 'danger' | 'warning' | 'info'
    important?: boolean
}
