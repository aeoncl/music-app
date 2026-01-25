<script lang="ts">
    import ContentCard from "./content-card.svelte";
    import {artists} from "$lib";
</script>

<div class="contentSection">

    <h1>
        Your Favorite Artists
    </h1>

    <div class="albumsContainer">
        {#each artists as artist}
            <ContentCard name={artist.name} imgPath={artist.image} href="/artists/{artist.id}" isRound={true} />
        {/each}
    </div>

</div>

<style lang="css">

    .contentSection {
        padding: 2em;
    }

  .albumsContainer {
    display: flex;
    flex-wrap: wrap;
  }

</style>