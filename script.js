/* Questão 1 */


let tarefas = []; //array de dados reais (tarefas)
let idCounter = 1;

document.getElementById("adicionarBtn").addEventListener("click", function () {
  const descricaoInput = document.getElementById("descricaoTarefa");
  const descricao = descricaoInput.value.trim();

  if (!descricao) {
    alert("Por favor, insira uma descrição.");
    return;
  }

  const dataInicio = new Date().toLocaleDateString();
  const tarefa = {
    id: idCounter++,
    descricao: descricao,
    dataInicio: dataInicio,
    dataConclusao: ""
  };

  tarefas.push(tarefa); //add ao array de tarefas
  adicionarLinhaNaTabela(tarefa);
   atualizarResumo();
   localStorage.setItem("tarefas", JSON.stringify(tarefas));
  descricaoInput.value = ""; // limpar o campo
 
});

function adicionarLinhaNaTabela(tarefa) {
  const tabela = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0];
  const novaLinha = tabela.insertRow();
  /*Questao 2: Estrutura minima para tarefa*/
  novaLinha.innerHTML = `
    <td>${tarefa.id}</td>
    <td>${tarefa.descricao}</td>
    <td>${tarefa.dataInicio}</td>
    <td>${tarefa.dataConclusao || ""}</td>
    <td>
      <button class="concluirBtn">Concluir</button>
      <button class="excluirBtn">Excluir</button>
    </td>
  `;

  // Eventos dos botões:
  const botaoConcluir = novaLinha.querySelector(".concluirBtn");
  botaoConcluir.addEventListener("click", function () {
  if (tarefa.dataConclusao) {
    // Reabrir a tarefa
    tarefa.dataConclusao = "";
    novaLinha.cells[3].innerText = "";
    botaoConcluir.innerText = "Concluir";
    atualizarResumo(); // ← adiciona aqui
    novaLinha.classList.remove("concluida"); // remover destaques 
  } else {
    // Concluir a tarefa
    tarefa.dataConclusao = new Date().toLocaleDateString();
    novaLinha.cells[3].innerText = tarefa.dataConclusao;
    botaoConcluir.innerText = "Reabrir";
    atualizarResumo(); // ← adiciona aqui
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    novaLinha.classList.add("concluida"); // destacar concluidas 
  }
});


  // Questão 3: Excluir tarefa
  novaLinha.querySelector(".excluirBtn").addEventListener("click", function () {
    if (tarefa.dataConclusao) {
      alert("Tarefa concluída não pode ser excluída.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      tabela.removeChild(novaLinha);
      tarefas = tarefas.filter(t => t.id !== tarefa.id);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }
  });
}

// Questão 4: Resumo de tarefas
function atualizarResumo() {
  const pendentes = tarefas.filter(t => !t.dataConclusao).length;
  const concluidas = tarefas.filter(t => t.dataConclusao).length;

  const resumo = `Você tem ${pendentes} tarefa${pendentes !== 1 ? 's' : ''} pendente${pendentes !== 1 ? 's' : ''} ` +
                 `e ${concluidas} concluída${concluidas !== 1 ? 's' : ''}.`;

  document.getElementById("resumoTarefas").innerText = resumo;
}

// Questão 4.e: Filtro de tarefas
document.getElementById("filtro").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const linhas = document.querySelectorAll("#tabelaTarefas tbody tr");
  linhas.forEach(linha => {
    const descricao = linha.cells[1].innerText.toLowerCase();
    linha.style.display = descricao.includes(termo) ? "" : "none";
  });
});

//Questao 4.e: salvar mesmo após recarregar a página
window.onload = function () {
  const dadosSalvos = localStorage.getItem("tarefas");
  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
    tarefas.forEach(adicionarLinhaNaTabela);
  }
};

