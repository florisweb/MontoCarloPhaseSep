<script>
	import Simulation from '../Simulation';

	let canvas;
	let ctx;
	$: if (canvas) ctx = canvas.getContext('2d');

	let running = false;
	$: if (ctx && !running) render();

	function render() {
		running = true;
		const xTileSize = canvas.width / Simulation.grid.length;
		const yTileSize = canvas.height / Simulation.grid[0].length;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let x = 0; x < Simulation.grid.length; x++)
		{
			for (let y = 0; y < Simulation.grid[0].length; y++)
			{
				ctx.fillStyle = Simulation.grid[x][y] ? '#d33' : '#33d';
				ctx.beginPath();
				ctx.fillRect(x * xTileSize, y * yTileSize, xTileSize, yTileSize);
				ctx.closePath();
				ctx.fill();
			}
		}

		requestAnimationFrame(render);
	}
	
</script>

<canvas bind:this={canvas} width="500" height="500"></canvas>

<style>
	canvas {
		position: relative;
		width: min(100vw, 100vh);
		height: auto;
		border: 1px solid red;
	}

</style>