/*
 * Arquivo: appGLOBAL.js
 * DESCRIÇÃO: Funcionalidades globais + Injeção do Modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  
  /* <----- Inicio do Menu Dropdown -----> */
  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  if (botaoMenu && menuSuspenso) {
    botaoMenu.addEventListener("click", (evento) => {
      evento.stopPropagation();
      menuSuspenso.classList.toggle("ativo");
      const estaAberto = menuSuspenso.classList.contains("ativo");
      botaoMenu.setAttribute("aria-expanded", estaAberto);
    });

    document.addEventListener("click", () => {
      if (menuSuspenso.classList.contains("ativo")) {
        menuSuspenso.classList.remove("ativo");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });
  }
  /* <-----aqui termina o Menu Dropdown-----> */

  /* <----- Inicio da Injeção do Modal -----> */
  // Garanti que o botão Sim tenha texto claro
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
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  /* <-----aqui termina a Injeção do Modal-----> */

  console.log("App Global carregado.");
});

/* <----- Inicio da Lógica de Confirmação -----> */
let acaoConfirmadaAtual = null;

function mostrarConfirmacao(mensagem, funcaoParaExecutar) {
  const modal = document.getElementById('modal-confirmacao');
  const texto = document.getElementById('texto-confirmacao');
  const btnConfirmar = document.getElementById('btn-confirmar-acao');
  const btnCancelar = document.getElementById('btn-cancelar-confirmacao');

  if (!modal) return;

  texto.textContent = mensagem;
  acaoConfirmadaAtual = funcaoParaExecutar;
  modal.classList.add('ativo');

  // Removemos event listeners antigos clonando o botão ou apenas reatribuindo onclick
  btnConfirmar.onclick = function() {
    if (acaoConfirmadaAtual) acaoConfirmadaAtual(); 
    modal.classList.remove('ativo'); 
    acaoConfirmadaAtual = null; 
  };

  btnCancelar.onclick = function() {
    modal.classList.remove('ativo'); 
    acaoConfirmadaAtual = null; 
  };
}
/* <-----aqui termina a Lógica de Confirmação-----> */