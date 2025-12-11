
document.addEventListener("DOMContentLoaded", () => {

    /* <----- Inicio da Captura de Elementos -----> */
    const botaoNovoProduto = document.getElementById("botao-novo-produto");
    const modal = document.getElementById("produto-modal");
    const modalTitulo = document.getElementById("modal-titulo");
    const form = document.getElementById("produto-form");
    const listaProdutos = document.getElementById("lista-produtos");
    const botaoCancelar = document.getElementById("cancelar-produto");
    
    // Captura o botão de submit para alterar o texto
    const botaoSalvar = form.querySelector("button[type='submit']");
    
    const inputNome = document.getElementById("produto-nome");
    const inputQtd = document.getElementById("produto-qtd");
    const inputPreco = document.getElementById("produto-preco");
    const inputValidade = document.getElementById("produto-validade");
    const inputDesc = document.getElementById("produto-desc");
    /* <-----aqui termina a Captura de Elementos-----> */

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
        } catch (e) { console.error(e); }
    }

    /* <----- Inicio da Máscara de Moeda -----> */
    inputPreco.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value === "") { e.target.value = ""; return; }
        value = (parseFloat(value) / 100).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        });
        e.target.value = value;
    });

    inputQtd.addEventListener("input", (e) => {
        if (e.target.value < 0) e.target.value = 0;
    });
    /* <-----aqui termina a Máscara de Moeda-----> */

    /* <----- Inicio do Modal (Com Feedback Visual no Botão) -----> */
    function abrirModal(modo, item = null) {
        form.reset();
        inputPreco.value = ""; 
        
        // Remove classes de edição antigas
        botaoSalvar.classList.remove("botao--aviso");

        if (modo === 'editar' && item) {
            editandoId = item.id;
            modalTitulo.textContent = "Editar Produto";
            
            // CORREÇÃO: Feedback visual no botão
            botaoSalvar.innerHTML = "<i class='bx bx-check-circle'></i> Atualizar Produto";
            botaoSalvar.classList.add("botao--aviso"); // Fica amarelo

            inputNome.value = item.nome;
            inputQtd.value = item.qtd;
            inputValidade.value = item.validade || "";
            inputDesc.value = item.desc || "";
            let precoNum = parseFloat(item.preco);
            if (!isNaN(precoNum)) {
                inputPreco.value = precoNum.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            }
        } else {
            editandoId = null;
            modalTitulo.textContent = "Novo Produto";
            
            // CORREÇÃO: Reseta o botão para o estado normal
            botaoSalvar.innerHTML = "Salvar Produto";
        }
        modal.classList.add("ativo");
    }

    function fecharModal() { modal.classList.remove("ativo"); }
    /* <-----aqui termina o Modal-----> */

    /* <----- Inicio da Renderização -----> */
    function renderizarTabela() {
        const estadoEstoque = loadEstoque(); 
        listaProdutos.innerHTML = "";

        if (estadoEstoque.length === 0) {
            listaProdutos.innerHTML = `<tr class="item-info"><td colspan="5">Nenhum produto cadastrado.</td></tr>`;
            return;
        }

        // Ordena por validade
        estadoEstoque.sort((a, b) => {
            if (!a.validade) return 1;
            if (!b.validade) return -1;
            return new Date(a.validade) - new Date(b.validade);
        });

        const hoje = new Date();
        hoje.setHours(0,0,0,0);

        estadoEstoque.forEach(item => {
            const tr = document.createElement("tr");
            const precoNum = parseFloat(item.preco);
            const precoFormatado = precoNum.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
            
            let textoValidade = "-";
            let estiloValidade = ""; 
            
            if (item.validade) {
                const dataVal = new Date(item.validade + 'T00:00:00');
                textoValidade = dataVal.toLocaleDateString('pt-BR');
                const diffTempo = dataVal - hoje;
                const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 

                if (diffDias < 0) {
                    estiloValidade = "color: var(--cor-perigo); font-weight: bold;";
                    textoValidade += " (Vencido)";
                } else if (diffDias <= 3) {
                    estiloValidade = "color: var(--cor-aviso); font-weight: bold;";
                    textoValidade += " (Vence logo)";
                } else {
                    estiloValidade = "color: var(--cor-sucesso);";
                }
            }

            tr.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.qtd}</td>
                <td style="${estiloValidade}">${textoValidade}</td>
                <td>${precoFormatado}</td>
                <td>
                    <div class="acoes-botoes">
                        <button class="botao--micro" data-id="${item.id}" data-acao="editar" title="Editar"><i class='bx bx-pencil'></i></button>
                        <button class="botao--micro botao--perigo" data-id="${item.id}" data-acao="excluir" title="Excluir"><i class='bx bx-trash'></i></button>
                    </div>
                </td>
            `;
            listaProdutos.appendChild(tr);
        });
    }
    /* <-----aqui termina a Renderização-----> */

    /* <----- Inicio CRUD -----> */
    function carregarEstoque() { renderizarTabela(); }

    function salvarProduto(evento) {
        evento.preventDefault();
        let precoLimpo = inputPreco.value.replace(/\D/g, ""); 
        let precoFloat = precoLimpo ? parseFloat(precoLimpo) / 100 : 0;

        const dadosProduto = {
            id: editandoId || Date.now(),
            nome: inputNome.value,
            qtd: parseInt(inputQtd.value, 10),
            preco: precoFloat,
            validade: inputValidade.value,
            desc: inputDesc.value
        };

        if (!dadosProduto.nome || isNaN(dadosProduto.qtd)) {
            alert("Preencha nome e quantidade.");
            return;
        }

        let estoqueAtual = loadEstoque();
        if (editandoId) {
            estoqueAtual = estoqueAtual.map(item => item.id === editandoId ? dadosProduto : item);
            alert("Produto atualizado!");
        } else {
            estoqueAtual.push(dadosProduto);
        }
        
        saveEstoque(estoqueAtual);
        renderizarTabela();
        fecharModal();
    }

    // ATUALIZAÇÃO: Usa a função global para confirmar exclusão
    function excluirProduto(id) {
        mostrarConfirmacao("Tem certeza que deseja excluir este produto?", () => {
            let estoqueAtual = loadEstoque();
            saveEstoque(estoqueAtual.filter(i => i.id !== id));
            renderizarTabela();
        });
    }
    /* <-----aqui termina CRUD-----> */

    botaoNovoProduto.addEventListener("click", () => abrirModal('novo'));
    botaoCancelar.addEventListener("click", fecharModal);
    form.addEventListener("submit", salvarProduto);

    listaProdutos.addEventListener("click", (evento) => {
        const elemento = evento.target.closest("button");
        if (!elemento) return;
        const acao = elemento.dataset.acao;
        const id = parseInt(elemento.dataset.id, 10);
        if (acao === 'editar') {
            const item = loadEstoque().find(i => i.id === id);
            if (item) abrirModal('editar', item);
        }
        if (acao === 'excluir') excluirProduto(id);
    });

    carregarEstoque();
});