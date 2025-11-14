/*
 * Arquivo: script.js (da Pasta area_juridica)
 * Descrição: Carrega e salva os dados da empresa (PJ).
 * Tarefas:
 * 1. (Menu Suspenso já está no appGLOBAL.js)
 * 2. Buscar dados da empresa (simulado) e preencher o formulário.
 * 3. Salvar dados da empresa (simulado) ao enviar.
 */

document.addEventListener("DOMContentLoaded", () => {
  
  const formulario = document.getElementById("form-dados-empresa");
  if (!formulario) return; // Sai se o formulário não estiver na página

  // --- TAREFA 1: Carregar Dados da Empresa ---
  function carregarDadosEmpresa() {
    console.log("Buscando dados da Empresa (PJ)...");

    // ==========================================================
    // AQUI CONECTA AO BANCO DE DADOS (API)
    // 
    // ex: fetch('/api/empresa/dados')
    //    .then(response => response.json())
    //    .then(dadosDoBanco => {
    //        preencherFormulario(dadosDoBanco);
    //    })
    // ==========================================================
    
    // ----- SIMULAÇÃO -----
    const dadosSimulados = {
      'cnpj': '42.123.456/0001-77',
      'razao-social': 'JOAO DA SILVA MARKETING DIGITAL',
      'nome-fantasia': 'JS Marketing',
      'data-abertura': '10/03/2021',
      'natureza': '213-5 - Empresário (Individual)',
      'banco': 'Banco Digital Exemplo S.A.',
      'agencia': '0001',
      'conta': '123456-7'
    };
    preencherFormulario(dadosSimulados);
    // ----- FIM DA SIMULAÇÃO -----
  }

  // Função auxiliar para preencher o formulário
  function preencherFormulario(dados) {
    const inputs = formulario.querySelectorAll("input, textarea");
    inputs.forEach(campo => {
      if (campo.id && dados[campo.id]) {
        campo.value = dados[campo.id];
      }
    });
  }

  // --- TAREFA 2: Salvar Dados da Empresa ---
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Impede o recarregamento
    
    const dadosParaSalvar = {};
    const inputs = formulario.querySelectorAll("input, textarea");
    
    inputs.forEach(campo => {
      if (campo.id && !campo.readOnly) {
        dadosParaSalvar[campo.id] = campo.value;
      }
    });
    
    console.log("Dados (editáveis) que seriam salvos:", dadosParaSalvar);

    // ==========================================================
    // AQUI CONECTA AO BANCO DE DADOS (API) - (Salvar/POST)
    // 
    // ex: fetch('/api/empresa/salvar', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(dadosParaSalvar)
    //    })
    //    .then(() => alert("Dados salvos com sucesso!"))
    // ==========================================================
    
    alert("Protótipo: Dados da empresa salvos!");
  });

  // 🚀 Carrega os dados ao abrir a página
  carregarDadosEmpresa();
  console.log("Script de Dados (area_juridica/script.js) carregado!");
});