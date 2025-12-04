/*
 * Arquivo: appGLOBAL.js
 * DESCRIÇÃO: Funcionalidades globais (Menu Dropdown, inicializações comuns).
 */

document.addEventListener("DOMContentLoaded", () => {
  
  /* <----- Inicio da Lógica do Menu Dropdown -----> */
  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  if (botaoMenu && menuSuspenso) {
    botaoMenu.addEventListener("click", (evento) => {
      evento.stopPropagation();
      menuSuspenso.classList.toggle("ativo");
      
      const estaAberto = menuSuspenso.classList.contains("ativo");
      botaoMenu.setAttribute("aria-expanded", estaAberto);
    });

    // Fecha o menu ao clicar fora
    document.addEventListener("click", () => {
      if (menuSuspenso.classList.contains("ativo")) {
        menuSuspenso.classList.remove("ativo");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });
  }
  /* <-----aqui termina o Menu Dropdown-----> */

  console.log("App Global (appGLOBAL.js) carregado com sucesso.");
});