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
	towingStatus: boolean;
	towingVehicle: Car | Truck | Motorbike | null;

	constructor(props: Details & Omit<AbleToTow, 'tow'>, towingStatus = false) {
		super();
		this.vin = props.vin;
		this.color = props.color;
		this.make = props.make;
		this.model = props.model;
		this.year = props.year;
		this.weight = props.weight;
		this.topSpeed = props.topSpeed;
		this.towingCapacity = props.towingCapacity;
		this.towingStatus = towingStatus;
		this.towingVehicle = null;

		props.wheels.length !== 4 ? (this.wheels = [new Wheel(), new Wheel(), new Wheel(), new Wheel()]) : (this.wheels = props.wheels);
	}

	tow(vehicle: Truck | Motorbike | Car): void {
		if (this.vin === vehicle.vin) {
			Logger.error('\nTruck cannot tow itself.\n');
			return;			
		}
		if (vehicle.weight > this.towingCapacity) {
			Logger.error('\nVehicle is too heavy to be towed.\n');
			return;
		}
		
		this.towingStatus = true;
		this.towingVehicle = vehicle;
	}

	unload() {
		if (this.towingStatus === false) {
			Logger.warn('\nTruck is available, nothing to unload.\n');
			return;
		}
		this.towingStatus = false;
		this.towingVehicle = null;
	}

	// Override the printDetails method from the Vehicle class
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
				'Towing Capacity': `${this.towingCapacity} lbs`,
				'Towing Status': `${this.towingStatus ? 'Towing' : 'Available'}`
			},
		]);
		console.log('Wheels Information');
		console.table([
			{
				FL: `${this.wheels[0].getDiameter} inch with a ${this.wheels[0].getTireBrand} tire`,
				FR: `${this.wheels[1].getDiameter} inch with a ${this.wheels[1].getTireBrand} tire`,
				RL: `${this.wheels[2].getDiameter} inch with a ${this.wheels[2].getTireBrand} tire`,
				RR: `${this.wheels[3].getDiameter} inch with a ${this.wheels[3].getTireBrand} tire`,
			},
		]);

		if (this.towingVehicle) {
			console.log('Currently Towing Vehicle')
			console.table([
				{
					VIN: this.towingVehicle.vin,
					Color: this.towingVehicle.color,
					Make: this.towingVehicle.make,
					Model: this.towingVehicle.model,
					Year: this.towingVehicle.year,
					Weight: `${this.towingVehicle.weight} lbs`,
				},
			]);
		}
	}
}

// Export the Truck class as the default export
export default Truck;
