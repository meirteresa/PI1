export class Postagem {
    private id: number;
    private titulo: string;
    private conteudo: string;
    private data: Date;
    private curtidas: number;
    private comentarios: Comentario[];

    constructor(id: number, titulo: string, conteudo: string, data: Date, curtidas: number) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.data = data;
        this.curtidas = curtidas;
        this.comentarios = [];
    }

    public getComentarios(): Comentario[] {
        return this.comentarios;
    }

    public adicionarComentario(autor: string, texto: string, data?: Date): void {
        this.comentarios.push(new Comentario(autor, texto, data ?? new Date()));
    }

    public getId(): number {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getConteudo(): string {
        return this.conteudo;
    }

    public getData(): Date {
        return this.data;
    }

    public getCurtidas(): number {
        return this.curtidas;
    }
}

export class Comentario {
    private autor: string;
    private texto: string;
    private data: Date;

    constructor(autor: string, texto: string, data: Date) {
        this.autor = autor;
        this.texto = texto;
        this.data = data;
    }

    public getAutor(): string {
        return this.autor;
    }

    public getTexto(): string {
        return this.texto;
    }

    public getData(): Date {
        return this.data;
    }
}