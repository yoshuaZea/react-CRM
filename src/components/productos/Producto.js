import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

// const Producto = (props) => {
// Usar un destrotoring para no usar props
const Producto = (props) => {
    
    const [ auth ] = useContext( CRMContext );
    
    const { _id, nombre, precio, imagen } = props.producto;

    // Eliminar producto
    const eliminarProducto = (idProducto) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Un producto eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                clienteAxios.delete(`/productos/${idProducto}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }).then(res => {
                        if(res.status === 200){
                            Swal.fire(
                                'Eliminado!',
                                res.data.mensajes,
                                'success'
                            )
                        }
                });
            }
        });
    }

    return ( 

        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{ nombre }</p>
                <p className="precio">$ { precio } </p>
                {   imagen ? (<img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt=".." />) : null }
            </div>
            <div className="acciones">
                <Link to={`/productos/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>

                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => eliminarProducto(_id) }
                >
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
     );
}
 
export default Producto;