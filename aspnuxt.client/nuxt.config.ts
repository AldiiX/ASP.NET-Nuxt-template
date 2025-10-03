// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from 'url'

const target = process.env.ASPNETCORE_HTTPS_PORT
    ? `http://localhost:${process.env.ASPNETCORE_HTTPS_PORT}`
    : process.env.ASPNETCORE_URLS
        ? process.env.ASPNETCORE_URLS.split(';')[0]
        : 'http://localhost:5283'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {
      enabled: true,

      timeline: {
        enabled: true
      }
    },
    /*devServer: {
        host: "0.0.0.0",
    },*/

    nitro: {
        routeRules: {
            '/api/**': {
                proxy: `${target}/api/**`
            }
        },

        prerender: {
            crawlLinks: true,
            failOnError: false
        }
    },

    runtimeConfig: {
        //baseUrlInternal: "http://172.17.0.1:8350",
    },

    experimental: {
        viewTransition: true,
        payloadExtraction: true,
    },
})