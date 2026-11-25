# Tendências em Ciência da Computação — 2026.2

Repositório oficial das atividades práticas, estudos dirigidos, documentações e projeto final desenvolvidos ao longo do semestre **2026.2** na disciplina **Tendências em Ciência da Computação** (Centro Universitário UDF — Brasília).

**Professora:** Kadidja Valéria  
**Aluno:** Everton Wesley Pereira Oliveira  
**Plano de Aulas:** [PlanodeAulas_Tendencias_EngPrompt_IA_Professora Kadidja_2026_2_5f_Everton.pdf](./PlanodeAulas_Tendencias_EngPrompt_IA_Professora%20Kadidja_2026_2_5f_Everton.pdf)

---

## Visão Geral

O repositório acompanha a evolução completa das **4 unidades da disciplina**, partindo dos fundamentos de Engenharia de Prompt e refinamento iterativo até programação assistida por IA, desenvolvimento *low-code* e a construção de um agente conversacional determinístico aplicado a um problema real do ambiente acadêmico.

### Mapa das Unidades

| Unidade | Tema Principal | Principais Artefatos |
| :---: | :--- | :--- |
| **01** | Engenharia e Refinamento de Prompts | Prompts iterativos, variações, comparação, reflexão crítica e laboratório de refinamento |
| **02** | Programação Assistida por IA e Automação | Notebook prático colaborativo (`.ipynb`) e documentação de programação assistida |
| **03** | Desenvolvimento Low-Code | Documentação do SGE em Bubble (*low-code*) e formulário de respostas (`.pdf`) |
| **04** | Projeto Final — Agente Conversacional e Ética | **Assistente do Manual de TCC — UDF** (chatbot 100% offline), testes automatizados e roteiro de apresentação |

---

## Detalhamento por Unidade

### Unidade 01 — Engenharia e Refinamento de Prompts
Prática estruturada de criação, comparação e iteração de prompts com definição de contexto, restrições, formato de saída e análise crítica de limitações e vieses.

- **Atividade 02 — Construção, Variações e Análise Comparativa:**
  - [readme.md](./Unidade%2001%20/Atividade%2002%20/readme.md) — visão geral e contexto da atividade.
  - [prompts.md](./Unidade%2001%20/Atividade%2002%20/prompts.md) — registro dos prompts utilizados.
  - [variacao1.md](./Unidade%2001%20/Atividade%2002%20/variacao1.md), [variacao2.md](./Unidade%2001%20/Atividade%2002%20/variacao2.md) e [variacao3.md](./Unidade%2001%20/Atividade%2002%20/variacao3.md) — testes de variações de prompt.
  - [comparacao.md](./Unidade%2001%20/Atividade%2002%20/comparacao.md) — análise comparativa entre os resultados obtidos.
  - [reflexao.md](./Unidade%2001%20/Atividade%2002%20/reflexao.md) — reflexão crítica sobre adequação, limitações e melhorias.
- **Atividade 03 — Laboratório de Refinamento de Prompts:**
  - [Atividade_prática_Laboratório_de_Refinamento_de_Prompts.md](./Unidade%2001%20/Atividade%2003/Atividade_pr%C3%A1tica_Laborat%C3%B3rio_de_Refinamento_de_Prompts.md)
  - [Refinamento_de_Prompts.md](./Unidade%2001%20/Atividade%2003/Refinamento_de_Prompts.md)

### Unidade 02 — Programação Assistida por IA e Automação
Exploração de fluxos colaborativos de codificação com apoio de IA e automação de tarefas de desenvolvimento.

- [Collaborative_AI_Programming_AtividadePrática.ipynb](./Unidade%2002/Collaborative_AI_Programming_AtividadePr%C3%A1tica.ipynb) — atividade prática em Jupyter Notebook / Google Colab.
- [Programacao_Assistida.md](./Unidade%2002/Programacao_Assistida.md) — registros e síntese da prática.
- [Material_estudante_programacao_assistida_automacao.md](./Unidade%2002/Material_estudante_programacao_assistida_automacao.md) — material de apoio do estudante.

### Unidade 03 — Desenvolvimento Low-Code (Bubble)
Documentação técnica e registro de atividade aplicada ao desenvolvimento *low-code* com a plataforma Bubble para o Sistema de Gerenciamento de Estacionamento (SGE).

- [documenta_o_sge_bubble_low_code.md](./Unidade%2003/documenta_o_sge_bubble_low_code.md) — documentação do projeto SGE em Bubble.
- [form_resposta.pdf](./Unidade%2003/form_resposta.pdf) — formulário de entrega/respostas da unidade.

### Unidade 04 — Projeto Final: Assistente do Manual de TCC — UDF
Desenvolvimento de um chatbot determinístico, leve e **100% offline** em HTML, CSS e JavaScript puros (sem IA generativa em execução, sem API e sem servidor) para consulta às normas do *Manual para Elaboração de Trabalhos Acadêmicos da UDF (2020)* e validação automática de trechos de TCC (Resumo/Abstract, Citação, Referência, Sumário/Estrutura e Cruzamento Citações × Referências).

- [README.md da Unidade 04](./Unidade%2004/README.md) — documentação técnica completa da arquitetura, algoritmo Okapi BM25, validadores e testes.
- [apresentacao.md](./Unidade%2004/apresentacao.md) — roteiro consolidado das entregas e da demonstração ao vivo.
- **Código-fonte:** pasta [`Unidade 04/Chatbot - duvidas/bot-duvidas/`](./Unidade%2004/Chatbot%20-%20duvidas/bot-duvidas/) (`index.html`, `agente.js`, `manual-udf.js`, `testes.js`).

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
    └── Chatbot - duvidas/
        └── bot-duvidas/
            ├── LICENSE
            ├── README.md
            ├── agente.js
            ├── index.html
            ├── manual-udf.js
            └── testes.js
```

---

## Como Executar os Artefatos Práticos

### Notebook da Unidade 02
- Abra `Unidade 02/Collaborative_AI_Programming_AtividadePrática.ipynb` diretamente no **Google Colab**, **Jupyter Notebook** ou **VS Code** (com a extensão Jupyter).

### Chatbot da Unidade 04 (100% Offline)
1. Navegue até `Unidade 04/Chatbot - duvidas/bot-duvidas/`.
2. Dê duplo clique em `index.html` para abrir diretamente no navegador (sem servidor e sem internet).
3. Para rodar a suíte de testes automatizados (Node.js puro, sem `npm install`):
   ```bash
   node "Unidade 04/Chatbot - duvidas/bot-duvidas/testes.js"
   ```

---

## Licença

Este repositório está licenciado nos termos do arquivo [LICENSE](./LICENSE).
