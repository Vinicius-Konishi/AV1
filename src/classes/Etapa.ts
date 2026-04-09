import { StatusEtapa } from '../enums';
import { Funcionario } from './Funcionario';

export class Etapa {
  public nome: string;
  public prazo: string;
  public status: StatusEtapa;
  public funcionarios: Funcionario[] = [];

  constructor(nome: string, prazo: string, status: StatusEtapa = StatusEtapa.PENDENTE) {
    this.nome = nome;
    this.prazo = prazo;
    this.status = status;
  }

  iniciarEtapa(): void {
    if (this.status === StatusEtapa.PENDENTE) {
      this.status = StatusEtapa.ANDAMENTO;
    }
  }

  concluirEtapa(): void {
    if (this.status !== StatusEtapa.CONCLUIDA) {
      this.status = StatusEtapa.CONCLUIDA;
    }
  }

  podeConcluir(): boolean {
    return this.status !== StatusEtapa.CONCLUIDA;
  }

  adicionarFuncionario(funcionario: Funcionario): boolean {
    if (this.funcionarios.some(f => f.id === funcionario.id)) {
      return false; // evita duplicidade
    }
    this.funcionarios.push(funcionario);
    return true;
  }

  toJSON() {
    return {
      nome: this.nome,
      prazo: this.prazo,
      status: this.status,
      funcionarios: this.funcionarios.map(f => ({
        id: f.id,
        nome: f.nome,
        nivelPermissao: f.nivelPermissao
      }))
    };
  }
}