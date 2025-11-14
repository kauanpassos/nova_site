/*
 * Arquivo: appGLOBAL.js (GLOBAL)
 * Descrição: Este arquivo controla interações globais do site.
 * Tarefa:
 * 1. Fazer o Menu Suspenso (Dropdown) abrir e fechar.
 */

// Espera todo o HTML da página carregar
document.addEventListener("DOMContentLoaded", () => {
  
  // --- LÓGICA DO MENU SUSPENSO (DROPDOWN) ---
  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  if (botaoMenu) {
    botaoMenu.addEventListener("click", (evento) => {
      // Impede que o clique se espalhe para outros elementos
      evento.stopPropagation(); 
      
      // Adiciona ou remove a classe "ativo" no menu
      menuSuspenso.classList.toggle("ativo");

      // Atualiza a acessibilidade (bom para leitores de tela)
      const estaAberto = menuSuspenso.classList.contains("ativo");
      botaoMenu.setAttribute("aria-expanded", estaAberto);
    });
  }

  // Escutador para fechar o menu se clicar em qualquer lugar FORA dele
  document.addEventListener("click", () => {
    if (menuSuspenso && menuSuspenso.classList.contains("ativo")) {
      menuSuspenso.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
    }
  });
  
  console.log("App global (appGLOBAL.js) carregado.");

});