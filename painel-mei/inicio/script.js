/*
 * Arquivo: script.js (da Pasta inicio)
 * DESCRIÇÃO: Dashboard Inteligente. Carrega dados REAIS do localStorage.
 */

document.addEventListener("DOMContentLoaded", () => {
  
    /* <----- Inicio das Funções de Leitura de Dados -----> */
    function loadLancamentos() {
        try {
            const dados = localStorage.getItem('nova_lancamentos_v1');
            return dados ? JSON.parse(dados) : [];
        } catch (e) { return []; }
    }

    function loadEstoque() {
        try {
            const dados = localStorage.getItem('nova_estoque_v1');
            return dados ? JSON.parse(dados) : [];
        } catch (e) { return []; }
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    /* <-----aqui termina as Funções de Leitura de Dados-----> */

    /* <----- Inicio da Lógica do Painel de Metas -----> */
    function atualizarProgresso(meta, lucro) {
        const painel = document.querySelector(".painel");
        const elementoMeta = document.getElementById("meta-lucro");
        const elementoLucro = document.getElementById("lucro-atual");
        const textoGrafico = document.querySelector(".grafico__texto");

        if (!painel || !elementoMeta || !elementoLucro) return;

        elementoMeta.textContent = formatarMoeda(meta);
        elementoLucro.textContent = formatarMoeda(lucro);
        
        let porcentagem = 0;
        if (meta > 0) { porcentagem = (lucro / meta) * 100; }
        
        const porcentagemVisual = porcentagem > 100 ? 100 : porcentagem;
        const porcentagemArredondada = Math.round(porcentagem);

        painel.style.setProperty("--porcentagem", Math.round(porcentagemVisual));
        textoGrafico.textContent = `${porcentagemArredondada}%`;
    }

    function carregarDadosFinanceiros() {
        const lancamentos = loadLancamentos();
        let lucroReal = 0;
        lancamentos.forEach(item => {
            if (item.tipo === 'receita') { lucroReal += item.valor; } 
            else { lucroReal -= item.valor; }
        });
        const metaSimulada = 5000.00;
        atualizarProgresso(metaSimulada, lucroReal);
    }
    /* <-----aqui termina a Lógica do Painel de Metas-----> */

    /* <----- Inicio da Lógica dos Widgets -----> */
    function preencherWidgetLancamentos(lancamentos) {
        const listaEl = document.getElementById("lista-ultimos-lancamentos");
        if (!listaEl) return;
        listaEl.innerHTML = "";

        if (lancamentos.length === 0) {
            listaEl.innerHTML = "<li class='item-info'>Nenhum lançamento recente.</li>";
            return;
        }

        const ultimos3 = [...lancamentos].reverse().slice(0, 3);
        ultimos3.forEach(item => {
            const li = document.createElement("li");
            const eReceita = item.tipo === 'receita';
            li.className = eReceita ? 'item-receita' : 'item-despesa';
            const sinal = eReceita ? '+' : '-';
            li.innerHTML = `<span>${item.descricao}</span><span class="valor">${sinal} ${formatarMoeda(item.valor)}</span>`;
            listaEl.appendChild(li);
        });
    }

    function preencherWidgetEstoque(estoque) {
        const listaEl = document.getElementById("lista-estoque-baixo");
        if (!listaEl) return;
        listaEl.innerHTML = "";

        const estoqueBaixo = estoque
            .filter(item => item.qtd <= 10)
            .sort((a, b) => a.qtd - b.qtd)
            .slice(0, 3);

        if (estoqueBaixo.length === 0) {
            listaEl.innerHTML = "<li class='item-info'>Estoque em dia!</li>";
            return;
        }

        estoqueBaixo.forEach(item => {
            const li = document.createElement("li");
            li.className = 'item-aviso';
            li.innerHTML = `<span class="nome">${item.nome}</span><span class="qtd">Restam: ${item.qtd}</span>`;
            listaEl.appendChild(li);
        });
    }

    function carregarWidgets() {
        const todosLancamentos = loadLancamentos();
        const todoEstoque = loadEstoque();
        preencherWidgetLancamentos(todosLancamentos);
        preencherWidgetEstoque(todoEstoque);
    }
    /* <-----aqui termina a Lógica dos Widgets-----> */

    carregarDadosFinanceiros();
    carregarWidgets();
});