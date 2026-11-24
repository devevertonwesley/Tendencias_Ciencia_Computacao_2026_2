# Assistente do Manual de TCC — UDF

![Offline](https://img.shields.io/badge/Execu%C3%A7%C3%A3o-100%25%20Offline-0f2c59?style=flat-square)
![Sem IA](https://img.shields.io/badge/Motor-Sem%20IA%20Generativa-1d4ed8?style=flat-square)
![Sem API](https://img.shields.io/badge/Depend%C3%AAncias-Sem%20API%20%7C%20Zero%20CDN-0369a1?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-HTML%20%2B%20CSS%20%2B%20JS%20Puros-334155?style=flat-square)
![Normas](https://img.shields.io/badge/Padr%C3%A3o-ABNT%20%2F%20UDF%202020-166534?style=flat-square)
![Testes](https://img.shields.io/badge/Testes-Node.js%20Puro%20(27%20casos)-15803d?style=flat-square)

Chatbot determinístico, leve e 100% offline para consultar todas as normas do **Manual de Elaboração de Trabalhos Acadêmicos da UDF (Brasília, 2020)** e validar automaticamente trechos reais de TCC (Resumo, Citação, Referência e Estrutura) diretamente no navegador — sem IA generativa, sem API, sem servidor e sem instalação de pacotes.

---

## 1. Visão Geral e Motivação

Durante a redação de um Trabalho de Conclusão de Curso (TCC), estudantes frequentemente interrompem a escrita para conferir detalhes recorrentes das normas da ABNT: tamanho das margens, número mínimo de palavras no resumo, uso de `et al.` ou `apud`, formatação de citações diretas longas e modelos de referências de sites, leis ou artigos. Consultar PDFs extensos a cada dúvida é lento e propenso a erros.

O **Assistente do Manual de TCC — UDF** resolve esse problema oferecendo em uma única interface web offline:
- **Consulta instantânea** por navegação estruturada (capítulos e subtópicos) ou busca em linguagem natural via algoritmo **Okapi BM25**.
- **Validação automática e determinística** de trechos reais do TCC colados pelo estudante, devolvendo um checklist objetivo com indicação exata da seção e da página do manual.

### Público-alvo
Estudantes de graduação e pós-graduação, orientadores e revisores acadêmicos que precisam de um guia rápido, confiável e fiel ao padrão institucional da UDF.

### Fonte oficial exclusiva
Todo o conteúdo, exemplos e regras de validação foram extraídos fielmente de:

> **BIBLIOTECA GOVERNADOR EURICO REZENDE (UDF).** *Manual para elaboração de trabalhos acadêmicos: compilação das normas da ABNT.* Brasília: Centro Universitário do Distrito Federal – UDF, 2020.

**Normas ABNT compiladas no manual:**
- `ABNT NBR 6023:2018` — Informação e documentação: referências (elaboração)
- `ABNT NBR 6024:2003` — Numeração progressiva das seções de um documento escrito
- `ABNT NBR 6027:2003` — Sumário (apresentação)
- `ABNT NBR 6028:2003` — Resumo (apresentação)
- `ABNT NBR 6034:2004` — Índice (apresentação)
- `ABNT NBR 10520:2002` — Citações em documentos (apresentação)
- `ABNT NBR 12225:2004` — Lombada (apresentação)
- `ABNT NBR 14724:2011` — Trabalhos acadêmicos (apresentação)

---

## 2. Funcionalidades Principais

- **Navegação pelos 4 capítulos e seus subtópicos:** sidebar dedicada no desktop (e drawer retrátil no mobile) com acesso direto aos 4 grandes blocos do manual e chips clicáveis para explorar subtópicos relacionados.
- **Busca em linguagem natural ou por número de seção:** entende desde termos curtos (*"margens"*, *"apud"*) e números exatos (*"seção 3.4.2"*, *"1.8"*) até perguntas longas (*"como faço para colocar uma citação direta com mais de três linhas no meu trabalho?"*).
- **Validador determinístico para 4 tipos de trechos:** verifica automaticamente **Resumo**, **Citação**, **Referência** e **Estrutura do TCC**, gerando relatório com status geral (`Aprovado`, `Aprovado com ressalvas` ou `Necessita correções`) e selos `[OK]`, `[ATENÇÃO]` e `[FALTA/ERRO]`.
- **Cópia rápida de modelos ABNT:** blocos destacados de exemplos oficiais com botão **"Copiar"** e confirmação visual (`Copiado!`).
- **Interface moderna com tema claro e escuro:** alternância entre Light Mode e Dark Mode via variáveis CSS puras, opção de **Nova conversa** e ícones 100% em SVG inline.
- **100% offline e zero dependências:** funciona abrindo `index.html` com duplo clique, sem internet, sem CDN e sem `npm install`.

---

## 3. Cobertura Completa do Conteúdo (Mapa do Manual)

| Capítulo | Páginas | Conteúdo coberto em `manual-udf.js` |
| :--- | :---: | :--- |
| **1. Estrutura do TCC** | 6–11 | Divisão entre **Parte Externa** e **Parte Interna** (Pré-textuais, Textuais e Pós-textuais).<br>**Obrigatórios (10):** Capa, Folha de Rosto, Folha de Aprovação, Resumo na língua vernácula, Resumo em língua estrangeira, Sumário, Introdução, Desenvolvimento, Conclusão e Referências.<br>**Opcionais (13):** Lombada, Errata, Dedicatória, Agradecimentos, Epígrafe, Lista de ilustrações, Lista de tabelas, Lista de abreviaturas e siglas, Lista de símbolos, Glossário, Apêndice (elaborado pelo autor), Anexo (não elaborado pelo autor) e Índice.<br>Inclui ordem exata de Capa (`1.1`) e Folha de Rosto (`1.2`), regras do Resumo (`1.8`: 150–500 palavras, parágrafo único, 3ª pessoa, `Palavras-chave:`), Sumário (`1.14`) e Apêndice vs. Anexo (`1.17–1.18`). |
| **2. Referências (NBR 6023:2018)** | 12–31 | Regras gerais (alinhamento à esquerda, espaço simples, 1 linha em branco entre referências).<br>**Autoria (`2.1`):** pessoa física (1 a 3 autores separados por `;`, 4+ com todos ou 1º + `et al.`, `(Org.)`, `(Coord.)`, `(Comp.)`, `(Ed.)`), pessoa jurídica (extenso, sigla > 4 letras, órgão subordinado) e autor desconhecido (entrada pelo título; proibição de `"Anônimo"`).<br>**Ordenação (`2.2`):** Sistema Alfabético (traço sublinear de 6 espaços para mesma autoria) e Sistema Numérico.<br>**Todos os 20 modelos (`2.3.1`–`2.3.20`):** Artigo de periódico, Periódico online, Artigo de jornal, Jornal online, Bases de dados online, Blog, Capítulo de livro, Documento sonoro (CD, entrevista/palestra, música), E-books, Entrevista pessoal, Filme cinematográfico, Home page (sites), Ilustração, Jurisprudência, Legislação (leis, códigos, constituições e emendas), Livro, Norma técnica, Processo judicial, Trabalho acadêmico (TCC/dissertação/tese) e Trabalho de evento.<br>**Dados desconhecidos (`2.4`):** `[Cidade]`, `[S.l.]`, `[s.n.]`, `[S.l.: s.n.]`, omissão de editora igual ao autor e tabela completa de datas aproximadas (`[1973]`, `[1969?]`, `[1971 ou 1972]`, `[entre 1906 e 1912]`, `[ca. 1960]`, `[197-]`, `[197-?]`, `[18--]`, `[18--?]`). |
| **3. Citações (NBR 10520)** | 32–39 | **Sistemas de chamada (`3.1`):** Autor-Data (incl. sobrenomes iguais `3.1.1.1` e mesmo autor/mesmo ano com `a`/`b` `3.1.1.2`) e Numérico (`3.1.2`, proibido com notas explicativas; proibido misturar os dois sistemas).<br>**Notas de rodapé (`3.2`):** Notas de referência (`Id.`/`Idem`, `Ibid.`/`Ibidem`, `op. cit.`, `apud`) e Notas explicativas (nunca misturar).<br>**Tipos de citação:** Indireta (`3.3`), Direta curta (`3.4.1`: até 3 linhas, aspas duplas, aspas simples internas), Direta longa (`3.4.2`: > 3 linhas, recuo de 4 cm, fonte 10 ou 11, espaço simples, sem aspas) e Citação de citação (`3.5`: `apud`).<br>**Apresentação (`3.6`):** Supressão `[...]`, Interpolação `[acréscimo]` e Ênfase/Destaque (`grifo nosso` / `grifo do autor`). |
| **4. Formatação e Paginação (NBR 14724)** | 40–41 | **Formato (`4.1`):** papel A4 (21 × 29,7 cm), cor preta (outras cores só em ilustrações), margens 3 cm (esquerda/superior) e 2 cm (direita/inferior — invertidas no verso), fonte 12 (menor e uniforme para citações longas, rodapé, paginação, catalogação e legendas).<br>**Espaçamento (`4.2`):** 1,5 no texto geral; espaço simples em citações longas, rodapé, referências, legendas e natureza na folha de rosto; filete de 5 cm nas notas de rodapé (`4.2.1`); indicativos de seção (`4.2.2`), títulos sem número centralizados (`4.2.3`) e elementos sem título/número (`4.2.4`).<br>**Paginação (`4.3`):** pré-textuais contadas a partir da folha de rosto, sem exibir número; algarismos arábicos a partir da Introdução, canto superior direito, a 2 cm da borda superior e 2 cm da borda direita. |

---

## 4. Arquitetura Técnica e Como Funciona a Busca sem IA

O motor em `agente.js` opera de forma **100% determinística**, sem modelos probabilísticos externos nem chamadas de rede:

<img width="3655" height="1536" alt="mermaid-diagram-2026-11-24-150746" src="https://github.com/user-attachments/assets/49914c61-6eff-4af6-bddd-b99932745481" />

### Pipeline de processamento textual
1. **Normalização:** converte para minúsculas, remove diacríticos (`normalize('NFD')`) e elimina pontuações irrelevantes.
2. **Remoção de stopwords:** descarta palavras funcionais frequentes (*"como"*, *"qual"*, *"para"*, *"no"*, *"fazer"*) para manter o foco nos termos técnicos.
3. **Expansão de sinônimos acadêmicos:** aplica o dicionário `MANUAL_UDF.sinonimos` (suportando termos simples e compostos, como `abstract → resumo lingua estrangeira`, `site → home page sites`, `mais de 3 autores → mais tres autores pessoa fisica`, `recuo → citacao direta longa`).
4. **Redução a radicais simples (5 caracteres):** unifica flexões (*"margem"* e *"margens"* → `marge`, *"citação"* e *"citações"* → `citac`).
5. **Pontuação Okapi BM25 (`k1 = 1.5`, `b = 0.75`, `PESO_TITULO = 2.5`):** calcula a relevância de cada tópico combinando frequência ponderada do termo (com peso **2,5x** no título e número da seção), raridade no manual (`IDF`) e normalização pelo tamanho do texto.

### Por que BM25 em vez de contagem simples de palavras?
- **Não penaliza perguntas longas:** em fórmulas simples (`palavras em comum / total da pergunta`), uma frase contextualizada como *"como faço para colocar uma citação direta com mais de três linhas no meu trabalho?"* dilui a pontuação; no BM25, os termos relevantes somam evidência sem serem punidos pelo tamanho da frase.
- **Valoriza termos técnicos raros:** palavras específicas como `apud`, `lombada`, `150` ou `filete` recebem IDF muito maior do que palavras genéricas presentes em vários capítulos.
- **Saturação controlada:** evita que um tópico muito longo vença apenas por repetir a mesma palavra várias vezes.

---

## 5. Como Funciona o Validador Determinístico de TCC

Cada validador aplica regras verificáveis extraídas diretamente do Manual da UDF (2020) e classifica o texto como **Aprovado** (0 erros e 0 atenções), **Aprovado com ressalvas** (0 erros e ≥ 1 atenção) ou **Necessita correções** (≥ 1 erro):

| Validador | Critérios `[OK]` | Critérios `[ATENÇÃO]` | Critérios `[FALTA/ERRO]` | Limites técnicos |
| :--- | :--- | :--- | :--- | :--- |
| **Resumo** (`Seção 1.8`) | 150 a 500 palavras no corpo; parágrafo único; `Palavras-chave:` presentes, separadas e encerradas por ponto; ausência de 1ª pessoa; indícios de objetivo, método, resultados e conclusão. | Múltiplos parágrafos antes das palavras-chave; ausência aparente de algum dos 4 elementos de conteúdo (objetivo, método, resultados ou conclusão). | Menos de 150 ou mais de 500 palavras; `Palavras-chave:` ausentes, vazias, com vírgula/ponto e vírgula ou sem ponto final; uso de 1ª pessoa (`eu`, `nós`, `desenvolvi`, `meu` etc.). | Verifica presença lexical de termos indicativos dos 4 elementos; não avalia qualidade científica da redação. |
| **Citação** (`Seção 3`) | Classificação estimada correta; aspas duplas em direta curta (≤ 3 linhas) ou sem aspas em longa (> 3 linhas) e indireta; chamada Autor-Data em CAIXA ALTA nos parênteses com ano de 4 dígitos; `p.` presente nas diretas; supressão com `[...]`; `apud` com dois anos. | Uso de sistema numérico (alerta contra notas explicativas); `apud` sem os dois anos identificáveis. | Aspas duplas em citação direta longa; aspas incompletas na curta; sobrenome em minúsculas dentro dos parênteses; ausência de chamada ou de ano; falta de `p.` em citação direta; mistura de Autor-Data e Numérico; reticências soltas `...` sem colchetes. | Estima o número de linhas considerando ~80 caracteres por linha em folha A4/fonte 12; recuo de 4 cm e fonte 10/11 devem ser conferidos no editor. |
| **Referência** (`Seção 2`) | Entrada inicial em CAIXA ALTA; múltiplos autores separados por `;`; ano presente (4 dígitos ou colchetes); `Disponível em:` e `Acesso em:` (com data abreviada) em URLs; local e editora (`Cidade: Editora` ou `[S.l.]`/`[s.n.]`). | Data em `Acesso em:` fora do padrão abreviado (`24 out. 2026`); ausência do padrão `Cidade: Editora` em obras não online. | Uso proibido do termo `"Anônimo"`; entrada inicial fora de CAIXA ALTA; separação de autores com `e` ou `&`; ausência de ano; URL sem `Disponível em:` ou sem `Acesso em:`. | Não valida formatação tipográfica de negrito/itálico (texto puro) nem confirma existência real da obra. |
| **Estrutura do TCC** (`Seção 1`) | Todos os 10 elementos obrigatórios presentes (Capa, Folha de Rosto, Folha de Aprovação, Resumo, Abstract/Resumo em língua estrangeira, Sumário, Introdução, Desenvolvimento, Conclusão e Referências); opcionais identificados; nenhum pré-textual numerado. | *(Todos os desvios estruturais são classificados como obrigatórios/erro para máxima clareza.)* | Qualquer elemento obrigatório ausente; elementos pré-textuais (ex.: `1 Resumo`, `2 Sumário`) numerados indevidamente no sumário. | Baseia-se nos nomes/títulos das seções coladas pelo estudante (aceita variações comuns de Desenvolvimento como *Referencial Teórico*, *Metodologia* e *Considerações Finais* para Conclusão). |

---

## 6. Estrutura de Arquivos do Projeto

```text
bot-duvidas/
├── index.html       # App web responsivo em tela cheia (sidebar + drawer mobile, Light/Dark Mode, SVGs inline, cópia rápida e relatórios visuais)
├── manual-udf.js    # Base completa e estruturada dos 4 capítulos do Manual de TCC da UDF (2020) + dicionário de sinônimos ABNT
├── agente.js        # Indexador textual, motor de busca Okapi BM25, fluxo conversacional e os 4 validadores determinísticos
├── testes.js        # Suíte com 27 testes automatizados em Node.js puro (assert nativo, zero dependências)
├── README.md        # Documentação técnica completa do projeto
└── LICENSE          # Licença MIT
```

---

## 7. Como Executar, Testar e Publicar

### Executar localmente no navegador (sem servidor)
1. Clone ou baixe o repositório.
2. Abra `index.html` diretamente no navegador (duplo clique no arquivo).
3. Não há etapa de build, instalação ou conexão com a internet.

### Rodar os testes automatizados (Node.js puro)
A partir da pasta do projeto, execute:

```bash
node testes.js
```

**Saída esperada:** `Resultado: 27 de 27 aprovados`

**O que a suíte cobre:**
- Saudação inicial e navegação pelos 4 capítulos com verificação dos subtópicos retornados.
- Busca exata por número de seção (`seção 3.4.2`, `1.8`).
- Busca BM25 com perguntas curtas, longas, sinônimos (`abstract`, `site`, `mais de 3 autores`, `Constituição`), diferenciação entre apêndice/anexo e respostas fora do escopo.
- Validador de Resumo (válido, curto/1ª pessoa/sem palavras-chave, longo/separador inválido).
- Validador de Citação (direta curta válida, longa com aspas/minúscula/sem página/reticências soltas, indireta e `apud`).
- Validador de Referência (livro e online válidos, rejeição de `"Anônimo"` e URL sem `Disponível em:` / `Acesso em:`).
- Validador de Estrutura (10 obrigatórios + opcionais aprovados; faltantes e pré-textuais numerados reprovados).
- Fluxo interativo (`/validar citacao` + texto na mensagem seguinte) e fluxo inline (`validar referencia: ...`).

### Publicar no GitHub Pages
1. Envie o conteúdo da pasta `bot-duvidas/` para um repositório no GitHub.
2. Acesse **Settings → Pages** no repositório.
3. Em **Build and deployment**, selecione **Deploy from a branch**, escolha a branch principal (`main`) e a pasta raiz (`/`).
4. Salve e aguarde alguns instantes para o site estático entrar no ar.

---

## 8. Guia Rápido de Uso e Exemplos de Comandos

| Objetivo | Exemplo do que digitar ou clicar | Resultado esperado |
| :--- | :--- | :--- |
| **Navegar por capítulo** | Clique em `2. Referências` na sidebar | Exibe o resumo do capítulo e chips de todos os subtópicos/modelos |
| **Pergunta curta** | `qual o tamanho da margem?` | Abre `4.1 Formato, Papel, Margens e Fonte` (3 cm / 2 cm, A4, fonte 12) |
| **Pergunta longa** | `como faço para colocar uma citação direta com mais de três linhas no meu trabalho?` | Abre `3.4.2 Citação Direta Longa` (recuo 4 cm, fonte 10/11, sem aspas) |
| **Busca por seção** | `seção 3.4.2` ou `1.8` ou `2.3.12` | Abre diretamente a seção correspondente do manual |
| **Validar Resumo (direto)** | `validar resumo: Este trabalho analisa... Palavras-chave: Direito. ABNT.` | Executa o checklist completo da Seção 1.8 na mesma mensagem |
| **Validar Citação (interativo)** | Clique em `Validar Citação` na sidebar e cole o trecho na mensagem seguinte | Classifica e valida aspas, CAIXA ALTA, página, `[...]` e `apud` |
| **Validar Referência (direto)** | `validar referencia: LAKATOS, Eva Maria; MARCONI, Marina de Andrade...` | Confere entrada, `;`, ano, campos online e local/editora |
| **Validar Estrutura (interativo)** | Clique em `Validar Estrutura do TCC` e cole o sumário/lista de seções | Verifica os 10 elementos obrigatórios, opcionais e pré-textuais |
| **Cancelar validação** | Clique no `×` no indicador do topo ou digite `cancelar` | Sai do modo validador e volta para `Consulta ao Manual` |

---

## 9. Interface, Acessibilidade e Privacidade

- **UX/UI focado em leitura e produtividade:** layout em tela cheia (`100dvh`) com sidebar de navegação única (zero botões duplicados), tela inicial limpa com 4 perguntas rápidas, área de leitura centralizada (`max-width: 820px`), ajuste automático de altura do campo de entrada e suporte completo a **Light Mode** e **Dark Mode**.
- **Acessibilidade:** navegação por teclado com `:focus-visible` de alto contraste, contraste WCAG AA nos dois temas, semântica HTML5, atributos ARIA (`role="log"`, `aria-live="polite"`, `aria-pressed`, `aria-expanded`, `aria-controls`) e respeito a `prefers-reduced-motion`.
- **Privacidade por arquitetura:** toda a execução acontece **100% localmente no navegador**. Nenhum texto do TCC do estudante é enviado para servidores externos, APIs de terceiros ou armazenado em banco de dados ou `localStorage` — ao clicar em **Nova conversa** ou recarregar a página, o histórico da sessão é descartado da memória.

---

## 10. Limitações Conhecidas (Transparência Técnica)

- **Busca lexical sem compreensão semântica (sem IA):** o BM25 depende da coincidência de radicais e do dicionário de sinônimos; perguntas formuladas sem nenhum termo próximo ao vocabulário da ABNT podem exigir reformulação ou navegação pela sidebar.
- **Validação baseada em regras heurísticas de texto puro:** o validador confere padrões objetivos da norma (extensão, pontuação, caixa alta, termos obrigatórios), mas não avalia mérito científico, coesão argumentativa, ortografia ou formatação visual de arquivos `.docx` (como margens reais em centímetros, negrito ou itálico).
- **Estimativa aproximada de linhas em citações:** a separação entre citação direta curta (até 3 linhas) e longa (mais de 3 linhas) utiliza a aproximação de ~80 caracteres por linha em página A4 com fonte 12.
- **Referência normativa de 2020:** o conteúdo reflete fielmente o Manual da UDF publicado em 2020. Recomenda-se sempre a revisão final junto ao professor orientador e eventuais atualizações publicadas pela Biblioteca da UDF.

---

## 11. Como Estender ou Atualizar o Manual

1. **Adicionar ou editar tópicos (`manual-udf.js`):** inclua um novo objeto no array `MANUAL_UDF.topicos` seguindo o formato:
   ```javascript
   {
     id: '2-3-21-novo-modelo',
     capitulo: 'referencias', // 'estrutura' | 'referencias' | 'citacoes' | 'apresentacao'
     secao: '2.3.21',
     secoes: ['2.3.21'],
     titulo: '2.3.21 Novo Modelo de Documento',
     paginas: 'pág. XX',
     conteudo: 'Descrição da regra e estrutura...',
     exemplos: 'EXEMPLO, Autor. Título...'
   }
   ```
   O índice BM25 em `agente.js` passará a indexar o novo tópico automaticamente.
2. **Ampliar cobertura de busca (`manual-udf.js`):** adicione novos pares em `MANUAL_UDF.sinonimos` (chaves em minúsculas e sem acento).
3. **Garantir regressão zero (`testes.js`):** registre novos testes com `registrarTeste(...)` e execute `node testes.js` para validar todas as regras.

---

## 12. Licença e Créditos

- **Licença:** distribuído sob a [Licença MIT](LICENSE).
- VALÉRIA, Kadidja. **Guia de Estudos A1: Criação de Agentes de IA e Ética Aplicada — Síntese da Unidade 4.** Material orientativo, UDF, 2026.
- SERPRO. **Serpro Bots — Desenvolvendo Chatbots: Fluxo de Trabalho.** Disponível em: <https://serprobots.estaleiro.serpro.gov.br/docs/dev/>. Acesso em: nov. 2026.
- **Créditos do conteúdo normativo:** *Manual para Elaboração de Trabalhos Acadêmicos: compilação das normas da ABNT* — Organização: **Biblioteca Governador Eurico Rezende**, Centro Universitário do Distrito Federal (**UDF**), Brasília, 2020.

- **Uso de IA:** o código e a documentação foram desenvolvidos com apoio de IA generativa (Gemini) e revisados pela equipe.
