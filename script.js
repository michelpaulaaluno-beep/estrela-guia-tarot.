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

document.getElementById("ano").textContent = new Date().getFullYear();

document.querySelectorAll(".escolher").forEach((botao) => {
  botao.addEventListener("click", () => {
    servico.value = botao.dataset.servico;
    document.getElementById("agendamento").scrollIntoView({behavior:"smooth"});
  });
});

dia.addEventListener("change", () => {
  horario.innerHTML = '<option value="">Selecione um horário</option>';

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

document.getElementById("formulario").addEventListener("submit", (evento) => {
});

dia.addEventListener("change", () => {
  const lista = horarios[dia.value] || [];
  horario.innerHTML = '<option value="">Selecione</option>';
  horario.disabled = lista.length === 0;

  lista.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    horario.appendChild(option);
  });
});

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
    `Dia: ${dados.dia}`,
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

const musica = document.getElementById("musica");
const botaoMusica = document.getElementById("botao-musica");

const listaMusicas = [
  "musica1.mp3",
  "musica2.mp3",
  "musica3.mp3",
  "musica4.mp3"
];

let musicaAtual = 0;
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
  musicaAtual = (musicaAtual + 1) % listaMusicas.length;
  musica.src = listaMusicas[musicaAtual];

  try {
    await musica.play();
    tocando = true;
  } catch {
    tocando = false;
    botaoMusica.textContent = "♪ Música";
  }
});

document.getElementById("instagram").addEventListener("click", () => {
  alert("Depois vamos colocar aqui o link oficial do Instagram do Estrela Guia Tarot.");
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
