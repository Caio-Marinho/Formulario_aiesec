// Seleciona o formulário
const form = document.querySelector('#email');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evita envio padrão

  // Pega os valores dos inputs e selects
  const nome = document.getElementById('nome').value.toLowerCase().trim();
  const sobrenome = document.getElementById('sobrenome').value.toLowerCase().trim();
  const comite = document.getElementById('comite').value;
  const cargo = document.getElementById('cargo').value;
  const area = document.getElementById('area').value;
  const codigo = document.getElementById('codigo').value;

  // Exibe os valores no console
  console.log('Nome:', nome);
  console.log('Sobrenome:', sobrenome);
  console.log('Comitê:', comite);
  console.log('Cargo:', cargo);
  console.log('Área:', area);
  console.log('Código de Membro:', codigo);
  alert(`O e-mail ${nome.split(" ")[0]}.${sobrenome.split(" ").pop()}@aiesec.org.br, pertencente a ${nome} ${sobrenome} da aiesec ${comite} foi gerado com sucesso.`);
  
  // Aqui você pode enviar os dados para um servidor via fetch/ajax
  
  form.reset();
});
