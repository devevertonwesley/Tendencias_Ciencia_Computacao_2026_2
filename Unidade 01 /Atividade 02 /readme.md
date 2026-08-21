# Engenharia de Prompt: Sistema de Rastreamento de Equipamentos

Este repositório apresenta um estudo prático sobre **Engenharia de Prompt** aplicada ao levantamento de requisitos de software. A proposta é mostrar, de forma prática, como uma ideia inicialmente simples pode evoluir para uma instrução mais clara, estruturada e eficiente para uma Inteligência Artificial Generativa.

O estudo acompanha esse processo passo a passo, desde o primeiro prompt até uma versão final mais completa, mostrando como pequenas mudanças na forma de conversar com a IA podem melhorar significativamente a qualidade das respostas.

## Tema

O projeto tem como tema a **Engenharia de Prompt Iterativa aplicada ao Levantamento de Requisitos para Sistemas de Informação**.

Como estudo de caso, foi utilizado o desenvolvimento de um **Sistema de Rastreamento de Equipamentos para Instituições de Ensino**, com recursos voltados ao controle e acompanhamento dos equipamentos, incluindo sua identificação por QR Code e seus diferentes estados, como disponível, emprestado e em manutenção.

## Por que esse tema?

A utilização de Inteligência Artificial Generativa no desenvolvimento de sistemas muitas vezes é resumida à ideia de simplesmente "fazer uma pergunta e receber uma resposta". Na prática, o resultado depende muito da forma como essa pergunta ou instrução é construída.

Um prompt muito genérico pode gerar uma resposta igualmente genérica, que não atende às necessidades reais de um projeto. Quando são adicionados contexto, objetivo, regras, restrições, formato de resposta e o papel que a IA deve assumir, os resultados tendem a se tornar muito mais úteis e próximos do que realmente está sendo buscado.

Por isso, este estudo busca demonstrar, na prática, como a **Engenharia de Prompt Iterativa** pode ser utilizada para melhorar gradualmente os resultados obtidos com IA.

Durante o processo, foram aplicadas técnicas como:

* definição de uma persona para a IA;
* inclusão de contexto sobre o sistema;
* definição de regras e restrições;
* especificação do formato da resposta;
* delimitação do escopo;
* revisão e comparação dos resultados obtidos.

Além de mostrar a evolução dos prompts, o trabalho também reforça que a IA não substitui a análise humana. Ela pode ajudar a organizar ideias, levantar possibilidades e acelerar determinadas etapas, mas cabe ao profissional verificar, corrigir e validar aquilo que foi gerado.

## Resultados

| Critério             | Prompt Inicial              | Variação 1 — Persona                   | Variação 2 — Contexto e Restrições | Variação 3 — Formato e Escopo | Prompt Final                         |
| -------------------- | --------------------------- | -------------------------------------- | ---------------------------------- | ----------------------------- | ------------------------------------ |
| **Persona**          | Analista de sistemas geral  | Engenheiro de software educacional     | Analista de controle patrimonial   | Analista de documentação      | Analista especializado em requisitos |
| **Identificação**    | Não especificada            | Não especificada                       | QR Code detalhado                  | QR Code básico                | QR Code com campos definidos         |
| **Restrições**       | Nenhuma                     | Nenhuma                                | Limita recursos fora do escopo     | Poucas restrições             | Impede acréscimos fora do escopo     |
| **Formato de saída** | Lista simples de requisitos | Tabela com priorização para MVP        | Lista organizada por tópicos       | Estrutura de documentação     | Títulos, listas e casos de uso       |
| **Precisão**         | Baixa / Genérica            | Média / Direcionada ao desenvolvimento | Alta / Alinhada ao cenário         | Média / Visão geral           | Alta / Mais completa e aplicável     |

A comparação mostra uma evolução clara. O primeiro prompt produziu uma resposta mais ampla e genérica. A cada nova versão, foram adicionadas informações que ajudaram a IA a entender melhor o problema e o resultado esperado.

O prompt final apresentou maior nível de detalhamento e organização, tornando a resposta mais próxima de uma documentação que poderia ser utilizada como ponto de partida para o desenvolvimento do sistema.

## Arquivos

O conteúdo deste repositório está organizado para acompanhar a evolução do trabalho:

* **Prompt Inicial e Resposta:** apresenta a primeira tentativa e os requisitos levantados inicialmente.
* **Variações de Teste:**

  * **Variação 1:** alteração da persona e introdução da ideia de priorização para um MVP.
  * **Variação 2:** inclusão de contexto técnico, como o uso de QR Code, além de restrições para controlar o escopo.
  * **Variação 3:** alteração do formato da resposta, buscando uma estrutura mais próxima de uma documentação inicial do sistema.
* **Prompt Melhorado e Resposta:** apresenta a versão final do prompt, reunindo os principais aprendizados das etapas anteriores.
* **Comparação dos Resultados:** apresenta a análise das diferenças entre os prompts e das melhorias obtidas ao longo do processo.
* **Reflexão Cognitiva e Ética:** aborda o aprendizado obtido durante a atividade e a importância da utilização responsável da IA.

## Metodologia

A metodologia utilizada foi baseada em três pontos principais.

### 1. Engenharia de Prompt Iterativa

Em vez de tentar criar o prompt perfeito de uma única vez, foi adotada uma abordagem de melhoria gradual. Cada versão buscou corrigir limitações identificadas na anterior.

Foram trabalhados principalmente os seguintes elementos:

* **Definição de persona:** determinação do papel que a IA deveria assumir, como um analista especializado em requisitos e controle patrimonial.
* **Contextualização:** apresentação das características do sistema, incluindo a identificação dos equipamentos por QR Code e o acompanhamento de seus estados.
* **Restrições de escopo:** definição de limites para evitar que a IA criasse funcionalidades que não faziam parte da proposta original.
* **Formato da resposta:** indicação de como as informações deveriam ser organizadas, utilizando títulos, listas, tabelas e casos de uso.
* **Refinamento:** análise do resultado obtido e utilização dos pontos identificados para construir a próxima versão do prompt.

### 2. Análise Comparativa

Após cada interação, as respostas foram analisadas e comparadas com as versões anteriores.

O objetivo foi identificar o que havia melhorado, quais informações ainda estavam faltando e se a resposta realmente estava de acordo com o problema proposto.

Dessa forma, a avaliação não considerou apenas se a IA "respondeu", mas principalmente se a resposta era **útil, coerente e aplicável ao contexto do sistema**.

### 3. Validação Humana e Reflexão Crítica

Mesmo com a evolução dos prompts, a participação humana continuou sendo fundamental.

As respostas geradas pela IA foram tratadas como sugestões e materiais de apoio, e não como uma solução definitiva. Cabe ao profissional analisar as informações, identificar possíveis erros, verificar se os requisitos fazem sentido e decidir o que realmente deve ser utilizado no projeto.

Essa etapa também trouxe uma reflexão sobre o uso da IA em ambientes acadêmicos e profissionais. A ferramenta pode aumentar a produtividade e facilitar determinadas atividades, mas seu uso responsável depende da capacidade do usuário de **questionar, avaliar e validar aquilo que foi produzido**.

## Conclusão

O estudo mostrou que a Engenharia de Prompt não se resume a escrever uma pergunta para uma IA. Trata-se de um processo de construção e refinamento de instruções para obter resultados cada vez mais próximos do objetivo desejado.

No caso do Sistema de Rastreamento de Equipamentos, foi possível observar que a inclusão de persona, contexto, regras, restrições e formato de saída tornou as respostas progressivamente mais específicas e úteis.

Mais do que encontrar um "prompt perfeito", o principal aprendizado foi perceber que a interação com a IA pode ser tratada como um processo iterativo: **gerar, analisar, identificar problemas, ajustar e gerar novamente**.

Assim, a IA funciona como uma ferramenta de apoio ao profissional, enquanto a definição do que é correto, relevante e adequado ao projeto continua dependendo da análise e da responsabilidade humana.
