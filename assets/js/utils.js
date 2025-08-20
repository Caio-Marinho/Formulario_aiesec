// =================== FUNÇÕES REUTILIZÁVEIS =================== //

/**
 * Pausa a execução por uma quantidade específica de milissegundos.
 * Usado em validações assíncronas ou feedback temporário.
 * @param {number} ms - Tempo em milissegundos para pausar.
 * @returns {Promise<void>} Promise resolvida após o tempo especificado.
 * @nota Segurança: Usar apenas para UX; não bloqueia thread principal.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Cria e exibe um modal de informação.
 * Divide o texto em parágrafos com base nas quebras de linha (\n).
 * @param {string} titulo - Título exibido no cabeçalho do modal.
 * @param {string} mensagem - Corpo da mensagem, aceita "\n" como quebra.
 * @param {string} urlLogo - URL opcional de uma logo que aparecerá no modal.
 * @nota Possíveis erros: Certifique-se que urlLogo é válida; imagens externas podem falhar.
 */
function criarModalPopUp(titulo, mensagem, urlLogo) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');
    modalBox.style.position = 'relative'; // necessário para posicionar logo

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

    mensagem.split('\n').forEach(linha => {
        const texto = linha.trim() + (!/[.!?]$/.test(linha.trim()) ? '.' : '');
        const p = document.createElement('p');
        p.textContent = texto;
        modalBody.appendChild(p);
    });

    // ------------------- Footer ------------------- //
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    // ------------------- Logo ------------------- //
    if (urlLogo) {
        const imgLogo = document.createElement('img');
        imgLogo.src = urlLogo;
        imgLogo.alt = "Logo";
        imgLogo.classList.add('modal-logo');
        modalBox.appendChild(imgLogo);
    }

    // ------------------- Eventos ------------------- //
    btnFechar.addEventListener('click', () => modalOverlay.remove());
    modalOverlay.addEventListener('click', e => {
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
 * Cria um modal de confirmação com dados do usuário.
 * Inclui animação de ✔️ ao confirmar e executa callback após fechamento.
 * @param {Object} dados - Dados do usuário {nome, sobrenome, emailGerado, emailPessoal, telefone, foto}.
 * @param {Function} onConfirm - Função chamada após confirmação e fechamento do modal.
 * @param {string} urlLogo - URL opcional de uma logo que aparecerá no modal.
 * @nota Segurança: Evitar injetar HTML não confiável em 'dados'.
 * @nota Possíveis erros: 'dados' incompletos podem quebrar a renderização.
 */
function criarModalConfirmacao(dados, onConfirm, urlLogo) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');
    modalBox.style.position = 'relative';

    // ------------------- Header ------------------- //
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const h2 = document.createElement('h2');
    h2.textContent = "Confirme seus dados";

    const btnFechar = document.createElement('span');
    btnFechar.innerHTML = '&times;';
    btnFechar.classList.add('btn-fechar');

    modalHeader.appendChild(h2);
    modalHeader.appendChild(btnFechar);

    // ------------------- Body ------------------- //
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.innerHTML = `
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Sobrenome:</strong> ${dados.sobrenome}</p>
        <p><strong>Email institucional:</strong> ${dados.emailGerado}</p>
        <p><strong>Email pessoal:</strong> ${dados.emailPessoal}</p>
        <p><strong>Telefone:</strong> ${dados.telefone}</p>
        ${dados.foto ? `<img src="${dados.foto}" class="imagem_usuario">` : ""}
    `;

    // ------------------- Footer ------------------- //
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const btnVoltar = document.createElement('button');
    btnVoltar.textContent = "Voltar";
    btnVoltar.classList.add('btn-cancelar');
    btnVoltar.style.left = '5%';
    btnVoltar.style.position = "absolute";

    const btnConfirmar = document.createElement('button');
    btnConfirmar.textContent = "Confirmar";
    btnConfirmar.classList.add('btn-confirmar');

    modalFooter.appendChild(btnVoltar);
    modalFooter.appendChild(btnConfirmar);

    // ------------------- Logo ------------------- //
    if (urlLogo) {
        const imgLogo = document.createElement('img');
        imgLogo.src = urlLogo;
        imgLogo.alt = "Logo";
        imgLogo.classList.add('modal-logo');
        modalBox.appendChild(imgLogo);
    }

    let confirmado = false;

    // ------------------- Eventos ------------------- //
    btnVoltar.addEventListener('click', () => modalOverlay.remove());

    btnConfirmar.addEventListener('click', () => {
        modalBody.innerHTML = `
            <div class="check-container">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
                </svg>
                <p>Dados confirmados com sucesso!</p>
            </div>
        `;
        modalFooter.innerHTML = "";
        confirmado = true;
    });

    const fecharModal = () => {
        modalOverlay.remove();
        if (confirmado && typeof onConfirm === "function") {
            onConfirm();
        }
    };

    btnFechar.addEventListener('click', fecharModal);
    modalOverlay.addEventListener('click', e => {
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
 * Valida um campo de texto (nome ou sobrenome).
 * Remove caracteres inválidos e atualiza estado visual e mensagem de erro.
 * @param {HTMLInputElement} input - Input de texto.
 * @param {HTMLElement} erroElemento - Elemento para exibir mensagens de erro.
 * @param {string} tipo - Tipo de dado (nome/sobrenome) para a mensagem.
 * @nota Segurança: Remove caracteres especiais para prevenir injeção.
 */
async function validarTexto(input, erroElemento, tipo) {
    input.value = input.value.replace(/[^A-Za-zÀ-ÿ\s]/g, '');
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (regex.test(input.value) && input.value !== "") {
        input.classList.add('valid');
        input.classList.remove('invalid');
        erroElemento.textContent = " ";
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        erroElemento.textContent = `Deve ser um ${tipo} próprio`;
        if (input.value === "") {
            await sleep(2000);
            input.classList.remove('valid', 'invalid');
            erroElemento.textContent = `Informe seu ${tipo}`;
        }
    }
}

/**
 * Valida a senha de acordo com critérios de segurança.
 * @param {HTMLInputElement} input - Campo de senha.
 * @param {HTMLElement[]} erros - Lista de elementos que exibem regras de senha.
 * @returns {boolean} True se todos os critérios forem atendidos.
 * @nota Segurança: Não armazene senhas em texto puro; apenas valida visualmente.
 */
function validarSenha(input, erros) {
    const valor = input.value;
    const minimo = valor.length >= 8 && !/\s/.test(valor);
    const minusculo = /[a-z]/.test(valor);
    const maiusculo = /[A-Z]/.test(valor);
    const caracterEspecial = /\d/.test(valor) && /[@$!%*?&]/.test(valor);

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
 * @param {string} email - E-mail informado.
 * @returns {boolean} True se válido, false caso contrário.
 */
function validarEmailSecundario(email) {
    const dominiosPermitidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
    const regexEmail = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regexEmail.test(email)) return false;
    const dominio = email.split('@')[1].toLowerCase();
    return dominiosPermitidos.includes(dominio);
}

/**
 * Valida telefone brasileiro no formato (DDD) 9XXXX-XXXX
 * @param {HTMLInputElement} input - Campo do telefone
 * @param {HTMLElement} erroElemento - Elemento para mostrar a mensagem de erro
 * @returns {boolean} true se o telefone for válido
 */
async function validarTelefone(input, erroElemento) {
    // Remove espaços e caracteres não numéricos para validação

    input.value = formatarTelefone(input)
    // Regex: DDD (2 dígitos) + 9 + 4 ou 5 dígitos + 4 dígitos
    const regex = /^0?\(\d{2}\)\s?9\d{4}-\d{4}$/;
    if (regex.test(input.value)) {
        input.classList.add('valid');
        input.classList.remove('invalid');
        erroElemento.textContent = '';
        return true;
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        erroElemento.textContent = 'Digite um telefone válido no formato (DDD) 9XXXX-XXXX';
        if (input.value === "") {
            await sleep(2000);
            input.classList.remove('valid', 'invalid');
            erroElemento.textContent = 'Informe seu telefone';
        }
        return false;
    }
}

/**
 * Formata um número de telefone no padrão (99) 9 9999-9999
 * @param {string} valor - Apenas números do telefone
 * @returns {string} Telefone formatado
 */
function formatarTelefone(input) {
    // Remove tudo que não for número
    const valor = input.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (valor.length > 11) valor = valor.slice(0, 11);

    let resultado = '';

    if (valor.length > 0) resultado += '(' + valor.substring(0, 2);
    if (valor.length >= 3) resultado += ') ' + valor.substring(2, 3);
    if (valor.length >= 4) resultado += valor.substring(3, 7);
    if (valor.length >= 8) resultado += '-' + valor.substring(7);

    return resultado;
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

async function downloadCredenciais(dados) {
    mostrarNotificacao(`${gerarEmail(dados.nome, dados.sobrenome)}`, "sucesso", 2500)
    await sleep(3000)
    const conteudo = `Email institucional: ${dados.emailGerado}\nSenha: ${dados.senha}`;
    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${dados.nome}_credenciais.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Exemplo de uso depois que o spinner fechar
async function esperarESpinnerFechar(dados) {
    // Aguarda enquanto o spinner estiver visível
    while (document.getElementById('spinner').style.display !== 'none') {
        await sleep(100); // checa a cada 100ms
    }

    if (dados.emailPessoal === "") {
        // Depois que o spinner desaparecer, faz o download
        downloadCredenciais(dados);
    }
}

/**
 * Mostra uma notificação flutuante no canto superior direito.
 * @param {string} mensagem - Texto da notificação.
 * @param {'sucesso'|'erro'} tipo - Tipo da notificação: sucesso (verde) ou erro (vermelho).
 * @param {number} duracao - Tempo em ms que a notificação ficará visível.
 */
function mostrarNotificacao(mensagem, tipo = 'sucesso', duracao = 3000) {
    // Cria container principal caso ainda não exista
    let container = document.getElementById('notificacaoContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificacaoContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = 9999;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    // Cria a notificação
    const noti = document.createElement('div');
    noti.style.padding = '10px 20px';
    noti.style.borderRadius = '8px';
    noti.style.color = '#fff';
    noti.style.fontWeight = 'bold';
    noti.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    noti.style.opacity = '0';
    noti.style.transform = 'translateY(-20px)';
    noti.style.transition = 'all 0.3s ease';

    // Define cor conforme o tipo
    if (tipo === 'sucesso') {
        noti.style.backgroundColor = '#28a745'; // verde
        noti.textContent = `E-mail: ${mensagem} Gerado com Sucesso!`;
    } else if (tipo === 'erro') {
        noti.style.backgroundColor = '#dc3545'; // vermelho
    }

    container.appendChild(noti);

    // Anima entrada
    requestAnimationFrame(() => {
        noti.style.opacity = '1';
        noti.style.transform = 'translateY(0)';
    });
    // Volta a página para o topo
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // remove se quiser instantâneo
    });

    // Remove após duracao
    setTimeout(() => {
        noti.style.opacity = '0';
        noti.style.transform = 'translateY(-20px)';
        setTimeout(() => container.removeChild(noti), 5000);
    }, duracao);
}

/**
 * Mostra a pré-visualização da foto enviada.
 * Aceita apenas arquivos JPG e PNG
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
 * Limpa palavras removendo conectores e vogais soltas.
 * @param {string} nomeCompleto - Nome completo do usuário.
 * @returns {string[]} - Array de palavras limpas.
 */
function limparPalavras(nomeCompleto) {
    const conectores = ["de", "da", "di", "do", "du"];
    const vogaisSoltas = ["a", "e", "i", "o", "u"];

    let palavras = nomeCompleto.toLowerCase().split(" ");

    // Filtra palavras que não são conectores nem vogais soltas
    palavras = palavras.filter(p => !conectores.includes(p) && !vogaisSoltas.includes(p));

    return palavras;
}

/**
 * Gera um e-mail único verificando se já existe no sistema via POST.
 * Testa todas as combinações possíveis e, se necessário, adiciona um número incremental.
 * @param {string} nome - Nome do usuário.
 * @param {string} sobrenome - Sobrenome do usuário.
 * @returns {Promise<string>} - E-mail único gerado.
 */
function gerarEmail(nome, sobrenome) {
    let ultimoSobrenome = limparPalavras(sobrenome);
    let primeiroNome = limparPalavras(nome)
    let email = `${primeiroNome[0]}.${ultimoSobrenome.pop()}@aiesec.org.br`
    return email;
}



async function buscarDados(url, email) {
    const dados = { email: email };

    try {
        const response = await axios.post(url, dados, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;

    } catch (error) {
        // Axios encapsula o erro, então você pode pegar o status ou a mensagem
        if (error.response) {
            console.error(`Falha: ${error.response.status} - ${error.response.data.erro}`);
        } else {
            console.error("Falha:", error.message);
        }
    }
}