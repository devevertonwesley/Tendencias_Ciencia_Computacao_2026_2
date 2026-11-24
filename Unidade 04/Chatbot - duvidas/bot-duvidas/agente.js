/**
 * Assistente do Manual de TCC — UDF (2020).
 *
 * Motor 100% determinístico em JavaScript puro (sem IA generativa, sem API,
 * sem servidor e sem dependências externas).
 *
 * Funcionalidades integradas:
 *   1. Consulta ao Manual de TCC da UDF (2020) por navegação de capítulos/subtópicos
 *      ou busca textual ranqueada via Okapi BM25 com boost de 2.5x em título e seção.
 *   2. Validador determinístico de trechos de TCC:
 *      - validarResumo(texto)
 *      - validarCitacao(texto)
 *      - validarReferencia(texto)
 *      - validarEstrutura(texto)
 *
 * Compatível com navegador (window.BotTCC) e Node.js (module.exports).
 */

(function (escopoGlobal) {
  'use strict';

  const LIMITE_CARACTERES = 5000;
  const BM25_K1 = 1.5;
  const BM25_B = 0.75;
  const PESO_TITULO = 2.5;
  const LIMIAR_FORTE_BM25 = 2.2;
  const LIMIAR_PARCIAL_BM25 = 0.9;
  const MAX_RELACIONADOS = 3;

  const STOPWORDS = new Set([
    'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'por', 'para', 'pra', 'pro', 'com', 'sem', 'sob', 'sobre', 'entre', 'ate',
    'que', 'qual', 'quais', 'quem', 'onde', 'quando', 'como', 'porque', 'pq',
    'e', 'ou', 'mas', 'porem', 'se', 'nao', 'sim',
    'eu', 'tu', 'ele', 'ela', 'nos', 'vos', 'eles', 'elas',
    'me', 'te', 'meu', 'minha', 'meus', 'minhas', 'seu', 'sua', 'seus', 'suas',
    'esse', 'essa', 'esses', 'essas', 'este', 'esta', 'estes', 'estas', 'isso', 'isto',
    'aqui', 'ali', 'la', 'ser', 'estar', 'ter', 'haver', 'fazer', 'ir',
    'foi', 'era', 'sao', 'esta', 'estao', 'tem', 'tenho', 'pode', 'posso', 'podem',
    'quero', 'preciso', 'saber', 'entender', 'explicar', 'explica', 'explique',
    'duvida', 'duvidas', 'pergunta', 'trabalho', 'trabalhos', 'academico', 'academicos',
    'manual', 'udf', 'norma', 'normas', 'regra', 'regras', 'texto', 'muito', 'bem',
    'ja', 'ainda', 'so', 'tambem', 'tbm', 'vc', 'voce', 'oi', 'ola', 'alguem',
    'favor', 'obrigado', 'obrigada', 'valeu', 'ta', 'to', 'eh', 'ne', 'tipo', 'coisa',
    'funciona', 'funcionam', 'serve', 'servem', 'usar', 'uso', 'usa', 'usando',
    'faco', 'colocar', 'botar', 'escrever', 'montar', 'criar', 'devo', 'deve', 'devem',
    'quantos', 'quantas', 'quanto', 'quanta', 'fica', 'ficar', 'precisa', 'seria',
    'referenciar', 'citar', 'formatar', 'diferenca', 'exemplo', 'exemplos', 'modelo'
  ]);

  const EXPRESSOES_SAUDACAO = [
    'oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eai', 'opa', 'fala', 'salve', 'hello', 'hi'
  ];
  const EXPRESSOES_AJUDA = [
    'ajuda', 'como funciona', 'como usar', 'comandos', 'menu', 'o que voce faz', 'help', 'inicio', 'capitulos', 'sumario do manual'
  ];
  const EXPRESSOES_DESPEDIDA = [
    'tchau', 'ate mais', 'ate logo', 'obrigado', 'obrigada', 'valeu', 'flw', 'falou', 'adeus'
  ];
  const EXPRESSOES_CANCELAR = ['cancelar', 'sair', 'voltar', 'parar'];

  const RADICAIS_AUXILIARES = new Set([
    'bot', 'assis', 'tudo', 'bem', 'bom', 'pesso', 'gente', 'aqui', 'agora', 'tcc'
  ]);

  // =========================================================================
  // Utilitários de normalização, sinônimos e radicais
  // =========================================================================

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizarTexto(texto) {
    return String(texto || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function gerarRadical(palavra) {
    return palavra.length > 5 ? palavra.slice(0, 5) : palavra;
  }

  function prepararMapaSinonimos(sinonimos) {
    const mapa = {};
    const compostas = [];
    if (sinonimos && typeof sinonimos === 'object') {
      Object.keys(sinonimos).forEach(function (chave) {
        const cNorm = normalizarTexto(chave);
        const vNorm = normalizarTexto(sinonimos[chave]);
        if (!cNorm || !vNorm) return;
        mapa[cNorm] = vNorm;
        if (cNorm.includes(' ')) compostas.push(cNorm);
      });
    }
    compostas.sort(function (a, b) { return b.length - a.length; });
    return { mapa: mapa, compostas: compostas };
  }

  function extrairRadicaisComFrequencia(textoNormalizado, sinonimosPrep) {
    let textoProc = textoNormalizado;
    if (sinonimosPrep) {
      sinonimosPrep.compostas.forEach(function (chave) {
        const rx = new RegExp('\\b' + escaparRegex(chave) + '\\b', 'g');
        textoProc = textoProc.replace(rx, sinonimosPrep.mapa[chave]);
      });
    }

    const palavras = textoProc ? textoProc.split(' ') : [];
    const radicais = [];

    palavras.forEach(function (palavra) {
      if (!palavra || STOPWORDS.has(palavra)) return;
      const substituto = sinonimosPrep ? sinonimosPrep.mapa[palavra] : null;
      if (substituto) {
        substituto.split(' ').forEach(function (sub) {
          if (sub && sub.length >= 2 && !STOPWORDS.has(sub)) {
            radicais.push(gerarRadical(sub));
          }
        });
      } else if (palavra.length >= 2) {
        radicais.push(gerarRadical(palavra));
      }
    });

    return radicais;
  }

  function extrairRadicaisUnicos(textoNormalizado, sinonimosPrep) {
    const lista = extrairRadicaisComFrequencia(textoNormalizado, sinonimosPrep);
    const unicos = [];
    lista.forEach(function (r) {
      if (r && !unicos.includes(r)) unicos.push(r);
    });
    return unicos;
  }

  function contarOcorrencias(lista, termo) {
    let total = 0;
    for (let i = 0; i < lista.length; i++) {
      if (lista[i] === termo) total += 1;
    }
    return total;
  }

  // =========================================================================
  // INDEXAÇÃO DO MANUAL DA UDF + MOTOR BM25
  // =========================================================================

  /**
   * Indexa todos os tópicos do manual-udf.js para busca determinística BM25.
   */
  function criarIndiceManual(manual) {
    const sinonimosPrep = prepararMapaSinonimos(manual.sinonimos);
    const mapaCapitulos = {};
    (manual.capitulos || []).forEach(function (cap) {
      mapaCapitulos[cap.id] = cap;
    });

    const documentos = [];
    const dfMap = {};
    let somaTamanhos = 0;

    (manual.topicos || []).forEach(function (topico) {
      const cap = mapaCapitulos[topico.capitulo];
      const tituloTexto = [
        topico.secao,
        (topico.secoes || []).join(' '),
        topico.titulo,
        cap ? cap.titulo : ''
      ].join(' ');
      const corpoTexto = [topico.conteudo || '', topico.exemplos || ''].join(' ');

      const radicaisTitulo = extrairRadicaisComFrequencia(normalizarTexto(tituloTexto), sinonimosPrep);
      const radicaisConteudo = extrairRadicaisComFrequencia(normalizarTexto(corpoTexto), sinonimosPrep);

      // Também preserva tokens de número de seção sem pontos (ex.: "3.4.2" -> "342" e "3 4 2")
      const secoesNormalizadas = (topico.secoes || [topico.secao]).map(function (s) {
        return String(s).trim().toLowerCase();
      });

      const unicos = new Set();
      radicaisTitulo.forEach(function (r) { unicos.add(r); });
      radicaisConteudo.forEach(function (r) { unicos.add(r); });

      unicos.forEach(function (r) {
        dfMap[r] = (dfMap[r] || 0) + 1;
      });

      const tamanhoPonderado = radicaisConteudo.length + PESO_TITULO * radicaisTitulo.length;
      somaTamanhos += tamanhoPonderado;

      documentos.push({
        topico: topico,
        capitulo: cap || null,
        tituloNormalizado: normalizarTexto(topico.titulo),
        secoesNormalizadas: secoesNormalizadas,
        radicaisTitulo: radicaisTitulo,
        radicaisConteudo: radicaisConteudo,
        tamanhoPonderado: tamanhoPonderado
      });
    });

    const total = documentos.length;
    return {
      manual: manual,
      sinonimosPrep: sinonimosPrep,
      documentos: documentos,
      totalDocumentos: total,
      tamanhoMedio: total > 0 ? somaTamanhos / total : 1,
      frequenciaDocumental: dfMap
    };
  }

  /**
   * Busca exata por número de seção (ex.: "3.4.2", "seção 1.8", "2.3.12").
   */
  function buscarPorNumeroSecao(mensagemBruta, indice) {
    const match = String(mensagemBruta || '').match(/(?:^|\s|se[cç][aã]o\s+|item\s+|t[oó]pico\s+)(\d+(?:\.\d+){1,3})(?=\s|$|[.,?!:])/i);
    if (!match) return null;
    const codigo = match[1].trim();
    const encontrado = indice.documentos.find(function (doc) {
      return doc.secoesNormalizadas.includes(codigo) || doc.topico.secao === codigo;
    });
    return encontrado ? encontrado.topico : null;
  }

  /**
   * Executa busca BM25 ranqueada sobre todos os tópicos do manual.
   */
  function buscarBM25(radicaisPergunta, indice, textoNormalizado) {
    if (!indice || !indice.documentos.length || !radicaisPergunta.length) {
      return [];
    }

    const N = indice.totalDocumentos;
    const avgdl = indice.tamanhoMedio > 0 ? indice.tamanhoMedio : 1;
    const dfMap = indice.frequenciaDocumental;
    const resultados = [];

    indice.documentos.forEach(function (doc) {
      const comuns = [];
      let pontuacao = 0;
      let coincidiuTitulo = false;

      const dl = doc.tamanhoPonderado > 0 ? doc.tamanhoPonderado : 1;
      const fatorNorm = 1 - BM25_B + BM25_B * (dl / avgdl);

      radicaisPergunta.forEach(function (rad) {
        const tfTitulo = contarOcorrencias(doc.radicaisTitulo, rad);
        const tfConteudo = contarOcorrencias(doc.radicaisConteudo, rad);
        const tfPonderado = tfConteudo + PESO_TITULO * tfTitulo;

        if (tfPonderado > 0) {
          comuns.push(rad);
          if (tfTitulo > 0) coincidiuTitulo = true;

          const df = dfMap[rad] || 1;
          const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
          const num = tfPonderado * (BM25_K1 + 1);
          const den = tfPonderado + BM25_K1 * fatorNorm;
          pontuacao += idf * (num / den);
        }
      });

      const tituloExato = Boolean(textoNormalizado && textoNormalizado === doc.tituloNormalizado);
      if (tituloExato) {
        pontuacao = Math.max(pontuacao, LIMIAR_FORTE_BM25 + 10);
        coincidiuTitulo = true;
      }

      if (comuns.length > 0 || tituloExato) {
        resultados.push({
          topico: doc.topico,
          bm25: Number(pontuacao.toFixed(4)),
          cobertura: Number((comuns.length / radicaisPergunta.length).toFixed(4)),
          comuns: comuns,
          coincidiuTitulo: coincidiuTitulo,
          tituloExato: tituloExato
        });
      }
    });

    resultados.sort(function (a, b) {
      if (b.bm25 !== a.bm25) return b.bm25 - a.bm25;
      if (b.cobertura !== a.cobertura) return b.cobertura - a.cobertura;
      return (b.coincidiuTitulo ? 1 : 0) - (a.coincidiuTitulo ? 1 : 0);
    });

    return resultados.slice(0, MAX_RELACIONADOS + 1);
  }

  // =========================================================================
  // VALIDADOR DETERMINÍSTICO DE TRECHOS DE TCC (Baseado no Manual UDF 2020)
  // =========================================================================

  function finalizarRelatorio(tipo, titulo, itens, metricas) {
    let ok = 0;
    let atencao = 0;
    let erro = 0;

    itens.forEach(function (item) {
      if (item.nivel === 'OK') ok += 1;
      else if (item.nivel === 'ATENCAO') atencao += 1;
      else erro += 1;
    });

    let status = 'Aprovado';
    if (erro > 0) status = 'Necessita correções';
    else if (atencao > 0) status = 'Aprovado com ressalvas';

    return {
      tipo: tipo,
      titulo: titulo,
      status: status,
      resumoContagem: { ok: ok, atencao: atencao, erro: erro },
      itens: itens,
      metricas: metricas || {}
    };
  }

  /**
   * 1. Validador de Resumo (Seção 1.8 — págs. 8–9)
   */
  function validarResumo(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Texto vazio',
        detalhe: 'Cole o texto do resumo (incluindo a linha Palavras-chave:) para realizar a validação.',
        referencia: 'Seção 1.8, págs. 8–9'
      });
      return finalizarRelatorio('resumo', 'Validação de Resumo (Seção 1.8 — págs. 8–9)', itens, { totalPalavras: 0 });
    }

    // Separa corpo do resumo da linha "Palavras-chave:"
    const matchPc = texto.match(/(?:^|\n)\s*(palavras[\s-]?chave\s*:[\s\S]*)$/i);
    let corpo = matchPc ? texto.slice(0, matchPc.index).trim() : texto;
    const linhaPalavrasChave = matchPc ? matchPc[1].trim() : '';

    // Remove eventual cabeçalho "RESUMO" no início
    corpo = corpo.replace(/^resumo\s*\n+/i, '').trim();

    // 1) Contagem de palavras (150 a 500)
    const palavras = corpo.match(/[a-zA-ZÀ-ÿ0-9]+(?:[-'][a-zA-ZÀ-ÿ0-9]+)*/g) || [];
    const totalPalavras = palavras.length;

    if (totalPalavras >= 150 && totalPalavras <= 500) {
      itens.push({
        nivel: 'OK',
        titulo: 'Extensão do resumo',
        detalhe: totalPalavras + ' palavras — dentro da faixa exigida (150 a 500 palavras).',
        referencia: 'Seção 1.8, pág. 9'
      });
    } else if (totalPalavras < 150) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Extensão abaixo do mínimo',
        detalhe:
          totalPalavras + ' palavras encontradas. Faltam ' + (150 - totalPalavras) +
          ' palavras para atingir o mínimo de 150 palavras.',
        referencia: 'Seção 1.8, pág. 9'
      });
    } else {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Extensão acima do máximo',
        detalhe:
          totalPalavras + ' palavras encontradas. Sobram ' + (totalPalavras - 500) +
          ' palavras acima do limite máximo de 500 palavras.',
        referencia: 'Seção 1.8, pág. 9'
      });
    }

    // 2) Parágrafo único
    const paragrafos = corpo.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (paragrafos.length <= 1) {
      itens.push({
        nivel: 'OK',
        titulo: 'Parágrafo único',
        detalhe: 'O corpo do resumo está estruturado em parágrafo único.',
        referencia: 'Seção 1.8, pág. 9'
      });
    } else {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Múltiplos parágrafos detectados',
        detalhe:
          'Foram encontrados ' + paragrafos.length +
          ' parágrafos antes das palavras-chave. O manual recomenda o uso de parágrafo único.',
        referencia: 'Seção 1.8, pág. 9'
      });
    }

    // 3) Palavras-chave: separadas e finalizadas por ponto
    if (!linhaPalavrasChave) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Palavras-chave ausentes',
        detalhe: 'Falta incluir a expressão "Palavras-chave:" logo abaixo do resumo, com termos separados e finalizados por ponto.',
        referencia: 'Seção 1.8, pág. 9'
      });
    } else {
      const conteudoPc = linhaPalavrasChave.replace(/^palavras[\s-]?chave\s*:/i, '').trim();
      const usaSeparadorIncorreto = /[;,]/.test(conteudoPc);
      const terminaComPonto = /\.$/.test(conteudoPc);
      const termosPc = conteudoPc.split('.').map(function (t) { return t.trim(); }).filter(Boolean);

      if (!conteudoPc || termosPc.length === 0) {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Palavras-chave vazias',
          detalhe: 'Informe os termos após "Palavras-chave:", separados e finalizados por ponto.',
          referencia: 'Seção 1.8, pág. 9'
        });
      } else if (usaSeparadorIncorreto) {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Separador incorreto em Palavras-chave',
          detalhe: 'Use ponto final (.) para separar e finalizar as palavras-chave — evite vírgula ou ponto e vírgula. Ex.: Palavras-chave: Direito. Metodologia. ABNT.',
          referencia: 'Seção 1.8, pág. 9'
        });
      } else if (!terminaComPonto) {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Ponto final ausente em Palavras-chave',
          detalhe: 'As palavras-chave devem ser finalizadas também por ponto final.',
          referencia: 'Seção 1.8, pág. 9'
        });
      } else {
        itens.push({
          nivel: 'OK',
          titulo: 'Palavras-chave padronizadas',
          detalhe: 'Expressão "Palavras-chave:" presente com ' + termosPc.length + ' termo(s) separados e finalizados por ponto.',
          referencia: 'Seção 1.8, pág. 9'
        });
      }
    }

    // 4) Voz ativa na 3ª pessoa do singular (sem 1ª pessoa)
    const rxPrimeiraPessoa =
      /\b(eu|n[oó]s|meu|meus|minha|minhas|nosso|nossos|nossa|nossas|fiz|fizemos|desenvolvi|desenvolvemos|apresento|apresentamos|conclu[ií]|conclu[ií]mos|analisei|analisamos|realizei|realizamos|estudei|estudamos|pesquisei|pesquisamos|investiguei|investigamos|propus|propusemos|busquei|buscamos|observei|observamos|verifiquei|verificamos)\b/gi;
    const ocorrencias1p = [];
    let m1p;
    while ((m1p = rxPrimeiraPessoa.exec(corpo)) !== null) {
      const termo = m1p[0].toLowerCase();
      if (!ocorrencias1p.includes(termo)) ocorrencias1p.push(termo);
    }

    if (ocorrencias1p.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Uso de 1ª pessoa detectado',
        detalhe:
          'Termos encontrados: "' + ocorrencias1p.join('", "') +
          '". O manual exige verbos na voz ativa e na 3ª pessoa do singular (ex.: "Este trabalho analisa...", "Conclui-se que...").',
        referencia: 'Seção 1.8, pág. 9'
      });
    } else {
      itens.push({
        nivel: 'OK',
        titulo: 'Pessoa verbal adequada',
        detalhe: 'Não foram detectados termos em 1ª pessoa; compatível com a 3ª pessoa do singular.',
        referencia: 'Seção 1.8, pág. 9'
      });
    }

    // 5) Presença dos 4 elementos esperados (objetivo, método, resultados, conclusão)
    const corpoNorm = normalizarTexto(corpo);
    const elementosEsperados = [
      { nome: 'objetivo', rx: /\b(objetiv\w*|proposit\w*|finalidad\w*|visa\w*|pretend\w*|busc\w*|analis\w*|investig\w*|avali\w*|propor|propoe|estud\w*)\b/ },
      { nome: 'método/metodologia', rx: /\b(metod\w*|pesquis\w*|revisao|bibliograf\w*|estudo de caso|questionari\w*|entrevist\w*|abordag\w*|qualitativ\w*|quantitativ\w*|procediment\w*|experiment\w*|documental)\b/ },
      { nome: 'resultados', rx: /\b(resultad\w*|achad\w*|evidenci\w*|constat\w*|verific\w*|apont\w*|demonstr\w*|mostr\w*|identific\w*|revel\w*|dados|observou)\b/ },
      { nome: 'conclusão', rx: /\b(conclu\w*|consideracoes|infere|portanto|por fim|sintese|diante disso|permite afirmar)\b/ }
    ];

    const faltantes = elementosEsperados
      .filter(function (el) { return !el.rx.test(corpoNorm); })
      .map(function (el) { return el.nome; });

    if (faltantes.length === 0) {
      itens.push({
        nivel: 'OK',
        titulo: 'Elementos de conteúdo do resumo',
        detalhe: 'Identificados indícios de objetivo, método/metodologia, resultados e conclusão.',
        referencia: 'Seção 1.8, pág. 9'
      });
    } else {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Possíveis elementos ausentes no resumo',
        detalhe:
          'Não foram detectados termos indicativos de: ' + faltantes.join(', ') +
          '. O resumo deve ressaltar objetivo, método, resultados e conclusões.',
        referencia: 'Seção 1.8, pág. 9'
      });
    }

    return finalizarRelatorio(
      'resumo',
      'Validação de Resumo (Seção 1.8 — págs. 8–9)',
      itens,
      { totalPalavras: totalPalavras, paragrafos: paragrafos.length }
    );
  }

  /**
   * 2. Validador de Citação (Seção 3 — págs. 32–39)
   */
  function validarCitacao(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Texto vazio',
        detalhe: 'Cole a citação que deseja conferir.',
        referencia: 'Seção 3, págs. 32–39'
      });
      return finalizarRelatorio('citacao', 'Validação de Citação (Seção 3 — págs. 32–39)', itens, {});
    }

    const temAspasDuplas = /["“”]/.test(texto);
    const temPagina = /\bp\.\s*\d+/i.test(texto);
    const temApud = /\bapud\b/i.test(texto);

    // Estima comprimento do texto citado (removendo chamadas entre parênteses)
    const corpoSemChamada = texto
      .replace(/\([^)]*\d{4}[^)]*\)/g, '')
      .replace(/["“”]/g, '')
      .trim();
    const linhasEstimadas = Math.max(1, Math.ceil(corpoSemChamada.length / 80));

    let classificacao = 'Citação indireta (paráfrase)';
    let ehDireta = false;
    let ehLonga = false;

    if (temAspasDuplas && linhasEstimadas <= 3) {
      classificacao = 'Citação direta curta (até 3 linhas)';
      ehDireta = true;
    } else if (temAspasDuplas && linhasEstimadas > 3) {
      classificacao = 'Citação direta longa (mais de 3 linhas)';
      ehDireta = true;
      ehLonga = true;
    } else if (!temAspasDuplas && linhasEstimadas > 3 && temPagina) {
      classificacao = 'Citação direta longa (mais de 3 linhas)';
      ehDireta = true;
      ehLonga = true;
    }

    itens.push({
      nivel: 'OK',
      titulo: 'Classificação estimada',
      detalhe:
        classificacao + ' — cerca de ' + linhasEstimadas + ' linha(s) (' + corpoSemChamada.length + ' caracteres).',
      referencia: ehLonga ? 'Seção 3.4.2, pág. 37' : (ehDireta ? 'Seção 3.4.1, pág. 37' : 'Seção 3.3, pág. 36')
    });

    // Regras de aspas conforme tipo
    if (ehLonga) {
      if (temAspasDuplas) {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Aspas indevidas em citação longa',
          detalhe: 'Citações diretas com mais de 3 linhas NÃO devem usar aspas. Destaque com recuo de 4 cm da margem esquerda, fonte 10 ou 11 e espaço simples.',
          referencia: 'Seção 3.4.2, pág. 37'
        });
      } else {
        itens.push({
          nivel: 'OK',
          titulo: 'Sem aspas na citação longa',
          detalhe: 'Correto! Lembre de aplicar no editor: recuo de 4 cm à esquerda, fonte 10 ou 11 e espaçamento simples.',
          referencia: 'Seção 3.4.2, pág. 37'
        });
      }
    } else if (ehDireta) {
      const contagemAspas = (texto.match(/["“”]/g) || []).length;
      if (contagemAspas >= 2) {
        itens.push({
          nivel: 'OK',
          titulo: 'Aspas duplas em citação direta curta',
          detalhe: 'Uso correto de aspas duplas para transcrição de até 3 linhas (use aspas simples se houver citação interna).',
          referencia: 'Seção 3.4.1, pág. 37'
        });
      } else {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Aspas duplas incompletas',
          detalhe: 'Abra e feche as aspas duplas envolvendo toda a transcrição literal curta.',
          referencia: 'Seção 3.4.1, pág. 37'
        });
      }
    }

    // Verificação do sistema de chamada (Autor-Data vs Numérico)
    const rxChamadaParenteses = /\(([^()]*\b(?:\[?\d{4}\]?[a-z]?)\b[^()]*)\)/g;
    const chamadasParenteses = [];
    let mPar;
    while ((mPar = rxChamadaParenteses.exec(texto)) !== null) {
      chamadasParenteses.push(mPar[1].trim());
    }

    const temChamadaAutorNoTexto =
      /\b[A-ZÀ-Ý][a-zà-ÿ-]+(?:\s+(?:e|de|da|do|dos|das)\s+[A-ZÀ-Ý][a-zà-ÿ-]+)*\s*\(\s*\[?\d{4}\]?[a-z]?(?:\s*,|\s+apud|\s*\))/i.test(texto);
    const temChamadaNumerica = /[¹²³⁴⁵⁶⁷⁸⁹⁰]|\(\d{1,3}\)|\[\d{1,3}\]/.test(texto);
    const temAutorData = chamadasParenteses.length > 0 || temChamadaAutorNoTexto;

    if (temAutorData && temChamadaNumerica) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Mistura de sistemas de chamada',
        detalhe: 'Foram detectados indícios de chamada Autor-Data e Numérica juntos. O manual proíbe usar ambos concomitantemente.',
        referencia: 'Seção 3.1, pág. 32'
      });
    }

    if (!temAutorData && !temChamadaNumerica) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Chamada de autoria/ano ausente',
        detalhe: 'Não foi identificada chamada com autor e ano de 4 dígitos, como (SILVA, 2020, p. 15) ou Silva (2020, p. 15).',
        referencia: 'Seção 3.1.1, pág. 32'
      });
    } else if (chamadasParenteses.length > 0) {
      // Verifica se há autor dentro dos parênteses e se está em CAIXA ALTA
      const chamada = chamadasParenteses[chamadasParenteses.length - 1];
      const temAno = /\b\d{4}[a-z]?\b/.test(chamada);
      const parteAntesAno = chamada.split(/\b\d{4}/)[0].replace(/[\[\],;:\s]+$/g, '').trim();

      if (parteAntesAno) {
        // Ignora expressões válidas em minúsculas dentro dos parênteses
        const parteAutores = parteAntesAno
          .replace(/\b(apud|et\s+al\.?|v\.|p\.|grifo\s+(?:nosso|do\s+autor))\b/gi, '')
          .replace(/[.,;:\d\s-]/g, '');

        const temMinusculaNoSobrenome = /[a-zà-ÿ]/.test(parteAutores);
        if (temMinusculaNoSobrenome && !temChamadaAutorNoTexto) {
          itens.push({
            nivel: 'ERRO',
            titulo: 'Sobrenome fora de CAIXA ALTA nos parênteses',
            detalhe:
              'Na chamada entre parênteses ("(' + chamada + ')"), o sobrenome do autor deve estar todo em MAIÚSCULAS. Ex.: (SILVA, 2020, p. 15).',
            referencia: 'Seção 3.1.1 e 3.3, págs. 32 e 36'
          });
        } else if (temAno) {
          itens.push({
            nivel: 'OK',
            titulo: 'Chamada Autor-Data padronizada',
            detalhe: 'Chamada (' + chamada + ') com autor em CAIXA ALTA e ano de 4 dígitos.',
            referencia: 'Seção 3.1.1, pág. 32'
          });
        }
      } else if (temChamadaAutorNoTexto && temAno) {
        itens.push({
          nivel: 'OK',
          titulo: 'Chamada Autor-Data no texto',
          detalhe: 'Autor citado fora dos parênteses seguido do ano entre parênteses.',
          referencia: 'Seção 3.1.1, pág. 32'
        });
      }
    } else if (temChamadaAutorNoTexto) {
      itens.push({
        nivel: 'OK',
        titulo: 'Chamada Autor-Data no texto',
        detalhe: 'Autor citado no texto seguido do ano entre parênteses.',
        referencia: 'Seção 3.1.1, pág. 32'
      });
    } else if (temChamadaNumerica) {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Sistema numérico detectado',
        detalhe: 'No sistema numérico, a numeração é única e consecutiva em todo o trabalho e não pode ser usada junto com notas explicativas no rodapé.',
        referencia: 'Seção 3.1.2, pág. 34'
      });
    }

    // Indicação de página
    if (ehDireta) {
      if (temPagina) {
        itens.push({
          nivel: 'OK',
          titulo: 'Indicação de página presente',
          detalhe: 'Página informada na chamada da citação direta.',
          referencia: 'Seção 3.4, pág. 37'
        });
      } else {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Falta indicação de página',
          detalhe: 'Citações diretas exigem a indicação da página consultada (ex.: p. 15).',
          referencia: 'Seção 3.4, pág. 37'
        });
      }
    }

    // Verificação de supressão [...]
    const textoSemColchetesRet = texto.replace(/\[\s*(?:\.{3}|…)\s*\]/g, '');
    const temSupressaoCorreta = /\[\s*(?:\.{3}|…)\s*\]/.test(texto);
    const temReticenciasSoltas = /\.{3}|…/.test(textoSemColchetesRet);

    if (temReticenciasSoltas) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Supressão sem colchetes',
        detalhe: 'Foram encontradas reticências soltas ("..."). Para suprimir parte do texto original, utilize obrigatoriamente colchetes: [...].',
        referencia: 'Seção 3.6.1, pág. 38'
      });
    } else if (temSupressaoCorreta) {
      itens.push({
        nivel: 'OK',
        titulo: 'Supressão com [...]',
        detalhe: 'Supressão de trecho indicada corretamente entre colchetes.',
        referencia: 'Seção 3.6.1, pág. 38'
      });
    }

    // Verificação de apud
    if (temApud) {
      const temDoisAnos = (texto.match(/\b\d{4}[a-z]?\b/g) || []).length >= 2;
      if (temDoisAnos) {
        itens.push({
          nivel: 'OK',
          titulo: 'Citação de citação (apud)',
          detalhe: 'Uso de "apud" com referência ao autor original e à obra consultada. Inclua na lista de referências a obra que vem após "apud".',
          referencia: 'Seção 3.5, pág. 38'
        });
      } else {
        itens.push({
          nivel: 'ATENCAO',
          titulo: 'Verifique os dados do "apud"',
          detalhe: 'Na citação de citação, informe autor e ano da obra original seguidos de "apud" e autor/ano da obra consultada. Ex.: (VIANNA, 1986, p. 172 apud SEGATTO, 1995, p. 214).',
          referencia: 'Seção 3.5, pág. 38'
        });
      }
    }

    return finalizarRelatorio(
      'citacao',
      'Validação de Citação (Seção 3 — págs. 32–39)',
      itens,
      { classificacao: classificacao, linhasEstimadas: linhasEstimadas }
    );
  }

  /**
   * 3. Validador de Referência (Seção 2 — págs. 12–31)
   */
  function validarReferencia(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Texto vazio',
        detalhe: 'Cole a referência bibliográfica que deseja validar.',
        referencia: 'Seção 2, págs. 12–31'
      });
      return finalizarRelatorio('referencia', 'Validação de Referência (Seção 2 — págs. 12–31)', itens, {});
    }

    // 1) Proibição do termo "Anônimo"
    if (/\ban[oô]nim[oa]s?\b/i.test(texto)) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Uso proibido do termo "Anônimo"',
        detalhe: 'O manual proíbe usar "Anônimo" como autor. Quando a autoria for desconhecida, faça a entrada diretamente pela primeira palavra do título em MAIÚSCULAS.',
        referencia: 'Seção 2.1.3, pág. 14'
      });
    }

    // 2) Entrada inicial em CAIXA ALTA
    // Aceita: SOBRENOME, ... | ENTIDADE. ... | O CONGRESSO ... | DIAGNÓSTICO ... | ______.
    const entradaValida =
      /^(?:_{6}\.|(?:[OA]S?\s+)?[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9\-']+(?:\s+[A-ZÀ-Ý0-9\-']+)*\s*(?:,|\.|(?:\s+[a-zà-ÿ])))/.test(texto);

    if (entradaValida) {
      itens.push({
        nivel: 'OK',
        titulo: 'Entrada em CAIXA ALTA',
        detalhe: 'A referência inicia com entrada em maiúsculas (sobrenome, entidade ou primeira palavra do título).',
        referencia: 'Seção 2.1, págs. 12–14'
      });
    } else {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Entrada inicial fora do padrão',
        detalhe: 'Inicie a referência em CAIXA ALTA: SOBRENOME, Nome. (pessoa física), NOME DA ENTIDADE. (pessoa jurídica) ou PRIMEIRA PALAVRA do título (autor desconhecido).',
        referencia: 'Seção 2.1, págs. 12–14'
      });
    }

    // 3) Separação de múltiplos autores com ";"
    const primeiraFrase = texto.split(/\.\s+/)[0] || '';
    const usaEEntreAutores = /[A-ZÀ-Ý]{2,},\s+[A-Za-zÀ-ÿ.\s]+\s+(?:e|&)\s+[A-ZÀ-Ý]{2,},/.test(primeiraFrase);
    const usaPontoVirgulaAutores = /;\s*[A-ZÀ-Ý]{2,}/.test(primeiraFrase);

    if (usaEEntreAutores) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Separador de autores incorreto',
        detalhe: 'Separe dois ou três autores com ponto e vírgula seguido de espaço (; ), e não com "e" ou "&". Ex.: LAKATOS, Eva Maria; MARCONI, Marina de Andrade.',
        referencia: 'Seção 2.1.1, pág. 12'
      });
    } else if (usaPontoVirgulaAutores) {
      itens.push({
        nivel: 'OK',
        titulo: 'Múltiplos autores separados por ";"',
        detalhe: 'Autores separados corretamente por ponto e vírgula.',
        referencia: 'Seção 2.1.1, pág. 12'
      });
    }

    // 4) Ano de publicação (4 dígitos ou data aproximada entre colchetes)
    const rxAno = /(?:^|[\s,(\[])(?:[pc]?\d{4}[a-z]?|\d{4}\s+ou\s+\d{4}|entre\s+\d{4}\s+e\s+\d{4}|ca\.\s*\d{4}|\d{3}-\??|\d{2}--\??)(?=[\s.,)\]]|$)/i;
    if (rxAno.test(texto)) {
      itens.push({
        nivel: 'OK',
        titulo: 'Ano de publicação presente',
        detalhe: 'Data de publicação identificada na referência.',
        referencia: 'Seção 2.4.3, pág. 30'
      });
    } else {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Ano de publicação ausente',
        detalhe: 'A data é elemento essencial. Caso não apareça na obra, registre uma data aproximada entre colchetes, ex.: [2020?] ou [ca. 2018].',
        referencia: 'Seção 2.4.3, pág. 30'
      });
    }

    // 5) Regras para documentos online (URL)
    const temUrl = /(?:https?:\/\/|www\.)\S+/i.test(texto);
    if (temUrl) {
      const temDisponivel = /\bdispon[ií]vel\s+em\s*:/i.test(texto);
      const temAcesso = /\bacesso\s+em\s*:/i.test(texto);
      const temDataAcessoAbreviada =
        /\bacesso\s+em\s*:\s*\d{1,2}\s+(?:jan\.|fev\.|mar\.|abr\.|maio|jun\.|jul\.|ago\.|set\.|out\.|nov\.|dez\.)\s+\d{4}/i.test(texto);

      if (!temDisponivel) {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Falta "Disponível em:"',
          detalhe: 'Referências com link/URL devem apresentar a expressão "Disponível em:" antes do endereço eletrônico.',
          referencia: 'Seções 2.3.2, 2.3.4 e 2.3.12'
        });
      }

      if (!temAcesso) {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Falta "Acesso em:"',
          detalhe: 'Referências online exigem a data de consulta no formato "Acesso em: dia mês abreviado ano" (ex.: Acesso em: 24 out. 2026).',
          referencia: 'Seções 2.3.2, 2.3.4 e 2.3.12'
        });
      } else if (!temDataAcessoAbreviada) {
        itens.push({
          nivel: 'ATENCAO',
          titulo: 'Formato da data em "Acesso em:"',
          detalhe: 'Use dia, mês abreviado com ponto (exceto maio) e ano com 4 dígitos. Ex.: Acesso em: 24 out. 2026.',
          referencia: 'Seções 2.3.2 e 2.3.12'
        });
      }

      if (temDisponivel && temDataAcessoAbreviada) {
        itens.push({
          nivel: 'OK',
          titulo: 'Campos de documento online válidos',
          detalhe: 'Expressões "Disponível em:" e "Acesso em:" com data abreviada estão corretas.',
          referencia: 'Seções 2.3.2 e 2.3.12'
        });
      }
    }

    // 6) Local e editora (ou [S.l.] / [s.n.])
    const temLocalEditora =
      /[A-ZÀ-Ý][a-zà-ÿ\s.-]+:\s*[^,.\n]+,\s*(?:\[?[pc]?\d{4}|\[ca\.|\[entre)/i.test(texto) ||
      /\[S\.l\.?\]|\[s\.n\.?\]|\[S\.l\.?:\s*s\.n\.?\]/i.test(texto);
    const ehTipoSemEditoraTradicional =
      temUrl || /\b(v\.\s*\d+|n\.\s*\d+|lei\s+n\.|decreto|constitui[cç][aã]o|s[uú]mula|processo\s+n\.|trabalho\s+de\s+conclus[aã]o|disserta[cç][aã]o|tese)\b/i.test(texto);

    if (temLocalEditora) {
      itens.push({
        nivel: 'OK',
        titulo: 'Local e editora identificados',
        detalhe: 'Indicação de local e editora (ou [S.l.]/[s.n.]) presente na referência.',
        referencia: 'Seções 2.4.1 e 2.4.2, págs. 29–30'
      });
    } else if (!ehTipoSemEditoraTradicional) {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Verifique Local e Editora',
        detalhe: 'Não foi identificado o padrão "Cidade: Editora, ano". Se não constarem na obra, use [S.l.] para local desconhecido e [s.n.] para editora desconhecida.',
        referencia: 'Seções 2.4.1 e 2.4.2, págs. 29–30'
      });
    }

    // 7) Lembrete de formatação na lista final
    itens.push({
      nivel: 'OK',
      titulo: 'Formatação na lista final',
      detalhe: 'Alinhe somente à margem esquerda, em espaço simples, separando cada referência por 1 espaço simples em branco.',
      referencia: 'Seção 2, pág. 12'
    });

    return finalizarRelatorio(
      'referencia',
      'Validação de Referência (Seção 2 — págs. 12–31)',
      itens,
      { online: temUrl }
    );
  }

  /**
   * 4. Validador de Estrutura / Checklist do TCC (Seção 1 — págs. 6–11)
   */
  function validarEstrutura(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Lista vazia',
        detalhe: 'Cole seu sumário ou a lista de elementos/seções do seu TCC para conferir o checklist obrigatório.',
        referencia: 'Seção 1, pág. 6'
      });
      return finalizarRelatorio('estrutura', 'Validação de Estrutura do TCC (Seção 1 — págs. 6–11)', itens, {});
    }

    const textoNorm = normalizarTexto(texto);
    const linhas = texto.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);

    const obrigatorios = [
      { nome: 'Capa', rx: /\bcapa\b/ },
      { nome: 'Folha de Rosto', rx: /\bfolha\s+de\s+rosto\b/ },
      { nome: 'Folha de Aprovação', rx: /\bfolha\s+de\s+aprovacao\b/ },
      { nome: 'Resumo na língua vernácula', rx: /\bresumo\b(?!\s+em\s+lingua\s+estrangeira)/ },
      { nome: 'Resumo em língua estrangeira (Abstract)', rx: /\b(abstract|resumo\s+em\s+lingua\s+estrangeira|resumen|resume)\b/ },
      { nome: 'Sumário', rx: /\bsumario\b/ },
      { nome: 'Introdução', rx: /\bintroducao\b/ },
      { nome: 'Desenvolvimento', rx: /\b(desenvolvimento|referencial\s+teorico|revisao\s+de\s+literatura|revisao\s+bibliografica|fundamentacao\s+teorica|metodologia|resultados)\b/ },
      { nome: 'Conclusão', rx: /\b(conclusao|conclusoes|consideracoes\s+finais)\b/ },
      { nome: 'Referências', rx: /\breferencias?\b/ }
    ];

    const opcionais = [
      { nome: 'Lombada', rx: /\blombada\b/ },
      { nome: 'Errata', rx: /\berrata\b/ },
      { nome: 'Dedicatória', rx: /\bdedicatoria\b/ },
      { nome: 'Agradecimentos', rx: /\bagradecimentos?\b/ },
      { nome: 'Epígrafe', rx: /\bepigrafe\b/ },
      { nome: 'Lista de ilustrações', rx: /\blista\s+de\s+(ilustracoes|figuras|graficos|quadros)\b/ },
      { nome: 'Lista de tabelas', rx: /\blista\s+de\s+tabelas\b/ },
      { nome: 'Lista de abreviaturas e siglas', rx: /\blista\s+de\s+(abreviaturas|siglas)\b/ },
      { nome: 'Lista de símbolos', rx: /\blista\s+de\s+simbolos\b/ },
      { nome: 'Glossário', rx: /\bglossario\b/ },
      { nome: 'Apêndice', rx: /\bapendices?\b/ },
      { nome: 'Anexo', rx: /\banexos?\b/ },
      { nome: 'Índice', rx: /\bindice\b/ }
    ];

    const presentes = [];
    const faltantes = [];

    obrigatorios.forEach(function (el) {
      if (el.rx.test(textoNorm)) presentes.push(el.nome);
      else faltantes.push(el.nome);
    });

    const opcionaisEncontrados = opcionais
      .filter(function (el) { return el.rx.test(textoNorm); })
      .map(function (el) { return el.nome; });

    if (presentes.length > 0) {
      itens.push({
        nivel: 'OK',
        titulo: 'Elementos obrigatórios encontrados (' + presentes.length + ' de ' + obrigatorios.length + ')',
        detalhe: presentes.join(', ') + '.',
        referencia: 'Seção 1, pág. 6'
      });
    }

    if (faltantes.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Elementos obrigatórios faltando (' + faltantes.length + ')',
        detalhe: 'Inclua no seu TCC: ' + faltantes.join(', ') + '.',
        referencia: 'Seção 1, pág. 6'
      });
    }

    if (opcionaisEncontrados.length > 0) {
      itens.push({
        nivel: 'OK',
        titulo: 'Elementos opcionais identificados',
        detalhe: opcionaisEncontrados.join(', ') + '.',
        referencia: 'Seção 1, págs. 6–11'
      });
    }

    // Verifica se elementos pré-textuais estão numerados indevidamente no sumário
    const rxPreTextual =
      /\b(capa|folha\s+de\s+rosto|folha\s+de\s+aprovacao|errata|dedicatoria|agradecimentos?|epigrafe|resumo|abstract|lista\s+de\s+\w+|sumario)\b/;
    const preTextuaisNumerados = [];

    linhas.forEach(function (linha) {
      const norm = normalizarTexto(linha);
      if (/^\d+(?:\s+\d+)*\s+/.test(norm) && rxPreTextual.test(norm)) {
        preTextuaisNumerados.push(linha);
      }
    });

    if (preTextuaisNumerados.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Pré-textuais numerados no sumário',
        detalhe:
          'Detectado(s): "' + preTextuaisNumerados.join('"; "') +
          '". Os elementos pré-textuais não recebem numeração e NÃO devem constar no sumário.',
        referencia: 'Seção 1.14, pág. 10'
      });
    } else {
      itens.push({
        nivel: 'OK',
        titulo: 'Numeração de pré-textuais',
        detalhe: 'Nenhum elemento pré-textual apareceu numerado indevidamente.',
        referencia: 'Seção 1.14, pág. 10'
      });
    }

    return finalizarRelatorio(
      'estrutura',
      'Validação de Estrutura do TCC (Seção 1 — págs. 6–11)',
      itens,
      {
        obrigatoriosPresentes: presentes.length,
        obrigatoriosTotal: obrigatorios.length,
        faltantes: faltantes,
        opcionais: opcionaisEncontrados
      }
    );
  }

  function executarValidador(tipo, texto) {
    switch (tipo) {
      case 'resumo': return validarResumo(texto);
      case 'citacao': return validarCitacao(texto);
      case 'referencia': return validarReferencia(texto);
      case 'estrutura': return validarEstrutura(texto);
      default: return null;
    }
  }

  function formatarRelatorioTexto(relatorio) {
    const linhas = [
      relatorio.titulo,
      'Status geral: ' + relatorio.status +
      ' (' + relatorio.resumoContagem.ok + ' OK | ' +
      relatorio.resumoContagem.atencao + ' Atenção | ' +
      relatorio.resumoContagem.erro + ' Falta/Erro)',
      ''
    ];

    relatorio.itens.forEach(function (item) {
      const selo = item.nivel === 'OK' ? '[OK]' : (item.nivel === 'ATENCAO' ? '[ATENÇÃO]' : '[FALTA/ERRO]');
      linhas.push(selo + ' ' + item.titulo + ': ' + item.detalhe + ' (' + item.referencia + ')');
    });

    return linhas.join('\n');
  }

  // =========================================================================
  // FLUXO CONVERSACIONAL DO CHATBOT (Navegação + Busca BM25 + Validação)
  // =========================================================================

  function criarMemoriaInicial() {
    return {
      modoValidacao: null,
      capituloAtual: null,
      historico: []
    };
  }

  function detectarComandoValidacao(mensagemBruta) {
    const texto = String(mensagemBruta || '').trim();
    const rx =
      /^\/?(?:validar|verificar|checar|conferir|analisar)\s+(resumo|cita[cç][aã]o|refer[eê]ncia|estrutura(?:\s+do\s+tcc)?)(?:\s*[:\-]\s*([\s\S]+)|\s+([\s\S]{15,}))?$/i;
    const match = texto.match(rx);
    if (!match) return null;

    const tipoBruto = normalizarTexto(match[1]);
    let tipo = 'resumo';
    if (tipoBruto.startsWith('citac')) tipo = 'citacao';
    else if (tipoBruto.startsWith('refer')) tipo = 'referencia';
    else if (tipoBruto.startsWith('estru')) tipo = 'estrutura';

    const conteudo = (match[2] || match[3] || '').trim();
    return { tipo: tipo, conteudo: conteudo };
  }

  function detectarCapitulo(textoNormalizado, manual) {
    const limpo = textoNormalizado
      .replace(/\b(capitulo|cap|secao|ver|abrir|mostrar|sobre|do|da|de|tcc)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!limpo) return null;

    for (let i = 0; i < manual.capitulos.length; i++) {
      const cap = manual.capitulos[i];
      const titNorm = normalizarTexto(cap.titulo);
      const titCompNorm = normalizarTexto(cap.tituloCompleto);

      const apelidos = new Set([cap.id, cap.numero, titNorm, titCompNorm]);
      if (cap.id === 'estrutura') {
        apelidos.add('1 estrutura');
        apelidos.add('estrutura trabalho academico');
      } else if (cap.id === 'referencias') {
        apelidos.add('2 referencias');
        apelidos.add('referencia');
      } else if (cap.id === 'citacoes') {
        apelidos.add('3 citacoes');
        apelidos.add('citacao');
      } else if (cap.id === 'apresentacao') {
        apelidos.add('4 formatacao e paginacao');
        apelidos.add('4 formatacao');
        apelidos.add('formatacao e paginacao');
        apelidos.add('formatacao');
        apelidos.add('regras gerais de apresentacao');
        apelidos.add('apresentacao');
      }

      if (apelidos.has(textoNormalizado) || apelidos.has(limpo)) {
        return cap;
      }
    }

    return null;
  }

  function correspondeComandoSimples(textoNormalizado, lista, sinonimosPrep) {
    for (let i = 0; i < lista.length; i++) {
      const expr = lista[i];
      if (textoNormalizado === expr) return true;
      const rx = new RegExp('^(?:' + escaparRegex(expr) + ')\\s+(.+)$');
      const m = textoNormalizado.match(rx);
      if (m) {
        const resto = extrairRadicaisUnicos(m[1], sinonimosPrep).filter(function (rad) {
          return !RADICAIS_AUXILIARES.has(rad) &&
            !lista.some(function (e) { return gerarRadical(e) === rad; });
        });
        if (resto.length === 0) return true;
      }
    }
    return false;
  }

  function montarRespostaTopico(topico, relacionados) {
    const chips = (relacionados || []).map(function (t) { return t.titulo; });
    const texto =
      topico.titulo + ' (' + topico.paginas + ')\n\n' +
      topico.conteudo;

    return {
      tipo: 'topico',
      resposta: texto,
      secao: 'Seção ' + topico.secao,
      paginas: topico.paginas,
      exemplos: topico.exemplos || null,
      chips: chips,
      topicoId: topico.id
    };
  }

  function montarInstrucaoValidacao(tipo) {
    const instrucoes = {
      resumo:
        'Modo de validação de Resumo ativado (Seção 1.8 — págs. 8–9).\n' +
        'Cole abaixo o texto completo do seu resumo, incluindo a linha "Palavras-chave:".\n' +
        'Vou verificar: contagem de palavras (150 a 500), parágrafo único, formato das palavras-chave, 3ª pessoa do singular e os 4 elementos esperados.',
      citacao:
        'Modo de validação de Citação ativado (Seção 3 — págs. 32–39).\n' +
        'Cole abaixo o trecho citado com a chamada (ex.: (SILVA, 2020, p. 15)).\n' +
        'Vou verificar: classificação (direta curta, longa ou indireta), uso de aspas, CAIXA ALTA nos parênteses, página, supressão [...] e uso de apud.',
      referencia:
        'Modo de validação de Referência ativado (Seção 2 — págs. 12–31).\n' +
        'Cole abaixo a referência completa que deseja conferir.\n' +
        'Vou verificar: entrada em CAIXA ALTA, proibição de "Anônimo", separação de autores (;), ano de publicação, campos online ("Disponível em:" e "Acesso em:") e local/editora.',
      estrutura:
        'Modo de validação de Estrutura do TCC ativado (Seção 1 — págs. 6–11).\n' +
        'Cole abaixo o seu sumário ou a lista de elementos/seções do trabalho.\n' +
        'Vou conferir todos os 10 elementos obrigatórios da UDF, identificar opcionais e verificar se há pré-textuais numerados indevidamente.'
    };
    return instrucoes[tipo] || '';
  }

  /**
   * Processa uma mensagem do aluno no chatbot (navegação, busca BM25 ou validação).
   */
  function processarMensagem(mensagemBruta, indice, memoria) {
    const manual = indice.manual;
    const textoOriginal = typeof mensagemBruta === 'string' ? mensagemBruta : '';
    const truncada = textoOriginal.length > LIMITE_CARACTERES;
    const textoLimitado = textoOriginal.slice(0, LIMITE_CARACTERES).trim();
    const textoNormalizado = normalizarTexto(textoLimitado);

    // 1. Mensagem vazia
    if (!textoNormalizado) {
      return {
        tipo: 'aviso',
        intencao: 'vazia',
        resposta:
          'Digite sua dúvida sobre o Manual de TCC da UDF, clique em um dos 4 capítulos acima ou escolha uma das opções de validação.',
        chips: manual.capitulos.map(function (c) { return c.titulo; }),
        truncada: truncada
      };
    }

    // 2. Cancelar modo de validação ativo
    if (memoria && memoria.modoValidacao && EXPRESSOES_CANCELAR.includes(textoNormalizado)) {
      memoria.modoValidacao = null;
      return {
        tipo: 'aviso',
        intencao: 'cancelar_validacao',
        resposta: 'Modo de validação cancelado. Pode fazer uma pergunta ou escolher um capítulo do manual.',
        chips: manual.capitulos.map(function (c) { return c.titulo; }),
        truncada: false
      };
    }

    // 3. Comando explícito de validação (com ou sem texto inline)
    const cmdValidacao = detectarComandoValidacao(textoLimitado);
    if (cmdValidacao) {
      if (cmdValidacao.conteudo) {
        if (memoria) memoria.modoValidacao = null;
        const relatorio = executarValidador(cmdValidacao.tipo, cmdValidacao.conteudo);
        return {
          tipo: 'validacao',
          intencao: 'validar_' + cmdValidacao.tipo,
          resposta: formatarRelatorioTexto(relatorio),
          relatorio: relatorio,
          chips: [],
          truncada: truncada
        };
      } else {
        if (memoria) memoria.modoValidacao = cmdValidacao.tipo;
        return {
          tipo: 'modo_validacao',
          intencao: 'ativar_validacao_' + cmdValidacao.tipo,
          modoValidacao: cmdValidacao.tipo,
          resposta: montarInstrucaoValidacao(cmdValidacao.tipo),
          chips: [],
          truncada: false
        };
      }
    }

    // 4. Se está aguardando texto para validação (e não clicou em um capítulo)
    const capituloClicado = detectarCapitulo(textoNormalizado, manual);
    if (memoria && memoria.modoValidacao && !capituloClicado) {
      const modoAtual = memoria.modoValidacao;
      memoria.modoValidacao = null;
      const relatorioPendente = executarValidador(modoAtual, textoLimitado);
      return {
        tipo: 'validacao',
        intencao: 'validar_' + modoAtual,
        resposta: formatarRelatorioTexto(relatorioPendente),
        relatorio: relatorioPendente,
        chips: [],
        truncada: truncada
      };
    }

    // 5. Saudação, ajuda ou despedida
    if (correspondeComandoSimples(textoNormalizado, EXPRESSOES_SAUDACAO, indice.sinonimosPrep)) {
      return {
        tipo: 'conversa',
        intencao: 'saudacao',
        resposta:
          'Olá! Eu sou o Assistente do Manual de TCC da UDF (compilação das normas da ABNT, Brasília, 2020).\n\n' +
          'Você pode:\n' +
          '• Clicar em um dos 4 capítulos acima para navegar pelos tópicos.\n' +
          '• Digitar sua dúvida livremente (ex.: "qual o tamanho da margem?", "como citar mais de 3 autores?", "seção 3.4.2").\n' +
          '• Usar os botões de validação para conferir seu Resumo, Citação, Referência ou Estrutura do TCC.',
        chips: manual.capitulos.map(function (c) { return c.titulo; }),
        truncada: false
      };
    }

    if (correspondeComandoSimples(textoNormalizado, EXPRESSOES_AJUDA, indice.sinonimosPrep)) {
      return {
        tipo: 'conversa',
        intencao: 'ajuda',
        resposta:
          'Como usar o Assistente do Manual de TCC — UDF:\n' +
          '1. Navegue pelos 4 capítulos nos botões do topo (Estrutura, Referências, Citações, Formatação e Paginação).\n' +
          '2. Pergunte em texto livre ou busque pelo número da seção (ex.: "seção 1.8", "2.3.12", "3.4.2").\n' +
          '3. Valide trechos clicando em "Validar Resumo", "Validar Citação", "Validar Referência" ou "Validar Estrutura do TCC" — ou digitando diretamente "validar resumo: seu texto".',
        chips: manual.capitulos.map(function (c) { return c.titulo; }),
        truncada: false
      };
    }

    if (correspondeComandoSimples(textoNormalizado, EXPRESSOES_DESPEDIDA, indice.sinonimosPrep)) {
      return {
        tipo: 'conversa',
        intencao: 'despedida',
        resposta: 'Bom trabalho no seu TCC! Sempre que precisar consultar alguma norma da UDF ou validar um trecho, estarei por aqui.',
        chips: [],
        truncada: false
      };
    }

    // 6. Seleção de um dos 4 capítulos principais -> resumo + chips dos subtópicos
    if (capituloClicado) {
      if (memoria) {
        memoria.capituloAtual = capituloClicado.id;
        memoria.modoValidacao = null;
      }
      const subtopicos = manual.topicos.filter(function (t) {
        return t.capitulo === capituloClicado.id;
      });
      return {
        tipo: 'capitulo',
        intencao: 'ver_capitulo',
        capituloId: capituloClicado.id,
        resposta:
          capituloClicado.tituloCompleto + ' (' + capituloClicado.paginas + ')\n\n' +
          capituloClicado.resumo + '\n\n' +
          'Escolha um dos subtópicos abaixo ou digite sua dúvida específica:',
        chips: subtopicos.map(function (t) { return t.titulo; }),
        truncada: false
      };
    }

    // 7. Busca direta por número de seção (ex.: "3.4.2", "seção 1.8", "2.3.16")
    const topicoPorSecao = buscarPorNumeroSecao(textoLimitado, indice);
    if (topicoPorSecao) {
      const irmaos = manual.topicos
        .filter(function (t) { return t.capitulo === topicoPorSecao.capitulo && t.id !== topicoPorSecao.id; })
        .slice(0, MAX_RELACIONADOS);
      const resSecao = montarRespostaTopico(topicoPorSecao, irmaos);
      resSecao.intencao = 'busca_secao';
      resSecao.truncada = truncada;
      return resSecao;
    }

    // 8. Busca por correspondência exata de título de subtópico (clique em chip)
    const docTituloExato = indice.documentos.find(function (d) {
      return d.tituloNormalizado === textoNormalizado;
    });
    if (docTituloExato) {
      const irmaosTitulo = manual.topicos
        .filter(function (t) { return t.capitulo === docTituloExato.topico.capitulo && t.id !== docTituloExato.topico.id; })
        .slice(0, MAX_RELACIONADOS);
      const resTitulo = montarRespostaTopico(docTituloExato.topico, irmaosTitulo);
      resTitulo.intencao = 'busca_topico_exato';
      resTitulo.truncada = truncada;
      return resTitulo;
    }

    // 9. Busca lexical ranqueada BM25
    const radicais = extrairRadicaisUnicos(textoNormalizado, indice.sinonimosPrep);
    const resultados = buscarBM25(radicais, indice, textoNormalizado);
    const melhor = resultados[0] || null;

    if (melhor && melhor.bm25 >= LIMIAR_PARCIAL_BM25) {
      const relacionados = resultados
        .slice(1, MAX_RELACIONADOS + 1)
        .filter(function (r) { return r.bm25 >= LIMIAR_PARCIAL_BM25; })
        .map(function (r) { return r.topico; });

      const resBusca = montarRespostaTopico(melhor.topico, relacionados);
      resBusca.intencao = melhor.bm25 >= LIMIAR_FORTE_BM25 ? 'busca_forte' : 'busca_parcial';
      resBusca.bm25 = melhor.bm25;
      resBusca.cobertura = melhor.cobertura;
      resBusca.comuns = melhor.comuns;
      resBusca.truncada = truncada;

      if (melhor.bm25 < LIMIAR_FORTE_BM25) {
        resBusca.resposta =
          'Encontrei este tópico relacionado no Manual da UDF:\n\n' + resBusca.resposta;
      }
      return resBusca;
    }

    // 10. Não encontrado no Manual da UDF
    return {
      tipo: 'nao_encontrado',
      intencao: 'nao_encontrado',
      resposta:
        'Não encontrei uma regra correspondente no Manual de TCC da UDF (2020) para essa pergunta.\n\n' +
        'Tente reformular usando termos da ABNT (ex.: "margens", "resumo", "citação direta longa", "referência de site") ou escolha um dos 4 capítulos abaixo:',
      chips: manual.capitulos.map(function (c) { return c.titulo; }),
      truncada: truncada
    };
  }

  const BotTCC = {
    LIMITE_CARACTERES: LIMITE_CARACTERES,
    BM25_K1: BM25_K1,
    BM25_B: BM25_B,
    PESO_TITULO: PESO_TITULO,
    criarIndiceManual: criarIndiceManual,
    criarMemoriaInicial: criarMemoriaInicial,
    buscarBM25: buscarBM25,
    buscarPorNumeroSecao: buscarPorNumeroSecao,
    validarResumo: validarResumo,
    validarCitacao: validarCitacao,
    validarReferencia: validarReferencia,
    validarEstrutura: validarEstrutura,
    processarMensagem: processarMensagem
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = BotTCC;
  } else {
    escopoGlobal.BotTCC = BotTCC;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
