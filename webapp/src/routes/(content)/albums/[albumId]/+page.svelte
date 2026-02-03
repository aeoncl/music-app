<script lang="ts">

    import type {PageProps} from '$routes';
    import {durationToString} from "$lib";
    import { getAudioPlayer } from '$lib/audio-player/audio-player.svelte';
    import type { Song } from './+page';


    let { data }: PageProps = $props();

    let audioPlayer = getAudioPlayer()

    function playAlbumFrom(song: Song) {
       let songs : Song[] = data.album.song.filter(s => s.track > song.track)
        audioPlayer.mainQueue.clear()
        audioPlayer.mainQueue.enqueue_all(songs)
        audioPlayer.play(song)
    }


</script>

<div class="table-labels row">
    <span class="trackNumber">#</span>
    <span>Title</span>
    <span class="duration">Duration</span>
</div>

{#each data.album.song as song (song.id)}
    <div class="table-row row" onclick={() => playAlbumFrom(song)} onauxclick={() => audioPlayer.priorityQueue.enqueue(song)}>
        <div class="trackNumber">
            <span class:now-playing={audioPlayer.nowPlaying.track?.id === song.id}>{song.track}</span>
        </div>
        <div class="title">
                <span class:now-playing={audioPlayer.nowPlaying.track?.id === song.id} >{song.title}</span>
                <span class="artist">{song.artist}</span>
        </div>
        <div class="duration"><span>{durationToString(song.duration)}</span></div>
    </div>

{/each}



<style lang="css">
    .row {
        display: grid;
        grid-template-columns: 4em 1fr 10em;
    }

    .table-row {
        height: 4em;
        border-radius: 10px;
    }

    .table-row:hover {
        background-color: var(--clr-surface-a10);
        cursor: pointer;
    }

    .table-labels {
        margin-bottom: 1em;
        height: 2em;
        justify-content: end;
        border-bottom: 1px solid var(--clr-surface-a20);
    }

    .trackNumber {
        width: 4em;
        height: 4em;
        display: table;
        text-align: center;
    }

    .trackNumber span {
        display: table-cell;
        vertical-align: middle;
    }

    .title {
        height: 100%;
        width: fit-content;
        flex-direction: column;
        justify-content: center;
        gap: 0.3em;
        display: flex;
    }

    .now-playing {
        color: var(--clr-primary-a20);
        text-shadow: 0 0 7px var(--clr-primary-a20);
        animation: neonText 1s ease-in-out infinite alternate;
    }

    @keyframes neonText {
        to {
            text-shadow: 10 10 7px var(--clr-primary-a20);
        }
    }


    .title .artist {
        font-weight: bold;
        color: var(--clr-surface-a40);
        font-size: 0.8em;
    }

    .duration {
        height: 100%;
        width: 100%;
        display: table;
        text-align: right;
        padding-right: 2em;


    }

    .duration span {
        display: table-cell;
        vertical-align: middle;
        padding-right: 2em;

    }

</style>