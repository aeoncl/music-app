<script lang="ts">

    function handleTimelineClick(event: MouseEvent) {
        const timeline = event.currentTarget as HTMLElement;
        const bar = timeline.querySelector('.bar') as HTMLElement;
        const ball = timeline.querySelector('.ball') as HTMLElement;

        function update(e: MouseEvent) {
            const percent = Math.max(0, Math.min(1,
                (e.clientX - timeline.getBoundingClientRect().left) / timeline.clientWidth
            ));
            ball.style.left = `${percent * 100}%`;
            bar.style.width = `${percent * 100}%`;
        }

        update(event);
        timeline.classList.add('dragging');

        // Apply hover styles inline
        bar.style.backgroundColor = 'var(--clr-primary-a0)';
        ball.style.visibility = 'visible';

        const onMove = (e: MouseEvent) => update(e);
        const onUp = () => {
            timeline.classList.remove('dragging');

            // Remove inline styles to let CSS take over
            bar.style.backgroundColor = '';
            ball.style.visibility = '';

            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

</script>


<div class="player-controls-container">

    <div class="controls">
        <button>🔀</button>
        <button>⏮</button>
        <button class="play">▶︎</button>
        <button>⏭</button>
        <button>🔂</button>

    </div>


    <div class="timeline" onmousedown={handleTimelineClick}>
        <div class="bar-empty"></div>
        <div class="bar">

        </div>
        <div class="ball"></div>
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

    .timeline {
        position: relative;
        width: 30vw;
        height: 20px;
    }

    .bar-empty {
        position: absolute;
        top: 50%;
        height: 5px;
        width: 100%;
        transform: translateY(-50%);

        background-color: var(--clr-surface-a20);
        text-align: center;
        z-index: 1;
    }

    .bar {
        position: absolute;
        background-color: var(--clr-light-a0);
        transform: translateY(-50%);
        top: 50%;
        height: 6px;
        width: 5%;
        z-index: 2;
    }

    .ball {
        position: absolute;
        visibility: hidden;
        background-color: var(--clr-light-a0);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 5%;
        height: 12px;
        width: 12px;
        z-index: 2;
    }


    .timeline:hover {
        cursor: pointer;
    }

    .timeline:hover .bar {
        background-color: var(--clr-primary-a0);
    }


    .timeline:hover .ball {
        visibility: visible;
    }


</style>