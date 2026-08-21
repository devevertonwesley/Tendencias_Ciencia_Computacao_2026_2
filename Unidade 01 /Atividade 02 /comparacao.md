# Comparação — Prompt Inicial x Prompt Melhorado

## Prompt Inicial

O Prompt Inicial solicitava apenas que a IA analisasse o problema e separasse os requisitos funcionais dos requisitos não funcionais.

A resposta obtida identificou funcionalidades o cadastro de equipamentos, registro de localização, empréstimos, devoluções e histórico de movimentações.

### Pontos positivos
* O objetivo do prompt era simples de compreender;
* A resposta apresentou requisitos relacionados ao problema;
* Houve separação entre requisitos funcionais e não funcionais.

### Pontos que poderiam melhorar
* O contexto sobre o sistema era limitado;
* Não havia detalhes sobre como os equipamentos seriam identificados;
* Não foram solicitados atores do sistema;
* Não foram solicitados casos de uso;
* Os requisitos ficaram genéricos;
* Não havia uma estrutura detalhada para a resposta.

---

## Prompt Melhorado

O Prompt Melhorado foi criado após a análise das três variações. Ele reuniu elementos que apresentaram melhores resultados, como uma persona mais específica, maior contextualização, restrições e definição clara do formato da resposta.

Além disso, foram incluídas informações sobre a utilização de QR Code, os dados que devem ser consultados em cada equipamento e as movimentações que devem ser registradas.

### Pontos positivos
* Define uma persona específica para a IA;
* Apresenta um contexto mais completo;
* Explica como o QR Code será utilizado;
* Define as principais informações de cada equipamento;
* Solicita requisitos funcionais e não funcionais numerados;
* Solicita os atores envolvidos;
* Solicita os principais casos de uso;
* Define uma estrutura clara para a resposta;
* Impede a adição de funcionalidades fora do cenário.

---

## Comparação dos resultados

| Critério | Prompt Inicial | Prompt Melhorado |
| :--- | :--- | :--- |
| Contexto | Básico | Detalhado |
| Papel da IA | Analista de sistemas | Analista especializado em requisitos |
| Identificação dos equipamentos | Não especificada | Utilização de QR Code |
| Formato da resposta | Separação de requisitos | Estrutura completa e organizada |
| Atores | Não solicitados | Solicitados |
| Casos de uso | Não solicitados | Solicitados |
| Precisão | Mais genérica | Mais específica |
| Restrições | Não possui | Evita informações fora do cenário |

---

## Conclusão

O Prompt Melhorado apresentou um resultado mais preciso e útil para o desenvolvimento do sistema.

A principal diferença foi a quantidade e a qualidade das informações fornecidas à IA. O Prompt Inicial apresentava apenas uma descrição geral do problema, enquanto o Prompt Melhorado especificava o contexto, a tecnologia utilizada para identificação dos equipamentos, as informações esperadas e o formato da resposta.

As três variações permitiram identificar que a combinação entre persona específica, contexto detalhado, restrições e definição clara do resultado esperado produz respostas mais adequadas.

---
