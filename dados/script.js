/*
 * Arquivo: script.js (da Pasta dados)
 * Descrição: Este arquivo controla as partes interativas da "dados.html".
 * Tarefas:
 * 1. Fazer o Menu Suspenso (Dropdown) abrir e fechar com clique.
 */

// Espera todo o HTML da página carregar antes de executar qualquer código.
document.addEventListener("DOMContentLoaded", () => {
  // --- TAREFA 1: LÓGICA DO MENU SUSPENSO (DROPDOWN) ---
  // (Esta lógica é idêntica à das outras pastas)

  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  // Só executa se o botão do menu existir na página
  if (botaoMenu) {
    // Adiciona um "escutador de clique" no botão
    botaoMenu.addEventListener("click", (evento) => {
      // Impede que o clique se espalhe para outros elementos
      evento.stopPropagation();

      // Adiciona ou remove a classe "ativo" no menu
      menuSuspenso.classList.toggle("ativo");

      // Atualiza a acessibilidade
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

  console.log("Script da Página de Dados carregado com sucesso!");
});