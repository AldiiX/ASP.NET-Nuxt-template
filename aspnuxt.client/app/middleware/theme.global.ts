import type { WebTheme } from '@/lib/types'

export default defineNuxtRouteMiddleware(() => {
    const theme = useState<WebTheme | null>('theme', () => "light")
    const cookie = useCookie<WebTheme | null>('theme', {
        default: () => null,
        sameSite: 'lax',
        path: '/'
    })

    // if user explicitly set a cookie, prefer it
    if (cookie.value === 'dark' || cookie.value === 'light') {
        theme.value = cookie.value;
        return;
    }

    // clear invalid cookie values (fallback to os)
    if (cookie.value !== null && cookie.value !== 'dark' && cookie.value !== 'light') {
        cookie.value = null
    }

    // follow os preference when no cookie is set
    if (import.meta.client) {
        const mql = window.matchMedia('(prefers-color-scheme: dark)')

        // initialize from os
        theme.value = mql.matches ? 'dark' : 'light'
        cookie.value = mql.matches ? 'dark' : 'light';

        // avoid duplicate listeners on every navigation
        const mqlBound = useState<boolean>('theme:mqlBound', () => false)
        if (!mqlBound.value) {
            const handler = (e: MediaQueryListEvent) => {
                // update only while user did not set cookie manually
                if (cookie.value === null) {
                    theme.value = e. matches ? 'dark' : 'light'
                    cookie.value = e. matches ? 'dark' : 'light';
                }
            }
            mql.addEventListener?.('change', handler)
            mqlBound.value = true
        }
    }
})