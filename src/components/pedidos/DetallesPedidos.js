import React, { useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { CRMContext } from '../../context/CRMContext';

const DetallesPedido = ({pedido}) => {

    const [ auth ] = useContext(CRMContext);

    const {cliente} = pedido;

    const eliminarPedido = (idPedido) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Un pedido eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                clienteAxios.delete(`/pedidos/${idPedido}`, {
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
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">ID: {pedido._id} </p>
                <p className="nombre">Cliente: {cliente.nombre} {cliente.apellidos} </p>

                <div className="articulos-pedido">
                    <p className="productos">Artículos Pedido: </p>
                    <ul>
                        {
                            pedido.pedido.map(articulo => (
                                <li key={pedido._id + articulo.producto._id}>
                                    <p> {articulo.producto.nombre} </p>
                                    <p> Precio: $ {articulo.producto.precio} </p>
                                    <p> Cantidad: {articulo.cantidad} </p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <p className="total">Total: $ {pedido.total} </p>
            </div>
            <div className="acciones">
                <button 
                    type="button" 
                    className="btn btn-rojo btn-eliminar"
                    onClick={() => eliminarPedido(pedido._id)} 
                >
                    <i className="fas fa-times"></i>
                    Eliminar Pedido
                </button>
            </div>
        </li>
     );
}
 
export default DetallesPedido;