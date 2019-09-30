import React, { Fragment, useState, useContext } from 'react';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

const NuevoProducto = (props) => {

    const [ auth, guardarAuth ] = useContext( CRMContext );

    //producto = state, guardarProducto = setState
    const [ producto, guardarProducto ] = useState({
        nombre: '',
        precio: ''
    });

    // archivo = state, guardarArchivo = setState, se especifica valor iniciar string con ''
    const [archivo, guardarArchivo] = useState('');

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

    // Almacena nuevo producto en la base de datos
    const agregarProducto = async e =>{
        e.preventDefault();

        // Crear un form-data
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        // Almacenar en la BD
        try {
            const res = await clienteAxios.post('/productos', formData, {
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
                    title: 'Agregado correctamente',
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

    // Validar formulario, aquí puedes verificar tipos de datos, regExp, etc.
    const validarProducto = () => {
        const {nombre, precio} = producto;

        // Revisar que las propiedades del objeto tengan contenido
        let valido = !nombre.length || !precio.length || !archivo;

        // return true o false dependiendo de la condición
        return valido;
    }

    // Verificar si está autenticado el usuario
    if(!auth.auth && (localStorage.getItem('token') === auth.token)) return props.history.push('/iniciar-sesion');

    return ( 
        <Fragment>
            <h2>Nuevo producto</h2>

            <form
                onSubmit={agregarProducto}
            >
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="nombre"
                        onChange={leerInformacionProducto}
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
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
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
                        value="Agregar Producto"
                        disabled={validarProducto()}
                        />
                </div>
            </form>
        </Fragment>
     );
}
 
export default withRouter(NuevoProducto);