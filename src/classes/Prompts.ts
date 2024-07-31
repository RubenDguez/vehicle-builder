import Car from "./Car.js";
import Motorbike from "./Motorbike.js";
import Truck from "./Truck.js";

export default class Prompts {
    public static chooseVehicle(vehicles: Array<Car | Truck | Motorbike>) {
        return [
            {
                type: 'list',
                name: 'selectedVehicleVin',
                message: 'Select a vehicle to perform an action on',
                choices: vehicles.map((vehicle) => {
                    return {
                        name: `${vehicle.vin} -- ${vehicle.make} ${vehicle.model}`,
                        value: vehicle.vin,
                    };
                }),
            },
        ]
    }

    private static defaultCreate() {
        return [
            {
                type: 'input',
                name: 'color',
                message: 'Enter Color',
            },
            {
                type: 'input',
                name: 'make',
                message: 'Enter Make',
            },
            {
                type: 'input',
                name: 'model',
                message: 'Enter Model',
            },
            {
                type: 'input',
                name: 'year',
                message: 'Enter Year',
            },
            {
                type: 'input',
                name: 'weight',
                message: 'Enter Weight',
            },
            {
                type: 'input',
                name: 'topSpeed',
                message: 'Enter Top Speed',
            },
        ]
    }

    public static createVehicle() {
        return [
            {
                type: 'list',
                name: 'vehicleType',
                message: 'Select a vehicle type',
                choices: ['Car', 'Truck', 'Motorbike'],
            },
        ]
    }

    public static createCar() {
        return [...Prompts.defaultCreate()]
    }

    public static createTruck() {
        return [
            ...Prompts.defaultCreate(),
            {
                type: 'input',
                name: 'towingCapacity',
                message: 'Enter Towing Capacity',
            },
        ]
    }

    public static createMotorbike() {
        return [
            ...Prompts.defaultCreate(),
            {
                type: 'input',
                name: 'frontWheelDiameter',
                message: 'Enter Front Wheel Diameter',
            },
            {
                type: 'input',
                name: 'frontWheelBrand',
                message: 'Enter Front Wheel Brand',
            },
            {
                type: 'input',
                name: 'rearWheelDiameter',
                message: 'Enter Rear Wheel Diameter',
            },
            {
                type: 'input',
                name: 'rearWheelBrand',
                message: 'Enter Rear Wheel Brand',
            },
        ]
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
        ]
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
        ]

        if (vehicle instanceof Truck) choices.unshift('Tow');
        if (vehicle instanceof Motorbike) choices.unshift('Wheelie');

        return [
            {
                type: 'list',
                name: 'action',
                message: 'Select an action',
                choices
            },
        ]
    }

    public static startCli() {
        return [
            {
                type: 'list',
                name: 'CreateOrSelect',
                message:
                    'Would you like to create a new vehicle or perform an action on an existing vehicle?',
                choices: ['Create a new vehicle', 'Select an existing vehicle'],
            },
        ]
    }
}
