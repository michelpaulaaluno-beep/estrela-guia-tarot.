
// ========================================
// HORÁRIOS DE ATENDIMENTO
// ========================================
const AGENDA_API_URL = "https://script.google.com/macros/s/AKfycbwudF762R7finLbS9O9lpUltmN38aIH8AU0gumE9dLi0UgQz9tccHybgS7dyrO-eNc3Yw/exec";
const horariosDisponiveis = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00"
];

const dia = document.getElementById("dia");
const horario = document.getElementById("horario");
const servico = document.getElementById("servico");

// Ano automático no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// ========================================
// DATA E HORÁRIO
// ========================================

const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dataHoje = String(hoje.getDate()).padStart(2, "0");

dia.min = `${ano}-${mes}-${dataHoje}`;

dia.addEventListener("change", () => {

  horario.innerHTML =
    '<option value="">Selecione um horário</option>';

  if (!dia.value) {
    horario.disabled = true;
    return;
  }

  horariosDisponiveis.forEach((hora) => {

    const opcao = document.createElement("option");

    opcao.value = hora;
    opcao.textContent = hora;

    horario.appendChild(opcao);
  });

  horario.disabled = false;
});

// ========================================
// FORMULÁRIO / WHATSAPP + PAGAMENTO
// ========================================

// Chave Pix aleatória — Banco do Brasil
const CHAVE_PIX = "1917b12b-63ee-451d-bb56-0cbe1b5864ac";

// Links permanentes Stone por valor
const linksStone = {
  15: "https://payment-link-v3.stone.com.br/pl_N2KqwMpYLgjoRzGFPhgd9D0X43WnB6bO",
  25: "https://payment-link-v3.stone.com.br/pl_pqQWMz3L86nkjXqHozh14PJvAygYEXdm",
  35: "https://payment-link-v3.stone.com.br/pl_3LabWAXO7rVQ1gaijuvB5920J86YRvNq",
  40: "https://payment-link-v3.stone.com.br/pl_p7ZMPbg4K3yXa7OtElHnMkqrLaBRd2lj",
  50: "https://payment-link-v3.stone.com.br/pl_xKYlVjXyqWRDGaECJI5ozEOm1g2wv4NL",
  60: "https://payment-link-v3.stone.com.br/pl_kXwQ4neJB8mRojcQEtrKP1G73Exga0Zy",
  70: "https://payment-link-v3.stone.com.br/pl_8OPdlnaBwkjQKPnBcyT1pY2mVWD3oR6e"
};


// ========================================
// DESCOBRE VALOR DA CONSULTA
// ========================================

function obterValorConsulta(textoServico) {

  const correspondencia =
    textoServico.match(/R\$\s*(\d+(?:[.,]\d{1,2})?)/i);

  if (!correspondencia) {
    return null;
  }

  return Number(
    correspondencia[1].replace(",", ".")
  );
}


// ========================================
// CALCULA TOTAL
// ========================================

function calcularTotal(servicoSelecionado, modalidadeSelecionada) {

  const valorConsulta =
    obterValorConsulta(servicoSelecionado);

  if (valorConsulta === null) {
    return null;
  }

  let total = valorConsulta;

  // Atendimento na casa do cliente em Alegrete
  if (
    modalidadeSelecionada
      .toLowerCase()
      .includes("casa do cliente")
  ) {
    total += 10;
  }

  return total;
}


// ========================================
// FUNÇÕES PARA GERAR PIX COPIA E COLA
// ========================================

function campoPix(id, valor) {

  const tamanho =
    String(valor.length).padStart(2, "0");

  return id + tamanho + valor;
}


function crc16(payload) {

  let resultado = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {

    resultado ^=
      payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {

      if ((resultado & 0x8000) !== 0) {

        resultado =
          (resultado << 1) ^ 0x1021;

      } else {

        resultado = resultado << 1;
      }

      resultado &= 0xFFFF;
    }
  }

  return resultado
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
}


function gerarPixCopiaECola(valor) {

  // GUI do Pix
  const gui =
    campoPix("00", "BR.GOV.BCB.PIX");

  // Chave Pix
  const chave =
    campoPix("01", CHAVE_PIX);

  const contaPix =
    campoPix("26", gui + chave);

  const valorFormatado =
    Number(valor).toFixed(2);

  let payload = "";

  payload += campoPix("00", "01");
  payload += contaPix;

  // MCC padrão
  payload += campoPix("52", "0000");

  // Moeda BRL
  payload += campoPix("53", "986");

  // Valor
  payload += campoPix("54", valorFormatado);

  // País
  payload += campoPix("58", "BR");

  // Nome do recebedor
  payload += campoPix(
    "59",
    "ESTRELA GUIA TAROT"
  );

  // Cidade
  payload += campoPix(
    "60",
    "ALEGRETE"
  );

  // Identificador
  payload += campoPix(
    "62",
    campoPix("05", "***")
  );

  // Campo CRC
  payload += "6304";

  return payload + crc16(payload);
}


// ========================================
// ENVIO DO FORMULÁRIO
// ========================================

document
  .getElementById("formulario")
  .addEventListener("submit", (evento) => {

    evento.preventDefault();

    const dados = {

      nome:
        document
          .getElementById("nome")
          .value
          .trim(),

      whatsapp:
        document
          .getElementById("whatsapp")
          .value
          .trim(),

      servico:
        servico.value,

      modalidade:
        document
          .getElementById("modalidade")
          .value,

      dia:
        dia.value,

      horario:
        horario.value,

      pagamento:
        document
          .getElementById("pagamento")
          .value
    };


    // ========================================
    // VALIDAÇÕES
    // ========================================

    if (
      !dados.nome ||
      !dados.whatsapp ||
      !dados.servico ||
      !dados.modalidade ||
      !dados.dia ||
      !dados.horario ||
      !dados.pagamento
    ) {

      alert(
        "Preencha todos os dados do agendamento."
      );

      return;
    }


    const valorConsulta =
      obterValorConsulta(dados.servico);

    const total =
      calcularTotal(
        dados.servico,
        dados.modalidade
      );


    if (
      valorConsulta === null ||
      total === null
    ) {

      alert(
        "Não foi possível calcular o valor da consulta."
      );

      return;
    }


    const temDeslocamento =
      total > valorConsulta;


    // ========================================
    // PIX
    // ========================================

    if (
      dados.pagamento
        .toLowerCase()
        .includes("pix")
    ) {

      const codigoPix =
        gerarPixCopiaECola(total);


      const mensagem = [

        "✨ SOLICITAÇÃO DE AGENDAMENTO — ESTRELA GUIA TAROT",
        "",

        `Nome: ${dados.nome}`,
        `WhatsApp: ${dados.whatsapp}`,
        `Consulta: ${dados.servico}`,
        `Modalidade: ${dados.modalidade}`,
        `Data: ${dados.dia}`,
        `Horário: ${dados.horario}`,

        "",

        `Valor da consulta: R$ ${valorConsulta
         

// ========================================
// MÚSICAS
// ========================================

const musica = document.getElementById("musica");
const botaoMusica = document.getElementById("botao-musica");

const listaMusicas = [
  "musica1.mp3",
  "musica2.mp3",
  "musica3.mp3",
  "musica4.mp3"
];

let musicaAtual = Math.floor(Math.random() * listaMusicas.length);
let tocando = false;

musica.volume = 0.25;
musica.src = listaMusicas[musicaAtual];

botaoMusica.addEventListener("click", async () => {

  try {

    if (!tocando) {

      await musica.play();

      tocando = true;
      botaoMusica.textContent = "❚❚ Pausar";

    } else {

      musica.pause();

      tocando = false;
      botaoMusica.textContent = "♪ Música";
    }

  } catch {

    alert("Não foi possível reproduzir a música.");

  }
});

musica.addEventListener("ended", async () => {

  musicaAtual =
    (musicaAtual + 1) % listaMusicas.length;

  musica.src = listaMusicas[musicaAtual];

  try {

    await musica.play();
    tocando = true;

  } catch {

    tocando = false;
    botaoMusica.textContent = "♪ Música";

  }
});


// ========================================
// INSTAGRAM
// ========================================

document.getElementById("instagram").addEventListener("click", () => {
  window.open(
    "https://www.instagram.com/suaestrelaguiatarot",
    "_blank"
  );
});


// ========================================
// MODO NOTURNO — AUTOMÁTICO + MANUAL
// ========================================

const botaoTema = document.getElementById("botao-tema");
const temaSistema = window.matchMedia("(prefers-color-scheme: dark)");

function aplicarTema(noturno) {
  document.body.classList.toggle("modo-noturno", noturno);

  if (botaoTema) {
    botaoTema.textContent = noturno
      ? "☀️ Modo claro"
      : "🌙 Modo noturno";
  }
}

// Verifica se a pessoa já escolheu um tema manualmente
const temaSalvo = localStorage.getItem("tema");

if (temaSalvo === "noturno") {
  aplicarTema(true);
} else if (temaSalvo === "claro") {
  aplicarTema(false);
} else {
  // Primeira visita: segue o tema do aparelho
  aplicarTema(temaSistema.matches);
}

// Se a pessoa trocar o tema do aparelho,
// o site acompanha automaticamente enquanto
// não houver uma escolha manual salva.
temaSistema.addEventListener("change", (evento) => {
  if (!localStorage.getItem("tema")) {
    aplicarTema(evento.matches);
  }
});

// Botão continua permitindo escolha manual
if (botaoTema) {
  botaoTema.addEventListener("click", () => {
    const estaNoturno =
      document.body.classList.contains("modo-noturno");

    const novoTemaNoturno = !estaNoturno;

    aplicarTema(novoTemaNoturno);

    localStorage.setItem(
      "tema",
      novoTemaNoturno ? "noturno" : "claro"
    );
  });

}
// ========================================
// TRANSIÇÕES SUAVES ENTRE AS SEÇÕES
// ========================================

document.addEventListener("DOMContentLoaded", () => {

  const secoes = document.querySelectorAll("main section");

  // Primeira seção já aparece normalmente
  if (secoes.length > 0) {
    secoes[0].classList.add("revelar", "ativo");
  }

  // Demais seções entram suavemente ao rolar
  const observador = new IntersectionObserver(
    (entradas) => {

      entradas.forEach((entrada) => {

        if (entrada.isIntersecting) {
          entrada.target.classList.add("ativo");

          // Anima apenas uma vez
          observador.unobserve(entrada.target);
        }

      });

    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  secoes.forEach((secao, indice) => {

    secao.classList.add("revelar");

    if (indice > 0) {
      observador.observe(secao);
    }

  });

});
