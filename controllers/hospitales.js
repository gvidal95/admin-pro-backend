const {response} = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {
    
    try {
        const hospitales = await Hospital.find()
                .populate( 'usuario', 'nombre img');
        return res.json({
            ok: true,
            hospitales
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Ha ocurrido un error'
        })
    }
}

const crearHospital = async(req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDB =  await hospital.save();

        return res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Ha ocurrido un error'
        })
    }
}

const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    })
}

const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarHospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}