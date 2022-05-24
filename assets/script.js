// Variaveis auxiliares

const baseUrl = "http://localhost:3000";
let listaDePaletas = [];

// Requisições

const buscarTodasAsPaletas = async () => {
  const resposta = await fetch(`${baseUrl}/paletas/listar-todas`);

  const paletas = await resposta.json();

  listaDePaletas = paletas;

  return paletas;
};

const buscarPaletaPorId = async (id) => {
  const resposta = await fetch(`${baseUrl}/paletas/paleta/${id}`);

  console.log(resposta);

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

  const input = document.getElementById("inputBuscaSaborPaleta");
  const sabor = input.value;

  const paletaSelecionada = listaDePaletas.find((elem) => elem.sabor === sabor);

  if (paletaSelecionada === undefined) {
    const mensagemDeErro = document.createElement("p");
    mensagemDeErro.id = "mensagemDeErro";
    mensagemDeErro.classList.add("MensagemDeErro");
    mensagemDeErro.innerText = "Nenhuma paleta encontrada";

    document.getElementById("paletaPesquisada").appendChild(mensagemDeErro);
  }

  const id = paletaSelecionada._id;

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

const mostrarModalCriacao = () => {
  document.getElementById("fundoModal").style.display = "flex";
};

const esconderModalCriacao = () => {
  document.getElementById("inputSabor").value = "";
  document.getElementById("inputPreco").value = "";
  document.getElementById("inputDescricao").value = "";
  document.getElementById("inputFoto").value = "";

  document.getElementById("fundoModal").style.display = "none";
};

const cadastrarNovaPaleta = async () => {
  const sabor = document.getElementById("inputSabor").value;
  const preco = document.getElementById("inputPreco").value;
  const descricao = document.getElementById("inputDescricao").value;
  const foto = document.getElementById("inputFoto").value;

  const paleta = await criarPaleta(sabor, descricao, foto, preco);

  document.getElementById("paletaList").insertAdjacentHTML(
    "beforeend",
    `
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
  `
  );

  esconderModalCriacao();
};
