import { NivelPermissao } from '../enums';

export class Funcionario {
  public id: string;
  public nome: string;
  public telefone: string;
  public endereco: string;
  public usuario: string;
  public senha: string;
  public nivelPermissao: NivelPermissao;

  constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
    this.id = id;
    this.nome = nome;
    this.telefone = telefone;
    this.endereco = endereco;
    this.usuario = usuario;
    this.senha = senha;
    this.nivelPermissao = nivelPermissao;
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      telefone: this.telefone,
      endereco: this.endereco,
      usuario: this.usuario,
      senha: this.senha,
      nivelPermissao: this.nivelPermissao
    };
  }
}