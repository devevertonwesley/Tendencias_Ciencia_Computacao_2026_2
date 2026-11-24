# Projeto Final — Tendências de Ciência da Computação

**Disciplina:** Tendências de Ciência da Computação — Unidade 4  
**Professora:** Kadidja Valéria  
**Projeto:** Assistente do Manual de TCC — UDF  
**Grupo:** `Everton Wesley Pereira Oliveira`

## Links do Projeto

- **Repositório GitHub:** [Tendencias_Ciencia_Computacao_2026_2](https://github.com/devevertonwesley/Tendencias_Ciencia_Computacao_2026_2)
- **Documentação (`README.md`):** [README.md — Unidade 04](https://github.com/devevertonwesley/Tendencias_Ciencia_Computacao_2026_2/blob/main/Unidade%2004/README.md)
---

## 1. 05/11 — Criação de Agentes de IA *(1,0 ponto)*

- Desenvolvimento de um **agente conversacional determinístico** em JavaScript puro (`agente.js`) para um domínio específico: o *Manual para Elaboração de Trabalhos Acadêmicos da UDF (2020)*.
- **Fluxo de funcionamento do agente:**
  1. **Percepção e normalização:** converte a entrada para minúsculas, remove acentos e pontuações, filtra stopwords, aplica sinônimos acadêmicos (`abstract`, `margem`, `site`, `et al`, `apud`) e extrai radicais de 5 caracteres.
  2. **Decisão:** identifica se o usuário quer navegar por capítulo, consultar uma seção exata (`3.4.2`, `1.8`), fazer uma pergunta livre ou acionar um validador.
  3. **Busca ranqueada (Okapi BM25):** calcula a relevância dos tópicos do manual com peso extra (**2,5x**) para títulos e números de seção.
  4. **Ação:** exibe a regra oficial com seção, página e exemplos — ou executa um dos 4 validadores de TCC.

---

## 2. 12/11 — Chatbot, Ferramentas e Especificação *(1,0 ponto)*

- **Problema resolvido:** dificuldade e perda de tempo dos estudantes ao consultar normas ABNT/UDF em um PDF de 42 páginas durante a escrita do TCC.
- **Público-alvo:** estudantes de graduação e pós-graduação da UDF em elaboração de TCC.
- **Base oficial (`manual-udf.js`):** os 4 capítulos completos do Manual da UDF (2020) — Estrutura do TCC, Referências (20 modelos da NBR 6023), Citações (NBR 10520) e Formatação/Paginação (NBR 14724).
- **Ferramentas e stack:** HTML5, CSS3 e JavaScript puros, **sem API, sem servidor e sem dependências externas** (ícones em SVG inline; funciona 100% offline abrindo `index.html`).
- **Principais recursos:**
  - Navegação pelos 4 capítulos na sidebar + chips clicáveis de subtópicos.
  - Busca livre em linguagem natural e busca por número de seção.
  - Botão **Copiar** nos exemplos oficiais da ABNT.
  - **4 validadores automáticos:** Resumo, Citação, Referência e Estrutura do TCC.

---

## 3. 19/11 — Viés Algorítmico, Ética e Responsabilidade Social *(1,0 ponto)*

- **Combate a alucinações:** IAs generativas podem inventar normas ABNT, páginas ou modelos de referências inexistentes. Por isso, a IA generativa (Gemini) foi usada apenas como apoio no desenvolvimento (com revisão da equipe), enquanto a execução do chatbot é **100% determinística** e restrita ao manual oficial da UDF.
- **Privacidade dos dados:** todo o processamento ocorre localmente no navegador; nenhum trecho inédito do TCC colado pelo aluno sai da máquina ou é enviado a servidores externos.
- **Acessibilidade e inclusão:** ferramenta gratuita, 100% offline, responsiva (desktop e mobile), com suporte a teclado/ARIA e alternância de tema claro/escuro.
- **Transparência:** as limitações do validador determinístico estão documentadas no `README.md`, deixando claro que ele apoia a revisão técnica, mas não substitui o orientador nem a biblioteca.

---

## 4. 26/11 — Apresentação da Solução Aplicada *(1,0 ponto)*

### Roteiro de Demonstração ao Vivo (3 a 5 minutos)

1. **Abrir a aplicação:** acessar o link do GitHub Pages (ou abrir `index.html` diretamente no navegador para demonstrar o funcionamento offline).
2. **Consulta rápida na tela inicial:** clicar em *"Quais são as margens e o espaçamento?"* e mostrar o selo `Seção 4.1 • pág. 40` e o botão **Copiar** nos exemplos.
3. **Busca livre e por número de seção:**
   - Digitar: `como citar mais de 3 autores?` → retorna `Seção 2.1.1` (`et al.`).
   - Digitar: `seção 3.4.2` → abre diretamente `Citação Direta Longa`.
4. **Demonstração do Validador de TCC:**
   - Clicar em **Validar Referência** e colar uma referência com erros:
     ```text
     ANÔNIMO. Manual sem autor identificado. https://exemplo.com.br/manual
     ```
     *(Mostra os alertas `[FALTA/ERRO]`: proibição de "Anônimo", ano ausente, falta de `Disponível em:` e `Acesso em:`.)*
   - Enviar uma referência válida via comando direto:
     ```text
     validar referencia: LAKATOS, Eva Maria; MARCONI, Marina de Andrade. Metodologia do trabalho científico. 6. ed. São Paulo: Atlas, 2001. 219 p.
     ```
     *(Mostra o status verde **Aprovado**.)*
   - *(Opcional)* Clicar em **Validar Resumo** e colar `Neste trabalho eu desenvolvi um sistema simples.` para exibir contagem de palavras, detecção de 1ª pessoa e ausência de `Palavras-chave:`.
5. **Recursos de interface:** alternar **Tema escuro / claro** e clicar em **Nova conversa**.
6. **Validação por testes automatizados (opcional no terminal):**
   ```bash
   node testes.js
   ```
   *(Saída esperada: `27 de 27 aprovados`.)*

---

## 5. Repositório GitHub — Integração da Solução *(1,0 ponto)*

```text
bot-duvidas/
├── index.html       # Interface moderna (sidebar, drawer mobile, Light/Dark Mode, SVGs inline)
├── manual-udf.js    # Conteúdo estruturado do Manual de TCC da UDF (2020) + sinônimos ABNT
├── agente.js        # Motor determinístico BM25, fluxo conversacional e 4 validadores de TCC
├── testes.js        # 27 testes automatizados em Node.js puro (zero dependências)
├── README.md        # Documentação técnica completa com diagrama Mermaid
└── LICENSE          # Licença MIT
```

> **Uso de IA:** o código e a documentação foram desenvolvidos com apoio de IA generativa (Gemini) e revisados pela equipe. Em tempo de execução, o assistente opera de forma 100% determinística e offline, sem uso de IA.
