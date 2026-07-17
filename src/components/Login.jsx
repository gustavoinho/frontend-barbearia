import { useState } from "react";

function Login({onLogin}){

  const [senha,setSenha] = useState("");

  function entrar(){

    if(senha === "1234"){
      onLogin(true);
    }else{
      alert("Senha incorreta");
    }

  }

  return(

    <div>

      <h1>Login Barbeiro</h1>

      <input
      type="password"
      placeholder="Senha"
      value={senha}
      onChange={(e)=>setSenha(e.target.value)}
      />

      <br/>

      <button onClick={entrar}>
        Entrar
      </button>

    </div>

  );

}

export default Login;