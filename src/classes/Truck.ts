// import the Vehicle, Motorbike, Car, Wheel, and AbleToTow classes/interfaces
import Vehicle from './Vehicle.js';
import Motorbike from './Motorbike.js';
import Car from './Car.js';
import Wheel from './Wheel.js';
import AbleToTow from '../interfaces/AbleToTow.js';
import { Details } from '../interfaces/Details.js';
import Logger from 'js-logger';

class Truck extends Vehicle implements Details, AbleToTow {
	vin: string;
	color: string;
	make: string;
	model: string;
	year: number;
	weight: number;
	topSpeed: number;
	wheels: Wheel[];
	towingCapacity: number;

	constructor(props: Details & Omit<AbleToTow, 'tow'>) {
		super();
		this.vin = props.vin;
		this.color = props.color;
		this.make = props.make;
		this.model = props.model;
		this.year = props.year;
		this.weight = props.weight;
		this.topSpeed = props.topSpeed;
		this.towingCapacity = props.towingCapacity;

		props.wheels.length !== 4 ? (this.wheels = [new Wheel(), new Wheel(), new Wheel(), new Wheel()]) : (this.wheels = props.wheels);
	}

	tow(vehicle: Truck | Motorbike | Car): void {
		const details = `${vehicle.vin} | ${vehicle.make} | ${vehicle.model}`;
		vehicle.weight <= this.towingCapacity ? console.log(`\n${details} is being towed.\n`) : Logger.error(`\n${details} is too heavy to be towed.\n`);
	}

	// Override the printDetails method from the Vehicle class
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
		console.log(`Towing Capacity: ${this.towingCapacity}`);

		// Print details of the wheels
		console.log(`Wheel 1: ${this.wheels[0].getDiameter} inch with a ${this.wheels[0].getTireBrand} tire`);
		console.log(`Wheel 2: ${this.wheels[1].getDiameter} inch with a ${this.wheels[1].getTireBrand} tire`);
		console.log(`Wheel 3: ${this.wheels[2].getDiameter} inch with a ${this.wheels[2].getTireBrand} tire`);
		console.log(`Wheel 4: ${this.wheels[3].getDiameter} inch with a ${this.wheels[3].getTireBrand} tire`);
	}
}

// Export the Truck class as the default export
export default Truck;
