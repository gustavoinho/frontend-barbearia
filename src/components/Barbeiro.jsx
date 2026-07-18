import { useEffect, useState } from "react";
import React from 'react';
import api from "../api";

function Barbeiro(){

const [agendamentos,setAgendamentos] = useState([]);
const [dataSelecionada,setDataSelecionada] = useState("");
const [senha,setSenha] = useState("");
const [logado,setLogado] = useState(false);
const [mostrarSenha,setMostrarSenha] = useState(false);
const [fechado,setFechado] = useState(false);


function entrar(){

if(senha === "1234"){
setLogado(true);
setSenha("");
}else{
alert("Senha incorreta");
}

}



function carregarAgendamentos(){

api.get("/agendamentos")
.then(res=>{

setAgendamentos(res.data);


if(res.data.length > 0 && !dataSelecionada){

setDataSelecionada(res.data[0].data);

}

})

.catch(()=>{

alert("Erro ao carregar agenda");

});

}




function alterarFechado(){

const novoEstado = !fechado;


api.put("/configuracao",{

fechado: novoEstado

})

.then(()=>{

setFechado(novoEstado);

})

.catch(()=>{

alert("Erro ao alterar funcionamento");

});


}

useEffect(()=>{

carregarAgendamentos();


api.get("/configuracao")
.then(res=>{

setFechado(res.data.fechado);

});


},[]);





function atualizarStatus(id,status){

const confirmar = window.confirm(

`Tem certeza que deseja ${
status === "confirmado"
? "confirmar"
: "cancelar"
} este agendamento?`

);


if(!confirmar){
return;
}



api.delete(`/agendamentos/${id}`)

.then(()=>{

setAgendamentos(prev=>
prev.filter(item=>item.id !== id)
);


})

.catch(err=>{

alert(
err.response?.data?.erro ||
"Erro ao remover agendamento"
);

});


}





const agendaDoDia = agendamentos.filter(item=>{

return item.data === dataSelecionada;

});





return(

<div>


{!logado ? (


<div
style={{
height:"100vh",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center"
}}
>


<h1>
Login do Barbeiro
</h1>


<div
style={{
position:"relative",
width:"300px"
}}
>


<input

type={mostrarSenha ? "text":"password"}

placeholder="Digite a senha"

value={senha}

onChange={(e)=>setSenha(e.target.value)}

style={{
width:"100%",
padding:"12px",
paddingRight:"45px",
boxSizing:"border-box"
}}

/>



<span

onClick={()=>setMostrarSenha(!mostrarSenha)}

style={{

cursor:"pointer",
position:"absolute",
right:"12px",
top:"50%",
transform:"translateY(-50%)",
display:"flex"

}}

>


<svg

width="22"

height="22"

viewBox="0 0 24 24"

fill="none"

stroke="currentColor"

strokeWidth="2"

>


{
mostrarSenha ?

<>

<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.06"/>

<path d="M1 1l22 22"/>

</>

:

<>

<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>

<circle cx="12" cy="12" r="3"/>

</>

}


</svg>


</span>


</div>



<button onClick={entrar}>
Entrar
</button>


</div>


)

:

(


<div>


<h1>
Agenda do Barbeiro
</h1>



<div style={{marginBottom:40}}>


<h2>
Controle da barbearia
</h2>



<button

onClick={alterarFechado}

style={{

background: fechado ? "#f44336" : "#4caf50",

color:"white"

}}

>


{
fechado
?
"🔴 Fechado hoje"
:
"🟢 Aberto"
}


</button>


</div>






<h2>
Escolha o dia:
</h2>



<input

type="date"

value={dataSelecionada}

onChange={(e)=>setDataSelecionada(e.target.value)}

 />





{
agendaDoDia.length===0 && (

<p>
Nenhum cliente marcado para esse dia.
</p>

)

}





{

agendaDoDia.map(item=>(


<div

key={item.id}

className="card"

>



<p>
<strong>Cliente:</strong> {item.cliente}
</p>



<p>

<strong>Telefone:</strong>

<a

href={
item.telefone
?
`https://wa.me/55${item.telefone}`
:
"#"
}

target="_blank"

rel="noopener noreferrer"

>

{item.telefone}

</a>


</p>



<p>
<strong>Serviço:</strong> {item.servico}
</p>



<p>

<strong>Data:</strong>

{
item.data
?
new Date(item.data+"T00:00:00").toLocaleDateString("pt-BR")
:
"-"
}

</p>



<p>
<strong>Horário:</strong> {item.horario}
</p>



<p>

<strong>Pagamento:</strong>

{

item.pagamento==="pix"

?

"PIX"

:

item.pagamento==="local"

?

"Pagar no local"

:

"Não informado"

}

</p>



<p>
<strong>Status:</strong> {item.status}
</p>



<p>
<strong>R$ {item.total || 0}</strong>
</p>




<button

onClick={()=>atualizarStatus(item.id,"confirmado")}

style={{

background:"#4caf50",

color:"white"

}}

>

Confirmar

</button>



<button

onClick={()=>atualizarStatus(item.id,"cancelado")}

style={{

background:"#f44336",

color:"white"

}}

>

Cancelar

</button>



</div>


))


}



</div>


)


}



</div>


);}
export default Barbeiro;