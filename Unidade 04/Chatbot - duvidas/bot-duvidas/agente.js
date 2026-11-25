/**
 * Assistente do Manual de TCC — UDF (2020).
 *
 * Motor 100% determinístico em JavaScript puro (sem IA generativa, sem API,
 * sem servidor e sem dependências externas).
 *
 * Funcionalidades integradas:
 *   1. Consulta ao Manual de TCC da UDF (2020) por navegação de capítulos/subtópicos
 *      ou busca textual ranqueada via Okapi BM25 com boost de 2.5x em título e seção.
 *   2. 5 Validadores determinísticos de trechos de TCC:
 *      - validarCruzamento(texto) — Citações × Referências (Seções 2.2, 3.1 e 3.5)
 *      - validarReferencia(texto) — Individual ou lista completa A–Z (Seções 1.15, 2.1, 2.2 e 2.4)
 *      - validarEstrutura(texto)  — Sumário, obrigatórios e numeração (Seções 1, 1.14, 1.17–1.18, 4.2.2–4.2.3)
 *      - validarCitacao(texto)    — Curta, longa, indireta e apud (Seção 3)
 *      - validarResumo(texto)     — Resumo (PT) e Abstract (EN) (Seções 1.8 e 1.9)
 *
 * Compatível com navegador (window.BotTCC) e Node.js (module.exports).
 */

(function (escopoGlobal) {
  'use strict';

  const LIMITE_CARACTERES = 15000;
  const BM25_K1 = 1.5;
  const BM25_B = 0.75;
  const PESO_TITULO = 2.5;
  const BONUS_TERMO_EXATO_TITULO = 2.0;
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

  function extrairPalavrasNormalizadasUnicas(textoNormalizado, sinonimosPrep) {
    let textoProc = String(textoNormalizado || '');
    if (sinonimosPrep) {
      sinonimosPrep.compostas.forEach(function (chave) {
        const rx = new RegExp('\\b' + escaparRegex(chave) + '\\b', 'g');
        textoProc = textoProc.replace(rx, sinonimosPrep.mapa[chave]);
      });
    }

    const palavras = textoProc ? textoProc.split(' ') : [];
    const unicas = [];

    function adicionar(palavra) {
      if (palavra && palavra.length >= 3 && !STOPWORDS.has(palavra) && !unicas.includes(palavra)) {
        unicas.push(palavra);
      }
    }

    palavras.forEach(function (palavra) {
      if (!palavra || STOPWORDS.has(palavra)) return;
      adicionar(palavra);
      const substituto = sinonimosPrep ? sinonimosPrep.mapa[palavra] : null;
      if (substituto) {
        substituto.split(' ').forEach(adicionar);
      }
    });

    return unicas;
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

      const tituloNormalizado = normalizarTexto(topico.titulo);
      const palavrasTitulo = new Set(
        tituloNormalizado.split(' ').filter(function (p) { return p.length >= 3 && !STOPWORDS.has(p); })
      );

      documentos.push({
        topico: topico,
        capitulo: cap || null,
        tituloNormalizado: tituloNormalizado,
        palavrasTitulo: palavrasTitulo,
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

  function buscarPorNumeroSecao(mensagemBruta, indice) {
    const match = String(mensagemBruta || '').match(/(?:^|\s|se[cç][aã]o\s+|item\s+|t[oó]pico\s+)(\d+(?:\.\d+){1,3})(?=\s|$|[.,?!:])/i);
    if (!match) return null;
    const codigo = match[1].trim();
    const encontrado = indice.documentos.find(function (doc) {
      return doc.secoesNormalizadas.includes(codigo) || doc.topico.secao === codigo;
    });
    return encontrado ? encontrado.topico : null;
  }

  function buscarBM25(radicaisPergunta, indice, textoNormalizado) {
    if (!indice || !indice.documentos.length || !radicaisPergunta.length) {
      return [];
    }

    const N = indice.totalDocumentos;
    const avgdl = indice.tamanhoMedio > 0 ? indice.tamanhoMedio : 1;
    const dfMap = indice.frequenciaDocumental;
    const palavrasPergunta = textoNormalizado
      ? extrairPalavrasNormalizadasUnicas(textoNormalizado, indice.sinonimosPrep)
      : [];
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

      // Peso adicional quando o termo normalizado da pergunta coincide exatamente com o título (antes do radical)
      if (doc.palavrasTitulo && palavrasPergunta.length > 0) {
        palavrasPergunta.forEach(function (palavra) {
          if (doc.palavrasTitulo.has(palavra)) {
            pontuacao += BONUS_TERMO_EXATO_TITULO;
            coincidiuTitulo = true;
          }
        });
      }

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
  // VALIDADORES DETERMINÍSTICOS DE TCC (Manual UDF 2020)
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

  // -------------------------------------------------------------------------
  // Helpers de parsing de Referências e Citações (usados por Cruzamento e Lote)
  // -------------------------------------------------------------------------

  function limparCabecalhoReferencias(texto) {
    return String(texto || '')
      .replace(/^\s*(?:#{1,3}\s*)?refer[eê]ncias(?:\s+bibliogr[aá]ficas)?\s*:?\s*\n+/i, '')
      .trim();
  }

  /**
   * Separa uma string contendo uma ou várias referências bibliográficas.
   * Suporta separação por linha em branco ou por novas linhas que iniciam nova entrada.
   */
  function separarListaReferencias(textoBruto) {
    const limpo = limparCabecalhoReferencias(String(textoBruto || '').replace(/\r\n/g, '\n').trim());
    if (!limpo) return [];

    // Se houver linhas em branco, cada bloco corresponde a uma referência
    if (/\n\s*\n+/.test(limpo)) {
      return limpo
        .split(/\n\s*\n+/)
        .map(function (bloco) {
          return bloco.replace(/\s*\n\s*/g, ' ').trim();
        })
        .filter(Boolean);
    }

    // Sem linhas em branco: agrupa quebras de continuação e inicia nova referência quando há nova entrada
    const linhas = limpo.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    if (linhas.length <= 1) return linhas;

    const entradas = [];
    const rxNovaEntrada = /^(?:_{3,}\.|(?:\d+[\s.)]+)?(?:(?:[OA]S?\s+)?[A-ZÀ-Ý0-9]{2,}|[Aa]n[oô]nim[oa]s?))/;

    linhas.forEach(function (linha) {
      if (entradas.length === 0 || rxNovaEntrada.test(linha)) {
        entradas.push(linha);
      } else {
        entradas[entradas.length - 1] += ' ' + linha;
      }
    });

    return entradas;
  }

  function normalizarChaveAutor(autor) {
    return String(autor || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extrairAnoPublicacaoReferencia(entrada) {
    // Desconsidera a parte de "Disponível em:" e "Acesso em:" para não pegar o ano de acesso
    const semAcesso = String(entrada || '').split(/\b(?:dispon[ií]vel\s+em|acesso\s+em)\s*:/i)[0];
    const rx = /(?:^|[\s,(\[])(?:[pc]?)(\d{4}[a-z]?)(?=[\s.,)\]]|$)/gi;
    let ultimoAno = null;
    let m;
    while ((m = rx.exec(semAcesso)) !== null) {
      ultimoAno = m[1].toLowerCase();
    }
    return ultimoAno;
  }

  function extrairAutorPrincipalReferencia(entrada, autorAnterior) {
    const semNum = String(entrada || '').replace(/^\d+[\s.)]+/, '').trim();

    // Traço sublinear (mesma autoria da referência anterior — Seção 2.2.1)
    if (/^_{3,}\./.test(semNum)) {
      const aposTraco = semNum.replace(/^_{3,}\.\s*/, '').trim();
      return {
        autorExibicao: autorAnterior || 'MESMA AUTORIA',
        autorChave: normalizarChaveAutor(autorAnterior || ''),
        ehTracoSublinear: true,
        restoAposAutor: aposTraco
      };
    }

    // Pessoa física: "SOBRENOME, Nome..." (pega primeiro autor antes de ";")
    const antesPontoVirgula = semNum.split(';')[0].trim();
    const matchPessoa = antesPontoVirgula.match(/^([A-ZÀ-Ý][A-ZÀ-Ý0-9\s'-]+),/);
    if (matchPessoa) {
      const sob = matchPessoa[1].trim();
      return {
        autorExibicao: sob,
        autorChave: normalizarChaveAutor(sob),
        ehTracoSublinear: false,
        restoAposAutor: semNum.slice(matchPessoa[0].length).trim()
      };
    }

    // Entidade / Jurisdição: "BRASIL. ...", "UNIVERSIDADE DE SÃO PAULO. ..."
    const matchEntidade = semNum.match(/^([A-ZÀ-Ý][A-ZÀ-Ý0-9\s\-()']+)\./);
    if (matchEntidade) {
      const ent = matchEntidade[1].replace(/\s*\([^)]*\)/g, '').trim();
      return {
        autorExibicao: ent,
        autorChave: normalizarChaveAutor(ent),
        ehTracoSublinear: false,
        restoAposAutor: semNum.slice(matchEntidade[0].length).trim()
      };
    }

    // Entrada pelo título (autor desconhecido): "DIAGNÓSTICO do..." ou "O CONGRESSO interrompido..."
    const matchTitulo = semNum.match(/^((?:[OA]S?\s+)?[A-ZÀ-Ý0-9\-']{2,})/);
    if (matchTitulo) {
      const tit = matchTitulo[1].trim();
      return {
        autorExibicao: tit,
        autorChave: normalizarChaveAutor(tit),
        ehTracoSublinear: false,
        restoAposAutor: semNum.slice(matchTitulo[0].length).trim()
      };
    }

    const primeiraPalavra = semNum.split(/[\s.,;]+/)[0] || '';
    return {
      autorExibicao: primeiraPalavra.toUpperCase(),
      autorChave: normalizarChaveAutor(primeiraPalavra),
      ehTracoSublinear: false,
      restoAposAutor: semNum
    };
  }

  function limparAutorCitacao(trechoAutor) {
    let limpo = String(trechoAutor || '')
      .split(';')[0]
      .replace(/\b(?:et\.?\s*al\.?|v\.|p\.|grifo\s+(?:nosso|do\s+autor)|org\.|coord\.|ed\.|comp\.)\b/gi, '')
      .replace(/\.{3}/g, '')
      .replace(/[\[\],;:]+/g, ' ')
      .trim();

    // Se houver jurisdição + órgão (ex.: "BRASIL. STF"), usa a jurisdição principal "BRASIL"
    if (/^[A-ZÀ-Ý][A-ZÀ-Ý\s]+\.\s+[A-ZÀ-Ý]+/.test(limpo)) {
      limpo = limpo.split('.')[0].trim();
    }

    // Remove inicial isolada no final (ex.: "BARBOSA C" -> "BARBOSA")
    limpo = limpo.replace(/\s+[A-ZÀ-Ý]\.?$/, '').trim();

    return {
      exibicao: limpo.toUpperCase(),
      chave: normalizarChaveAutor(limpo)
    };
  }

  function extrairCitacoesTexto(texto) {
    const citacoes = [];
    const chavesVistas = new Set();
    let temApud = false;

    function registrar(autorExib, autorChave, ano, origemApud) {
      if (!autorChave || !ano) return;
      const chaveUnica = autorChave + '|' + ano.toLowerCase();
      if (!chavesVistas.has(chaveUnica)) {
        chavesVistas.add(chaveUnica);
        citacoes.push({
          autorExibicao: autorExib.toUpperCase(),
          autorChave: autorChave,
          ano: ano.toLowerCase(),
          viaApud: Boolean(origemApud)
        });
      }
    }

    // 1. Chamadas entre parênteses: (SILVA, 2020), (SILVA; SOUZA, 2020, p. 15), (VIANNA, 1986 apud SEGATTO, 1995)
    const rxPar = /\(([^()]*(?:\[\d{4}[a-z]?\]|\b\d{4}[a-z]?\b)[^()]*)\)/g;
    let matchPar;
    while ((matchPar = rxPar.exec(texto)) !== null) {
      const conteudo = matchPar[1].trim();
      const indiceInicioPar = matchPar.index;
      const temApudAqui = /\bapud\b/i.test(conteudo);

      if (temApudAqui) {
        temApud = true;
        // Pela ABNT, somente a obra após "apud" (a efetivamente consultada) deve estar nas Referências
        const ladoConsultado = conteudo.split(/\bapud\b/i).pop().trim();
        const matchAnoApud = ladoConsultado.match(/\[?(\d{4})([a-z]?)\]?([a-z])?/i);
        if (matchAnoApud) {
          const anoApud = (matchAnoApud[1] + (matchAnoApud[2] || matchAnoApud[3] || '')).toLowerCase();
          const autorParte = ladoConsultado.slice(0, matchAnoApud.index).trim();
          const autorLimpo = limparAutorCitacao(autorParte);
          registrar(autorLimpo.exibicao, autorLimpo.chave, anoApud, true);
        }
        continue;
      }

      // Verifica se há múltiplas obras no mesmo parêntese separadas por ";" (cada qual com seu ano)
      const segmentos = conteudo.split(';');
      const segmentosComAno = segmentos.filter(function (s) { return /(?:\[\d{4}[a-z]?\]|\b\d{4}[a-z]?\b)/.test(s); });
      const blocosObra = segmentosComAno.length > 1 ? segmentos : [conteudo];

      blocosObra.forEach(function (bloco) {
        const b = bloco.trim();
        const mAno = b.match(/\[?(\d{4})([a-z]?)\]?([a-z])?/i);
        if (!mAno) return;
        const ano = (mAno[1] + (mAno[2] || mAno[3] || '')).toLowerCase();
        const antesAno = b.slice(0, mAno.index).replace(/[\s,;:[\]]+$/g, '').trim();

        if (antesAno) {
          const autorLimpo = limparAutorCitacao(antesAno);
          registrar(autorLimpo.exibicao, autorLimpo.chave, ano, false);
        } else {
          // Chamada narrativa: autor está logo antes de "("
          const trechoAntes = texto.slice(Math.max(0, indiceInicioPar - 75), indiceInicioPar);
          const clausula = trechoAntes.split(/[.!?;:\n]/).pop().trim();
          let autorNarrativo = null;

          // Ex.: "Silva et al."
          const mEtAl = clausula.match(/([A-ZÀ-Ý][a-zà-ÿ'-]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ'-]+)?)\s+et\.?\s+al\.?\s*$/);
          // Ex.: "Oliveira e Leonardos"
          const mDois = clausula.match(/([A-ZÀ-Ý][a-zà-ÿ'-]+(?:\s+(?:de|da|do|dos|das)\s+[A-ZÀ-Ý][a-zà-ÿ'-]+)?)\s+e\s+[A-ZÀ-Ý][a-zà-ÿ'-]+\s*$/);
          // Ex.: "Segundo Silva" ou "Souza Neto" ou "Authier-Reiriz"
          const mUm = clausula.match(/([A-ZÀ-Ý][a-zà-ÿ'-]+(?:\s+(?:de|da|do|dos|das|Neto|Junior|Júnior|Filho|[A-ZÀ-Ý][a-zà-ÿ'-]+))*)\s*$/);

          if (mEtAl) {
            autorNarrativo = mEtAl[1];
          } else if (mDois) {
            autorNarrativo = mDois[1];
          } else if (mUm) {
            autorNarrativo = mUm[1];
          }

          if (autorNarrativo) {
            autorNarrativo = autorNarrativo
              .replace(/^(?:Segundo|Conforme|Para|Como|De acordo com|Nos dizeres de|Segundo os dados de|Segundo o estudo de|De|Por|Em|A|O|Os|As)\s+/i, '')
              .trim();
          }

          if (autorNarrativo) {
            const autorLimpo = limparAutorCitacao(autorNarrativo);
            registrar(autorLimpo.exibicao, autorLimpo.chave, ano, false);
          }
        }
      });
    }

    return {
      citacoes: citacoes,
      temApud: temApud
    };
  }

  function autoresCoincidem(chaveCit, chaveRef) {
    if (!chaveCit || !chaveRef) return false;
    if (chaveCit === chaveRef) return true;
    if (chaveRef.startsWith(chaveCit + ' ') || chaveCit.startsWith(chaveRef + ' ')) return true;

    const pCit = chaveCit.split(' ')[0];
    const pRef = chaveRef.split(' ')[0];
    if (pCit.length >= 3 && pCit === pRef) return true;

    // Sigla institucional comum (ex.: ABNT <-> Associacao Brasileira de Normas Tecnicas)
    const iniciaisRef = chaveRef
      .split(' ')
      .filter(function (p) { return p.length > 2 && !['dos', 'das', 'para'].includes(p); })
      .map(function (p) { return p[0]; })
      .join('');
    if (chaveCit.length >= 3 && chaveCit === iniciaisRef) return true;

    return false;
  }

  /**
   * 1. Validador: Cruzar Citações × Referências (Seções 2.2, 3.1 e 3.5)
   */
  function validarCruzamento(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Texto vazio',
        detalhe: 'Cole o trecho com citações, escreva "REFERÊNCIAS" em uma linha separada e cole a lista de referências logo abaixo.',
        referencia: 'Seções 2.2 e 3.1'
      });
      return finalizarRelatorio('cruzamento', 'Cruzamento Citações × Referências (Seções 2.2, 3.1 e 3.5)', itens, {});
    }

    // Divide texto principal e lista de referências por "REFERÊNCIAS" ou "---"
    let parteTexto = '';
    let parteRefs = '';

    const matchCabRef = texto.match(/(?:^|\n)\s*(?:#{1,3}\s*)?refer[eê]ncias(?:\s+bibliogr[aá]ficas)?\s*:?\s*(?:\n|$)/i);
    const matchTracos = texto.match(/(?:^|\n)\s*-{3,}\s*(?:\n|$)/);

    if (matchCabRef) {
      parteTexto = texto.slice(0, matchCabRef.index).trim();
      parteRefs = texto.slice(matchCabRef.index + matchCabRef[0].length).trim();
    } else if (matchTracos) {
      parteTexto = texto.slice(0, matchTracos.index).trim();
      parteRefs = texto.slice(matchTracos.index + matchTracos[0].length).trim();
    }

    if (!parteTexto || !parteRefs) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Separação entre texto e referências não encontrada',
        detalhe:
          'Para cruzar citações com referências, cole o trecho do seu TCC, escreva uma linha contendo apenas "REFERÊNCIAS" (ou "---") e cole a lista de referências abaixo.',
        referencia: 'Seções 2.2 e 3.1'
      });
      return finalizarRelatorio('cruzamento', 'Cruzamento Citações × Referências (Seções 2.2, 3.1 e 3.5)', itens, {});
    }

    // Verifica mistura de sistema Autor-Data e Numérico no texto
    const extracaoCit = extrairCitacoesTexto(parteTexto);
    const citacoes = extracaoCit.citacoes;
    const temNumericoNoTexto = /[¹²³⁴⁵⁶⁷⁸⁹⁰]|\(\d{1,3}\)|\[\d{1,3}\]/.test(parteTexto);

    if (citacoes.length > 0 && temNumericoNoTexto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Mistura de sistemas de chamada (Autor-Data e Numérico)',
        detalhe: 'Foram detectadas citações Autor-Data e chamadas numéricas no mesmo texto. O manual proíbe usar ambos concomitantemente.',
        referencia: 'Seção 3.1, pág. 32'
      });
    }

    // Extrai todas as entradas da lista de referências (tratando traço sublinear)
    const entradasRefs = separarListaReferencias(parteRefs);
    const refsExtraidas = [];
    let autorAnterior = '';

    entradasRefs.forEach(function (entrada, idx) {
      const infoAutor = extrairAutorPrincipalReferencia(entrada, autorAnterior);
      if (!infoAutor.ehTracoSublinear && infoAutor.autorExibicao) {
        autorAnterior = infoAutor.autorExibicao;
      }
      const ano = extrairAnoPublicacaoReferencia(entrada);
      refsExtraidas.push({
        indice: idx + 1,
        texto: entrada,
        autorExibicao: infoAutor.autorExibicao,
        autorChave: infoAutor.autorChave,
        ano: ano || 's.d.',
        citada: false
      });
    });

    if (citacoes.length === 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Nenhuma citação Autor-Data identificada no texto',
        detalhe: 'Não foram encontradas chamadas no padrão Autor-Data (ex.: (SILVA, 2020) ou Segundo Silva (2020)) antes da seção REFERÊNCIAS.',
        referencia: 'Seção 3.1.1, pág. 32'
      });
    }

    const citacoesEncontradas = [];
    const citacoesAusentes = [];

    citacoes.forEach(function (cit) {
      let casou = false;
      refsExtraidas.forEach(function (ref) {
        if (ref.ano === cit.ano && autoresCoincidem(cit.autorChave, ref.autorChave)) {
          ref.citada = true;
          casou = true;
        }
      });
      if (casou) citacoesEncontradas.push(cit);
      else citacoesAusentes.push(cit);
    });

    const refsNaoCitadas = refsExtraidas.filter(function (r) { return !r.citada; });

    if (citacoes.length > 0) {
      if (citacoesEncontradas.length > 0) {
        itens.push({
          nivel: 'OK',
          titulo: 'Correspondência Citações × Referências',
          detalhe:
            citacoesEncontradas.length + ' de ' + citacoes.length +
            ' citação(ões) conferem com a lista de referências.',
          referencia: 'Seções 2.2 e 3.1'
        });
      }

      if (citacoesAusentes.length > 0) {
        const listaAusentes = citacoesAusentes.map(function (c) {
          return c.autorExibicao + ', ' + c.ano;
        }).join('; ');
        itens.push({
          nivel: 'ERRO',
          titulo: 'Citações ausentes na lista de Referências (' + citacoesAusentes.length + ')',
          detalhe: 'Inclua nas Referências: ' + listaAusentes + '.',
          referencia: 'Seção 3, pág. 32'
        });
      }
    }

    if (extracaoCit.temApud) {
      itens.push({
        nivel: 'OK',
        titulo: 'Regra de "apud" aplicada',
        detalhe: 'Em citações com "apud", foi conferida na lista de referências apenas a obra efetivamente consultada (autor/ano após "apud").',
        referencia: 'Seção 3.5, pág. 38'
      });
    }

    if (refsNaoCitadas.length > 0) {
      const listaSobras = refsNaoCitadas.map(function (r) {
        return r.autorExibicao + ', ' + r.ano;
      }).join('; ');
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Referências não citadas no trecho colado (' + refsNaoCitadas.length + ')',
        detalhe:
          'Sem citação correspondente neste trecho: ' + listaSobras +
          '. Lembre-se de que no TCC completo toda obra listada nas Referências deve ter sido citada no texto.',
        referencia: 'Seção 2.2, pág. 15'
      });
    } else if (refsExtraidas.length > 0 && citacoes.length > 0) {
      itens.push({
        nivel: 'OK',
        titulo: 'Nenhuma referência sobrando',
        detalhe: 'Todas as ' + refsExtraidas.length + ' referências da lista foram citadas no trecho.',
        referencia: 'Seção 2.2, pág. 15'
      });
    }

    return finalizarRelatorio(
      'cruzamento',
      'Cruzamento Citações × Referências (Seções 2.2, 3.1 e 3.5)',
      itens,
      {
        totalCitacoes: citacoes.length,
        totalReferencias: refsExtraidas.length,
        correspondencias: citacoesEncontradas.length,
        ausentes: citacoesAusentes.map(function (c) { return c.autorExibicao + ', ' + c.ano; }),
        naoCitadas: refsNaoCitadas.map(function (r) { return r.autorExibicao + ', ' + r.ano; })
      }
    );
  }

  /**
   * 2. Validador de Resumo e Abstract (Seções 1.8 e 1.9 — págs. 8–9)
   */
  function detectarIdiomaResumo(texto) {
    if (/(?:^|\n)\s*key[\s-]?words\s*:/i.test(texto) || /^\s*abstract\s*\n+/i.test(texto)) {
      return 'en';
    }
    const norm = normalizarTexto(texto);
    const palavras = norm ? norm.split(' ') : [];
    const termosEn = new Set([
      'the', 'this', 'study', 'paper', 'research', 'and', 'with', 'from', 'that',
      'were', 'was', 'are', 'results', 'method', 'methodology', 'conclusion', 'findings', 'aims', 'analysis'
    ]);
    const termosPt = new Set([
      'este', 'esta', 'trabalho', 'estudo', 'pesquisa', 'para', 'com', 'dos', 'das',
      'que', 'uma', 'resultados', 'conclusao', 'metodologia', 'objetivo', 'analise', 'palavras'
    ]);

    let pontosEn = 0;
    let pontosPt = 0;
    palavras.forEach(function (p) {
      if (termosEn.has(p)) pontosEn += 1;
      if (termosPt.has(p)) pontosPt += 1;
    });

    return (pontosEn > pontosPt && pontosEn >= 3) ? 'en' : 'pt';
  }

  function validarResumo(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Texto vazio',
        detalhe: 'Cole o texto do Resumo (com Palavras-chave:) ou Abstract (com Keywords:) para realizar a validação.',
        referencia: 'Seções 1.8 e 1.9, págs. 8–9'
      });
      return finalizarRelatorio('resumo', 'Validação de Resumo / Abstract (Seções 1.8 e 1.9)', itens, { totalPalavras: 0 });
    }

    const idioma = detectarIdiomaResumo(texto);
    const ehIngles = idioma === 'en';
    const tituloRelatorio = ehIngles
      ? 'Validação de Abstract — Língua Estrangeira (Seções 1.8 e 1.9 — págs. 8–9)'
      : 'Validação de Resumo (Seção 1.8 — págs. 8–9)';
    const refSecao = ehIngles ? 'Seções 1.8 e 1.9, pág. 9' : 'Seção 1.8, pág. 9';

    // Separa corpo da linha Palavras-chave: ou Keywords:
    const rxChaves = ehIngles
      ? /(?:^|\n)\s*(key[\s-]?words\s*:[\s\S]*)$/i
      : /(?:^|\n)\s*(palavras[\s-]?chave\s*:[\s\S]*)$/i;
    const matchPc = texto.match(rxChaves);
    let corpo = matchPc ? texto.slice(0, matchPc.index).trim() : texto;
    const linhaPalavrasChave = matchPc ? matchPc[1].trim() : '';

    corpo = corpo.replace(/^(?:resumo|abstract)\s*\n+/i, '').trim();

    // 1) Contagem de palavras (150 a 500)
    const palavras = corpo.match(/[a-zA-ZÀ-ÿ0-9]+(?:[-'][a-zA-ZÀ-ÿ0-9]+)*/g) || [];
    const totalPalavras = palavras.length;

    if (totalPalavras >= 150 && totalPalavras <= 500) {
      itens.push({
        nivel: 'OK',
        titulo: ehIngles ? 'Extensão do Abstract' : 'Extensão do resumo',
        detalhe: totalPalavras + ' palavras — dentro da faixa exigida (150 a 500 palavras).',
        referencia: refSecao
      });
    } else if (totalPalavras < 150) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Extensão abaixo do mínimo',
        detalhe:
          totalPalavras + ' palavras encontradas. Faltam ' + (150 - totalPalavras) +
          ' palavras para atingir o mínimo de 150 palavras.',
        referencia: refSecao
      });
    } else {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Extensão acima do máximo',
        detalhe:
          totalPalavras + ' palavras encontradas. Sobram ' + (totalPalavras - 500) +
          ' palavras acima do limite máximo de 500 palavras.',
        referencia: refSecao
      });
    }

    // 2) Parágrafo único
    const paragrafos = corpo.split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (paragrafos.length <= 1) {
      itens.push({
        nivel: 'OK',
        titulo: 'Parágrafo único',
        detalhe: 'O corpo do texto está estruturado em parágrafo único.',
        referencia: refSecao
      });
    } else {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Múltiplos parágrafos detectados',
        detalhe:
          'Foram encontrados ' + paragrafos.length +
          ' parágrafos antes das palavras-chave. O manual recomenda o uso de parágrafo único.',
        referencia: refSecao
      });
    }

    // 3) Palavras-chave: / Keywords: separadas e finalizadas por ponto
    const rotuloChave = ehIngles ? 'Keywords:' : 'Palavras-chave:';
    if (!linhaPalavrasChave) {
      itens.push({
        nivel: 'ERRO',
        titulo: ehIngles ? 'Keywords ausentes' : 'Palavras-chave ausentes',
        detalhe: 'Falta incluir a expressão "' + rotuloChave + '" logo abaixo do texto, com termos separados e finalizados por ponto.',
        referencia: refSecao
      });
    } else {
      const conteudoPc = linhaPalavrasChave.replace(/^(?:palavras[\s-]?chave|key[\s-]?words)\s*:/i, '').trim();
      const usaSeparadorIncorreto = /[;,]/.test(conteudoPc);
      const terminaComPonto = /\.$/.test(conteudoPc);
      const termosPc = conteudoPc.split('.').map(function (t) { return t.trim(); }).filter(Boolean);

      if (!conteudoPc || termosPc.length === 0) {
        itens.push({
          nivel: 'ERRO',
          titulo: ehIngles ? 'Keywords vazias' : 'Palavras-chave vazias',
          detalhe: 'Informe os termos após "' + rotuloChave + '", separados e finalizados por ponto.',
          referencia: refSecao
        });
      } else if (usaSeparadorIncorreto) {
        itens.push({
          nivel: 'ERRO',
          titulo: ehIngles ? 'Separador incorreto em Keywords' : 'Separador incorreto em Palavras-chave',
          detalhe: ehIngles
            ? 'Use ponto final (.) para separar e finalizar as Keywords — evite vírgula ou ponto e vírgula. Ex.: Keywords: Academic work. ABNT standards. Methodology.'
            : 'Use ponto final (.) para separar e finalizar as palavras-chave — evite vírgula ou ponto e vírgula. Ex.: Palavras-chave: Direito. Metodologia. ABNT.',
          referencia: refSecao
        });
      } else if (!terminaComPonto) {
        itens.push({
          nivel: 'ERRO',
          titulo: ehIngles ? 'Ponto final ausente em Keywords' : 'Ponto final ausente em Palavras-chave',
          detalhe: 'Os termos em "' + rotuloChave + '" devem ser finalizados também por ponto final.',
          referencia: refSecao
        });
      } else {
        itens.push({
          nivel: 'OK',
          titulo: ehIngles ? 'Keywords padronizadas' : 'Palavras-chave padronizadas',
          detalhe: 'Expressão "' + rotuloChave + '" presente com ' + termosPc.length + ' termo(s) separados e finalizados por ponto.',
          referencia: refSecao
        });
      }
    }

    // 4) Voz ativa na 3ª pessoa (sem 1ª pessoa em PT ou EN)
    const ocorrencias1p = [];
    if (ehIngles) {
      if (/\bI\b/.test(corpo)) ocorrencias1p.push('I');
      const rx1pEn = /\b(we|my|our|ours|me|us|myself|ourselves)\b/gi;
      let mEn;
      while ((mEn = rx1pEn.exec(corpo)) !== null) {
        const t = mEn[0].toLowerCase();
        if (!ocorrencias1p.includes(t)) ocorrencias1p.push(t);
      }
    } else {
      const rx1pPt =
        /(?:^|[^a-zA-ZÀ-ÿ])(eu|nós|meu|meus|minha|minhas|nosso|nossos|nossa|nossas|conosco|fiz|fizemos|desenvolvi|desenvolvemos|apresento|apresentamos|concluo|concluí|concluímos|analisei|analisamos|realizei|realizamos|estudei|estudamos|pesquisei|pesquisamos|investiguei|investigamos|propus|propusemos|busquei|buscamos|observei|observamos|verifiquei|verificamos)(?![a-zA-ZÀ-ÿ])/gi;
      let mPt;
      while ((mPt = rx1pPt.exec(corpo)) !== null) {
        const t = mPt[1].toLowerCase();
        if (!ocorrencias1p.includes(t)) ocorrencias1p.push(t);
      }
    }

    if (ocorrencias1p.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Uso de 1ª pessoa detectado',
        detalhe: ehIngles
          ? 'Termos encontrados: "' + ocorrencias1p.join('", "') + '". Prefira a 3ª pessoa / voz impessoal (ex.: "This study analyzes...", "It is concluded that...").'
          : 'Termos encontrados: "' + ocorrencias1p.join('", "') + '". O manual exige verbos na voz ativa e na 3ª pessoa do singular (ex.: "Este trabalho analisa...", "Conclui-se que...").',
        referencia: refSecao
      });
    } else {
      itens.push({
        nivel: 'OK',
        titulo: 'Pessoa verbal adequada',
        detalhe: 'Não foram detectados termos em 1ª pessoa; compatível com a 3ª pessoa do singular.',
        referencia: refSecao
      });
    }

    // 5) Presença dos 4 elementos esperados (objetivo, método, resultados, conclusão)
    const corpoNorm = normalizarTexto(corpo);
    const elementosEsperados = ehIngles
      ? [
          { nome: 'objective/aim', rx: /\b(objective\w*|aim\w*|purpose\w*|goal\w*|analy[sz]\w*|investigat\w*|evaluat\w*|propos\w*|examin\w*|explor\w*|study)\b/ },
          { nome: 'method/methodology', rx: /\b(method\w*|approach\w*|research|bibliograph\w*|case study|survey|questionnaire|interview\w*|qualitative|quantitative|procedure\w*|experiment\w*|documentary|systematic|review)\b/ },
          { nome: 'results/findings', rx: /\b(result\w*|finding\w*|evidenc\w*|show\w*|demonstrat\w*|indicat\w*|reveal\w*|identif\w*|data|observ\w*|outcome\w*)\b/ },
          { nome: 'conclusion', rx: /\b(conclu\w*|therefore|thus|finally|in summary|overall|contributes?\s+to|suggests?\s+that)\b/ }
        ]
      : [
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
        titulo: ehIngles ? 'Elementos de conteúdo do Abstract' : 'Elementos de conteúdo do resumo',
        detalhe: ehIngles
          ? 'Identificados indícios dos 4 pilares: objective, method, results e conclusion.'
          : 'Identificados indícios de objetivo, método/metodologia, resultados e conclusão.',
        referencia: refSecao
      });
    } else {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Possíveis elementos ausentes',
        detalhe:
          'Não foram detectados termos indicativos de: ' + faltantes.join(', ') +
          '. O texto deve ressaltar objetivo, método, resultados e conclusões.',
        referencia: refSecao
      });
    }

    return finalizarRelatorio(
      'resumo',
      tituloRelatorio,
      itens,
      { idioma: idioma, totalPalavras: totalPalavras, paragrafos: paragrafos.length }
    );
  }

  /**
   * 3. Validador de Citação (Seção 3 — págs. 32–39)
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

    const rxChamadaParenteses = /\(([^()]*(?:\[\d{4}[a-z]?\]|\b\d{4}[a-z]?\b)[^()]*)\)/g;
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
      const chamada = chamadasParenteses[chamadasParenteses.length - 1];
      const temAno = /\b\d{4}[a-z]?\b/.test(chamada);
      const parteAntesAno = chamada.split(/\b\d{4}/)[0].replace(/[\[\],;:\s]+$/g, '').trim();

      if (parteAntesAno) {
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
   * 4. Validador de Referências — Individual ou Lista Completa A–Z (Seções 1.15, 2.1, 2.2 e 2.4)
   */
  function auditarReferenciaIndividual(entrada) {
    const texto = String(entrada || '').replace(/^\d+[\s.)]+/, '').trim();
    const problemas = [];
    const alertas = [];
    const okChecks = [];

    // 1) Proibição de "Anônimo"
    if (/\ban[oô]nim[oa]s?\b/i.test(texto)) {
      problemas.push({
        titulo: 'Uso proibido do termo "Anônimo"',
        detalhe: 'O manual proíbe usar "Anônimo" como autor. Quando a autoria for desconhecida, faça a entrada diretamente pela primeira palavra do título em MAIÚSCULAS.',
        referencia: 'Seção 2.1.3, pág. 14'
      });
    }

    // 2) Entrada inicial em CAIXA ALTA (ou traço sublinear ______)
    const entradaValida =
      /^(?:_{3,}\.|(?:[OA]S?\s+)?[A-ZÀ-Ý0-9][A-ZÀ-Ý0-9\-']+(?:\s+[A-ZÀ-Ý0-9\-']+)*\s*(?:,|\.|(?:\s+[a-zà-ÿ])))/.test(texto);

    if (entradaValida) {
      okChecks.push({
        titulo: 'Entrada em CAIXA ALTA',
        detalhe: 'A referência inicia com entrada em maiúsculas (sobrenome, entidade, primeira palavra do título ou traço sublinear).',
        referencia: 'Seção 2.1, págs. 12–14'
      });
    } else {
      problemas.push({
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
      problemas.push({
        titulo: 'Separador de autores incorreto',
        detalhe: 'Separe dois ou três autores com ponto e vírgula seguido de espaço (; ), e não com "e" ou "&". Ex.: LAKATOS, Eva Maria; MARCONI, Marina de Andrade.',
        referencia: 'Seção 2.1.1, pág. 12'
      });
    } else if (usaPontoVirgulaAutores) {
      okChecks.push({
        titulo: 'Múltiplos autores separados por ";"',
        detalhe: 'Autores separados corretamente por ponto e vírgula.',
        referencia: 'Seção 2.1.1, pág. 12'
      });
    }

    // 4) Ano de publicação
    const rxAno = /(?:^|[\s,(\[])(?:[pc]?\d{4}[a-z]?|\d{4}\s+ou\s+\d{4}|entre\s+\d{4}\s+e\s+\d{4}|ca\.\s*\d{4}|\d{3}-\??|\d{2}--\??)(?=[\s.,)\]]|$)/i;
    if (rxAno.test(texto)) {
      okChecks.push({
        titulo: 'Ano de publicação presente',
        detalhe: 'Data de publicação identificada na referência.',
        referencia: 'Seção 2.4.3, pág. 30'
      });
    } else {
      problemas.push({
        titulo: 'Ano de publicação ausente',
        detalhe: 'A data é elemento essencial. Caso não apareça na obra, registre uma data aproximada entre colchetes, ex.: [2020?] ou [ca. 2018].',
        referencia: 'Seção 2.4.3, pág. 30'
      });
    }

    // 5) Documentos online (URL)
    const temUrl = /(?:https?:\/\/|www\.)\S+/i.test(texto);
    if (temUrl) {
      const temDisponivel = /\bdispon[ií]vel\s+em\s*:/i.test(texto);
      const temAcesso = /\bacesso\s+em\s*:/i.test(texto);
      const temDataAcessoAbreviada =
        /\bacesso\s+em\s*:\s*\d{1,2}\s+(?:jan\.|fev\.|mar\.|abr\.|maio|jun\.|jul\.|ago\.|set\.|out\.|nov\.|dez\.)\s+\d{4}/i.test(texto);

      if (!temDisponivel) {
        problemas.push({
          titulo: 'Falta "Disponível em:"',
          detalhe: 'Referências com link/URL devem apresentar a expressão "Disponível em:" antes do endereço eletrônico.',
          referencia: 'Seções 2.3.2, 2.3.4 e 2.3.12'
        });
      }

      if (!temAcesso) {
        problemas.push({
          titulo: 'Falta "Acesso em:"',
          detalhe: 'Referências online exigem a data de consulta no formato "Acesso em: dia mês abreviado ano" (ex.: Acesso em: 24 out. 2026).',
          referencia: 'Seções 2.3.2, 2.3.4 e 2.3.12'
        });
      } else if (!temDataAcessoAbreviada) {
        alertas.push({
          titulo: 'Formato da data em "Acesso em:"',
          detalhe: 'Use dia, mês abreviado com ponto (exceto maio) e ano com 4 dígitos. Ex.: Acesso em: 24 out. 2026.',
          referencia: 'Seções 2.3.2 e 2.3.12'
        });
      }

      if (temDisponivel && temDataAcessoAbreviada) {
        okChecks.push({
          titulo: 'Campos de documento online válidos',
          detalhe: 'Expressões "Disponível em:" e "Acesso em:" com data abreviada estão corretas.',
          referencia: 'Seções 2.3.2 e 2.3.12'
        });
      }
    }

    // 6) Local e editora
    const temLocalEditora =
      /(?:^|[.\n]\s*)\[?[A-ZÀ-Ý][A-Za-zÀ-ÿ\s.\[\]-]{1,40}\]?\s*:\s*(?:[A-Za-zÀ-ÿ]{1,4}\.\s*)*[^,.\n]{1,60}(?:(?:\s*[A-Za-zÀ-ÿ]{1,4}\.)+\s*[^,.\n]{0,40})*,\s*(?:\[?[pc]?\d{4}|\[ca\.|\[entre)/.test(texto) ||
      /\[S\.l\.?\]|\[s\.n\.?\]|\[S\.l\.?:\s*s\.n\.?\]/i.test(texto);
    const ehTipoSemEditoraTradicional =
      temUrl || /\b(v\.\s*\d+|n\.\s*\d+|lei\s+n\.|decreto|constitui[cç][aã]o|s[uú]mula|processo\s+n\.|trabalho\s+de\s+conclus[aã]o|disserta[cç][aã]o|tese)\b/i.test(texto);

    if (temLocalEditora) {
      okChecks.push({
        titulo: 'Local e editora identificados',
        detalhe: 'Indicação de local e editora (ou [S.l.]/[s.n.]) presente na referência.',
        referencia: 'Seções 2.4.1 e 2.4.2, págs. 29–30'
      });
    } else if (!ehTipoSemEditoraTradicional) {
      alertas.push({
        titulo: 'Verifique Local e Editora',
        detalhe: 'Não foi identificado o padrão "Cidade: Editora, ano". Se não constarem na obra, use [S.l.] para local desconhecido e [s.n.] para editora desconhecida.',
        referencia: 'Seções 2.4.1 e 2.4.2, págs. 29–30'
      });
    }

    return { problemas: problemas, alertas: alertas, okChecks: okChecks, temUrl: temUrl };
  }

  function validarReferencia(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Texto vazio',
        detalhe: 'Cole uma referência bibliográfica ou a lista completa de referências que deseja validar.',
        referencia: 'Seção 2, págs. 12–31'
      });
      return finalizarRelatorio('referencia', 'Validação de Referência (Seção 2 — págs. 12–31)', itens, {});
    }

    const entradas = separarListaReferencias(texto);

    // MODO INDIVIDUAL (1 referência)
    if (entradas.length <= 1) {
      const unica = entradas[0] || texto;
      const aud = auditarReferenciaIndividual(unica);

      aud.problemas.forEach(function (p) {
        itens.push({ nivel: 'ERRO', titulo: p.titulo, detalhe: p.detalhe, referencia: p.referencia });
      });
      aud.alertas.forEach(function (a) {
        itens.push({ nivel: 'ATENCAO', titulo: a.titulo, detalhe: a.detalhe, referencia: a.referencia });
      });
      aud.okChecks.forEach(function (o) {
        itens.push({ nivel: 'OK', titulo: o.titulo, detalhe: o.detalhe, referencia: o.referencia });
      });

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
        { modoLista: false, online: aud.temUrl }
      );
    }

    // MODO LISTA COMPLETA (2+ referências em lote)
    const qtdNumeradas = entradas.filter(function (e) { return /^\d+[\s.)]+/.test(e); }).length;
    const listaNumerica = qtdNumeradas === entradas.length;
    const misturaNumeracao = qtdNumeradas > 0 && qtdNumeradas < entradas.length;

    if (misturaNumeracao) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Mistura de entradas numeradas e não numeradas',
        detalhe: 'Adote apenas um padrão em toda a lista: Sistema Alfabético (sem números) ou Sistema Numérico (todas numeradas em ordem de citação).',
        referencia: 'Seção 2.2, pág. 15'
      });
    } else if (listaNumerica) {
      itens.push({
        nivel: 'OK',
        titulo: 'Sistema Numérico identificado (' + entradas.length + ' itens)',
        detalhe: 'Todas as referências estão numeradas; garanta que sigam a ordem de citação no texto e que não haja notas explicativas no rodapé.',
        referencia: 'Seção 2.2.2, págs. 15–16'
      });
    }

    // Verificação de ordem alfabética (Seção 2.2.1), tratando traço sublinear ______.
    const errosOrdem = [];
    if (!listaNumerica) {
      let autorAnterior = '';
      let autorCompletoAnterior = '';
      let chaveAnterior = '';
      let rotuloAnterior = '';

      entradas.forEach(function (entrada, idx) {
        const semNum = entrada.replace(/^\d+[\s.)]+/, '').trim();
        const info = extrairAutorPrincipalReferencia(semNum, autorAnterior);

        let chaveOrdenacao;
        let rotuloAtual = semNum.slice(0, 42) + (semNum.length > 42 ? '...' : '');

        if (info.ehTracoSublinear) {
          if (idx === 0) {
            itens.push({
              nivel: 'ERRO',
              titulo: 'Traço sublinear na 1ª referência',
              detalhe: 'O traço sublinear (______.) só pode ser usado a partir da segunda obra de uma mesma autoria.',
              referencia: 'Seção 2.2.1, pág. 15'
            });
            chaveOrdenacao = normalizarTexto(info.restoAposAutor);
          } else {
            const baseAutor = autorCompletoAnterior || autorAnterior;
            chaveOrdenacao = normalizarTexto(baseAutor) + ' ' + normalizarTexto(info.restoAposAutor);
            rotuloAtual = autorAnterior + ' (______. ' + info.restoAposAutor.slice(0, 24) + '...)';
          }
        } else {
          autorAnterior = info.autorExibicao;
          const mAutorComp = semNum.match(/^(.+?)\.(?:\s+(?!(?:[A-ZÀ-Ý]\.|et\s+al\.|al\.))|$)/);
          autorCompletoAnterior = mAutorComp ? mAutorComp[1].trim() : info.autorExibicao;
          chaveOrdenacao = normalizarTexto(semNum);
        }

        if (idx > 0 && chaveOrdenacao.localeCompare(chaveAnterior, 'pt-BR') < 0) {
          errosOrdem.push('"' + rotuloAtual + '" deveria vir antes de "' + rotuloAnterior + '"');
        }

        chaveAnterior = chaveOrdenacao;
        rotuloAnterior = rotuloAtual;
      });

      if (errosOrdem.length === 0) {
        itens.push({
          nivel: 'OK',
          titulo: 'Ordem alfabética (' + entradas.length + ' referências)',
          detalhe: 'Todas as entradas estão ordenadas corretamente de A a Z.',
          referencia: 'Seção 2.2.1, pág. 15'
        });
      } else {
        itens.push({
          nivel: 'ERRO',
          titulo: 'Referência(s) fora de ordem alfabética (' + errosOrdem.length + ')',
          detalhe: errosOrdem.join('; ') + '.',
          referencia: 'Seção 2.2.1, pág. 15'
        });
      }
    }

    // Verificação de duplicatas
    const vistas = new Map();
    const duplicatas = [];
    entradas.forEach(function (entrada, idx) {
      const chave = normalizarTexto(entrada.replace(/^\d+[\s.)]+/, ''));
      if (vistas.has(chave)) {
        const inicio = entrada.slice(0, 45) + (entrada.length > 45 ? '...' : '');
        duplicatas.push('Item ' + (idx + 1) + ' repete o item ' + vistas.get(chave) + ' ("' + inicio + '")');
      } else {
        vistas.set(chave, idx + 1);
      }
    });

    if (duplicatas.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Referências duplicadas (' + duplicatas.length + ')',
        detalhe: duplicatas.join('; ') + '.',
        referencia: 'Seção 2.2, pág. 15'
      });
    } else {
      itens.push({
        nivel: 'OK',
        titulo: 'Sem duplicatas',
        detalhe: 'Nenhuma referência repetida foi encontrada na lista.',
        referencia: 'Seção 2.2, pág. 15'
      });
    }

    // Auditoria individual em lote
    const resumoErrosLote = [];
    const resumoAlertasLote = [];

    entradas.forEach(function (entrada, idx) {
      const aud = auditarReferenciaIndividual(entrada);
      const rotulo = 'Item ' + (idx + 1) + ' ("' + entrada.slice(0, 32) + (entrada.length > 32 ? '...' : '') + '")';
      if (aud.problemas.length > 0) {
        resumoErrosLote.push(
          rotulo + ': ' + aud.problemas.map(function (p) { return p.titulo; }).join(', ')
        );
      }
      if (aud.alertas.length > 0) {
        resumoAlertasLote.push(
          rotulo + ': ' + aud.alertas.map(function (a) { return a.titulo; }).join(', ')
        );
      }
    });

    if (resumoErrosLote.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Desvios nas referências da lista (' + resumoErrosLote.length + ' item(ns))',
        detalhe: resumoErrosLote.join(' | ') + '.',
        referencia: 'Seções 2.1, 2.3 e 2.4'
      });
    } else {
      itens.push({
        nivel: 'OK',
        titulo: 'Auditoria individual das referências',
        detalhe: 'Todas as ' + entradas.length + ' referências passaram nas verificações obrigatórias (entrada em CAIXA ALTA, ano, autores e URLs).',
        referencia: 'Seções 2.1, 2.3 e 2.4'
      });
    }

    if (resumoAlertasLote.length > 0) {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Pontos de atenção em itens da lista (' + resumoAlertasLote.length + ')',
        detalhe: resumoAlertasLote.join(' | ') + '.',
        referencia: 'Seções 2.3 e 2.4'
      });
    }

    itens.push({
      nivel: 'OK',
      titulo: 'Formatação da lista',
      detalhe: 'Mantenha alinhamento à margem esquerda, espaço simples dentro de cada item e 1 linha em branco separando as referências.',
      referencia: 'Seção 1.15 e Seção 2, págs. 10 e 12'
    });

    return finalizarRelatorio(
      'referencia',
      'Validação de Lista de Referências (' + entradas.length + ' itens — Seção 2)',
      itens,
      {
        modoLista: true,
        totalReferencias: entradas.length,
        errosOrdem: errosOrdem,
        duplicatas: duplicatas
      }
    );
  }

  /**
   * 5. Validador de Sumário e Estrutura do TCC (Seções 1, 1.14, 1.17–1.18, 4.2.2–4.2.3)
   */
  function validarEstrutura(textoBruto) {
    const texto = String(textoBruto || '').replace(/\r\n/g, '\n').trim();
    const itens = [];

    if (!texto) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Lista vazia',
        detalhe: 'Cole seu sumário ou a lista de elementos/seções do seu TCC para conferir o checklist obrigatório e a numeração.',
        referencia: 'Seção 1, pág. 6'
      });
      return finalizarRelatorio('estrutura', 'Validação de Sumário e Estrutura do TCC (Seção 1 — págs. 6–11)', itens, {});
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

    // Análise linha a linha de numeração progressiva, separadores, títulos sem número e Apêndice/Anexo
    const rxPreTextual =
      /\b(capa|folha\s+de\s+rosto|folha\s+de\s+aprovacao|errata|dedicatoria|agradecimentos?|epigrafe|resumo|abstract|lista\s+de\s+\w+|sumario)\b/;
    const rxPosTextualSemNumero = /\b(referencias?|glossario|apendices?|anexos?|indice)\b/;

    const preTextuaisNumerados = [];
    const semIndicativoNumerados = [];
    const separadoresInvalidos = [];
    const saltosNumeracao = [];
    const errosApendiceAnexo = [];
    const avisosApendiceAnexo = [];

    const ultimoPorPai = {};
    let totalSecoesNumeradasTextuais = 0;

    linhas.forEach(function (linha) {
      const norm = normalizarTexto(linha);

      // 1) Formato de APÊNDICE e ANEXO (Seções 1.17 e 1.18)
      if (/\b(?:ap[eê]ndice|anexo)\b/i.test(linha)) {
        if (/\b(?:ap[eê]ndice|anexo)\s+\d+/i.test(linha)) {
          errosApendiceAnexo.push('"' + linha + '"');
        } else if (/\b(?:ap[eê]ndice|anexo)\s+[A-Za-z]\s+[^–—-]/i.test(linha)) {
          avisosApendiceAnexo.push('"' + linha + '"');
        }
      }

      // 2) Linhas iniciadas por indicativo numérico
      const matchNum = linha.match(/^(\d+(?:\.\d+)*)(\s*[.)\-–—]\s*|\s+)(.+)$/);
      if (!matchNum) return;

      const codigoSecao = matchNum[1];
      const separador = matchNum[2];
      const tituloLinhaNorm = normalizarTexto(matchNum[3]);

      if (rxPreTextual.test(tituloLinhaNorm)) {
        preTextuaisNumerados.push(linha);
        return;
      }

      if (rxPosTextualSemNumero.test(tituloLinhaNorm)) {
        semIndicativoNumerados.push(linha);
        return;
      }

      totalSecoesNumeradasTextuais += 1;

      // Verifica separador após o indicativo numérico (Seção 4.2.2: apenas espaço, sem ".", "-" ou ")")
      if (/[.)\-–—]/.test(separador)) {
        separadoresInvalidos.push('"' + linha + '"');
      }

      // Verifica saltos na numeração progressiva (ex.: 1 -> 3 ou 2.1 -> 2.3)
      const partes = codigoSecao.split('.').map(function (n) { return parseInt(n, 10); });
      const pai = partes.slice(0, -1).join('.');
      const atual = partes[partes.length - 1];
      const esperado = (ultimoPorPai[pai] || 0) + 1;

      if (atual > esperado) {
        const anterior = ultimoPorPai[pai]
          ? (pai ? pai + '.' + ultimoPorPai[pai] : String(ultimoPorPai[pai]))
          : (pai ? pai + '.0' : 'início');
        saltosNumeracao.push('salto de "' + anterior + '" para "' + codigoSecao + '"');
      }

      ultimoPorPai[pai] = atual;
      // Limpa contadores de subníveis quando uma seção pai avança
      const prefixoSub = codigoSecao + '.';
      Object.keys(ultimoPorPai).forEach(function (chave) {
        if (chave === codigoSecao || chave.startsWith(prefixoSub)) {
          delete ultimoPorPai[chave];
        }
      });
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

    if (semIndicativoNumerados.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Títulos sem indicativo numérico numerados',
        detalhe:
          'Detectado(s): "' + semIndicativoNumerados.join('"; "') +
          '". Referências, Glossário, Apêndice, Anexo e Índice não recebem número e devem ser centralizados.',
        referencia: 'Seção 4.2.3, pág. 41'
      });
    }

    if (saltosNumeracao.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Saltos na numeração progressiva',
        detalhe: 'Inconsistência encontrada: ' + saltosNumeracao.join('; ') + '.',
        referencia: 'Seção 4.2.2, pág. 41 (NBR 6024)'
      });
    } else if (totalSecoesNumeradasTextuais > 0) {
      itens.push({
        nivel: 'OK',
        titulo: 'Sequência de numeração progressiva',
        detalhe: 'Seções numeradas em ordem progressiva sem saltos.',
        referencia: 'Seção 4.2.2, pág. 41'
      });
    }

    if (separadoresInvalidos.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Separador incorreto após indicativo numérico',
        detalhe:
          'Encontrado em ' + separadoresInvalidos.join(', ') +
          '. Separe o número do título apenas por um espaço de caractere, sem ponto, hífen ou parêntese (ex.: 1 INTRODUÇÃO, 2.1 METODOLOGIA).',
        referencia: 'Seção 4.2.2, pág. 41'
      });
    }

    if (errosApendiceAnexo.length > 0) {
      itens.push({
        nivel: 'ERRO',
        titulo: 'Formato incorreto de Apêndice/Anexo',
        detalhe:
          'Encontrado em ' + errosApendiceAnexo.join(', ') +
          '. Apêndices e Anexos devem ser identificados por letras maiúsculas consecutivas e travessão (ex.: APÊNDICE A – Questionário, ANEXO A – Resolução).',
        referencia: 'Seções 1.17 e 1.18, pág. 11'
      });
    } else if (avisosApendiceAnexo.length > 0) {
      itens.push({
        nivel: 'ATENCAO',
        titulo: 'Travessão em Apêndice/Anexo',
        detalhe:
          'Em ' + avisosApendiceAnexo.join(', ') +
          ', separe a letra maiúscula do título com travessão (ex.: APÊNDICE A – Título).',
        referencia: 'Seções 1.17 e 1.18, pág. 11'
      });
    }

    return finalizarRelatorio(
      'estrutura',
      'Validação de Sumário e Estrutura do TCC (Seção 1 — págs. 6–11)',
      itens,
      {
        obrigatoriosPresentes: presentes.length,
        obrigatoriosTotal: obrigatorios.length,
        faltantes: faltantes,
        opcionais: opcionaisEncontrados,
        saltosNumeracao: saltosNumeracao,
        separadoresInvalidos: separadoresInvalidos
      }
    );
  }

  function executarValidador(tipo, texto) {
    switch (tipo) {
      case 'cruzamento': return validarCruzamento(texto);
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
  // FLUXO CONVERSACIONAL DO CHATBOT (Navegação + Busca BM25 + 5 Validadores)
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
      /^\/?(?:validar|verificar|checar|conferir|analisar|cruzar)\s+(cruzamento|cita[cç][oõ]es\s*(?:x|×|e)?\s*refer[eê]ncias|resumo(?:\s+e\s+abstract)?|abstract|cita[cç][aã]o|refer[eê]ncias?|sum[aá]rio(?:\s+e\s+estrutura)?|estrutura(?:\s+do\s+tcc)?)(?:\s*[:\-]\s*([\s\S]+)|\s+([\s\S]{15,}))?$/i;
    const match = texto.match(rx);
    if (!match) return null;

    const tipoBruto = normalizarTexto(match[1]);
    let tipo = 'resumo';
    if (tipoBruto.startsWith('cruzam') || tipoBruto.includes('citacoes')) tipo = 'cruzamento';
    else if (tipoBruto.startsWith('citac')) tipo = 'citacao';
    else if (tipoBruto.startsWith('refer')) tipo = 'referencia';
    else if (tipoBruto.startsWith('estru') || tipoBruto.startsWith('sumar')) tipo = 'estrutura';
    else if (tipoBruto.startsWith('resum') || tipoBruto.startsWith('abstr')) tipo = 'resumo';

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
      cruzamento:
        'Modo de Cruzamento Citações × Referências ativado (Seções 2.2, 3.1 e 3.5).\n' +
        'Cole abaixo o trecho do seu TCC com as citações, adicione uma linha contendo apenas "REFERÊNCIAS" (ou "---") e cole a lista de referências logo em seguida.\n' +
        'Vou verificar: citações ausentes nas referências, referências não citadas, regra de "apud" e mistura de sistemas de chamada.',
      referencia:
        'Modo de validação de Referências ativado (Seções 1.15, 2.1, 2.2 e 2.4).\n' +
        'Cole abaixo uma referência individual ou a lista completa de referências.\n' +
        'Vou verificar: entrada em CAIXA ALTA, proibição de "Anônimo", autores (;), ano, campos online ("Disponível em:" e "Acesso em:"), ordem alfabética A–Z, traço sublinear e duplicatas.',
      estrutura:
        'Modo de validação de Sumário e Estrutura ativado (Seções 1, 1.14, 1.17–1.18 e 4.2.2–4.2.3).\n' +
        'Cole abaixo o seu sumário ou a lista de elementos/seções do trabalho.\n' +
        'Vou conferir: os 10 elementos obrigatórios, opcionais, pré-textuais numerados, títulos sem número, saltos de numeração, separadores e formato de Apêndice/Anexo.',
      citacao:
        'Modo de validação de Citação ativado (Seção 3 — págs. 32–39).\n' +
        'Cole abaixo o trecho citado com a chamada (ex.: (SILVA, 2020, p. 15)).\n' +
        'Vou verificar: classificação (direta curta, longa ou indireta), aspas, CAIXA ALTA nos parênteses, página, supressão [...] e uso de apud.',
      resumo:
        'Modo de validação de Resumo e Abstract ativado (Seções 1.8 e 1.9 — págs. 8–9).\n' +
        'Cole abaixo o seu Resumo em português (com "Palavras-chave:") ou Abstract em inglês (com "Keywords:").\n' +
        'Vou detectar o idioma automaticamente e verificar: 150 a 500 palavras, parágrafo único, pontuação das palavras-chave, ausência de 1ª pessoa e os 4 pilares do conteúdo.'
    };
    return instrucoes[tipo] || '';
  }

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
          'Digite sua dúvida sobre o Manual de TCC da UDF, clique em um dos 4 capítulos ou escolha um dos 5 validadores na barra lateral.',
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
          '• Navegar pelos 4 capítulos do manual na barra lateral.\n' +
          '• Digitar sua dúvida livremente (ex.: "qual o tamanho da margem?", "como citar mais de 3 autores?", "seção 3.4.2").\n' +
          '• Usar os 5 validadores de TCC para conferir Citações × Referências, Referências (individual ou lista A–Z), Sumário e Estrutura, Citação ou Resumo e Abstract.',
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
          '1. Navegue pelos 4 capítulos na barra lateral (Estrutura, Referências, Citações, Formatação e Paginação).\n' +
          '2. Pergunte em texto livre ou busque pelo número da seção (ex.: "seção 1.8", "2.3.12", "3.4.2").\n' +
          '3. Valide trechos pelos 5 validadores da barra lateral ou usando comandos diretos como "validar cruzamento: ...", "validar referencia: ...", "validar resumo: ...", "validar citacao: ..." ou "validar estrutura: ...".',
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

    // 7. Busca direta por número de seção
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
        'Tente reformular usando termos da ABNT (ex.: "margens", "resumo", "citação direta longa", "referência de site") ou navegue pelos capítulos na barra lateral.',
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
    validarCruzamento: validarCruzamento,
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
