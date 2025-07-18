function getById(id: string): HTMLElement | null {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi/postagem';

interface Comentario {
    autor: string;
    texto: string;
    data: string;
}

interface Postagem {
    id: number;
    titulo: string;
    conteudo: string;
    data: string;
    curtidas: number;
    comentarios?: Comentario[];
}

// Função para listar todas as postagens
async function listarPostagens() {
    try {
        const response = await fetch(apiUrl);
        const postagens: Postagem[] = await response.json();
        const postagensElement = getById('postagens');
        
        if (postagensElement) {
            postagensElement.innerHTML = '';
            postagens.forEach(postagem => {
                const article = document.createElement('article');

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
                    } else if (comentariosContainer) {
                        comentariosContainer.remove();
                    }
                });

                // Adiciona elementos ao artigo
                article.appendChild(titulo);
                article.appendChild(conteudo);
                article.appendChild(data);
                article.appendChild(curtidas);
                article.appendChild(botaoCurtir);
                article.appendChild(botaoComentarios);
                
                postagensElement.appendChild(article);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar postagens:', error);
    }
}

// Função para curtir postagem
async function curtirPostagem(id: number, curtidasElement: HTMLParagraphElement) {
    try {
        const response = await fetch(`${apiUrl}/${id}/curtir`, {
            method: 'POST'
        });
        const result = await response.json();
        curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
    } catch (error) {
        console.error('Erro ao curtir postagem:', error);
    }
}

// Função para incluir nova postagem
async function incluirPostagem() {
    const tituloInput = document.getElementById('titulo') as HTMLInputElement;
    const conteudoInput = document.getElementById('conteudo') as HTMLTextAreaElement;

    if (tituloInput && conteudoInput && tituloInput.value && conteudoInput.value) {
        try {
            const novaPostagem = {
                titulo: tituloInput.value,
                conteudo: conteudoInput.value,
                data: new Date().toISOString(),
                curtidas: 0
            };

            const response = await fetch(apiUrl, {
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
        } catch (error) {
            console.error('Erro ao adicionar postagem:', error);
        }
    }
}

// Função para exibir comentários
async function exibirComentarios(postagemId: number, articleElement: HTMLElement) {
    try {
        const response = await fetch(`${apiUrl}/${postagemId}/comentarios`);
        const comentarios: Comentario[] = await response.json();
        
        const comentariosContainer = document.createElement('div');
        comentariosContainer.className = 'comentarios';
        
        const tituloComentarios = document.createElement('h3');
        tituloComentarios.textContent = 'Comentários';
        comentariosContainer.appendChild(tituloComentarios);
        
        if (comentarios.length === 0) {
            const semComentarios = document.createElement('p');
            semComentarios.textContent = 'Nenhum comentário ainda. Seja o primeiro!';
            comentariosContainer.appendChild(semComentarios);
        } else {
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
        
        formComentario.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (inputAutor.value && textareaComentario.value) {
                try {
                    await adicionarComentario(postagemId, inputAutor.value, textareaComentario.value);
                    // Recarrega os comentários
                    const containerExistente = articleElement.querySelector('.comentarios');
                    if (containerExistente) {
                        containerExistente.remove();
                    }
                    exibirComentarios(postagemId, articleElement);
                    inputAutor.value = '';
                    textareaComentario.value = '';
                } catch (error) {
                    console.error('Erro ao adicionar comentário:', error);
                }
            }
        });
        
        comentariosContainer.appendChild(formComentario);
        articleElement.appendChild(comentariosContainer);
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

// Função para adicionar comentário
async function adicionarComentario(postagemId: number, autor: string, texto: string): Promise<void> {
    const response = await fetch(`${apiUrl}/${postagemId}/comentar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ autor, texto })
    });
    
    if (!response.ok) {
        throw new Error('Falha ao adicionar comentário');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    listarPostagens();
    
    const botaoNovaPostagem = getById('botaoNovaPostagem');
    if (botaoNovaPostagem) {
        botaoNovaPostagem.addEventListener('click', incluirPostagem);
    }
});