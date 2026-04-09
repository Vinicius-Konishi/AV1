import * as readline from 'readline';
import { Relatorio } from './classes/Relatorio';
import { Aeronave } from './classes/Aeronave';
import { Peca } from './classes/Peca';
import { Etapa } from './classes/Etapa';
import { Funcionario } from './classes/Funcionario';
import { Teste } from './classes/Teste';
import { salvarDados, carregarDados, salvarRelatorio } from './utils/persistencia';
import { 
  TipoAeronave, 
  TipoPeca, 
  StatusPeca, 
  StatusEtapa, 
  TipoTeste, 
  ResultadoTeste, 
  NivelPermissao 
} from './enums';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Globais
let aeronaves: Aeronave[] = [];
let usuarioLogado: Funcionario | null = null;
let funcionarios: Funcionario[] = carregarDados<Funcionario[]>('funcionarios') || [];

// Carrega
const dadosCarregados = carregarDados<any[]>('aeronaves') || [];

aeronaves = dadosCarregados.map((data: any) => {
  const aeronave = new Aeronave(
    data.codigo || '',
    data.modelo || '',
    data.tipo || TipoAeronave.COMERCIAL,
    data.capacidade || 0,
    data.alcance || 0
  );

  aeronave.pecas = (data.pecas || []).map((p: any) => 
    new Peca(p.nome, p.tipo, p.fornecedor, p.status)
  );

  aeronave.etapas = (data.etapas || []).map((e: any) => {
    const etapa = new Etapa(e.nome, e.prazo, e.status);
    etapa.funcionarios = (e.funcionarios || []).map((f: any) =>
      new Funcionario(
        f.id || '', 
        f.nome || '', 
        f.telefone || '', 
        f.endereco || '', 
        f.usuario || '', 
        '', 
        f.nivelPermissao || NivelPermissao.OPERADOR
      )
    );
    return etapa;
  });

  aeronave.testes = (data.testes || []).map((t: any) =>
    new Teste(t.tipo, t.resultado)
  );

  aeronave.cliente = data.cliente;
  aeronave.dataEntrega = data.dataEntrega;

  return aeronave;
});

// Aux

function perguntar(texto: string): Promise<string> {
  return new Promise(resolve => rl.question(texto, resolve));
}

function limparTela() {
  console.clear();
}

async function login(): Promise<boolean> {
  limparTela();
  console.log("=== LOGIN - AEROCODE ===\n");

  const usuario = await perguntar("Usuário: ");
  const senha = await perguntar("Senha: ");

  // login adm
  if (usuario === "paysandu" && senha === "paysandumaiorqueremo") {
    usuarioLogado = new Funcionario(
      "ADM001",
      "Administrador do Sistema",
      "",
      "",
      "paysandu",
      "paysandumaiorqueremo",
      NivelPermissao.ADMINISTRADOR
    );
    console.log(`\nLogin realizado com sucesso!`);
    console.log(`Bem-vindo, ${usuarioLogado.nome} (${usuarioLogado.nivelPermissao})`);
    return true;
  }

  // login cadastrado
  const funcionarioEncontrado = funcionarios.find(f => f.usuario === usuario);

  if (!funcionarioEncontrado) {
    console.log("\nUsuário não encontrado!");
    return false;
  }

  if (funcionarioEncontrado.senha !== senha) {
    console.log("\nSenha incorreta!");
    return false;
  }

  
  usuarioLogado = funcionarioEncontrado;
  console.log(`\nLogin realizado com sucesso!`);
  console.log(`Bem-vindo, ${usuarioLogado.nome} (${usuarioLogado.nivelPermissao})`);
  return true;
}

function verificarPalmeiras(minimo: NivelPermissao): boolean {
  if (!usuarioLogado) return false;

  const niveis: Record<NivelPermissao, number> = {
    [NivelPermissao.OPERADOR]: 1,
    [NivelPermissao.ENGENHEIRO]: 2,
    [NivelPermissao.ADMINISTRADOR]: 3
  };

  return niveis[usuarioLogado.nivelPermissao] >= niveis[minimo];
}

async function cadastrarFuncionario() {
  console.log("\n=== CADASTRO DE FUNCIONÁRIO ===");

  const id = await perguntar("ID do funcionário (único): ");
  if (funcionarios.some(f => f.id === id)) {
    console.log("Erro: Já existe um funcionário com este ID!");
    return;
  }

  const nome = await perguntar("Nome completo: ");
  const telefone = await perguntar("Telefone: ");
  const endereco = await perguntar("Endereço: ");
  const usuario = await perguntar("Usuário de login: ");
  const senha = await perguntar("Senha: ");

  console.log("Nível de permissão:");
  console.log("1. ADMINISTRADOR");
  console.log("2. ENGENHEIRO");
  console.log("3. OPERADOR");
  const niv = await perguntar("Escolha: ");
  const nivel = niv === '1' ? NivelPermissao.ADMINISTRADOR : 
                niv === '2' ? NivelPermissao.ENGENHEIRO : NivelPermissao.OPERADOR;

  const novoFuncionario = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel);
  funcionarios.push(novoFuncionario);

  salvarDados('funcionarios', funcionarios);
  console.log(`Funcionário ${nome} cadastrado com sucesso!`);
}

// Menu

async function menuPrincipal() {
  while (true) {
    limparTela();
    console.log(`=== AEROCODE - Sistema de Produção de Aeronaves ===`);
    console.log(`Usuário: ${usuarioLogado?.nome || 'Não logado'} (${usuarioLogado?.nivelPermissao || '-'}) \n`);

    console.log("1. Cadastrar Nova Aeronave");
    console.log("2. Listar Aeronaves");
    console.log("3. Gerenciar Peças de uma Aeronave");
    console.log("4. Gerenciar Etapas de uma Aeronave");
    console.log("5. Realizar Testes");
    console.log("6. Gerar Relatório Final");
    console.log("7. Cadastrar Funcionário");
    console.log("8. Sair\n");

    const opcao = await perguntar("Escolha uma opção: ");

    switch (opcao) {
      case '1': 
        if (verificarPalmeiras(NivelPermissao.ENGENHEIRO)) await cadastrarAeronave();
        else console.log("Permissão insuficiente!");
        break;
      case '2': listarAeronaves(); break;
      case '3': 
        if (verificarPalmeiras(NivelPermissao.ENGENHEIRO)) await gerenciarPecas();
        else console.log("Permissão insuficiente!");
        break;
      case '4': 
        if (verificarPalmeiras(NivelPermissao.ENGENHEIRO)) await gerenciarEtapas();
        else console.log("Permissão insuficiente!");
        break;
      case '5': 
        if (verificarPalmeiras(NivelPermissao.OPERADOR)) await realizarTeste();
        else console.log("Permissão insuficiente!");
        break;
      case '6': 
        if (verificarPalmeiras(NivelPermissao.ENGENHEIRO)) await gerarRelatorio();
        else console.log("Permissão insuficiente!");
        break;
      case '7': 
        if (verificarPalmeiras(NivelPermissao.ADMINISTRADOR)) await cadastrarFuncionario();
        else console.log("Apenas Administradores podem cadastrar funcionários!");
        break;
      case '8':
        console.log("Saindo do sistema...");
        salvarDados('aeronaves', aeronaves);
        salvarDados('funcionarios', funcionarios);
        rl.close();
        return;
      default:
        console.log("Opção inválida!");
    }

    if (opcao !== '8') {
      await perguntar("\nPressione ENTER para continuar...");
    }
  }
}

// Syst Func

async function cadastrarAeronave() {
  const codigo = (await perguntar("Código da aeronave (único): ")).toUpperCase();

  if (Aeronave.codigoExiste(aeronaves, codigo)) {
    console.log("Erro: Já existe uma aeronave com este código!");
    return;
  }

  const modelo = await perguntar("Modelo: ");
  console.log("Tipo: 1-COMERCIAL  2-MILITAR");
  const tipoStr = await perguntar("Escolha: ");
  const tipo = tipoStr === '1' ? TipoAeronave.COMERCIAL : TipoAeronave.MILITAR;
  const capacidade = parseInt(await perguntar("Capacidade de passageiros: ")) || 0;
  const alcance = parseInt(await perguntar("Alcance em km: ")) || 0;

  const aeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
  aeronaves.push(aeronave);
  salvarDados('aeronaves', aeronaves);
  console.log(`\nAeronave ${codigo} cadastrada com sucesso!`);
}

function listarAeronaves() {
  limparTela();
  console.log("=== LISTA DE AERONAVES ===\n");
  if (aeronaves.length === 0) {
    console.log("Nenhuma aeronave cadastrada.");
    return;
  }
  aeronaves.forEach(a => {
    console.log(`${a.codigo} | ${a.modelo} | ${a.tipo} | ${a.capacidade} pax | ${a.alcance} km`);
  });
}

// G peças
async function gerenciarPecas() {
  listarAeronaves();
  const codigo = await perguntar("\nInforme o código da aeronave: ");
  const aeronave = aeronaves.find(a => a.codigo === codigo.toUpperCase());
  if (!aeronave) { 
    console.log("Aeronave não encontrada!"); 
    return; 
  }

  console.log("\n1. Adicionar nova peça");
  console.log("2. Listar peças");
  console.log("3. Atualizar status de uma peça");
  const op = await perguntar("Escolha: ");

  if (op === '1') {
    const nome = await perguntar("Nome da peça: ");
    console.log("Tipo: 1-NACIONAL  2-IMPORTADA");
    const tipoP = (await perguntar("Escolha: ")) === '1' ? TipoPeca.NACIONAL : TipoPeca.IMPORTADA;
    const fornecedor = await perguntar("Fornecedor: ");

    const peca = new Peca(nome, tipoP, fornecedor);
    aeronave.adicionarPeca(peca);
    console.log("Peça adicionada!");
  } 
  else if (op === '2') {
    console.log("\nPeças da aeronave:");
    aeronave.pecas.forEach((p, i) => console.log(`${i+1}. ${p.nome} (${p.tipo}) - ${p.status}`));
  } 
  else if (op === '3') {
    if (aeronave.pecas.length === 0) {
      console.log("Nenhuma peça cadastrada.");
      return;
    }
    aeronave.pecas.forEach((p, i) => console.log(`${i+1}. ${p.nome} - Atual: ${p.status}`));
    const idx = parseInt(await perguntar("\nNúmero da peça: ")) - 1;
    if (idx < 0 || idx >= aeronave.pecas.length) return console.log("Índice inválido!");

    console.log("Novo status: 1-EM_PRODUCAO  2-EM_TRANSPORTE  3-PRONTA");
    const st = await perguntar("Escolha: ");
    const status = st === '1' ? StatusPeca.EM_PRODUCAO : st === '2' ? StatusPeca.EM_TRANSPORTE : StatusPeca.PRONTA;
    aeronave.pecas[idx].status = status;
    console.log("Status atualizado!");
  }
  salvarDados('aeronaves', aeronaves);
}

// G etapas
async function gerenciarEtapas() {
  listarAeronaves();
  const codigo = await perguntar("\nInforme o código da aeronave: ");
  const aeronave = aeronaves.find(a => a.codigo === codigo.toUpperCase());
  if (!aeronave) { 
    console.log("Aeronave não encontrada!"); 
    return; 
  }

  console.log("\n=== GERENCIAMENTO DE ETAPAS ===");
  console.log("1. Adicionar nova etapa");
  console.log("2. Listar etapas");
  console.log("3. Iniciar etapa (ANDAMENTO)");
  console.log("4. Concluir etapa");
  console.log("5. Adicionar funcionário a uma etapa");
  const op = await perguntar("Escolha uma opção: ");

  if (op === '1') {
    const nome = await perguntar("Nome da etapa: ");
    const prazo = await perguntar("Prazo (ex: 30/06/2026): ");
    const etapa = new Etapa(nome, prazo);
    aeronave.adicionarEtapa(etapa);
    console.log("Etapa adicionada!");
  } 
  else if (op === '2') {
    if (aeronave.etapas.length === 0) {
      console.log("Nenhuma etapa cadastrada.");
      return;
    }
    console.log("\nEtapas da aeronave:");
    aeronave.etapas.forEach((e, i) => {
      console.log(`${i+1}. ${e.nome} | Status: ${e.status} | Prazo: ${e.prazo}`);
    });
  } 
  else if (op === '3') { // Iniciar etapa
    if (aeronave.etapas.length === 0) return console.log("Nenhuma etapa.");
    aeronave.etapas.forEach((e, i) => console.log(`${i+1}. ${e.nome} (${e.status})`));
    const idx = parseInt(await perguntar("\nNúmero da etapa para iniciar: ")) - 1;
    if (idx < 0 || idx >= aeronave.etapas.length) return console.log("Índice inválido!");
    
    aeronave.etapas[idx].iniciarEtapa();
    console.log("Etapa iniciada (ANDAMENTO)!");
  } 
  else if (op === '4') { // Concluir etapa
    if (aeronave.etapas.length === 0) return console.log("Nenhuma etapa.");
    aeronave.etapas.forEach((e, i) => console.log(`${i+1}. ${e.nome} (${e.status})`));
    const idx = parseInt(await perguntar("\nNúmero da etapa para concluir: ")) - 1;
    if (idx < 0 || idx >= aeronave.etapas.length) return console.log("Índice inválido!");

    if (idx > 0 && aeronave.etapas[idx-1].status !== StatusEtapa.CONCLUIDA) {
      console.log("Não é possível concluir. A etapa anterior deve estar CONCLUÍDA primeiro!");
      return;
    }

    aeronave.etapas[idx].concluirEtapa();
    console.log("Etapa concluída com sucesso!");
  } 
  else if (op === '5') { // Adicionar funcionário a etapa
    if (aeronave.etapas.length === 0) return console.log("Nenhuma etapa cadastrada.");
    
    aeronave.etapas.forEach((e, i) => console.log(`${i+1}. ${e.nome}`));
    const idxEtapa = parseInt(await perguntar("\nEscolha a etapa (número): ")) - 1;
    if (idxEtapa < 0 || idxEtapa >= aeronave.etapas.length) {
      console.log("Etapa inválida!");
      return;
    }

    console.log("\n1. Usar funcionário já cadastrado");
    console.log("2. Cadastrar novo funcionário agora");
    const escolha = await perguntar("Escolha: ");

    let funcionario: Funcionario;

    if (escolha === '1') {
      if (funcionarios.length === 0) {
        console.log("Nenhum funcionário cadastrado ainda.");
        return;
      }
      console.log("\nFuncionários disponíveis:");
      funcionarios.forEach((f, i) => console.log(`${i+1}. ${f.nome} (ID: ${f.id}) - ${f.nivelPermissao}`));
      
      const idxFunc = parseInt(await perguntar("\nEscolha o funcionário (número): ")) - 1;
      if (idxFunc < 0 || idxFunc >= funcionarios.length) {
        console.log("Funcionário inválido!");
        return;
      }
      funcionario = funcionarios[idxFunc];
    } else {
      // Cadastrar novo
      const id = await perguntar("ID do funcionário: ");
      const nome = await perguntar("Nome completo: ");
      const telefone = await perguntar("Telefone: ");
      const endereco = await perguntar("Endereço: ");
      const usuario = await perguntar("Usuário: ");
      const senha = await perguntar("Senha: ");
      console.log("Nível: 1-ADMIN  2-ENGENHEIRO  3-OPERADOR");
      const niv = await perguntar("Escolha: ");
      const nivel = niv === '1' ? NivelPermissao.ADMINISTRADOR : 
                    niv === '2' ? NivelPermissao.ENGENHEIRO : NivelPermissao.OPERADOR;

      funcionario = new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel);
      funcionarios.push(funcionario);
      console.log(`Novo funcionário ${nome} cadastrado!`);
    }

    const adicionado = aeronave.etapas[idxEtapa].adicionarFuncionario(funcionario);
    if (adicionado) {
      console.log(`Funcionário ${funcionario.nome} adicionado à etapa com sucesso!`);
    } else {
      console.log("Este funcionário já está nesta etapa.");
    }
  }

  // salva
  salvarDados('aeronaves', aeronaves);
  salvarDados('funcionarios', funcionarios);
}

async function realizarTeste() {
  listarAeronaves();
  const codigo = await perguntar("\nCódigo da aeronave: ");
  const aeronave = aeronaves.find(a => a.codigo === codigo.toUpperCase());
  if (!aeronave) { console.log("Aeronave não encontrada!"); return; }

  console.log("Tipo: 1-ELETRICO  2-HIDRAULICO  3-AERODINAMICO");
  const t = await perguntar("Escolha: ");
  const tipo = t === '1' ? TipoTeste.ELETRICO : t === '2' ? TipoTeste.HIDRAULICO : TipoTeste.AERODINAMICO;

  console.log("Resultado: 1-APROVADO  2-REPROVADO");
  const r = await perguntar("Escolha: ");
  const resultado = r === '1' ? ResultadoTeste.APROVADO : ResultadoTeste.REPROVADO;

  const teste = new Teste(tipo, resultado);
  aeronave.adicionarTeste(teste);
  salvarDados('aeronaves', aeronaves);
  console.log("Teste registrado!");
}

async function gerarRelatorio() {
  listarAeronaves();
  const codigo = await perguntar("\nInforme o código da aeronave: ");
  const aeronave = aeronaves.find(a => a.codigo === codigo.toUpperCase());
  if (!aeronave) { 
    console.log("Aeronave não encontrada!"); 
    return; 
  }

  const cliente = await perguntar("Nome do cliente: ");
  const dataEntrega = await perguntar("Data de entrega (dd/mm/aaaa): ");

  aeronave.definirCliente(cliente);
  aeronave.definirDataEntrega(dataEntrega);

  // relatorios
  const relatorio = new Relatorio(
    aeronave.codigo,
    aeronave.modelo,
    cliente,
    dataEntrega,
    aeronave.pecas,
    aeronave.etapas,     
    aeronave.testes
  );

  const textoRelatorio = relatorio.gerarTexto();
  const caminho = salvarRelatorio(`relatorio_${codigo}`, textoRelatorio);

  console.log(`\n Relatório gerado com sucesso!`);
  console.log(`Funcionários agora aparecem no relatório.`);
  console.log(`Arquivo salvo em: ${caminho}`);
}

// start
async function iniciarSistema() {
  console.log("Iniciando Aerocode...\n");
  
  const logado = await login();
  if (!logado) {
    console.log("Falha no login. Encerrando...");
    rl.close();
    return;
  }

  menuPrincipal();
}

iniciarSistema();