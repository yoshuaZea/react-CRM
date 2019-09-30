import React, { Fragment, useState, useEffect, useContext } from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

// Componentes
import FormBuscarProducto from './FormBuscarProducto';
import FormCantidadProducto from './FormCantidadProducto';

import { CRMContext } from '../../context/CRMContext';

const NuevoPedido = (props) => {

    const [ auth ] = useContext( CRMContext );

    // Extraer ID de cliente
    const { idCliente } = props.match.params;

    // State
    const [cliente, guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);

    useEffect(() => {
        const consultarAPI = async () => {
            try{
                // Consultar cliente actual
                const resultado = await clienteAxios.get(`/clientes/${idCliente}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                guardarCliente(resultado.data);

            } catch (error) {
                if(error.response.status === 500){
                    props.history.push('/iniciar-sesion');
                }
            }
            
        }
        
        consultarAPI();

        // Cada que productos cambie, actualiza el total
        actualizarTotal();

    }, [productos]); // Pasando la dependencia de productos, para que cada que cambie se ejecute el método actualizar total

    // Buscar producto
    const buscarProducto = async (e) => {
        e.preventDefault();

        try{
            // Obtener los productos de la búsqueda
            const resultadoBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`, idCliente, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });

            console.log(resultadoBusqueda);
    
            // Si no hay resultados una alerta, contrario agregar al State
            if(resultadoBusqueda.data[0]){
                let productoResultado = resultadoBusqueda.data[0];
    
                // Agregar la llave producto (copia de id)
                productoResultado.producto = resultadoBusqueda.data[0]._id;
                productoResultado.cantidad = 0;
    
                // Poner el producto en el State, una copia y agregar el nuevo
                guardarProductos([...productos, productoResultado]);
    
            } else {
                // No hay resultados
                Swal.fire({
                    type: 'warning',
                    title: 'Sin resultados',
                    text: 'No se encontraron resultados con la coincidencia'
    
                })
            }
            
        } catch (error) {
            if(error.response.status === 500){
                props.history.push('/iniciar-sesion');
            } else if(error.response.status === 401){
                Swal.fire({
                    type: 'warning',
                    title: 'Oops...',
                    text: 'Usuario sin permisos'
                })
            }
        }
    }

    // Almacenar una búsqueda en el State
    const leerDatosBusqueda = (e) => {
        guardarBusqueda(e.target.value);
    }

    // Actualizar cantidad de productos
    const restarProductos = (i) => {
        // Copiar arreglo original del producto para no mutarlo
        const todosProductos = [...productos];

        // Validar si está en cero no puede ser menos
        if(todosProductos[i].cantidad === 0) return;
        
        // Decremento
        todosProductos[i].cantidad--;

        // Almacenar en el state
        guardarProductos(todosProductos);
    }

    const aumentarProductos = (i) => {
        // Copiar arreglo original del producto para no mutarlo
        const todosProductos = [...productos];

        // Incremento
        todosProductos[i].cantidad++;

        // Almacenar en el state
        guardarProductos(todosProductos);

        // Actualizar el total a pagar
        actualizarTotal();
    }

    // Actualizar el total a pagar
    const actualizarTotal = () => {
        // Si el arreglo de productos es igual a 0
        if(productos.length === 0){
            guardarTotal(0);
            return;
        } 

        // Calcular el nuevo total
        let nuevoTotal = 0;

        // Recorrer todos los productos y cantidads
        productos.map(producto => nuevoTotal += (producto.cantidad * producto.precio));

        // Almacenar el total
        guardarTotal(nuevoTotal);
    }

    // Elimina un producto del State
    const eliminarProductoPedido = (id) => {
        // Quitar del arreglo el id a eliminar, lo busca y lo eliminar
        const todosProductos = productos.filter(producto => producto._id !== id);

        // Guardar productos
        guardarProductos(todosProductos);
    }

    // Almacenar el pedido en la base de datos
    const realizarPedido = async(e) => {
        e.preventDefault();

        // Constuir el objet
        const pedido = {
            "cliente" : idCliente,
            "pedido" : productos,
            "total": total
        };

        // Enviar petición a axios para almacenarlos
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${idCliente}`, pedido, {
            headers: {
                Authorization: `Baerer ${auth.token}`
            }
        });

        // Leer resultado
        if(resultado.status === 200){
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: resultado.data.mensaje
            });

        } else {
            // Alerta de error
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Vuelve a intentarlo'
            });
        }

        // Redireccionar
        props.history.push('/pedidos');
    }

    return ( 
        <Fragment>
            <h2>Nuevo pedido</h2>

            <div className="ficha-cliente">
                <h3>Nombre: {cliente.nombre} {cliente.apellidos}</h3>
                <p>Teléfono: {cliente.telefono}</p>
                <p>Correo: {cliente.email} </p>
            </div>
            
            { /* Pasar métodos al componente */ }
            <FormBuscarProducto 
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

            <ul className="resumen">
                { 
                    productos.map((producto, index) => (
                        <FormCantidadProducto 
                            key={producto.producto}
                            producto={producto}
                            restarProductos={restarProductos} // Pasar los métodos al componente
                            aumentarProductos={aumentarProductos} // Pasar los métodos al componente
                            eliminarProductoPedido={eliminarProductoPedido} // Pasar los métodos al componente
                            index={index}
                        />
                    )) 
                }
            </ul>

            <p className="total">Total a pagar: <span>$ {total} </span></p>
            
            {
                total > 0 ? (
                    <form
                        onSubmit={realizarPedido}
                    >
                        <input 
                            type="submit"
                            className="btn btn-verde btn-block"
                            value="Realizar pedido"
                        />
                    </form>
                ) : null
            }

        </Fragment>
    );
}
 
export default withRouter(NuevoPedido);