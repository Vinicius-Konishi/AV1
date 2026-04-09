import { TipoTeste, ResultadoTeste } from '../enums';

export class Teste {
  public tipo: TipoTeste;
  public resultado: ResultadoTeste;

  constructor(tipo: TipoTeste, resultado: ResultadoTeste = ResultadoTeste.APROVADO) {
    this.tipo = tipo;
    this.resultado = resultado;
  }

  toJSON() {
    return { tipo: this.tipo, resultado: this.resultado };
  }
}