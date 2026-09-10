# Atividade - Refinamento de Prompts

## Identificação

* **Nome:** Everton Wesley
* **Data:** 03/09/2026

---

# Problema escolhido

## Contexto

Instituições de ensino possuem diversos equipamentos utilizados diariamente por alunos, professores e funcionários, como computadores, notebooks, projetores, tablets, impressoras e outros dispositivos eletrônicos.

Em instituições maiores, controlar esses equipamentos manualmente pode gerar dificuldades para saber onde determinado equipamento está, quem é o responsável por ele, qual é sua situação atual e quais movimentações foram realizadas.

Nesse contexto, um sistema de rastreamento de equipamentos pode auxiliar no controle dos ativos, permitindo registrar os equipamentos, seus responsáveis, localizações e movimentações.

## Problema

Como desenvolver uma solução computacional para rastrear equipamentos de uma instituição de ensino, permitindo controlar informações sobre os equipamentos, sua localização, seus responsáveis e seu histórico de movimentações?

## Objetivo

Utilizar uma ferramenta de Inteligência Artificial Generativa para auxiliar na definição de uma solução para o problema e investigar como o refinamento progressivo dos prompts influencia a qualidade, a precisão, a organização e a utilidade da resposta obtida.

---

# Prompt 1

## Prompt

Crie um sistema de rastreamento de equipamentos para uma instituição de ensino.

## Resultado

Uma possível solução seria desenvolver um sistema que permita cadastrar e acompanhar os equipamentos utilizados pela instituição.

O sistema poderia possuir funcionalidades como:

* cadastro de equipamentos;
* cadastro de usuários;
* cadastro de locais;
* registro da localização dos equipamentos;
* controle dos responsáveis pelos equipamentos;
* registro de movimentações;
* consulta dos equipamentos;
* relatórios.

Cada equipamento poderia possuir informações como número de identificação, nome, tipo, marca, modelo, número de série, localização e responsável.

O sistema poderia utilizar um banco de dados para armazenar as informações e possuir uma interface web para facilitar o acesso pelos usuários.

Também seria possível implementar diferentes níveis de acesso, permitindo que administradores gerenciem os equipamentos enquanto outros usuários apenas consultem as informações.

## Análise

O primeiro prompt conseguiu identificar uma solução geral para o problema, porém apresentou diversas limitações.

O principal problema foi a falta de contexto e especificidade. A IA precisou fazer várias suposições sobre o funcionamento do sistema.

Entre os pontos positivos, estão a identificação de funcionalidades básicas, como cadastro, localização, responsáveis e movimentações.

Entretanto, não foram definidos:

* o público que utilizará o sistema;
* os tipos de usuários;
* o fluxo de movimentação;
* os dados que devem ser armazenados;
* os requisitos funcionais;
* os requisitos não funcionais;
* a tecnologia utilizada;
* o formato esperado da solução;
* regras de negócio;
* critérios para avaliar a solução.

A resposta também ficou bastante genérica. Ela apresenta possibilidades, mas não detalha como o sistema deveria funcionar.

Portanto, o principal problema identificado foi a falta de contexto, objetivo e critérios específicos.

---

# Prompt 2

## Alterações realizadas

* **Papel:** foi definido que a IA deve atuar como analista de sistemas.
* **Contexto:** foi explicado que o sistema será utilizado por uma instituição de ensino.
* **Objetivo:** foi definido que o sistema deverá controlar os equipamentos e suas movimentações.
* **Público:** foram considerados administradores, funcionários e usuários responsáveis pelos equipamentos.
* **Formato:** a resposta deverá ser organizada em tópicos.
* **Restrições:** a solução deverá considerar uma aplicação web e banco de dados relacional.
* **Critérios:** a solução deverá ser simples, organizada e adequada para uma instituição de ensino.

## Prompt

Atue como um analista de sistemas responsável por projetar uma solução para uma instituição de ensino.

CONTEXTO:

A instituição possui computadores, notebooks, projetores, tablets, impressoras e outros equipamentos. Atualmente, existe dificuldade para controlar onde cada equipamento está, quem é responsável por ele e quais movimentações foram realizadas.

OBJETIVO:

Propor uma solução para rastrear os equipamentos da instituição, permitindo controlar seu cadastro, localização, responsável, situação e histórico de movimentações.

USUÁRIOS:

Considere pelo menos três tipos de usuários:

* administrador;
* funcionário responsável pelo controle dos equipamentos;
* usuário que recebe ou utiliza um equipamento.

A solução deve considerar uma aplicação web utilizando um banco de dados relacional.

Apresente:

1. objetivo do sistema;
2. principais funcionalidades;
3. tipos de usuários;
4. principais informações que devem ser armazenadas;
5. fluxo básico de movimentação de um equipamento;
6. possíveis tabelas do banco de dados;
7. regras de negócio importantes;
8. benefícios da solução.

Organize a resposta utilizando subtítulos e listas.

A solução deve ser simples e adequada para uma instituição de ensino de pequeno ou médio porte.

## Resultado

### 1. Objetivo do sistema

O sistema terá como objetivo controlar os equipamentos pertencentes à instituição, permitindo acompanhar sua localização, situação, responsável atual e histórico de movimentações.

### 2. Principais funcionalidades

* cadastrar equipamentos;
* editar informações dos equipamentos;
* consultar equipamentos;
* cadastrar locais;
* cadastrar usuários;
* atribuir equipamentos a responsáveis;
* registrar movimentações;
* consultar histórico;
* alterar a situação do equipamento;
* gerar relatórios.

### 3. Tipos de usuários

**Administrador:** possui acesso completo ao sistema.

**Funcionário:** realiza cadastros e movimentações dos equipamentos.

**Usuário:** pode consultar equipamentos que estão sob sua responsabilidade.

### 4. Informações dos equipamentos

Um equipamento poderia possuir:

* código;
* nome;
* tipo;
* marca;
* modelo;
* número de série;
* situação;
* localização atual;
* responsável atual;
* data de aquisição.

### 5. Fluxo de movimentação

Um equipamento é cadastrado no sistema e associado a um local.

Quando for transferido, o funcionário registra a nova localização e o responsável.

O sistema mantém o registro da movimentação para permitir consultas posteriores.

### 6. Possíveis tabelas

* equipamentos;
* usuários;
* locais;
* movimentações;
* tipos_equipamentos.

### 7. Regras de negócio

* cada equipamento deve possuir um identificador único;
* uma movimentação deve registrar origem e destino;
* um equipamento deve possuir uma localização atual;
* somente usuários autorizados podem registrar movimentações;
* o histórico de movimentações não deve ser apagado.

### 8. Benefícios

A solução facilita a localização dos equipamentos, melhora o controle dos ativos e permite identificar os responsáveis por cada equipamento.

## Comparação

| Critério                | Prompt 1 | Prompt 2 |
| ----------------------- | -------: | -------: |
| Clareza                 |        3 |        5 |
| Precisão                |        2 |        4 |
| Relevância              |        3 |        5 |
| Organização             |        3 |        5 |
| Adequação ao público    |        2 |        4 |
| Atendimento ao objetivo |        3 |        5 |
| Utilidade prática       |        2 |        4 |
| **Total**               |   **18** |   **32** |

### Análise das melhorias

O segundo prompt apresentou uma melhoria significativa em relação ao primeiro.

A definição do contexto fez com que a resposta deixasse de tratar o problema como um sistema genérico de rastreamento e passasse a considerar as necessidades específicas de uma instituição de ensino.

A definição dos usuários também melhorou a solução, pois permitiu identificar diferentes níveis de utilização.

Outro avanço foi a solicitação de tabelas, regras de negócio e fluxo de movimentação. Isso aproximou a resposta de uma análise inicial de um sistema real.

Mesmo assim, ainda existem pontos que podem ser melhorados.

A resposta não detalha suficientemente os requisitos funcionais e não funcionais, não estabelece claramente as regras para empréstimo e devolução e não apresenta uma estrutura detalhada do banco de dados.

Também seria importante definir critérios mais objetivos para avaliar se a solução realmente atende ao problema.

---

# Prompt 3

## O que ainda precisava melhorar?

Apesar da melhoria proporcionada pelo segundo prompt, ainda faltava transformar a ideia geral em uma especificação mais estruturada.

Era necessário definir com maior precisão:

* como ocorre o empréstimo;
* como ocorre a devolução;
* como uma transferência é registrada;
* quais informações pertencem a cada entidade;
* quais regras impedem inconsistências;
* quais requisitos funcionais o sistema deve possuir;
* quais requisitos não funcionais devem ser considerados;
* como o histórico deve funcionar;
* como verificar se a solução realmente atende ao objetivo.

## Hipótese

Acredito que a resposta ficará melhor porque o terceiro prompt fornece informações mais específicas sobre o funcionamento do sistema, define regras de negócio, estrutura os requisitos e estabelece critérios de qualidade.

Com essas informações, a IA terá menos necessidade de fazer suposições e poderá produzir uma solução mais próxima de uma especificação inicial de sistema.

## Prompt

Atue como um analista de sistemas e arquiteto de software especializado no desenvolvimento de sistemas de controle de ativos.

CONTEXTO:

Uma instituição de ensino precisa controlar seus equipamentos tecnológicos, incluindo computadores, notebooks, projetores, tablets e impressoras.

Atualmente, a instituição possui dificuldades para identificar a localização atual dos equipamentos, seus responsáveis, sua situação e o histórico de movimentações.

O sistema será utilizado por administradores e funcionários responsáveis pelo patrimônio.

OBJETIVO:

Projetar uma solução web para gerenciamento e rastreamento dos equipamentos da instituição, permitindo controlar o ciclo de vida de cada equipamento desde seu cadastro até sua baixa.

A solução deve permitir:

1. cadastrar equipamentos;
2. cadastrar tipos de equipamentos;
3. cadastrar locais;
4. cadastrar usuários;
5. registrar responsáveis;
6. realizar empréstimos;
7. registrar devoluções;
8. transferir equipamentos entre locais;
9. alterar a situação de um equipamento;
10. consultar o histórico de movimentações;
11. localizar rapidamente um equipamento;
12. gerar relatórios.

REGRAS DE NEGÓCIO:

* cada equipamento deve possuir um código único;
* cada equipamento deve possuir um número de série quando aplicável;
* um equipamento ativo deve possuir uma localização atual;
* um equipamento emprestado deve possuir um responsável;
* um equipamento não pode ser emprestado para dois usuários simultaneamente;
* toda movimentação deve possuir data, usuário responsável pela operação, origem e destino quando aplicável;
* o histórico de movimentações não deve ser apagado;
* equipamentos baixados não podem ser emprestados;
* somente usuários autorizados podem cadastrar ou movimentar equipamentos.

BANCO DE DADOS:

Proponha as principais tabelas do banco de dados e apresente, para cada uma, seus principais campos e relacionamentos.

REQUISITOS:

Separe os requisitos em:

* requisitos funcionais;
* requisitos não funcionais;
* regras de negócio.

FLUXO:

Explique o fluxo de:

* cadastro;
* empréstimo;
* devolução;
* transferência;
* baixa do equipamento.

FORMATO DA RESPOSTA:

Organize a resposta utilizando subtítulos.

Apresente:

1. visão geral do sistema;
2. atores e permissões;
3. requisitos funcionais;
4. requisitos não funcionais;
5. regras de negócio;
6. fluxo das principais operações;
7. estrutura das tabelas;
8. relacionamentos entre as entidades;
9. exemplo de utilização do sistema;
10. riscos e possíveis melhorias futuras.

CRITÉRIOS DE QUALIDADE:

A solução deve ser coerente, simples de implementar, adequada a uma instituição de ensino de pequeno ou médio porte e evitar funcionalidades desnecessárias.

Não invente tecnologias específicas sem justificar sua utilização.

Quando fizer alguma suposição, identifique-a explicitamente.

## Resultado

# 1. Visão geral do sistema

O sistema será uma aplicação web destinada ao controle e rastreamento dos equipamentos de uma instituição de ensino.

Cada equipamento terá um cadastro próprio e poderá ser associado a um local, situação e responsável.

As movimentações serão registradas em um histórico, permitindo identificar o caminho percorrido pelo equipamento ao longo do tempo.

# 2. Atores e permissões

| Ator          | Principais permissões                                    |
| ------------- | -------------------------------------------------------- |
| Administrador | Gerenciar usuários, equipamentos, locais e configurações |
| Funcionário   | Cadastrar equipamentos e registrar movimentações         |
| Usuário       | Consultar equipamentos sob sua responsabilidade          |

# 3. Requisitos funcionais

**RF01 — Cadastro de equipamentos**

O sistema deve permitir cadastrar equipamentos com código, tipo, marca, modelo, número de série, data de aquisição e situação.

**RF02 — Cadastro de locais**

O sistema deve permitir cadastrar os locais existentes na instituição.

**RF03 — Cadastro de usuários**

O sistema deve permitir cadastrar os usuários responsáveis pela utilização do sistema.

**RF04 — Empréstimo**

O sistema deve permitir associar um equipamento a um usuário responsável.

**RF05 — Devolução**

O sistema deve permitir registrar a devolução de um equipamento.

**RF06 — Transferência**

O sistema deve permitir transferir um equipamento de um local para outro.

**RF07 — Histórico**

O sistema deve manter o histórico das movimentações.

**RF08 — Consulta**

O sistema deve permitir pesquisar equipamentos por código, tipo, localização, situação ou responsável.

**RF09 — Relatórios**

O sistema deve permitir gerar relatórios dos equipamentos e movimentações.

# 4. Requisitos não funcionais

**RNF01 — Segurança**

O acesso às funcionalidades deve ser controlado de acordo com o perfil do usuário.

**RNF02 — Integridade**

O sistema deve impedir operações que gerem informações inconsistentes.

**RNF03 — Usabilidade**

As telas devem apresentar informações de forma simples e organizada.

**RNF04 — Desempenho**

Consultas comuns devem ser realizadas de maneira eficiente mesmo com o crescimento da quantidade de equipamentos.

**RNF05 — Auditoria**

As movimentações devem manter informações suficientes para identificar quando e por quem foram realizadas.

# 5. Regras de negócio

1. O código do equipamento deve ser único.
2. Um equipamento não pode possuir dois responsáveis ativos simultaneamente.
3. Um equipamento emprestado deve possuir um responsável.
4. Equipamentos baixados não podem ser emprestados ou transferidos.
5. Toda movimentação deve ser registrada.
6. O histórico não deve ser excluído durante operações comuns.
7. Apenas usuários autorizados podem realizar movimentações.
8. O equipamento deve possuir uma localização atual enquanto estiver ativo.

# 6. Fluxo das principais operações

## Cadastro

O funcionário cadastra o equipamento, informa seus dados e define sua localização inicial.

## Empréstimo

O funcionário seleciona o equipamento e o usuário responsável. O sistema verifica se o equipamento está disponível e registra o empréstimo.

## Devolução

O funcionário localiza o empréstimo ativo e registra a devolução. O equipamento deixa de possuir um responsável pelo empréstimo.

## Transferência

O funcionário seleciona o equipamento, informa o novo local e confirma a operação. O sistema registra a origem, o destino, a data e o responsável pela operação.

## Baixa

O equipamento é marcado como baixado. Depois disso, não pode participar de novos empréstimos ou transferências.

# 7. Estrutura das tabelas

### equipamentos

* id_equipamento;
* codigo;
* tipo_id;
* marca;
* modelo;
* numero_serie;
* data_aquisicao;
* situacao;
* local_id.

### tipos_equipamentos

* id_tipo;
* nome;
* descricao.

### locais

* id_local;
* nome;
* descricao.

### usuarios

* id_usuario;
* nome;
* email;
* perfil;
* ativo.

### movimentacoes

* id_movimentacao;
* equipamento_id;
* usuario_operacao_id;
* responsavel_anterior_id;
* responsavel_novo_id;
* local_origem_id;
* local_destino_id;
* tipo_movimentacao;
* data_movimentacao;
* observacao.

# 8. Relacionamentos

Um tipo de equipamento pode estar relacionado a vários equipamentos.

Um local pode possuir vários equipamentos.

Um equipamento pode possuir várias movimentações.

Um usuário pode ser responsável por vários equipamentos ao longo do tempo.

Um usuário também pode realizar várias operações de movimentação.

# 9. Exemplo de utilização

Um notebook identificado pelo código EQ-001 é cadastrado e inicialmente localizado no laboratório de informática.

Posteriormente, o equipamento é emprestado para um professor.

O sistema registra o professor como responsável e cria uma movimentação de empréstimo.

Quando o equipamento é devolvido, o sistema encerra o empréstimo e registra a devolução.

Caso posteriormente o notebook seja transferido para outro laboratório, o sistema registra o local de origem e o novo local.

Dessa forma, é possível consultar tanto a situação atual quanto o histórico do equipamento.

# 10. Riscos e melhorias futuras

Entre os principais riscos estão informações incorretas cadastradas pelos usuários, falta de atualização das movimentações e acesso indevido ao sistema.

Como melhorias futuras, poderiam ser considerados:

* leitura de QR Code;
* notificações;
* relatórios avançados;
* integração com sistemas de patrimônio;
* controle de manutenção;
* registro de documentos;
* dashboard de indicadores.

A solução proposta atende ao objetivo principal sem exigir funcionalidades excessivamente complexas.

---

# Comparação final

| Critério                | Prompt 1 | Prompt 2 | Prompt 3 |
| ----------------------- | -------: | -------: | -------: |
| Clareza                 |        3 |        5 |        5 |
| Precisão                |        2 |        4 |        5 |
| Relevância              |        3 |        5 |        5 |
| Organização             |        3 |        5 |        5 |
| Adequação ao público    |        2 |        4 |        5 |
| Atendimento ao objetivo |        3 |        5 |        5 |
| Utilidade prática       |        2 |        4 |        5 |
| **Total**               |   **18** |   **32** |   **35** |

## Qual foi a melhoria?

A principal melhoria ocorreu porque o prompt passou de uma solicitação genérica para uma instrução estruturada e contextualizada.

No primeiro prompt, a IA recebeu apenas a tarefa de criar um sistema de rastreamento. Por isso, precisou preencher diversas lacunas por conta própria.

No segundo prompt, foram adicionados contexto, público, objetivo, funcionalidades e algumas restrições. Isso produziu uma resposta mais organizada e próxima das necessidades reais.

No terceiro prompt, foram acrescentados requisitos funcionais, requisitos não funcionais, regras de negócio, fluxos, estrutura de banco de dados e critérios de qualidade.

A modificação que teve maior impacto foi a **especificação do contexto e das regras de negócio**, pois elas reduziram significativamente a quantidade de suposições que a IA precisava fazer.

O terceiro prompt também demonstrou que simplesmente aumentar a quantidade de palavras não é suficiente. O ganho ocorreu porque foram adicionadas informações relevantes para o problema.

---

# Validação

A qualidade da resposta foi analisada verificando se a solução apresentada era coerente com o problema proposto e se as funcionalidades estavam relacionadas ao objetivo do sistema.

Também foram verificadas possíveis inconsistências nas regras de negócio.

A resposta final foi considerada adequada porque apresenta uma estrutura coerente para um sistema de rastreamento de equipamentos e mantém relação direta entre usuários, equipamentos, locais e movimentações.

Entretanto, a resposta da IA deve ser considerada uma proposta inicial, e não uma especificação definitiva. Antes de implementar o sistema, seria necessário validar os requisitos com os responsáveis pela instituição e analisar aspectos técnicos, de segurança e de banco de dados.

Esse processo de validação é importante porque uma resposta produzida por IA pode apresentar informações aparentemente corretas, mas ainda conter erros ou suposições. A própria atividade destaca que o refinamento do prompt não elimina a necessidade de validação.

---

# Reflexão

## 1. Qual foi a principal diferença entre os prompts?

A principal diferença foi o nível de especificidade.

O Prompt 1 apresentava somente o problema. O Prompt 2 adicionou contexto, usuários, objetivo e funcionalidades. O Prompt 3 acrescentou regras de negócio, requisitos, fluxos, estrutura de banco de dados e critérios de qualidade.

## 2. Quais elementos tiveram maior impacto?

Os elementos que tiveram maior impacto foram o contexto, o objetivo, o público, as regras de negócio e o formato esperado da resposta.

Esses elementos reduziram a ambiguidade e fizeram com que a IA produzisse uma solução mais adequada ao problema.

## 3. Um prompt maior é necessariamente melhor?

Não. Um prompt maior não é necessariamente melhor.

O que importa é a qualidade das informações fornecidas. Um prompt pode possuir muitas palavras e continuar sendo genérico.

No caso analisado, o terceiro prompt ficou maior porque foram adicionadas informações relevantes para orientar a IA. Portanto, a melhoria ocorreu pela especificidade, e não simplesmente pela quantidade de texto.

## 4. O que ocorre quando o objetivo não é claro?

Quando o objetivo não é claramente definido, a IA precisa interpretar o que o usuário deseja. Isso pode resultar em uma resposta genérica,

