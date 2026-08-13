// =====================================================
// ESTRELA GUIA TAROT — SCRIPT.JS
// VERSÃO CORRIGIDA — ANDROID + IPHONE / SAFARI
// =====================================================

// =====================================================
// CONFIGURAÇÕES
// =====================================================

const AGENDA_API_URL =
  "https://script.google.com/macros/s/AKfycbwudF762R7finLbS9O9lpUltmN38aIH8AU0gumE9dLi0UgQz9tccHybgS7dyrO-eNc3Yw/exec";

const CHAVE_PIX =
  "1917b12b-63ee-451d-bb56-0cbe1b5864ac";

const WHATSAPP_ESTRELA_GUIA =
  "5555999215944";

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


// =====================================================
// LINKS STONE
// =====================================================

const linksStone = {
  15: "https://payment-link-v3.stone.com.br/pl_N2KqwMpYLgjoRzGFPhgd9D0X43WnB6bO",
  25: "https://payment-link-v3.stone.com.br/pl_pqQWMz3L86nkjXqHozh14PJvAygYEXdm",
  35: "https://payment-link-v3.stone.com.br/pl_3LabWAXO7rVQ1gaijuvB5920J86YRvNq",
  40: "https://payment-link-v3.stone.com.br/pl_p7ZMPbg4K3yXa7OtElHnMkqrLaBRd2lj",
  50: "https://payment-link-v3.stone.com.br/pl_xKYlVjXyqWRDGaECJI5ozEOm1g2wv4NL",
  60: "https://payment-link-v3.stone.com.br/pl_kXwQ4neJB8mRojcQEtrKP1G73Exga0Zy",
  70: "https://payment-link-v3.stone.com.br/pl_8OPdlnaBwkjQKPnBcyT1pY2mVWD3oR6e"
};


// =====================================================
// ELEMENTOS
// =====================================================

const dia =
  document.getElementById("dia");

const horario =
  document.getElementById("horario");

const servico =
  document.getElementById("servico");

const formulario =
  document.getElementById("formulario");

const modalidade =
  document.getElementById("modalidade");

const pagamento =
  document.getElementById("pagamento");

const nome =
  document.getElementById("nome");

const whatsapp =
  document.getElementById("whatsapp");


// =====================================================
// PROTEÇÃO DO FORMULÁRIO
// SAFARI / IOS
// =====================================================

if (formulario) {

  formulario.setAttribute(
    "action",
    "javascript:void(0)"
  );

  formulario.setAttribute(
    "method",
    "post"
  );
}


// =====================================================
// ANO AUTOMÁTICO
// =====================================================

const elementoAno =
  document.getElementById("ano");

if (elementoAno) {

  elementoAno.textContent =
    new Date().getFullYear();
}


// =====================================================
// DATA MÍNIMA
// =====================================================

if (dia) {

  const hoje =
    new Date();

  const ano =
    hoje.getFullYear();

  const mes =
    String(
      hoje.getMonth() + 1
    ).padStart(2, "0");

  const data =
    String(
      hoje.getDate()
    ).padStart(2, "0");

  dia.min =
    `${ano}-${mes}-${data}`;
}


// =====================================================
// GOOGLE AGENDA — NORMALIZAR HORÁRIO
// =====================================================

function normalizarHora(valor) {

  if (!valor) {
    return "";
  }

  const texto =
    String(valor);

  const encontrado =
    texto.match(
      /(\d{2}):(\d{2})/
    );

  if (!encontrado) {
    return texto;
  }

  return (
    `${encontrado[1]}:${encontrado[2]}`
  );
}


// =====================================================
// MOSTRAR HORÁRIOS DISPONÍVEIS
// =====================================================

function mostrarHorarios(
  ocupados = []
) {

  if (!horario) {
    return;
  }

  const horarioSelecionado =
    horario.value;

  horario.innerHTML =
    '<option value="">Selecione um horário</option>';

  let quantidadeLivres = 0;

  let horarioAindaDisponivel =
    false;


  horariosDisponiveis.forEach(
    (hora) => {

      const ocupado =
        ocupados.some(
          (evento) => {

            if (!evento) {
              return false;
            }

            const inicio =
              normalizarHora(
                evento.inicio
              );

            const fim =
              normalizarHora(
                evento.fim
              );

            if (!inicio) {
              return false;
            }

            if (fim) {

              return (
                hora >= inicio &&
                hora < fim
              );
            }

            return (
              hora === inicio
            );
          }
        );


      if (!ocupado) {

        const opcao =
          document.createElement(
            "option"
          );

        opcao.value =
          hora;

        opcao.textContent =
          hora;


        if (
          hora ===
          horarioSelecionado
        ) {

          opcao.selected =
            true;

          horarioAindaDisponivel =
            true;
        }


        horario.appendChild(
          opcao
        );

        quantidadeLivres++;
      }
    }
  );


  if (
    quantidadeLivres > 0
  ) {

    horario.disabled =
      false;


    if (
      horarioSelecionado &&
      horarioAindaDisponivel
    ) {

      horario.value =
        horarioSelecionado;
    }

  } else {

    horario.innerHTML =
      '<option value="">Nenhum horário disponível</option>';

    horario.disabled =
      true;
  }
}


// =====================================================
// CONSULTAR GOOGLE AGENDA
// =====================================================

async function consultarAgenda(
  dataSelecionada
) {

  let controlador = null;
  let limite = null;


  try {

    if (
      typeof AbortController !==
      "undefined"
    ) {

      controlador =
        new AbortController();

      limite =
        setTimeout(
          () => {
            controlador.abort();
          },
          4000
        );
    }


    const url =
      `${AGENDA_API_URL}?data=${encodeURIComponent(dataSelecionada)}&t=${Date.now()}`;


    const configuracao = {
      method: "GET",
      cache: "no-store",
      redirect: "follow"
    };


    if (controlador) {

      configuracao.signal =
        controlador.signal;
    }


    const resposta =
      await fetch(
        url,
        configuracao
      );


    if (!resposta.ok) {

      throw new Error(
        `Agenda respondeu ${resposta.status}`
      );
    }


    const texto =
      await resposta.text();


    let dados;


    try {

      dados =
        JSON.parse(texto);

    } catch {

      throw new Error(
        "A Agenda não retornou JSON válido."
      );
    }


    if (
      dados &&
      dados.sucesso === false
    ) {

      throw new Error(
        dados.erro ||
        "Erro retornado pela Agenda."
      );
    }


    if (
      dados &&
      Array.isArray(
        dados.ocupados
      )
    ) {

      return dados.ocupados;
    }


    if (
      Array.isArray(dados)
    ) {

      return dados;
    }


    return [];


  } finally {

    if (limite) {

      clearTimeout(
        limite
      );
    }
  }
}


// =====================================================
// ESCOLHA DA DATA
// =====================================================

if (
  dia &&
  horario
) {

  horario.disabled =
    true;

  horario.innerHTML =
    '<option value="">Escolha uma data</option>';


  dia.addEventListener(
    "change",
    async () => {

      if (!dia.value) {

        horario.innerHTML =
          '<option value="">Escolha uma data</option>';

        horario.disabled =
          true;

        return;
      }


      horario.innerHTML =
        '<option value="">Selecione um horário</option>';


      horariosDisponiveis.forEach(
        (hora) => {

          const opcao =
            document.createElement(
              "option"
            );

          opcao.value =
            hora;

          opcao.textContent =
            hora;

          horario.appendChild(
            opcao
          );
        }
      );


      horario.disabled =
        false;


      try {

        const ocupados =
          await consultarAgenda(
            dia.value
          );


        horario
          .querySelectorAll(
            "option"
          )
          .forEach(
            (opcao) => {

              if (
                !opcao.value
              ) {
                return;
              }


              const hora =
                opcao.value;


              const estaOcupado =
                ocupados.some(
                  (evento) => {

                    if (!evento) {
                      return false;
                    }


                    const inicio =
                      normalizarHora(
                        evento.inicio
                      );

                    const fim =
                      normalizarHora(
                        evento.fim
                      );


                    if (!inicio) {
                      return false;
                    }


                    if (fim) {

                      return (
                        hora >= inicio &&
                        hora < fim
                      );
                    }


                    return (
                      hora === inicio
                    );
                  }
                );


              if (
                estaOcupado
              ) {

                opcao.disabled =
                  true;

                opcao.textContent =
                  `${hora} — indisponível`;
              }
            }
          );


        const selecionado =
          horario.options[
            horario.selectedIndex
          ];


        if (
          selecionado &&
          selecionado.disabled
        ) {

          horario.value =
            "";

          alert(
            "Esse horário acabou de ficar indisponível. Escolha outro horário."
          );
        }


      } catch (erro) {

        console.warn(
          "Não foi possível consultar o Google Agenda:",
          erro
        );
      }
    }
  );
}


// =====================================================
// DESCOBRIR VALOR DA CONSULTA
// =====================================================

function obterValorConsulta(
  textoServico
) {

  if (!textoServico) {
    return null;
  }


  const correspondencia =
    textoServico.match(
      /R\$\s*(\d+(?:[.,]\d{1,2})?)/i
    );


  if (!correspondencia) {
    return null;
  }


  return Number(
    correspondencia[1]
      .replace(
        ",",
        "."
      )
  );
}


// =====================================================
// CALCULAR TOTAL
// =====================================================

function calcularTotal(
  servicoSelecionado,
  modalidadeSelecionada
) {

  const valorConsulta =
    obterValorConsulta(
      servicoSelecionado
    );


  if (
    valorConsulta === null
  ) {

    return null;
  }


  let total =
    valorConsulta;


  if (
    modalidadeSelecionada &&
    modalidadeSelecionada
      .toLowerCase()
      .includes(
        "casa do cliente"
      )
  ) {

    total += 10;
  }


  return total;
}


// =====================================================
// FORMATAR DINHEIRO
// =====================================================

function formatarDinheiro(
  valor
) {

  return Number(valor)
    .toFixed(2)
    .replace(
      ".",
      ","
    );
}


// =====================================================
// INVALIDAR PAGAMENTO ANTIGO
// =====================================================

function invalidarPagamento() {

  const caixaPix =
    document.getElementById(
      "pagamento-pix-gerado"
    );


  if (caixaPix) {

    caixaPix.remove();
  }


  try {

    localStorage.removeItem(
      "ultimoAgendamento"
    );

  } catch (erro) {

    console.warn(
      "LocalStorage indisponível:",
      erro
    );
  }


  if (pagamento) {

    pagamento.value =
      "";
  }
}


// =====================================================
// MUDANÇA DE CONSULTA
// =====================================================

if (servico) {

  servico.addEventListener(
    "change",
    () => {

      invalidarPagamento();
    }
  );
}


// =====================================================
// MUDANÇA DE MODALIDADE
// =====================================================

if (modalidade) {

  modalidade.addEventListener(
    "change",
    () => {

      invalidarPagamento();
    }
  );
}


// =====================================================
// PIX — CAMPO EMV
// =====================================================

function campoPix(
  id,
  valor
) {

  const texto =
    String(valor);

  const tamanho =
    String(
      texto.length
    ).padStart(
      2,
      "0"
    );

  return (
    id +
    tamanho +
    texto
  );
}


// =====================================================
// PIX — CRC16
// =====================================================

function crc16(
  payload
) {

  let resultado =
    0xFFFF;


  for (
    let i = 0;
    i < payload.length;
    i++
  ) {

    resultado ^=
      payload.charCodeAt(i)
      << 8;


    for (
      let j = 0;
      j < 8;
      j++
    ) {

      if (
        (resultado & 0x8000) !==
        0
      ) {

        resultado =
          (resultado << 1) ^
          0x1021;

      } else {

        resultado =
          resultado << 1;
      }


      resultado &=
        0xFFFF;
    }
  }


  return resultado
    .toString(16)
    .toUpperCase()
    .padStart(
      4,
      "0"
    );
}


// =====================================================
// GERAR PIX COPIA E COLA
// =====================================================

function gerarPixCopiaECola(
  valor
) {

  const gui =
    campoPix(
      "00",
      "BR.GOV.BCB.PIX"
    );


  const chave =
    campoPix(
      "01",
      CHAVE_PIX
    );


  const contaPix =
    campoPix(
      "26",
      gui + chave
    );


  const valorFormatado =
    Number(valor)
      .toFixed(2);


  let payload =
    "";


  payload +=
    campoPix(
      "00",
      "01"
    );


  payload +=
    contaPix;


  payload +=
    campoPix(
      "52",
      "0000"
    );


  payload +=
    campoPix(
      "53",
      "986"
    );


  payload +=
    campoPix(
      "54",
      valorFormatado
    );


  payload +=
    campoPix(
      "58",
      "BR"
    );


  payload +=
    campoPix(
      "59",
      "ESTRELA GUIA TAROT"
    );


  payload +=
    campoPix(
      "60",
      "ALEGRETE"
    );


  payload +=
    campoPix(
      "62",
      campoPix(
        "05",
        "***"
      )
    );


  payload +=
    "6304";


  return (
    payload +
    crc16(payload)
  );
}


// =====================================================
// MENSAGEM WHATSAPP
// =====================================================

function montarMensagem(
  dados,
  valorConsulta,
  total,
  formaPagamento
) {

  const temDeslocamento =
    total >
    valorConsulta;


  return [

    "✨ SOLICITAÇÃO DE AGENDAMENTO — ESTRELA GUIA TAROT",

    "",

    `Nome: ${dados.nome}`,

    `WhatsApp: ${dados.whatsapp}`,

    `Consulta: ${dados.servico}`,

    `Modalidade: ${dados.modalidade}`,

    `Data: ${dados.dia}`,

    `Horário: ${dados.horario}`,

    "",

    `Valor da consulta: R$ ${formatarDinheiro(valorConsulta)}`,

    temDeslocamento
      ? "Deslocamento: R$ 10,00"
      : "",

    `TOTAL: R$ ${formatarDinheiro(total)}`,

    "",

    `Pagamento: ${formaPagamento}`,

    "",

    "⏳ Status: AGUARDANDO CONFIRMAÇÃO"

  ]
    .filter(Boolean)
    .join("\n");
}


// =====================================================
// ABRIR WHATSAPP
// CORREÇÃO SAFARI / IPHONE
// =====================================================

function abrirWhatsapp(
  mensagem
) {

  const url =
    `https://wa.me/${WHATSAPP_ESTRELA_GUIA}?text=${encodeURIComponent(mensagem)}`;


  // Navegação direta é mais confiável
  // no Safari do iPhone do que window.open.

  window.location.assign(
    url
  );
}


// =====================================================
// MOSTRAR PIX + QR CODE
// =====================================================

function mostrarPagamentoPix(
  codigoPix,
  total,
  dados,
  valorConsulta
) {

  const anterior =
    document.getElementById(
      "pagamento-pix-gerado"
    );


  if (anterior) {

    anterior.remove();
  }


  const caixa =
    document.createElement(
      "div"
    );


  caixa.id =
    "pagamento-pix-gerado";


  caixa.style.marginTop =
    "24px";

  caixa.style.padding =
    "22px";

  caixa.style.borderRadius =
    "14px";

  caixa.style.background =
    "#ffffff";

  caixa.style.color =
    "#222222";

  caixa.style.textAlign =
    "center";


  // ===================================================
  // TÍTULO
  // ===================================================

  const titulo =
    document.createElement(
      "h3"
    );

  titulo.textContent =
    "Pagamento via Pix";


  // ===================================================
  // VALOR
  // ===================================================

  const valor =
    document.createElement(
      "p"
    );

  valor.style.fontSize =
    "26px";

  valor.style.fontWeight =
    "bold";

  valor.textContent =
    `R$ ${formatarDinheiro(total)}`;


  // ===================================================
  // RESUMO
  // ===================================================

  const resumo =
    document.createElement(
      "p"
    );

  resumo.textContent =
    `${dados.servico} — ${dados.modalidade}`;


  // ===================================================
  // INSTRUÇÃO QR
  // ===================================================

  const instrucaoQR =
    document.createElement(
      "p"
    );

  instrucaoQR.style.marginTop =
    "22px";

  instrucaoQR.style.fontWeight =
    "600";

  instrucaoQR.textContent =
    "Escaneie o QR Code com o aplicativo do seu banco";


  // ===================================================
  // ÁREA QR CODE
  // ===================================================

  const areaQR =
    document.createElement(
      "div"
    );

  areaQR.id =
    "qrcode-pix";

  areaQR.style.width =
    "230px";

  areaQR.style.minHeight =
    "230px";

  areaQR.style.margin =
    "20px auto";

  areaQR.style.display =
    "flex";

  areaQR.style.alignItems =
    "center";

  areaQR.style.justifyContent =
    "center";

  areaQR.style.background =
    "#ffffff";

  areaQR.style.padding =
    "10px";

  areaQR.style.borderRadius =
    "12px";


  // ===================================================
  // AVISO QR
  // ===================================================

  const avisoQR =
    document.createElement(
      "p"
    );

  avisoQR.style.display =
    "none";

  avisoQR.style.margin =
    "18px 0";

  avisoQR.textContent =
    "Não foi possível carregar o QR Code. Use o Pix Copia e Cola abaixo.";


  // ===================================================
  // INSTRUÇÃO COPIA E COLA
  // ===================================================

  const instrucao =
    document.createElement(
      "p"
    );

  instrucao.style.marginTop =
    "20px";

  instrucao.textContent =
    "Ou copie o código Pix abaixo e faça o pagamento no aplicativo do seu banco.";


  // ===================================================
  // CÓDIGO PIX
  // ===================================================

  const codigo =
    document.createElement(
      "textarea"
    );

  codigo.value =
    codigoPix;

  codigo.readOnly =
    true;

  codigo.rows =
    5;

  codigo.style.width =
    "100%";

  codigo.style.boxSizing =
    "border-box";

  codigo.style.padding =
    "12px";

  codigo.style.marginTop =
    "10px";


  // ===================================================
  // BOTÃO COPIAR
  // ===================================================

  const botaoCopiar =
    document.createElement(
      "button"
    );

  botaoCopiar.type =
    "button";

  botaoCopiar.className =
    "botao botao-dourado";

  botaoCopiar.style.marginTop =
    "12px";

  botaoCopiar.textContent =
    "Copiar código Pix";


  botaoCopiar.addEventListener(
    "click",
    async (evento) => {

      evento.preventDefault();

      evento.stopPropagation();


      try {

        if (
          navigator.clipboard &&
          navigator.clipboard.writeText
        ) {

          await navigator.clipboard
            .writeText(
              codigoPix
            );


          botaoCopiar.textContent =
            "✓ Código Pix copiado";

          return;
        }


        throw new Error(
          "Clipboard API indisponível"
        );


      } catch (erro) {

        codigo.focus();

        codigo.select();

        codigo.setSelectionRange(
          0,
          codigo.value.length
        );


        try {

          const copiado =
            document.execCommand(
              "copy"
            );


          if (!copiado) {

            throw new Error(
              "Falha ao copiar"
            );
          }


          botaoCopiar.textContent =
            "✓ Código Pix copiado";


        } catch {

          alert(
            "Selecione o código Pix e copie manualmente."
          );
        }
      }
    }
  );


  // ===================================================
  // AVISO WHATSAPP
  // ===================================================

  const aviso =
    document.createElement(
      "p"
    );

  aviso.style.marginTop =
    "20px";

  aviso.textContent =
    "Depois do pagamento, clique abaixo para enviar o comprovante pelo WhatsApp.";


  // ===================================================
  // BOTÃO WHATSAPP
  // ===================================================

  const botaoWhatsapp =
    document.createElement(
      "button"
    );

  botaoWhatsapp.type =
    "button";

  botaoWhatsapp.className =
    "botao botao-dourado";

  botaoWhatsapp.style.marginTop =
    "10px";

  botaoWhatsapp.textContent =
    "Já paguei — enviar comprovante";


  botaoWhatsapp.addEventListener(
    "click",
    (evento) => {

      evento.preventDefault();

      evento.stopPropagation();


      if (
        servico.value !==
          dados.servico ||
        modalidade.value !==
          dados.modalidade
      ) {

        caixa.remove();

        pagamento.value =
          "";


        alert(
          "A consulta ou modalidade foi alterada. Gere o pagamento novamente."
        );


        return;
      }


      const totalAtual =
        calcularTotal(
          servico.value,
          modalidade.value
        );


      if (
        totalAtual !==
        total
      ) {

        caixa.remove();

        pagamento.value =
          "";


        alert(
          "O valor do atendimento mudou. Gere o pagamento novamente."
        );


        return;
      }


      let mensagem =
        montarMensagem(
          dados,
          valorConsulta,
          total,
          "PIX"
        );


      mensagem +=
        "\n\n✅ Cliente informou que realizou o pagamento.";


      mensagem +=
        "\n📎 Envie o comprovante nesta conversa.";


      abrirWhatsapp(
        mensagem
      );
    }
  );


  // ===================================================
  // INSERE A CAIXA
  // ===================================================

  caixa.appendChild(
    titulo
  );

  caixa.appendChild(
    valor
  );

  caixa.appendChild(
    resumo
  );

  caixa.appendChild(
    instrucaoQR
  );

  caixa.appendChild(
    areaQR
  );

  caixa.appendChild(
    avisoQR
  );

  caixa.appendChild(
    instrucao
  );

  caixa.appendChild(
    codigo
  );

  caixa.appendChild(
    botaoCopiar
  );

  caixa.appendChild(
    aviso
  );

  caixa.appendChild(
    botaoWhatsapp
  );


  formulario.appendChild(
    caixa
  );


  // ===================================================
  // GERA QR CODE
  // ===================================================

  try {

    if (
      typeof QRCode ===
      "undefined"
    ) {

      throw new Error(
        "Biblioteca QRCode não carregada."
      );
    }


    areaQR.innerHTML =
      "";


    new QRCode(
      areaQR,
      {
        text:
          codigoPix,

        width:
          210,

        height:
          210,

        correctLevel:
          QRCode.CorrectLevel.M
      }
    );


  } catch (erro) {

    console.error(
      "Erro ao gerar QR Code:",
      erro
    );


    areaQR.style.display =
      "none";


    avisoQR.style.display =
      "block";
  }


  // ===================================================
  // IMPORTANTE:
  // NÃO USAMOS scrollIntoView AQUI.
  // Isso evita o salto estranho do Safari/iPhone.
  // ===================================================

  setTimeout(
    () => {

      try {

        const posicao =
          caixa.getBoundingClientRect().top +
          window.pageYOffset -
          100;


        window.scrollTo(
          0,
          Math.max(
            0,
            posicao
          )
        );

      } catch (erro) {

        console.warn(
          "Não foi possível posicionar a tela no Pix:",
          erro
        );
      }

    },
    100
  );
}


// =====================================================
// PROCESSAR FORMULÁRIO
// =====================================================

function processarAgendamento(
  evento
) {

  if (evento) {

    evento.preventDefault();

    evento.stopPropagation();

    if (
      typeof evento.stopImmediatePropagation ===
      "function"
    ) {

      evento.stopImmediatePropagation();
    }
  }


  const dados = {

    nome:
      nome
        ? nome.value.trim()
        : "",

    whatsapp:
      whatsapp
        ? whatsapp.value.trim()
        : "",

    servico:
      servico
        ? servico.value
        : "",

    modalidade:
      modalidade
        ? modalidade.value
        : "",

    dia:
      dia
        ? dia.value
        : "",

    horario:
      horario
        ? horario.value
        : "",

    pagamento:
      pagamento
        ? pagamento.value
        : ""
  };


  // ===================================================
  // CAMPOS OBRIGATÓRIOS
  // ===================================================

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

    return false;
  }


  // ===================================================
  // OUTRA CIDADE
  // ===================================================

  if (
    dados.modalidade
      .toLowerCase()
      .includes(
        "outra cidade"
      )
  ) {

    const mensagemOutraCidade = [

      "✨ CONSULTA DE DISPONIBILIDADE — ESTRELA GUIA TAROT",

      "",

      `Nome: ${dados.nome}`,

      `WhatsApp: ${dados.whatsapp}`,

      `Consulta: ${dados.servico}`,

      `Modalidade: ${dados.modalidade}`,

      `Data pretendida: ${dados.dia}`,

      `Horário pretendido: ${dados.horario}`,

      "",

      "🚗 ATENDIMENTO EM OUTRA CIDADE",

      "",

      "Gostaria de consultar a disponibilidade e o valor do deslocamento.",

      "",

      "O valor total e a forma de pagamento serão confirmados após combinar o deslocamento."

    ].join("\n");


    abrirWhatsapp(
      mensagemOutraCidade
    );


    return false;
  }


  // ===================================================
  // DINHEIRO
  // ===================================================

  const pagamentoEmDinheiro =
    dados.pagamento
      .toLowerCase()
      .includes(
        "dinheiro"
      );


  const atendimentoOnline =
    dados.modalidade
      .toLowerCase()
      .includes(
        "online"
      );


  if (
    pagamentoEmDinheiro &&
    atendimentoOnline
  ) {

    alert(
      "Pagamento em dinheiro está disponível somente para atendimentos presenciais. Escolha Pix ou cartão de crédito para atendimento online."
    );


    pagamento.value =
      "";


    return false;
  }


  // ===================================================
  // VALORES
  // ===================================================

  const valorConsulta =
    obterValorConsulta(
      dados.servico
    );


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
      "Não foi possível calcular o valor do atendimento."
    );


    return false;
  }


  // ===================================================
  // DINHEIRO PRESENCIAL
  // ===================================================

  if (
    pagamentoEmDinheiro
  ) {

    let mensagemDinheiro =
      montarMensagem(
        dados,
        valorConsulta,
        total,
        "DINHEIRO FÍSICO — PAGAMENTO NO ATENDIMENTO"
      );


    mensagemDinheiro +=
      "\n\n💵 Pagamento em dinheiro no momento do atendimento.";


    abrirWhatsapp(
      mensagemDinheiro
    );


    return false;
  }


  // ===================================================
  // PIX
  // ===================================================

  if (
    dados.pagamento
      .toLowerCase()
      .includes(
        "pix"
      )
  ) {

    const codigoPix =
      gerarPixCopiaECola(
        total
      );


    mostrarPagamentoPix(
      codigoPix,
      total,
      dados,
      valorConsulta
    );


    return false;
  }


  // ===================================================
  // CARTÃO STONE
  // SAFARI / IPHONE
  // ===================================================

  if (
    dados.pagamento
      .toLowerCase()
      .includes(
        "cart"
      )
  ) {

    const linkPagamento =
      linksStone[
        total
      ];


    if (
      !linkPagamento
    ) {

      alert(
        `Não existe link Stone configurado para R$ ${formatarDinheiro(total)}.`
      );


      return false;
    }


    try {

      localStorage.setItem(
        "ultimoAgendamento",
        JSON.stringify(
          {
            ...dados,
            valorConsulta,
            total
          }
        )
      );

    } catch (erro) {

      console.warn(
        "Não foi possível salvar o agendamento no navegador:",
        erro
      );
    }


    // Navegação direta.
    // Mais confiável no Safari/iOS.

    window.location.assign(
      linkPagamento
    );


    return false;
  }


  alert(
    "Escolha Pix, cartão de crédito ou dinheiro físico."
  );


  return false;
}


// =====================================================
// ENVIO DO FORMULÁRIO
// =====================================================

if (formulario) {

  formulario.addEventListener(
    "submit",
    processarAgendamento,
    false
  );


  formulario.onsubmit =
    function(evento) {

      return processarAgendamento(
        evento
      );
    };
}


// =====================================================
// MÚSICA
// =====================================================

const musica =
  document.getElementById(
    "musica"
  );


const botaoMusica =
  document.getElementById(
    "botao-musica"
  );


const listaMusicas = [
  "musica1.mp3",
  "musica2.mp3",
  "musica3.mp3",
  "musica4.mp3"
];


let musicaAtual =
  Math.floor(
    Math.random() *
    listaMusicas.length
  );


let tocando =
  false;


if (
  musica &&
  botaoMusica
) {

  musica.volume =
    0.25;


  musica.src =
    listaMusicas[
      musicaAtual
    ];


  botaoMusica.addEventListener(
    "click",
    async () => {

      try {

        if (!tocando) {

          await musica.play();


          tocando =
            true;


          botaoMusica.textContent =
            "❚❚ Pausar";


        } else {

          musica.pause();


          tocando =
            false;


          botaoMusica.textContent =
            "♪ Música";
        }


      } catch {

        alert(
          "Não foi possível reproduzir a música."
        );
      }
    }
  );


  musica.addEventListener(
    "ended",
    async () => {

      musicaAtual =
        (musicaAtual + 1) %
        listaMusicas.length;


      musica.src =
        listaMusicas[
          musicaAtual
        ];


      try {

        await musica.play();

        tocando =
          true;


      } catch {

        tocando =
          false;

        botaoMusica.textContent =
          "♪ Música";
      }
    }
  );
}


// =====================================================
// INSTAGRAM
// =====================================================

const botaoInstagram =
  document.getElementById(
    "instagram"
  );


if (
  botaoInstagram
) {

  botaoInstagram.addEventListener(
    "click",
    () => {

      window.location.assign(
        "https://www.instagram.com/suaestrelaguiatarot"
      );
    }
  );
}


// =====================================================
// MODO NOTURNO
// =====================================================

const botaoTema =
  document.getElementById(
    "botao-tema"
  );


const temaSistema =
  window.matchMedia
    ? window.matchMedia(
        "(prefers-color-scheme: dark)"
      )
    : null;


function aplicarTema(
  noturno
) {

  document.body.classList.toggle(
    "modo-noturno",
    noturno
  );


  if (botaoTema) {

    botaoTema.textContent =
      noturno
        ? "☀️ Modo claro"
        : "🌙 Modo noturno";
  }
}


// =====================================================
// CARREGAR TEMA
// =====================================================

let temaSalvo =
  null;


try {

  temaSalvo =
    localStorage.getItem(
      "tema"
    );

} catch (erro) {

  console.warn(
    "LocalStorage indisponível:",
    erro
  );
}


if (
  temaSalvo ===
  "noturno"
) {

  aplicarTema(
    true
  );


} else if (
  temaSalvo ===
  "claro"
) {

  aplicarTema(
    false
  );


} else {

  aplicarTema(
    temaSistema
      ? temaSistema.matches
      : false
  );
}


// =====================================================
// ALTERAÇÃO AUTOMÁTICA DO TEMA
// COMPATIBILIDADE SAFARI
// =====================================================

if (temaSistema) {

  const atualizarTemaSistema =
    (evento) => {

      let salvo =
        null;


      try {

        salvo =
          localStorage.getItem(
            "tema"
          );

      } catch {
        salvo = null;
      }


      if (!salvo) {

        aplicarTema(
          evento.matches
        );
      }
    };


  if (
    typeof temaSistema.addEventListener ===
    "function"
  ) {

    temaSistema.addEventListener(
      "change",
      atualizarTemaSistema
    );

  } else if (
    typeof temaSistema.addListener ===
    "function"
  ) {

    // Safari antigo

    temaSistema.addListener(
      atualizarTemaSistema
    );
  }
}


// =====================================================
// BOTÃO DO TEMA
// =====================================================

if (botaoTema) {

  botaoTema.addEventListener(
    "click",
    () => {

      const estaNoturno =
        document.body
          .classList
          .contains(
            "modo-noturno"
          );


      const novoTemaNoturno =
        !estaNoturno;


      aplicarTema(
        novoTemaNoturno
      );


      try {

        localStorage.setItem(
          "tema",
          novoTemaNoturno
            ? "noturno"
            : "claro"
        );

      } catch (erro) {

        console.warn(
          "Não foi possível salvar o tema:",
          erro
        );
      }
    }
  );
}


// =====================================================
// TRANSIÇÕES
// =====================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const secoes =
      document.querySelectorAll(
        "main section"
      );


    if (
      secoes.length > 0
    ) {

      secoes[0]
        .classList
        .add(
          "revelar",
          "ativo"
        );
    }


    if (
      "IntersectionObserver"
      in window
    ) {

      const observador =
        new IntersectionObserver(
          (entradas) => {

            entradas.forEach(
              (entrada) => {

                if (
                  entrada.isIntersecting
                ) {

                  entrada.target
                    .classList
                    .add(
                      "ativo"
                    );


                  observador.unobserve(
                    entrada.target
                  );
                }
              }
            );
          },
          {
            threshold:
              0.08,

            rootMargin:
              "0px 0px -30px 0px"
          }
        );


      secoes.forEach(
        (secao, indice) => {

          secao.classList.add(
            "revelar"
          );


          if (
            indice > 0
          ) {

            observador.observe(
              secao
            );
          }
        }
      );


    } else {

      secoes.forEach(
        (secao) => {

          secao.classList.add(
            "revelar",
            "ativo"
          );
        }
      );
    }
  }
);


// =====================================================
// MENSAGEM DENTRO DO CAMPO DATA
// =====================================================

const mensagemData =
  document.getElementById(
    "mensagem-data"
  );


if (
  dia &&
  mensagemData
) {

  function atualizarMensagemData() {

    mensagemData.style.display =
      dia.value
        ? "none"
        : "block";
  }


  dia.addEventListener(
    "change",
    atualizarMensagemData
  );


  dia.addEventListener(
    "input",
    atualizarMensagemData
  );


  atualizarMensagemData();
}
// =====================================================
// AJUSTES FINAIS — ESTRELA GUIA TAROT
// 1. OUTRAS CIDADES: MÍNIMO 2 DIAS
// 2. ESCONDER "AGENDAR AGORA" NO AGENDAMENTO
// =====================================================


// =====================================================
// OUTRAS CIDADES — VERIFICAR ANTECEDÊNCIA
// =====================================================

function atendimentoOutraCidade() {

  if (!modalidade) {
    return false;
  }

  return modalidade.value
    .toLowerCase()
    .includes("outra cidade");
}


function dataComDoisDiasAntecedencia() {

  if (!dia || !dia.value) {
    return false;
  }

  const partes =
    dia.value.split("-");

  if (partes.length !== 3) {
    return false;
  }

  const dataEscolhida =
    new Date(
      Number(partes[0]),
      Number(partes[1]) - 1,
      Number(partes[2]),
      0,
      0,
      0,
      0
    );


  const hoje =
    new Date();

  hoje.setHours(
    0,
    0,
    0,
    0
  );


  const dataMinima =
    new Date(hoje);

  dataMinima.setDate(
    dataMinima.getDate() + 2
  );


  return (
    dataEscolhida >= dataMinima
  );
}


// =====================================================
// AVISO VISUAL — OUTRAS CIDADES
// =====================================================

function atualizarAvisoOutraCidade() {

  if (
    !modalidade ||
    !formulario
  ) {
    return;
  }


  let aviso =
    document.getElementById(
      "aviso-outra-cidade"
    );


  if (
    atendimentoOutraCidade()
  ) {

    if (!aviso) {

      aviso =
        document.createElement("div");

      aviso.id =
        "aviso-outra-cidade";

      aviso.style.margin =
        "16px 0";

      aviso.style.padding =
        "15px";

      aviso.style.borderRadius =
        "10px";

      aviso.style.background =
        "#fff4d6";

      aviso.style.color =
        "#5d4314";

      aviso.style.lineHeight =
        "1.5";

      aviso.style.fontWeight =
        "600";


      aviso.textContent =
        "🚗 Atendimento em outras cidades deve ser solicitado com no mínimo 2 dias de antecedência, para verificar disponibilidade e valor do deslocamento.";


      modalidade
        .closest("label")
        .insertAdjacentElement(
          "afterend",
          aviso
        );
    }

  } else {

    if (aviso) {
      aviso.remove();
    }
  }
}


if (modalidade) {

  modalidade.addEventListener(
    "change",
    atualizarAvisoOutraCidade
  );


  atualizarAvisoOutraCidade();
}


// =====================================================
// BLOQUEAR OUTRA CIDADE COM MENOS DE 2 DIAS
// =====================================================

if (formulario) {

  formulario.addEventListener(
    "submit",
    function (evento) {

      if (
        !atendimentoOutraCidade()
      ) {
        return;
      }


      if (
        !dataComDoisDiasAntecedencia()
      ) {

        evento.preventDefault();

        evento.stopImmediatePropagation();


        alert(
          "Para atendimento em outra cidade, o agendamento deve ser solicitado com no mínimo 2 dias de antecedência, para verificar disponibilidade e valor do deslocamento."
        );


        if (dia) {

          dia.focus();

          dia.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }


        return false;
      }

    },
    true
  );
}


// =====================================================
// BOTÃO FIXO "AGENDAR AGORA"
// =====================================================

(function corrigirBotaoAgendarFixo() {

  const botao =
    document.querySelector(
      ".agendar-fixo"
    );

  const secao =
    document.getElementById(
      "agendamento"
    );


  if (
    !botao ||
    !secao
  ) {
    return;
  }


  // Transição suave

  botao.style.transition =
    "opacity 0.2s ease";


  function atualizarBotao() {

    const area =
      secao.getBoundingClientRect();


    const alturaTela =
      window.innerHeight ||
      document.documentElement.clientHeight;


    /*
      Consideramos que a pessoa entrou
      no agendamento assim que qualquer
      parte relevante da seção aparece
      na tela.
    */

    const agendamentoVisivel =
      area.top < alturaTela &&
      area.bottom > 0;


    if (agendamentoVisivel) {

      botao.style.opacity =
        "0";

      botao.style.visibility =
        "hidden";

      botao.style.pointerEvents =
        "none";

      botao.setAttribute(
        "aria-hidden",
        "true"
      );

    } else {

      botao.style.opacity =
        "1";

      botao.style.visibility =
        "visible";

      botao.style.pointerEvents =
        "auto";

      botao.removeAttribute(
        "aria-hidden"
      );
    }
  }


  window.addEventListener(
    "scroll",
    atualizarBotao,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    atualizarBotao
  );


  window.addEventListener(
    "orientationchange",
    function () {

      setTimeout(
        atualizarBotao,
        250
      );
    }
  );


  document.addEventListener(
    "focusin",
    function (evento) {

      if (
        secao.contains(
          evento.target
        )
      ) {

        botao.style.opacity =
          "0";

        botao.style.visibility =
          "hidden";

        botao.style.pointerEvents =
          "none";
      }
    }
  );


  atualizarBotao();

})();

// =====================================================
// FIM DO SCRIPT
// =====================================================
