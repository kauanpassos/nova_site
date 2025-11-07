/*
 * Arquivo: script.js (da Pasta inicio)
 * Descrição: Este arquivo controla as partes interativas da "pagina.html".
 * Tarefas:
 * 1. Fazer o Menu Suspenso (Dropdown) abrir e fechar com clique.
 * 2. Calcular o progresso da meta e atualizar as barras e o gráfico.
 */

// Espera todo o HTML da página carregar antes de executar qualquer código.
document.addEventListener("DOMContentLoaded", () => {
  // --- TAREFA 1: LÓGICA DO MENU SUSPENSO (DROPDOWN) ---

  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  // Só executa se o botão do menu existir na página
  if (botaoMenu) {
    // Adiciona um "escutador de clique" no botão
    botaoMenu.addEventListener("click", (evento) => {
      // Impede que o clique se espalhe para outros elementos
      evento.stopPropagation();

      // Adiciona ou remove a classe "ativo" no menu
      // O CSS cuida de mostrar ou esconder o menu baseado nessa classe.
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

  // --- TAREFA 2: ATUALIZAR O PAINEL DE PROGRESSO ---

  // Esta função pega os valores da tela e atualiza o progresso
  function atualizarProgresso() {
    // 1. Encontrar os elementos no HTML
    const painel = document.querySelector(".painel");
    const elementoMeta = document.getElementById("meta-lucro");
    const elementoLucro = document.getElementById("lucro-atual");
    const textoGrafico = document.querySelector(".grafico__texto");

    // Verifica se os elementos necessários existem antes de continuar
    if (!painel || !elementoMeta || !elementoLucro || !textoGrafico) {
      console.error(
        "Erro: Elementos do painel não encontrados. Verifique os IDs no HTML."
      );
      return; // Para a execução se algo estiver faltando
    }

    // 2. Pegar os valores de texto (ex: "R$ 5.000,00")
    const textoMeta = elementoMeta.textContent;
    const textoLucro = elementoLucro.textContent;

    // 3. Limpar e converter os textos para números
    // (Remove "R$", " ", ".")
    const valorMeta = parseFloat(
      textoMeta.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );
    const valorLucro = parseFloat(
      textoLucro.replace("R$", "").replace(/\./g, "").replace(",", ".")
    );

    // 4. Calcular a porcentagem (ex: 3000 / 5000 = 0.6)
    let porcentagem = 0;
    if (valorMeta > 0) {
      porcentagem = (valorLucro / valorMeta) * 100;
    }

    // Garante que a porcentagem não passe de 100
    if (porcentagem > 100) {
      porcentagem = 100;
    }

    // Arredonda o número (ex: 60)
    const porcentagemArredondada = Math.round(porcentagem);

    // 5. Atualizar o CSS e o Texto
    // Define a variável "--porcentagem" no CSS para 60
    // O CSS usa isso para desenhar a barra e o círculo.
    painel.style.setProperty("--porcentagem", porcentagemArredondada);

    // Atualiza o texto do gráfico para "60%"
    textoGrafico.textContent = `${porcentagemArredondada}%`;
  }

  // 🚀 Chama a função para executar assim que a página carrega
  atualizarProgresso();

  console.log("Script da Página Inicial carregado com sucesso!");
});