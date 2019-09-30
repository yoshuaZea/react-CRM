import React from 'react';

const FormBuscarProducto = (props) => {
    return ( 
        <form
            onSubmit={props.buscarProducto}
        >
            <legend>Busca un Producto y agrega una cantidad</legend>

            <div className="campo">
                <label>Productos:</label>
                <input 
                    type="text" 
                    placeholder="Nombre Productos" 
                    name="productos" 
                    onChange={props.leerDatosBusqueda}
                />
            </div>

            <input 
                type="submit"
                className="btn btn-azul btn-block"
                value="Buscar producto"
            />
        </form>
    );
}
 
export default FormBuscarProducto;