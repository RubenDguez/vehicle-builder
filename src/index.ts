// import classes
import Truck from './classes/Truck.js';
import Car from './classes/Car.js';
import Motorbike from './classes/Motorbike.js';
import Wheel from './classes/Wheel.js';
import Cli from './classes/Cli.js';
import Title from './classes/Title.js';
import { readFileSync } from 'fs';
import Logger from 'js-logger';

// create an array of vehicles
const vehicles = [];

async function loader(total: number, curr: number, title?: string) {
	const MAX = 100;
	const percentComplete = (curr / total) * 100;

	Title.print();

	function wait(ms: number) {
		return new Promise((res) => setTimeout(res, ms));
	}

	process.stdout.write(`\r${title || ''} [ ${'#'.repeat(percentComplete)}${'-'.repeat(MAX - percentComplete)} ] ${Math.floor(percentComplete)}%`);
	console.log();
	await wait(200);
}

(async () => {
	try {
		const file = readFileSync('output/vehicles.json', { encoding: 'utf-8' });
		const vehiclesData: Array<any> = JSON.parse(file);

		const numberOfVehicles = vehiclesData.length;
		let index = 0;
		for (const veh of vehiclesData) {
			const wheels: Wheel[] = veh.wheels.map(
				(wheelData: { diameter: number | undefined; tireBrand: string | undefined }) => new Wheel(wheelData.diameter, wheelData.tireBrand),
			);

			switch (veh.type) {
				case 'car':
					vehicles.push(new Car({ ...veh, wheels }));
					break;
				case 'motorbike':
					vehicles.push(new Motorbike({ ...veh, wheels }));
					break;
				case 'truck':
					vehicles.push(new Truck({ ...veh, wheels }));
					break;
			}

			await loader(numberOfVehicles, (index += 1), `${veh.vin}`);
		}

		if (vehicles.length) console.log('Data successfully loaded');
	} catch (err: unknown) {
		const ERROR = <Error>err;

		if (!ERROR.message.includes('no such file or directory')) {
			Logger.error(ERROR.message);
			process.exit(1);
		}
	}

	// push vehicles to array
	if (!vehicles.length) {
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

		vehicles.push(truck);
		vehicles.push(car);
		vehicles.push(motorbike);
	}

	// create a new instance of the Cli class
	const cli = new Cli(vehicles);

	// start the cli
	await cli.startCli();

	Title.print();
	console.log('Thank you 🤝 for using this tool, have a great day! 😀\n');
})();
