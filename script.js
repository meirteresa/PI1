/* Questão 1 */
let tarefas = [];
let idCounter = 1;

window.onload = function () {
  const dadosSalvos = localStorage.getItem("tarefas");
  if (dadosSalvos) {
    tarefas = JSON.parse(dadosSalvos);
    tarefas.forEach(adicionarLinhaNaTabela);
  }

  const contadorSalvo = localStorage.getItem("idCounter");
  if (contadorSalvo) {
    idCounter = parseInt(contadorSalvo);
  }

  atualizarResumo(); // Atualiza o resumo ao carregar a página
};

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
  localStorage.setItem("idCounter", idCounter);

  descricaoInput.value = ""; // limpar o campo

});

function adicionarLinhaNaTabela(tarefa) {
  const tabela = document.getElementById("tabelaTarefas").getElementsByTagName("tbody")[0];
  const novaLinha = tabela.insertRow();

  // Aplica a classe de fundo verde se estiver concluída 4.e
  if (tarefa.dataConclusao) {
    novaLinha.classList.add("concluida");
  }

  /*Questao 2: Estrutura minima para tarefa*/
  novaLinha.innerHTML = `
    <td>${tarefa.id}</td>
    <td>${tarefa.descricao}</td>
    <td>${tarefa.dataInicio}</td>
    <td>${tarefa.dataConclusao || ""}</td>
    <td>
    </td>
  `;

  const celulaAcoes = novaLinha.cells[4];

  // Criar ícone de concluir
  const concluirIcon = document.createElement("span");
  concluirIcon.className = "material-symbols-outlined concluirBtn";
  concluirIcon.innerText = tarefa.dataConclusao ? "undo" : "check_circle";


  // Criar ícone de excluir
  const excluirIcon = document.createElement("span");
  excluirIcon.className = "material-symbols-outlined excluirBtn";
  excluirIcon.innerText = "delete_forever";

  celulaAcoes.appendChild(concluirIcon);
  celulaAcoes.appendChild(excluirIcon);

  // Evento Concluir / Reabrir
  concluirIcon.addEventListener("click", function () {
    if (tarefa.dataConclusao) {
      tarefa.dataConclusao = "";
      novaLinha.cells[3].innerText = "";
      concluirIcon.innerText = "check_circle";
      atualizarResumo();
      novaLinha.classList.remove("concluida");
    } else {
      tarefa.dataConclusao = new Date().toLocaleDateString();
      novaLinha.cells[3].innerText = tarefa.dataConclusao;
      concluirIcon.innerText = "undo";
      atualizarResumo();
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      novaLinha.classList.add("concluida");
    }
  });

  // Evento Excluir
  excluirIcon.addEventListener("click", function () {
    if (tarefa.dataConclusao) {
      alert("Tarefa concluída não pode ser excluída.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      tabela.removeChild(novaLinha);
      tarefas = tarefas.filter(t => t.id !== tarefa.id);
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      atualizarResumo();
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
