import { TipoPeca, StatusPeca } from '../enums';

export class Peca {
  public nome: string;
  public tipo: TipoPeca;
  public fornecedor: string;
  public status: StatusPeca;

  constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca = StatusPeca.EM_PRODUCAO) {
    this.nome = nome;
    this.tipo = tipo;
    this.fornecedor = fornecedor;
    this.status = status;
  }

  toJSON() {
    return { nome: this.nome, tipo: this.tipo, fornecedor: this.fornecedor, status: this.status };
  }
}