<script lang="ts">
</script>


<div class="player-controls-container">

    <div class="controls">
        <button>🔀</button>
        <button>⏮</button>
        <button class="play">▶︎</button>
        <button>⏭</button>
        <button>🔂</button>

    </div>
    <div class="timeline">
    </div>
</div>


<style lang="css">

    .player-controls-container {
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .controls {
        display: flex;
        justify-content: center;
        gap: 1em;
        padding: .5em;
        width: 10vw;
    }

    .controls button {
        cursor: pointer;
        padding: .1em;
        color: var(--clr-surface-a50);
        transition: color .1s ease-in, scale .1s ease-in;
        scale: 1;
    }

    .controls button:hover {
        color: var(--clr-light-a0);
        scale: 1.1;
    }

    .controls button:active {
        color: var(--clr-surface-a50);
        scale: 0.9;
    }

    .controls .play {
        font-size: 16pt;
    }

    .player-controls-container .timeline {
        background-color: green;
        width: 30vw;
        height: 10px;
    }
</style>