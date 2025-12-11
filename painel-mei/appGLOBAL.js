/*
 * Arquivo: appGLOBAL.js
 * DESCRIÇÃO: Funcionalidades globais, Injeção do Modal e Segurança de Rota.
 */

/* <----- Inicio da Verificação de Segurança (Porteiro) -----> */
(function verificarLogin() {
    // 1. Identifica onde estamos
    const caminhoAtual = window.location.pathname;
    
    // 2. Define se é uma página pública (Login/Cadastro)
    // Verifica se a URL contém "/login/" (independente de ser index.html ou cadastro)
    const estaNaAreaLogin = caminhoAtual.includes("/login/");
    
    // 3. Se NÃO estiver na área de login, verifica o token
    if (!estaNaAreaLogin) {
        const token = localStorage.getItem("nova_session_token");
        
        if (!token) {
            console.warn("Usuário não autenticado. Redirecionando para login...");
            
            // Tenta redirecionar subindo um nível (../)
            // Isso funciona se estiver em: painel-mei/inicio/ ou painel-mei/perfil/
            window.location.href = "../login/index.html";
        }
    }
})();
/* <-----aqui termina a Verificação de Segurança-----> */


document.addEventListener("DOMContentLoaded", () => {
  
  /* <----- Inicio da Lógica do Menu Dropdown -----> */
  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  if (botaoMenu && menuSuspenso) {
    botaoMenu.addEventListener("click", (evento) => {
      evento.stopPropagation(); // Impede que o clique feche o menu imediatamente
      menuSuspenso.classList.toggle("ativo");
      
      const estaAberto = menuSuspenso.classList.contains("ativo");
      botaoMenu.setAttribute("aria-expanded", estaAberto);
    });

    // Fecha ao clicar fora
    document.addEventListener("click", () => {
      if (menuSuspenso.classList.contains("ativo")) {
        menuSuspenso.classList.remove("ativo");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });
  }
  /* <-----aqui termina o Menu Dropdown-----> */


  /* <----- Inicio da Injeção do HTML do Modal (Automático) -----> */
  // Cria o HTML do modal de confirmação se ele ainda não existir
  if (!document.getElementById("modal-confirmacao")) {
      const modalHTML = `
        <div class="modal" id="modal-confirmacao">
          <div class="modal-content modal-pequeno">
            <h3 id="titulo-confirmacao"><i class='bx bx-error-circle'></i> Tem certeza?</h3>
            <p id="texto-confirmacao">Você deseja realmente excluir este item?</p>
            
            <div class="modal-acoes">
              <button class="botao botao--secundario" id="btn-cancelar-confirmacao">Cancelar</button>
              <button class="botao botao--perigo" id="btn-confirmar-acao">Sim, Excluir</button>
            </div>
          </div>
        </div>
      `;
      
      // Insere no final do corpo da página com segurança
      if (document.body) {
          document.body.insertAdjacentHTML('beforeend', modalHTML);
      }
  }
  /* <-----aqui termina a Injeção do HTML-----> */

  console.log("App Global carregado com sucesso.");
});


/* <----- Inicio da Lógica Global de Confirmação (Função Exportada) -----> */
// Variável para armazenar a função de callback
let acaoConfirmadaAtual = null;

// Esta função precisa estar no escopo global (fora do DOMContentLoaded)
// para que outros scripts (lancamentos, estoque) consigam chamá-la.
window.mostrarConfirmacao = function(mensagem, funcaoParaExecutar) {
  const modal = document.getElementById('modal-confirmacao');
  const texto = document.getElementById('texto-confirmacao');
  const btnConfirmar = document.getElementById('btn-confirmar-acao');
  const btnCancelar = document.getElementById('btn-cancelar-confirmacao');

  // Segurança: Se o modal não foi injetado por algum motivo, aborta
  if (!modal || !texto || !btnConfirmar || !btnCancelar) {
      console.error("Erro: Modal de confirmação não está pronto no DOM.");
      // Fallback: usa o confirm nativo se o modal falhar
      if (confirm(mensagem)) {
          funcaoParaExecutar();
      }
      return;
  }

  // Configura o modal
  texto.textContent = mensagem;
  acaoConfirmadaAtual = funcaoParaExecutar;
  
  // Exibe
  modal.classList.add('ativo');

  // Define a ação do botão CONFIRMAR (Sim)
  btnConfirmar.onclick = function() {
    if (typeof acaoConfirmadaAtual === 'function') {
        acaoConfirmadaAtual(); // Executa a função passada (ex: deletar)
    }
    modal.classList.remove('ativo'); 
    acaoConfirmadaAtual = null; 
  };

  // Define a ação do botão CANCELAR (Não)
  btnCancelar.onclick = function() {
    modal.classList.remove('ativo'); 
    acaoConfirmadaAtual = null; 
  };
};
/* <-----aqui termina a Lógica Global de Confirmação-----> */