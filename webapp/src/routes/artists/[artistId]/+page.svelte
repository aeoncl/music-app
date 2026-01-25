<script lang="ts">
    import type { PageProps } from './$types';
    import { onMount } from 'svelte'
    import { extractColorsFromSrc } from "extract-colors";

    import ContentCard from "../../content-card.svelte";
    let { data }: PageProps = $props();

    let dominantBannerColor = $state({
        red: 0,
        green: 0,
        blue: 0
    })

    onMount(() => {
        extractColorsFromSrc(data.artist.image)
            .then(colors => dominantBannerColor = colors[0])
            .catch(console.error)
    })

    let scrollY = $state(0);

    let opacityAmountDown = $derived(Math.max(0, 1 - scrollY / 400));
    let opacityAmountUp = $derived(Math.min(1, scrollY / 400));
    let scaleAmount = $derived(Math.max(1.0, 1.1 - scrollY / 3000));

    function handleScroll(event: Event) {
        const target = event.target as HTMLElement;
        scrollY = target.scrollTop;
    }

    function randomColor(): string {
        const hue = Math.floor(Math.random() * 360);
        const sat = 70; // %
        const light = 55; // %
        return `hsl(${hue} ${sat}% ${light}%)`;
    }

    const albums = Array.from({ length: 8 }, () => ({
        bg: randomColor(),
        title: 'Album Title',
        isRound: Math.random() < 0.5
    }));
</script>

<div class="page-container" onscroll={handleScroll} style:--img="url({data.artist.image})" style:--scaleAmount="{scaleAmount}" style:--opacityAmountDown="{opacityAmountDown}">

    <div class="container" style:background-color="rgba({dominantBannerColor.red}, {dominantBannerColor.green}, {dominantBannerColor.blue}, {opacityAmountUp})">
        <div class="artistHeader" >
            <h1>{data.artist.name}</h1>
        </div>

        <div class="artistContent" style:--gradient-color="rgba({dominantBannerColor.red}, {dominantBannerColor.green}, {dominantBannerColor.blue}, 0.4)">

            <h2>Liked Songs</h2>
            <section class="likedSongs">
                <ul>
                    <li>Song 1</li>
                    <li>Song 2</li>
                    <li>Song 3</li>
                    <li>Song 4</li>
                    <li>Song 5</li>
                    <li>Song 6</li>
                    <li>Song 7</li>
                    <li>Song 8</li>
                    <li>Song 9</li>
                    <li>Song 10</li>
                </ul>
            </section>

            <h2>Discography</h2>
            <section class="discography">
                {#each albums as album}
                    <ContentCard name={album.title} isRound={false} imgPath="" href=""/>
                {/each}
            </section>

            <h2>About</h2>
            <section class="about">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec nibh suscipit, dapibus ante auctor, mattis est. In tempor blandit sapien, sed venenatis libero elementum id. Nulla sit amet rhoncus massa. Pellentesque egestas neque in nibh sodales, vel scelerisque dolor tincidunt. Vivamus vehicula, neque vitae tempor lacinia, est justo posuere sem, a ultricies purus nisi sit amet mauris. Cras finibus sapien orci, sit amet molestie erat porta at. Nunc pharetra suscipit hendrerit.

                    Aenean ligula felis, pellentesque vel dolor eu, maximus pellentesque tortor. Pellentesque euismod augue sit amet odio semper, ut luctus mi sagittis. Ut scelerisque dui sit amet dictum consectetur. Aenean accumsan felis in nulla faucibus egestas. Morbi mollis, diam at placerat suscipit, nisi nisi mollis sem, vitae mattis justo eros vel risus. Donec in nibh quis tellus pulvinar efficitur. Donec mauris est, bibendum sit amet mattis a, ultricies eu lectus. Aenean suscipit a metus quis gravida. Vestibulum vestibulum non velit non aliquam. Integer orci nisi, tempus et eleifend non, bibendum a nisi.
                </p>
            </section>

            <h2>About</h2>
            <section class="about">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec nibh suscipit, dapibus ante auctor, mattis est. In tempor blandit sapien, sed venenatis libero elementum id. Nulla sit amet rhoncus massa. Pellentesque egestas neque in nibh sodales, vel scelerisque dolor tincidunt. Vivamus vehicula, neque vitae tempor lacinia, est justo posuere sem, a ultricies purus nisi sit amet mauris. Cras finibus sapien orci, sit amet molestie erat porta at. Nunc pharetra suscipit hendrerit.

                    Aenean ligula felis, pellentesque vel dolor eu, maximus pellentesque tortor. Pellentesque euismod augue sit amet odio semper, ut luctus mi sagittis. Ut scelerisque dui sit amet dictum consectetur. Aenean accumsan felis in nulla faucibus egestas. Morbi mollis, diam at placerat suscipit, nisi nisi mollis sem, vitae mattis justo eros vel risus. Donec in nibh quis tellus pulvinar efficitur. Donec mauris est, bibendum sit amet mattis a, ultricies eu lectus. Aenean suscipit a metus quis gravida. Vestibulum vestibulum non velit non aliquam. Integer orci nisi, tempus et eleifend non, bibendum a nisi.
                </p>
            </section>

            <h2>About</h2>
            <section class="about">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec nibh suscipit, dapibus ante auctor, mattis est. In tempor blandit sapien, sed venenatis libero elementum id. Nulla sit amet rhoncus massa. Pellentesque egestas neque in nibh sodales, vel scelerisque dolor tincidunt. Vivamus vehicula, neque vitae tempor lacinia, est justo posuere sem, a ultricies purus nisi sit amet mauris. Cras finibus sapien orci, sit amet molestie erat porta at. Nunc pharetra suscipit hendrerit.

                    Aenean ligula felis, pellentesque vel dolor eu, maximus pellentesque tortor. Pellentesque euismod augue sit amet odio semper, ut luctus mi sagittis. Ut scelerisque dui sit amet dictum consectetur. Aenean accumsan felis in nulla faucibus egestas. Morbi mollis, diam at placerat suscipit, nisi nisi mollis sem, vitae mattis justo eros vel risus. Donec in nibh quis tellus pulvinar efficitur. Donec mauris est, bibendum sit amet mattis a, ultricies eu lectus. Aenean suscipit a metus quis gravida. Vestibulum vestibulum non velit non aliquam. Integer orci nisi, tempus et eleifend non, bibendum a nisi.
                </p>
            </section>

            <h2>About</h2>
            <section class="about">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec nibh suscipit, dapibus ante auctor, mattis est. In tempor blandit sapien, sed venenatis libero elementum id. Nulla sit amet rhoncus massa. Pellentesque egestas neque in nibh sodales, vel scelerisque dolor tincidunt. Vivamus vehicula, neque vitae tempor lacinia, est justo posuere sem, a ultricies purus nisi sit amet mauris. Cras finibus sapien orci, sit amet molestie erat porta at. Nunc pharetra suscipit hendrerit.

                    Aenean ligula felis, pellentesque vel dolor eu, maximus pellentesque tortor. Pellentesque euismod augue sit amet odio semper, ut luctus mi sagittis. Ut scelerisque dui sit amet dictum consectetur. Aenean accumsan felis in nulla faucibus egestas. Morbi mollis, diam at placerat suscipit, nisi nisi mollis sem, vitae mattis justo eros vel risus. Donec in nibh quis tellus pulvinar efficitur. Donec mauris est, bibendum sit amet mattis a, ultricies eu lectus. Aenean suscipit a metus quis gravida. Vestibulum vestibulum non velit non aliquam. Integer orci nisi, tempus et eleifend non, bibendum a nisi.
                </p>
            </section>
        </div>
    </div>

    <p>{scrollY}</p>
</div>


<style lang="css">


    .page-container {
        height: 100%;
        overflow-y: auto;
        transform: translateX(0);
    }

    .page-container:before {
        content: '';
        position: fixed;
        background-image: var(--img);
        height: 100%;
        width: 100%;
        opacity: var(--opacityAmountDown);
        background-size: cover;
        background-position: center;
        scale: var(--scaleAmount);
        z-index: -1;
    }

    .artistHeader {
        display: flex;
        align-items: flex-end;
        height: 40vh;
        padding: 2em;
        box-sizing: border-box;
    }

    .artistHeader h1 {
        font-size: 48pt;
        font-weight: bold;
        text-shadow: 0 0 20px var(--clr-dark-a0);
        overflow:visible;
    }

    .artistContent {
        padding: 2em;
        background-color: var(--clr-surface-a0);
        position: relative;
    }

    .artistContent::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100px;
        background: linear-gradient(to bottom, var(--gradient-color), transparent);
        pointer-events: none; /* Allows clicks to pass through */
    }

    section {
        padding: 2em;
    }

    .discography {
        flex-wrap: wrap;
        display: flex;
    }

</style>