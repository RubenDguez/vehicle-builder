// Importing Vehicle and Wheel classes
import { Details } from '../interfaces/Details.js';
import Vehicle from './Vehicle.js';
import Wheel from './Wheel.js';

// Car class that extends Vehicle class
class Car extends Vehicle implements Details {
	// Declare properties of the Car class
	vin: string;
	color: string;
	make: string;
	model: string;
	year: number;
	weight: number;
	topSpeed: number;
	wheels: Wheel[];

	// Constructor for the Car class
	constructor(props: Details) {
		// Call the constructor of the parent class, Vehicle
		super('car');

		// Initialize properties of the Car class
		this.vin = props.vin;
		this.color = props.color;
		this.make = props.make;
		this.model = props.model;
		this.year = props.year;
		this.weight = props.weight;
		this.topSpeed = props.topSpeed;

		// Check if the wheels array has 4 elements
		// If not, create 4 new Wheel objects
		// Otherwise, use the provided wheels array
		props.wheels.length !== 4 ? (this.wheels = [new Wheel(), new Wheel(), new Wheel(), new Wheel()]) : (this.wheels = props.wheels);
	}

	// Override the printDetails method from the Vehicle class
	override printDetails(): void {
		// Call the printDetails method of the parent class, Vehicle
		super.printDetails();

		console.log('General Information')
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
		console.log('Wheels Information')
		console.table([
			{
				'FL': `${this.wheels[0].getDiameter} inch with a ${this.wheels[0].getTireBrand} tire`,
				'FR': `${this.wheels[1].getDiameter} inch with a ${this.wheels[1].getTireBrand} tire`,
				'RL': `${this.wheels[2].getDiameter} inch with a ${this.wheels[2].getTireBrand} tire`,
				'RR': `${this.wheels[3].getDiameter} inch with a ${this.wheels[3].getTireBrand} tire`,
			},
		]);
	}
}

// Export the Car class as the default export
export default Car;
