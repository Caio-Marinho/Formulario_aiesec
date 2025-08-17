// ------------------- Seleção do formulário e elementos ------------------- //
// Seleciona o formulário pelo ID
const form = document.querySelector('#email');

// Seleciona inputs e selects
const nome = document.querySelector('#nome');
const sobrenome = document.querySelector('#sobrenome');
const comite = document.querySelector('#comite');
const cargo = document.querySelector('#cargo');
const area = document.querySelector('#area');
const codigo = document.querySelector('#codigo');

// ------------------- Mensagens de erro ------------------- //
const erroDigitacaoNome = document.querySelector("#erro_nome");
const erroDigitacaoSobrenome = document.querySelector("#erro_sobrenome");
const erroDigitacaComite = document.querySelector("#erro_comite");
const erroDigitacaoCargo = document.querySelector("#erro_cargo");
const erroDigitacaoArea = document.querySelector("#erro_area");
const erroDigitacaoCodigo = document.querySelector("#erro_codigo");

// Mensagens iniciais de ajuda
erroDigitacaoNome.textContent = "Informe seu nome";
erroDigitacaoSobrenome.textContent = "Informe seu Sobrenome";
erroDigitacaComite.textContent = "Selecione o Comite";
erroDigitacaoCargo.textContent = "Selecione seu cargo";
erroDigitacaoArea.textContent = "Selecione sua Área";
erroDigitacaoCodigo.textContent = "Use números. Digite seu código de membresia.";

// ------------------- Validadores de input ------------------- //

// Validador do nome: aceita apenas letras e espaços
nome.addEventListener('input', () => {
  nome.value = nome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''); // remove caracteres inválidos
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;

  if (regex.test(nome.value) && nome.value !== "") {
    nome.classList.add('valid');
    nome.classList.remove('invalid');
    erroDigitacaoNome.textContent = " ";
  } else if (!regex.test(nome.value)) {
    nome.classList.add('invalid');
    nome.classList.remove('valid');
    erroDigitacaoNome.textContent = "Deve ser um nome próprio";
  } 
});

// Validador do sobrenome: mesma lógica do nome
sobrenome.addEventListener('input', () => {
  sobrenome.value = sobrenome.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;

  if (regex.test(sobrenome.value) && sobrenome.value !== "") {
    sobrenome.classList.add('valid');
    sobrenome.classList.remove('invalid');
    erroDigitacaoSobrenome.textContent = " ";
  } else if (!regex.test(sobrenome.value)) {
    sobrenome.classList.add('invalid');
    sobrenome.classList.remove('valid');
    erroDigitacaoSobrenome.textContent = "Deve ser um Sobrenome próprio";
  } 
});

// Validador do código de membresia: apenas números, exatamente 5 dígitos
codigo.addEventListener('input', () => {
  codigo.value = codigo.value.replace(/[^0-9]/g, ''); // remove caracteres não numéricos

  if (codigo.value !== '' && !isNaN(codigo.value) && codigo.value.length === 5) {
    codigo.classList.add('valid');
    codigo.classList.remove('invalid');
    erroDigitacaoCodigo.textContent = " ";
  } else if ((isNaN(codigo.value) && codigo.value.length === 5) || codigo.value.length > 0) {
    codigo.classList.add('invalid');
    codigo.classList.remove('valid');
    erroDigitacaoCodigo.textContent = "O código de Membresia tem 5 dígitos";
  } else {
    codigo.classList.remove('invalid');
    codigo.classList.remove('valid');
    erroDigitacaoCodigo.textContent = "Use números. Digite seu código de membresia.";
  }
});

// ------------------- Arrays de opções para selects ------------------- //
const comites = [
  "Recife", "São Paulo", "Rio de Janeiro", "Belo Horizonte", 
  "Curitiba", "Salvador", "Porto Alegre", "Fortaleza", 
  "Campinas", "Brasília"
];

const cargos = [
  "Membro", "Vice-Presidente (LCVP)", "Presidente (LCP)", 
  "Team Leader/Manager"
];

const areas = [
  "B2B", "B2C", "F&L", "PM", "OGV", "IGV", "OGT", "IGT"
];

// ------------------- Preenchimento automático dos selects ------------------- //
comites.forEach(elementoComite => {
  const option = document.createElement("option");
  option.textContent = elementoComite;
  option.value = elementoComite; // valor enviado no form
  comite.appendChild(option);
});

cargos.forEach(elementoCargo => {
  const option = document.createElement("option");
  option.textContent = elementoCargo;
  option.value = elementoCargo;
  cargo.appendChild(option);
});

areas.forEach(elementoArea => {
  const option = document.createElement("option");
  option.value = elementoArea;
  option.textContent = elementoArea;
  area.appendChild(option);
});

// ------------------- Envio do formulário ------------------- //
form.addEventListener('submit', function(event) {
  event.preventDefault(); // evita envio padrão

  // Pega os valores atuais dos campos
  const inputNome = nome.value.toLowerCase().trim();
  const inputSobrenome = sobrenome.value.toLowerCase().trim();
  const inputComite = comite.value.toLowerCase().trim();
  const inputCargo = cargo.value.toLowerCase().trim();
  const inputArea = area.value.toLowerCase().trim();
  const inputCodigo = codigo.value.trim();

  // Exibe os valores no console para conferência
  console.log('Nome:', inputNome);
  console.log('Sobrenome:', inputSobrenome);
  console.log('Comitê:', inputComite);
  console.log('Cargo:', inputCargo);
  console.log('Área:', inputArea);
  console.log('Código de Membro:', inputCodigo);

  // Gera e exibe o e-mail final
  alert(`O e-mail ${inputNome.split(" ")[0]}.${inputSobrenome.split(" ").pop()}@aiesec.org.br, pertencente a ${inputNome} ${inputSobrenome} da AIESEC ${inputComite} foi gerado com sucesso.`);

  // Aqui você poderia enviar os dados para um servidor via fetch/ajax

  form.reset(); // limpa o formulário
});
