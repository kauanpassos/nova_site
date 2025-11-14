/*
 * Arquivo: script.js (da Pasta inicio)
 * DESCRIÇÃO: Carrega dados REAIS do localStorage para o dashboard.
 */

document.addEventListener("DOMContentLoaded", () => {
  
    // --- FUNÇÕES "HELPER" PARA LER O LOCALSTORAGE ---
    // (Precisamos delas aqui para que o dashboard possa ler os dados)

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

    // --- TAREFA 1: ATUALIZAR O PAINEL DE PROGRESSO (AGORA É REAL) ---

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }

    function atualizarProgresso(meta, lucro) {
        const painel = document.querySelector(".painel");
        const elementoMeta = document.getElementById("meta-lucro");
        const elementoLucro = document.getElementById("lucro-atual");
        const textoGrafico = document.querySelector(".grafico__texto");

        if (!painel || !elementoMeta || !elementoLucro || !textoGrafico) {
            console.error("Erro: Elementos do painel de progresso não encontrados.");
            return;
        }

        elementoMeta.textContent = formatarMoeda(meta);
        elementoLucro.textContent = formatarMoeda(lucro);
        
        let porcentagem = 0;
        if (meta > 0) {
            porcentagem = (lucro / meta) * 100;
        }
        if (porcentagem > 100) {
            porcentagem = 100;
        }
        const porcentagemArredondada = Math.round(porcentagem);

        painel.style.setProperty("--porcentagem", porcentagemArredondada);
        textoGrafico.textContent = `${porcentagemArredondada}%`;
    }

    function carregarDadosDoPainel() {
        console.log("Buscando dados REAIS do painel...");
        
        // ==========================================================
        // AGORA É DE VERDADE!
        // 1. Carrega todos os lançamentos
        const lancamentos = loadLancamentos();
        
        // 2. Calcula o lucro real
        let lucroReal = 0;
        lancamentos.forEach(item => {
            if (item.tipo === 'receita') {
                lucroReal += item.valor;
            } else {
                lucroReal -= item.valor;
            }
        });
        
        // 3. A Meta ainda é simulada (poderia vir do Perfil, mas vamos manter simples)
        const metaSimulada = 5000.00;
        
        atualizarProgresso(metaSimulada, lucroReal);
        // ==========================================================
    }

    // --- TAREFA 2: CARREGAR OS WIDGETS (AGORA É REAL) ---

    function carregarWidgets() {
        console.log("Buscando dados REAIS para os widgets...");
        const listaLancamentosEl = document.getElementById("lista-ultimos-lancamentos");
        const listaEstoqueEl = document.getElementById("lista-estoque-baixo");

        if (!listaLancamentosEl || !listaEstoqueEl) {
            console.error("Erro: Elementos dos widgets não encontrados.");
            return;
        }

        // ==========================================================
        // AGORA É DE VERDADE!
        // 1. Carrega os dados
        const todosLancamentos = loadLancamentos();
        const todoEstoque = loadEstoque();

        // 2. Pega os 3 últimos lançamentos
        const ultimosLancamentos = todosLancamentos.reverse().slice(0, 3);
        
        // 3. Pega os 3 itens de estoque mais baixo (ex: <= 10)
        const estoqueBaixo = todoEstoque
            .filter(item => item.qtd <= 10) // Define o "nível de alerta"
            .sort((a, b) => a.qtd - b.qtd) // Ordena (mais baixo primeiro)
            .slice(0, 3); // Pega os 3 piores

        preencherWidgetLancamentos(ultimosLancamentos);
        preencherWidgetEstoque(estoqueBaixo);
        // ==========================================================
    }

    function preencherWidgetLancamentos(lancamentos) {
        const listaEl = document.getElementById("lista-ultimos-lancamentos");
        listaEl.innerHTML = ""; // Limpa

        if (lancamentos.length === 0) {
            listaEl.innerHTML = "<li class='item-info'>Nenhum lançamento recente.</li>";
            return;
        }

        lancamentos.forEach(item => {
            const li = document.createElement("li");
            const eReceita = item.tipo === 'receita';
            li.className = eReceita ? 'item-receita' : 'item-despesa';
            
            const valorFormatado = formatarMoeda(item.valor);
            const sinal = eReceita ? '+' : '-';

            li.innerHTML = `
                <span>${item.descricao}</span>
                <span class="valor">${sinal} ${valorFormatado}</span>
            `;
            listaEl.appendChild(li);
        });
    }

    function preencherWidgetEstoque(estoque) {
        const listaEl = document.getElementById("lista-estoque-baixo");
        listaEl.innerHTML = ""; // Limpa

        if (estoque.length === 0) {
            listaEl.innerHTML = "<li class='item-info'>Estoque em dia!</li>";
            return;
        }

        estoque.forEach(item => {
            const li = document.createElement("li");
            li.className = 'item-aviso';
            li.innerHTML = `
                <span class="nome">${item.nome}</span>
                <span class="qtd">Restam: ${item.qtd}</span>
            `;
            listaEl.appendChild(li);
        });
    }


    // --- INICIALIZAÇÃO ---
    carregarDadosDoPainel(); // Carrega o progresso real
    carregarWidgets(); // Carrega os widgets reais

    console.log("Script da Página Inicial (inicio/script.js) carregado com dados REAIS!");
});