export class Relatorio {
  public codigoAeronave: string;
  public modelo: string;
  public cliente: string;
  public dataEntrega: string;
  public dataGeracao: string;
  public pecas: any[];
  public etapas: any[];       
  public testes: any[];

  constructor(
    codigoAeronave: string,
    modelo: string,
    cliente: string,
    dataEntrega: string,
    pecas: any[],
    etapas: any[],
    testes: any[]
  ) {
    this.codigoAeronave = codigoAeronave;
    this.modelo = modelo;
    this.cliente = cliente;
    this.dataEntrega = dataEntrega;
    this.dataGeracao = new Date().toLocaleString('pt-BR');
    this.pecas = pecas;
    this.etapas = etapas;
    this.testes = testes;
  }

  gerarTexto(): string {
    let texto = `RELATÓRIO FINAL DE PRODUÇÃO - AEROCODE\n`;
    texto += `=====================================\n\n`;
    texto += `Código da Aeronave : ${this.codigoAeronave}\n`;
    texto += `Modelo             : ${this.modelo}\n`;
    texto += `Cliente            : ${this.cliente}\n`;
    texto += `Data de Entrega    : ${this.dataEntrega}\n`;
    texto += `Gerado em          : ${this.dataGeracao}\n\n`;


    texto += "PEÇAS UTILIZADAS:\n";
    texto += this.pecas.length 
      ? this.pecas.map(p => `- ${p.nome} (${p.tipo}) → ${p.status}`).join('\n')
      : "Nenhuma peça cadastrada.\n";

    texto += "\n\nETAPAS DE PRODUÇÃO:\n";
    if (this.etapas.length === 0) {
      texto += "Nenhuma etapa cadastrada.\n";
    } else {
      this.etapas.forEach(etapa => {
        texto += `\n• ${etapa.nome} (${etapa.status}) - Prazo: ${etapa.prazo}\n`;
        
        if (etapa.funcionarios && etapa.funcionarios.length > 0) {
          texto += "  Funcionários envolvidos:\n";
          etapa.funcionarios.forEach((f: any) => {
            texto += `    - ${f.nome} (${f.nivelPermissao}) - ID: ${f.id}\n`;
          });
        } else {
          texto += "  Nenhum funcionário atribuído.\n";
        }
      });
    }

    texto += "\n\nTESTES REALIZADOS:\n";
    texto += this.testes.length 
      ? this.testes.map(t => `- ${t.tipo}: ${t.resultado}`).join('\n')
      : "Nenhum teste realizado.\n";

    texto += "\n\n=== FIM DO RELATÓRIO ===\n";
    return texto;
  }
}