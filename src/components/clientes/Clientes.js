import React, { useEffect, useState, useContext, Fragment } from 'react';
import Spinner from '../layout/Spinner';
import { Link, withRouter } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext'; // Importar el context

// Importart cliente axios
import clienteAxios from '../../config/axios';

// Importar componente cliente
import Cliente from './Cliente';

const Clientes = (props) => {
    // Utilizar valores del context
    const [ auth ] = useContext(CRMContext);

    // Trabajar con el state con array destroctoring
    // clientes = state
    // guardarClientes = function para guardar el state
    const [ clientes, guardarClientes ] = useState([]);

    // use effect es similar a componentDiMount y willmount
    // se carga en automático, recomendable llamar métodos
    // Se utiliza cuando se requiere una acción al cargar o exista algún cambio
    useEffect( () => {
        if(auth.token !== ''){
            // Query a la API - puede ir aquí o dentro del useEffect()
            const consultarAPI = async () => {
                try {
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });

                    // Colocar el resultado en el state
                    guardarClientes(clientesConsulta.data);

                } catch (error) {
                    // Error con la autorizaci´´on
                    if(error.response.status === 500){
                        props.history.push('/iniciar-sesion');
                    }
                }
            }
            consultarAPI();

        } else {
            props.history.push('/iniciar-sesion');
        }

    }, [clientes] ); // [] para ejecutarse una vez

    // Si el state de auth está en false
    if(!auth.auth && localStorage.getItem('token') === auth.token) props.history.push('/iniciar-sesion');

    // Spinner de carga
    if(!clientes.length) return <Spinner/>

    return ( 
        <Fragment>
            <h2>Clientes ({clientes.length})</h2>
            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>
            <ul className="listado-clientes">
                { 
                    clientes.map(cliente => (
                        <Cliente 
                            key = {cliente._id}
                            cliente = {cliente} 
                        />
                    ))
                }
            </ul>
        </Fragment>
     );
}
 
export default withRouter(Clientes);