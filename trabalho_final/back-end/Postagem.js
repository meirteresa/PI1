"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comentario = exports.Postagem = void 0;
class Postagem {
    constructor(id, titulo, conteudo, data, curtidas) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.data = data;
        this.curtidas = curtidas;
        this.comentarios = [];
    }
    getComentarios() {
        return this.comentarios;
    }
    adicionarComentario(autor, texto) {
        this.comentarios.push(new Comentario(autor, texto, new Date()));
    }
    getId() {
        return this.id;
    }
    getTitulo() {
        return this.titulo;
    }
    getConteudo() {
        return this.conteudo;
    }
    getData() {
        return this.data;
    }
    getCurtidas() {
        return this.curtidas;
    }
}
exports.Postagem = Postagem;
class Comentario {
    constructor(autor, texto, data) {
        this.autor = autor;
        this.texto = texto;
        this.data = data;
    }
    getAutor() {
        return this.autor;
    }
    getTexto() {
        return this.texto;
    }
    getData() {
        return this.data;
    }
}
exports.Comentario = Comentario;
