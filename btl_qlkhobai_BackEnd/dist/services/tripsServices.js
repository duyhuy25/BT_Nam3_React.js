"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTripService = exports.deleteTripService = exports.updateTripService = exports.addTripService = exports.fetchTrip = void 0;
const tripsRepositories_1 = require("../repositories/tripsRepositories");
const fetchTrip = async () => {
    return await (0, tripsRepositories_1.getAllTrip)();
};
exports.fetchTrip = fetchTrip;
const addTripService = async (data) => {
    return await (0, tripsRepositories_1.createTrip)(data);
};
exports.addTripService = addTripService;
const updateTripService = async (id, data) => {
    return await (0, tripsRepositories_1.updateTripById)(id, data);
};
exports.updateTripService = updateTripService;
const deleteTripService = async (id) => {
    return await (0, tripsRepositories_1.deleteTripById)(id);
};
exports.deleteTripService = deleteTripService;
const searchTripService = async (keyword) => {
    return await (0, tripsRepositories_1.searchTripByKeyword)(keyword);
};
exports.searchTripService = searchTripService;
