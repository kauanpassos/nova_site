
document.addEventListener("DOMContentLoaded", () => {
  const filtroPeriodo = document.getElementById("filtro-periodo");
  let graficoReceita;

  /* <----- Inicio da Configuração do Gráfico (ApexCharts) -----> */
  function iniciarGraficoRelatorio(dadosGrafico) {
    const containerGrafico = document.querySelector("#grafico-barra-receita");

    if (!containerGrafico) return;
    if (typeof ApexCharts === "undefined") {
      containerGrafico.innerHTML = "<p>Erro ao carregar gráfico.</p>";
      return;
    }

    const corPrincipal = getComputedStyle(document.documentElement).getPropertyValue("--cor-principal").trim();
    const corFundoMedio = getComputedStyle(document.documentElement).getPropertyValue("--fundo-medio").trim();
    const corTexto = getComputedStyle(document.documentElement).getPropertyValue("--cor-texto").trim();

    const opcoes = {
      series: [{
          name: "Receita",
          data: dadosGrafico.valores,
      }],
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
        categories: dadosGrafico.meses, 
        labels: { style: { colors: corTexto } },
      },
      yaxis: {
        labels: {
          style: { colors: corTexto },
          formatter: (valor) => "R$ " + (valor / 1000).toFixed(0) + "k",
        },
      },
      grid: { borderColor: corFundoMedio },
      tooltip: {
        theme: "dark",
        y: { formatter: (valor) => valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' }) },
      },
    };

    graficoReceita = new ApexCharts(containerGrafico, opcoes);
    graficoReceita.render();
  }
  /* <-----aqui termina a Configuração do Gráfico-----> */


  /* <----- Inicio do Preenchimento de Resumos -----> */
  function preencherResumos(dadosResumo) {
    const formatador = (valor) => valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });

    document.getElementById("resumo-receita").textContent = formatador(dadosResumo.receita);
    document.getElementById("resumo-despesa").textContent = formatador(dadosResumo.despesa);
    document.getElementById("resumo-lucro").textContent = formatador(dadosResumo.lucro);

    document.getElementById("resumo-receita-detalhe").textContent = "+5% vs. período anterior";
    document.getElementById("resumo-despesa-detalhe").textContent = "-2% vs. período anterior";
    document.getElementById("resumo-lucro-detalhe").textContent = `Margem de ${dadosResumo.margem}%`;
  }
  /* <-----aqui termina o Preenchimento de Resumos-----> */


  /* <----- Inicio da Carga de Dados (Simulada) -----> */
  function carregarDadosRelatorio(periodo) {
    
    // Simulação de dados
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
  }
  /* <-----aqui termina a Carga de Dados-----> */

  carregarDadosRelatorio(filtroPeriodo.value);

  filtroPeriodo.addEventListener("change", () => {
    carregarDadosRelatorio(filtroPeriodo.value);
  });
  
  console.log("Script de Relatórios carregado!");
});