/*
 * Arquivo: script.js (da Pasta area_juridica)
 * Descrição: Carrega, valida e salva os dados da empresa (PJ).
 */

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-dados-empresa");
  
  /* <----- Inicio da Captura de Elementos -----> */
  const inputAgencia = document.getElementById("agencia");
  const inputConta = document.getElementById("conta");
  /* <-----aqui termina a Captura de Elementos-----> */

  if (!formulario) return;

  /* <----- Inicio da Carga de Dados -----> */
  function carregarDadosEmpresa() {
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

  /* <----- Inicio da Blindagem de Inputs -----> */
  function bloquearLetras(evento) {
    let valor = evento.target.value;
    evento.target.value = valor.replace(/[^0-9-]/g, "");
  }

  if (inputAgencia) { inputAgencia.addEventListener("input", bloquearLetras); }
  if (inputConta) { inputConta.addEventListener("input", bloquearLetras); }
  /* <-----aqui termina a Blindagem de Inputs-----> */

  /* <----- Inicio do Salvamento -----> */
  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dadosParaSalvar = {};
    const inputs = formulario.querySelectorAll("input, textarea");
    
    inputs.forEach(campo => {
      if (campo.id && !campo.readOnly) {
        dadosParaSalvar[campo.id] = campo.value;
      }
    });
    
    console.log("Dados salvos e validados:", dadosParaSalvar);
    alert("Dados da empresa salvos com sucesso!");
  });
  /* <-----aqui termina o Salvamento-----> */

  carregarDadosEmpresa();
  console.log("Script de Dados Jurídicos blindado!");
});