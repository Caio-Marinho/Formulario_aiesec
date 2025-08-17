// Seleciona o formulário
const form = document.querySelector('#email');
// Pega os valores dos inputs e selects
const nome = document.querySelector('#nome');
const sobrenome = document.querySelector('#sobrenome');
const comite = document.querySelector('#comite');
const cargo = document.querySelector('#cargo');
const area = document.querySelector('#area');
const codigo = document.querySelector('#codigo');
const erroDigitacao = document.querySelector("#erro_codigo");
erroDigitacao.textContent = "Use números . Digite seu codigo de membresia.";

codigo.addEventListener('input', () => {
    // Mantém apenas números
    codigo.value = codigo.value.replace(/[^0-9]/g, '');
    
    // Valida o campo
    if (codigo.value !== '' && !isNaN(codigo.value) && codigo.value.length === 5) {
      codigo.classList.add('codigo-valid');
      codigo.classList.remove('codigo-invalid');
      erroDigitacao.textContent = " ";
    } else if (isNaN(codigo.value) && codigo.value.length === 5 || codigo.value.length > 0){
      codigo.classList.add('codigo-invalid');
      codigo.classList.remove('codigo-valid');
      erroDigitacao.textContent = "O codigo de Membresia tem 5 digitos";
    } else {
      codigo.classList.remove('codigo-invalid');
      codigo.classList.remove('codigo-valid');
      erroDigitacao.textContent = "Use números . Digite seu codigo de membresia.";
    }
  });

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita envio padrão
  const inputNome = nome.value.toLowerCase().trim();
  const inputSobrenome = sobrenome.value.toLowerCase().trim();
  const inputComite = comite.value;
  const inputCargo = cargo.value;
  const inputArea = area.value;
  const inputCodigo = codigo.value
  // Exibe os valores no console
  console.log('Nome:', inputNome);
  console.log('Sobrenome:', inputSobrenome);
  console.log('Comitê:', inputComite);
  console.log('Cargo:', inputCargo);
  console.log('Área:', inputArea);
  console.log('Código de Membro:', inputCodigo);
  alert(`O e-mail ${inputNome.split(" ")[0]}.${inputSobrenome.split(" ").pop()}@aiesec.org.br, pertencente a ${inputNome} ${inputSobrenome} da aiesec ${inputComite} foi gerado com sucesso.`);
  
  // Aqui você pode enviar os dados para um servidor via fetch/ajax
  
  form.reset();
});
