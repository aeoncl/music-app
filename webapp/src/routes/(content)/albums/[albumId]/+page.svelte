<script lang="ts">

    import type {PageProps} from '$routes';
    import {SpyModule} from "vitest/internal/browser";


    let { data }: PageProps = $props();


    function durationToString(durationInSec: number): string {

        let hours = Math.floor(durationInSec / 3600);
        let minutes = Math.floor((durationInSec - (hours * 3600)) / 60);
        let seconds = durationInSec - (hours * 3600) - (minutes * 60);

        let out = "";
        if (hours > 0) {
            out += hours + ":";
        }

        let secondsFormatted = (seconds < 10) ? "0" + seconds : seconds;

        out += `${minutes}:${secondsFormatted}`;

        return out;
    }

</script>

<div class="table-labels row">
    <span class="trackNumber">#</span>
    <span>Title</span>
    <span class="duration">Duration</span>
</div>

{#each data.album.song as song (song.id)}
    <div class="table-row row">
        <div class="trackNumber">
            <span>{song.track}</span>
        </div>
        <div class="title">
            <div>
                <span>{song.title}</span>
                <span class="artist">{song.artist}</span>
            </div>
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
        display: table;
    }

    .title div {
        display: table-cell;
        vertical-align: middle;
    }

    .title div span {
        display: block;
    }

    .title div .artist {
        font-weight: bold;
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