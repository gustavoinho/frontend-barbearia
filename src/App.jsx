import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Cliente from "./components/Clientes";
import Barbeiro from "./components/Barbeiro";
import "./style.css";

function App(){

 return(

  <BrowserRouter>

    <Routes>

      <Route path="/" element={<Cliente />} />

      <Route 
 path="/barbeiro" 
 element={<Barbeiro/>}
/>

    </Routes>

  </BrowserRouter>

);

}

export default App;