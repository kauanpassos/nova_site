/*
 * Arquivo: script.js (da Pasta lancamentos)
 * DESCRIÇÃO: Controla o CRUD de lançamentos com LOCALSTORAGE.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    const formulario = document.getElementById("form-lancamento");
    const listaLancamentos = document.getElementById("lista-lancamentos");
    const inputValor = document.getElementById("valor");
    const inputData = document.getElementById("data");

    if (!formulario || !listaLancamentos) return;

    // --- NOSSO "MINI-BANCO DE DADOS" LOCAL ---
    const storageKey = 'nova_lancamentos_v1';

    function loadLancamentos() {
        try {
            const dados = localStorage.getItem(storageKey);
            return dados ? JSON.parse(dados) : [];
        } catch (e) {
            console.error("Erro ao carregar lançamentos:", e);
            return [];
        }
    }

    function saveLancamentos(lancamentos) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(lancamentos));
        } catch (e) {
            console.error("Erro ao salvar lançamentos:", e);
        }
    }
    // --- FIM DO "MINI-BANCO DE DADOS" ---


    // --- TAREFA 1: Formatar data de hoje ---
    try {
      inputData.valueAsDate = new Date();
    } catch (e) {
      console.warn("Não foi possível definir a data padrão.", e);
    }


    // --- TAREFA 2: Adicionar Lançamento (AGORA É DE VERDADE) ---
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault(); 
        
        const dadosDoForm = {
            id: Date.now(), // ID único
            tipo: document.getElementById("tipo").value,
            valor: parseFloat(inputValor.value.replace("R$", "").replace(/\./g, "").replace(",", ".")),
            data: inputData.value,
            descricao: document.getElementById("descricao").value || "Sem descrição",
        };

        if (!dadosDoForm.valor || isNaN(dadosDoForm.valor)) {
            alert("Por favor, insira um valor válido.");
            return;
        }

        const lancamentosAtuais = loadLancamentos();
        lancamentosAtuais.push(dadosDoForm);
        saveLancamentos(lancamentosAtuais);
        
        console.log("Salvo no localStorage!", dadosDoForm);
        
        adicionarItemNaLista(dadosDoForm, true); // Adiciona no topo da lista visual
        
        formulario.reset();
        try {
          inputData.valueAsDate = new Date(); // Recoloca a data
        } catch (e) {}
    });

    // --- TAREFA 3: Carregar Lançamentos Iniciais (AGORA É DE VERDADE) ---
    function carregarLancamentosIniciais() {
        console.log("Buscando dados do localStorage...");
        
        const lancamentosSalvos = loadLancamentos();
        
        listaLancamentos.innerHTML = ""; // Limpa o "Carregando..."
        
        if (lancamentosSalvos.length === 0) {
            listaLancamentos.innerHTML = "<li class'item-info'>Nenhum lançamento ainda.</li>";
        } else {
            // Inverte para mostrar os mais novos primeiro
            lancamentosSalvos.reverse().forEach(item => {
                adicionarItemNaLista(item, false);
            });
        }
    }
    
    // Função Auxiliar para criar o item na lista
    function adicionarItemNaLista(item, noInicio = false) {
        const li = document.createElement('li');
        const eReceita = item.tipo === 'receita';
        
        li.className = eReceita ? 'item-receita' : 'item-despesa';
        
        const valorFormatado = item.valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
        const sinal = eReceita ? '+' : '-';

        li.innerHTML = `
            <span>${item.descricao}</span>
            <span class="valor">${sinal} ${valorFormatado}</span>
        `;
        
        const itemInfo = listaLancamentos.querySelector('.item-info');
        if (itemInfo) {
            itemInfo.remove();
        }

        if (noInicio) {
            listaLancamentos.prepend(li);
        } else {
            listaLancamentos.appendChild(li);
        }
    }

    // 🚀 Carrega os dados reais ao abrir a página
    carregarLancamentosIniciais();

    console.log("Script de Lançamentos (lancamentos/script.js) carregado com localStorage!");
});