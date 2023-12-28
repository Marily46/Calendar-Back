const { response } = require("express");
const EventCreate = require('../models/EventCreate');

const getEventos = async ( req, res = response ) => {

    const eventos = await EventCreate.find();
    
    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async ( req, res = response ) => {

    const Evento = new EventCreate( req.body);
    console.log("Evento >>> ", JSON.stringify(Evento, null, 4));
    
    try {

        Evento.user = req.uid;

        const eventoSave = await Evento.save();

        res.json({
            ok: true,
            Evento: eventoSave
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrator'
        })
    }

}
const actualizarEvento = async ( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await EventCreate.findById( eventoId );

        if ( !evento ) {
            return res.status(400).json({
                ok: false,
                msg: "event no existe por ese id"
            })
        }
        
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de editar'
            })
        }

        const newEvento = {
            ...req.body,
            user: uid,
        }

        const eventUpdate = await EventCreate.findByIdAndUpdate( eventoId, newEvento, {new: true} );

        res.json({
            ok: true,
            evento: eventUpdate
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrator'
        })
    }

}

const eliminarEvento = async ( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await EventCreate.findById( eventoId );

        if ( !evento ) {
            return res.status(400).json({
                ok: false,
                msg: "event no existe por ese id"
            })
        }
        
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'no tiene privilegio de eliminar'
            })
        }

        await EventCreate.findByIdAndDelete( eventoId );

        res.json({
            ok: true
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrator'
        })
    }
    
    res.json({
        ok: true,
        msg: 'eliminarEvento'
    })
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
}