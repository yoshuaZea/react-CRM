import React, { Fragment, useContext } from 'react';

// npm audit fix - corregir problemas de versiones

// Routing
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

/** Layout */
import Header from './components/layout/Header';
import Navegacion from './components/layout/Navegacion';

/** Componetes */
import Clientes from './components/clientes/Clientes';
import NuevoCliente from './components/clientes/NuevoCliente';
import EditarCliente from './components/clientes/EditarCliente';

import Pedidos from './components/pedidos/Pedidos';
import NuevoPedido from './components/pedidos/NuevoPedido';

import Productos from './components/productos/Productos';
import NuevoProducto from './components/productos/NuevoProducto';
import EditarProducto from './components/productos/EditarProducto';

import Login from './components/auth/Login';

// Importart el Context
import { CRMContext, CRMProvider } from './context/CRMContext';

function App() {
  // Utilizar context en el componente para asegurar los endpoints
  const [auth, guardarAuth] = useContext(CRMContext);

  // console.log(process.env.REACT_APP_BACKEND_URL);

  return (
    <Router>
      <Fragment>
        <CRMProvider value={[auth, guardarAuth]}>
          <Header/>
          <div className="grid contenedor contenido-principal">
            <Navegacion/>

            <main className="caja-contenido col-9">
              <Switch>
                <Route exact path="/" component={Clientes} />
                <Route exact path="/clientes/nuevo" component={NuevoCliente} />
                <Route exact path="/clientes/editar/:id" component={EditarCliente} />

                <Route exact path="/productos" component={Productos} />
                <Route exact path="/productos/nuevo" component={NuevoProducto} />
                <Route exact path="/productos/editar/:id" component={EditarProducto} />

                <Route exact path="/pedidos" component={Pedidos} />
                <Route exact path="/pedidos/nuevo/:idCliente" component={NuevoPedido} />

                <Route exact path="/iniciar-sesion" component={Login} />
              </Switch>
            </main>

          </div>
        </CRMProvider>
      </Fragment>
    </Router>
  );
}

// Un componente es una pieza de código que puedes reutilizar
export default App;
