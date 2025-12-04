/*
 * Arquivo: script.js (da Pasta estoque)
 * DESCRIÇÃO: Controla o CRUD do estoque com LOCALSTORAGE.
 */

document.addEventListener("DOMContentLoaded", () => {

    /* <----- Inicio da Captura de Elementos -----> */
    const botaoNovoProduto = document.getElementById("botao-novo-produto");
    const modal = document.getElementById("produto-modal");
    const modalTitulo = document.getElementById("modal-titulo");
    const form = document.getElementById("produto-form");
    const listaProdutos = document.getElementById("lista-produtos");
    const botaoCancelar = document.getElementById("cancelar-produto");
    /* <-----aqui termina a Captura de Elementos-----> */


    /* <----- Inicio do Mini Banco de Dados (LocalStorage) -----> */
    const storageKey = 'nova_estoque_v1';
    let editandoId = null;

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
    /* <-----aqui termina o Mini Banco de Dados-----> */


    /* <----- Inicio das Funções do Modal -----> */
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
    /* <-----aqui termina as Funções do Modal-----> */


    /* <----- Inicio da Renderização da Tabela -----> */
    function renderizarTabela() {
        const estadoEstoque = loadEstoque(); 
        listaProdutos.innerHTML = "";

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
    /* <-----aqui termina a Renderização da Tabela-----> */


    /* <----- Inicio da Lógica CRUD (Create, Update, Delete) -----> */
    function carregarEstoque() {
        renderizarTabela();
    }

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
            estoqueAtual = estoqueAtual.map(item => item.id === editandoId ? dadosProduto : item);
        } else {
            estoqueAtual.push(dadosProduto);
        }
        
        saveEstoque(estoqueAtual);
        renderizarTabela();
        fecharModal();
    }

    function excluirProduto(id) {
        if (!confirm("Tem certeza que deseja excluir este produto?")) {
            return;
        }
        
        let estoqueAtual = loadEstoque();
        estoqueAtual = estoqueAtual.filter(item => item.id !== id);
        saveEstoque(estoqueAtual);
        
        renderizarTabela();
    }
    /* <-----aqui termina a Lógica CRUD-----> */


    /* <----- Inicio das Funções Auxiliares e Listeners -----> */
    function formatarMoedaParaInput(valor) {
        return valor.toFixed(2).replace(".", ",");
    }

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
    /* <-----aqui termina as Funções Auxiliares e Listeners-----> */

    carregarEstoque();
    console.log("Script de Estoque carregado!");
});