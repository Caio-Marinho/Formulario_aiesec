// ------------------- Seleção do formulário e elementos ------------------- //

/**
 * Seleciona o formulário principal de cadastro de usuário.
 * Usado para controlar eventos de validação e envio.
 * @type {HTMLFormElement}
 */
const form = document.querySelector('#email');

/**
 * Seleciona os campos de entrada de nome e sobrenome do usuário.
 * @type {HTMLInputElement}
 */
const nome = document.querySelector('#nome');
const sobrenome = document.querySelector('#sobrenome');

/**
 * Seleciona os elementos relacionados à senha:
 * - Campo de senha.
 * - Ícone de olho aberto (mostrar senha).
 * - Ícone de olho fechado (ocultar senha).
 */
const senha = document.querySelector("#senha");
const olhoAberto = document.querySelector("#mostrarSenha");
const olhoFechado = document.querySelector("#esconderSenha");

/**
 * Seleciona o ícone de ajuda referente ao e-mail secundário.
 * Define título e texto exibidos dentro do modal de explicação.
 */
const modalEmailSecundario = document.querySelector('#helperIcon');
const tituloModal = "E-mail Secundário";
const textoModal = "Campo não obrigatório\nCaso deseje preencher esse campo, digite um e-mail válido\nEste e-mail receberá seu endereço AIESEC e sua senha.";

/**
 * Seleciona elementos destinados a exibir mensagens de erro ou ajuda
 * relacionados ao preenchimento de nome, sobrenome e senha.
 */
const erroNome = document.querySelector("#erro_nome");
const erroSobrenome = document.querySelector("#erro_sobrenome");

/**
 * Seleciona mensagens de validação da senha:
 * - erro_senha1: mínimo de 8 caracteres e sem espaços.
 * - erro_senha2: pelo menos 1 letra minúscula.
 * - erro_senha3: pelo menos 1 letra maiúscula.
 * - erro_senha4: pelo menos 1 número e 1 caractere especial.
 * @type {HTMLElement[]}
 */
const erroSenha = [
  document.querySelector('#erro_senha1'),
  document.querySelector('#erro_senha2'),
  document.querySelector('#erro_senha3'),
  document.querySelector('#erro_senha4')
];

/**
 * Seleciona o campo de e-mail secundário e os elementos que exibem
 * a lista de domínios de e-mail permitidos.
 */
const emailSecundario = document.querySelector('#email_sec');
const emailsValidos = [
  document.querySelector('#erro_email_sec'),
  document.querySelector('#erro_email_sec1'),
  document.querySelector('#erro_email_sec2'),
  document.querySelector('#erro_email_sec3'),
  document.querySelector('#erro_email_sec4')
];

/**
 * Seleciona os elementos relacionados à foto do usuário:
 * - Input do tipo "file".
 * - Imagem de pré-visualização.
 * - Mensagem de erro para formato inválido.
 */
const fotoInput = document.querySelector('#foto');
const previewFoto = document.querySelector('#user');
const erroFoto = document.querySelector('#erro_foto');


// ------------------- Mensagens iniciais ------------------- //

/**
 * Define mensagens de orientação para os inputs logo no carregamento da página.
 * Inclui instruções para nome, sobrenome, senha e e-mail secundário.
 */
erroNome.textContent = "Informe seu nome";
erroSobrenome.textContent = "Informe seu Sobrenome";

emailsValidos[0].textContent = "E-mails válidos:";
emailsValidos[1].textContent = "- @gmail.com";
emailsValidos[2].textContent = "- @hotmail.com";
emailsValidos[3].textContent = "- @outlook.com";
emailsValidos[4].textContent = "- @yahoo.com";

erroSenha[0].textContent = 'Mínimo de 8 caracteres e sem espaços';
erroSenha[1].textContent = 'Pelo menos 1 letra minúscula (a-z)';
erroSenha[2].textContent = 'Pelo menos 1 letra maiúscula (A-Z)';
erroSenha[3].textContent = 'Pelo menos 1 número (0-9) e 1 caractere especial (@$!%*?&)';


// ------------------- EVENT LISTENERS ------------------- //

/**
 * Aplica validação em tempo real aos inputs de nome e sobrenome.
 */
nome.addEventListener('input', () => validarTexto(nome, erroNome, 'nome'));
sobrenome.addEventListener('input', () => validarTexto(sobrenome, erroSobrenome, 'sobrenome'));

/**
 * Valida a senha conforme o usuário digita.
 */
senha.addEventListener('input', () => validarSenha(senha, erroSenha));

/**
 * Alterna a visibilidade da senha (mostrar/ocultar) ao clicar nos ícones.
 */
olhoFechado.addEventListener('click', () => toggleSenha(senha, true, olhoAberto, olhoFechado));
olhoAberto.addEventListener('click', () => toggleSenha(senha, false, olhoAberto, olhoFechado));

/**
 * Abre modal de ajuda explicando sobre o e-mail secundário.
 */
modalEmailSecundario.addEventListener('click', () => {
  criarModal(tituloModal, textoModal);
});

/**
 * Valida o domínio do e-mail secundário em tempo real.
 * Aceita apenas domínios definidos em validarEmailSecundario().
 */
emailSecundario.addEventListener('input', () => {
  const valor = emailSecundario.value.trim();

  if (valor === '') {
    emailSecundario.classList.remove('valid', 'invalid');
    return;
  }

  if (validarEmailSecundario(valor)) {
    emailSecundario.classList.add('valid');
    emailSecundario.classList.remove('invalid');
  } else {
    emailSecundario.classList.add('invalid');
    emailSecundario.classList.remove('valid');
  }
});

/**
 * Mostra a pré-visualização da foto selecionada no input de arquivo.
 */
fotoInput.addEventListener('change', () => {
  previewImagem(fotoInput, previewFoto, erroFoto);
});

/**
 * Restaura a imagem padrão ao clicar no botão de reset do formulário.
 */
form.addEventListener("reset", () => {
  setTimeout(() => limpar(previewFoto), 0);
});


// ------------------- Envio do formulário ------------------- //

/**
 * Controla o envio do formulário:
 * - Evita envio automático.
 * - Exibe spinner de carregamento.
 * - Valida os campos obrigatórios.
 * - Gera e exibe o e-mail institucional.
 * - Reseta o formulário após envio.
 */
form.addEventListener('submit', async function (event) {
  event.preventDefault();
  mostrarSpinner();

  // Validação dos campos obrigatórios
  const nomeValido = validarTexto(nome, erroNome, 'nome');
  const sobrenomeValido = validarTexto(sobrenome, erroSobrenome, 'sobrenome');
  const senhaValida = validarSenha(senha, erroSenha);

  // if (!nomeValido || !sobrenomeValido || !senhaValida) {
  //   alert("Verifique os campos antes de enviar.");
  //   esconderSpinner();
  //   return;
  // }

  const inputNome = nome.value.toLowerCase().trim();
  const inputSobrenome = sobrenome.value.toLowerCase().trim();

  // Simula processamento assíncrono
  await new Promise(resolve => setTimeout(resolve, 2000));
  esconderSpinner();

  console.log("Nome:", nome.value);
  console.log("Sobrenome:", sobrenome.value);
  console.log("Email:", emailSecundario.value);
  console.log("Senha:", senha.value);

   if (fotoInput) {
    const file = fotoInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result; // Aqui está a imagem em Base64
      console.log("Imagem Base64:", base64);
      console.log("Tipo:", file.type);
    };
    reader.readAsDataURL(file);
  } else {
    console.log("Nenhuma imagem selecionada");
  }
  alert(`O e-mail ${gerarEmail(inputNome, inputSobrenome)}, pertencente a ${inputNome} ${inputSobrenome} foi gerado com sucesso.`);

  form.reset();
});
