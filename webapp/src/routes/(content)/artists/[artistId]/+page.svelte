<script lang="ts">
    import type {PageProps} from '$routes';

    import ContentCard from "../../../content-card.svelte";

    let { data }: PageProps = $props();


    const albums = Array.from({ length: 8 }, () => ({
        title: 'Album Title',
        isRound: Math.random() < 0.5
    }));
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
                {#each data.artist.album as album (album.id)}
                    <ContentCard name={album.name} isRound={false} imgPath={data.getImagePath(album.coverArt)} href="/albums/{album.id}"/>
                {/each}
            </section>

            <h2>About</h2>
            <section class="about">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec nibh suscipit, dapibus ante auctor, mattis est. In tempor blandit sapien, sed venenatis libero elementum id. Nulla sit amet rhoncus massa. Pellentesque egestas neque in nibh sodales, vel scelerisque dolor tincidunt. Vivamus vehicula, neque vitae tempor lacinia, est justo posuere sem, a ultricies purus nisi sit amet mauris. Cras finibus sapien orci, sit amet molestie erat porta at. Nunc pharetra suscipit hendrerit.

                    Aenean ligula felis, pellentesque vel dolor eu, maximus pellentesque tortor. Pellentesque euismod augue sit amet odio semper, ut luctus mi sagittis. Ut scelerisque dui sit amet dictum consectetur. Aenean accumsan felis in nulla faucibus egestas. Morbi mollis, diam at placerat suscipit, nisi nisi mollis sem, vitae mattis justo eros vel risus. Donec in nibh quis tellus pulvinar efficitur. Donec mauris est, bibendum sit amet mattis a, ultricies eu lectus. Aenean suscipit a metus quis gravida. Vestibulum vestibulum non velit non aliquam. Integer orci nisi, tempus et eleifend non, bibendum a nisi.
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