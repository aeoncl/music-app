<script lang="ts">
    import { resolve } from '$app/paths';
    import { audioPlayerStore } from '$lib/audio-player/player.store';

    type ContentCardProps = {
        name: string;
        imgPath: string;
        href: string;
        isRound: boolean;
    }

    let {name, imgPath, href, isRound} : ContentCardProps = $props();

    let rotateX = $state(0);
    let rotateY = $state(0);
    let isHovered = $state(false);

    let isPlaying = $derived(
        !isRound && 
        $audioPlayerStore.playing && 
        $audioPlayerStore.track?.albumId === href.split('/').pop()
    );

    const randomColor = `hsl(${Math.random() * 360}, 40%, 30%)`;

    function handleMouseMove(e: MouseEvent) {
        if (isRound) return;
        const card = e.currentTarget as HTMLElement;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max rotation 15 degrees
        rotateY = ((x - centerX) / centerX) * 15;
        rotateX = ((centerY - y) / centerY) * 15;
    }

    function handleMouseEnter() {
        if (isRound) return;
        isHovered = true;
    }

    function handleMouseLeave() {
        if (isRound) return;
        isHovered = false;
        rotateX = 0;
        rotateY = 0;
    }

</script>

<a href={resolve(href)} 
    onmousemove={handleMouseMove}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    style="perspective: 1000px; display: block;"
>
    <div class="content-card" 
         style:transform={isHovered ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : 'rotateX(0deg) rotateY(0deg)'}
    >
        {#if imgPath.length === 0}
            <div class="img" style="background-color: cornflowerblue"></div>
        {:else}
            <div class="img-container">
                <div class="vinyl" class:spinning={isPlaying} style:--vinyl-color={randomColor}></div>
                <img class="img" src={imgPath} alt={name} class:round={isRound} style:opacity={isPlaying ? 0 : 1} />
            </div>
        {/if}
        <h4>{name}</h4>
    </div>
</a>


<style lang="css">

    .content-card {
        padding: .8em;
        min-width: fit-content;
        border-radius: 10px;
        transition: transform 0.1s ease-out, background-color 0.2s;
        transform-style: preserve-3d;
    }

    .content-card h4 {
        padding-top: 1em;
        transform: translateZ(20px);
    }

    .content-card:hover {
        background-color: var(--clr-surface-a10);
        cursor: pointer;
    }

    .content-card .img {
        object-fit: cover;
        object-position: center;
        width: 170px;
        height: 170px;
        transform: translateZ(10px);
        position: relative;
        z-index: 2;
        transition: opacity 0.5s ease-in-out;
    }

    .img-container {
        position: relative;
        width: 170px;
        height: 170px;
        transform-style: preserve-3d;
    }

    .vinyl {
        position: absolute;
        top: 0;
        right: 0;
        width: 170px;
        height: 170px;
        background: 
            radial-gradient(circle at center, var(--vinyl-color) 4%, rgba(0,0,0,0.4) 4%, rgba(0,0,0,0.4) 5%, var(--vinyl-color) 5%, var(--vinyl-color) 10%, rgba(255,255,255,0.05) 10.5%, var(--vinyl-color) 11%, var(--vinyl-color) 15%, rgba(255,255,255,0.05) 15.5%, var(--vinyl-color) 16%, var(--vinyl-color) 20%, rgba(255,255,255,0.05) 20.5%, var(--vinyl-color) 21%, var(--vinyl-color) 25%, rgba(255,255,255,0.05) 25.5%, var(--vinyl-color) 26%, var(--vinyl-color) 30%, rgba(255,255,255,0.05) 30.5%, var(--vinyl-color) 31%, var(--vinyl-color) 35%, rgba(255,255,255,0.05) 35.5%, var(--vinyl-color) 36%, var(--vinyl-color) 40%, rgba(255,255,255,0.05) 40.5%, var(--vinyl-color) 41%);
        border-radius: 50%;
        transform: translateZ(5px) translateX(0);
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 1;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }

    .vinyl::after {
        content: '';
        position: absolute;
        top: 35%;
        left: 35%;
        width: 30%;
        height: 30%;
        background-color: var(--clr-primary-a40, #6495ed);
        border-radius: 50%;
        background-image: radial-gradient(circle at center, #111 10%, transparent 11%);
    }

    .spinning {
        transform: translateZ(5px) translateX(0);
        animation: spin 3s linear infinite;
    }

    @keyframes spin {
        from { transform: translateZ(5px) translateX(0) rotate(0deg); }
        to { transform: translateZ(5px) translateX(0) rotate(360deg); }
    }

    .round {
        border-radius: 50%;
    }

</style>