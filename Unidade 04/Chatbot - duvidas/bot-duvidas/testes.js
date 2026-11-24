/**
 * Suíte de testes automatizados do Assistente do Manual de TCC — UDF.
 * Execução em Node.js puro (sem dependências): node testes.js
 */

'use strict';

const assert = require('assert');
const manual = require('./manual-udf.js');
const bot = require('./agente.js');

const indice = bot.criarIndiceManual(manual);
const casos = [];

function registrarTeste(nome, fn) {
  casos.push({ nome: nome, fn: fn });
}

function novaMemoria() {
  return bot.criarMemoriaInicial();
}

// =========================================================================
// 1. NAVEGAÇÃO POR CAPÍTULOS E SUBTÓPICOS
// =========================================================================

registrarTeste('Saudação inicial apresenta capítulos clicáveis do Manual da UDF', function () {
  const res = bot.processarMensagem('oi', indice, novaMemoria());
  assert.strictEqual(res.intencao, 'saudacao');
  assert.strictEqual(res.chips.length, 4);
  assert.ok(res.resposta.includes('UDF'));
});

registrarTeste('Seleção do Capítulo 1 (Estrutura) retorna resumo e subtópicos clicáveis', function () {
  const mem = novaMemoria();
  const res = bot.processarMensagem('1. Estrutura do TCC', indice, mem);
  assert.strictEqual(res.tipo, 'capitulo');
  assert.strictEqual(mem.capituloAtual, 'estrutura');
  assert.ok(res.chips.includes('1.1 Capa'));
  assert.ok(res.chips.includes('1.8 Resumo na Língua Vernácula'));
});

registrarTeste('Seleção do Capítulo 2 (Referências) lista os modelos da NBR 6023', function () {
  const mem = novaMemoria();
  const res = bot.processarMensagem('2. Referências', indice, mem);
  assert.strictEqual(res.tipo, 'capitulo');
  assert.strictEqual(mem.capituloAtual, 'referencias');
  assert.ok(res.chips.includes('2.3.12 Home Page (Sites)'));
  assert.ok(res.chips.includes('2.3.16 Livro'));
  assert.ok(res.chips.includes('2.4 Dados Desconhecidos (Local, Editora e Ano)'));
});

registrarTeste('Seleção do Capítulo 3 (Citações) lista citação curta, longa e apud', function () {
  const mem = novaMemoria();
  const res = bot.processarMensagem('3. Citações', indice, mem);
  assert.strictEqual(res.tipo, 'capitulo');
  assert.ok(res.chips.includes('3.4.1 Citação Direta Curta (até 3 linhas)'));
  assert.ok(res.chips.includes('3.4.2 Citação Direta Longa (mais de 3 linhas)'));
  assert.ok(res.chips.includes('3.5 Citação de Citação (apud)'));
});

registrarTeste('Seleção do Capítulo 4 (Formatação e Paginação) lista formato, espaçamento e paginação', function () {
  const mem = novaMemoria();
  const res = bot.processarMensagem('4. Formatação e Paginação', indice, mem);
  assert.strictEqual(res.tipo, 'capitulo');
  assert.ok(res.chips.includes('4.1 Formato, Papel, Margens e Fonte'));
  assert.ok(res.chips.includes('4.3 Paginação (Contagem e Posição)'));
});

// =========================================================================
// 2. BUSCA POR NÚMERO DE SEÇÃO, PERGUNTAS CURTAS, LONGAS E SINÔNIMOS (BM25)
// =========================================================================

registrarTeste('Busca por número exato de seção ("seção 3.4.2" e "1.8")', function () {
  const r1 = bot.processarMensagem('seção 3.4.2', indice, novaMemoria());
  assert.strictEqual(r1.intencao, 'busca_secao');
  assert.strictEqual(r1.topicoId, '3-4-2-citacao-direta-longa');
  assert.ok(r1.resposta.includes('4 cm'));

  const r2 = bot.processarMensagem('1.8', indice, novaMemoria());
  assert.strictEqual(r2.topicoId, '1-8-resumo-vernacula');
  assert.ok(r2.resposta.includes('150 a 500'));
});

registrarTeste('Busca curta por "margens" encontra Seção 4.1 (3 cm e 2 cm)', function () {
  const res = bot.processarMensagem('qual o tamanho da margem?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '4-1-formato-margens-fonte');
  assert.ok(res.resposta.includes('3 cm'));
  assert.ok(res.resposta.includes('2 cm'));
});

registrarTeste('Busca por sinônimo "abstract" encontra Seção 1.9 (Resumo em Língua Estrangeira)', function () {
  const res = bot.processarMensagem('como fazer o abstract?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '1-9-resumo-estrangeira');
  assert.ok(res.resposta.includes('obrigatório'));
});

registrarTeste('Busca por "como citar mais de 3 autores?" encontra Seção 2.1.1 (et al.)', function () {
  const res = bot.processarMensagem('como citar mais de 3 autores?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '2-1-1-autor-pessoa-fisica');
  assert.ok(res.resposta.includes('et al.'));
});

registrarTeste('Busca por "quantas palavras tem o resumo?" encontra Seção 1.8', function () {
  const res = bot.processarMensagem('quantas palavras tem o resumo?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '1-8-resumo-vernacula');
  assert.ok(res.resposta.includes('150 a 500 palavras'));
});

registrarTeste('Busca por "como referenciar um site?" encontra Seção 2.3.12 (Home Page)', function () {
  const res = bot.processarMensagem('como referenciar um site?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '2-3-12-home-page');
  assert.ok(res.exemplos.includes('CIVITAS'));
});

registrarTeste('Busca longa e contextualizada encontra citação direta longa (Seção 3.4.2)', function () {
  const res = bot.processarMensagem(
    'como faço para colocar uma citação direta com mais de três linhas no meu trabalho?',
    indice,
    novaMemoria()
  );
  assert.strictEqual(res.topicoId, '3-4-2-citacao-direta-longa');
  assert.ok(res.resposta.includes('recuo de 4 cm'));
});

registrarTeste('Busca sobre paginação encontra Seção 4.3 (2 cm superior/direita a partir da Introdução)', function () {
  const res = bot.processarMensagem('onde começa a numeração das páginas?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '4-3-paginacao');
  assert.ok(res.resposta.includes('canto superior direito'));
});

registrarTeste('Busca sobre diferença entre apêndice e anexo encontra Seção 1.17–1.18', function () {
  const res = bot.processarMensagem('qual a diferença entre apêndice e anexo?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '1-17-apendice-anexo');
  assert.ok(res.resposta.includes('ELABORADO PELO AUTOR'));
  assert.ok(res.resposta.includes('NÃO ELABORADO PELO AUTOR'));
});

registrarTeste('Busca sobre legislação/Constituição encontra Seção 2.3.15', function () {
  const res = bot.processarMensagem('como referenciar a Constituição de 1988?', indice, novaMemoria());
  assert.strictEqual(res.topicoId, '2-3-15-legislacao');
  assert.ok(res.exemplos.includes('Constituição (1988)'));
});

registrarTeste('Busca fora do escopo do manual retorna não encontrado com capítulos clicáveis', function () {
  const res = bot.processarMensagem('qual a receita de lasanha à bolonhesa?', indice, novaMemoria());
  assert.strictEqual(res.tipo, 'nao_encontrado');
  assert.strictEqual(res.chips.length, 4);
});

// =========================================================================
// 3. VALIDADOR DE RESUMO (Seção 1.8)
// =========================================================================

registrarTeste('Validador de Resumo aprova resumo completo entre 150 e 500 palavras dentro das normas', function () {
  const resumoValido =
    'Este trabalho analisa a aplicação das normas da Associação Brasileira de Normas Técnicas na elaboração de trabalhos de conclusão de curso em instituições de ensino superior do Distrito Federal. ' +
    'O objetivo principal consiste em avaliar os erros recorrentes de formatação, citações e referências em monografias defendidas entre os anos de dois mil e quinze e dois mil e vinte. ' +
    'Para atingir essa finalidade, adota-se uma pesquisa bibliográfica e documental de abordagem qualitativa e quantitativa, com levantamento sistemático em cinquenta trabalhos acadêmicos depositados no repositório institucional. ' +
    'O procedimento metodológico compreende a leitura técnica da estrutura pré-textual, a conferência das margens, do espaçamento e da paginação, além da verificação das chamadas autor-data e das entradas bibliográficas conforme a norma vigente. ' +
    'Os resultados demonstram que a maioria das inconsistências concentra-se na formatação de citações diretas longas, na ausência de datas de acesso em documentos eletrônicos e na inclusão indevida de elementos pré-textuais no sumário. ' +
    'Observa-se ainda que o uso de guias práticos reduz expressivamente o índice de retrabalho durante a revisão final orientada pelos docentes. ' +
    'Conclui-se que a padronização documental fortalece a clareza científica, facilita a recuperação da informação acadêmica e contribui para a qualidade editorial da produção universitária brasileira.\n\n' +
    'Palavras-chave: Trabalho acadêmico. Normas ABNT. Padronização documental. Metodologia científica.';

  const rel = bot.validarResumo(resumoValido);
  assert.strictEqual(rel.status, 'Aprovado');
  assert.ok(rel.metricas.totalPalavras >= 150 && rel.metricas.totalPalavras <= 500);
});

registrarTeste('Validador de Resumo detecta texto curto (< 150 palavras), 1ª pessoa e ausência de Palavras-chave', function () {
  const resumoRuim = 'Neste trabalho eu desenvolvi um aplicativo simples para nossa turma.';
  const rel = bot.validarResumo(resumoRuim);
  assert.strictEqual(rel.status, 'Necessita correções');
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('mínimo'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('1ª pessoa'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Palavras-chave ausentes'); }));
});

registrarTeste('Validador de Resumo detecta resumo acima de 500 palavras e separador incorreto em Palavras-chave', function () {
  const palavrasExcesso = Array(520).fill('estudo').join(' ');
  const texto =
    'Este trabalho analisa o objetivo, a metodologia, os resultados e a conclusão. ' +
    palavrasExcesso + '\n\nPalavras-chave: Direito; Metodologia; ABNT';
  const rel = bot.validarResumo(texto);
  assert.strictEqual(rel.status, 'Necessita correções');
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('máximo'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Separador incorreto'); }));
});

// =========================================================================
// 4. VALIDADOR DE CITAÇÃO (Seção 3)
// =========================================================================

registrarTeste('Validador de Citação aprova citação direta curta com aspas, CAIXA ALTA, página e [...]', function () {
  const cit = '"Apesar das aparências, a desconstrução do logocentrismo não é uma psicanálise da filosofia [...]" (DERRIDA, 1967, p. 293).';
  const rel = bot.validarCitacao(cit);
  assert.strictEqual(rel.status, 'Aprovado');
  assert.ok(rel.metricas.classificacao.includes('curta'));
});

registrarTeste('Validador de Citação reprova aspas em citação longa (> 3 linhas) e sobrenome minúsculo nos parênteses', function () {
  const citLongaComErro =
    '"Interessante observar que as leis e atos de efeitos concretos se apresentam numa roupagem de norma jurídica, com objeto e destinatários especificados. ' +
    'Não passam, porém, de medidas materialmente administrativas, despojadas de conteúdo normativo, trazendo a marca da generalidade e não consignando fontes primárias do Direito..." (Bulos, 2008).';
  const rel = bot.validarCitacao(citLongaComErro);
  assert.strictEqual(rel.status, 'Necessita correções');
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Aspas indevidas'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('CAIXA ALTA'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('página'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Supressão sem colchetes'); }));
});

registrarTeste('Validador de Citação reconhece citação indireta e uso de apud', function () {
  const indireta = 'A ironia pode ser compreendida como uma forma implícita de heterogeneidade mostrada (AUTHIER-REIRIZ, 1982).';
  const relInd = bot.validarCitacao(indireta);
  assert.strictEqual(relInd.status, 'Aprovado');
  assert.ok(relInd.metricas.classificacao.includes('indireta'));

  const comApud = 'Segundo Silva (1983 apud ABREU, 1999, p. 3), a norma define critérios claros.';
  const relApud = bot.validarCitacao(comApud);
  assert.strictEqual(relApud.status, 'Aprovado');
  assert.ok(relApud.itens.some(function (i) { return i.titulo.includes('apud'); }));
});

// =========================================================================
// 5. VALIDADOR DE REFERÊNCIA (Seção 2)
// =========================================================================

registrarTeste('Validador de Referência aprova livro e referência online com Disponível em e Acesso em', function () {
  const livro = 'LAKATOS, Eva Maria; MARCONI, Marina de Andrade. Metodologia do trabalho científico. 6. ed. São Paulo: Atlas, 2001. 219 p.';
  const relLivro = bot.validarReferencia(livro);
  assert.strictEqual(relLivro.status, 'Aprovado');

  const online = 'BRASIL. Constituição (1988). Constituição da República Federativa do Brasil. Brasília, 1988. Disponível em: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm. Acesso em: 25 out. 2026.';
  const relOnline = bot.validarReferencia(online);
  assert.strictEqual(relOnline.status, 'Aprovado');
});

registrarTeste('Validador de Referência rejeita "Anônimo" e alerta falta de Disponível em / Acesso em em URL', function () {
  const refComAnonimo = 'ANÔNIMO. Manual sem autor identificado. https://exemplo.com.br/manual';
  const rel = bot.validarReferencia(refComAnonimo);
  assert.strictEqual(rel.status, 'Necessita correções');
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Anônimo'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Disponível em'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Acesso em'); }));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Ano'); }));
});

// =========================================================================
// 6. VALIDADOR DE ESTRUTURA DO TCC (Seção 1)
// =========================================================================

registrarTeste('Validador de Estrutura aprova lista completa com todos os 10 elementos obrigatórios', function () {
  const estruturaCompleta = [
    'Capa',
    'Folha de Rosto',
    'Folha de Aprovação',
    'Agradecimentos',
    'Resumo',
    'Abstract',
    'Sumário',
    '1 Introdução',
    '2 Desenvolvimento',
    '3 Conclusão',
    'Referências',
    'Apêndice A'
  ].join('\n');

  const rel = bot.validarEstrutura(estruturaCompleta);
  assert.strictEqual(rel.status, 'Aprovado');
  assert.strictEqual(rel.metricas.obrigatoriosPresentes, 10);
  assert.ok(rel.metricas.opcionais.includes('Agradecimentos'));
  assert.ok(rel.metricas.opcionais.includes('Apêndice'));
});

registrarTeste('Validador de Estrutura aponta elementos obrigatórios faltantes e pré-textuais numerados', function () {
  const estruturaIncompleta = [
    '1 Resumo',
    '2 Sumário',
    '3 Introdução',
    '4 Desenvolvimento'
  ].join('\n');

  const rel = bot.validarEstrutura(estruturaIncompleta);
  assert.strictEqual(rel.status, 'Necessita correções');
  assert.ok(rel.metricas.faltantes.includes('Capa'));
  assert.ok(rel.metricas.faltantes.includes('Folha de Rosto'));
  assert.ok(rel.metricas.faltantes.includes('Referências'));
  assert.ok(rel.itens.some(function (i) { return i.nivel === 'ERRO' && i.titulo.includes('Pré-textuais numerados'); }));
});

// =========================================================================
// 7. FLUXO INTERATIVO E INLINE DE VALIDAÇÃO NO CHAT
// =========================================================================

registrarTeste('Fluxo interativo (/validar citacao + texto na próxima mensagem) e inline ("validar referencia: ...")', function () {
  const mem = novaMemoria();
  const passo1 = bot.processarMensagem('/validar citacao', indice, mem);
  assert.strictEqual(passo1.tipo, 'modo_validacao');
  assert.strictEqual(mem.modoValidacao, 'citacao');

  const passo2 = bot.processarMensagem('"A norma padroniza o texto." (SILVA, 2020, p. 10).', indice, mem);
  assert.strictEqual(passo2.tipo, 'validacao');
  assert.strictEqual(passo2.relatorio.status, 'Aprovado');
  assert.strictEqual(mem.modoValidacao, null);

  const inline = bot.processarMensagem(
    'validar referencia: ISKANDAR, Jamil Ibrahim. Normas da ABNT. 5. ed. Curitiba: Juruá, 2012. 98 p.',
    indice,
    mem
  );
  assert.strictEqual(inline.tipo, 'validacao');
  assert.strictEqual(inline.relatorio.status, 'Aprovado');
});

// Execução da suíte
let aprovados = 0;
let falhas = 0;

casos.forEach(function (caso, i) {
  try {
    caso.fn();
    aprovados += 1;
    console.log('[OK] ' + (i + 1) + '. ' + caso.nome);
  } catch (erro) {
    falhas += 1;
    console.error('[FALHOU] ' + (i + 1) + '. ' + caso.nome);
    console.error('   ' + erro.message);
  }
});

console.log('\nResultado: ' + aprovados + ' de ' + casos.length + ' aprovados');

if (falhas > 0) {
  process.exit(1);
}
