// async function listarTodasAsPaletas() {
//   // async e await, para dizer pro código esperar antes de continuar
//   const resposta = await fetch("http://localhost:3000/paletas/listar-todas");

//   // tratamento da resposta
//   const paletas = await resposta.json();

//   paletas.forEach((elemento) => {
//     document.getElementById("paletaList").insertAdjacentHTML(
//       "beforeend",
//       `
//         <div class="PaletaListaItem">
//           <div>
//             <div class="PaletaListaItem__sabor">${elemento.sabor}</div>
//             <div class="PaletaListaItem__preco">R$ ${elemento.preco}</div>
//             <div class="PaletaListaItem__descricao">${elemento.descricao}</div>
//           </div>
//           <img class="PaletaListaItem__foto" src="./${elemento.foto}" alt="Paleta de Doce de Leite" />
//         </div>
//       `
//     );
//   });
// }

// listarTodasAsPaletas();

// Variaveis auxiliares

const baseUrl = "http://localhost:3000";

// Requisições

const buscarTodasAsPaletas = async () => {
  const resposta = await fetch(`${baseUrl}/paletas/listar-todas`);

  const paletas = await resposta.json();

  return paletas;
};

const buscarPaletaPorId = async (id) => {
  const resposta = await fetch(`${baseUrl}/paletas/paleta/${id}`);

  if (resposta.status === 404) {
    return false;
  }

  const paleta = await resposta.json();

  return paleta;
};

const criarPaleta = async (sabor, descricao, foto, preco) => {
  const paleta = {
    sabor,
    descricao,
    foto,
    preco,
  };

  const resposta = await fetch(`${baseUrl}/paletas/criar-paleta`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await resposta.json();

  return novaPaleta;
};

const atualizarPaleta = async (id, sabor, descricao, foto, preco) => {
  const paleta = {
    sabor,
    descricao,
    foto,
    preco,
  };

  const resposta = await fetch(`${baseUrl}/paletas/atualizar-paleta/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const paletaAtualizada = await resposta.json();

  return paletaAtualizada;
};

const excluirPaleta = async (id) => {
  const resposta = await fetch(`${baseUrl}/paletas/excluir-paleta/${id}`, {
    method: "DELETE",
    mode: "cors",
  });

  if (resposta.status === 204) {
    return "Paleta excluída com sucesso";
  } else {
    return "Paleta não encontrada";
  }
};

// Manipulação do documento (HTML)

const imprimirTodasAsPaletas = async () => {
  const paletas = await buscarTodasAsPaletas();

  paletas.forEach((elemento) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
          <h4>${elemento.sabor}</h4>
          <span>R$${elemento.preco.toFixed(2)}</span>
          <p>${elemento.descricao}</p>
        </div>
        <img src="./${elemento.foto}" alt="Paleta sabor ${
        elemento.sabor
      }" class="CartaoPaleta__foto"/>
      </div>
      `
    );
  });
};

imprimirTodasAsPaletas();

const imprimirUmaPaletaPorId = async () => {
  document.getElementById("paletaPesquisada").innerHTML = "";

  const input = document.getElementById("inputIdPaleta");
  const id = input.value;

  const paleta = await buscarPaletaPorId(id);

  if (paleta === false) {
    const mensagemDeErro = document.createElement("p");
    mensagemDeErro.id = "mensagemDeErro";
    mensagemDeErro.classList.add("MensagemDeErro");
    mensagemDeErro.innerText = "Nenhuma paleta encontrada";

    document.getElementById("paletaPesquisada").appendChild(mensagemDeErro);
  } else {
    document.getElementById("paletaPesquisada").innerHTML = `
      <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
          <h4>${paleta.sabor}</h4>
          <span>R$${paleta.preco.toFixed(2)}</span>
          <p>${paleta.descricao}</p>
        </div>
        <img src="./${paleta.foto}" alt="Paleta sabor ${
      paleta.sabor
    }" class="CartaoPaleta__foto"/>
      </div>
    `;
  }
};
