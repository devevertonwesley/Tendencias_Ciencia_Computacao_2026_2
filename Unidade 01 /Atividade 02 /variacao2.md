# Variação 2 — Adição de Contexto e Restrições

# Técnica utilizada

Nesta variação, foi adicionada uma quantidade maior de informações sobre o problema. Foram definidas funcionalidades específicas e restrições para evitar que a IA adicionasse recursos fora do contexto.

---

# Prompt

Atue como um analista de requisitos especializado em sistemas de controle patrimonial.

Uma instituição de ensino possui equipamentos distribuídos entre salas de aula, laboratórios e setores administrativos.

A instituição precisa de um sistema para rastrear esses equipamentos utilizando QR Code.

Cada equipamento deve possuir um código único. Ao realizar a leitura do QR Code, o usuário deve conseguir visualizar:

- Nome do equipamento;

- Número de patrimônio;

- Localização atual;

- Responsável;

- Situação do equipamento;

- Histórico de movimentações.

O sistema também deve permitir registrar empréstimos, devoluções e equipamentos enviados para manutenção.

Com base nesse cenário, identifique:

1. Os requisitos funcionais;
2. Os requisitos não funcionais;
3. Os principais atores do sistema;
4. Os principais casos de uso.

Não adicione funcionalidades que não estejam relacionadas ao problema apresentado.

---

# Resposta:

# Requisitos funcionais

- Cadastrar equipamentos.

- Registrar um código único para cada equipamento.

- Associar um QR Code ao equipamento.

- Permitir consultar as informações por meio do QR Code.

- Registrar a localização atual.

- Registrar o responsável pelo equipamento.

- Registrar empréstimos.

- Registrar devoluções.

- Registrar o envio para manutenção.

- Atualizar a situação do equipamento.

- Consultar o histórico de movimentações.

---

# Requisitos não funcionais

- O acesso ao sistema deve exigir autenticação.

- O sistema deve proteger os dados contra alterações não autorizadas.

- A leitura do QR Code deve apresentar as informações de forma rápida.

- A interface deve ser simples e adequada aos usuários da instituição.

- O histórico de movimentações deve ser mantido de forma segura.

---

# Atores:

- Administrador;

- Responsável pelo patrimônio;

- Usuário autorizado.

---

# Casos de uso

- Cadastrar equipamento;

- Consultar equipamento;

- Ler QR Code;

- Registrar empréstimo;

- Registrar devolução;

- Alterar localização;

- Registrar manutenção;

- Consultar histórico.

---

# Análise da variação

Essa variação apresentou uma resposta mais específica que a anterior. A inclusão do contexto sobre QR Code, localização e manutenção fez com que os requisitos fossem mais próximos das necessidades reais do sistema.

A restrição de não adicionar funcionalidades fora do cenário também ajudou a manter a resposta focada no problema.

---
