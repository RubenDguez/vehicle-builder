// import classes
import Truck from './classes/Truck.js';
import Car from './classes/Car.js';
import Motorbike from './classes/Motorbike.js';
import Wheel from './classes/Wheel.js';
import Cli from './classes/Cli.js';
import Title from './classes/Title.js';

// create an array of vehicles
const vehicles = [];

const truck = new Truck({
	vin: Cli.generateVin(),
	color: 'red',
	make: 'Ford',
	model: 'F-150',
	year: 2021,
	weight: 5000,
	topSpeed: 120,
	wheels: [],
	towingCapacity: 10000,
});

// will use default wheels
const car = new Car({
	vin: Cli.generateVin(),
	color: 'blue',
	make: 'Toyota',
	model: 'Camry',
	year: 2021,
	weight: 3000,
	topSpeed: 130,
	wheels: [],
});

const motorbike = new Motorbike({
	vin: Cli.generateVin(),
	color: 'black',
	make: 'Harley Davidson',
	model: 'Sportster',
	year: 2021,
	weight: 500,
	topSpeed: 125,
	wheels: [new Wheel(17, 'Michelin'), new Wheel(17, 'Michelin')],
});

async function loader() {
	Title.print();
	function wait(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}
	const max = 100;
	for (let i = 0; i <= max; i++) {
		process.stdout.write(`\rLoading default information [ ${'#'.repeat(i)}${'-'.repeat(max - i)} ] ${i}%`);
		await wait(15);
	}
	process.stdout.write('\n');
}

(async () => {
	// push vehicles to array
	vehicles.push(truck);
	vehicles.push(car);
	vehicles.push(motorbike);
	
	await loader();
	
	// create a new instance of the Cli class
	const cli = new Cli(vehicles);

	// start the cli
	await cli.startCli();

	Title.print();
	console.log('Thank you 🤝 for using this tool, have a great day! 😀\n');
})();
