const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuarioDB = await Usuario.findOne({ email });

        //Verificar email
        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        //Verificar contrasena
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if( !validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            })
        }

        //Generar el token -JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuarioDB.role)
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const {name, email, picture } = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});

        let usuario;

        if(!usuarioDB){
            //Si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardad en DB
        await usuario.save();

        //Generar el token -JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd(usuario.role)
        });

    }catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }

}

const renewToken = async(req, res = response) => {
    const uid = req.uid;

    //Generar el token -JWT
    const token = await generarJWT( uid );

    //Obtener inf del usuario

    const usuarioDB = await Usuario.findById( uid );
    // console.log(usuarioDB);

    res.json({
        ok: true,
        token,
        usuario: usuarioDB,
        menu: getMenuFrontEnd(usuarioDB.role)
    })
}
module.exports = {
    login,
    googleSignIn,
    renewToken
}