// Importing Vehicle and Wheel classes
import Logger from 'js-logger';
import { Details } from '../interfaces/Details.js';
import Vehicle from './Vehicle.js';
import Wheel from './Wheel.js';

class Motorbike extends Vehicle implements Details {
	vin: string;
	color: string;
	make: string;
	model: string;
	year: number;
	weight: number;
	topSpeed: number;
	wheels: Wheel[];

	constructor(props: Details) {
		super();
		this.vin = props.vin;
		this.color = props.color;
		this.make = props.make;
		this.model = props.model;
		this.year = props.year;
		this.weight = props.weight;
		this.topSpeed = props.topSpeed;

		props.wheels.length !== 2 ? (this.wheels = [new Wheel(), new Wheel()]) : (this.wheels = props.wheels);
	}

	wheelie() {
		if (this.started) {
			Logger.info(`\n${this.make} ${this.model} is doing a Wheelie.\n`);
			return;
		}
		Logger.error('\nStart the Motorbike first\n');
	}

	override printDetails(): void {
		// Call the printDetails method of the parent class, Vehicle
		super.printDetails();

		console.log('General Information');
		console.table([
			{
				VIN: this.vin,
				Color: this.color,
				Make: this.make,
				Model: this.model,
				Year: this.year,
				Weight: `${this.weight} lbs`,
				'Top Speed': `${this.topSpeed} mph`,
			},
		]);
		console.log('Wheels Information');
		console.table([
			{
				FR: `${this.wheels[0].getDiameter} inch with a ${this.wheels[0].getTireBrand} tire`,
				RR: `${this.wheels[1].getDiameter} inch with a ${this.wheels[1].getTireBrand} tire`,
			},
		]);
	}
}

// Export the Motorbike class as the default export
export default Motorbike;
