import { useEffect, useState } from "react";
import React from 'react';
import api from "../api";
import logo from "../imagens/logo.png";
import fund from "../imagens/fund.jfif";
import relogio from "../imagens/relogio.jpg";
import foneb from "../imagens/foneb.jpg";
import livro from "../imagens/livro.jpg";
import pomada from "../imagens/pomada.jpg";
import gel from "../imagens/gel.jpg";
import mino from "../imagens/mino.jpg";

function Cliente(){
const [fechado,setFechado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const horarioRef = React.useRef(null);
const dadosRef = React.useRef(null);
const pagamentoRef = React.useRef(null);
  const [servicos,setServicos] = useState([]);
  const [servicosSelecionados,setServicosSelecionados] = useState([]);
  const [indexServico, setIndexServico] = useState(0);
  const [pagamento,setPagamento] = useState("");
  const [aba, setAba] = useState("agendar")
  const [data,setData] = useState("");
  const [comprovante, setComprovante] = useState(null);
  const [horarios,setHorarios] = useState([]);
  const [horarioEscolhido,setHorarioEscolhido] = useState(null);
  const [nome,setNome] = useState("");
  const [telefone,setTelefone] = useState("");
const [indexProduto, setIndexProduto] = useState(0);
const [mostrarDescricao,setMostrarDescricao] = useState(false);
useEffect(()=>{

  if(fechado){
    setAba("produtos");
  }else{
    setAba("agendar");
  }

},[fechado]);
  useEffect(()=>{

function verificar(){

api.get("/configuracao")
.then(res=>{

setFechado(
res.data.fechado === true ||
res.data.fechado === 1
);

});

}


verificar();


const intervalo=setInterval(verificar,3000);


return()=>clearInterval(intervalo);


},[]);

function toggleServico(servico){

  const existe = servicosSelecionados.find(
    s=>s.id === servico.id
  );

  if(existe){

    setServicosSelecionados(prev =>
      prev.filter(s=>s.id !== servico.id)
    );

  }else{

    setServicosSelecionados(prev => [
      ...prev,
      servico
    ]);

    setTimeout(()=>{

      horarioRef.current?.scrollIntoView({
        behavior:"smooth",
        block:"center"
      });

    },300);

  }

}


function temLuzes(){

  return servicosSelecionados.some(s =>
    s.nome.toLowerCase().includes("luzes")
  );

}



function total(){
  return servicosSelecionados.reduce((soma,s)=>{
    return soma + Number(s.preco || 0);
  },0);
}

  useEffect(()=>{
    api.get("/servicos")
    .then(res=>{
      setServicos(res.data);
    });

  },[]);
  


  function buscarHorarios(valor){

  if(!valor) return; // 🛑 evita crash

  const dataObj = new Date(valor + "T00:00:00");

  if (isNaN(dataObj)) {
    console.log("Data inválida:", valor);
    return;
  }

  const dia = dataObj.getDay();

  if(dia === 0){
    alert("Domingo não funciona!");
    setData("");
    setHorarios([]);
    return;
  }

  setData(valor);

  api.get(`/horarios/${valor}`)
  .then(res=>{
    setHorarios(res.data);
  })
  .catch(err=>{
    console.log("Erro horários:", err);
  });
}



  function copiarPix(){


    navigator.clipboard.writeText(
      "38411728000189"
    );


    alert("Chave PIX copiada!");

  }


function formatarDataBR(dataISO){
  if(!dataISO) return "";

  const partes = dataISO.split("-");
  if(partes.length !== 3) return dataISO;

  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
}



  async function confirmarAgendamento(){
    try{



    if(!nome.trim()){
 alert("Digite o nome");
 return;
}

if(!telefone){
 alert("Digite o telefone");
 return;
}

if(!pagamento){
 alert("Escolha o pagamento");
 return;
}

if(pagamento === "pix" && !comprovante){
 alert("Envie o comprovante PIX");
 return;
}

if(servicosSelecionados.length === 0){
 alert("Escolha um serviço");
 return;
}

if(!data){
 alert("Escolha a data");
 return;
}

if(!horarioEscolhido){
 alert("Escolha o horário");
 return;
}




   const clienteResposta = await api.post("/clientes",{
  nome,
  telefone
});

console.log("Cliente:", clienteResposta.data);


const formData = new FormData();

formData.append("cliente", nome);
formData.append("servico", servicosSelecionados.map(s=>s.nome).join(", "));
formData.append("data", data);
formData.append("horario", horarioEscolhido);
formData.append("pagamento", pagamento);
formData.append("total", total());

if (comprovante) {
  formData.append("comprovante", comprovante);
}

await api.post("/agendamentos", formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});


alert("Agendamento realizado!");



      setNome("");
      setTelefone("");
      setPagamento("");
      setComprovante(null);
      setServicosSelecionados([]);
      setData("");
      setHorarios([]);
      setHorarioEscolhido(null);



    }catch(err){


      alert(
        err.response?.data?.erro ||
        "Erro ao realizar agendamento"
      );


    }


  }






const produtos = [
  {
    nome: "Construa a vida ao seu redor",
    destaque: true,
    img: livro,
    descricao: "Existe uma geração cansada, ansiosa, cheia de informação e completamente perdida. A dor maior não é o quanto você tem na conta bancária. É a crise existencial: O vazio que não passa, mesmo quando você trabalha muito. É o medo de envelhecer e perceber que, por anos, você trocou propósito por distração e felicidade por prazer temporário. Eu já estive aí. Saí de Minas Gerais há 7 anos buscando um futuro melhor, mas o salto real não foi o geográfico. Foi de mentalidade. Eu vivia em um ambiente que me puxava para baixo, conversando com as pessoas erradas e tomando decisões no automático. Eu achava que o problema era o dinheiro, mas o dinheiro só amplificaria a pessoa que eu já era. A verdade que liberta, mas que  dói: responsabilidade é o começo da mudança. Tudo começou a mudar quando entendi a lição mais valiosa: Força de vontade é remar contra a corrente, mas o ambiente é o rio. Você pode se esforçar o quanto for, mas se o ambiente que você aceita viver (seu círculo social, seus habitos, os estímulos que você consome) te puxa para baixo, você vai cansar e desistir. Ambiente e mentalidade não são bofetadas de sorte. São escolhas que moldam seu destino. Eu não escrevi este livro como quem ensina. Escrevi como quem voltou para buscar. Em MUDANÇA DE MENTALIDADE E AMBIENTE, eu entrego os 7 anos de caminhos, erros e acertos que me fizeram reconfigurar a mente e o ambiente para atingir resultados que eu nem sonhava serem possíveis. É um mapa prático para quem está cansado de viver no piloto automático. O que você vai encontrar no livro: *Como identificar e quebrar as crenças que te seguram. *O método exato para construir uma rede de conexões (Network) que te impulsiona. *O passo a passo para mudar a ambiência e fazer a mudança acontecer sem forçar. Direção e clareza para sair da confusão e da comparação constante. O preço de mudar é alto. Mas o preço de continuar igual é infinitamente maior. Se a sua vida não está mudando,é porque o ambiente ainda é o mesmo."
  },
  {
    nome: "Fone de Ouvido",
    destaque: false,
    img: foneb,
     descricao: "Qualidade de som, conforto e praticidade para o trabalho, treinos e lazer."
  },
  {
    nome: "Smartwatches",
    destaque: false,
    img: relogio,
     descricao: "Acompanhe suas atividades, monitore sua saúde e mantenha-se conectado durante o dia."
  },
  {
    nome: "Gel Cola Evolution",
    destaque: false,
    img: gel,
     descricao: "Fixação forte para manter o penteado no lugar por muito mais tempo. O Gel Cola Evolution proporciona excelente definição, secagem rápida e efeito duradouro, ajudando a criar diversos estilos sem deixar resíduos quando utilizado corretamente."
  },
  {
    nome: "Pomada Modeladora Vision",
    destaque: false,
    img: pomada,
     descricao: "Ideal para modelar e finalizar o cabelo com praticidade. A Pomada Modeladora Vision oferece fixação e textura, permitindo remodelar o penteado ao longo do dia, com acabamento natural e sem pesar os fios."
  },
  {
    nome: "Minoxidil",
    destaque: false,
    img: mino,
     descricao: "A nova fórmula do Dom Pelo 15% foi desenvolvida para integrar sua rotina de cuidados com a barba e os cabelos. Com alta concentração e aplicação prática, é uma opção para quem busca estimular o crescimento dos fios de forma consistente, seguindo as orientações de uso."
  }
];
function comprarProduto(produto){

  const msg = `Olá, estou interessado em um produto: ${produto.nome}`;

  window.open(
    `https://wa.me/5541998289353?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

}
return(
  <div
    style={{
  backgroundImage: `url(${fund})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  minHeight: "100vh"
}}
  >
  <div>
    {fechado && (
<div
style={{
background:"#d32f2f",
color:"white",
padding:"15px",
textAlign:"center",
fontWeight:"bold"
}}
>
Estamos fechados hoje!
</div>
)}
<div className="menu-topo">

  <button
    className="btn-menu"
    onClick={()=>setMenuAberto(!menuAberto)}
  >
    ☰
  </button>

  <img src={logo} alt="Logo" className="logo-img" />

</div>

{menuAberto && (
  <div className="menu-lateral">

    <p onClick={()=>{
  if(!fechado){
    setAba("agendar");
  }
  setMenuAberto(false);
}}>
  Agendar
</p>
<p onClick={()=>{
  setAba("produtos")
  setMenuAberto(false);
}}>
  Produtos
</p>
<p onClick={()=>{
  setAba("sobre");
  setMenuAberto(false);
}}>
  Sobre
</p>

<p onClick={()=>{
  window.open("https://maps.app.goo.gl/6dCnX6VZgzS5cqeD8", "_blank");
setMenuAberto(false);
}}>
  Localização
</p>

  </div>
)}
   {aba === "agendar" && !fechado && (
<div id="sobre" className="fade-text" style={{marginTop:40}}>

<h1>Agendar horário</h1>

    <h2>Escolha o serviço:</h2>
      {servicos.length === 0 ? (
  <p>Carregando serviços...</p>
) : (
  
  <div className="carrossel">

    <button 
    className="amarelo"
    onClick={()=>{
      if(servicos.length === 0) return;
      setIndexServico(prev => 
        prev === 0 ? servicos.length - 1 : prev - 1
      )
    }}>
      ◀
    </button>

    <div className="card-servico">
      <h3>{servicos[indexServico]?.nome}</h3>

  <img
src={servicos[indexServico]?.imagem ? `/imagens/${servicos[indexServico].imagem}` : ""}
alt=""
className="img-servico"
/>

      <p>R$ {servicos[indexServico]?.preco}</p>

      <button
        disabled={!servicos[indexServico]}
        className={
  servicosSelecionados.some(s=>s.id===servicos[indexServico]?.id)
  ? "amarelo selecionado"
  : "amarelo"
}
        onClick={()=>{
          if(!servicos[indexServico]) return;
          toggleServico(servicos[indexServico])
        }}
      >
        Selecionar
      </button>
    </div>

    <button 
    className="amarelo"
    onClick={()=>{
      if(servicos.length === 0) return;
      setIndexServico(prev => 
        prev === servicos.length - 1 ? 0 : prev + 1
      )
    }}>
      ▶
    </button>

  </div>
)}

<div>
      <div>

        <h2>Serviço escolhido:</h2>

        {
          servicosSelecionados.map(s=>(
            <p key={s.id}>{s.nome}</p>
          ))
        }

        <p><strong>Total: R$ {total()}</strong></p>
        <div ref={horarioRef}>
        <h2>Escolha a data:</h2>

        <input
          type="date"
          value={data}
          onChange={(e)=>buscarHorarios(e.target.value)}
        />

        <h2>Horários:</h2>

       {
  Array.isArray(horarios) && horarios.map((item) => {
    if (!item || !item.horario) return null;

    return (
      <button
  key={item.horario}
  disabled={item.ocupado}
  onClick={() => {
    setHorarioEscolhido(item.horario);

    setTimeout(()=>{
      dadosRef.current?.scrollIntoView({
        behavior:"smooth",
        block:"center"
      });
    },300);
  }}
  className={
    horarioEscolhido === item.horario
      ? "amarelo selecionado"
      : "amarelo"
  }
>
  {item.horario}
  {item.ocupado && " - Ocupado"}
</button>
    );
  })
}
      <div>
          

            <p>Horário escolhido: {horarioEscolhido}</p>

            <h2 ref={dadosRef}>Seus dados:</h2>

           <input
  placeholder="Nome"
  value={nome}
  onChange={(e)=>setNome(e.target.value)}
/>

            <input
  type="text"
  placeholder="Telefone"
  value={telefone}
  onChange={(e) => {

const valor = e.target.value.replace(/\D/g, "");

setTelefone(valor);


if(valor.length >= 10){

setTimeout(()=>{

pagamentoRef.current?.scrollIntoView({
behavior:"smooth",
block:"center"
});

},500);

}

}}
/>

            <h2 ref={pagamentoRef}>Pagamento:</h2>

           <button
  className={pagamento === "local" ? "amarelo selecionado" : "amarelo"}
  onClick={()=>setPagamento("local")}
>
  Pagar no local
</button>

            <button
  disabled={temLuzes()}
  className={pagamento === "pix" ? "verde selecionado" : "verde"}
  onClick={()=>setPagamento("pix")}
>
  PIX
</button>

            {temLuzes() && (
              <p style={{color:"red"}}>
                Serviços com luzes devem ser pagos no local
              </p>
            )}

            <p>
              Selecionado:
              {
                pagamento === "pix"
                ? " PIX"
                : pagamento === "local"
                ? " Pagar no local"
                : ""
              }
            </p>

            {pagamento === "pix" && (
              <div>

                <h3>Pagamento via PIX</h3>

                <p>
                  Chave PIX:
                  <strong> 38411728000189</strong>
                </p>

                <button onClick={copiarPix}>
                  Copiar chave PIX
                </button>

                <p>Valor: R$ {total()}</p>

                <p>
                  Após realizar o pagamento, o barbeiro irá confirmar.
                </p>

              </div>
            )}
  {pagamento === "pix" && (
              <div className="card">
                <label>Enviar comprovante do PIX:</label>

                <label className="botao-comprovante">
                  📎 Anexar comprovante
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e)=>{
  const arquivo = e.target.files[0];

  if(arquivo){
    setComprovante(arquivo);
  }
}}
                  />
                </label>

                {comprovante && (
                  <p className="nome-comprovante">
                    Arquivo: {comprovante.name}
                  </p>
                )}
              </div>
            )}

            <button
              className="botao-agendar"
              onClick={confirmarAgendamento}
              style={{
                background:"#FFD700",
                color:"#000",
                padding:"12px",
                border:"none",
                borderRadius:"8px",
                fontWeight:"bold",
                marginTop:"10px"
              }}
            >
              Confirmar agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
{aba === "produtos" && (

<div className="fade-text">

<div className="carrossel">

<button
className="amarelo"
onClick={()=>{
setMostrarDescricao(false);

setIndexProduto(prev =>
prev === 0 ? produtos.length - 1 : prev - 1
)
}}
>
◀
</button>


<div className="produto-card">

<h3>
{produtos[indexProduto].nome}
</h3>


<img
src={produtos[indexProduto].img}
alt={produtos[indexProduto].nome}
className="img-produto-carrossel"
/>


<button
className="verde"
onClick={()=>
comprarProduto(produtos[indexProduto])
}
>
Comprar no WhatsApp
</button>


<button
className="amarelo"
onClick={()=>setMostrarDescricao(!mostrarDescricao)}
>
Descrição
</button>


{mostrarDescricao && (
<p>
{produtos[indexProduto].descricao}
</p>
)}


</div>


<button
className="amarelo"
onClick={()=>{
setMostrarDescricao(false);

setIndexProduto(prev =>
prev === produtos.length - 1 ? 0 : prev + 1
)
}}
>
▶
</button>


</div>

</div>

)}
    {aba === "sobre" && (
  <div id="sobre" className="fade-text container-sobre" style={{marginTop:40}}>

    <h2>Sobre</h2>

    <p>
      Na nossa barbearia, cada atendimento vai muito além de um simples corte de cabelo. Aqui, a gente acredita que cuidar da aparência também é cuidar da autoestima, da confiança e do bem-estar de cada cliente.
    </p>

  </div>
)}

<a
  href="https://wa.me/5541998289353"
  target="_blank"
  rel="noopener noreferrer"
>
  <div className="btn-whatsapp-float">
    💬
  </div>
</a>

  </div>
</div>
);
}

export default Cliente;