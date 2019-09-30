import React, { Fragment, useState, useEffect, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

const EditarCliente = (props) => {

    const [ auth, guardarAuth ] = useContext( CRMContext );

    //Obtener el id
    const { id } = props.match.params;

    // cliente = state, datosCliente = función para guardar state
    const [cliente, datosCliente] = useState({
        _id: '',
        nombre: '',
        apellidos: '',
        empresa: '',
        email: '',
        telefono: ''
    });

    // Leer datos del form
    const actualizarState = e => {
        // Almacenar lo que el usuario escribe en el state
        datosCliente({
            // Obtener una copia del state actual, para evitar que se borren los datos
            ...cliente, 
            [e.target.name] : e.target.value
        });
        
        // console.log(cliente);
    }

    // use effect es similar a componentDiMount y willmount
    // se carga en automático, recomendable llamar métodos
    // Se utiliza cuando se requiere una acción al cargar o exista algún cambio
    useEffect( () => {
        if(!auth.auth !== ''){
            // Query a la API
            const consultarAPI = async () => {
                try{
                    const clientesConsulta = await clienteAxios.get(`/clientes/${id}`,{
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    // console.log(clientesConsulta.data);
                    // Colocar datos en el state
                    datosCliente(clientesConsulta.data);

                } catch (error) {
                    if(error.response.status === 500){
                        props.history.push('/iniciar-sesion');
                    }
                }
            }
            
            consultarAPI();

        } else {
            props.history.push('/iniciar-sesion');
        }
        
    }, [id] ); // [] para ejecutarse una vez

    // Envía una petición por axios para actualizar cliente
    const actualizarCliente = e => {
        e.preventDefault();

        // Enviar petición por axios
        clienteAxios.put(`/clientes/${id}`, cliente, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        }).then(res => {
            if(res.data.code === 11000){
                Swal.fire({
                    type: 'error',
                    title: 'Hugo un error',
                    text: 'El correo ya está registrado'
                });

            } else {
                Swal.fire({
                    title: 'Correcto',
                    text: 'Se actualizó el cliente correctamente',
                    type: 'success'
                });
            }

            // Redireccionar con props
            props.history.push('/');
        });
    }

    // Validar formulario, aquí puedes verificar tipos de datos, regExp, etc.
    const validarCliente = () => {
        const {nombre, apellidos, empresa, email, telefono} = cliente;

        // Revisar que las propiedades del objeto tengan contenido
        let valido = !nombre.length || !apellidos.length || !empresa.length || !email.length || !telefono.length;

        // return true o false dependiendo de la condición
        return valido;
    }

    return ( 
        <Fragment>
            <h2>Editar cliente</h2>

            <form
                onSubmit={actualizarCliente} // Sin parentesis espera a que se detone el evento
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Cliente" 
                        name="nombre"
                        onChange={actualizarState}
                        value={cliente.nombre}
                    />
                </div>

                <div className="campo">
                    <label>Apellidos:</label>
                    <input 
                        type="text" 
                        placeholder="Apellido Cliente" 
                        name="apellidos" 
                        onChange={actualizarState}
                        value={cliente.apellidos}
                    />
                </div>
            
                <div className="campo">
                    <label>Empresa:</label>
                    <input 
                        type="text" 
                        placeholder="Empresa Cliente" 
                        name="empresa" 
                        onChange={actualizarState}
                        value={cliente.empresa}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="Email Cliente" 
                        name="email" 
                        onChange={actualizarState}
                        value={cliente.email}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input 
                        type="text" 
                        placeholder="Teléfono Cliente" 
                        name="telefono" 
                        onChange={actualizarState}
                        value={cliente.telefono}
                    />
                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul" 
                        value="Guardar Cambios" 
                        disabled={validarCliente()} //Con () Se ejecuta una vez que el componente cambia
                    />
                </div>
            </form>
        </Fragment>
     );
}

// HOC (High Order Component), es una función que toma un componente y retorna un nuevo componene
export default withRouter(EditarCliente);