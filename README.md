# Tendências em Ciência da Computação — 2026.2

Repositório oficial das atividades práticas, estudos dirigidos, documentações e projeto final desenvolvidos ao longo do semestre **2026.2** na disciplina **Tendências em Ciência da Computação** (Centro Universitário UDF — Brasília).

**Professora:** Kadidja Valéria  
**Aluno:** Everton Wesley Pereira Oliveira  
**Plano de Aulas:** [PlanodeAulas_Tendencias_EngPrompt_IA_Professora Kadidja_2026_2_5f_Everton.pdf](./PlanodeAulas_Tendencias_EngPrompt_IA_Professora%20Kadidja_2026_2_5f_Everton.pdf)

---

## Visão Geral

O repositório acompanha a evolução completa das **4 unidades da disciplina**, partindo dos fundamentos de Engenharia de Prompt e refinamento iterativo até programação assistida por IA, desenvolvimento *low-code* e a construção de um agente conversacional em 4 camadas aplicado a um problema real do ambiente acadêmico.

### Mapa das Unidades

| Unidade | Tema Principal | Principais Artefatos |
| :---: | :--- | :--- |
| **01** | Engenharia e Refinamento de Prompts | Prompts iterativos, 3 variações, comparação, reflexão crítica e laboratório de refinamento (Sistema de Rastreamento de Equipamentos) |
| **02** | Programação Assistida por IA e Automação | Notebook prático colaborativo (`.ipynb`), estudo sobre *Vibe Coding* e documentação de automação em Python (Jogo da Forca) |
| **03** | Desenvolvimento Low-Code | Documentação do SGE em **Bubble.io** (*low-code* + Agente de IA) e formulário de respostas (`.pdf`) |
| **04** | Projeto Final — Agente de IA e Ética Aplicada | **Assistente do Manual de TCC — UDF** (`bot-duvidas` v2.0.0: agente em 4 camadas, 2 modos, 5 validadores, 52 testes automatizados), entrega teórica e roteiro de apresentação |

---

## Detalhamento por Unidade

### Unidade 01 — Engenharia e Refinamento de Prompts
Estudo prático de construção, comparação e iteração de prompts aplicado ao levantamento de requisitos de um **Sistema de Rastreamento de Equipamentos** em instituições de ensino.

- **Atividade 02 — Construção, Variações e Análise Comparativa:**
  - [readme.md](./Unidade%2001%20/Atividade%2002%20/readme.md) — visão geral e contexto do estudo.
  - [prompts.md](./Unidade%2001%20/Atividade%2002%20/prompts.md) — registro dos prompts utilizados.
  - [variacao1.md](./Unidade%2001%20/Atividade%2002%20/variacao1.md), [variacao2.md](./Unidade%2001%20/Atividade%2002%20/variacao2.md) e [variacao3.md](./Unidade%2001%20/Atividade%2002%20/variacao3.md) — testes de variações de prompt.
  - [comparacao.md](./Unidade%2001%20/Atividade%2002%20/comparacao.md) — análise comparativa entre os resultados obtidos.
  - [reflexao.md](./Unidade%2001%20/Atividade%2002%20/reflexao.md) — reflexão crítica sobre adequação, limitações e melhorias.
- **Atividade 03 — Laboratório de Refinamento de Prompts:**
  - [Atividade_prática_Laboratório_de_Refinamento_de_Prompts.md](./Unidade%2001%20/Atividade%2003/Atividade_pr%C3%A1tica_Laborat%C3%B3rio_de_Refinamento_de_Prompts.md)
  - [Refinamento_de_Prompts.md](./Unidade%2001%20/Atividade%2003/Refinamento_de_Prompts.md)

### Unidade 02 — Programação Assistida por IA e Automação
Exploração de fluxos colaborativos de codificação com apoio de IA, reflexão sobre *Vibe Coding* e desenvolvimento assistido de um jogo da forca em Python.

- [Collaborative_AI_Programming_AtividadePrática.ipynb](./Unidade%2002/Collaborative_AI_Programming_AtividadePr%C3%A1tica.ipynb) — atividade prática em Jupyter Notebook / Google Colab.
- [Programacao_Assistida.md](./Unidade%2002/Programacao_Assistida.md) — análise do estudo *Vibe coding: programming through conversation with artificial intelligence* (Sarkar & Drosos, PPIG 2025).
- [Material_estudante_programacao_assistida_automacao.md](./Unidade%2002/Material_estudante_programacao_assistida_automacao.md) — documentação da atividade prática de programação assistida e automação (jogo da forca em Python com Gemini).

### Unidade 03 — Desenvolvimento Low-Code (Bubble.io)
Documentação técnica e registro de atividade aplicada ao desenvolvimento *low-code* com **Bubble.io + Agente de IA** para o **SGE — Controle de Pátio e Caixa para Estacionamentos**.

- [documenta_o_sge_bubble_low_code.md](./Unidade%2003/documenta_o_sge_bubble_low_code.md) — documentação completa da aplicação SGE no Bubble.io.
- [form_resposta.pdf](./Unidade%2003/form_resposta.pdf) — formulário de entrega/respostas da unidade.

### Unidade 04 — Projeto Final: Assistente do Manual de TCC — UDF (`bot-duvidas` v2.0.0)
Desenvolvimento de um **agente conversacional em 4 camadas** (*Perceptiva → Cognitiva → Decisória → Executiva*) em HTML5, CSS3 e JavaScript puros (zero dependências externas) para consulta às normas do *Manual para Elaboração de Trabalhos Acadêmicos da UDF (2020)* e auditoria determinística de trechos de TCC (**Cruzar Citações × Referências**, **Referências Individual ou Lista A–Z**, **Sumário e Estrutura**, **Citação** e **Resumo/Abstract PT/EN**). Opera em **2 Modos**: **Modo 1 (100% offline, padrão)** com busca Okapi BM25, Interpretabilidade, Memória em 3 dimensões, Guardrails Adversariais e Guia Passo a Passo de Correção offline; e **Modo 2 (Prompt Dinâmico Parametrizado + IA Generativa opcional via Groq/Gemini com *fallback* offline)**.

- [README.md da Unidade 04](./Unidade%2004/README.md) — documentação técnica completa da arquitetura, algoritmo Okapi BM25, 5 validadores e 52 testes automatizados.
- [apresentacao.md](./Unidade%2004/apresentacao.md) — roteiro consolidado das entregas da Unidade IV e da demonstração ao vivo.
- [UNIDADE_IV_AGENTES_ETICA_PROJETO.md](./Unidade%2004/bot-duvidas/UNIDADE_IV_AGENTES_ETICA_PROJETO.md) — entrega teórica e técnica completa alinhada ao Guia de Estudos A1 (agentes, especificação, ética, privacidade e vieses).
- **Código-fonte:** pasta [`Unidade 04/bot-duvidas/`](./Unidade%2004/bot-duvidas/) (`index.html`, `agente.js`, `manual-udf.js`, `testes.js`, `package.json`, `README.md`, `UNIDADE_IV_AGENTES_ETICA_PROJETO.md`, `LICENSE`).

---

## Estrutura do Repositório

```text
Tendencias_Ciencia_Computacao_2026_2/
├── LICENSE
├── PlanodeAulas_Tendencias_EngPrompt_IA_Professora Kadidja_2026_2_5f_Everton.pdf
├── README.md
├── Unidade 01 /
│   ├── Atividade 02 /
│   │   ├── comparacao.md
│   │   ├── prompts.md
│   │   ├── readme.md
│   │   ├── reflexao.md
│   │   ├── variacao1.md
│   │   ├── variacao2.md
│   │   └── variacao3.md
│   └── Atividade 03/
│       ├── Atividade_prática_Laboratório_de_Refinamento_de_Prompts.md
│       └── Refinamento_de_Prompts.md
├── Unidade 02/
│   ├── Collaborative_AI_Programming_AtividadePrática.ipynb
│   ├── Material_estudante_programacao_assistida_automacao.md
│   └── Programacao_Assistida.md
├── Unidade 03/
│   ├── documenta_o_sge_bubble_low_code.md
│   └── form_resposta.pdf
└── Unidade 04/
    ├── README.md
    ├── apresentacao.md
    └── bot-duvidas/
        ├── LICENSE
        ├── README.md
        ├── UNIDADE_IV_AGENTES_ETICA_PROJETO.md
        ├── agente.js
        ├── index.html
        ├── manual-udf.js
        ├── package.json
        └── testes.js
```

---

## Como Executar os Artefatos Práticos

### Notebook da Unidade 02
- Abra `Unidade 02/Collaborative_AI_Programming_AtividadePrática.ipynb` diretamente no **Google Colab**, **Jupyter Notebook** ou **VS Code** (com a extensão Jupyter).

### Assistente do Manual de TCC — Unidade 04 (Modo 1 Offline + Modo 2 Opcional)
1. Navegue até `Unidade 04/bot-duvidas/`.
2. Dê duplo clique em `index.html` para abrir diretamente no navegador (`file://`, sem servidor e sem internet no Modo 1).
3. *(Opcional)* No botão **Prompt Dinâmico / IA**, copie o prompt parametrizado (offline) ou insira uma chave de API gratuita (**Groq** ou **Gemini**) para ativar o Modo 2 com *fallback* automático para o Modo 1 Offline.
4. Para rodar a suíte com os **52 testes automatizados** (Node.js puro, sem `npm install`):
   ```bash
   node "Unidade 04/bot-duvidas/testes.js"
   ```
   Ou, dentro da pasta `Unidade 04/bot-duvidas/`:
   ```bash
   npm test
   ```

---

## Licenças

- **Repositório geral:** licenciado sob **CC0 1.0 Universal (Domínio Público)**, conforme o arquivo [LICENSE](./LICENSE).
- **Projeto `Unidade 04/bot-duvidas/`:** distribuído sob a **Licença MIT**, conforme [Unidade 04/bot-duvidas/LICENSE](./Unidade%2004/bot-duvidas/LICENSE).
