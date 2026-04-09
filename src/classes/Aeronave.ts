import { TipoAeronave } from '../enums';
import { Peca } from './Peca';
import { Etapa } from './Etapa';
import { Teste } from './Teste';

export class Aeronave {
  public codigo: string;
  public modelo: string;
  public tipo: TipoAeronave;
  public capacidade: number;
  public alcance: number;
  public pecas: Peca[] = [];
  public etapas: Etapa[] = [];
  public testes: Teste[] = [];
  public cliente?: string;
  public dataEntrega?: string;

  constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
    this.codigo = codigo.toUpperCase();
    this.modelo = modelo;
    this.tipo = tipo;
    this.capacidade = capacidade;
    this.alcance = alcance;
  }

  // Novo método: verificar se código já existe (será usado no main)
  static codigoExiste(aeronaves: Aeronave[], codigo: string): boolean {
    return aeronaves.some(a => a.codigo === codigo.toUpperCase());
  }

  adicionarPeca(peca: Peca): void {
    this.pecas.push(peca);
  }

  adicionarEtapa(etapa: Etapa): void {
    this.etapas.push(etapa);
  }

  adicionarTeste(teste: Teste): void {
    this.testes.push(teste);
  }

  definirCliente(nome: string): void {
    this.cliente = nome;
  }

  definirDataEntrega(data: string): void {
    this.dataEntrega = data;
  }

  toJSON() {
    return {
      codigo: this.codigo,
      modelo: this.modelo,
      tipo: this.tipo,
      capacidade: this.capacidade,
      alcance: this.alcance,
      pecas: this.pecas,
      etapas: this.etapas,
      testes: this.testes,
      cliente: this.cliente,
      dataEntrega: this.dataEntrega
    };
  }
}