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

// Impede selecionar datas anteriores a hoje
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dataHoje = String(hoje.getDate()).padStart(2, "0");

dia.min = `${ano}-${mes}-${dataHoje}`;

dia.addEventListener("change", async () => {

  horario.innerHTML =
    '<option value="">Consultando agenda...</option>';

  horario.disabled = true;

  if (!dia.value) {
    horario.innerHTML =
      '<option value="">Escolha uma data</option>';
    return;
  }

  try {

    const resposta = await fetch(
      `${AGENDA_API_URL}?data=${encodeURIComponent(dia.value)}`
    );

    if (!resposta.ok) {
      throw new Error("Não foi possível consultar a agenda.");
    }

    const dados = await resposta.json();

    if (!dados.sucesso) {
      throw new Error(dados.erro || "Erro ao consultar agenda.");
    }

    const ocupados = dados.ocupados || [];

    horario.innerHTML =
      '<option value="">Selecione um horário</option>';

    let quantidadeLivres = 0;

    horariosDisponiveis.forEach((hora) => {

      const horaOcupada = ocupados.some((evento) => {
        return hora >= evento.inicio && hora < evento.fim;
      });

      if (!horaOcupada) {

        const option = document.createElement("option");

        option.value = hora;
        option.textContent = hora;

        horario.appendChild(option);

        quantidadeLivres++;
      }

    });

    if (quantidadeLivres === 0) {

      horario.innerHTML =
        '<option value="">Nenhum horário disponível</option>';

      horario.disabled = true;

    } else {

      horario.disabled = false;

    }

  } catch (erro) {

    console.error("Erro ao consultar agenda:", erro);

    horario.innerHTML =
      '<option value="">Não foi possível consultar os horários</option>';

    horario.disabled = true;

  }

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
