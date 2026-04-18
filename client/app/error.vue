<script setup lang="ts">
import type {WebTheme} from "#shared/types";

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
    <main :class="$style.error">
        <div :class="$style.center">
            <div :class="$style.logo" aria-hidden="true"></div>
            <h1>Error {{ code }}</h1>
            <p :class="$style.desc">{{ message }}</p>
            <button :class="$style.btn" @click="goHome">Back</button>
        </div>
    </main>
</template>

<style module lang="scss">
.error {
    min-height: 100vh;

    .center {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }

    .logo {
        mask-image: url('../public/icons/nuxt.svg');
        mask-size: contain;
        mask-repeat: no-repeat;
        width: 10vw;
        height: 10vw;
        margin: 0 auto;
        position: relative;
        margin-bottom: 32px;
    }

    .logo::before {
        content: "";
        position: absolute;
        inset: 0;
        background-color: var(--accent-color, #00DC82);
    }

    h1 { font-family: "gabarito", "Arial Black", sans-serif; font-size: 3vw; color: var(--text-color); }
    .desc { font-family: "gabarito", sans-serif; font-size: 16px; margin: 0; color: var(--text-color-lighter); }

    .btn {
        font-family: "gabarito", sans-serif;
        font-size: 16px;
        margin: 0 auto;
        margin-top: 32px;
        padding: 16px 64px;
        background-color: var(--accent-color);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        color: #fff;
        transition: filter .3s ease;
    }
    .btn:hover { filter: brightness(0.9); }

    /* mobil */
    @media (max-width: 600px) {
        .logo { width: 50vw; height: 50vw; }
        h1 { font-size: 10vw; }
    }
}
</style>