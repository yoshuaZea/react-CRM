import React, { useEffect, useState, useContext, Fragment } from 'react';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';
import Swal from 'sweetalert2';

// Componentes
import DetallesPedidos from './DetallesPedidos';

const Pedidos = (props) => {

    const [ auth ] = useContext( CRMContext );

    const [pedidos, guardarPedidos] = useState([]);

    useEffect(() => {
        if(auth.token !== ''){
            const consultarAPI = async () => {
                try{
                    const resultado = await clienteAxios.get('/pedidos' , {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
        
                    guardarPedidos(resultado.data);

                } catch (error) {
                    if(error.response.status === 500){
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error!',
                            text: 'Usuario no autenticado'
                        });

                        props.history.push('/iniciar-sesion');
                    }
                }
            }
            
            consultarAPI();

        } else {
            props.history.push('/iniciar-sesion');
        }


    }, [pedidos]); // [] Dependencias

    // Si el state de auth está en false
    // if(!auth.auth && localStorage.getItem('token') === auth.token) props.history.push('/iniciar-sesion');

    return ( 
        <Fragment>
            <h2>Pedidos ({pedidos.length})</h2>
            <ul className="listado-pedidos">
                {
                    pedidos.map(pedido => (
                        <DetallesPedidos
                            key={pedido._id}
                            pedido={pedido}
                        />
                    ))
                }
            </ul>
        </Fragment>
     );
}
 
export default Pedidos;