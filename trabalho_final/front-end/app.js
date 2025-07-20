"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getById(id) {
    return document.getElementById(id);
}
const apiUrl = 'http://localhost:3000/socialifpi/postagem';
// Função para listar todas as postagens
function listarPostagens() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(apiUrl);
            const postagens = yield response.json();
            const postagensElement = getById('postagens');
            if (postagensElement) {
                postagensElement.innerHTML = '';
                postagens.forEach(postagem => {
                    const article = document.createElement('article');
                    article.style.position = 'relative';
                    // Cria elementos da postagem
                    const titulo = document.createElement('h2');
                    titulo.textContent = postagem.titulo;
                    const conteudo = document.createElement('p');
                    conteudo.textContent = postagem.conteudo;
                    const data = document.createElement('p');
                    data.className = 'data';
                    data.textContent = new Date(postagem.data).toLocaleDateString();
                    const curtidas = document.createElement('p');
                    curtidas.textContent = `Curtidas: ${postagem.curtidas}`;
                    curtidas.style.fontWeight = 'bold';
                    const botaoCurtir = document.createElement('button');
                    botaoCurtir.textContent = 'Curtir';
                    botaoCurtir.addEventListener('click', () => curtirPostagem(postagem.id, curtidas));
                    // Botão para comentários
                    const botaoComentarios = document.createElement('button');
                    botaoComentarios.textContent = 'Mostrar Comentários';
                    botaoComentarios.style.marginLeft = '10px';
                    let comentariosVisiveis = false;
                    botaoComentarios.addEventListener('click', () => {
                        comentariosVisiveis = !comentariosVisiveis;
                        botaoComentarios.textContent = comentariosVisiveis
                            ? 'Ocultar Comentários'
                            : 'Mostrar Comentários';
                        const comentariosContainer = article.querySelector('.comentarios');
                        if (comentariosVisiveis) {
                            if (!comentariosContainer) {
                                exibirComentarios(postagem.id, article);
                            }
                        }
                        else if (comentariosContainer) {
                            comentariosContainer.remove();
                        }
                    });
                    // ========== MENU KEBAB ========== questão 3
                    const menuContainer = document.createElement('div');
                    menuContainer.className = 'kebab-menu-container';
                    const botaoMenu = document.createElement('button');
                    botaoMenu.className = 'kebab-button';
                    botaoMenu.textContent = '⋮';
                    const menuDropdown = document.createElement('div');
                    menuDropdown.className = 'kebab-dropdown';
                    const botaoExcluir = document.createElement('button');
                    botaoExcluir.textContent = 'Excluir';
                    botaoExcluir.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                        const confirmar = window.confirm('Tem certeza que deseja excluir esta postagem?');
                        if (confirmar) {
                            try {
                                const response = yield fetch(`${apiUrl}/${postagem.id}`, {
                                    method: 'DELETE'
                                });
                                if (response.ok) {
                                    listarPostagens(); // Recarrega a lista
                                }
                                else {
                                    const erro = yield response.json();
                                    alert('Erro ao excluir: ' + erro.message);
                                }
                            }
                            catch (error) {
                                console.error('Erro ao excluir:', error);
                            }
                        }
                    }));
                    botaoMenu.addEventListener('click', () => {
                        menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
                    });
                    document.addEventListener('click', (e) => {
                        if (!menuContainer.contains(e.target)) {
                            menuDropdown.style.display = 'none';
                        }
                    });
                    menuDropdown.appendChild(botaoExcluir);
                    menuContainer.appendChild(botaoMenu);
                    menuContainer.appendChild(menuDropdown);
                    // ========== FIM MENU KEBAB ==========
                    // Adiciona elementos ao artigo
                    article.appendChild(titulo);
                    article.appendChild(conteudo);
                    article.appendChild(data);
                    article.appendChild(curtidas);
                    article.appendChild(botaoCurtir);
                    article.appendChild(botaoComentarios);
                    article.appendChild(menuContainer);
                    postagensElement.appendChild(article);
                });
            }
        }
        catch (error) {
            console.error('Erro ao carregar postagens:', error);
        }
    });
}
// Função para curtir postagem
function curtirPostagem(id, curtidasElement) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}/${id}/curtir`, {
                method: 'POST'
            });
            const result = yield response.json();
            curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
        }
        catch (error) {
            console.error('Erro ao curtir postagem:', error);
        }
    });
}
// Função para incluir nova postagem
function incluirPostagem() {
    return __awaiter(this, void 0, void 0, function* () {
        const tituloInput = document.getElementById('titulo');
        const conteudoInput = document.getElementById('conteudo');
        if (tituloInput && conteudoInput && tituloInput.value && conteudoInput.value) {
            try {
                const novaPostagem = {
                    titulo: tituloInput.value,
                    conteudo: conteudoInput.value,
                    data: new Date().toISOString(),
                    curtidas: 0
                };
                const response = yield fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(novaPostagem)
                });
                if (response.ok) {
                    listarPostagens();
                    tituloInput.value = '';
                    conteudoInput.value = '';
                }
            }
            catch (error) {
                console.error('Erro ao adicionar postagem:', error);
            }
        }
    });
}
// Função para exibir comentários
function exibirComentarios(postagemId, articleElement) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${apiUrl}/${postagemId}/comentarios`);
            const comentarios = yield response.json();
            // Ordena por data decrescente (mais recente primeiro) - questao 4
            comentarios.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
            const comentariosContainer = document.createElement('div');
            comentariosContainer.className = 'comentarios';
            const tituloComentarios = document.createElement('h3');
            tituloComentarios.textContent = 'Comentários';
            comentariosContainer.appendChild(tituloComentarios);
            if (comentarios.length === 0) {
                const semComentarios = document.createElement('p');
                semComentarios.textContent = 'Nenhum comentário ainda. Seja o primeiro!';
                comentariosContainer.appendChild(semComentarios);
            }
            else {
                comentarios.forEach(comentario => {
                    const comentarioElement = document.createElement('div');
                    comentarioElement.className = 'comentario';
                    const autor = document.createElement('strong');
                    autor.textContent = comentario.autor;
                    const texto = document.createElement('p');
                    texto.textContent = comentario.texto;
                    const data = document.createElement('small');
                    data.textContent = new Date(comentario.data).toLocaleString();
                    comentarioElement.appendChild(autor);
                    comentarioElement.appendChild(texto);
                    comentarioElement.appendChild(data);
                    comentariosContainer.appendChild(comentarioElement);
                });
            }
            // Formulário para novo comentário
            const formComentario = document.createElement('form');
            formComentario.className = 'form-comentario';
            const inputAutor = document.createElement('input');
            inputAutor.type = 'text';
            inputAutor.placeholder = 'Seu nome';
            inputAutor.required = true;
            const textareaComentario = document.createElement('textarea');
            textareaComentario.placeholder = 'Seu comentário';
            textareaComentario.required = true;
            textareaComentario.rows = 3;
            const botaoComentar = document.createElement('button');
            botaoComentar.type = 'submit';
            botaoComentar.textContent = 'Comentar';
            formComentario.appendChild(inputAutor);
            formComentario.appendChild(textareaComentario);
            formComentario.appendChild(botaoComentar);
            formComentario.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                if (inputAutor.value && textareaComentario.value) {
                    try {
                        yield adicionarComentario(postagemId, inputAutor.value, textareaComentario.value);
                        // Recarrega os comentários
                        const containerExistente = articleElement.querySelector('.comentarios');
                        if (containerExistente) {
                            containerExistente.remove();
                        }
                        exibirComentarios(postagemId, articleElement);
                        inputAutor.value = '';
                        textareaComentario.value = '';
                    }
                    catch (error) {
                        console.error('Erro ao adicionar comentário:', error);
                    }
                }
            }));
            comentariosContainer.appendChild(formComentario);
            articleElement.appendChild(comentariosContainer);
        }
        catch (error) {
            console.error('Erro ao carregar comentários:', error);
        }
    });
}
// Função para adicionar comentário
function adicionarComentario(postagemId, autor, texto) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${apiUrl}/${postagemId}/comentar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ autor, texto })
        });
        if (!response.ok) {
            throw new Error('Falha ao adicionar comentário');
        }
    });
}
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    listarPostagens();
    const botaoNovaPostagem = getById('botaoNovaPostagem');
    if (botaoNovaPostagem) {
        botaoNovaPostagem.addEventListener('click', incluirPostagem);
    }
});
