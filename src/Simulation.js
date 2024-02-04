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

		const width = 500;
		const height = 500;
		this.grid = this.generateGrid(width, height);
	}

	generateGrid(_width, _height) {
		let grid = [];
		let particleACount = Math.floor(_width * _height / 2);
		let particleBCount = _width * _height - particleACount;

		let particles = [];
		for (let a = 0; a < particleACount; a++) particles.push(0);
		for (let b = 0; b < particleBCount; b++) particles.push(1);
		particles = shuffleArray(particles);

		for (let x = 0; x < _width; x++)
		{
			grid[x] = [];
			for (let y = 0; y < _height; y++)
			{
				grid[x][y] = particles.pop();
			}
		}
		return grid;
	}



	calcEnergy(_grid) {
		let total = 0;
		for (let x = 0; x < _grid.length; x++)
		{
			for (let y = 0; y < _grid[0].length; y++)
			{
				let self = _grid[x][y];
				let otherNeighbours = 0;
				if (_grid[x + 1]) 
				{
					otherNeighbours += Math.abs(self - _grid[x + 1][y]);
				} else otherNeighbours += Math.abs(self - _grid[0][y]); // Wrap
				if (_grid[x][y + 1]) {
					otherNeighbours += Math.abs(self - _grid[x][y + 1]);
				} else otherNeighbours += Math.abs(self - _grid[x][0]);
				total += otherNeighbours * this.physics.Chi;
			}
		}

		return total / this.grid.length / this.grid[0].length;
	}

	loop() {
		if (!this.running) return;
		console.time('run');
		for (let i = 0; i < 100000; i++) this.step();
		console.timeEnd('run');
		setTimeout(() => this.loop(), 1);
	}

	step() {
		// let curEnergy = this.calcEnergy(this.grid);
		

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

		// x1, y1 niet naast x2, y2
		let subEnergyPre = this.getAllOtherNeighbours(x1, y1) * this.physics.Chi + this.getAllOtherNeighbours(x2, y2) * this.physics.Chi;
		let subEnergyPost = (4 - this.getAllOtherNeighbours(x1, y1)) * this.physics.Chi + (4 - this.getAllOtherNeighbours(x2, y2)) * this.physics.Chi;

		let dEnergy = subEnergyPost - subEnergyPre;

		let accepted = dEnergy < 0; // || Math.random() < Math.exp(-dEnergy);
		if (accepted) {
			this.grid[x1][y1] = this.grid[x2][y2];
			this.grid[x2][y2] = particle1;
		}

		// let proposedGrid = copyGrid(this.grid);
		// proposedGrid[x1][y1] = proposedGrid[x2][y2];
		// proposedGrid[x2][y2] = particle1;
		// let newEnergy = this.calcEnergy(proposedGrid);
		// let dEnergy = (newEnergy - curEnergy) * this.grid.length * this.grid[0].length;
		// console.log([x1, y1], '<->', [x2, y2], dEnergy, subEnergyPost - subEnergyPre);

		// console.log(dEnergy, [x1, y1], [x2, y2]);

		// let accepted = dEnergy < 0; // || Math.random() < Math.exp(-dEnergy);
		// if (accepted) this.grid = proposedGrid;
		


	}

	getAllOtherNeighbours(x, y) {
		let self = this.grid[x][y];
		let otherNeighbours = 0;
		if (typeof this.grid[x + 1] !== 'undefined') {
			otherNeighbours += Math.abs(self - this.grid[x + 1][y]);
		} else otherNeighbours += Math.abs(self - this.grid[0][y]); // Wrap
		
		if (typeof this.grid[x - 1] !== 'undefined') {
			otherNeighbours += Math.abs(self - this.grid[x - 1][y]);
		} else otherNeighbours += Math.abs(self - this.grid[this.grid.length - 1][y]); // Wrap
		
		if (typeof this.grid[x][y + 1] !== 'undefined') {
			otherNeighbours += Math.abs(self - this.grid[x][y + 1]);
		} else otherNeighbours += Math.abs(self - this.grid[x][0]);

		if (typeof this.grid[x][y - 1] !== 'undefined') {
			otherNeighbours += Math.abs(self - this.grid[x][y - 1]);
		} else otherNeighbours += Math.abs(self - this.grid[x][this.grid[0].length - 1]);

		return otherNeighbours;
	}
}

function copyGrid(_grid) {
	let newGrid = [];
	for (let arr of _grid) newGrid.push(Object.assign([], arr));
	return newGrid;
}