/*
 * Arquivo: script.js (da Pasta relatorio)
 * Descrição: Inicia o gráfico de barras (ApexCharts).
 * Tarefas:
 * 1. (Menu Suspenso já está no appGLOBAL.js)
 * 2. Buscar dados (simulado) e iniciar o gráfico.
 * 3. Buscar dados (simulado) e preencher os resumos.
 */

document.addEventListener("DOMContentLoaded", () => {
  const filtroPeriodo = document.getElementById("filtro-periodo");
  
  // Variável para guardar o gráfico e podermos atualizar depois
  let graficoReceita;

  function iniciarGraficoRelatorio(dadosGrafico) {
    const containerGrafico = document.querySelector("#grafico-barra-receita");

    if (!containerGrafico) return;
    if (typeof ApexCharts === "undefined") {
      console.error("Erro: A biblioteca ApexCharts não foi carregada.");
      containerGrafico.innerHTML = "<p>Erro ao carregar gráfico.</p>";
      return;
    }

    // Pega os valores das variáveis CSS (que estão no global)
    const corPrincipal = getComputedStyle(document.documentElement).getPropertyValue("--cor-principal").trim();
    const corFundoMedio = getComputedStyle(document.documentElement).getPropertyValue("--fundo-medio").trim();
    const corTexto = getComputedStyle(document.documentElement).getPropertyValue("--cor-texto").trim();

    const opcoes = {
      series: [
        {
          name: "Receita",
          data: dadosGrafico.valores, // Vem dos dados
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
        fontFamily: "Sora, sans-serif",
      },
      colors: [corPrincipal],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          columnWidth: "50%",
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: dadosGrafico.meses, // Vem dos dados
        labels: {
          style: {
            colors: corTexto,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: corTexto,
          },
          formatter: (valor) => "R$ " + (valor / 1000).toFixed(0) + "k",
        },
      },
      grid: { borderColor: corFundoMedio },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (valor) => valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' }),
        },
      },
    };

    graficoReceita = new ApexCharts(containerGrafico, opcoes);
    graficoReceita.render();
  }

  // --- TAREFA 2: PREENCHER OS RESUMOS ---
  function preencherResumos(dadosResumo) {
    const formatador = (valor) => valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });

    document.getElementById("resumo-receita").textContent = formatador(dadosResumo.receita);
    document.getElementById("resumo-despesa").textContent = formatador(dadosResumo.despesa);
    document.getElementById("resumo-lucro").textContent = formatador(dadosResumo.lucro);

    document.getElementById("resumo-receita-detalhe").textContent = "+5% vs. período anterior";
    document.getElementById("resumo-despesa-detalhe").textContent = "-2% vs. período anterior";
    document.getElementById("resumo-lucro-detalhe").textContent = `Margem de ${dadosResumo.margem}%`;
  }


  // --- TAREFA 3: BUSCAR OS DADOS (Simulação) ---
  function carregarDadosRelatorio(periodo) {
    console.log(`Buscando dados do relatório para o período: ${periodo}`);

    // ==========================================================
    // AQUI CONECTA AO BANCO DE DADOS (API)
    // 
    // ex: fetch(`/api/relatorios?periodo=${periodo}`)
    //    .then(response => response.json())
    //    .then(dadosDoBanco => {
    //        // dadosDoBanco.resumo = { receita: 18500, ... }
    //        // dadosDoBanco.grafico = { meses: ['Jan',...], valores: [5200,...] }
    //        
    //        preencherResumos(dadosDoBanco.resumo);
    //
    //        if (graficoReceita) {
    //          graficoReceita.updateOptions({ // Atualiza gráfico
    //             xaxis: { categories: dadosDoBanco.grafico.meses },
    //             series: [{ data: dadosDoBanco.grafico.valores }]
    //          });
    //        } else {
    //          iniciarGraficoRelatorio(dadosDoBanco.grafico); // Cria
    //        }
    //    })
    // ==========================================================

    // ----- SIMULAÇÃO -----
    const dadosSimulados = {
      resumo: { receita: 18500.00, despesa: 4200.00, lucro: 14300.00, margem: 77 },
      grafico: {
        meses: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
        valores: [5200, 6100, 4800, 7200, 5900, 8100]
      }
    };
    
    if (periodo === 'trimestre') {
        dadosSimulados.grafico.meses = ["Abr", "Mai", "Jun"];
        dadosSimulados.grafico.valores = [7200, 5900, 8100];
        dadosSimulados.resumo = { receita: 21200.00, despesa: 5000.00, lucro: 16200.00, margem: 76 };
    }
    
    preencherResumos(dadosSimulados.resumo);
    
    if (graficoReceita) {
       graficoReceita.updateOptions({
         xaxis: { categories: dadosSimulados.grafico.meses },
         series: [{ data: dadosSimulados.grafico.valores }]
       });
    } else {
       iniciarGraficoRelatorio(dadosSimulados.grafico);
    }
    // ----- FIM DA SIMULAÇÃO -----
  }

  // 🚀 Chama a função para iniciar
  carregarDadosRelatorio(filtroPeriodo.value);

  // Adiciona um "escutador" para recarregar os dados se o filtro mudar
  filtroPeriodo.addEventListener("change", () => {
    carregarDadosRelatorio(filtroPeriodo.value);
  });
  
  console.log("Script de Relatórios (relatorio/script.js) carregado!");
});