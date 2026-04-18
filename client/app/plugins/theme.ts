import type { WebTheme } from '#shared/types'

export default defineNuxtPlugin(() => {
    const theme = useState<WebTheme>('theme', () => 'light')

    const themeCookie = useCookie<WebTheme | null>('theme', {
        default: () => null,
        sameSite: 'lax',
        path: '/'
    })

    const applyTheme = (value: WebTheme) => {
        theme.value = value

        if(import.meta.client) {
            document.documentElement.setAttribute('data-theme', value)
        }
    }

    // pokud uz cookie existuje, pouzije se
    if(themeCookie.value === 'dark' || themeCookie.value === 'light') {
        applyTheme(themeCookie.value)
        return
    }

    // bez cookie na serveru bude fallback
    if(import.meta.server) {
        applyTheme('light')
        return
    }

    // prvni zjisteni z os ulozi se do cookied
    const detectedTheme: WebTheme =
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    themeCookie.value = detectedTheme
    applyTheme(detectedTheme)
})