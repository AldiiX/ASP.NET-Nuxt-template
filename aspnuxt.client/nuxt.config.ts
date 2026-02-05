// https://nuxt.com/docs/api/configuration/nuxt-config
import crypto  from 'node:crypto'
import path from "node:path";

const target = 'http://localhost:5283'
const isProd = process.env.NODE_ENV === 'production';

function stableHash(input: string, length: number = 11): string {
    return crypto.createHash("sha256").update(input).digest("base64url").slice(0, length);
}

function stablePrefixLetter(input: string): string {
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digest = crypto.createHash("sha256").update(input).digest();
    return alphabet[digest[0]! % alphabet.length]!;
}

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
    },

    runtimeConfig: {
        //baseUrlInternal: "http://172.17.0.1:8350",
    },

    experimental: {
        //viewTransition: true,
    },

    vite: {
        css: {
            modules: {
                generateScopedName(className: string, fileName: string) { // hashing of css class names to avoid collisions, comment this unless you want it
                    const cleanFileName = (fileName.split("?")[0] ?? fileName);

                    const normalizedFileName = cleanFileName.replaceAll("\\", "/");
                    const normalizedRoot = process.cwd().replaceAll("\\", "/");

                    const relativeFile = path.posix.relative(normalizedRoot, normalizedFileName);

                    const seed = `${relativeFile}:${className}`;
                    const hash = stableHash(seed);
                    const prefix = stablePrefixLetter(seed);

                    return isProd ? `${prefix}${hash}` : `${className}__${prefix}${hash}`;
                },
            }
        }
    },

    features: {
        inlineStyles: true,
    },
})