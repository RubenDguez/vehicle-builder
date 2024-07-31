// import classes
import Truck from "./classes/Truck.js";
import Car from "./classes/Car.js";
import Motorbike from "./classes/Motorbike.js";
import Wheel from "./classes/Wheel.js";
import Cli from "./classes/Cli.js";

// create an array of vehicles
const vehicles = [];

const truck1 = new Truck({
	vin: Cli.generateVin(),
	color: "red",
	make: "Ford",
	model: "F-150",
	year: 2021,
	weight: 5000,
	topSpeed: 120,
	wheels: [],
	towingCapacity: 10000
});

// will use default wheels
const car1 = new Car({
	vin: Cli.generateVin(),
	color: 'blue',
	make: 'Toyota',
	model: 'Camry',
	year: 2021,
	weight: 3000,
	topSpeed: 130,
	wheels: []
});


const motorbike1Wheels = [new Wheel(17, "Michelin"), new Wheel(17, "Michelin")];
const motorbike1 = new Motorbike({
	vin: Cli.generateVin(),
	color: "black",
	make: "Harley Davidson",
	model: "Sportster",
	year: 2021,
	weight: 500,
	topSpeed: 125,
	wheels: motorbike1Wheels
});

// push vehicles to array
vehicles.push(truck1);
vehicles.push(car1);
vehicles.push(motorbike1);

// create a new instance of the Cli class
const cli = new Cli(vehicles);

// start the cli
; (async () => {
	await cli.startCli();
})();
