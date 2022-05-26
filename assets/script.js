// Classes

class Requisicoes {
  async buscarTodasAsPaletas() {
    const resposta = await fetch(`${baseUrl}/paletas/listar-todas`);

    const paletas = await resposta.json();

    listaDePaletas = paletas;

    return paletas;
  }

  async buscarPaletaPorId(id) {
    const resposta = await fetch(`${baseUrl}/paletas/paleta/${id}`);

    if (resposta.status === 404) {
      return false;
    }

    const paleta = await resposta.json();

    return paleta;
  }

  async criarPaleta(sabor, descricao, foto, preco) {
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
  }

  async atualizarPaleta(id, sabor, descricao, foto, preco) {
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
  }

  async excluirPaleta(id) {
    const resposta = await fetch(`${baseUrl}/paletas/excluir-paleta/${id}`, {
      method: "DELETE",
      mode: "cors",
    });

    if (resposta.status === 200) {
      return true;
    } else {
      return false;
    }
  }
}

// Variaveis auxiliares

const requisicoes = new Requisicoes();
const baseUrl = "http://localhost:3000";
let listaDePaletas = [];

// Manipulação do documento (HTML)

const imprimirTodasAsPaletas = async () => {
  const paletas = await requisicoes.buscarTodasAsPaletas();

  document.getElementById("paletaList").innerHTML = ``;

  paletas.forEach((elemento) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="CartaoPaleta">
        <div class="CartaoPaleta__infos">
          <h4>${elemento.sabor}</h4>
          <span>R$${elemento.preco.toFixed(2)}</span>
          <p>${elemento.descricao}</p>
          <div>
            <button onclick="mostrarModalExclusao('${
              elemento._id
            }')" class="botao-excluir-paleta">APAGAR</button>
            <button onclick="mostrarModalEdicao('${
              elemento._id
            }')" class="botao-editar-paleta">EDITAR</button>
          </div>
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

  const paleta = await requisicoes.buscarPaletaPorId(id);

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
          <div>
            <button onclick="mostrarModalExclusao('${
              paleta._id
            }')" class="botao-excluir-paleta">APAGAR</button>
            <button onclick="mostrarModalEdicao('${
              paleta._id
            }')" class="botao-editar-paleta">EDITAR</button>
          </div>
        </div>
        <img src="./${paleta.foto}" alt="Paleta sabor ${
      paleta.sabor
    }" class="CartaoPaleta__foto"/>
      </div>
    `;
  }
};

const mostrarModalCriacao = () => {
  document.getElementById("fundoModalCriacao").style.display = "flex";
};

const mostrarModalExclusao = (id) => {
  document.getElementById("fundoModalExclusao").style.display = "flex";

  const botaoConfirmar = document.getElementById("botaoConfirmarExclusao");

  botaoConfirmar.addEventListener("click", async () => {
    const exclusao = await requisicoes.excluirPaleta(id);

    if (exclusao) {
      mostrarNotificacao("sucesso", "Paleta excluida com sucesso");
    } else {
      mostrarNotificacao("erro", "Paleta não encontrada");
    }
    esconderModalExclusao();
    imprimirTodasAsPaletas();
  });
};

const mostrarModalEdicao = (id) => {
  document.getElementById("fundoModalEdicao").style.display = "flex";

  const paleta = listaDePaletas.find((elemento) => elemento._id === id);

  document.getElementById("inputSaborEdicao").value = paleta.sabor;
  document.getElementById("inputPrecoEdicao").value = paleta.preco;
  document.getElementById("inputDescricaoEdicao").value = paleta.descricao;
  document.getElementById("inputFotoEdicao").value = paleta.foto;

  const botaoAtualizar = document.getElementById("botaoConfirmarEdicao");

  botaoAtualizar.addEventListener("click", async () => {
    const sabor = document.getElementById("inputSaborEdicao").value;
    const preco = document.getElementById("inputPrecoEdicao").value;
    const descricao = document.getElementById("inputDescricaoEdicao").value;
    const foto = document.getElementById("inputFotoEdicao").value;

    await requisicoes.atualizarPaleta(id, sabor, descricao, foto, preco);

    esconderModalEdicao();
    imprimirTodasAsPaletas();
  });
};

const mostrarNotificacao = (tipo, frase) => {
  const notificacaoSpan = document.getElementById("notificacaoSpan");
  const notificacaoP = document.getElementById("notificacaoP");

  if (tipo === "sucesso") {
    notificacaoSpan.innerText = "V";
    notificacaoSpan.classList.add("notificacao-span-sucesso");
  } else if (tipo === "erro") {
    notificacaoSpan.innerText = "X";
    notificacaoSpan.classList.add("notificacao-span-erro");
  }

  notificacaoP.innerText = frase;

  document.getElementById("notificacao").style.display = "flex";

  setTimeout(() => {
    esconderNotificacao();
  }, 5000);
};

const esconderModalCriacao = () => {
  document.getElementById("inputSabor").value = "";
  document.getElementById("inputPreco").value = "";
  document.getElementById("inputDescricao").value = "";
  document.getElementById("inputFoto").value = "";

  document.getElementById("fundoModalCriacao").style.display = "none";
};

const esconderModalExclusao = () => {
  document.getElementById("fundoModalExclusao").style.display = "none";
};

const esconderModalEdicao = () => {
  document.getElementById("fundoModalEdicao").style.display = "none";
};

const esconderNotificacao = () => {
  document.getElementById("notificacao").style.display = "none";
};

const cadastrarNovaPaleta = async () => {
  const sabor = document.getElementById("inputSabor").value;
  const preco = document.getElementById("inputPreco").value;
  const descricao = document.getElementById("inputDescricao").value;
  const foto = document.getElementById("inputFoto").value;

  const paleta = await requisicoes.criarPaleta(sabor, descricao, foto, preco);

  document.getElementById("paletaList").insertAdjacentHTML(
    "beforeend",
    `
    <div class="CartaoPaleta">
      <div class="CartaoPaleta__infos">
        <h4>${paleta.sabor}</h4>
        <span>R$${paleta.preco.toFixed(2)}</span>
        <p>${paleta.descricao}</p>
        <div>
          <button onclick="mostrarModalExclusao('${
            paleta._id
          }')" class="botao-excluir-paleta">APAGAR</button>
          <button onclick="mostrarModalEdicao('${
            paleta._id
          }')" class="botao-editar-paleta">EDITAR</button>
        </div>
      </div>
      <img src="./${paleta.foto}" alt="Paleta sabor ${
      paleta.sabor
    }" class="CartaoPaleta__foto"/>
    </div>
  `
  );
  mostrarNotificacao("sucesso", "Paleta criada com sucesso");

  esconderModalCriacao();
};
