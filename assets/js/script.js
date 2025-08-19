// ------------------- Seleção do formulário e elementos ------------------- //

/**
 * Seleciona o formulário principal de cadastro.
 * @type {HTMLFormElement}
 */
const form = document.querySelector('#email');

/**
 * Seleciona os inputs de nome e sobrenome.
 * @type {HTMLInputElement}
 */
const nome = document.querySelector('#nome');
const sobrenome = document.querySelector('#sobrenome');

/**
 * Seleciona elementos relacionados à senha:
 * input de senha e ícones de alternância de visibilidade.
 */
const senha = document.querySelector("#senha");
const olhoAberto = document.querySelector("#mostrarSenha");
const olhoFechado = document.querySelector("#esconderSenha");

/**
 * Seleciona o ícone que abrirá o modal explicativo do e-mail secundário.
 * Define também o título e o texto do modal.
 */
const modalEmailSecundario = document.querySelector('#helperIcon');
const tituloModal = "E-mail Secundário";
const textoModal = "Campo não obrigatório\nCaso deseje preencher esse campo, digite um e-mail válido\nEste e-mail receberá seu endereço AIESEC e sua senha.";

/**
 * Seleciona elementos para exibir mensagens de erro ou ajuda.
 */
const erroNome = document.querySelector("#erro_nome");
const erroSobrenome = document.querySelector("#erro_sobrenome");
const erroSenha = [
  document.querySelector('#erro_senha1'), // 8+ chars, sem espaço
  document.querySelector('#erro_senha2'), // pelo menos 1 letra minúscula
  document.querySelector('#erro_senha3'), // pelo menos 1 letra maiúscula
  document.querySelector('#erro_senha4')  // pelo menos 1 número e 1 caractere especial
];

/**
 * Seleção do input de e-mail secundário e mensagens de ajuda.
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
 * Seleciona input e elementos de pré-visualização da foto.
 */
const fotoInput = document.querySelector('#foto');
const previewFoto = document.querySelector('#user');
const erroFoto = document.querySelector('#erro_foto');



// ------------------- Mensagens iniciais ------------------- //

/**
 * Define mensagens iniciais de ajuda ou erro nos inputs.
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
 * Valida os inputs de nome e sobrenome ao digitar.
 */
nome.addEventListener('input', () => validarTexto(nome, erroNome, 'nome'));
sobrenome.addEventListener('input', () => validarTexto(sobrenome, erroSobrenome, 'sobrenome'));

/**
 * Valida o input de senha ao digitar.
 */
senha.addEventListener('input', () => validarSenha(senha, erroSenha));

/**
 * Alterna a visibilidade da senha ao clicar nos ícones.
 */
olhoFechado.addEventListener('click', () => toggleSenha(senha, true, olhoAberto, olhoFechado));
olhoAberto.addEventListener('click', () => toggleSenha(senha, false, olhoAberto, olhoFechado));

/**
 * Abre modal de ajuda explicando sobre e-mail secundário.
 */
modalEmailSecundario.addEventListener('click', () => {
  criarModal(tituloModal, textoModal);
});

/**
 * Valida e-mail secundário ao digitar.
 * Aceita apenas domínios permitidos definidos em validarEmailSecundario().
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
 * Mostra a pré-visualização da imagem selecionada.
 * Verifica se o arquivo é uma imagem antes de exibir.
 */
fotoInput.addEventListener('change', () => {
  // Inicializa o preview da imagem
previewImagem(fotoInput,previewFoto, erroFoto);
});

// ------------------- Envio do formulário ------------------- //

/**
 * Evento de envio do formulário.
 * Realiza validações antes de enviar e exibe alerta com e-mail gerado.
 * Mostra spinner de carregamento durante o processamento.
 */
form.addEventListener('submit', async function (event) {
  event.preventDefault(); // Evita envio padrão
  mostrarSpinner();       // Mostra spinner de carregamento

  // Valida os campos obrigatórios
  const nomeValido = validarTexto(nome, erroNome, 'nome');
  const sobrenomeValido = validarTexto(sobrenome, erroSobrenome, 'sobrenome');
  const senhaValida = validarSenha(senha, erroSenha);

  // if (!nomeValido || !sobrenomeValido || !senhaValida) {
  //   alert("Verifique os campos antes de enviar.");
  //   esconderSpinner();
  //   return;
  // }

  // Formata os valores para o e-mail
  const inputNome = nome.value.toLowerCase().trim();
  const inputSobrenome = sobrenome.value.toLowerCase().trim();

  // Simula processamento assíncrono (ex: validação ou request)
  await new Promise(resolve => setTimeout(resolve, 2000));
  esconderSpinner(); // Esconde spinner

  // Exibe alerta com o e-mail gerado
  alert(`O e-mail ${gerarEmail(inputNome, inputSobrenome)}, pertencente a ${inputNome} ${inputSobrenome} foi gerado com sucesso.`);

  // Limpa o formulário
  form.reset();
});
