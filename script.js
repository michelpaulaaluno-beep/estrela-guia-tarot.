// ========================================
// HORÁRIOS DE ATENDIMENTO
// ========================================

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

// Impede selecionar datas anteriores a hoje
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

  horario.disabled = false;

  horariosDisponiveis.forEach((hora) => {
    const option = document.createElement("option");

    option.value = hora;
    option.textContent = hora;

    horario.appendChild(option);
  });
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

  alert(
    "Depois vamos colocar aqui o link oficial do Instagram do Estrela Guia Tarot."
  );

});


// ========================================
// MODO NOTURNO
// ========================================

const botaoTema = document.getElementById("botao-tema");

if (botaoTema) {

  if (localStorage.getItem("tema") === "noturno") {

    document.body.classList.add("modo-noturno");
    botaoTema.textContent = "☀️ Modo claro";

  }

  botaoTema.addEventListener("click", function () {

    document.body.classList.toggle("modo-noturno");

    const estaNoturno =
      document.body.classList.contains("modo-noturno");

    if (estaNoturno) {

      botaoTema.textContent = "☀️ Modo claro";
      localStorage.setItem("tema", "noturno");

    } else {

      botaoTema.textContent = "🌙 Modo noturno";
      localStorage.setItem("tema", "claro");

    }

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
// ========================================
// ESTRELA CADENTE → LOGO
// ========================================

window.addEventListener("load", () => {
  const estrela = document.querySelector(".efeito-estrela");
  const logo = document.querySelector(".logo-principal");

  if (!estrela || !logo) return;

  // Desliga a animação antiga do CSS
  estrela.style.animation = "none";

  // Descobre a posição real do logo na tela
  const posicaoLogo = logo.getBoundingClientRect();

  // A estrela começa fora da tela
  estrela.style.left = "-120px";
  estrela.style.top = "12vh";
  estrela.style.opacity = "0";

  setTimeout(() => {
    estrela.style.transition =
      "left 1.5s cubic-bezier(.22,.8,.35,1), " +
      "top 1.5s cubic-bezier(.22,.8,.35,1), " +
      "opacity .25s ease";

    estrela.style.opacity = "1";

    // Faz a estrela chegar próximo à estrela do logo
    estrela.style.left =
      (posicaoLogo.left + posicaoLogo.width * 0.56) + "px";

    estrela.style.top =
      (posicaoLogo.top + posicaoLogo.height * 0.23) + "px";
  }, 350);

  // Quando chega ao logo
  setTimeout(() => {
    estrela.style.opacity = "0";
    logo.classList.add("logo-brilho");

    setTimeout(() => {
      logo.classList.remove("logo-brilho");
    }, 900);
  }, 1900);
});
