// ------------------- FUNÇÕES REUTILIZÁVEIS ------------------- //

/**
 * Pausa a execução por uma quantidade específica de milissegundos.
 * Usado em validações assíncronas ou feedback temporário.
 * @param {number} ms - Tempo em milissegundos para pausar.
 * @returns {Promise<void>} Promise resolvida após o tempo especificado.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cria e exibe um modal dinâmico.
 * Divide o texto em parágrafos com base nas quebras de linha (\n).
 * @param {string} titulo - Título exibido no cabeçalho do modal.
 * @param {string} mensagem - Corpo da mensagem, aceita "\n" como quebra.
 */
function criarModal(titulo, mensagem) {
    // Overlay escuro por trás do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Caixa principal
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

    // Divide mensagem em linhas e cria <p> para cada
    const linhas = mensagem.split('\n');
    linhas.forEach(linha => {
        let texto = linha.trim();
        if (texto && !/[.!?]$/.test(texto)) {
            texto += '.'; // garante pontuação final
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
 * Remove caracteres inválidos e fornece mensagens de erro dinâmicas.
 * @param {HTMLInputElement} input - Campo de input a validar.
 * @param {HTMLElement} erroElemento - Elemento onde mostrar mensagens.
 * @param {string} tipo - Tipo do campo ('nome' ou 'sobrenome').
 * @returns {Promise<boolean>} true se válido, false caso contrário.
 */
async function validarTexto(input, erroElemento, tipo) {
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ''); // limpa caracteres
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

        // Se vazio, restaura mensagem depois de 2s
        if (input.value === "") {
            await sleep(2000);
            input.classList.remove('invalid');
            erroElemento.textContent = `Informe seu ${tipo}`;
        }
        return false;
    }
}

/**
 * Valida a senha de acordo com critérios de segurança:
 * - Mínimo 8 caracteres
 * - Sem espaços
 * - Pelo menos 1 letra minúscula
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 número e 1 caractere especial
 * @param {HTMLInputElement} input - Campo de senha.
 * @param {HTMLElement[]} erros - Lista de mensagens relacionadas às regras.
 * @returns {boolean} true se todos os critérios forem atendidos.
 */
function validarSenha(input, erros) {
    const valor = input.value;
    const minimo = valor.length >= 8 && !/\s/.test(valor);
    const minusculo = /[a-z]/.test(valor);
    const maiusculo = /[A-Z]/.test(valor);
    const caracterEspecial = /\d/.test(valor) && /[@$!%*?&]/.test(valor);

    // Atualiza mensagens com cores
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
 * @param {boolean} mostrar - true para mostrar senha, false para ocultar.
 * @param {HTMLElement} olhoAberto - Ícone de olho aberto.
 * @param {HTMLElement} olhoFechado - Ícone de olho fechado.
 */
function toggleSenha(input, mostrar, olhoAberto, olhoFechado) {
    input.type = mostrar ? 'text' : 'password';
    olhoAberto.style.display = mostrar ? 'inline' : 'none';
    olhoFechado.style.display = mostrar ? 'none' : 'inline';
}

/**
 * Verifica se o e-mail informado pertence a domínios permitidos.
 * @param {string} email - E-mail informado no input.
 * @returns {boolean} true se válido, false caso contrário.
 */
function validarEmailSecundario(email) {
    const dominiosPermitidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    const regexEmail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regexEmail.test(email)) return false;
    const dominio = email.split('@')[1].toLowerCase();
    return dominiosPermitidos.includes(dominio);
}

/**
 * Exibe o spinner de carregamento.
 */
function mostrarSpinner() {
    document.getElementById('spinner').style.display = 'flex';
}

/**
 * Oculta o spinner de carregamento.
 */
function esconderSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

/**
 * Mostra a pré-visualização da foto enviada.
 * Aceita apenas arquivos JPG e PNG.
 * @param {HTMLInputElement} fotoInput - Input do tipo file.
 * @param {HTMLImageElement} previewFoto - Elemento <img> para mostrar preview.
 * @param {HTMLElement} erroFoto - Elemento de erro para mensagens.
 */
function previewImagem(fotoInput, previewFoto, erroFoto) {
    const file = fotoInput.files[0];

    if (file) {
        const formatosPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!formatosPermitidos.includes(file.type)) {
            erroFoto.textContent = "Apenas arquivos JPGE ,JPG ou PNG são permitidos.";
            previewFoto.src = "./assets/img/user.png"; // volta para padrão
            return;
        }
        erroFoto.textContent = '';
        const reader = new FileReader();
        reader.onload = (e) => {
            previewFoto.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        previewFoto.src = "./assets/img/user.png"; // reseta
        erroFoto.textContent = '';
    }
}

/**
 * Restaura a imagem padrão do usuário.
 * Usada no reset do formulário.
 * @param {HTMLImageElement} preview - Elemento de preview da foto.
 */
function limpar(preview) {
    preview.src = "./assets/img/user.png";
}

/**
 * Gera e-mail institucional a partir do nome e sobrenome.
 * Formato: nome.sobrenome@aiesec.org.br
 * @param {string} nome - Nome do usuário.
 * @param {string} sobrenome - Sobrenome do usuário.
 * @returns {string} E-mail formatado.
 */
function gerarEmail(nome, sobrenome) {
    return `${nome.split(" ")[0]}.${sobrenome.split(" ").pop()}@aiesec.org.br`;
}
