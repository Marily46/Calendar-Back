/**Event Routes
 * /api/events
 */

const { Router } = require('express');
const { validatorJWT } = require('../middlewares/validator-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/field-validator')
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');

const router = Router();

//Middleware de validación del JWT
router.use( validatorJWT );

// get events
router.get('/', getEventos );

//create events
router.post(
    '/',
    [
        check('title','the Title is required').not().isEmpty(),
        check('start','Date start is required').custom( isDate ),
        check('end','Date end is required').custom( isDate ),
        validarCampos
    ],
    crearEvento
);

//update event
router.put('/:id', actualizarEvento );

//delete event
router.delete('/:id', eliminarEvento );

module.exports = router;