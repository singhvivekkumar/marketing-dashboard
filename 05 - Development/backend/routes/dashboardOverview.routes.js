const express = require('express');

// const flightController = require('../../controllers/flight-controller')
// const {FlightMiddleware} = require('../../middlewares/index');

const flightRouter = express.Router();


flightRouter.post('/', FlightMiddleware.validateCreateFlight, flightController.create);
flightRouter.patch('/:id', flightController.update);
flightRouter.get('/:id', flightController.get);
flightRouter.delete('/:id', flightController.destroy);
flightRouter.get('/', flightController.getAll);

module.exports = flightRouter;