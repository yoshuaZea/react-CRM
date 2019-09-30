import React, { Fragment, useState, useEffect, useContext } from 'react';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

// Importart cliente axios
import clienteAxios from '../../config/axios';

// Importar producto
import Producto from './Producto';

const Productos = (props) => {
    
    const [ auth ] = useContext( CRMContext );

    // producto = state, guardarProductos = función para guardar el state
    const [ productos, guardarProductos ] = useState([]);

    // usseEffect para consultar la API cuando cargue
    useEffect( () => {
        if(auth.token !== ''){
            // Query a la API
            const consultarAPI = async () => {
                try{
                    const productosConsulta = await clienteAxios.get('/productos', {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });

                    guardarProductos(productosConsulta.data);

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
        
    }, [productos]);

    // Si el state de auth está en false
    if(!auth.auth && localStorage.getItem('token') === auth.token) props.history.push('/iniciar-sesion');

    // Spinner de carga
    if(!productos.length) return <Spinner/>

    return ( 
        <Fragment>
            <h2>Productos ({productos.length})</h2>

            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> 
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                { 
                    productos.map(producto => (
                        <Producto 
                            key={producto._id}
                            producto={producto}
                        />
                    ))
                }
                
            </ul>
        </Fragment>
     );
}
 
export default Productos;