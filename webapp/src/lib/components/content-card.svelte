<script lang="ts">
    import { resolve } from '$app/paths';

    type ContentCardProps = {
        name: string;
        imgPath: string;
        href: string;
        isRound: boolean;
    }

    let {name, imgPath, href, isRound} : ContentCardProps = $props();

    let isLoaded = $state(false);

    let displayImage = $derived.by(() => {
        if (hasError || !isLoaded) {
            return 'none';
        } else {
            return 'block';
        }
    })

    let hasError = $state(false);

</script>

<a {href} >
    <div class="content-card">
        {#if hasError}
            <div class="img error" class:round={isRound}></div>
        {:else if !isLoaded}
            <div class="img placeholder" class:round={isRound}></div>
        {/if}
        <img class="img" src={imgPath} alt={name} style="display: {displayImage}" class:round={isRound} onerror={() => hasError = true} onload={() => isLoaded = true} />
        <h4>{name}</h4>
    </div>
</a>


<style lang="css">

    .content-card {
        padding: .8em;
        min-width: fit-content;
        border-radius: 10px;
    }

    .content-card h4 {
        padding-top: 1em;
        width: 170px;
        line-height: 1.5em;
        height: 3em;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -moz-box-orient: vertical;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .error {
        background-color: var(--clr-surface-a10);
    }

    .placeholder {
        background-color: var(--clr-surface-a10);
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
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
    }

    .round {
        border-radius: 50%;
    }

</style>