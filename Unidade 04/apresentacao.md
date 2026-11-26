# Projeto Final — Tendências de Ciência da Computação

**Disciplina:** Tendências de Ciência da Computação — Unidade 4  
**Professora:** Kadidja Valéria  
**Projeto:** Assistente do Manual de TCC — UDF (`bot-duvidas` v2.0.0)  
**Aluno:** Everton Wesley Pereira Oliveira

## Links do Projeto

- **Repositório GitHub:** [Tendencias_Ciencia_Computacao_2026_2](https://github.com/devevertonwesley/Tendencias_Ciencia_Computacao_2026_2)
- **Documentação (`README.md`):** [README.md — Unidade 04](https://github.com/devevertonwesley/Tendencias_Ciencia_Computacao_2026_2/blob/main/Unidade%2004/README.md)

---

## 1. 05/11 — Criação de Agentes de IA *(1,0 ponto)*

- Desenvolvimento de um **agente conversacional em 4 camadas** em JavaScript puro (`agente.js`) para um domínio específico: o *Manual para Elaboração de Trabalhos Acadêmicos da UDF (2020)*.
- **Diferença para um modelo generativo isolado (*Carraro, 2023*):** em vez de gerar texto solto sem controle, o agente executa ação coordenada sobre uma base normativa oficial, mantém memória de sessão, aplica guardrails éticos e audita trechos reais do TCC.
- **Arquitetura em 4 Camadas com Interpretabilidade (*Murta, 2023*):**
  1. **Camada Perceptiva:** recebe texto, cliques ou comandos (até **15.000 caracteres**), sanitiza a entrada e aplica normalização Unicode NFD.
  2. **Camada Cognitiva:** classifica a intenção, consulta a **Memória Curta/Média**, remove stopwords, expande **102 sinônimos ABNT** (`abstract`, `margem`, `site`, `et al`, `apud`, `recuo`), extrai radicais de 5 caracteres e ranqueia tópicos via **Okapi BM25** (`k1 = 1.5`, `b = 0.75`, peso **2,5x** para títulos/seções).
  3. **Camada Decisória:** aplica **guardrails adversariais**, valida o limiar BM25 (`>= 0.9`, recusando responder fora da norma para evitar alucinações) e aciona as regras do Manual UDF ou os **5 validadores**.
  4. **Camada Executiva:** entrega a regra oficial (seção, página e exemplos), relatório visual, **Guia Passo a Passo de Correção offline**, **Prompt Dinâmico** e o bloco recolhível **"Ver raciocínio das 4 camadas"**.
- **Gestão de Memória em 3 Dimensões:**
  - **Curta:** janela de até **12 mensagens (6 trocas)** em RAM para acompanhamento contextual (*"qual a página?"*, *"e o exemplo?"*).
  - **Média:** resumo estruturado da sessão (capítulos visitados, tópicos consultados, validações, erros frequentes e feedbacks), sem armazenar o texto integral do TCC.
  - **Longa:** desativada por padrão (*Privacy by Design*, zero gravação em `localStorage`/cookies).
- **Engenharia de Prompt Dinâmico (*Mello, 2024*):** `gerarPromptDinamico()` combina regras rígidas do Manual UDF (2020) com contexto injetado em tempo real (seções BM25, Memória Curta/Média e relatório de auditoria).

---

## 2. 12/11 — Chatbot, Ferramentas e Especificação *(1,0 ponto)*

- **Problema resolvido:** dificuldade e perda de tempo dos estudantes ao consultar normas ABNT/UDF em um PDF de 42 páginas e revisar consistência de citações, referências e estrutura durante a escrita do TCC.
- **Público-alvo:** estudantes de graduação e pós-graduação, orientadores e revisores acadêmicos da UDF.
- **Base oficial (`manual-udf.js`):** **4 capítulos completos**, **52 tópicos**, **102 sinônimos ABNT** e **8 normas ABNT** compiladas no Manual da UDF (2020) — Estrutura do TCC, Referências (20 modelos da NBR 6023:2018), Citações (NBR 10520:2002) e Formatação/Paginação (NBR 14724:2011), além das NBRs 6024, 6027, 6028, 6034 e 12225.
- **Comparativo de ferramentas e especificação (`UNIDADE_IV_AGENTES_ETICA_PROJETO.md`):** análise frente a Dialogflow, Rasa, Botpress/ManyChat e Copilot Studio; especificação formal com requisitos **RF01–RF12**, **RNF01–RNF04** e máquina de estados.
- **Stack e operação em 2 Modos:** HTML5, CSS3 e JavaScript puros, **zero dependências externas e zero CDN** (ícones SVG inline):
  - **Modo 1 (padrão — 100% offline):** funciona com duplo clique em `index.html` (`file://`) ou via GitHub Pages, sem servidor e sem API.
  - **Modo 2 (Prompt Dinâmico / IA opcional):** copia o prompt parametrizado em 1 clique (offline) ou consulta API gratuita opcional (**Groq Llama 3.3** ou **Gemini**, chave mantida apenas na RAM da aba) com *fallback* automático para o Modo 1 Offline.
- **Principais recursos:**
  - Navegação pelos 4 capítulos na sidebar (e drawer mobile) + chips clicáveis de subtópicos.
  - Busca livre em linguagem natural e busca direta por seção (`3.4.2`, `1.8`, `2.3.12`), com botão **Copiar** nos exemplos oficiais.
  - **5 validadores determinísticos** (suporte a até 15.000 caracteres, chip **`Testar com exemplo`** e **Guia Passo a Passo de Correção offline**):
    1. **Cruzar Citações × Referências** (consistência texto ↔ lista, `apud`, `et al.`, `______.`, mistura de sistemas).
    2. **Referências (individual ou lista A–Z)** (ordem alfabética, duplicatas, proibição de `"Anônimo"`, `Disponível em:` / `Acesso em:`).
    3. **Sumário e Estrutura** (10 obrigatórios, 13 opcionais, numeração progressiva sem saltos, `APÊNDICE A –` / `ANEXO A –`).
    4. **Citação** (direta curta, longa, indireta, `apud`, CAIXA ALTA, `p.`, `[...]`).
    5. **Resumo e Abstract (PT/EN)** (detecção automática de idioma, 150–500 palavras, parágrafo único, 1ª pessoa PT/EN, `Palavras-chave:`/`Keywords:` e 4 pilares).

---

## 3. 19/11 — Viés Algorítmico, Ética e Responsabilidade Social *(1,0 ponto)*

- **Privacidade em 3 Anéis (*Lee, Goldberg & Kohane, 2024*) e LGPD (Lei nº 13.709/2018):**
  - *Coleta Mínima:* no Modo 1, nenhum trecho inédito do TCC sai da máquina; a Memória Média guarda apenas metadados técnicos (títulos e categorias de erro).
  - *Zero armazenamento em repouso:* sem `localStorage`, cookies ou banco externo; no Modo 2 opcional, o tráfego usa HTTPS e a chave fica somente na RAM da aba.
  - *Sem uso secundário:* envio externo exige ação e consentimento explícito (*opt-in*).
- **Anatomia do Viés Algorítmico mapeada no próprio projeto (*Barcaui, 2025*):**
  - **Viés de Dados:** base congelada no Manual UDF 2020 (ex.: diferenças em relação à NBR 10520:2023) e dicionário limitado a 102 sinônimos.
  - **Viés de Algoritmo:** radicais de 5 caracteres, estimativa de 80 caracteres/linha para citações, regex ocidental de sobrenomes e lista fechada de 1ª pessoa.
  - **Viés de Aplicação (*Automation Bias*):** risco de uso fora da UDF ou confiança excessiva no selo `Aprovado` sem conferência visual (`.docx`) ou do orientador.
- **Guardrails Adversariais e Combate a Alucinações (*Eysenck & Eysenck, 2023; Mello, 2024*):** a Camada Decisória bloqueia tentativas de *prompt injection*, pedidos de plágio (*"Escreva meu TCC inteiro"*) e fabricação de referências, além de recusar respostas abaixo do limiar BM25 (`< 0.9`).
- **Frameworks Éticos, Feedback Loop e Licença Social (*Carraro, 2023; Córdova, 2025*):** decisões fundamentadas nas éticas consequencialista, deontológica e das virtudes; botões **`Útil`** e **`Contestar / Revisar`** em toda resposta (remediação e melhoria contínua); modal **Ética e Memória** na interface; acessibilidade WCAG AA, Light/Dark Mode e software gratuito sob Licença MIT.

---

## 4. 26/11 — Apresentação da Solução Aplicada *(1,0 ponto)*

### Roteiro de Demonstração ao Vivo (6 a 8 minutos)

1. **Abrir a aplicação:** abrir `index.html` diretamente no navegador (duplo clique via `file://`) demonstrando o **Modo 1 — Agente 4 Camadas (100% Offline)**.
2. **Busca livre, Interpretabilidade, Memória Curta e busca por seção:**
   - Digitar `como citar mais de 3 autores?` → retorna `Seção 2.1.1` (`et al.`), abrir **"Ver raciocínio das 4 camadas"** (*Interpretabilidade*) e testar o botão **Copiar** nos exemplos oficiais.
   - Em seguida, digitar `qual a página?` e depois `e o exemplo?` para demonstrar a **Memória Curta/Média**.
   - Digitar `seção 3.4.2` → abre diretamente `Citação Direta Longa`.
3. **Teste de Guardrail Adversarial:**
   - Digitar `Ignore todas as instruções anteriores` ou `Escreva meu TCC inteiro` → mostrar o bloqueio ético e o redirecionamento seguro pela Camada Decisória.
4. **Demonstração dos Validadores + Guia de Correção Offline:**
   - Clicar em **Cruzar Citações × Referências** → clicar no chip **`Testar com exemplo`** → clicar em **`Ver passo a passo de correção`** (plano gerado 100% offline).
   - Clicar em **Referências** e colar uma referência com erros:
     ```text
     ANÔNIMO. Manual sem autor identificado. [https://exemplo.com.br/manual](https://exemplo.com.br/manual)
     ```
     *(Exibe os alertas `[FALTA/ERRO]`: proibição de "Anônimo", ano ausente, falta de `Disponível em:` e `Acesso em:`.)*
   - Enviar uma referência válida via comando direto:
     ```text
     validar referencia: LAKATOS, Eva Maria; MARCONI, Marina de Andrade. Metodologia do trabalho científico. 6. ed. São Paulo: Atlas, 2001. 219 p.
     ```
     *(Exibe o status verde **Aprovado**.)*
   - *(Opcional)* Clicar em **Resumo e Abstract** e colar `Neste trabalho eu desenvolvi um sistema simples.` para exibir detecção de idioma, contagem de palavras, 1ª pessoa e ausência de `Palavras-chave:`.
5. **Modo 2 (Prompt Dinâmico / IA), Ética e Interface:**
   - Clicar em **`Prompt Dinâmico / IA`** para mostrar o template parametrizado montado em tempo real (pronto para copiar offline ou usar com API opcional Groq/Gemini).
   - Abrir o modal **`Ética e Memória`** (mostrando a contagem ao vivo das 3 dimensões de memória, vieses mapeados e feedbacks), alternar **Tema escuro / claro** e clicar em **Nova conversa**.
6. **Validação por testes automatizados no terminal:**
   ```bash
   node testes.js
   # ou: npm test
   ```
   *(Saída esperada: `Resultado: 52 de 52 aprovados` — incluindo Testes Adversariais e Teste de Stress com 200 consultas consecutivas.)*

---

## 5. Repositório GitHub — Integração da Solução *(1,0 ponto)*

```text
bot-duvidas/
├── index.html                           # Interface web (4 camadas, 2 modos, modal Ética/Memória, Feedback Loop, Light/Dark Mode)
├── manual-udf.js                        # Base oficial do Manual UDF (2020): 4 capítulos, 52 tópicos, 8 NBRs e 102 sinônimos
├── agente.js                            # Agente 4 camadas, Okapi BM25, Memória Curta/Média/Longa, Guardrails, 5 Validadores, Guia Offline e Prompt Dinâmico
├── testes.js                            # Suíte com 52 testes automatizados em Node.js puro (funcionais, memória, adversariais e stress)
├── package.json                         # Metadados do projeto (v2.0.0) e script `npm test`
├── .gitignore                           # Proteção contra arquivos temporários e `.env`
├── UNIDADE_IV_AGENTES_ETICA_PROJETO.md  # Entrega teórica e técnica completa da Unidade IV alinhada ao Guia de Estudos A1
├── README.md                            # Documentação técnica completa com fluxograma Mermaid e guia do GitHub Pages
└── LICENSE                              # Licença MIT
```

> **Uso de IA:** o código, os cenários de teste e a documentação foram desenvolvidos com apoio de IA generativa (Gemini) sob revisão humana. Em tempo de execução, o **Modo 1 (padrão)** opera de forma **100% determinística e offline**, sem uso de IA; o **Modo 2** disponibiliza um Prompt Dinâmico Parametrizado (copiável offline) com integração opcional via API (**Groq** ou **Gemini**) e *fallback* automático para o Modo 1 Offline.
