// ------------------- FUNÇÕES REUTILIZÁVEIS ------------------- //

/**
 * Pausa a execução por uma quantidade específica de milissegundos.
 * @param {number} ms - Tempo em milissegundos para pausar.
 * @returns {Promise<void>} Uma promise que resolve após o tempo especificado.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cria e exibe um modal formatando a mensagem caso haja quebras (\n)
 * @param {string} titulo - Título do modal.
 * @param {string} mensagem - Mensagem do corpo do modal.
 */
function criarModal(titulo, mensagem) {
    // Overlay do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Caixa principal do modal
    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');

    // ------------------- Header ------------------- //
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const h2 = document.createElement('h2');
    h2.textContent = titulo;

    const btnFechar = document.createElement('span');
    btnFechar.innerHTML = '&times;';
    btnFechar.classList.add('btn-fechar');

    modalHeader.appendChild(h2);
    modalHeader.appendChild(btnFechar);

    // ------------------- Body ------------------- //
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    // Quebra a mensagem em parágrafos ao encontrar "\n"
    const linhas = mensagem.split('\n');
    linhas.forEach(linha => {
        // Remove espaços extras e adiciona ponto final se não houver
        let texto = linha.trim();
        if (texto && !/[.!?]$/.test(texto)) {
            texto += '.';
        }
        const p = document.createElement('p');
        p.textContent = texto;
        modalBody.appendChild(p);
    });

    // ------------------- Footer ------------------- //
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');
    modalFooter.textContent = ''; // opcional

    // ------------------- Eventos ------------------- //
    btnFechar.addEventListener('click', () => modalOverlay.remove());
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.remove();
    });

    // ------------------- Montagem ------------------- //
    modalBox.appendChild(modalHeader);
    modalBox.appendChild(modalBody);
    modalBox.appendChild(modalFooter);
    modalOverlay.appendChild(modalBox);

    document.body.appendChild(modalOverlay);
}


/**
 * Valida um input de texto (nome ou sobrenome).
 * Remove caracteres inválidos e verifica se o valor é válido.
 * @param {HTMLInputElement} input - Campo de input a ser validado.
 * @param {HTMLElement} erroElemento - Elemento onde a mensagem de erro será exibida.
 * @param {string} tipo - Tipo de campo, usado na mensagem de erro ('nome' ou 'sobrenome').
 * @returns {Promise<boolean>} Retorna true se válido, false caso contrário.
 */
async function validarTexto(input, erroElemento, tipo) {
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''); // Remove caracteres inválidos
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;

    if (regex.test(input.value) && input.value !== "") {
        input.classList.add('valid');
        input.classList.remove('invalid');
        erroElemento.textContent = " ";
        return true;
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        erroElemento.textContent = `Deve ser um ${tipo} próprio`;

        // Se campo vazio, restaura após 2 segundos
        if (input.value === "") {
            await sleep(2000);
            input.classList.remove('invalid');
            erroElemento.textContent = `Informe seu ${tipo}`;
        }
        return false;
    }
}

/**
 * Valida um input de senha de acordo com regras:
 * mínimo 8 caracteres, sem espaços, 1 minúscula, 1 maiúscula, 1 número e 1 caractere especial.
 * @param {HTMLInputElement} input - Campo de senha a ser validado.
 * @param {HTMLElement[]} erros - Array com elementos de mensagem de erro correspondentes às regras.
 * @returns {boolean} Retorna true se todas as regras forem atendidas.
 */
function validarSenha(input, erros) {
    const valor = input.value;
    const minimo = valor.length >= 8 && !/\s/.test(valor);
    const minusculo = /[a-z]/.test(valor);
    const maiusculo = /[A-Z]/.test(valor);
    const caracterEspecial = /\d/.test(valor) && /[@$!%*?&]/.test(valor);

    // Atualiza cores das mensagens
    if (valor !== "") {
        erros[0].style.color = minimo ? 'green' : 'red';
        erros[1].style.color = minusculo ? 'green' : 'red';
        erros[2].style.color = maiusculo ? 'green' : 'red';
        erros[3].style.color = caracterEspecial ? 'green' : 'red';
    } else {
        erros.forEach(e => e.style.color = 'black');
        input.classList.remove('valid');
    }

    const allOk = minimo && minusculo && maiusculo && caracterEspecial;
    input.classList.toggle('valid', allOk);
    input.classList.toggle('invalid', !allOk);

    if (valor === "") input.classList.remove('invalid');

    return allOk;
}

/**
 * Alterna a visibilidade de um campo de senha.
 * @param {HTMLInputElement} input - Campo de senha.
 * @param {boolean} mostrar - true para mostrar, false para ocultar.
 * @param {HTMLElement} olhoAberto - Ícone de olho aberto.
 * @param {HTMLElement} olhoFechado - Ícone de olho fechado.
 */
function toggleSenha(input, mostrar, olhoAberto, olhoFechado) {
    input.type = mostrar ? 'text' : 'password';
    olhoAberto.style.display = mostrar ? 'inline' : 'none';
    olhoFechado.style.display = mostrar ? 'none' : 'inline';
}

/**
 * Valida se o e-mail possui um domínio permitido
 * @param {string} email - Valor do input do e-mail
 * @returns {boolean} true se válido, false se inválido
 */
function validarEmailSecundario(email) {
    // Lista de domínios permitidos
    const dominiosPermitidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];

    // Expressão regular básica para verificar formato
    const regexEmail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regexEmail.test(email)) return false;

    // Extrai o domínio do e-mail
    const dominio = email.split('@')[1].toLowerCase();

    // Verifica se o domínio está na lista
    return dominiosPermitidos.includes(dominio);
}

/**
 * Exibe o spinner de carregamento
 */
function mostrarSpinner() {
    document.getElementById('spinner').style.display = 'flex';
}

/**
 * Oculta o spinner de carregamento
 */
function esconderSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

/**
 * Mostra a pré-visualização da imagem selecionada no input.
 * Exibe mensagem de erro caso o arquivo não seja uma imagem.
 * @param {HTMLInputElement} fotoInput - Input do tipo "file" para foto do usuário.
 * @param {HTMLImageElement} previewFoto - Elemento <img> para exibir a pré-visualização.
 * @param {HTMLElement} erroFoto - Elemento onde a mensagem de erro será exibida.
 */
function previewImagem(fotoInput, previewFoto, erroFoto) {
    const file = fotoInput.files[0];

    if (file) {
        // Verifica se é uma imagem
        if (!file.type.startsWith('image/')) {
            erroFoto.textContent = "Selecione um arquivo de imagem válido.";
            previewFoto.style.display = 'none';
            return;
        }

        erroFoto.textContent = '';
        const reader = new FileReader();
        reader.onload = (e) => {
            previewFoto.src = e.target.result;
            previewFoto.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewFoto.style.display = 'none';
        erroFoto.textContent = '';
    }
}

/**
 * Gera um e-mail institucional a partir de nome e sobrenome.
 * Ex.: caio.santos@aiesec.org.br
 * @param {string} nome - Nome do usuário.
 * @param {string} sobrenome - Sobrenome do usuário.
 * @returns {string} E-mail formatado.
 */
function gerarEmail(nome, sobrenome) {
    return `${nome.split(" ")[0]}.${sobrenome.split(" ").pop()}@aiesec.org.br`;
}
