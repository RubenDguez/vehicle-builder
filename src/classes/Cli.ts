// importing classes from other files
import inquirer from 'inquirer';
import Logger from 'js-logger';
import { Details } from '../interfaces/Details.js';
import Car from './Car.js';
import Motorbike from './Motorbike.js';
import Prompts from './Prompts.js';
import Title from './Title.js';
import Truck from './Truck.js';
import Wheel from './Wheel.js';
import { EVehicleAction } from '../enums/index.js';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';

Logger.useDefaults();

// define the Cli class
class Cli {
	private vehicles: (Car | Truck | Motorbike)[];
	private selectedVehicleVin: string | undefined;
	private exit: boolean = false;

	constructor(vehicles: (Car | Truck | Motorbike)[]) {
		this.vehicles = vehicles;
	}

	private getSelectedVehicle(vin: string | undefined): Car | Truck | Motorbike | null | undefined {
		if (!vin) return null;
		return this.vehicles.find((vehicle) => vehicle.vin === vin);
	}

	// static method to generate a vin
	static generateVin(): string {
		// return a random string
		return (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toUpperCase().substring(0, 18);
	}

	// method to choose a vehicle from existing vehicles
	async chooseVehicle(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.chooseVehicle(this.vehicles));
		if (answers.selectedVehicleVin === 'back') {
			await this.startCli();
			return;
		}
		if (answers.selectedVehicleVin === 'exit') {
			this.exit = true;
			return;
		}

		const vin: string = answers.selectedVehicleVin.split('--')[0].trim();

		// set the selectedVehicleVin to the vin of the selected vehicle
		this.selectedVehicleVin = vin;
		// perform actions on the selected vehicle
		this.getSelectedVehicle(this.selectedVehicleVin)?.printDetails();
		await this.performActions();
	}

	// method to create a vehicle
	async createVehicle(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createVehicle());

		switch (answers.vehicleType.toLowerCase()) {
			case 'car':
				await this.createCar();
				break;
			case 'truck':
				await this.createTruck();
				break;
			case 'motorbike':
				await this.createMotorbike();
				break;
			case 'back':
				await this.startCli();
				break;
			case 'exit':
				this.exit = true;
				break;
			default:
				throw new Error('Invalid vehicle type');
		}
	}

	// method to create a car
	async createCar(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createCar());

		const car = new Car({
			vin: Cli.generateVin(),
			color: answers.color,
			make: answers.make,
			model: answers.model,
			year: parseInt(answers.year),
			weight: parseInt(answers.weight),
			topSpeed: parseInt(answers.topSpeed),
			wheels: [],
		});

		this.vehicles.push(car);
		this.selectedVehicleVin = car.vin;
		car.printDetails();
		await this.save();
		await this.performActions();
	}

	// method to create a truck
	async createTruck(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createTruck());
		const truck = new Truck({
			vin: Cli.generateVin(),
			color: answers.color,
			make: answers.make,
			model: answers.model,
			year: parseInt(answers.year),
			weight: parseInt(answers.weight),
			topSpeed: parseInt(answers.topSpeed),
			wheels: [],
			towingCapacity: parseInt(answers.towingCapacity),
		});
		this.vehicles.push(truck);
		this.selectedVehicleVin = truck.vin;
		truck.printDetails();
		await this.save();
		await this.performActions();
	}

	// method to create a motorbike
	async createMotorbike(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createMotorbike());
		const motorbike = new Motorbike({
			vin: Cli.generateVin(),
			color: answers.color,
			make: answers.make,
			model: answers.model,
			year: parseInt(answers.year),
			weight: parseInt(answers.weight),
			topSpeed: parseInt(answers.topSpeed),
			wheels: [new Wheel(answers.frontWheelDiameter, answers.frontWheelBrand), new Wheel(answers.rearWheelDiameter, answers.rearWheelBrand)],
		});
		this.vehicles.push(motorbike);
		this.selectedVehicleVin = motorbike.vin;
		motorbike.printDetails();
		await this.save();
		await this.performActions();
	}

	// method to find a vehicle to tow
	async findVehicleToTow(truck: Truck): Promise<void> {
		if (truck.towingStatus === true) {
			Logger.error('\nTruck is already towing a vehicle. Unload the vehicle first and try again.\n');
			return;
		}
		const answers = await inquirer.prompt(<any>Prompts.findVehicleToTow(this.vehicles));
		const vehicle = <Details>answers.vehicleToTow;
		truck.tow(<Car | Truck | Motorbike>vehicle);
	}

	// perform actions on the vehicle
	perform(action: EVehicleAction): void {
		for (const targetVehicle of this.vehicles) {
			if (targetVehicle.vin !== this.selectedVehicleVin) continue;

			const actOn: Record<EVehicleAction, () => void> = {
				accelerate: () => targetVehicle.accelerate(5),
				decelerate: () => targetVehicle.decelerate(5),
				printDetails: () => targetVehicle.printDetails(),
				reverse: () => targetVehicle.reverse(),
				start: () => targetVehicle.start(),
				stop: () => targetVehicle.stop(),
				turnLeft: () => targetVehicle.turn('left'),
				turnRight: () => targetVehicle.turn('right'),
				unload: () => {
					if (targetVehicle instanceof Truck) targetVehicle.unload();
				},
				wheelie: () => {
					if (targetVehicle instanceof Motorbike) targetVehicle.wheelie();
				},
			};

			actOn[action]();
			break;
		}
	}

	// method to perform actions on a vehicle
	async performActions(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.performActions(this.getSelectedVehicle(this.selectedVehicleVin)));
		switch (answers.action) {
			case 'Print details':
				this.perform(EVehicleAction.PRINT_DETAILS);
				break;

			case 'Start vehicle':
				this.perform(EVehicleAction.START);
				break;

			case 'Accelerate 5 MPH':
				this.perform(EVehicleAction.ACCELERATE);
				break;

			case 'Decelerate 5 MPH':
				this.perform(EVehicleAction.DECELERATE);
				break;

			case 'Stop vehicle':
				this.perform(EVehicleAction.STOP);
				break;

			case 'Turn right':
				this.perform(EVehicleAction.TURN_RIGHT);
				break;

			case 'Turn left':
				this.perform(EVehicleAction.TURN_LEFT);
				break;

			case 'Reverse':
				this.perform(EVehicleAction.REVERSE);
				break;

			case 'Unload':
				this.perform(EVehicleAction.UNLOAD);
				break;
			case 'Tow':
				await this.findVehicleToTow(<Truck>this.getSelectedVehicle(this.selectedVehicleVin));
				break;

			case 'Wheelie':
				this.perform(EVehicleAction.WHEELIE);
				break;

			case 'Select or create another vehicle':
				await this.startCli();
				break;

			case 'Exit':
				this.exit = true;
				break;

			default:
				throw new Error('Invalid option');
		}

		// if the user does not want to exit, perform actions on the selected vehicle
		if (!this.exit) {
			await this.performActions();
		}
	}

	async save(): Promise<void> {
		try {
			writeFileSync('output/vehicles.json', JSON.stringify(this.vehicles, null, 4), { encoding: 'utf-8' });
			return;
		} catch (err: unknown) {
			const error = err as Error;

			// if the output folder does not exist, create it and try again
			if (error.message.includes('no such file or directory')) {
				mkdirSync('output');
				return this.save();
			}

			throw new Error('Something went wrong while creating vehicles data' + '\n' + error.message);
		}
	}

	// method to start the cli
	async startCli(): Promise<void> {
		Title.print();
		const answers = await inquirer.prompt(<any>Prompts.startCli());

		switch (answers.CreateOrSelect) {
			case 'Create a new vehicle':
				await this.createVehicle();
				break;
			case 'Select an existing vehicle':
				await this.chooseVehicle();
				break;
			case 'exit':
				this.exit = true;
				break;
			default:
				throw new Error('Invalid option');
		}
	}
}

// export the Cli class
export default Cli;
