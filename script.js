// Estado Inicial do Jogo
let produtividade = 50;
let sustentabilidade = 50;
let moedas = 1000;
let turnoAtual = 0;

// Banco de dados de eventos (Decisões baseadas no tema real do Agrinho)
const eventos = [
    {
        titulo: "Escolha de Cultivo inicial",
        descricao: "Uma nova safra está para começar. Como você planeja o plantio?",
        opcoes: [
            {
                texto: "Praticar monocultura intensa (focar apenas em um grão de alta venda).",
                custo: 200, prod: +30, sust: -20,
                feedback: "Seu lucro inicial é alto, mas o solo perdeu nutrientes e ficou vulnerável a pragas."
            },
            {
                texto: "Adotar a Rotação de Culturas (alternar soja, milho e leguminosas).",
                custo: 300, prod: +15, sust: +20,
                feedback: "Excelente! A rotação fixou nitrogênio no solo naturalmente, mantendo a terra fértil."
            }
        ]
    },
    {
        titulo: "Manejo de Pragas",
        descricao: "Insetos ameaçam a lavoura de inverno. Qual caminho seguir?",
        opcoes: [
            {
                texto: "Aplicar defensivos químicos pesados e genéricos calendarizados.",
                custo: 150, prod: +25, sust: -25,
                feedback: "As pragas sumiram rápido, mas você eliminou polinizadores e contaminou o riacho próximo."
            },
            {
                texto: "Implementar o MIP (Manejo Integrado de Pragas) e controle biológico.",
                custo: 250, prod: +15, sust: +25,
                feedback: "Usando inteligência e predadores naturais, você protegeu a safra sem agredir a fauna local."
            }
        ]
    },
    {
        titulo: "Gestão da Água",
        descricao: "O período de seca se aproxima no Paraná. Como preparar a irrigação?",
        opcoes: [
            {
                texto: "Manter irrigação por inundação contínua puxada do rio.",
                custo: 100, prod: +20, sust: -20,
                feedback: "A água sobrou na planta, mas causou desperdício crítico e erosão nas margens do rio."
            },
            {
                texto: "Instalar gotejamento automatizado com sensores de umidade.",
                custo: 400, prod: +25, sust: +20,
                feedback: "Tecnologia pura! Água na quantidade exata direto na raiz. Economia e eficiência andam juntas."
            }
        ]
    },
    {
        titulo: "Matriz Energética",
        descricao: "O custo da energia elétrica subiu. De onde virá a força da fazenda?",
        opcoes: [
            {
                texto: "Continuar dependente da rede padrão e geradores a diesel.",
                custo: 100, prod: +5, sust: -10,
                feedback: "Opção barata no curto prazo, mas poluente e cara devido às bandeiras tarifárias."
            },
            {
                texto: "Investir em Painéis Solares e usina de Biogás com dejetos animais.",
                custo: 500, prod: +20, sust: +30,
                feedback: "O agro também produz energia! Sua fazenda agora é autossustentável e emite menos carbono."
            }
        ]
    },
    {
        titulo: "Preservação e Leis",
        descricao: "Fiscais ambientais lembram sobre as Áreas de Preservação Permanente (APP).",
        opcoes: [
            {
                texto: "Desmatar a margem do rio para ganhar mais alguns metros de plantio.",
                custo: -200, prod: +20, sust: -40, // ganha dinheiro imediato
                feedback: "Crime ambiental grave! Além de multado, a falta da mata ciliar causou assoreamento do rio."
            },
            {
                texto: "Reforestar a mata ciliar e cercar as áreas de reserva legal.",
                custo: 300, prod: +5, sust: +45,
                feedback: "Orgulho para o Agrinho! A biodiversidade voltou e sua fazenda ganhou selo verde internacional."
            }
        ]
    }
];

// Elementos da Interface
const elProdutividade = document.getElementById("bar-produtividade");
const elSustentabilidade = document.getElementById("bar-sustentabilidade");
const txtProdutividade = document.getElementById("val-produtividade");
const txtSustentabilidade = document.getElementById("val-sustentabilidade");
const txtMoedas = document.getElementById("val-moedas");
const txtTurno = document.getElementById("val-turno");

const eventTitle = document.getElementById("event-title");
const eventDesc = document.getElementById("event-desc");
const optionsContainer = document.getElementById("options-container");
const feedbackBox = document.getElementById("feedback-box");
const feedbackText = document.getElementById("feedback-text");

// Atualiza as barras e textos na tela
function atualizarInterface() {
    // Limitar valores entre 0 e 100
    produtividade = Math.max(0, Math.min(100, produtividade));
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));

    elProdutividade.style.width = produtividade + "%";
    elSustentabilidade.style.width = sustentabilidade + "%";
    
    txtProdutividade.innerText = produtividade + "%";
    txtSustentabilidade.innerText = sustentabilidade + "%";
    txtMoedas.innerText = "R$ " + moedas;
    txtTurno.innerText = (turnoAtual + 1) + " / " + eventos.length;
}

// Carrega o evento atual ou finaliza o jogo
function carregarRodada() {
    atualizarInterface();

    // Verificação de derrota imediata
    if (produtividade <= 0) {
        finalizarJogo("Falência! Sua produtividade zerou e a fazenda não conseguiu se pagar. O agro precisa ser forte!");
        return;
    }
    if (sustentabilidade <= 0) {
        finalizarJogo("Desastre Ecológico! A sustentabilidade zerou. A terra ficou estéril e os recursos locais esgotaram.");
        return;
    }

    // Se passou de todos os eventos, venceu
    if (turnoAtual >= eventos.length) {
        calcularResultadoFinal();
        return;
    }

    // Carregar dados do evento corrente
    let ev = eventos[turnoAtual];
    eventTitle.innerText = ev.titulo;
    eventDesc.innerText = ev.descricao;
    optionsContainer.innerHTML = "";

    // Criar botões de escolha dinamicamente
    ev.opcoes.forEach((opcao, index) => {
        let btn = document.createElement("button");
        btn.innerText = `${opcao.texto} (Custo: R$ ${opcao.custo})`;
        btn.onclick = () => fazerEscolha(index);
        optionsContainer.appendChild(btn);
    });
}

// Processa a escolha selecionada pelo usuário
function fazerEscolha(indexOpcao) {
    let opcao = eventos[turnoAtual].opcoes[indexOpcao];

    // Aplicar as consequências econômicas e ecológicas
    moedas -= opcao.custo;
    produtividade += opcao.prod;
    sustentabilidade += opcao.sust;

    // Mostrar feedback
    feedbackBox.classList.remove("hidden");
    feedbackText.innerText = opcao.feedback;

    // Avançar turno
    turnoAtual++;
    
    // Pequena pausa para o jogador ler o feedback antes da nova rodada
    setTimeout(() => {
        feedbackBox.classList.add("hidden");
        carregarRodada();
    }, 4500);
}

// Tela de encerramento por colapso (Derrota)
function finalizarJogo(mensagem) {
    eventTitle.innerText = "Fim de Jogo";
    eventDesc.innerText = mensagem;
    optionsContainer.innerHTML = '<button onclick="reiniciarJogo()">Tentar Novamente</button>';
}

// Tela de encerramento com avaliação de desempenho (Vitória)
function calcularResultadoFinal() {
    eventTitle.innerText = "Safra Concluída!";
    let balancoFinal = (produtividade + sustentabilidade) / 2;
    
    let mensagemMetfora = "";
    if (balancoFinal >= 75) {
        mensagemMetfora = "Excelente! Você provou que o Agro Forte e o Futuro Sustentável caminham juntos. Sua fazenda é o modelo perfeito do Agrinho!";
    } else if (balancoFinal >= 50) {
        mensagemMetfora = "Bom trabalho! Sua fazenda é lucrativa, mas ainda pode melhorar o equilíbrio ecológico e adotar mais tecnologias verdes.";
    } else {
        mensagemMetfora = "Você terminou a rodada raspando. A fazenda sobreviveu, mas sacrificou muito o meio ambiente ou a rentabilidade.";
    }

    eventDesc.innerText = `Pontuação Média de Sustentabilidade/Produtividade: ${balancoFinal.toFixed(0)}%.\nSaldo Final: R$ ${moedas}.\n\n${mensagemMetfora}`;
    optionsContainer.innerHTML = '<button onclick="reiniciarJogo()">Jogar Novamente</button>';
}

// Reseta as variáveis para começar de novo
function reiniciarJogo() {
    produtividade = 50;
    sustentabilidade = 50;
    moedas = 1000;
    turnoAtual = 0;
    feedbackBox.classList.add("hidden");
    carregarRodada();
}

// Inicialização automática do game ao abrir a página
window.onload = carregarRodada;
