import Car from './Car.js';
import Motorbike from './Motorbike.js';
import Truck from './Truck.js';

export default class Prompts {
	public static chooseVehicle(vehicles: Array<Car | Truck | Motorbike>) {
		return [
			{
				type: 'list',
				name: 'selectedVehicleVin',
				message: 'Select a vehicle to perform an action on',
				choices: vehicles.map((vehicle) => {
					return {
						name: `${vehicle.vin}\t--\t${vehicle.make} ${vehicle.model}`,
						value: vehicle.vin,
					};
				}),
			},
		];
	}

	private static stringValidation(input: string, name: string) {
		if (!input.length) {
			return `Please provide a ${name}`;
		}

		if (input.length < 3) {
			return `Please provide a valid ${name}`;
		}

		return true;
	}

	private static intValidation(input: string, name: string, min = 0, max: number) {
		if (!input.length) {
			return `Please provide a ${name}`;
		}

		if (isNaN(parseInt(input))) {
			return `Please provide a valid ${name}`;
		}

		if (parseInt(input) < min || parseInt(input) > max) {
			return `Please provide a valid year between ${min} and ${max}`;
		}

		return true;
	}

	private static defaultCreate() {
		return [
			{
				type: 'input',
				name: 'color',
				message: 'Enter Color',
				validate: (input: string) => {
					return Prompts.stringValidation(input, 'color');
				},
			},
			{
				type: 'input',
				name: 'make',
				message: 'Enter Make',
				validate: (input: string, name: string) => {
					return Prompts.stringValidation(input, 'make');
				},
			},
			{
				type: 'input',
				name: 'model',
				message: 'Enter Model',
				validate: (input: string) => {
					return Prompts.stringValidation(input, 'model');
				},
			},
			{
				type: 'input',
				name: 'year',
				message: 'Enter Year',
				validate: (input: string) => {
					return Prompts.intValidation(input, 'year', 1900, new Date().getFullYear() + 2);
				},
			},
			{
				type: 'input',
				name: 'weight',
				message: 'Enter Weight',
				validate: (input: string) => {
					return Prompts.intValidation(input, 'weight', 0, 100_000);
				},
			},
			{
				type: 'input',
				name: 'topSpeed',
				message: 'Enter Top Speed',
				validate: (input: string) => {
					return Prompts.intValidation(input, 'top speed', 0, 300);
				},
			},
		];
	}

	public static createVehicle() {
		return [
			{
				type: 'list',
				name: 'vehicleType',
				message: 'Select a vehicle type',
				choices: ['Car', 'Truck', 'Motorbike'],
			},
		];
	}

	public static createCar() {
		return [...Prompts.defaultCreate()];
	}

	public static createTruck() {
		return [
			...Prompts.defaultCreate(),
			{
				type: 'input',
				name: 'towingCapacity',
				message: 'Enter Towing Capacity',
				validate: (input: string) => {
					return Prompts.intValidation(input, 'towing capacity', 0, 100_000);
				},
			},
		];
	}

	public static createMotorbike() {
		return [
			...Prompts.defaultCreate(),
			{
				type: 'input',
				name: 'frontWheelDiameter',
				message: 'Enter Front Wheel Diameter',
				validate: (input: string) => {
					return Prompts.intValidation(input, 'front wheel diameter in inches', 10, 30);
				},
			},
			{
				type: 'input',
				name: 'frontWheelBrand',
				message: 'Enter Front Wheel Brand',
				validate: (input: string) => {
					return Prompts.stringValidation(input, 'front wheel brand');
				},
			},
			{
				type: 'input',
				name: 'rearWheelDiameter',
				message: 'Enter Rear Wheel Diameter',
				validate: (input: string) => {
					return Prompts.intValidation(input, 'rear wheel diameter in inches', 10, 30);
				},
			},
			{
				type: 'input',
				name: 'rearWheelBrand',
				message: 'Enter Rear Wheel Brand',
				validate: (input: string) => {
					return Prompts.stringValidation(input, 'rear wheel brand');
				},
			},
		];
	}

	public static findVehicleToTow(vehicles: Array<Car | Truck | Motorbike>) {
		return [
			{
				type: 'list',
				name: 'vehicleToTow',
				message: 'Select a vehicle to tow',
				choices: vehicles.map((vehicle) => {
					return {
						name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
						value: vehicle,
					};
				}),
			},
		];
	}

	public static performActions(vehicle: Car | Truck | Motorbike | null | undefined) {
		const choices = [
			'Print details',
			'Start vehicle',
			'Accelerate 5 MPH',
			'Decelerate 5 MPH',
			'Stop vehicle',
			'Turn right',
			'Turn left',
			'Reverse',
			'Select or create another vehicle',
			'Exit',
		];

		if (vehicle instanceof Truck) choices.unshift('Tow');
		if (vehicle instanceof Motorbike) choices.unshift('Wheelie');

		return [
			{
				type: 'list',
				name: 'action',
				message: 'Select an action',
				choices,
			},
		];
	}

	public static startCli() {
		return [
			{
				type: 'list',
				name: 'CreateOrSelect',
				message: 'Would you like to create a new vehicle or perform an action on an existing vehicle?',
				choices: ['Create a new vehicle', 'Select an existing vehicle', 'Exit'],
			},
		];
	}
}
