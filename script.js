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
// DATA E HORÁRIO + GOOGLE AGENDA
// ========================================

const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dataHoje = String(hoje.getDate()).padStart(2, "0");

dia.min = `${ano}-${mes}-${dataHoje}`;

function mostrarHorarios(ocupados = []) {

  horario.innerHTML =
    '<option value="">Selecione um horário</option>';

  let livres = 0;

  horariosDisponiveis.forEach((hora) => {

    const ocupado = ocupados.some((evento) => {

      if (!evento || !evento.inicio || !evento.fim) {
        return false;
      }

      return hora >= evento.inicio && hora < evento.fim;
    });

    if (!ocupado) {

      const opcao = document.createElement("option");

      opcao.value = hora;
      opcao.textContent = hora;

      horario.appendChild(opcao);

      livres++;
    }
  });

  if (livres > 0) {

    horario.disabled = false;

  } else {

    horario.innerHTML =
      '<option value="">Nenhum horário disponível</option>';

    horario.disabled = true;
  }
}

dia.addEventListener("change", async () => {

  if (!dia.value) {

    horario.innerHTML =
      '<option value="">Escolha uma data</option>';

    horario.disabled = true;

    return;
  }

  // Libera imediatamente
  mostrarHorarios([]);

  try {

    const url =
      `${AGENDA_API_URL}?data=${encodeURIComponent(dia.value)}&t=${Date.now()}`;

    const resposta = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });

    if (!resposta.ok) {
      throw new Error("Falha ao consultar a agenda.");
    }

    const dados = await resposta.json();

    if (dados.sucesso === false) {
      throw new Error(dados.erro || "Erro retornado pela agenda.");
    }

    const ocupados =
      Array.isArray(dados.ocupados)
        ? dados.ocupados
        : [];

    mostrarHorarios(ocupados);

  } catch (erro) {

    console.error("Erro ao consultar Google Agenda:", erro);

    // Se a Agenda falhar, não trava o formulário
    mostrarHorarios([]);
  }
});
  // Se existem horários, libera o campo
  if (quantidadeLivres > 0) {

    horario.disabled = false;

  } else {

    horario.innerHTML =
      '<option value="">Nenhum horário disponível</option>';

    horario.disabled = true;
  }
}


// Quando a pessoa escolhe uma data
dia.addEventListener("change", async () => {

  // Se não existe data selecionada
  if (!dia.value) {

    horario.innerHTML =
      '<option value="">Escolha uma data</option>';

    horario.disabled = true;

    return;
  }


  // Primeiro libera os horários imediatamente.
  // Assim a Agenda nunca deixa o formulário travado.
  mostrarHorarios([]);


  try {

    const url =
      `${AGENDA_API_URL}?data=${encodeURIComponent(dia.value)}&t=${Date.now()}`;

    const resposta = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });


    if (!resposta.ok) {
      throw new Error(
        `Erro ao consultar agenda: ${resposta.status}`
      );
    }


    const texto = await resposta.text();

    let dados;

    try {

      dados = JSON.parse(texto);

    } catch {

      throw new Error(
        "A resposta da Agenda não está em formato JSON."
      );
    }


    // Se o Apps Script informar erro,
    // mantém os horários disponíveis em vez de travar.
    if (dados.sucesso === false) {

      throw new Error(
        dados.erro || "Erro retornado pela Google Agenda."
      );
    }


    const ocupados =
      Array.isArray(dados.ocupados)
        ? dados.ocupados
        : [];


    // Atualiza a lista retirando os horários ocupados
    mostrarHorarios(ocupados);


  } catch (erro) {

    console.error(
      "ERRO AO CONSULTAR GOOGLE AGENDA:",
      erro
    );

    // Se houver qualquer problema na integração,
    // não bloqueia o campo de horário.
    mostrarHorarios([]);

  }

});
  
// ========================================
// FORMULÁRIO / WHATSAPP + PAGAMENTO
// ========================================

// Links permanentes da Stone por valor
const linksStone = {
  15: "https://payment-link-v3.stone.com.br/pl_N2KqwMpYLgjoRzGFPhgd9D0X43WnB6bO",
  25: "https://payment-link-v3.stone.com.br/pl_pqQWMz3L86nkjXqHozh14PJvAygYEXdm",
  40: "https://payment-link-v3.stone.com.br/pl_p7ZMPbg4K3yXa7OtElHnMkqrLaBRd2lj",
  60: "https://payment-link-v3.stone.com.br/pl_kXwQ4neJB8mRojcQEtrKP1G73Exga0Zy"
};

// Descobre o valor pelo texto da consulta escolhida
function obterValorConsulta(textoServico) {

  const correspondencia = textoServico.match(/R\$\s*(\d+(?:[.,]\d{1,2})?)/i);

  if (!correspondencia) {
    return null;
  }

  return Number(
    correspondencia[1].replace(",", ".")
  );
}

document.getElementById("formulario").addEventListener("submit", (evento) => {

  evento.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value.trim(),
    whatsapp: document.getElementById("whatsapp").value.trim(),
    servico: servico.value,
    modalidade: document.getElementById("modalidade").value,
    dia: dia.value,
    horario: horario.value,
    pagamento: document.getElementById("pagamento").value
  };

  if (!dados.dia || !dados.horario) {
    alert("Escolha uma data e um horário.");
    return;
  }

  const valor = obterValorConsulta(dados.servico);

  let instrucaoPagamento = "";

  if (dados.pagamento.toLowerCase().includes("pix")) {

    instrucaoPagamento = [
      "Pagamento: PIX",
      valor ? `Valor: R$ ${valor.toFixed(2).replace(".", ",")}` : "",
      "Envie o comprovante do Pix por este WhatsApp."
    ]
      .filter(Boolean)
      .join("\n");

  } else if (dados.pagamento.toLowerCase().includes("cart")) {

    const linkPagamento = linksStone[valor];

    if (!linkPagamento) {
      alert("Não encontrei o link de pagamento para esta consulta.");
      return;
    }

    instrucaoPagamento = [
      "Pagamento: CARTÃO DE CRÉDITO — 1x",
      `Valor: R$ ${valor.toFixed(2).replace(".", ",")}`,
      "",
      "Pague pelo link seguro da Stone:",
      linkPagamento,
      "",
      "Após o pagamento, retorne aqui e informe que o pagamento foi realizado."
    ].join("\n");

  } else {

    alert("Escolha Pix ou Cartão de crédito.");
    return;
  }

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
    instrucaoPagamento,
    "",
    "⏳ Status: AGUARDANDO PAGAMENTO",
    "",
    "O horário será confirmado após a confirmação do pagamento."
  ].join("\n");

  window.open(
    `https://wa.me/5555999215944?text=${encodeURIComponent(mensagem)}`,
    "_blank",
    "noopener,noreferrer"
  );
});

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
