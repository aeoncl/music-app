<script lang="ts">
    import type {PageProps} from '$routes';

    import ContentCard from "$lib/components/content-card.svelte";

    let { data }: PageProps = $props();

</script>

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

                {#await data}
                    <p>Loading...</p>
                {:then data}
                    {#each data.artist.album as album (album.id)}
                        <ContentCard name={album.name} isRound={false} imgPath={data.getImagePath(album.coverArt)} href="/albums/{album.id}"/>
                    {/each}
                {/await}

            </section>

            <h2>About</h2>
            <section class="about">
                <p>
                  {data.artistInfo.biography}
                </p>
            </section>

<style lang="css">

    section {
        padding: 2em;
    }

    .discography {
        flex-wrap: wrap;
        display: flex;
    }

</style>