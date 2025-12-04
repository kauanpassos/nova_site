/*
 * Arquivo: script.js (da Pasta area_juridica)
 * Descrição: Carrega e salva os dados da empresa (PJ).
 */

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-dados-empresa");
  if (!formulario) return;

  /* <----- Inicio da Carga de Dados -----> */
  function carregarDadosEmpresa() {
    // Simulação de dados
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
  }

  function preencherFormulario(dados) {
    const inputs = formulario.querySelectorAll("input, textarea");
    inputs.forEach(campo => {
      if (campo.id && dados[campo.id]) {
        campo.value = dados[campo.id];
      }
    });
  }
  /* <-----aqui termina a Carga de Dados-----> */


  /* <----- Inicio do Salvamento de Dados -----> */
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    
    const dadosParaSalvar = {};
    const inputs = formulario.querySelectorAll("input, textarea");
    
    inputs.forEach(campo => {
      if (campo.id && !campo.readOnly) {
        dadosParaSalvar[campo.id] = campo.value;
      }
    });
    
    // Aqui entraria a chamada de API
    console.log("Dados salvos:", dadosParaSalvar);
    alert("Dados da empresa salvos!");
  });
  /* <-----aqui termina o Salvamento de Dados-----> */

  carregarDadosEmpresa();
  console.log("Script de Dados carregado!");
});