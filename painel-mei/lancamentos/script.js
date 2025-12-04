/*
 * Arquivo: script.js (da Pasta lancamentos)
 * DESCRIÇÃO: CRUD Completo.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    /* <----- Inicio da captura de elementos do DOM -----> */
    const formulario = document.getElementById("form-lancamento");
    const listaLancamentos = document.getElementById("lista-lancamentos");
    const inputTipo = document.getElementById("tipo");
    const inputValor = document.getElementById("valor");
    const inputData = document.getElementById("data");
    const inputDescricao = document.getElementById("descricao");
    const botaoSalvar = formulario.querySelector("button[type='submit']");
    /* <-----aqui termina a captura de elementos do DOM-----> */


    /* <----- Inicio do controle de estado (Mini Banco de Dados) -----> */
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
    /* <-----aqui termina o controle de estado-----> */


    /* <----- Inicio das Funções de Renderização (Visual) -----> */
    function renderizarLista() {
        const lancamentos = loadLancamentos();
        
        listaLancamentos.innerHTML = "";

        if (lancamentos.length === 0) {
            listaLancamentos.innerHTML = `
                <li class="item-info">Nenhum lançamento ainda.</li>
            `;
            return;
        }

        const listaInvertida = [...lancamentos].reverse();

        listaInvertida.forEach(item => {
            const li = document.createElement('li');
            const eReceita = item.tipo === 'receita';
            
            li.className = eReceita ? 'item-receita' : 'item-despesa';

            const valorFormatado = item.valor.toLocaleString("pt-BR", { style: 'currency', currency: 'BRL' });
            const sinal = eReceita ? '+' : '-';
            const dataFormatada = new Date(item.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

            li.innerHTML = `
                <div class="conteudo-li">
                    <div class="info-texto">
                        <span style="display:block; font-weight:bold;">${item.descricao}</span>
                        <span style="font-size: 0.8rem; color: #888;">${dataFormatada}</span>
                    </div>
                    <span class="valor">${sinal} ${valorFormatado}</span>
                </div>
                
                <div class="acoes-item">
                    <button class="botao-acao btn-editar" onclick="iniciarEdicao(${item.id})" title="Editar">
                        <i class='bx bx-pencil'></i>
                    </button>
                    <button class="botao-acao btn-excluir" onclick="deletarLancamento(${item.id})" title="Excluir">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `;

            listaLancamentos.appendChild(li);
        });
    }
    /* <-----aqui termina as Funções de Renderização-----> */


    /* <----- Inicio das Funções Lógicas (CRUD) -----> */
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        let valorLimpo = inputValor.value.replace("R$", "").replace(/\./g, "").replace(",", ".");
        
        const dadosFormulario = {
            id: idEmEdicao || Date.now(),
            tipo: inputTipo.value,
            valor: parseFloat(valorLimpo),
            data: inputData.value,
            descricao: inputDescricao.value || "Sem descrição"
        };

        if (isNaN(dadosFormulario.valor) || dadosFormulario.valor <= 0) {
            alert("Por favor, insira um valor válido.");
            return;
        }

        let listaAtual = loadLancamentos();

        if (idEmEdicao) {
            const index = listaAtual.findIndex(item => item.id === idEmEdicao);
            if (index !== -1) {
                listaAtual[index] = dadosFormulario;
            }
            alert("Lançamento atualizado com sucesso!");
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
            inputValor.value = item.valor.toFixed(2).replace('.', ',');

            idEmEdicao = item.id;
            
            botaoSalvar.innerHTML = "<i class='bx bx-check-circle'></i> Atualizar Lançamento";
            botaoSalvar.classList.add("botao--aviso");
            
            formulario.scrollIntoView({ behavior: 'smooth' });
        }
    };

    window.deletarLancamento = function(id) {
        if (confirm("Tem certeza que deseja apagar este lançamento?")) {
            let listaAtual = loadLancamentos();
            const novaLista = listaAtual.filter(item => item.id !== id);
            
            saveLancamentos(novaLista);
            renderizarLista();
            
            if (idEmEdicao === id) {
                resetarFormulario();
            }
        }
    };

    function resetarFormulario() {
        formulario.reset();
        idEmEdicao = null;
        botaoSalvar.innerHTML = "<i class='bx bx-save'></i> Salvar Lançamento";
        botaoSalvar.classList.remove("botao--aviso");
        try { inputData.valueAsDate = new Date(); } catch(e){}
    }
    /* <-----aqui termina as Funções Lógicas-----> */

    try { inputData.valueAsDate = new Date(); } catch(e){}
    renderizarLista(); 
    console.log("Sistema de Lançamentos carregado!");
});