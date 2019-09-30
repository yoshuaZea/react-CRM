import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';

// Context
import { CRMContext } from '../../context/CRMContext';

const Login = (props) => {

    // Auth y token
    const [auth, guardarAuth] = useContext(CRMContext);

    // State con datos del formulario
    const [credenciales, guardarCredenciales] = useState({});

    // Almacenar lo que el usuario escribe en el State
    const leerDatos = (e) =>{
        guardarCredenciales({
            ...credenciales,
            [e.target.name] : e.target.value
        });
    }

    // Iniciar sesión en el servidor
    const iniciarSesion = async (e) => {
        e.preventDefault();
        // console.log(credenciales);
        try {
            const respuesta = await clienteAxios.post('/iniciar-sesion', credenciales);

            if(respuesta.status === 200){
                const { token } = respuesta.data;
                localStorage.setItem('token', token);

                // Colocar en el state el context de la sesión
                guardarAuth({
                    token,
                    auth: true
                });

                // Alerta
                Swal.fire({
                    type: 'success',
                    title: 'Login correcto!',
                    text: 'Has iniciado sesión',
                });

                // Redireccionar
                props.history.push('/');
            }

        } catch (error) {
            // console.log(error);
            if(error.response){
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.mensaje
                })
            } else {
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'Hubo un error (ERR-1)'
                })
            }
        }
    }

    return ( 
        <div className="login">
            <h2>Iniciar sesión</h2>

            <div className="contenedor-formulario">
                <form
                    onSubmit={iniciarSesion}
                >
                    <div className="campo">
                        <label htmlFor="text">Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            placeholder="Ingresa tu correo" 
                            required
                            onChange={leerDatos}
                        />
                    </div>
                    <div className="campo">
                        <label htmlFor="text">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Ingresa tu contraseña" 
                            required
                            onChange={leerDatos}
                        />
                    </div>

                    <input 
                        type="submit"
                        className="btn btn-verde btn-block"
                        defaultValue="Iniciar sesión"
                    />
                </form>
            </div>
        </div>
     );
}
 
export default withRouter(Login);