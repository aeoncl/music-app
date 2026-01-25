<script lang="ts">
    import { resolve } from '$app/paths';

    type ContentCardProps = {
        name: string;
        imgPath: string;
        href: string;
        isRound: boolean;
    }

    let {name, imgPath, href, isRound} : ContentCardProps = $props();


</script>

<a {href} >
    <div class="content-card">
        {#if imgPath.length === 0}
            <div class="img" style="background-color: cornflowerblue"></div>
        {:else}
            <img class="img" src={imgPath} alt={name} class:round={isRound} />
        {/if}
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