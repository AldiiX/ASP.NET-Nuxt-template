<script setup lang="ts">



</script>

<template>
    <div :class="$style.centerdiv">
        <h1>ASP.NET Core + Nuxt template</h1>
        <p>This is a starter template for ASP.NET Core with Nuxt 3</p>
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

    h1,p  {
        font-family: gabarito, sans-serif; font-size: 3vw; color: var(--text-color);
    }

    h1 {
        font-size: 64px;
        color: var(--accent-color, #00DC82);
    }

    p {
        font-size: 24px;
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