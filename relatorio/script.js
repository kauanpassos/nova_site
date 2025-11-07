/*
 * Arquivo: script.js (da Pasta relatorio)
 * Descrição: Este arquivo controla as partes interativas da "relatorio.html".
 * Tarefas:
 * 1. Fazer o Menu Suspenso (Dropdown) abrir e fechar com clique.
 * 2. Iniciar o gráfico de barras (ApexCharts) com dados de exemplo.
 */

// Espera todo o HTML da página carregar antes de executar qualquer código.
document.addEventListener("DOMContentLoaded", () => {
  // --- TAREFA 1: LÓGICA DO MENU SUSPENSO (DROPDOWN) ---
  // (Esta lógica é idêntica à da pasta_inicio)

  const menuSuspenso = document.querySelector(".menu-suspenso");
  const botaoMenu = document.querySelector(".menu-suspenso__botao");

  if (botaoMenu) {
    botaoMenu.addEventListener("click", (evento) => {
      evento.stopPropagation();
      menuSuspenso.classList.toggle("ativo");
      const estaAberto = menuSuspenso.classList.contains("ativo");
      botaoMenu.setAttribute("aria-expanded", estaAberto);
    });
  }

  document.addEventListener("click", () => {
    if (menuSuspenso && menuSuspenso.classList.contains("ativo")) {
      menuSuspenso.classList.remove("ativo");
      botaoMenu.setAttribute("aria-expanded", "false");
    }
  });

  // --- TAREFA 2: INICIAR O GRÁFICO DE BARRAS ---

  function iniciarGraficoRelatorio() {
    const containerGrafico = document.querySelector("#grafico-barra-receita");

    // 1. Verifica se o elemento do gráfico existe na página
    if (!containerGrafico) {
      console.log("Container do gráfico não encontrado.");
      return;
    }

    // 2. Verifica se a biblioteca ApexCharts foi carregada
    if (typeof ApexCharts === "undefined") {
      console.error("Erro: A biblioteca ApexCharts não foi carregada.");
      containerGrafico.innerHTML =
        "<p>Erro ao carregar o gráfico. Tente recarregar a página.</p>";
      return;
    }

    // 3. Pega os valores das variáveis CSS para usar no gráfico
    // (Isso garante que o gráfico use as mesmas cores do site)
    const corPrincipal = getComputedStyle(document.documentElement)
      .getPropertyValue("--cor-principal")
      .trim();
    const corFundoMedio = getComputedStyle(document.documentElement)
      .getPropertyValue("--fundo-medio")
      .trim();
    const corTexto = getComputedStyle(document.documentElement)
      .getPropertyValue("--cor-texto")
      .trim();

    // 4. Dados de exemplo para o gráfico
    const dadosGrafico = {
      meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      valores: [5200, 6100, 4800, 7200, 5900, 8100],
    };

    // 5. Opções de configuração do gráfico
    const opcoes = {
      // Define a série de dados
      series: [
        {
          name: "Receita",
          data: dadosGrafico.valores,
        },
      ],
      // Configurações do gráfico em si
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false, // Esconde a barra de ferramentas (zoom, etc.)
        },
      },
      // Cores
      colors: [corPrincipal], // Usa a cor dourada do CSS
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: "50%",
        },
      },
      dataLabels: {
        enabled: false, // Não mostra valores em cima das barras
      },
      // Eixo X (Horizontal)
      xaxis: {
        categories: dadosGrafico.meses,
        labels: {
          style: {
            colors: corTexto, // Cor do texto dos meses
            fontFamily: "Sora, sans-serif",
          },
        },
      },
      // Eixo Y (Vertical)
      yaxis: {
        labels: {
          style: {
            colors: corTexto, // Cor do texto dos valores
            fontFamily: "Sora, sans-serif",
          },
          // Formata o valor (ex: R$ 5k)
          formatter: (valor) => {
            return "R$ " + (valor / 1000).toFixed(0) + "k";
          },
        },
      },
      // Linhas de grade (fundo)
      grid: {
        borderColor: corFundoMedio, // Cor das linhas
      },
      // Dica (tooltip) ao passar o mouse
      tooltip: {
        theme: "dark", // Usa o tema escuro
        y: {
          // Formata o valor na dica (ex: R$ 5.200,00)
          formatter: (valor) => {
            return (
              "R$ " +
              valor.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          },
        },
      },
    };

    // 6. Cria e desenha o gráfico
    const grafico = new ApexCharts(containerGrafico, opcoes);
    grafico.render();
  }

  // 🚀 Chama a função para iniciar o gráfico
  iniciarGraficoRelatorio();

  console.log("Script da Página de Relatórios carregado com sucesso!");
});