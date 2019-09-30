import React, {Fragment, useState, useEffect, useContext} from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { CRMContext } from '../../context/CRMContext';

const EditarProducto = (props) => {

    const [ auth ] = useContext( CRMContext );

    // Obtener el ID del producto
    const { id } = props.match.params;

    // producto = state, funcion para actualizar
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    // archivo = state, guardarArchivo = setState, se especifica valor iniciar string con ''
    const [archivo, guardarArchivo] = useState('');
    
    // Cargar componente
    useEffect(() => {
        if(auth.token !== ''){
            // Consulta la API
            const consultarAPI = async () => {
                try{
                    const productoConsulta = await clienteAxios.get(`/productos/${id}`, {
                        headers: {
                            Authorization: `Bearer ${auth.token}`
                        }
                    });
                    // console.log(productoConsulta);
                    guardarProducto(productoConsulta.data);
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
    }, []);

    // Leer datos del formulario
    const leerInformacionProducto = e => {
        guardarProducto({
            // Obtener una copia del state y agregar el nuevo
            ...producto,
            [e.target.name]: e.target.value
        });
    }

    // Colocar la imagen en el state
    const leerArchivo = e => {
    guardarArchivo(e.target.files[0]);
    }

    // Extraer los valores del state
    const { nombre, precio, imagen } = producto;

    // Editar un producto
    const editarProducto = async (e) => {
        e.preventDefault();

        // Crear un form-data
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // Almacenar en la BD
        try {
            const res = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    'Content-Type' : 'multipart/form-data'
                }
            });

            // console.log(res);

            // Lanzar alerta
            if(res.status === 200){
                Swal.fire({
                    type: 'success',
                    title: 'Actualizado correctamente',
                    text: res.data.mensaje
                })
            }

            // Redireccionar
            props.history.push('/productos');
            
        } catch (error) {
            console.log(error);

            //Lanzar error
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Vuelve a intentarlo más tarde'
            })
        }
    }
    
    if(!nombre) return <Spinner />

    return ( 
        <Fragment>
            <h2>Editar producto</h2>

            <form
                onSubmit={editarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
                        defaultValue={nombre}
                    />
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input 
                        type="number" 
                        name="precio" min="0.00" 
                        step="1" 
                        placeholder="Precio"
                        onChange={leerInformacionProducto}
                        defaultValue={precio}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    { 
                        imagen ? ( <img src={`${process.env.REACT_APP_BACKEND_URL}/${imagen}`} alt="..." width="300"/> ) : null
                    }
                    <input 
                        type="file" 
                        name="imagen"
                        onChange={leerArchivo}
                    />

                </div>

                <div className="enviar">
                    <input 
                        type="submit" 
                        className="btn btn-azul"
                        value="Editar Producto"
                        />
                </div>
            </form>
        </Fragment>
     );
}
 
export default withRouter(EditarProducto);