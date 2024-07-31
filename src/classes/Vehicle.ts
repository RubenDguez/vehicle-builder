// import Driveable interface
import Logger from 'js-logger';
import Driveable from '../interfaces/Driveable.js';
import Title from './Title.js';

// Vehicle class that implements Driveable interface
class Vehicle implements Driveable {
	// Declare properties of the Vehicle class
	started: boolean;
	currentSpeed: number;

	// Constructor for the Vehicle class
	constructor() {
		this.started = false;
		this.currentSpeed = 0;
	}

	private hasVehicleStarted(fn: Function) {
		if (!this.started) {
			Logger.error('\nStart the vehicle first\n');
			return;
		}

		fn();
	}

	// Method to print vehicle details
	printDetails(): void {
		Title.print();
		console.log('Vehicle State')
		console.table([
			{
				'Vehicle Started': this.started,
				'Vehicle current Speed': this.currentSpeed,
			},
		]);
	}

	// Method to start the vehicle
	start(): void {
		this.started = true;
		console.log('\nVehicle started\n');
	}

	// Method to accelerate the vehicle
	accelerate(change: number): void {
		this.hasVehicleStarted(() => {
			this.currentSpeed += change;
			console.log(`\nVehicle accelerated to ${this.currentSpeed} mph\n`);
		});
	}

	// Method to decelerate the vehicle
	decelerate(change: number): void {
		this.hasVehicleStarted(() => {
			this.currentSpeed -= change;
			console.log(`\nVehicle decelerated to ${this.currentSpeed} mph\n`);
		});
	}

	// Method to stop the vehicle
	stop(): void {
		this.currentSpeed = 0;
		this.started = false;
		console.log('\nVehicle stopped\n');
	}

	// Method to turn the vehicle
	turn(direction: string): void {
		this.hasVehicleStarted(() => {
			console.log(`\nVehicle turned ${direction}\n`);
		});
	}

	// Method to reverse the vehicle
	reverse(): void {
		this.hasVehicleStarted(() => {
			console.log('\nVehicle reversed\n');
		});
	}
}

// Export the Vehicle class
export default Vehicle;
