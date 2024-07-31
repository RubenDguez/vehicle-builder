// Importing Vehicle and Wheel classes
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

		(props.wheels.length !== 2) ?
			this.wheels = [new Wheel(), new Wheel()] :
			this.wheels = props.wheels;
	}

	wheelie() {
		console.log(`Motorbike ${this.make} ${this.model} is doing a wheelie`);
	}

	override printDetails(): void {
		// Call the printDetails method of the parent class, Vehicle
		super.printDetails();

		// Print details of the Car class
		console.log(`VIN: ${this.vin}`);
		console.log(`Make: ${this.make}`);
		console.log(`Model: ${this.model}`);
		console.log(`Year: ${this.year}`);
		console.log(`Weight: ${this.weight} lbs`);
		console.log(`Top Speed: ${this.topSpeed} mph`);
		console.log(`Color: ${this.color}`);

		// Print details of the wheels
		console.log(
			`Wheel 1: ${this.wheels[0].getDiameter} inch with a ${this.wheels[0].getTireBrand} tire`
		);
		console.log(
			`Wheel 2: ${this.wheels[1].getDiameter} inch with a ${this.wheels[1].getTireBrand} tire`
		);
	}
}

// Export the Motorbike class as the default export
export default Motorbike;
