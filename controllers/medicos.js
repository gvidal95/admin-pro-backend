const {response} = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
    try {
        const medicos = await Medico.find()
                .populate( 'usuario', 'nombre img')
                .populate( 'hospital', 'nombre img' );
        return res.json({
            ok: true,
            medicos
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Ha ocurrido un error'
        })
    }
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDB =  await medico.save();

        return res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Ha ocurrido un error'
        })
    }
}

const actualizarMedico = async(req, res = response) => {
    const uid = req.uid;
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if(!medico){
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encotrado por id'
            }) 
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true})


        return res.json({
            ok: true,
            msg: 'Médico actualizado',
            medico: medicoActualizado
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Ha ocurrido un error'
        })
    }
}

const borrarMedico = async(req, res = response) => {
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if(!medico){
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encotrado por id'
            }) 
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'ha ocurrido un error'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}