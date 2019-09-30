import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext'; // Importar el context

const Cliente = ({cliente}) => {

    const [ auth ] = useContext(CRMContext);

    // Array destructoring
    const { _id, nombre, apellidos, empresa, email, telefono } = cliente;

    // Función para eliminar cliente
    const eliminarCliente = (idCliente) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Un cliente eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                clienteAxios.delete(`/clientes/${idCliente}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                }).then(res => {
                        if(res.status === 200){
                            Swal.fire(
                                'Eliminado!',
                                res.data.mensaje,
                                'success'
                            )
                        }
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
        });
    }

    return ( 
        <li className="cliente">
            <div className="info-cliente">
                <p className="nombre">{nombre} {apellidos}</p>
                <p className="empresa">{empresa}</p>
                <p>{email}</p>
                <p>{telefono}</p>
            </div>
            <div className="acciones">
                <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Cliente
                </Link>
                <Link to={`/pedidos/nuevo/${_id}`} className="btn btn-amarillo">
                    <i className="fas fa-plus"></i>
                    Nuevo pedido
                </Link>
                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => eliminarCliente(_id)}
                >
                    <i className="fas fa-times"></i>
                    Eliminar Cliente
                </button>
            </div>
        </li>
     );
}
 
export default Cliente;