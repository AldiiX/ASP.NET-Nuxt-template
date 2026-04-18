<script setup lang="ts">
    import switchTheme from "~/utils/switchTheme";
    import type {WebTheme} from "#shared/types";

    const theme = useState<WebTheme>('theme', () => 'light');
</script>

<template>
    <div :class="$style.centerdiv">
        <h1>ASP.NET Core + Nuxt template</h1>
        <p>This is a starter template for ASP.NET Core with Nuxt 3</p>
        <button @click="switchTheme(theme === 'dark' ? 'light' : 'dark')">Switch theme</button>
    </div>
</template>

<style module lang="scss">
@use "../assets/app" as *;

.centerdiv {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; // Full viewport height
    text-align: center;
    flex-direction: column;

    h1,p,button  {
        font-family: gabarito, sans-serif; font-size: 3vw; color: var(--text-color);
        transition-duration: 0.3s;
    }

    h1 {
        font-size: 64px;
        color: var(--accent-color, #00DC82);
    }

    p {
        font-size: 24px;
    }

    button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        background-color: var(--accent-color, #00DC82);
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
            background-color: hsl(from var(--accent-color, #00DC82) h s l / 80%);
        }
    }
}



// Laptops Responsive
@media screen and (max-width: $laptopBreakpoint) {

}

// tablet
@media screen and (max-width: $tabletBreakpoint) {

}

// mobile
@media screen and (max-width: $mobileBreakpoint) {

}
</style>