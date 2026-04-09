import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function salvarDados<T>(nomeArquivo: string, dados: T): void {
  const caminho = path.join(DATA_DIR, `${nomeArquivo}.json`);
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
}

export function carregarDados<T>(nomeArquivo: string): T | null {
  const caminho = path.join(DATA_DIR, `${nomeArquivo}.json`);
  if (!fs.existsSync(caminho)) return null;
  
  try {
    const conteudo = fs.readFileSync(caminho, 'utf-8');
    return JSON.parse(conteudo);
  } catch (e) {
    console.error(`Erro ao carregar ${nomeArquivo}.json`);
    return null;
  }
}

export function salvarRelatorio(nomeArquivo: string, conteudo: string): string {
  const caminho = path.join(DATA_DIR, `${nomeArquivo}.txt`);
  fs.writeFileSync(caminho, conteudo, 'utf-8');
  return caminho;
}