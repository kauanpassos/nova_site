/*
 * Arquivo: script.js (da Pasta estoque)
 * DESCRIÇÃO: Controla o CRUD do estoque com LOCALSTORAGE.
 */

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. Seletores de Elementos ---
    const botaoNovoProduto = document.getElementById("botao-novo-produto");
    const modal = document.getElementById("produto-modal");
    const modalTitulo = document.getElementById("modal-titulo");
    const form = document.getElementById("produto-form");
    const listaProdutos = document.getElementById("lista-produtos");
    const botaoCancelar = document.getElementById("cancelar-produto");

    // --- NOSSO "MINI-BANCO DE DADOS" LOCAL ---
    const storageKey = 'nova_estoque_v1';
    let editandoId = null; // Controla se estamos editando ou criando

    function loadEstoque() {
        try {
            const dados = localStorage.getItem(storageKey);
            return dados ? JSON.parse(dados) : [];
        } catch (e) { return []; }
    }

    function saveEstoque(estoque) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(estoque));
        } catch (e) { console.error("Erro ao salvar estoque:", e); }
    }
    // --- FIM DO "MINI-BANCO DE DADOS" ---

    // --- 2. Funções do Modal ---
    function abrirModal(modo, item = null) {
        form.reset();
        if (modo === 'editar' && item) {
            editandoId = item.id;
            modalTitulo.textContent = "Editar Produto";
            document.getElementById("produto-nome").value = item.nome;
            document.getElementById("produto-qtd").value = item.qtd;
            document.getElementById("produto-preco").value = formatarMoedaParaInput(item.preco);
            document.getElementById("produto-desc").value = item.desc || "";
        } else {
            editandoId = null;
            modalTitulo.textContent = "Novo Produto";
        }
        modal.classList.add("ativo");
    }

    function fecharModal() {
        modal.classList.remove("ativo");
    }

    // --- 3. Renderização da Tabela ---
    function renderizarTabela() {
        const estadoEstoque = loadEstoque(); // Sempre lê os dados mais recentes
        listaProdutos.innerHTML = ""; // Limpa a tabela

        if (estadoEstoque.length === 0) {
            listaProdutos.innerHTML = `
                <tr class="item-info">
                    <td colspan="4">Nenhum produto cadastrado.</td>
                </tr>`;
            return;
        }

        estadoEstoque.forEach(item => {
            const tr = document.createElement("tr");
            const precoFormatado = item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            
            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.qtd}</td>
                <td>${precoFormatado}</td>
                <td>
                    <div class="acoes-botoes">
                        <button class="botao--micro" data-id="${item.id}" data-acao="editar" title="Editar">
                            <i class='bx bx-pencil'></i>
                        </button>
                        <button class="botao--micro botao--perigo" data-id="${item.id}" data-acao="excluir" title="Excluir">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            `;
            listaProdutos.appendChild(tr);
        });
    }

    // --- 4. Lógica de CRUD (AGORA É DE VERDADE) ---

    // Carregar
    function carregarEstoque() {
        console.log("Carregando estoque do localStorage...");
        // A simulação foi removida. Apenas renderizamos o que está salvo.
        renderizarTabela();
    }

    // Salvar (Criar ou Atualizar)
    function salvarProduto(evento) {
        evento.preventDefault();
        
        const dadosProduto = {
            id: editandoId || Date.now(),
            nome: document.getElementById("produto-nome").value,
            qtd: parseInt(document.getElementById("produto-qtd").value, 10),
            preco: parseFloat(document.getElementById("produto-preco").value.replace("R$", "").replace(/\./g, "").replace(",", ".")),
            desc: document.getElementById("produto-desc").value
        };

        if (!dadosProduto.nome || isNaN(dadosProduto.qtd) || isNaN(dadosProduto.preco)) {
            alert("Por favor, preencha nome, quantidade e preço corretamente.");
            return;
        }

        let estoqueAtual = loadEstoque();

        if (editandoId) {
            // ATUALIZAR (Update)
            estoqueAtual = estoqueAtual.map(item => item.id === editandoId ? dadosProduto : item);
            console.log("Produto ATUALIZADO no localStorage:", dadosProduto);
        } else {
            // CRIAR (Create)
            estoqueAtual.push(dadosProduto);
            console.log("Produto CRIADO no localStorage:", dadosProduto);
        }
        
        saveEstoque(estoqueAtual); // Salva a lista modificada
        renderizarTabela();
        fecharModal();
    }

    // Excluir
    function excluirProduto(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }
        
        let estoqueAtual = loadEstoque();
        estoqueAtual = estoqueAtual.filter(item => item.id !== id);
        saveEstoque(estoqueAtual);
        
        console.log("Produto EXCLUÍDO do localStorage, ID:", id);
        renderizarTabela();
    }

    // --- 5. Funções Auxiliares ---
    function formatarMoedaParaInput(valor) {
        return valor.toFixed(2).replace(".", ",");
    }

    // --- 6. Event Listeners ---
    botaoNovoProduto.addEventListener("click", () => abrirModal('novo'));
    botaoCancelar.addEventListener("click", fecharModal);
    form.addEventListener("submit", salvarProduto);

    listaProdutos.addEventListener("click", (evento) => {
        const elemento = evento.target.closest("button");
        if (!elemento) return;

        const acao = elemento.dataset.acao;
        const id = parseInt(elemento.dataset.id, 10);

        if (acao === 'editar') {
            const estoqueAtual = loadEstoque();
            const itemParaEditar = estoqueAtual.find(item => item.id === id);
            if (itemParaEditar) abrirModal('editar', itemParaEditar);
        }

        if (acao === 'excluir') {
            excluirProduto(id);
        }
    });

    // --- 7. Iniciar ---
    carregarEstoque();
    console.log("Script de Estoque (estoque/script.js) carregado com localStorage!");
});