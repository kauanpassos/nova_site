/*
 * Arquivo: script.js (da Pasta meimei)
 * Descrição: Lógica de Chatbot com "Persona" de Coach (Sem Emojis).
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* <----- Inicio da Inicialização de Variáveis -----> */
    const chatWindow = document.getElementById("chat-window");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message-input");

    let contextoAtual = null; 
    let dadosCalculadora = { custo: 0, lucro: 0 };
    /* <-----aqui termina a Inicialização de Variáveis-----> */

    if (!chatForm || !chatWindow || !messageInput) return;

    /* <----- Inicio do Listener de Envio -----> */
    chatForm.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const texto = messageInput.value.trim();
        if (texto === "") return;

        adicionarMensagem('usuario', texto);
        messageInput.value = "";
        processarRespostaIA(texto);
    });
    /* <-----aqui termina o Listener de Envio-----> */

    /* <----- Inicio das Funções de Mensagem -----> */
    function adicionarMensagem(remetente, texto, digitando = false) {
        const div = document.createElement('div');
        div.classList.add('mensagem', remetente === 'usuario' ? 'mensagem-usuario' : 'mensagem-ia');
        if (digitando) div.classList.add('digitando');
        div.innerHTML = `<p>${texto.replace(/\n/g, '<br>')}</p>`;
        chatWindow.appendChild(div);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return div;
    }

    function processarRespostaIA(textoUsuario) {
        const divDigitando = adicionarMensagem('ia', 'MeiMei está digitando...', true);
        setTimeout(() => {
            divDigitando.remove();
            const resposta = gerarRespostaInteligente(textoUsuario);
            adicionarMensagem('ia', resposta);
        }, 1200);
    }
    /* <-----aqui termina as Funções de Mensagem-----> */

    /* <----- Inicio do Cérebro da MeiMei -----> */
    function gerarRespostaInteligente(texto) {
        const t = texto.toLowerCase();

        // 1. FLUXO: CALCULADORA DE PREÇO
        if (t.includes("calcular preço") || t.includes("ajude a calcular") || contextoAtual === 'perguntando_custo') {
            
            if (contextoAtual === 'perguntando_custo') {
                const numero = parseFloat(t.replace(/[^0-9.,]/g, '').replace(',', '.'));
                if (!isNaN(numero)) {
                    dadosCalculadora.custo = numero;
                    contextoAtual = 'perguntando_lucro'; 
                    return "Entendido. O custo material foi de <strong>R$ " + numero.toFixed(2) + "</strong>.<br><br>Agora, quanto de lucro você quer ter? (Ex: 50%, 100% ou 'o dobro')";
                } else {
                    return "Não entendi o valor. Pode digitar apenas o número? (Ex: 50,00)";
                }
            }

            if (contextoAtual === 'perguntando_lucro') {
                 let margem = 100; 
                 const numero = parseFloat(t.replace(/[^0-9]/g, ''));
                 if (!isNaN(numero)) margem = numero;
                 const precoFinal = dadosCalculadora.custo * (1 + (margem / 100));
                 contextoAtual = null; 
                 return `<strong>Cálculo Pronto!</strong><br>
                 Para ter ${margem}% de lucro sobre o custo de R$ ${dadosCalculadora.custo.toFixed(2)}, você deve vender por:<br><br>
                 <span style="font-size: 1.2rem; color: #ffd700; font-weight: bold;">R$ ${precoFinal.toFixed(2)}</span><br><br>
                 Dica de Coach: Se o mercado cobrar mais caro, você pode aumentar esse preço e lucrar mais!`;
            }

            contextoAtual = 'perguntando_custo';
            return "Adoro falar de números! Para eu calcular o preço ideal, me diga primeiro: <br><strong>Qual foi o custo total dos materiais</strong> para fazer esse produto/serviço?";
        }

        // 2. DICAS DE MARKETING
        if (t.includes("marketing") || t.includes("instagram") || t.includes("post")) {
            const dicas = [
                "<strong>Ideia de Post:</strong> Tire uma foto dos bastidores! Mostre você trabalhando. Clientes amam ver o processo.",
                "<strong>Dica de Vídeo:</strong> Faça um vídeo curto respondendo a dúvida mais comum dos seus clientes.",
                "<strong>Engajamento:</strong> Poste uma enquete nos stories: 'Qual cor vocês preferem para o próximo produto?'"
            ];
            return dicas[Math.floor(Math.random() * dicas.length)];
        }

        // 3. COBRANÇA
        if (t.includes("cobrar") || t.includes("caloteiro") || t.includes("deve")) {
            return "Cobrar é delicado, mas necessário. Tente mandar assim:<br><br><em>'Olá [Nome]! Tudo bem? Estou fechando o caixa do mês e vi que seu pagamento ficou pendente. Consegue fazer o Pix hoje para eu dar baixa aqui? Obrigado!'</em><br><br>É educado, mas firme.";
        }

        // 4. SAUDAÇÕES
        if (t.includes("olá") || t.includes("oi") || t.includes("tudo bem")) {
            return "Olá! Sou sua mentora de negócios. Estou pronta para ajudar você a ganhar mais dinheiro hoje. Vamos calcular um preço ou planejar um post?";
        }

        return "Interessante! Como sou um protótipo, ainda estou aprendendo sobre isso. Mas tente clicar nos botões acima para ver o que eu já sei fazer!";
    }
    /* <-----aqui termina o Cérebro da MeiMei-----> */
});