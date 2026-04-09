

```markdown
# AV1 - AeroCode  
**Sistema de Gerenciamento de Produção de Aeronaves**

Sistema desenvolvido em TypeScript para simular o processo completo de produção de aeronaves, desde o cadastro inicial até a geração do relatório final para o cliente.

---

## 📋 Funcionalidades

- Cadastro de aeronaves com código único
- Gerenciamento de peças (Nacional / Importada) com atualização de status
- Controle de etapas de produção com regra de ordem lógica
- Associação de funcionários por etapa
- Registro de testes (Elétrico, Hidráulico e Aerodinâmico)
- Sistema de login com níveis de permissão (Administrador, Engenheiro, Operador)
- Cadastro de funcionários
- Geração de relatório final detalhado em arquivo `.txt`
- Persistência de dados em arquivos JSON

---

## 🛠 Tecnologias Utilizadas

- TypeScript
- Node.js
- Leitura de entrada via terminal (readline)
- Persistência em arquivos JSON

---

## 📁 Estrutura do Projeto

```
aerocode/
├── src/
│   ├── classes/
│   │   ├── Aeronave.ts
│   │   ├── Peca.ts
│   │   ├── Etapa.ts
│   │   ├── Funcionario.ts
│   │   ├── Teste.ts
│   │   └── Relatorio.ts
│   ├── enums.ts
│   ├── utils/
│   │   └── persistencia.ts
│   └── main.ts
├── data/                  ← Arquivos gerados automaticamente
├── dist/                  ← Arquivos compilados (gerado)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Pré-requisitos

- Node.js versão **18 ou superior**
- npm

---

## Instalação e Execução

### 1. Clone ou crie o projeto

```bash
mkdir aerocode
cd aerocode
```

### 2. Inicialize o projeto

```bash
npm init -y
```

### 3. Instale as dependências

```bash
npm install --save-dev typescript @types/node
```

### 4. Configure o TypeScript

Crie o arquivo `tsconfig.json` na raiz do projeto com o seguinte conteúdo:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 5. Adicione os scripts no `package.json`

Substitua a seção `"scripts"` por:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/main.js",
  "dev": "npm run build && npm start"
}
```

### 6. Compile e execute

```bash
npm run build
npm start
```

Ou use o comando direto:
```bash
npm run dev
```

---

## Como Usar

### Login Inicial
- **Usuário:** `paysandu`
- **Senha:** `paysandumaiorqueremo`

### Menu Principal

1. Cadastrar Nova Aeronave  
2. Listar Aeronaves  
3. Gerenciar Peças de uma Aeronave  
4. Gerenciar Etapas de uma Aeronave  
5. Realizar Testes  
6. Gerar Relatório Final  
7. Cadastrar Funcionário (somente Administrador)  
8. Sair

---

## Onde os Dados São Salvos?

- `data/aeronaves.json` → Informações das aeronaves e suas etapas/peças/testes
- `data/funcionarios.json` → Cadastro de funcionários e senhas
- `data/relatorio_[codigo].txt` → Relatórios finais gerados

---

## Possíveis Problemas e Soluções

| Problema | Solução |
|---------|--------|
| Comando `tsc` não encontrado | Rode `npm install --save-dev typescript @types/node` |
| Erro ao compilar | Delete a pasta `dist` e rode `npm run build` novamente |
| Login não funciona | Use `paysandu` / `paysandumaiorqueremo` ou cadastre novos funcionários |
| Dados não são salvos | Verifique se a pasta `data` existe na raiz do projeto |
| Métodos não encontrados | Delete a pasta `dist` e compile novamente |

---


- Sempre delete a pasta `dist` antes de compilar após alterações no código.
- Siga a sequência lógica: Aeronave → Peças → Etapas → Funcionários → Testes → Relatório.
- Apenas o **Administrador** pode cadastrar novos funcionários.
