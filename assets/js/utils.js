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
 * Cria um modal simples de popup com título, mensagem e logo opcional.
 * 
 * @param {string} titulo - Título do modal.
 * @param {string} mensagem - Mensagem a ser exibida no corpo do modal.
 * @param {string} [urlLogo] - URL opcional da imagem da logo a ser exibida no modal.
 */
function criarModalPopUp(titulo, mensagem, urlLogo) {
    // Criação do overlay (fundo semitransparente) do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Criação da caixa do modal
    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');
    modalBox.style.position = 'relative'; // Necessário para posicionar a logo corretamente

    // ------------------- Cabeçalho (Header) ------------------- //
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const h2 = document.createElement('h2');
    h2.textContent = titulo;

    // Botão de fechar o modal
    const btnFechar = document.createElement('span');
    btnFechar.innerHTML = '&times;';
    btnFechar.classList.add('btn-fechar');

    // Adiciona título e botão de fechar ao cabeçalho
    modalHeader.appendChild(h2);
    modalHeader.appendChild(btnFechar);

    // ------------------- Corpo (Body) ------------------- //
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    // Divide a mensagem em linhas e adiciona ao corpo
    mensagem.split('\n').forEach(linha => {
        const texto = linha.trim() + (!/[.!?]$/.test(linha.trim()) ? '.' : '');
        const p = document.createElement('p');
        p.textContent = texto;
        modalBody.appendChild(p);
    });

    // ------------------- Logo ------------------- //
    if (urlLogo) {
        // Se a URL da logo for fornecida, cria o elemento da imagem
        const imgLogo = document.createElement('img');
        imgLogo.src = urlLogo;
        imgLogo.alt = "Logo";
        imgLogo.classList.add('modal-logo');
        modalBody.appendChild(imgLogo);
    }

    // ------------------- Rodapé (Footer) ------------------- //
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    // ------------------- Eventos ------------------- //
    // Evento para fechar o modal ao clicar no botão de fechar
    btnFechar.addEventListener('click', () => modalOverlay.remove());

    // Não adiciona o evento de clique fora para fechar o modal (não será fechado ao clicar fora)

    // ------------------- Montagem ------------------- //
    // Adiciona as partes do modal à estrutura
    modalBox.appendChild(modalHeader);
    modalBox.appendChild(modalBody);
    modalBox.appendChild(modalFooter);
    modalOverlay.appendChild(modalBox);

    // Adiciona o modal ao corpo do documento
    document.body.appendChild(modalOverlay);
}

/**
 * Cria um modal de confirmação para o usuário, exibindo os dados fornecidos e permitindo confirmar ou voltar.
 * 
 * @param {Object} dados - Objeto contendo os dados do usuário a serem exibidos no modal (nome, sobrenome, email, etc).
 * @param {Function} onConfirm - Função callback que é executada após a confirmação do usuário.
 * @param {string} [urlLogo] - URL opcional da imagem da logo a ser exibida no modal.
 */
function criarModalConfirmacao(dados, onConfirm, urlLogo) {
    // Criação do overlay (fundo semitransparente) do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    // Criação da caixa do modal
    const modalBox = document.createElement('div');
    modalBox.classList.add('modal-box');
    modalBox.style.position = 'relative';

    // ------------------- Cabeçalho (Header) ------------------- //
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const h2 = document.createElement('h2');
    h2.textContent = "Confirme seus dados";

    // Botão de fechar o modal
    const btnFechar = document.createElement('span');
    btnFechar.innerHTML = '&times;';
    btnFechar.classList.add('btn-fechar');

    // Adiciona título e botão de fechar ao cabeçalho
    modalHeader.appendChild(h2);
    modalHeader.appendChild(btnFechar);

    // ------------------- Corpo (Body) ------------------- //
    const logo = "./assets/img/Logo-Aiesec.png";
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');
    modalBody.innerHTML = `
        <p><strong>Nome:</strong> ${dados.nome}</p>
        <p><strong>Sobrenome:</strong> ${dados.sobrenome}</p>
        <p><strong>Email institucional:</strong> ${dados.emailGerado}</p>
        ${dados.emailPessoal ? `<p><strong>Email pessoal:</strong> ${dados.emailPessoal}</p>` : ""}
        ${dados.telefone ? `<p><strong>Telefone:</strong> ${dados.telefone}</p>` : ""}
        ${dados.foto ? `<img src="${dados.foto.base64}" class="imagem_usuario">` : ""}
        <p>Pode levar um tempo até a inserção de seu dados!</p>
        <p>Por favor, aguarde!</p>
    `;

    // ------------------- Rodapé (Footer) ------------------- //
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    // Botão de voltar
    const btnVoltar = document.createElement('button');
    btnVoltar.textContent = "Voltar";
    btnVoltar.classList.add('btn-cancelar');
    btnVoltar.style.left = '5%';
    btnVoltar.style.position = "absolute";

    // Botão de confirmar
    const btnConfirmar = document.createElement('button');
    btnConfirmar.textContent = "Confirmar";
    btnConfirmar.classList.add('btn-confirmar');

    modalFooter.appendChild(btnVoltar);
    modalFooter.appendChild(btnConfirmar);

    // ------------------- Logo ------------------- //
    if (urlLogo) {
        // Se a URL da logo for fornecida, cria o elemento da imagem
        const imgLogo = document.createElement('img');
        imgLogo.src = urlLogo;
        imgLogo.alt = "Logo";
        imgLogo.classList.add('modal-logo');
        modalBox.appendChild(imgLogo);
    }

    let confirmado = false;

    // ------------------- Eventos ------------------- //
    // Evento para voltar (fecha o modal)
    btnVoltar.addEventListener('click', () => modalOverlay.remove());

    // Evento para confirmar dados
    btnConfirmar.addEventListener('click', () => {
        // Exibe o ícone de "check" de sucesso
        modalBody.innerHTML = `
            <div class="check-container">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
                </svg>
                <p>Dados confirmados com sucesso!</p>
            </div>
        `;
        // Remove botões do rodapé
        modalFooter.innerHTML = "";
        confirmado = true;
    });

    const fecharModal = () => {
        modalOverlay.remove();
        // Chama a função de confirmação, se fornecida
        if (confirmado && typeof onConfirm === "function") {
            onConfirm();
        }
    };

    // Evento para fechar o modal ao clicar no botão de fechar
    btnFechar.addEventListener('click', fecharModal);

    // Não adiciona o evento de clique fora para fechar o modal
    // modalOverlay.addEventListener('click', e => {
    //     if (e.target === modalOverlay) modalOverlay.remove();
    // });

    // ------------------- Montagem ------------------- //
    // Adiciona as partes do modal à estrutura
    modalBox.appendChild(modalHeader);
    modalBox.appendChild(modalBody);
    modalBox.appendChild(modalFooter);
    modalOverlay.appendChild(modalBox);

    // Adiciona o modal ao corpo do documento
    document.body.appendChild(modalOverlay);
}
/**
 * Validar o campo de codigo de membresia
 * Remove carcteres invalidos e atualiza estado visual e mensagem de erro
 * @param {HTMLInputElement} input - Input de texto.
 * @param {HTMLElement} erroElemento - Elemento para exibir mensagens de erro.
 * @nota Segurança: Remove caracteres especiais para prevenir injeção.
 */
async function validarCodigoMembresia(input,erroElemento){
    input.value = input.value.replace(/[^0-9\s]/g,'');
    const regex = /^[0-9\s]+$/;
    if (regex.test(input.value) && input.value.length === 5 && input.value !== ""){
        input.classList.add('valid');
        input.classList.remove('invalid');
        erroElemento.textContent = " ";
        return true
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        erroElemento.textContent = "O codigo de membresia deve conter 5 digitos";
        if (input.value === ""){
            await sleep(2000);
            input.classList.remove('valid','invalid');
            erroElemento.textContent = "Informe seu codigo de Membresia";
            return false
        }
        return false
    }
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
        return true
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
        erroElemento.textContent = `Deve ser um ${tipo} próprio`;
        if (input.value === "") {
            await sleep(2000);
            input.classList.remove('valid', 'invalid');
            erroElemento.textContent = `Informe seu ${tipo}(se tiver 2 ou 3 também informar)`;
            return false
        }
        return false
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
    const resultado = {
        codicao : allOk,
        mensagem : valor === "" ? "" : "Uma ou mais das condições da senha não foi atendida"
    }
    input.classList.toggle('valid', allOk);
    input.classList.toggle('invalid', !allOk);
    if (valor === "") input.classList.remove('invalid');

    return resultado;
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
    if (email !== ""){
        if (!regexEmail.test(email)) return false;
            const dominio = email.split('@')[1].toLowerCase();
            return dominiosPermitidos.includes(dominio);
    } else {
        return true;
    }
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
    const regex = /^\(?[1-9]{2}\)\s?9\d{4}-\d{4}$/;
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
            await sleep(500);
            input.classList.remove('valid', 'invalid');
            erroElemento.textContent = 'Informe seu telefone';
            return true;
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
    let valor = input.value.replace(/\D/g, '');

    // Limita a 11 dígitos
    if (valor.length > 11) valor = valor.slice(0, 11);

    let resultado = '';

    if (valor.length > 0) resultado += '(' + valor.substring(0, 2);
    if (valor.length >= 3) resultado += ') ' + valor.substring(2, 3);
    if (valor.length >= 4) resultado += valor.substring(3, 7);
    if (valor.length >= 8) resultado += '-' + valor.substring(7);

    return resultado;
}

function normalizarTelefone(numero){
    let apenasNumeros = numero.value.replace(/\D/g,"");

    if(apenasNumeros.startsWith("0")){
        apenasNumeros = apenasNumeros.substring(1);
    }
    return "+55"+apenasNumeros
}

/**
 * Formata um nome completo, colocando a primeira letra de cada palavra em maiúscula
 * e o restante em minúsculas.
 *
 * Exemplo:
 *  - Entrada: "joÃO da silVA"
 *  - Saída: "João Da Silva"
 *
 * @param {string} nomeCompleto - Nome completo a ser formatado.
 * @returns {string} Nome formatado com capitalização correta.
 */
function formatarNome(nomeCompleto) {
    return nomeCompleto
        .toLowerCase()                            // Deixa tudo em minúsculas
        .trim()                                   // Remove espaços nas bordas
        .split(/\s+/)                             // Separa por qualquer quantidade de espaços
        .map(palavra =>
            palavra.charAt(0).toUpperCase() +     // Primeira letra maiúscula
            palavra.slice(1)                      // Restante minúsculo
        )
        .join(" ");                               // Junta as palavras com espaço
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

async function downloadCredenciais(dados, tipo = "sucesso", duracao = 2500) {
    mostrarNotificacao(dados.emailGerado, tipo, duracao)
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
        await sleep(500); // checa a cada 500ms ou 0,5s
    }

   
    // Depois que o spinner desaparecer, faz o download
    downloadCredenciais(dados);
    
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
        noti.textContent = `E-mail: ${mensagem} Não foi possivel ser gerado!`;
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
            previewFoto.src = "./assets/img/azulAiesec.png"; // volta para padrão
            return;
        }
        erroFoto.textContent = '';
        const reader = new FileReader();
        reader.onload = (e) => {
            previewFoto.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        previewFoto.src = "./assets/img/azulAiesec.png"; // reseta
        erroFoto.textContent = '';
    }
}

/**
 * Restaura a imagem padrão do usuário.
 * Usada no reset do formulário.
 * @param {HTMLImageElement} preview - Elemento de preview da foto.
 */
function limpar(preview, nome, sobrenome, senha, emailSecundario, telefone, erroNome, erroSobrenome, erroTelefone, erroSenha,codigo,erroCodigo) {
    preview.src = "./assets/img/azulAiesec.png";
    nome.classList.remove('invalid', 'valid');
    codigo.classList.remove('invalid', 'valid');
    sobrenome.classList.remove('invalid', 'valid');
    senha.classList.remove('invalid', 'valid');
    emailSecundario.classList.remove('invalid', 'valid');
    telefone.classList.remove('invalid', 'valid');
    erroNome.textContent = "Informe seu nome(se tiver 2 ou 3 também informar)";
    erroSobrenome.textContent = "Informe seu Sobrenome(se tiver 2 ou 3 também informar)";
    erroTelefone.textContent = "Informe seu telefone";
    erroCodigo.textContent = "Informe seu codigo de membresia";
    erroSenha[0].style.color = "black";
    erroSenha[1].style.color = "black";
    erroSenha[2].style.color = "black";
    erroSenha[3].style.color = "black";
}

/**
 * Limpa palavras removendo conectores e vogais soltas.
 * @param {string} nomeCompleto - Nome completo do usuário.
 * @returns {string[]} - Array de palavras limpas.
 */
function limparPalavras(nomeCompleto) {
    const conectores = ["de", "da", "di", "do", "du"];
    const vogaisSoltas = ["a", "e", "i", "o", "u"];

    let palavras = nomeCompleto.toLowerCase().trim().split(/\s+/);

    // Filtra palavras que não são conectores nem vogais soltas
    palavras = palavras.filter(p => !conectores.includes(p) && !vogaisSoltas.includes(p));
    return palavras;
}

/**
 * Função que converte uma imagem selecionada em um campo de input para Base64.
 * 
 * Esta função recebe um arquivo de imagem de um campo de input, lê o arquivo de forma assíncrona 
 * e retorna um objeto com os dados da imagem (Base64 e tipo de arquivo).
 * 
 * @param {HTMLInputElement} imagem - O campo de input que contém o arquivo de imagem selecionado.
 * @returns {Promise<Object>} Retorna uma Promise que resolve com um objeto contendo os dados da imagem:
 *    - `base64` {string}: O conteúdo da imagem convertido para Base64.
 *    - `tipo` {string}: O tipo MIME do arquivo (ex: "image/png").
 * 
 * @throws {string} Caso nenhum arquivo seja selecionado, a Promise será rejeitada com a mensagem "Nenhuma imagem selecionada".
 * 
 * @example
 * const inputImagem = document.querySelector('input[type="file"]');
 * DadosImagem(inputImagem).then(({ base64, tipo }) => {
 *    console.log("Base64:", base64);
 *    console.log("Tipo:", tipo);
 * }).catch(error => {
 *    console.log("Erro:", error);
 * });
 */
function dadosImagem(imagem) {
    return new Promise((resolve, reject) => {
        const file = imagem.files[0];
        if (!file) return resolve(null);

        const reader = new FileReader();
        reader.onload = (e) => resolve({ base64: e.target.result, tipo: file.type });
        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

/**
 * Gera um e-mail único verificando se já existe no sistema via POST.
 * Testa todas as combinações possíveis e, se necessário, adiciona um número incremental.
 * @param {string} nome - Nome do usuário.
 * @param {string} sobrenome - Sobrenome do usuário.
 * @returns {Promise<string>} - E-mail único gerado.
 */
async function gerarEmail(nome, sobrenome, erroNome, erroSobrenome, url) {
    // Limpa as palavras do nome e sobrenome
    const ultimoSobrenome = limparPalavras(sobrenome.value); // Corrigido para acessar .value
    const primeiroNome = limparPalavras(nome.value); // Corrigido para acessar .value

    // Gera o email com base no primeiro nome e no último sobrenome
    let email = `${primeiroNome[0]}.${ultimoSobrenome[ultimoSobrenome.length - 1]}@aiesec.org.br`;

    // Exibe o spinner (indicador de carregamento)
    mostrarSpinner();

    // Chama a função para verificar se o e-mail já existe
    let existe = await buscarUsuario(url, email);

    // Verifica se a resposta é um objeto com mais de uma chave (indicando que já existe)
    if (existe && Object.keys(existe).length > 1) {
        // Verifica se o nome e sobrenome têm apenas um caractere
        if (primeiroNome.length === 1 && ultimoSobrenome.length === 1) {
            // Adiciona classe de erro (invalid) e remove a classe de sucesso (valid)
            nome.classList.add('invalid');
            nome.classList.remove('valid');
            sobrenome.classList.add('invalid');
            sobrenome.classList.remove('valid');

            // Exibe mensagem de erro
            erroNome.textContent = "Já existe um e-mail gerado com esse nome.";
            erroSobrenome.textContent = "Já existe um e-mail gerado com esse sobrenome.";
            esconderSpinner();  // Esconde o spinner depois de tudo
            // Volta a página para o topo
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth' // remove se quiser instantâneo
            });
            mostrarNotificacao(email,"erro")
            criarModalPopUp("Erro","Usuario com este email já está cadastrado","./assets/img/Logo-Aiesec.png")
            return "";
        } else {
            // Loop para testar diferentes combinações de primeiro nome e sobrenome
            for (let nomeComeco = 0; nomeComeco < primeiroNome.length; nomeComeco++) {  // Corrigido o limite de índice
                for (let sobrenomeFinal = ultimoSobrenome.length - 1; sobrenomeFinal >= 0; sobrenomeFinal--) {  // Corrigido o limite de índice
                    email = `${primeiroNome[nomeComeco]}.${ultimoSobrenome[sobrenomeFinal]}@aiesec.org.br`;

                    // Verifica se o e-mail já existe
                    existe = await buscarUsuario(url, email);
                    if (existe && Object.keys(existe).length === 1) {
                        // Esconde o spinner e retorna o e-mail gerado
                        esconderSpinner();
                        return email;
                    }
                }
            }

            // Caso não encontre um e-mail válido, exibe erro
            nome.classList.add('invalid');
            nome.classList.remove('valid');
            sobrenome.classList.add('invalid');
            sobrenome.classList.remove('valid');

            erroNome.textContent = "Já existe um e-mail gerado com esses nomes.";
            erroSobrenome.textContent = "Já existe um e-mail gerado com esses sobrenomes.";
            esconderSpinner();  // Esconde o spinner depois de tudo
            // Volta a página para o topo
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth' // remove se quiser instantâneo
            });
            mostrarNotificacao("não gerado","erro")
            criarModalPopUp("Erro","Usuario com este email já está cadastrado","./assets/img/Logo-Aiesec.png")
            return "";
        }
    } else {
        // Esconde o spinner
        esconderSpinner();
        // Retorna o e-mail gerado se não existir
        return email;
    }
}

/**
 * Função para buscar dados através de uma requisição POST.
 * 
 * @param {string} url - A URL para a qual a requisição será feita.
 * @param {string} email - O e-mail que será enviado no corpo da requisição.
 * 
 * @returns {Object|null} Retorna os dados da resposta no formato JSON, ou null se ocorrer um erro.
 * 
 * @throws {Error} Lança um erro caso a requisição falhe ou a resposta não seja bem-sucedida.
 */
async function buscarUsuario(url, email) {
    // Criando um objeto com o e-mail para enviar na requisição
    const dados = { email: email };

    try {
        // Utilizando fetch para fazer a requisição POST
        const response = await fetch(url, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Definindo o tipo de conteúdo como JSON
            },
            body: JSON.stringify(dados) // Convertendo o objeto 'dados' para uma string JSON
        });

        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
            // Se a resposta não for 2xx, lança um erro
            throw new Error(`Falha: ${response.status} - ${response.statusText}`);
        }

        // Parseando a resposta para JSON e retornando os dados
        const data = await response.json();
        return data;

    } catch (error) {
        // Tratando os erros, caso algo dê errado
        console.error("Erro ao buscar dados:", error.message);
        return null; // Retorna null em caso de erro
    }
}

async function inserirUsuarios(url, dados) {
    const data = {
    nome: dados.nome,
    sobrenome: dados.sobrenome,
    senha: dados.senha,
    emailGerado: dados.emailGerado,
    emailPessoal: dados.emailPessoal,
    telefone: dados.telefone,
    foto: { base64: dados.foto.base64.split(',')[1], tipo: dados.foto.tipo },
    codigo : dados.codigo
  }
    try {
        // Utilizando fetch para fazer a requisição POST
        const response = await fetch(url, {
            method: 'POST', // Método HTTP
            headers: {
                'Content-Type': 'application/json', // Definindo o tipo de conteúdo como JSON
            },
            body: JSON.stringify(data) // Convertendo o objeto 'dados' para uma string JSON
        });

        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
            // Se a resposta não for 2xx, lança um erro
            throw new Error(`Falha: ${response.status} - ${response.statusText}`);
        }

        // Parseando a resposta para JSON e retornando os dados
        const retorno = await response.json();
        if (Object.keys(retorno).length > 2){
            esconderSpinner();
            // Aguarda o spinner fechar e então gera o TXT
            return esperarESpinnerFechar(data);
        } else {
            esconderSpinner();
             return criarModalPopUp("Falha",retorno.message,"./assets/img/Logo-Aiesec.png");
        }
    } catch (error) {
        // Tratando os erros, caso algo dê errado
        console.error("Erro ao buscar dados:", error.message);
        return null; // Retorna null em caso de erro
    }
}