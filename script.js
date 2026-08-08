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

    const ocupado = ocupados.some((evento) =>
      hora >= evento.inicio && hora < evento.fim
    );

    if (!ocupado) {
      const opcao = document.createElement("option");
      opcao.value = hora;
      opcao.textContent = hora;
      horario.appendChild(opcao);
      livres++;
    }
  });

  if (livres === 0) {
    horario.innerHTML =
      '<option value="">Nenhum horário disponível</option>';
    horario.disabled = true;
  } else {
    horario.disabled = false;
  }
}

dia.addEventListener("change", async () => {

  if (!dia.value) {
    horario.innerHTML =
      '<option value="">Escolha uma data</option>';
    horario.disabled = true;
    return;
  }

  // LIBERA OS HORÁRIOS IMEDIATAMENTE
  mostrarHorarios();

  try {

    const url =
      `${AGENDA_API_URL}?data=${encodeURIComponent(dia.value)}&t=${Date.now()}`;

    const resposta = await fetch(url);

    if (!resposta.ok) {
      throw new Error("Falha ao consultar agenda");
    }

    const dados = await resposta.json();

    if (dados.sucesso && Array.isArray(dados.ocupados)) {
      mostrarHorarios(dados.ocupados);
    }

  } catch (erro) {

    console.error(
      "Google Agenda indisponível. Mantendo horários padrão:",
      erro
    );

    // Se o Google falhar, o agendamento CONTINUA funcionando.
    mostrarHorarios();
  }
});
// ========================================
// FORMULÁRIO / WHATSAPP
// ========================================

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

  const mensagem = [
    "Olá! Gostaria de solicitar um agendamento no Estrela Guia Tarot.",
    "",
    `Nome: ${dados.nome}`,
    `WhatsApp: ${dados.whatsapp}`,
    `Consulta: ${dados.servico}`,
    `Modalidade: ${dados.modalidade}`,
    `Data: ${dados.dia}`,
    `Horário: ${dados.horario}`,
    `Pagamento: ${dados.pagamento}`,
    "",
    "Aguardo a confirmação da disponibilidade e do pagamento."
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
// TRANSIÇÃO ENTRE AS SEÇÕES
// ========================================

const secoesParaRevelar = document.querySelectorAll("main section");

const observadorSecoes = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("ativo");
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px"
  }
);

secoesParaRevelar.forEach((secao, indice) => {
  secao.classList.add("revelar");

  if (indice === 0) {
    secao.classList.add("ativo");
  } else {
    observadorSecoes.observe(secao);
  }
});
