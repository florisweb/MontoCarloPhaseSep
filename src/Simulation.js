import { shuffleArray } from './extraFunctions';

const AB = Math.random() * 5;
const AC = Math.random() * 5;
const AD = Math.random() * 5;
const BC = Math.random() * 5;
const BD = Math.random() * 5;
const CD = Math.random() * 5;


// C = emulgator


export default new class Simulation {
	grid = [];
	history = {
		energy: [],
	}
	physics = {
		interactions: [
			[0, AB, AC, AD],
			[AB, 0, BC, BD],
			[AC, BC, 0, CD],
			[AD, BD, CD, 0],
		],
		// Chi: 0,
		Beta: 0,
		Kb: 1.380 * Math.pow(10, -23), // J/K
		T: 293, // K
	}

	steps = 0;



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
		this.physics.Beta = 1 / (this.physics.Kb * this.physics.T);

		const width = 100;
		const height = 100;
		this.grid = this.generateGrid(width, height);
	}

	loop() {
		if (!this.running) return;
		this.history.energy.push(this.calcEnergy(this.grid));
		for (let i = 0; i < 100000; i++) this.step();
		setTimeout(() => this.loop(), 1);
	}

	step() {
		this.steps++;
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

		// TODO: x1, y1 cannot be a neighbour of x2, y2
		let subEnergyPre = this.getTileEnergy(x1, y1) + this.getTileEnergy(x2, y2);
		let subEnergyPost = this.getTileEnergy(x1, y1, this.grid[x2][y2]) + this.getTileEnergy(x2, y2, this.grid[x1][y1]);
		let dEnergy = subEnergyPost - subEnergyPre;

		let accepted = dEnergy < 0 || Math.random() < Math.exp(-dEnergy * this.physics.Beta);
		if (!accepted) return;
		this.grid[x1][y1] = this.grid[x2][y2];
		this.grid[x2][y2] = particle1;
	}


	generateGrid(_width, _height) {
		let grid = [];
		let particleCounts = [
			Math.floor(_width * _height * .25), 
			// Math.floor(_width * _height * .25),
			// Math.floor(_width * _height * .25),
		];
		particleCounts.push(_width * _height - particleCounts.reduce((a, b) => a + b, 0));
		
		let particles = [];
		for (let i = 0; i < particleCounts.length; i++)
		{
			for (let a = 0; a < particleCounts[i]; a++) particles.push(i);
		}
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
				if (typeof _grid[x + 1] !== 'undefined') {
					total += this.physics.interactions[self][_grid[x + 1][y]];
				} else total += this.physics.interactions[self][_grid[0][y]];
				
				if (typeof _grid[x - 1] !== 'undefined') {
					total += this.physics.interactions[self][_grid[x - 1][y]];
				} else total += this.physics.interactions[self][_grid[this.grid.length - 1][y]];
			}
		}

		return total / _grid.length / _grid[0].length;
	}


	getTileEnergy(x, y, _self) {
		let self = typeof _self !== 'undefined' ? _self : this.grid[x][y];
		let energy = 0;

		if (typeof this.grid[x + 1] !== 'undefined') {
			energy += this.physics.interactions[self][this.grid[x + 1][y]];
		} else energy += this.physics.interactions[self][this.grid[0][y]];
		
		if (typeof this.grid[x - 1] !== 'undefined') {
			energy += this.physics.interactions[self][this.grid[x - 1][y]];
		} else energy += this.physics.interactions[self][this.grid[this.grid.length - 1][y]];

		if (typeof this.grid[x][y + 1] !== 'undefined') {
			energy += this.physics.interactions[self][this.grid[x][y + 1]];
		} else energy += this.physics.interactions[self][this.grid[x][0]];

		if (typeof this.grid[x][y - 1] !== 'undefined') {
			energy += this.physics.interactions[self][this.grid[x][y - 1]];
		} else energy += this.physics.interactions[self][this.grid[x][this.grid[0].length - 1]]; 

		return energy;
	}
}