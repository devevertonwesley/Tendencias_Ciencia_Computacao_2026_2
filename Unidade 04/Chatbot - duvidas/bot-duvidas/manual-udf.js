/**
 * Base oficial de regras do Manual de TCC — UDF (2020).
 *
 * Fonte exclusiva:
 *   BIBLIOTECA GOVERNADOR EURICO REZENDE (UDF). Manual para elaboração de trabalhos
 *   acadêmicos: compilação das normas da ABNT. Brasília: UDF, 2020.
 *
 * Compatível com navegador (window.MANUAL_UDF) e Node.js (module.exports).
 */

const MANUAL_UDF = {
  metadados: {
    titulo: 'Manual para Elaboração de Trabalhos Acadêmicos: compilação das normas da ABNT',
    instituicao: 'Centro Universitário do Distrito Federal – UDF',
    organizacao: 'Biblioteca Governador Eurico Rezende',
    local: 'Brasília',
    ano: 2020,
    normas: [
      'ABNT NBR 6023:2018 (Referências)',
      'ABNT NBR 6024:2003 (Numeração progressiva)',
      'ABNT NBR 6027:2003 (Sumário)',
      'ABNT NBR 6028:2003 (Resumo)',
      'ABNT NBR 6034:2004 (Índice)',
      'ABNT NBR 10520:2002 (Citações)',
      'ABNT NBR 12225:2004 (Lombada)',
      'ABNT NBR 14724:2011 (Trabalhos acadêmicos)'
    ]
  },

  /**
   * Sinônimos acadêmicos e termos comuns da ABNT para ampliar a busca BM25.
   * Chaves em minúsculas e sem acentos.
   */
  sinonimos: {
    'abstract': 'resumo lingua estrangeira',
    'resumen': 'resumo lingua estrangeira',
    'margem': 'margens formato',
    'margens': 'margens formato',
    'espaco': 'espacamento',
    'espacamento': 'espacamento entrelinhas',
    'entrelinhas': 'espacamento',
    'letra': 'fonte tamanho',
    'fontes': 'fonte tamanho',
    'tamanho fonte': 'fonte tamanho formato',
    'papel': 'formato a4',
    'numero pagina': 'paginacao',
    'numeracao': 'paginacao',
    'numerar': 'paginacao',
    'paginas': 'paginacao',
    'site': 'home page sites',
    'sites': 'home page sites',
    'pagina web': 'home page sites',
    'internet': 'online disponivel acesso',
    'url': 'online disponivel acesso',
    'link': 'online disponivel acesso',
    'livro': 'livro referencia',
    'livros': 'livro referencia',
    'capitulo': 'capitulo livro',
    'lei': 'legislacao',
    'leis': 'legislacao',
    'decreto': 'legislacao',
    'constituicao': 'legislacao constituicoes emendas',
    'emenda': 'legislacao constituicoes emendas',
    'codigo civil': 'legislacao',
    'codigo penal': 'legislacao',
    'sumula': 'jurisprudencia',
    'acordao': 'jurisprudencia',
    'stf': 'jurisprudencia',
    'sentenca': 'jurisprudencia',
    'tcc': 'trabalho academico',
    'monografia': 'trabalho academico',
    'dissertacao': 'trabalho academico',
    'tese': 'trabalho academico',
    'revista': 'artigo periodico',
    'artigo cientifico': 'artigo periodico',
    'congresso': 'trabalho evento',
    'seminario': 'trabalho evento',
    'anais': 'trabalho evento',
    'ebook': 'e books',
    'ebooks': 'e books',
    'livro digital': 'e books',
    'filme': 'filme cinematografico',
    'dvd': 'filme cinematografico',
    'musica': 'documento sonoro',
    'cd': 'documento sonoro',
    'audio': 'documento sonoro',
    'fotografia': 'ilustracao',
    'imagem': 'ilustracao',
    'figura': 'ilustracao',
    'nbr': 'norma tecnica',
    'abnt': 'norma tecnica',
    'et al': 'mais tres autores pessoa fisica',
    'mais de 3 autores': 'mais tres autores pessoa fisica',
    'mais de tres autores': 'mais tres autores pessoa fisica',
    'quatro autores': 'mais tres autores pessoa fisica',
    'organizador': 'pessoa fisica organizador',
    'empresa': 'pessoa juridica entidade',
    'orgao': 'pessoa juridica entidade',
    'anonimo': 'autor desconhecido',
    'sem autor': 'autor desconhecido',
    'sem local': 'dados desconhecidos local publicacao',
    'sem cidade': 'dados desconhecidos local publicacao',
    'sem editora': 'dados desconhecidos editora',
    'sem data': 'dados desconhecidos ano publicacao',
    'sem ano': 'dados desconhecidos ano publicacao',
    'apud': 'citacao de citacao apud',
    'citado por': 'citacao de citacao apud',
    'recuo': 'citacao direta longa',
    '4 cm': 'citacao direta longa',
    'mais de 3 linhas': 'citacao direta longa',
    'mais de tres linhas': 'citacao direta longa',
    'ate 3 linhas': 'citacao direta curta',
    'ate tres linhas': 'citacao direta curta',
    'aspas': 'citacao direta curta',
    'parafrase': 'citacao indireta',
    'grifo': 'enfase destaque grifo',
    'negrito': 'enfase destaque grifo',
    'reticencias': 'supressao colchetes',
    'colchetes': 'supressao interpolacao',
    'idem': 'notas rodape referencia',
    'ibidem': 'notas rodape referencia',
    'op cit': 'notas rodape referencia',
    'rodape': 'notas rodape',
    'bibliografia': 'referencias',
    'ficha catalografica': 'folha rosto catalogacao',
    'catalogacao': 'folha rosto catalogacao',
    'banca': 'folha aprovacao',
    'obrigatorios': 'estrutura obrigatorios opcionais',
    'opcionais': 'estrutura obrigatorios opcionais',
    'pre textuais': 'estrutura pre textuais',
    'pos textuais': 'estrutura pos textuais',
    'palavras chave': 'resumo lingua vernacula'
  },

  capitulos: [
    {
      id: 'estrutura',
      numero: '1',
      titulo: '1. Estrutura do TCC',
      tituloCompleto: '1 Estrutura do Trabalho Acadêmico',
      paginas: 'págs. 6–11',
      resumo:
        'Define a organização do trabalho acadêmico em Parte Externa (Capa e Lombada) e Parte Interna (elementos pré-textuais, textuais e pós-textuais), indicando o que é obrigatório e opcional segundo o Manual da UDF.'
    },
    {
      id: 'referencias',
      numero: '2',
      titulo: '2. Referências',
      tituloCompleto: '2 Referências (ABNT NBR 6023:2018)',
      paginas: 'págs. 12–31',
      resumo:
        'Reúne as regras de entrada de autoria (pessoa física, jurídica e desconhecida), ordenação alfabética e numérica, os 20 modelos oficiais de documentos (livros, artigos, sites, leis, TCCs etc.) e o tratamento de dados desconhecidos.'
    },
    {
      id: 'citacoes',
      numero: '3',
      titulo: '3. Citações',
      tituloCompleto: '3 Citações (ABNT NBR 10520)',
      paginas: 'págs. 32–39',
      resumo:
        'Explica os sistemas de chamada (Autor-Data e Numérico), notas de rodapé (referência e explicativas), citação indireta, citação direta curta e longa, citação de citação (apud), supressão, interpolação e destaque.'
    },
    {
      id: 'apresentacao',
      numero: '4',
      titulo: '4. Formatação e Paginação',
      tituloCompleto: '4 Regras Gerais de Apresentação (ABNT NBR 14724)',
      paginas: 'págs. 40–41',
      resumo:
        'Estabelece o padrão de papel A4, margens, tamanho de fonte, espaçamento entre linhas, filete das notas de rodapé, indicativos de seção, títulos centralizados e regras de contagem e numeração das páginas.'
    }
  ],

  /**
   * Todos os tópicos e subtópicos extraídos fielmente do MANUAL-TCC.pdf (UDF, 2020).
   */
  topicos: [
    // =========================================================================
    // CAPÍTULO 1 — ESTRUTURA DO TRABALHO ACADÊMICO (págs. 6–11)
    // =========================================================================
    {
      id: '1-visao-geral',
      capitulo: 'estrutura',
      secao: '1',
      secoes: ['1'],
      titulo: '1 Estrutura: Obrigatórios e Opcionais',
      paginas: 'pág. 6',
      conteudo:
        'A estrutura de trabalhos acadêmicos compreende Parte Externa e Parte Interna (subdividida em elementos pré-textuais, textuais e pós-textuais).\n\n' +
        'PARTE EXTERNA:\n' +
        '• Obrigatório: Capa.\n' +
        '• Opcional: Lombada.\n\n' +
        'PARTE INTERNA — Elementos pré-textuais:\n' +
        '• Obrigatórios: Folha de Rosto, Folha de Aprovação, Resumo na língua vernácula, Resumo em língua estrangeira e Sumário.\n' +
        '• Opcionais: Errata, Dedicatória, Agradecimentos, Epígrafe, Lista de ilustrações, Lista de tabelas, Lista de abreviaturas e siglas e Lista de símbolos.\n\n' +
        'PARTE INTERNA — Elementos textuais (todos obrigatórios):\n' +
        '• Introdução, Desenvolvimento e Conclusão.\n\n' +
        'PARTE INTERNA — Elementos pós-textuais:\n' +
        '• Obrigatório: Referências.\n' +
        '• Opcionais: Glossário, Apêndice, Anexo e Índice.',
      exemplos:
        'Ordem sequencial no TCC:\n' +
        'Capa* → Lombada → Folha de Rosto* → Errata → Folha de Aprovação* → Dedicatória → Agradecimentos → Epígrafe → Resumo* → Resumo em língua estrangeira* → Listas → Sumário* → Introdução* → Desenvolvimento* → Conclusão* → Referências* → Glossário → Apêndice → Anexo → Índice.\n' +
        '(* elementos obrigatórios)'
    },
    {
      id: '1-1-capa',
      capitulo: 'estrutura',
      secao: '1.1',
      secoes: ['1.1'],
      titulo: '1.1 Capa',
      paginas: 'pág. 7',
      conteudo:
        'Elemento obrigatório (Parte Externa). As informações devem ser apresentadas exatamente na seguinte ordem:\n' +
        'a) nome da instituição;\n' +
        'b) nome do autor;\n' +
        'c) título;\n' +
        'd) subtítulo: se houver, deve ser precedido de dois pontos (:), evidenciando sua subordinação ao título;\n' +
        'e) local (cidade) da instituição onde deve ser apresentado;\n' +
        'f) ano de depósito.',
      exemplos:
        'CENTRO UNIVERSITÁRIO DO DISTRITO FEDERAL – UDF\n' +
        'Nome Completo do Autor\n\n' +
        'TÍTULO DO TRABALHO: subtítulo se houver\n\n' +
        'Brasília\n' +
        '2020'
    },
    {
      id: '1-2-folha-rosto',
      capitulo: 'estrutura',
      secao: '1.2',
      secoes: ['1.2'],
      titulo: '1.2 Folha de Rosto',
      paginas: 'pág. 7',
      conteudo:
        'Elemento obrigatório. No verso deve conter os dados de catalogação na publicação (ficha catalográfica), conforme o Código de Catalogação Anglo-Americano vigente.\n\n' +
        'No anverso (página da frente) devem constar as seguintes informações:\n' +
        'a) nome do autor;\n' +
        'b) título;\n' +
        'c) subtítulo (se houver);\n' +
        'd) natureza: tipo de trabalho (trabalho de conclusão de curso, tese, dissertação etc.), objetivo (aprovação em disciplina, grau pretendido etc.), nome da instituição a que é submetido e área de concentração (digitada em espaço simples);\n' +
        'e) nome do orientador e, se houver, do coorientador;\n' +
        'f) local (cidade) da instituição;\n' +
        'g) ano de depósito.',
      exemplos:
        'Natureza (exemplo em espaço simples):\n' +
        'Trabalho de Conclusão de Curso apresentado ao Curso de Ciência da Computação do Centro Universitário do Distrito Federal – UDF, como requisito parcial para obtenção do grau de Bacharel.\n' +
        'Orientador: Prof. Dr. Nome do Orientador.'
    },
    {
      id: '1-3-errata',
      capitulo: 'estrutura',
      secao: '1.3',
      secoes: ['1.3'],
      titulo: '1.3 Errata',
      paginas: 'pág. 7',
      conteudo:
        'Elemento opcional. É uma lista dos erros ocorridos no texto, seguidos das devidas correções. Deve ser inserida logo após a folha de rosto, constituída pela referência do trabalho e pelo texto da errata. É apresentada em papel avulso ou encartado, acrescida no trabalho depois de impresso.',
      exemplos:
        'ERRATA\n' +
        'FERRARI, A. Título do trabalho. 2020. 60 f. TCC — UDF, Brasília, 2020.\n' +
        'Folha 14, linha 8 — Onde se lê: "estratégia" | Leia-se: "estratégias".'
    },
    {
      id: '1-4-folha-aprovacao',
      capitulo: 'estrutura',
      secao: '1.4',
      secoes: ['1.4'],
      titulo: '1.4 Folha de Aprovação',
      paginas: 'pág. 8',
      conteudo:
        'Elemento obrigatório. Deve ser inserida após a folha de rosto, constituída por: nome do autor, título e subtítulo (se houver), natureza (tipo do trabalho, objetivo, nome da instituição e área de concentração), data de aprovação, nome, titulação e assinatura dos componentes da banca examinadora e instituições a que pertencem.\n\n' +
        'A data de aprovação e as assinaturas dos membros da banca examinadora devem ser colocadas após a aprovação do trabalho. A folha de aprovação é elemento sem título e sem indicativo numérico (Seção 4.2.4).',
      exemplos:
        'Aprovado em: ____ / ____ / ________.\n\n' +
        'BANCA EXAMINADORA\n' +
        '____________________________________\n' +
        'Prof. Dr. Nome do Orientador — UDF'
    },
    {
      id: '1-5-dedicatoria-agradecimentos-epigrafe',
      capitulo: 'estrutura',
      secao: '1.5–1.7',
      secoes: ['1.5', '1.6', '1.7'],
      titulo: '1.5–1.7 Dedicatória, Agradecimentos e Epígrafe',
      paginas: 'pág. 8',
      conteudo:
        'Todos os três são elementos opcionais:\n\n' +
        '• 1.5 Dedicatória: texto em que o autor presta homenagem ou dedica seu trabalho. Elemento sem título e sem indicativo numérico (Seção 4.2.4).\n' +
        '• 1.6 Agradecimentos: texto em que o autor dirige agradecimentos àqueles que contribuíram de maneira relevante para a elaboração do trabalho. Título centralizado e sem indicativo numérico (Seção 4.2.3).\n' +
        '• 1.7 Epígrafe: citação seguida de indicação de autoria relacionada à matéria tratada no corpo do trabalho. Segue as regras de citação, deve vir após os agradecimentos (também pode constar na abertura das seções primárias) e não leva título nem indicativo numérico.',
      exemplos:
        'Ordem: Folha de Aprovação → Dedicatória (opcional) → Agradecimentos (opcional) → Epígrafe (opcional) → Resumo.'
    },
    {
      id: '1-8-resumo-vernacula',
      capitulo: 'estrutura',
      secao: '1.8',
      secoes: ['1.8'],
      titulo: '1.8 Resumo na Língua Vernácula',
      paginas: 'págs. 8–9',
      conteudo:
        'Elemento obrigatório. Apresentação concisa dos pontos relevantes do trabalho, fornecendo visão rápida e clara do conteúdo e das conclusões. Pode ser indicativo (pontos principais, sem dados quantitativos/qualitativos) ou informativo (finalidades, metodologia, resultados e conclusões).\n\n' +
        'Regras obrigatórias do Manual da UDF:\n' +
        '• Extensão: de 150 a 500 palavras para trabalhos acadêmicos.\n' +
        '• Deve ressaltar: objetivo, método, resultados e conclusões.\n' +
        '• Estrutura: recomenda-se parágrafo único.\n' +
        '• Linguagem: verbo na voz ativa e na terceira pessoa do singular.\n' +
        '• Palavras-chave: logo abaixo do resumo, antecedidas de "Palavras-chave:", separadas entre si por ponto e finalizadas também por ponto.',
      exemplos:
        'RESUMO\n\n' +
        'Este estudo analisa [objetivo]... Adota pesquisa bibliográfica [método]... Os resultados demonstram [resultados]... Conclui-se que [conclusão]...\n\n' +
        'Palavras-chave: Trabalho acadêmico. Normas ABNT. Metodologia científica.'
    },
    {
      id: '1-9-resumo-estrangeira',
      capitulo: 'estrutura',
      secao: '1.9',
      secoes: ['1.9'],
      titulo: '1.9 Resumo em Língua Estrangeira',
      paginas: 'pág. 9',
      conteudo:
        'Elemento obrigatório. É a versão do resumo da língua vernácula traduzida para um idioma de divulgação internacional (em geral inglês — Abstract —, espanhol — Resumen — ou francês — Résumé), seguida das palavras-chave correspondentes no idioma escolhido (ex.: Keywords:).',
      exemplos:
        'ABSTRACT\n\n' +
        'This study analyzes...\n\n' +
        'Keywords: Academic work. ABNT standards. Scientific methodology.'
    },
    {
      id: '1-10-listas',
      capitulo: 'estrutura',
      secao: '1.10–1.13',
      secoes: ['1.10', '1.11', '1.12', '1.13'],
      titulo: '1.10–1.13 Listas (Ilustrações, Tabelas, Siglas e Símbolos)',
      paginas: 'págs. 9–10',
      conteudo:
        'Elementos opcionais, todos com título centralizado e sem indicativo numérico:\n\n' +
        '• 1.10 Lista de Ilustrações: elaborada de acordo com a ordem apresentada no texto (nome específico, travessão, título e número da folha/página). Recomenda-se lista própria para cada tipo (figuras, gráficos, quadros, mapas, fluxogramas etc.).\n' +
        '• 1.11 Lista de Tabelas: forma não discursiva com destaque para dados numéricos; elaborada na ordem apresentada no texto com nome específico e número da página.\n' +
        '• 1.12 Lista de Abreviaturas e Siglas: relação alfabética das abreviaturas e siglas usadas no texto, seguidas da expressão por extenso (recomenda-se lista própria para cada tipo).\n' +
        '• 1.13 Lista de Símbolos: elaborada na ordem apresentada no texto, com o devido significado.',
      exemplos:
        'Lista de Ilustrações (ordem do texto):\n' +
        'Figura 1 — Arquitetura do sistema ......................... 18\n\n' +
        'Lista de Siglas (ordem alfabética):\n' +
        'ABNT — Associação Brasileira de Normas Técnicas\n' +
        'UDF — Centro Universitário do Distrito Federal'
    },
    {
      id: '1-14-sumario',
      capitulo: 'estrutura',
      secao: '1.14',
      secoes: ['1.14'],
      titulo: '1.14 Sumário',
      paginas: 'pág. 10',
      conteudo:
        'Elemento obrigatório. A palavra "SUMÁRIO" deve ser centralizada e com a mesma tipologia de fonte usada nas seções primárias.\n\n' +
        '• A subordinação dos itens deve ser destacada pela mesma apresentação tipográfica utilizada no texto.\n' +
        '• Os elementos pré-textuais NÃO devem constar no sumário.\n' +
        '• Os indicativos das seções que compõem o sumário, se houver, devem ser alinhados à esquerda.',
      exemplos:
        'SUMÁRIO\n\n' +
        '1 INTRODUÇÃO .............................................. 12\n' +
        '2 REFERENCIAL TEÓRICO ..................................... 15\n' +
        '2.1 CONCEITOS INICIAIS .................................... 16\n' +
        '3 CONCLUSÃO ............................................... 42\n' +
        'REFERÊNCIAS ............................................... 45'
    },
    {
      id: '1-15-referencias-estrutura',
      capitulo: 'estrutura',
      secao: '1.15',
      secoes: ['1.15'],
      titulo: '1.15 Referências (na Estrutura)',
      paginas: 'pág. 10',
      conteudo:
        'Elemento pós-textual obrigatório. Os elementos essenciais e complementares devem seguir sequência padronizada conforme os modelos da Seção 2 (NBR 6023:2018).\n\n' +
        '• Alinhadas somente à margem esquerda, em espaço simples.\n' +
        '• Ao final do trabalho, devem ser separadas entre si por um espaço simples em branco.\n' +
        '• Em notas de rodapé, alinham-se a partir da segunda linha abaixo da primeira letra da primeira palavra, destacando o expoente e sem espaço entre elas.',
      exemplos:
        'Título centralizado e sem número: REFERÊNCIAS (Seção 4.2.3).'
    },
    {
      id: '1-16-glossario',
      capitulo: 'estrutura',
      secao: '1.16',
      secoes: ['1.16'],
      titulo: '1.16 Glossário',
      paginas: 'pág. 11',
      conteudo:
        'Elemento pós-textual opcional. Relação em ordem alfabética de palavras ou expressões técnicas de uso restrito ou de sentido obscuro utilizadas no texto, acompanhadas de suas respectivas definições.',
      exemplos:
        'GLOSSÁRIO\n\n' +
        'Anverso: página da frente de uma folha impressa.'
    },
    {
      id: '1-17-apendice-anexo',
      capitulo: 'estrutura',
      secao: '1.17–1.18',
      secoes: ['1.17', '1.18'],
      titulo: '1.17–1.18 Apêndice e Anexo',
      paginas: 'pág. 11',
      conteudo:
        'Ambos são elementos pós-textuais opcionais, identificados por letras maiúsculas consecutivas, travessão e título, mas possuem diferença essencial:\n\n' +
        '• 1.17 APÊNDICE: texto ou documento ELABORADO PELO AUTOR do trabalho, para complementar sua argumentação sem prejuízo da unidade nuclear (ex.: questionário criado pelo aluno).\n' +
        '• 1.18 ANEXO: texto ou documento NÃO ELABORADO PELO AUTOR, que serve de comprovação, fundamentação e ilustração (ex.: lei, manual oficial, formulário de terceiros).',
      exemplos:
        'APÊNDICE A — Questionário aplicado aos estudantes\n' +
        'ANEXO A — Resolução oficial da instituição'
    },
    {
      id: '1-19-indice',
      capitulo: 'estrutura',
      secao: '1.19',
      secoes: ['1.19'],
      titulo: '1.19 Índice',
      paginas: 'pág. 11',
      conteudo:
        'Elemento pós-textual opcional (não confundir com Sumário). É uma relação de palavras ou frases ordenadas segundo determinado critério, que localiza e remete às informações contidas no texto (inclusive notas explicativas, apêndices e anexos). O título deve definir sua função/conteúdo: índice de assunto, índice cronológico, índice onomástico etc.',
      exemplos:
        'Diferença: o Sumário enumera as divisões/seções do trabalho na ordem em que aparecem; o Índice lista palavras/assuntos ao final remetendo às páginas.'
    },

    // =========================================================================
    // CAPÍTULO 2 — REFERÊNCIAS — NBR 6023/2018 (págs. 12–31)
    // =========================================================================
    {
      id: '2-regras-gerais',
      capitulo: 'referencias',
      secao: '2',
      secoes: ['2'],
      titulo: '2 Regras Gerais de Referências',
      paginas: 'pág. 12',
      conteudo:
        'Segundo a NBR 6023 (2018), referência é o conjunto padronizado de elementos descritivos retirados de um documento para identificá-lo individualmente, composto por elementos essenciais e complementares.\n\n' +
        '• Alinhamento: somente à margem esquerda (nunca justificado).\n' +
        '• Espaçamento: espaço simples dentro de cada referência, separadas entre si por uma linha em branco de espaço simples.\n' +
        '• Em notas de rodapé: espaço simples, alinhadas a partir da segunda linha abaixo da primeira letra da primeira palavra para destacar o expoente, sem espaço entre elas.',
      exemplos:
        'LAKATOS, Eva Maria; MARCONI, Marina de Andrade. Metodologia do trabalho científico. 6. ed. São Paulo: Atlas, 2001. 219 p.'
    },
    {
      id: '2-1-1-autor-pessoa-fisica',
      capitulo: 'referencias',
      secao: '2.1.1',
      secoes: ['2.1', '2.1.1'],
      titulo: '2.1.1 Autoria: Pessoa Física (1 a 3 e 4+ autores)',
      paginas: 'págs. 12–13',
      conteudo:
        'A entrada é feita pelo último sobrenome em MAIÚSCULAS, seguido de vírgula, prenome e demais sobrenomes (abreviados ou não).\n\n' +
        'a) Até três autores: separam-se por ponto e vírgula seguido de espaço (; ).\n' +
        'b) Mais de três autores (sem organizador/coordenador): convém indicar todos, mas permite-se indicar apenas o primeiro seguido da expressão "et al.".\n' +
        'c) Com responsável pelo conjunto da obra: entrada pelo responsável seguido da abreviação no singular entre parênteses: (Org.), (Coord.), (Comp.), (Ed.).',
      exemplos:
        '1 autor: NUCCI, Guilherme de Sousa.\n' +
        '2 autores: TIPLER, Paul A.; MOSCA, Gene.\n' +
        '3 autores: HALLIDAY, David; RESNICK, Robert; WALKER, Jearl.\n' +
        '4+ autores: GODOI, Seabra; CASTRO, Paulo Honório de; XAVIER, Alberto; CREMA, Luis Carlos.\n' +
        'Ou: GODOI, Seabra... et al.\n' +
        'Responsável: FERREIRA, Léslie Piccolotto (Org.) | MARCONDES, E.; LIMA, I. (Coord.) | LUJAN, Roger Patron (Comp.) | MOORE, W. (Ed.)'
    },
    {
      id: '2-1-2-autor-pessoa-juridica',
      capitulo: 'referencias',
      secao: '2.1.2',
      secoes: ['2.1.2'],
      titulo: '2.1.2 Autoria: Pessoa Jurídica (Entidades)',
      paginas: 'pág. 14',
      conteudo:
        'Obras de responsabilidade de órgãos governamentais, empresas, associações, congressos etc. têm entrada, em geral, pelo nome por extenso em MAIÚSCULAS.\n\n' +
        '• Entidade com personalidade jurídica própria: entrada pelo próprio nome (ex.: UNIVERSIDADE DE SÃO PAULO). Quando a empresa é mais conhecida por sigla que compõe palavra com mais de 4 letras, a entrada deve ser preferencialmente pela sigla (ex.: EMBRAPA, PETROBRAS).\n' +
        '• Entidade com denominação genérica ou órgão sem personalidade jurídica: entrada pelo órgão superior ou pela jurisdição geográfica.',
      exemplos:
        'UNIVERSIDADE DE SÃO PAULO\n' +
        'EMBRAPA.\n' +
        'DNIT\n' +
        'PETROBRAS.\n' +
        'SÃO PAULO (Estado). Secretaria do Meio Ambiente'
    },
    {
      id: '2-1-3-autor-desconhecido',
      capitulo: 'referencias',
      secao: '2.1.3',
      secoes: ['2.1.3'],
      titulo: '2.1.3 Autor Desconhecido',
      paginas: 'pág. 14',
      conteudo:
        'Em caso de autoria desconhecida (não identificável), a entrada é feita diretamente pelo título, com a primeira palavra em MAIÚSCULAS (ou artigo inicial + primeira palavra).\n\n' +
        'ATENÇÃO: o termo "Anônimo" NÃO deve ser usado em substituição ao nome do autor desconhecido.',
      exemplos:
        'Título: Diagnóstico do setor editorial brasileiro\n' +
        'Referência: DIAGNÓSTICO do setor editorial brasileiro.'
    },
    {
      id: '2-2-ordenacao',
      capitulo: 'referencias',
      secao: '2.2',
      secoes: ['2.2', '2.2.1', '2.2.2'],
      titulo: '2.2 Ordenação das Referências (Alfabético e Numérico)',
      paginas: 'págs. 15–16',
      conteudo:
        'As referências são ordenadas conforme o sistema de chamada adotado no texto:\n\n' +
        '• 2.2.1 Sistema Alfabético (usado com Autor-Data): reunidas ao final em ordem alfabética única. Várias obras de mesma autoria podem substituir o autor na referência seguinte por um traço sublinear equivalente a seis espaços (______.) seguido de ponto.\n' +
        '• 2.2.2 Sistema Numérico: ordenadas conforme a ordem de citação no texto (a numeração não reinicia a cada página). O sistema numérico NÃO pode ser usado concomitantemente para notas de referência e notas explicativas.',
      exemplos:
        'Alfabético (mesma autoria):\n' +
        'FREYRE, Gilberto. Casa grande & senzala... Rio de Janeiro: J. Olympio, 1943. 2 v.\n' +
        '______. Sobrados e mucambos... São Paulo: Ed. Nacional, 1936.\n\n' +
        'Numérico:\n' +
        '1 CRETELLA JÚNIOR, José. Do impeachment no direito brasileiro. [São Paulo]: Revista dos Tribunais, 1992. p. 107\n' +
        '2 BOLETIM ESTATÍSTICO [da] Rede Ferroviária Federal. Rio de Janeiro, 1965. p. 20.'
    },
    {
      id: '2-3-1-artigo-periodico',
      capitulo: 'referencias',
      secao: '2.3.1',
      secoes: ['2.3', '2.3.1'],
      titulo: '2.3.1 Artigo de Periódico (Impresso)',
      paginas: 'págs. 16–17',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor. Título do artigo: subtítulo (quando houver). Título da revista (em negrito), local, designação numérica (v., n.), paginação inicial e final, mês abreviado e ano de publicação.',
      exemplos:
        'FAGÁ, Simone. A quem interessa o enfraquecimento da AGU?. Consulex: Revista Jurídica, Brasília, v. 17, n. 387, 1 mar. 2013, p. 40-41.\n\n' +
        'LEITE, Carlos Henrique Bezerra; GUASTI, Paula Corrêa. A (ir)responsabilidade da administração pública nas terceirizações diante da ADC 16 e da nova redação da súmula 331 do TST. Revista dos Tribunais, São Paulo, v. 101, n. 917, mar. 2012, p. 387-405\n\n' +
        'Citação no texto: (FAGÁ, 2013, p. 40) | (LEITE; GUASTI, 2012, p. 387)'
    },
    {
      id: '2-3-2-artigo-periodico-online',
      capitulo: 'referencias',
      secao: '2.3.2',
      secoes: ['2.3.2'],
      titulo: '2.3.2 Artigo de Periódico Online',
      paginas: 'pág. 17',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor. Título do artigo: subtítulo. Título da revista (em negrito), local, designação numérica, paginação inicial e final (se houver), mês abreviado e ano. DOI (se houver). Disponível em: <endereço>. Acesso em: dia, mês abreviado e ano.',
      exemplos:
        'SOUZA NETO, Gentil Ferreira de. A intimação pessoal da fazenda pública e as consequências do seu desrespeito pelo Poder Judiciário na prática processual: análise do caso do Estado de Alagoas. Jus Navigandi, [Teresina], [ano 18], [n. 3767], [24] out. 2013. Disponível em: http://jus.com.br/artigos/25606/... Acesso em: 24 out. 2013\n\n' +
        'O CONGRESSO interrompido. Veja, n. 6, 16 out. 1968, p. 12-18. Disponível em: http://veja.abril.com.br/acervodigital/. Acesso em: 20 out. 2013\n\n' +
        'Citação: (SOUZA NETO, 2013) | (O CONGRESSO, 1968, p. 15)'
    },
    {
      id: '2-3-3-artigo-jornal',
      capitulo: 'referencias',
      secao: '2.3.3',
      secoes: ['2.3.3'],
      titulo: '2.3.3 Artigo de Jornal (Impresso)',
      paginas: 'pág. 17',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor. Título do artigo: subtítulo (quando houver). Título do jornal (em negrito), local, data da publicação, número ou título do caderno, seção, suplemento, página.',
      exemplos:
        'NAVES, P. Lagos andinos dão banho de beleza. Folha de S. Paulo, São Paulo, 28 jun. 1999. Folha Turismo, Caderno 8, p. 13.\n\n' +
        'Citação: (NAVES, 1999, p. 13) ou Naves (1999, p. 13)'
    },
    {
      id: '2-3-4-artigo-jornal-online',
      capitulo: 'referencias',
      secao: '2.3.4',
      secoes: ['2.3.4'],
      titulo: '2.3.4 Artigo de Jornal Online',
      paginas: 'pág. 18',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor (ou 1ª palavra do título em MAIÚSCULAS se sem autor). Título do artigo. Título do jornal (em negrito), local, data da publicação, caderno/seção/página. DOI (se houver). Disponível em: <endereço>. Acesso em: data abreviada.',
      exemplos:
        'ATENDIMENTO ao público na sede do Detran-DF será finalizado na sexta-feira. Correio Braziliense, Brasília, 24 out. 2013. Disponível em: http://www.correiobraziliense.com.br/... Acesso em: 24 out. 2013.\n\n' +
        'PRESSE, France. Escândalo de espionagem dos Estados Unidos domina cúpula europeia. Correio Braziliense, Brasília, 24 out. 2013. Caderno Mundo. Disponível em: http://www.correiobraziliense.com.br/... Acesso em: 24 out. 2013\n\n' +
        'Citação: (ATENDIMENTO, 2013) | (PRESSE, 2013)'
    },
    {
      id: '2-3-5-bases-dados',
      capitulo: 'referencias',
      secao: '2.3.5',
      secoes: ['2.3.5'],
      titulo: '2.3.5 Bases de Dados Online',
      paginas: 'pág. 18',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome dos Autores. Título do texto. In: Título da Publicação. Nome da Base de Dados (em negrito). Data de publicação. Disponível em: <endereço>. Acesso em: data abreviada.',
      exemplos:
        'COSTA, Maick; BANDEIRA-DE-MELO, Rodrigo; MARCON, Rosilene. Influência da conexão política na diversificação dos grupos empresariais brasileiros. In: RAE: Revista de Administração de Empresas. Base de Dados Academic Search Elite. 2013. Disponível em: http://web.ebscohost.com/... Acesso em: 25 out. 2013.\n\n' +
        'Citação: (COSTA; BANDEIRA-DE-MELO; MARCON, 2013)'
    },
    {
      id: '2-3-6-blog',
      capitulo: 'referencias',
      secao: '2.3.6',
      secoes: ['2.3.6'],
      titulo: '2.3.6 Blog',
      paginas: 'pág. 19',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor. Título do Blog [Blog Internet] (em negrito). Título do texto. Lugar de publicação: editor, data de publicação. Disponível em: <endereço>. Acesso em: data abreviada.',
      exemplos:
        'CORRÊA, Fabrício da Mata. Direito penal em dia [Blog Internet]. Constituição Federal de 1988: um olhar no passado para ver o futuro. Espírito Santo: Fabrício da Mata Corrêa, 05 out. 2013. Disponível em: http://direitopenalemdia.blogspot.com.br/... Acesso em: 24 out. 2013\n\n' +
        'Citação: (CORRÊA, 2013)'
    },
    {
      id: '2-3-7-capitulo-livro',
      capitulo: 'referencias',
      secao: '2.3.7',
      secoes: ['2.3.7'],
      titulo: '2.3.7 Capítulo de Livro',
      paginas: 'págs. 19–20',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do Autor do Capítulo. Título do capítulo: subtítulo. In: SOBRENOME, Nome dos autores/organizadores. Título do livro (em negrito): subtítulo. Edição. Local: Editora, ano. Paginação inicial e final do capítulo.\n\n' +
        'Observação: quando o autor do capítulo também for o autor do livro, substitui-se o nome após "In:" por um traço sublinear de seis traços (______.).',
      exemplos:
        'ROMANO, Giovanni. Imagens da juventude na era moderna. In: LEVI, G.; SCHIMIDT, J. (Org.). História dos jovens 2. São Paulo: Companhia das Letras, 1996. p. 7-16.\n\n' +
        'SANTOS, F. R. dos. A colonização da terra do Tucujús. In: ______. História do Amapá, 1º grau. 2. ed. Macapá: Valcan, 1994. cap. 3, p. 15-24.\n\n' +
        'Citação: (ROMANO, 1996, p. 11) | (SANTOS, 1994, p. 16)'
    },
    {
      id: '2-3-8-documento-sonoro',
      capitulo: 'referencias',
      secao: '2.3.8',
      secoes: ['2.3.8'],
      titulo: '2.3.8 Documento Sonoro (CD, Entrevista/Palestra, Música)',
      paginas: 'pág. 20',
      conteudo:
        'Estrutura:\n' +
        'AUTOR (compositores; intérpretes). Título (em negrito), local, gravadora (ou equivalente), data e especificação do suporte.',
      exemplos:
        'CD: ALCIONE. Ouro e cobre. São Paulo: RCA Victor, p1988. 1 disco — Citação: (ALCIONE, p1988)\n\n' +
        'Entrevista/Palestra: HAMEL, Gary. Eficiência não basta: as empresas precisam inovar na gestão. [Entrevista cedida a] Chris Stanley. HSM Management, São Paulo, n. 79, mar./abr. 2010. Disponível em: http://www.revistahsm.com.br/... Acesso em: 23 mar. 2017. — Citação: (HAMEL, 2010)\n\n' +
        'Música: GINO, A. Toque Macio. Intérprete: Alcione. In: ALCIONE. Ouro e cobre. São Paulo: RCA Victor, p1988. 1 disco sonoro. Lado A, faixa 1 — Citação: (GINO, 1988)'
    },
    {
      id: '2-3-9-ebooks',
      capitulo: 'referencias',
      secao: '2.3.9',
      secoes: ['2.3.9'],
      titulo: '2.3.9 E-books',
      paginas: 'pág. 21',
      conteudo:
        'Estrutura (com URL ou indicação "E-book"):\n' +
        'SOBRENOME, Nome do Autor. Título (em negrito): subtítulo. Edição. Local: Editora, ano. Páginas (opcional). Volume (se houver). Disponível em: <endereço>. Acesso em: <data>.\n' +
        'Ou encerrando com: E-book. (em itálico).',
      exemplos:
        'ASSIS, Machado. Dom Casmurro. Rio de Janeiro: Garnier, 1899. Disponível em: http://machado.mec.gov.br/images/stories/pdf/romance/marm08.pdf. Acesso em: 24 out. 2010.\n\n' +
        'BARROS, Aidil Jesus da Silveira; LEHFELD, Neide Aparecida de Souza. Fundamentos de metodologia científica. 3. ed. São Paulo: Pearson, 2008. E-book.\n\n' +
        'Citação: (ASSIS, 1899) | (BARROS; LEHFELD, 2008)'
    },
    {
      id: '2-3-10-entrevista-pessoal',
      capitulo: 'referencias',
      secao: '2.3.10',
      secoes: ['2.3.10'],
      titulo: '2.3.10 Entrevista Pessoal',
      paginas: 'pág. 21',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do entrevistado. Assunto ou título da entrevista (em negrito). Local: Instituição onde ocorreu, data. Nota indicando o tipo de depoimento e o nome do entrevistador.',
      exemplos:
        'CALDEIRA, Thaísa Lopes. Problemas no descarte de coleções periódicas. Brasília: Universidade do Distrito Federal, 15 nov. 2012. Entrevista concedida à Priscilla Brito dos Santos, para análise de dados em trabalho de conclusão de curso.\n\n' +
        'Citação: (CALDEIRA, 2012)'
    },
    {
      id: '2-3-11-filme',
      capitulo: 'referencias',
      secao: '2.3.11',
      secoes: ['2.3.11'],
      titulo: '2.3.11 Filme Cinematográfico',
      paginas: 'pág. 22',
      conteudo:
        'Estrutura:\n' +
        'TÍTULO (1ª palavra em MAIÚSCULAS): subtítulo. Créditos (diretor, produtor, realizador, roteirista). Elenco relevante (opcional). Local: produtora, data. Especificação do suporte em unidades físicas (duração), sistema de reprodução, son., color.',
      exemplos:
        'CENTRAL do Brasil. Direção: Walter Salles Júnior. Produção: Martire de Clermont-Tonnerre e Arthur Cohn. Intérpretes: Fernanda Montenegro; Marília Pera; Vinicius de Oliveira e outros. [S.l.]: Le Studio Canal; Rio Filmes, 1998. 1 bobina cinematográfica (106 min), son., color., 35 mm.\n\n' +
        'BLADE Runner. Direção: Ridley Scott. Los Angeles: Warner Brothers, c1991. 1 DVD (117 min).\n\n' +
        'Citação: (CENTRAL, 1998) | (BLADE, 1991)'
    },
    {
      id: '2-3-12-home-page',
      capitulo: 'referencias',
      secao: '2.3.12',
      secoes: ['2.3.12'],
      titulo: '2.3.12 Home Page (Sites)',
      paginas: 'pág. 22',
      conteudo:
        'Estrutura:\n' +
        'TÍTULO ou denominação da página (em MAIÚSCULAS). Local (se houver). Indicação de responsabilidade (editor, coordenador, desenvolvedor — se houver), ano de implementação ou publicação. Descrição do conteúdo (opcional). Disponível em: <endereço>. Acesso em: data abreviada.',
      exemplos:
        'CIVITAS. Coordenação de Simão Pedro P. Marinho. Desenvolvido pela Pontifícia Universidade Católica de Minas Gerais, 1995-1998. Apresenta textos sobre urbanismo e desenvolvimento de cidades. Disponível em: http://www.gcsnet.com.br/oamis/civitas. Acesso em: 27 nov. 1998\n\n' +
        'Citação: (CIVITAS, 1998)'
    },
    {
      id: '2-3-13-ilustracao',
      capitulo: 'referencias',
      secao: '2.3.13',
      secoes: ['2.3.13'],
      titulo: '2.3.13 Ilustração',
      paginas: 'pág. 23',
      conteudo:
        'Abrange fotografia, pintura, gravura, desenho técnico, fluxogramas, cartaz etc. Elementos essenciais: autor, título (se não existir, atribuir denominação ou indicar [Sem título] entre colchetes), data e especificação do suporte.\n\n' +
        'Estrutura:\n' +
        'SOBRENOME, Nome do Autor. Título (em negrito). Data. Especificação do Suporte. Notas complementares (opcional).',
      exemplos:
        'KOBAYASHI, K. Doenças dos xavantes. 1980. 1 fotografia.\n\n' +
        'STOCKDALE, René. When’s recess? [2002?]. 1 fotografia, color. Disponível em: http://www.webshots.com/g/d2002/1-nw/20255.html. Acesso em: 24 out. 2013.\n\n' +
        'Citação: (KOBAYASHI, 1980) | (STOCKDALE, [2002?])'
    },
    {
      id: '2-3-14-jurisprudencia',
      capitulo: 'referencias',
      secao: '2.3.14',
      secoes: ['2.3.14'],
      titulo: '2.3.14 Jurisprudência',
      paginas: 'págs. 23–24',
      conteudo:
        'Abrange súmulas, enunciados, acórdãos, sentenças e demais decisões judiciais.\n\n' +
        'Estrutura:\n' +
        'JURISDIÇÃO. Órgão judiciário competente. Título da jurisprudência e número (em negrito). Partes envolvidas (se houver). Relator. Local e data do julgamento. Disponível em: <endereço>. Acesso em: data abreviada.\n' +
        'Nota: o uso da sigla (ex.: STF) na citação exige lista de siglas e abreviaturas.',
      exemplos:
        'BRASIL. Supremo Tribunal Federal. Súmula n. 1. Súmula da Jurisprudência predominante do Supremo Tribunal Federal. Edição: Imprensa Nacional, 1964, p. 33. Disponível em: http://www.stf.jus.br/... Acesso em: 25 out. 2013\n\n' +
        'BRASIL. Supremo Tribunal Federal. ADI n. 3864 MC/DF. Relator: Min. Cezar Peluso. Brasília, 01 de fevereiro de 2007. Disponível em: http://www.stf.jus.br/... Acesso em: 25 out. 2013.\n\n' +
        'Citação: (BRASIL. STF, 1964) | (BRASIL. STF, 2007)'
    },
    {
      id: '2-3-15-legislacao',
      capitulo: 'referencias',
      secao: '2.3.15',
      secoes: ['2.3.15'],
      titulo: '2.3.15 Legislação (Leis, Códigos, Constituições e Emendas)',
      paginas: 'págs. 24–26',
      conteudo:
        'Estrutura:\n' +
        'JURISDIÇÃO e/ou CABEÇALHO DA INSTITUIÇÃO. Título da legislação ou norma. Nome popular (se houver). Ementa (opcional). Dados da publicação (ou Local, data, Disponível em: e Acesso em:).\n\n' +
        'Constituições e suas Emendas: acrescenta-se entre a jurisdição e o título a palavra "Constituição", seguida do ano de promulgação entre parênteses.',
      exemplos:
        'Lei online: BRASIL. Lei n. 11.340, de 07 de agosto de 2006. Lei Maria da Penha. Brasília, 08 de agosto de 2006. Disponível em: http://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11340.htm. Acesso em: 25 out. 2013.\n\n' +
        'Código: BRASIL. Lei n. 10.406, de 10 de janeiro de 2002. Código Civil. Brasília, 2002. Disponível em: http://www.planalto.gov.br/ccivil_03/leis/2002/l10406.htm. Acesso em: 26 out. 2013\n\n' +
        'Constituição: BRASIL. Constituição (1988). Constituição da República Federativa do Brasil. Brasília, 5 de outubro de 1988. Disponível em: http://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm. Acesso em: 25 out. 2013.\n\n' +
        'Emenda: BRASIL. Constituição (1988). Emenda constitucional n. 9, de 9 de novembro de 1995. Brasília, 1995. Disponível em: http://www.planalto.gov.br/... Acesso em: 25 out. 2013.\n\n' +
        'Citação: (BRASIL, 2006) | (BRASIL, 1988)'
    },
    {
      id: '2-3-16-livro',
      capitulo: 'referencias',
      secao: '2.3.16',
      secoes: ['2.3.16'],
      titulo: '2.3.16 Livro',
      paginas: 'págs. 26–27',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do Autor. Título (em negrito): subtítulo (se houver). Edição. Local: Editora, ano de publicação. Páginas (opcional), Volumes (se houver).',
      exemplos:
        'ISKANDAR, Jamil Ibrahim. Normas da ABNT: comentadas para trabalhos científicos. 5. ed. rev. e atual. Curitiba: Juruá, 2012. 98 p.\n\n' +
        'LAKATOS, Eva Maria; MARCONI, Marina de Andrade. Metodologia do trabalho científico. 6. ed. São Paulo: Atlas, 2001. 219 p.\n\n' +
        'RESNICK, Robert; HALLIDAY, David; KRANE, Kenneth S. Física 1. 5. ed. Rio de Janeiro: Livros Técnicos e Científicos, 2003. xii, 368 p.\n\n' +
        'Citação: (ISKANDAR, 2012) | (LAKATOS; MARCONI, 2001)'
    },
    {
      id: '2-3-17-norma-tecnica',
      capitulo: 'referencias',
      secao: '2.3.17',
      secoes: ['2.3.17'],
      titulo: '2.3.17 Norma Técnica',
      paginas: 'pág. 27',
      conteudo:
        'Estrutura:\n' +
        'ENTIDADE RESPONSÁVEL. Título (em negrito): subtítulo (se houver). Edição. Local: Editora, ano de publicação.',
      exemplos:
        'ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. NBR 6023: informação e documentação: referências: elaboração. Rio de Janeiro, ago. 2018.\n\n' +
        'Citação: (ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS, 2018) ou (ABNT, 2018)'
    },
    {
      id: '2-3-18-processo',
      capitulo: 'referencias',
      secao: '2.3.18',
      secoes: ['2.3.18'],
      titulo: '2.3.18 Processo Judicial',
      paginas: 'págs. 27–28',
      conteudo:
        'Estrutura:\n' +
        'JURISDIÇÃO. Tribunal competente. Instância. Processo e número (em negrito). Natureza do processo. Partes envolvidas. Local e ano. Disponível em: <endereço>. Acesso em: data abreviada.',
      exemplos:
        'DISTRITO FEDERAL (BRASIL). Tribunal de Justiça do Distrito Federal e Territórios. Terceira Vara Cível. Processo n. 2007.01.1.084201-2. Consignação em pagamento. Exequente: Unafisco Sindical. Executado: Winchester Serviços de Computação LTDA. Brasília, 13 de julho de 2007. Acesso em: 25 out. 2013.\n\n' +
        'Citação: (DISTRITO FEDERAL, 2007)'
    },
    {
      id: '2-3-19-trabalho-academico',
      capitulo: 'referencias',
      secao: '2.3.19',
      secoes: ['2.3.19'],
      titulo: '2.3.19 Trabalho Acadêmico (TCC, Dissertação e Tese)',
      paginas: 'pág. 28',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor. Título (em negrito): subtítulo (se houver). Orientador: Nome. Ano da publicação. Páginas ou folhas (f.). Tipo de documento (grau) – Instituição (sigla opcional), local, ano da defesa.',
      exemplos:
        'MAIA, Fernanda Capra Brandão. A (des)criminalização do futuro em face do reconhecimento do princípio da insignificância. Orientador: João Pereira Silva. 2006. 74 f. Trabalho de conclusão de curso (graduação em direito) - Centro Universitário do Distrito Federal, Faculdade de Ciências Jurídicas, 2006.\n\n' +
        'SCHIAVINATO, Ana Maria. Transição democrática e pacto político: estudo comparativo do sistema partidário e eleitoral no Brasil e Argentina 1964-2001. Orientador: César Martins Souza. 2001. 374 f. Tese (doutorado) - Universidade de Brasília, 2001.\n\n' +
        'Citação: (MAIA, 2006) | (SCHIAVINATO, 2001)'
    },
    {
      id: '2-3-20-trabalho-evento',
      capitulo: 'referencias',
      secao: '2.3.20',
      secoes: ['2.3.20'],
      titulo: '2.3.20 Trabalho de Evento (Anais)',
      paginas: 'págs. 28–29',
      conteudo:
        'Estrutura:\n' +
        'SOBRENOME, Nome do autor. Título do trabalho apresentado. In: NOME DO EVENTO, número, ano, cidade. Título (em negrito): subtítulo. Local: Editora, ano de publicação. Volume e/ou páginas inicial e final.\n' +
        'Nota: a parte do título que repetir o nome do evento pode ser substituída por reticências entre colchetes [...].',
      exemplos:
        'MIYAZAWA, Carlos Suetoshi. Extinção do citotipo de 2n=50 cromossomos... In: JORNADA DE PRODUÇÃO CIENTÍFICA PROFISSIONAL E TECNOLÓGICA, 2012, São Roque, SP. Anais [...]. São Roque: IFSP, 2012.\n\n' +
        'Citação: (MIYAZAWA, 2012)'
    },
    {
      id: '2-4-dados-desconhecidos',
      capitulo: 'referencias',
      secao: '2.4',
      secoes: ['2.4', '2.4.1', '2.4.2', '2.4.3'],
      titulo: '2.4 Dados Desconhecidos (Local, Editora e Ano)',
      paginas: 'págs. 29–31',
      conteudo:
        'Quando o documento não informa algum dado essencial:\n\n' +
        '• 2.4.1 Local de publicação: se a cidade não aparece no documento mas pode ser identificada, coloca-se entre colchetes — ex.: [São Paulo]. Se impossível determinar, usa-se [S.l.] (sine loco).\n' +
        '• 2.4.2 Editora: se não puder ser identificada, usa-se [s.n.] (sine nomine). Sem local e sem editora: [S.l.: s.n.]. Quando a editora é a mesma instituição/pessoa da autoria já mencionada, omite-se a editora.\n' +
        '• 2.4.3 Ano de publicação (algarismos arábicos; elemento essencial): se não houver data, registra-se data aproximada entre colchetes:\n' +
        '  [1973] — data certa, não indicada no item\n' +
        '  [1969?] — data provável\n' +
        '  [1971 ou 1972] — um ano ou outro\n' +
        '  [entre 1906 e 1912] — intervalos menores de 20 anos\n' +
        '  [ca. 1960] — data aproximada\n' +
        '  [197-] — década certa  |  [197-?] — década provável\n' +
        '  [18--] — século certo  |  [18--?] — século provável',
      exemplos:
        'LAZZARINI NETO, Sylvio. Cria e recria. [São Paulo]: SDF Editores, 1994. 108 p.\n' +
        'GONÇALVES, F. B. A história de Mirador. [S.l.: s.n.], 1993.\n' +
        'FLORENZANO, Everton. Dicionário de ideias semelhantes. Rio de Janeiro: Ediouro, [1993]. 383 p.\n' +
        'Citação: (FLORENZANO, [1993])'
    },

    // =========================================================================
    // CAPÍTULO 3 — CITAÇÕES — NBR 10520 (págs. 32–39)
    // =========================================================================
    {
      id: '3-1-1-autor-data',
      capitulo: 'citacoes',
      secao: '3.1.1',
      secoes: ['3', '3.1', '3.1.1', '3.1.1.1', '3.1.1.2'],
      titulo: '3.1.1 Sistema de Chamada Autor-Data',
      paginas: 'págs. 32–33',
      conteudo:
        'As citações devem seguir um único sistema de chamada ao longo de todo o trabalho (Autor-Data ou Numérico — é PROIBIDO usar ambos concomitantemente).\n\n' +
        'No sistema Autor-Data:\n' +
        '• Sobrenome do autor (ou entidade/1ª palavra do título) em MAIÚSCULAS dentro dos parênteses, seguido de ano e página (quando direta). Se o autor estiver fora dos parênteses, vai em maiúsculas/minúsculas comuns seguido do ano entre parênteses.\n' +
        '• A lista de referências deve obrigatoriamente estar em ordem alfabética.\n' +
        '• 3.1.1.1 Sobrenomes iguais: acrescentam-se as iniciais dos prenomes; persistindo a coincidência, colocam-se os prenomes por extenso.\n' +
        '• 3.1.1.2 Mesmo autor no mesmo ano: distinguem-se por letras minúsculas após a data sem espaço (2002a, 2002b), obedecendo à ordem alfabética da lista de referências.',
      exemplos:
        'No fim da frase: (MUMFORD, 1949, p. 513).\n' +
        'No texto: Segundo Authier-Reiriz (1982)...\n' +
        'Sobrenomes iguais: (BARBOSA, C., 1958) e (BARBOSA, O., 1959) | (BARBOSA, Cássio, 1965) e (BARBOSA, Celso, 1965).\n' +
        'Mesmo ano: (BRASIL, 2002a) e (BRASIL, 2002b).'
    },
    {
      id: '3-1-2-sistema-numerico',
      capitulo: 'citacoes',
      secao: '3.1.2',
      secoes: ['3.1.2'],
      titulo: '3.1.2 Sistema de Chamada Numérico',
      paginas: 'pág. 34',
      conteudo:
        'A indicação da fonte é feita por numeração única e consecutiva em algarismos arábicos, remetendo à lista de referências na mesma ordem em que aparecem no texto. A numeração NÃO reinicia a cada página.\n\n' +
        'REGRA CRÍTICA: o sistema numérico NÃO deve ser utilizado quando há notas explicativas no rodapé.',
      exemplos:
        'No texto: "De acordo com as novas tendências da jurisprudência brasileira¹, é facultado ao magistrado decidir sobre a matéria."\n' +
        'Na lista/rodapé: 1 CRETELLA JÚNIOR, José. Do impeachment no direito brasileiro. [São Paulo]: Revista dos Tribunais, 1992. p. 107'
    },
    {
      id: '3-2-notas-rodape',
      capitulo: 'citacoes',
      secao: '3.2',
      secoes: ['3.2', '3.2.1', '3.2.2'],
      titulo: '3.2 Notas de Rodapé (Referência e Explicativas)',
      paginas: 'págs. 34–36',
      conteudo:
        'Dividem-se em notas de referência e notas explicativas — deve-se usar uma ou outra, NUNCA as duas concomitantemente. Alinham-se a partir da segunda linha abaixo da primeira letra da primeira palavra, sem espaço entre elas e em fonte menor.\n\n' +
        '• 3.2.1 Notas de referência: indicam fontes consultadas (numeração única consecutiva por capítulo/parte). A 1ª citação traz referência completa; citações subsequentes na mesma página podem abreviar:\n' +
        '  - Idem ou Id. (mesmo autor)\n' +
        '  - Ibidem ou Ibid. (mesma obra)\n' +
        '  - Opus citatum / op. cit. (obra citada anteriormente)\n' +
        '  - apud (citado por)\n' +
        '• 3.2.2 Notas explicativas: comentários, esclarecimentos ou explanações que não podem ser incluídos no texto.',
      exemplos:
        '¹ ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS, 1989, p. 9\n' +
        '² Id., 2000\n\n' +
        '¹ DURKHEIM, 1925, p. 196\n' +
        '² Ibid., p. 199\n\n' +
        '³ ADORNO, op. cit., p. 40\n' +
        '¹ EVANS, 1987 apud SAGE, 1992, p. 2-3'
    },
    {
      id: '3-3-citacao-indireta',
      capitulo: 'citacoes',
      secao: '3.3',
      secoes: ['3.3'],
      titulo: '3.3 Citação Indireta (Paráfrase)',
      paginas: 'pág. 36',
      conteudo:
        'É a paráfrase das ideias do documento consultado — uma releitura em outras palavras do que foi dito por outro autor (não usa aspas).\n\n' +
        '• Autor entre parênteses em CAIXA ALTA seguido do ano; a indicação de página é opcional.\n' +
        '• Se o nome do autor for mencionado no corpo do texto, apenas o ano (e opcionalmente a página) fica entre parênteses.',
      exemplos:
        'A ironia seria assim uma forma implícita de heterogeneidade mostrada, conforme a classificação proposta por Authier-Reiriz (1982).\n\n' +
        'A produção de lítio começa em Searles Lake, Califórnia, em 1928 (MUMFORD, 1949, p. 513).'
    },
    {
      id: '3-4-1-citacao-direta-curta',
      capitulo: 'citacoes',
      secao: '3.4.1',
      secoes: ['3.4', '3.4.1'],
      titulo: '3.4.1 Citação Direta Curta (até 3 linhas)',
      paginas: 'pág. 37',
      conteudo:
        'Transcrição literal (ipsis literis) com ATÉ TRÊS LINHAS.\n\n' +
        '• Deve vir inserida no próprio parágrafo entre aspas duplas ("...").\n' +
        '• Se houver citação no interior da citação, ela deve vir entre aspas simples (\'...\').\n' +
        '• Deve indicar autor, ano e página (p.).',
      exemplos:
        '"Apesar das aparências, a desconstrução do logocentrismo não é uma psicanálise da filosofia [...]" (DERRIDA, 1967, p. 293).\n\n' +
        'Oliveira e Leonardos (1943, p. 146) dizem que a "[...] relação da série São Roque com os granitos porfiróides pequenos é muito clara".'
    },
    {
      id: '3-4-2-citacao-direta-longa',
      capitulo: 'citacoes',
      secao: '3.4.2',
      secoes: ['3.4.2'],
      titulo: '3.4.2 Citação Direta Longa (mais de 3 linhas)',
      paginas: 'pág. 37',
      conteudo:
        'Transcrição literal com MAIS DE TRÊS LINHAS.\n\n' +
        'Regras obrigatórias:\n' +
        '• Destacada em parágrafo próprio com recuo de 4 cm da margem esquerda.\n' +
        '• Fonte menor que a do texto: tamanho 10 ou 11.\n' +
        '• Espaçamento simples entre linhas (Seção 4.2).\n' +
        '• SEM aspas duplas.\n' +
        '• Indicação de autor, ano e página.',
      exemplos:
        'Nos dizeres de Bulos (2008, p. 186):\n' +
        '    [recuo 4 cm, fonte 10 ou 11, espaço simples, sem aspas]\n' +
        '    Interessante observar que as leis e atos de efeitos concretos se apresentam numa roupagem de norma jurídica...'
    },
    {
      id: '3-5-citacao-apud',
      capitulo: 'citacoes',
      secao: '3.5',
      secoes: ['3.5'],
      titulo: '3.5 Citação de Citação (apud)',
      paginas: 'pág. 38',
      conteudo:
        'É a citação direta ou indireta de um texto ao qual não se teve acesso ao original. Utiliza-se a expressão em latim "apud" (ou "citado por"). Indica-se primeiro o autor do texto original, seguido de "apud" e do autor da obra efetivamente consultada.',
      exemplos:
        '"[...] o viés organicista da burocracia estatal e o antiliberalismo da cultura política de 1937, preservado de modo encapuçado na Carta de 1946." (VIANNA, 1986, p. 172 apud SEGATTO, 1995, p. 214-215)\n\n' +
        'Segundo Silva (1983 apud ABREU, 1999, p. 3)...\n\n' +
        'No modelo serial de Gough (1972 apud NARDI, 1993)...'
    },
    {
      id: '3-6-regras-apresentacao-citacoes',
      capitulo: 'citacoes',
      secao: '3.6',
      secoes: ['3.6', '3.6.1', '3.6.2', '3.6.3'],
      titulo: '3.6 Supressão, Interpolação e Ênfase (Grifo)',
      paginas: 'págs. 38–39',
      conteudo:
        'Regras especiais na apresentação de citações:\n\n' +
        '• 3.6.1 Supressão: remoção de trecho, parágrafo ou pontuação do original — indicar obrigatoriamente com reticências entre colchetes: [...].\n' +
        '• 3.6.2 Interpolação: acréscimo de comentário ou explicação não contida na fonte original — deve vir entre colchetes: [explicação].\n' +
        '• 3.6.3 Ênfase ou Destaque: ao destacar trechos (negrito/itálico), indicar na chamada entre parênteses "grifo nosso" (quando o destaque foi feito por você) ou "grifo do autor" (quando já existia na obra original).',
      exemplos:
        'Supressão: "No Portal da Legislação, o cidadão tem acesso a todo o material legislativo produzido na história do Brasil [...] dentre outros." (BRASIL, 2011)\n\n' +
        'Interpolação: "No Portal da Legislação [site do governo federal], o cidadão tem acesso..." (BRASIL, 2011).\n\n' +
        'Destaque: "...o cidadão tem acesso a todo o material legislativo..." (BRASIL, 2011, grifo nosso).\n' +
        'Destaque original: (CANDIDO, 1993, v. 2, p. 12, grifo do autor).'
    },

    // =========================================================================
    // CAPÍTULO 4 — REGRAS GERAIS DE APRESENTAÇÃO — NBR 14724 (págs. 40–41)
    // =========================================================================
    {
      id: '4-1-formato-margens-fonte',
      capitulo: 'apresentacao',
      secao: '4.1',
      secoes: ['4', '4.1'],
      titulo: '4.1 Formato, Papel, Margens e Fonte',
      paginas: 'pág. 40',
      conteudo:
        'Regras gerais de formatação do trabalho acadêmico:\n\n' +
        '• Cor e Papel: texto digitado em cor preta (outras cores apenas em ilustrações); papel branco ou reciclado no formato A4 (21 cm × 29,7 cm).\n' +
        '• Anverso e Verso: os elementos pré-textuais iniciam no anverso (frente) da folha, exceto os dados de catalogação na publicação (verso da folha de rosto).\n' +
        '• Margens (anverso): 3 cm para esquerda e superior; 2 cm para direita e inferior. Se impresso também no verso: 3 cm para direita e superior; 2 cm para esquerda e inferior.\n' +
        '• Fonte: recomenda-se tamanho 12 para todo o trabalho, inclusive capa. Exceções em tamanho menor e uniforme (10 ou 11): citações com mais de 3 linhas, notas de rodapé, paginação, ficha catalográfica, legendas e fontes de ilustrações e tabelas.',
      exemplos:
        'Resumo rápido (anverso A4):\n' +
        'Superior: 3 cm | Esquerda: 3 cm | Direita: 2 cm | Inferior: 2 cm\n' +
        'Fonte geral: 12 | Citações longas, rodapé, paginação e legendas: tamanho menor e uniforme (10 ou 11).'
    },
    {
      id: '4-2-espacamento-rodape',
      capitulo: 'apresentacao',
      secao: '4.2',
      secoes: ['4.2', '4.2.1'],
      titulo: '4.2 Espaçamento e Filete de Rodapé',
      paginas: 'págs. 40–41',
      conteudo:
        '• Texto geral: espaçamento 1,5 entre linhas.\n' +
        '• Espaço simples: citações com mais de 3 linhas, notas de rodapé, referências, legendas de ilustrações e tabelas, e natureza na folha de rosto (tipo, objetivo, instituição e área de concentração).\n' +
        '• Referências ao final do trabalho: separadas entre si por um espaço simples em branco.\n' +
        '• 4.2.1 Notas de Rodapé: digitadas dentro das margens, separadas do texto por um espaço simples e por um filete de 5 cm a partir da margem esquerda; a partir da segunda linha, alinham-se abaixo da primeira letra da primeira palavra, sem espaço entre elas e em fonte menor.',
      exemplos:
        'Texto corrido: 1,5\n' +
        'Citações longas, referências, legendas, rodapé e natureza: espaço simples\n' +
        'Separador de rodapé: filete de 5 cm à esquerda.'
    },
    {
      id: '4-2-2-secoes-titulos',
      capitulo: 'apresentacao',
      secao: '4.2.2–4.2.4',
      secoes: ['4.2.2', '4.2.3', '4.2.4'],
      titulo: '4.2.2–4.2.4 Indicativos de Seção e Títulos',
      paginas: 'pág. 41',
      conteudo:
        '• 4.2.2 Indicativos de seção: algarismo arábico alinhado à esquerda, precedendo o título e separado por 1 espaço de caractere. Seções primárias começam em página ímpar (anverso), no topo da mancha gráfica, separadas do texto seguinte por 1 espaço de 1,5. Subseções são separadas do texto anterior e posterior por 1 espaço de 1,5. Títulos com mais de uma linha alinham-se abaixo da primeira letra da primeira palavra.\n' +
        '• 4.2.3 Títulos SEM indicativo numérico (devem ser CENTRALIZADOS): errata, agradecimentos, lista de ilustrações, lista de siglas e abreviaturas, lista de símbolos, resumos, sumário, referências, glossário, apêndice, anexo e índice.\n' +
        '• 4.2.4 Elementos SEM título e SEM indicativo numérico: folha de aprovação, dedicatória e epígrafe(s).',
      exemplos:
        'Com número (à esquerda): 2.1 METODOLOGIA DA PESQUISA\n' +
        'Sem número (centralizados): RESUMO, SUMÁRIO, REFERÊNCIAS\n' +
        'Sem título e sem número: Folha de Aprovação, Dedicatória, Epígrafe.'
    },
    {
      id: '4-3-paginacao',
      capitulo: 'apresentacao',
      secao: '4.3',
      secoes: ['4.3'],
      titulo: '4.3 Paginação (Contagem e Posição)',
      paginas: 'pág. 41',
      conteudo:
        '• Folhas pré-textuais são CONTADAS, mas NÃO numeradas.\n' +
        '• Para trabalhos digitados somente no anverso, todas as folhas a partir da FOLHA DE ROSTO são contadas sequencialmente (a capa não é contada).\n' +
        '• A numeração aparece visível apenas a partir da primeira folha da parte textual (Introdução), em algarismos arábicos.\n' +
        '• Posição: canto superior direito da folha, a 2 cm da borda superior, ficando o último algarismo a 2 cm da borda direita.',
      exemplos:
        'Exemplo: Folha de Rosto (conta 1, oculta) → Folha de Aprovação (2, oculta) → Resumo (3, oculta) → Abstract (4, oculta) → Sumário (5, oculta) → Introdução (aparece "6" no canto superior direito, a 2 cm das bordas).'
    }
  ]
};

// Compatibilidade entre navegador e Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MANUAL_UDF;
} else if (typeof window !== 'undefined') {
  window.MANUAL_UDF = MANUAL_UDF;
}
