<script lang="ts">
    import { page } from '$app/state';
    import {backIn, backOut, backInOut} from "svelte/easing";
    import {onMount} from "svelte";
    import { extractColorsFromImage, extractColorsFromSrc } from 'extract-colors';
    import type {FinalColor} from "extract-colors/lib/types/Color";

    let { children } = $props();


    let scrollY = $state(0);

    let opacityAmountDown = $derived.by(() => {
        const progress = Math.min(1, scrollY / 600);
        return Math.max(0, 1 - backOut(progress));
    });

    let opacityAmountUp = $derived.by(() => {
        const progress = Math.min(1, scrollY / 600);
        return backOut(progress);
    });

    let opacityAmountUpSlower = $derived(Math.min(1, scrollY / 400));


    let scaleAmount = $derived(Math.max(100, 110 - scrollY / 60));

    let titleInView = $state(true)

    function handleScroll(event: Event) {
        const target = event.target as HTMLElement;
        scrollY = target.scrollTop;
    }

    $effect(() => {
        const observer = new IntersectionObserver(function (entries) {
            titleInView = entries[0].isIntersecting;
        });
        observer.observe(document.querySelector(".header h1") as HTMLElement)
        return () => {
            observer.disconnect();
        };
    })


    $effect(() => {
        // Reset scroll position when navigating to new artist
        const container = document.querySelector('.page-container') as HTMLElement;
        if (container) container.scrollTop = 0;
    })

    let lastBannerForColorCompute = $state("");

    let colorLoading = $state(false);
    let dominantColor = $state({red: 0, green: 0, blue: 0} as FinalColor);

    let bannerError = $state(false);
    let bannerImg: HTMLImageElement;


    function onArtistBannerLoaded() {

        if (bannerError) return;

        if(lastBannerForColorCompute === page.data.banner.image) return;

        lastBannerForColorCompute = page.data.banner.image;
        extractColorsFromImage(bannerImg).then(colors => {
            if (colors && colors.length > 0) {
                dominantColor = colors[0];
                colorLoading = true;
            }
        }).catch(error => {
            console.error("Error extracting colors:", error);
        });
    }


</script>


<div class="page-container" onscroll={handleScroll}>
    <img
      bind:this={bannerImg}
      class="banner-bg"
      src={page.data.banner.image}
      alt=""
      aria-hidden="true"
      onload={() => onArtistBannerLoaded()}
      onerror={() => bannerError = true}
      style:transform="scale({scaleAmount}%)"
      style:opacity={opacityAmountDown}
    />

    <div class="container" style:background-color="rgba({dominantColor.red}, {dominantColor.green}, {dominantColor.blue}, {opacityAmountUpSlower})">
        <div class="sticky-header"  style:background-color="rgba({dominantColor.red}, {dominantColor.green}, {dominantColor.blue}, {opacityAmountUp})">
            <div class="sticky-header-content" style:opacity="{!titleInView ? 1 : 0}">
                <button>▶</button>
                <h2>{page.data.title}</h2>
            </div>

        </div>
        <div class="header" >
            <h1>{page.data.title}</h1>
        </div>

        <div class="content" class:color-loading={colorLoading} style:--gradient-color="rgba({dominantColor.red}, {dominantColor.green}, {dominantColor.blue}, 0.5)" >
            {@render children()}
        </div>

    </div>
</div>


<style lang="css">


    .page-container {
        height: 100%;
        overflow-y: auto;
        transform: translateX(0);
    }

    .banner-bg {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        z-index: -1;
    }

    .header {
        display: flex;
        align-items: flex-end;
        height: 30vh;
        padding: 2em;
        box-sizing: border-box;
    }

    .header h1 {
        font-size: 48pt;
        font-weight: bold;
        text-shadow: 0 0 20px var(--clr-dark-a0);
        overflow:visible;
    }

    .sticky-header {
        position: sticky;
        top: 0;
        z-index: 1;
        padding-left: 2em;
        padding-top: 1em;
        padding-bottom: 1em;
    }

    .sticky-header .sticky-header-content {
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        display: flex;
        gap: 1em;
    }

    .content {
        padding: 2em;
        background-color: var(--clr-surface-a0);
        position: relative;
    }

    .content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 128px;
        background: linear-gradient(to bottom, var(--gradient-color), transparent);
        pointer-events: none; /* Allows clicks to pass through */
    }

    .content.color-loading::before {
        animation: fadeIn 0.8s ease-in-out forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }


</style>