/*
 * Arquivo: script.js (da Pasta meimei)
 * Descrição: Controla a interface de chat.
 * Tarefas:
 * 1. (Menu Suspenso já está no appGLOBAL.js)
 * 2. Capturar o envio de mensagem do usuário.
 * 3. Adicionar a mensagem do usuário na tela.
 * 4. Simular uma resposta da IA (com o "gancho" da API).
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Encontrar os elementos
    const chatWindow = document.getElementById("chat-window");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message-input");

    if (!chatForm || !chatWindow || !messageInput) {
        console.error("Erro: Elementos do chat não encontrados.");
        return;
    }

    // 2. Escutador de envio do formulário
    chatForm.addEventListener("submit", (evento) => {
        evento.preventDefault(); // Impede o recarregamento da página

        const mensagemTexto = messageInput.value.trim();

        if (mensagemTexto === "") {
            return; // Não envia mensagem vazia
        }

        // 3. Adiciona a mensagem do usuário na tela
        adicionarMensagemNaTela('usuario', mensagemTexto);

        // 4. Limpa o input
        messageInput.value = "";

        // 5. Simula o "digitando..." e pega a resposta da IA
        simularRespostaIA(mensagemTexto);
    });

    /**
     * Adiciona um balão de mensagem na tela.
     * @param {'usuario' | 'ia'} remetente - Quem enviou a mensagem.
     * @param {string} texto - O conteúdo da mensagem.
     * @param {boolean} [digitando=false] - Se é uma mensagem de "digitando".
     */
    function adicionarMensagemNaTela(remetente, texto, digitando = false) {
        const divMensagem = document.createElement('div');
        divMensagem.classList.add('mensagem');

        if (remetente === 'usuario') {
            divMensagem.classList.add('mensagem-usuario');
        } else {
            divMensagem.classList.add('mensagem-ia');
            if (digitando) {
                divMensagem.classList.add('digitando');
            }
        }

        divMensagem.innerHTML = `<p>${texto}</p>`;
        chatWindow.appendChild(divMensagem);

        // Rola a janela para o final (para ver a última msg)
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        return divMensagem; // Retorna o elemento criado (útil para o "digitando")
    }

    // Função que simula a IA respondendo
    function simularRespostaIA(mensagemUsuario) {
        // Adiciona o balão "digitando..."
        const divDigitando = adicionarMensagemNaTela('ia', 'MeiMei está digitando...', true);

        // ==========================================================
        // AQUI CONECTA À API DA IA (ex: Gemini, OpenAI, etc.)
        // 
        // ex: fetch('/api/meimei/chat', { 
        //       method: 'POST', 
        //       headers: { 'Content-Type': 'application/json' },
        //       body: JSON.stringify({ prompt: mensagemUsuario }) 
        //    })
        //    .then(response => response.json())
        //    .then(data => {
        //        const respostaIA = data.resposta;
        //        divDigitando.remove(); // Remove o "digitando..."
        //        adicionarMensagemNaTela('ia', respostaIA);
        //    })
        //    .catch(err => {
        //        divDigitando.remove();
        //        adicionarMensagemNaTela('ia', 'Desculpe, estou com problemas para conectar. Tente novamente.');
        //    });
        // ==========================================================

        // ----- SIMULAÇÃO (Enquanto a API não vem) -----
        // Finge que a IA "pensa" por 1.5 segundos
        setTimeout(() => {
            divDigitando.remove(); // Remove o "digitando..."
            
            // Resposta "fake" baseada no que o usuário disse
            let respostaSimulada = "Entendido. Você disse: '" + mensagemUsuario + "'. Como protótipo, ainda não posso processar isso, mas estarei pronta em breve!";
            
            if (mensagemUsuario.toLowerCase().includes("olá") || mensagemUsuario.toLowerCase().includes("oi")) {
                respostaSimulada = "Olá! Como posso ajudar nos seus negócios hoje?";
            }
            if (mensagemUsuario.toLowerCase().includes("lucro")) {
                respostaSimulada = "Ótima pergunta! Para analisar seu lucro, por favor, vá para a página de 'Relatórios'. Os dados de lá são calculados com base nos seus 'Lançamentos'.";
            }
            if (mensagemUsuario.toLowerCase().includes("quem é você")) {
                respostaSimulada = "Eu sou a MeiMei, uma inteligência artificial criada para ser sua assistente pessoal de negócios. Estou aqui para te ajudar a organizar suas finanças e crescer!";
            }

            adicionarMensagemNaTela('ia', respostaSimulada);

        }, 1500);
        // ----- FIM DA SIMULAÇÃO -----
    }

    console.log("Script da MeiMei (meimei/script.js) carregado!");
});