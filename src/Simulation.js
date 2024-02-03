import { shuffleArray } from './extraFunctions';

export default new class Simulation {
	grid = [];
	physics = {
		interactions: {
			AA: 0,
			AB: 5,
			BB: 0,
		},
		Chi: 0,
	}

	#running = false;
	get running() {
		return this.#running;
	}
	set running(_run) {
		let startRunning = _run && !this.running
		this.#running = _run;
		if (startRunning) this.loop();
	}

	constructor() {
		window.Simulation = this;
		this.physics.Chi = 2 * this.physics.interactions.AB - this.physics.interactions.AA - this.physics.interactions.BB;

		const width = 10;
		const height = 10;
		let particleACount = Math.floor(width * height / 2);
		let particleBCount = width * height - particleACount;

		let particles = [];
		for (let a = 0; a < particleACount; a++) particles.push(0);
		for (let b = 0; b < particleBCount; b++) particles.push(1);
		particles = shuffleArray(particles);

		
		for (let x = 0; x < width; x++)
		{
			this.grid[x] = [];
			for (let y = 0; y < height; y++)
			{
				this.grid[x][y] = particles.pop();
			}
		}
	}



	calcEnergy(_grid) {
		let total = 0;
		for (let x = 0; x < _grid.length; x++)
		{
			for (let y = 0; y < _grid[0].length; y++)
			{
				let self = _grid[x][y];
				let otherNeighbours = 0;
				if (_grid[x + 1]) otherNeighbours += Math.abs(self - _grid[x + 1][y]);
				if (_grid[x][y + 1]) otherNeighbours += Math.abs(self - _grid[x][y + 1]);
				total += otherNeighbours * this.physics.Chi;;
			}
		}

		return total / this.grid.length / this.grid[0].length;
	}

	loop() {
		if (!this.running) return;
		// for (let i = 0; i < 5; i++) 
		this.step();
		setTimeout(() => this.loop(), 1);
	}

	step() {
		// console.time('energy');
		let curEnergy = this.calcEnergy(this.grid);
		// console.timeEnd('energy');

		// console.time('swap');
		let x1 = Math.floor(Math.random() * this.grid.length);
		let y1 = Math.floor(Math.random() * this.grid[0].length);
		let particle1 = this.grid[x1][y1];

		let x2 = Math.floor(Math.random() * this.grid.length);
		let y2 = Math.floor(Math.random() * this.grid[0].length);
		while (particle1 === this.grid[x2][y2] || (x1 === x2 && y1 === y2))
		{
			x2 = Math.floor(Math.random() * this.grid.length);
			y2 = Math.floor(Math.random() * this.grid[0].length);
		}

		let proposedGrid = copyGrid(this.grid);
		proposedGrid[x1][y1] = proposedGrid[x2][y2];
		proposedGrid[x2][y2] = particle1;

		let newEnergy = this.calcEnergy(proposedGrid);
		let dEnergy = newEnergy - curEnergy;
		// console.log(dEnergy, [x1, y1], [x2, y2]);

		let accepted = dEnergy < 0; // || Math.random() < Math.exp(-dEnergy);
		if (accepted) this.grid = proposedGrid;
	}
}

function copyGrid(_grid) {
	let newGrid = [];
	for (let arr of _grid) newGrid.push(Object.assign([], arr));
	return newGrid;
}