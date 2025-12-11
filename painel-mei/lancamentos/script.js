
document.addEventListener("DOMContentLoaded", () => {
    
    /* <----- Inicio da captura de elementos -----> */
    const formulario = document.getElementById("form-lancamento");
    const listaLancamentos = document.getElementById("lista-lancamentos");
    const inputTipo = document.getElementById("tipo");
    const inputValor = document.getElementById("valor");
    const inputData = document.getElementById("data");
    const inputDescricao = document.getElementById("descricao");
    const botaoSalvar = formulario.querySelector("button[type='submit']");
    /* <-----aqui termina a captura de elementos-----> */

    const storageKey = 'nova_lancamentos_v1';
    let idEmEdicao = null; 

    function loadLancamentos() {
        try {
            const dados = localStorage.getItem(storageKey);
            return dados ? JSON.parse(dados) : [];
        } catch (e) { return []; }
    }

    function saveLancamentos(lancamentos) {
        localStorage.setItem(storageKey, JSON.stringify(lancamentos));
    }

    /* <----- Inicio da Máscara de Moeda (Bloqueia letras) -----> */
    inputValor.addEventListener("input", (e) => {
        let value = e.target.value;
        // 1. Remove qualquer caractere que NÃO seja número
        value = value.replace(/\D/g, "");

        if (value === "") {
            e.target.value = "";
            return;
        }

        // 2. Formata para R$
        value = (parseFloat(value) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        e.target.value = value;
    });
    /* <-----aqui termina a Máscara de Moeda-----> */

    /* <----- Inicio da Renderização -----> */
    function renderizarLista() {
        const lancamentos = loadLancamentos();
        
        // PASSO CRUCIAL: Limpa a lista ANTES de checar se está vazia
        listaLancamentos.innerHTML = "";

        if (lancamentos.length === 0) {
            listaLancamentos.innerHTML = "<li class='item-info'>Nenhum lançamento ainda.</li>";
            return;
        }

        // Ordena por data (mais recente primeiro)
        const listaOrdenada = [...lancamentos].sort((a, b) => {
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);
            if (dataB - dataA !== 0) return dataB - dataA;
            return b.id - a.id;
        });

        listaOrdenada.forEach(item => {
            const li = document.createElement('li');
            const eReceita = item.tipo === 'receita';
            li.className = eReceita ? 'item-receita' : 'item-despesa';

            const valorNumerico = parseFloat(item.valor);
            const valorFormatado = valorNumerico.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            const sinal = eReceita ? '+' : '-';
            const dataObjeto = new Date(item.data + 'T00:00:00');
            const dataFormatada = dataObjeto.toLocaleDateString('pt-BR');

            // HTML Limpo (sem style inline)
            li.innerHTML = `
                <div class="conteudo-li">
                    <div class="info-texto">
                        <span class="lancamento-titulo">${item.descricao}</span>
                        <span class="lancamento-data">${dataFormatada}</span>
                    </div>
                    <span class="valor">${sinal} ${valorFormatado}</span>
                </div>
                <div class="acoes-item">
                    <button class="botao-acao btn-editar" onclick="iniciarEdicao(${item.id})" title="Editar"><i class='bx bx-pencil'></i></button>
                    <button class="botao-acao btn-excluir" onclick="deletarLancamento(${item.id})" title="Excluir"><i class='bx bx-trash'></i></button>
                </div>
            `;
            listaLancamentos.appendChild(li);
        });
    }
    /* <-----aqui termina a Renderização-----> */

    /* <----- Inicio da Lógica CRUD -----> */
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        
        // Remove R$ e pontos, mantém apenas dígitos para salvar
        let valorLimpo = inputValor.value.replace(/\D/g, "");
        let valorFloat = parseFloat(valorLimpo) / 100;
        
        const dadosFormulario = {
            id: idEmEdicao || Date.now(),
            tipo: inputTipo.value,
            valor: valorFloat,
            data: inputData.value,
            descricao: inputDescricao.value || "Sem descrição"
        };
        
        if (isNaN(dadosFormulario.valor) || dadosFormulario.valor <= 0) {
            alert("Valor inválido."); return;
        }

        let listaAtual = loadLancamentos();
        if (idEmEdicao) {
            const index = listaAtual.findIndex(item => item.id === idEmEdicao);
            if (index !== -1) listaAtual[index] = dadosFormulario;
            alert("Lançamento atualizado!");
        } else {
            listaAtual.push(dadosFormulario);
        }
        
        saveLancamentos(listaAtual);
        renderizarLista();
        resetarFormulario();
    });

    window.iniciarEdicao = function(id) {
        const listaAtual = loadLancamentos();
        const item = listaAtual.find(i => i.id === id);
        if (item) {
            inputTipo.value = item.tipo;
            inputDescricao.value = item.descricao;
            inputData.value = item.data;
            
            // Formata o valor para exibir no input
            let valorNum = parseFloat(item.valor);
            inputValor.value = valorNum.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            
            idEmEdicao = item.id;
            botaoSalvar.innerHTML = "<i class='bx bx-check-circle'></i> Atualizar Lançamento";
            botaoSalvar.classList.add("botao--aviso");
            formulario.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deletarLancamento = function(id) {
        mostrarConfirmacao("Deseja realmente apagar este lançamento?", () => {
            let listaAtual = loadLancamentos();
            saveLancamentos(listaAtual.filter(i => i.id !== id));
            renderizarLista();
            if(idEmEdicao === id) resetarFormulario();
        });
    };

    function resetarFormulario() {
        formulario.reset();
        idEmEdicao = null;
        botaoSalvar.innerHTML = "<i class='bx bx-save'></i> Salvar Lançamento";
        botaoSalvar.classList.remove("botao--aviso");
        try { inputData.valueAsDate = new Date(); } catch(e){}
    }
    /* <-----aqui termina a Lógica CRUD-----> */

    try { inputData.valueAsDate = new Date(); } catch(e){}
    renderizarLista();
});