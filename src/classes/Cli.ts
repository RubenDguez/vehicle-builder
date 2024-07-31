// importing classes from other files
import inquirer from "inquirer";
import Logger from 'js-logger';
import { Details } from "../interfaces/Details.js";
import Car from "./Car.js";
import Motorbike from "./Motorbike.js";
import Prompts from "./Prompts.js";
import Title from "./Title.js";
import Truck from "./Truck.js";
import Wheel from "./Wheel.js";

Logger.useDefaults();

// define the Cli class
class Cli {
	vehicles: (Car | Truck | Motorbike)[];
	selectedVehicleVin: string | undefined;
	exit: boolean = false;

	constructor(vehicles: (Car | Truck | Motorbike)[]) {
		this.vehicles = vehicles;
	}

	private getSelectedVehicle(vin: string | undefined) {
		if (!vin) return null;
		return this.vehicles.find((vehicle) => (vehicle.vin === vin));
	}

	// static method to generate a vin
	static generateVin(): string {
		// return a random string
		return (
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15)
		);
	}

	// method to choose a vehicle from existing vehicles
	async chooseVehicle(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.chooseVehicle(this.vehicles))
		// set the selectedVehicleVin to the vin of the selected vehicle
		this.selectedVehicleVin = answers.selectedVehicleVin;
		// perform actions on the selected vehicle
		await this.performActions();
	}

	// method to create a vehicle
	async createVehicle(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createVehicle())

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
		const answers = await inquirer.prompt(<any>Prompts.createCar())

		const car = new Car({
			vin: Cli.generateVin(),
			color: answers.color,
			make: answers.make,
			model: answers.model,
			year: parseInt(answers.year),
			weight: parseInt(answers.weight),
			topSpeed: parseInt(answers.topSpeed),
			wheels: []
		});

		this.vehicles.push(car);
		this.selectedVehicleVin = car.vin;

		await this.performActions();
	}

	// method to create a truck
	async createTruck(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createTruck())
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
		})
		// push the Truck to the vehicles array
		this.vehicles.push(truck);
		// set the selectedVehicleVin to the vin of the car
		this.selectedVehicleVin = truck.vin;
		// perform actions on the Truck
		await this.performActions();
	}

	// method to create a motorbike
	async createMotorbike(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.createMotorbike())
		const motorbike = new Motorbike({
			vin: Cli.generateVin(),
			color: answers.color,
			make: answers.make,
			model: answers.model,
			year: parseInt(answers.year),
			weight: parseInt(answers.weight),
			topSpeed: parseInt(answers.topSpeed),
			wheels: [
				new Wheel(answers.frontWheelDiameter, answers.frontWheelBrand),
				new Wheel(answers.rearWheelDiameter, answers.rearWheelBrand)
			],
		})
		// push the Motorbike to the vehicles array
		this.vehicles.push(motorbike);
		// set the selectedVehicleVin to the vin of the car
		this.selectedVehicleVin = motorbike.vin;
		// perform actions on the car
		await this.performActions();
	}

	// method to find a vehicle to tow
	async findVehicleToTow(truck: Truck): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.findVehicleToTow(this.vehicles))
		const vehicle = <Details>answers.vehicleToTow;
		if (vehicle.vin === truck.vin) {
			Logger.error(`\n${vehicle.make} ${vehicle.model} - ${vehicle.vin} : cannot tow itself\n`);
		} else {
			Logger.info(`\n${vehicle.make} ${vehicle.model} - ${vehicle.vin} : is being towed\n`);
		}
	}

	// method to perform actions on a vehicle
	async performActions(): Promise<void> {
		const answers = await inquirer.prompt(<any>Prompts.performActions(this.getSelectedVehicle(this.selectedVehicleVin)))

		switch (answers.action) {
			case 'Print details':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].printDetails();
					}
				}
				break;

			case 'Start vehicle':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].start();
					}
				}
				break;

			case 'Accelerate 5 MPH':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].accelerate(5);
					}
				}
				break;

			case 'Decelerate 5 MPH':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].decelerate(5);
					}
				}
				break;

			case 'Stop vehicle':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].stop();
					}
				}
				break;

			case 'Turn right':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].turn('right');
					}
				}
				break;

			case 'Turn left':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].turn('left');
					}
				}
				break;

			case 'Reverse':
				for (let i = 0; i < this.vehicles.length; i++) {
					if (this.vehicles[i].vin === this.selectedVehicleVin) {
						this.vehicles[i].reverse();
					}
				}
				break;

			case 'Tow':
				await this.findVehicleToTow(<Truck>this.getSelectedVehicle(this.selectedVehicleVin));
				break;

			case 'Wheelie':
				const vehicle = this.getSelectedVehicle(this.selectedVehicleVin);
				if (vehicle instanceof Motorbike) {
					Logger.info(`\n${vehicle.make} ${vehicle.model} is doing a Wheelie.\n`)
				}
				break;

			case 'Select or create another vehicle':
				await this.startCli();
				break;

			default:
				this.exit = true;
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

		// check if the user wants to create a new vehicle or select an existing vehicle
		if (answers.CreateOrSelect === 'Create a new vehicle') {
			await this.createVehicle();
		} else {
			await this.chooseVehicle();
		}
	}
}

// export the Cli class
export default Cli;
