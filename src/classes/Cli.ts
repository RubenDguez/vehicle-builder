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

Logger.useDefaults();

// define the Cli class
class Cli {
	private vehicles: (Car | Truck | Motorbike)[];
	private selectedVehicleVin: string | undefined;
	private exit: boolean = false;

	constructor(vehicles: (Car | Truck | Motorbike)[]) {
		this.vehicles = vehicles;
	}

	private getSelectedVehicle(vin: string | undefined) {
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
		// set the selectedVehicleVin to the vin of the selected vehicle
		this.selectedVehicleVin = answers.selectedVehicleVin;
		// perform actions on the selected vehicle
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
		// push the Truck to the vehicles array
		this.vehicles.push(truck);
		// set the selectedVehicleVin to the vin of the car
		this.selectedVehicleVin = truck.vin;
		// perform actions on the Truck
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
		// push the Motorbike to the vehicles array
		this.vehicles.push(motorbike);
		// set the selectedVehicleVin to the vin of the car
		this.selectedVehicleVin = motorbike.vin;
		// perform actions on the car
		await this.performActions();
	}

	// method to find a vehicle to tow
	async findVehicleToTow(truck: Truck): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.findVehicleToTow(this.vehicles));
		const vehicle = <Details>answers.vehicleToTow;
		if (vehicle.vin === truck.vin) {
			Logger.error(`\n${vehicle.make} ${vehicle.model} - ${vehicle.vin} : cannot tow itself\n`);
		} else {
			truck.tow(<Car | Truck | Motorbike>vehicle)
		}
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
				wheelie: () => {
					if (targetVehicle instanceof Motorbike) {
						targetVehicle.wheelie();
					}
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
			case 'Exit':
				this.exit = true;
				break;
			default:
				throw new Error('Invalid option');
		}
	}
}

// export the Cli class
export default Cli;
