<script setup lang="ts">
import type {WebTheme} from "~/lib/types";

const nuxtError = useError();
const theme = useState<WebTheme>('theme', () => 'light');


useHead({
    htmlAttrs: { 'data-theme': computed(() => theme.value ?? undefined) },
    link: [
        {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico'
        }
    ],
});

if (import.meta.client && theme.value === null) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.value = prefersDark ? 'dark' : 'light'
}

if (import.meta.client) {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
        const hasCookie = useCookie<WebTheme>('theme').value
        if (!hasCookie) {
            theme.value = e.matches ? 'dark' : 'light'
        }
    }
    mql.addEventListener?.('change', handler)
}

const code = computed<number>(() => Number(nuxtError.value?.statusCode ?? 500))

const message = computed<string>(() => {
    const c = code.value
    // preferuj statusMessage/message z chyby, pokud neni jedna z nasich preset kategorii
    if (!([404, 403, 500] as number[]).includes(c)) {
        return (nuxtError.value?.statusMessage || nuxtError.value?.message) ?? 'Unexpected error'
    }

    switch (c) {
        case 404: return 'Page not found';
        case 403: return "You don't have enough permissions";
        case 500: return 'Something went wrong'
        default:  return (nuxtError.value?.statusMessage || nuxtError.value?.message) ?? 'Unexpected error'
    }
})



// nastav titulek stranky reaktivne
useHead(() => ({
    title: `Error ${code.value}`
}))

function goHome() {
    // zrusit chybu a presmerovat domu (oficialni cesta v nuxtu)
    clearError({ redirect: '/' }) // :contentReference[oaicite:1]{index=1}
}
</script>

<template>
    <main id="error-page">
        <div class="center">
            <div class="logo" aria-hidden="true"></div>
            <h1>Error {{ code }}</h1>
            <p class="desc">{{ message }}</p>
            <button class="btn" @click="goHome">Back</button>
        </div>
    </main>
</template>

<style src="./app.scss"></style>