import React, { Fragment, useState, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

const NuevoCliente = ({history}) => {

    const [ auth, guardarAuth ] = useContext( CRMContext );

    // cliente = state, guardarCliente = función para guardar state
    const [cliente, guardarCliente] = useState({
        nombre: '',
        apellidos: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    // Leer datos del form
    const actualizarState = e => {
        // Almacenar lo que el usuario escribe en el state
        guardarCliente({
            // Obtener una copia del state actual, para evitar que se borren los datos
            ...cliente, 
            [e.target.name] : e.target.value
        });
        
        // console.log(cliente);
    }

    // Validar formulario, aquí puedes verificar tipos de datos, regExp, etc.
    const validarCliente = () => {
        const {nombre, apellidos, empresa, email, telefono} = cliente;

        // Revisar que las propiedades del objeto tengan contenido
        let valido = !nombre.length || !apellidos.length || !empresa.length || !email.length || !telefono.length;

        // return true o false dependiendo de la condición
        return valido;
    }

    // Añadir cliente en la REST API
    const agregarCliente = (e) => {
        e.preventDefault();
        
        // Enviar petición a axios
        clienteAxios.post('/clientes', cliente, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            .then(res => {
                // console.log(res);
                // Validar si hay errores de mongo
                if(res.data.code === 11000){
                    Swal.fire({
                        type: 'error',
                        title: 'Hugo un error',
                        text: 'El cliente ya está registrado'
                    });

                } else {
                    Swal.fire({
                        title: 'Se agregó el cliente!',
                        text: res.data.mensaje,
                        type: 'success'
                    });
                }

                // Redireccionar con withRouter
                history.push('/');
            }).catch(error => {
                if(error.response.status === 401){
                    Swal.fire({
                        type: 'error',
                        title: 'Hugo un error',
                        text: 'Usuario no autenticado'
                    });
                } else {
                    Swal.fire({
                        type: 'error',
                        title: 'Hugo un error',
                        text: 'Vuelve a intentarlo'
                    });
                }
            });
    }
    
    // Verificar si el usuario está autenticado
    if(!auth.auth) history.push('/iniciar-sesion');

    return ( 
        <Fragment>
            <h2>Nuevo cliente</h2>

            <form onSubmit={agregarCliente}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Apellidos:</label>
                    <input 
                        type="text" 
                        placeholder="Apellido Cliente" 
                        name="apellidos" 
                        onChange={actualizarState}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input 
                        type="text" 
                        placeholder="Empresa Cliente" 
                        name="empresa" 
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Email Cliente" 
                        name="email" 
                        onChange={actualizarState}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input 
                        type="text" 
                        placeholder="Teléfono Cliente" 
                        name="telefono" 
                        onChange={actualizarState}
                    />
                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Agregar Cliente" 
                        disabled={validarCliente()} //Se ejecuta una vez que el componente cambia
                    />
                </div>
            </form>
        </Fragment>
     );
}

// HOC (High Order Component), es una función que toma un componente y retorna un nuevo componene
export default withRouter(NuevoCliente);