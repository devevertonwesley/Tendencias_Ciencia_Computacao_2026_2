# Programação Assistida por Inteligência Artificial

**Aluno: Everton Wesley - 35846356**

**Unidade II 
Podcast:** SARKAR, A.; DROSOS, I. *Vibe coding: programming through conversation with artificial intelligence*. PPIG 2025.

\---

## 1\) Dois trechos/ideias do artigo que chamaram minha atenção

**A expertise não some, ela muda de lugar.** O artigo mostra que os programadores observados usavam muito conhecimento técnico, mas para outras tarefas: gerenciar o contexto, avaliar o código rapidamente e decidir quando parar de pedir à IA e assumir o trabalho manual. O programador deixa de ser autor linha a linha e passa a ser diretor, revisor e editor.

**A confiança na IA se constrói revisando.** Um dos desenvolvedores, que trabalhava com uma base de 150 mil linhas, disse que não podia deixar código ruim entrar no repositório e revisava até mudanças simples. Outro afirmou que não acredita em "seguir a IA cegamente" e que a IA é "apenas uma ferramenta".

\---

## 2\) Conclusão sobre a discussão

A IA é uma parceira poderosa, mas não substitui o julgamento de quem programa. Ela acelera o trabalho, mas também inventa coisas que não existem, ignora instruções e gera código complicado demais. No artigo, quem se deu bem foi quem manteve uma confiança condicionada: pediu, conferiu, testou e corrigiu à mão quando necessário. O potencial é grande, os limites são reais e cabe ao humano cuidar deles.

\---

## 3\) Questão 2: a IA reduz a necessidade de conhecimento em programação ou transforma o tipo de conhecimento necessário?

Segundo o artigo, ela **transforma** o conhecimento necessário. Em vez de escrever cada linha, o programador avalia, guia e refina o que a IA produz. As competências que passam a importar são:

* **Ler e avaliar código com rapidez**, percebendo, por exemplo, quando a IA "reinventa a roda" em vez de usar uma biblioteca.
* **Depurar com raciocínio próprio**: levantar hipóteses e usar console e ferramentas do navegador antes de pedir a correção.
* **Conhecer a IA**: seus pontos fortes e fracos, o cuidado com o contexto da conversa e o tamanho adequado dos pedidos.
* **Ter visão de produto**: transformar uma ideia em funcionalidades.
* **Decidir quando delegar e quando assumir o controle**.

O estudo só analisou programadores experientes e admite que não sabe como iniciantes se sairiam. Os autores também alertam que o afastamento do código pode reduzir o aprendizado profundo. Para quem está estudando, a IA não deve substituir a base.

\---

## 4\) Estudo de caso: ações antes de incorporar o código

Passar em um teste inicial não basta. A equipe deveria:

1. **Revisar o código de verdade**, com pelo menos uma pessoa entendendo o que ele faz. No artigo, revisar mantém o controle e calibra a confiança.
2. **Testar além do teste inicial**: casos de borda e verificação de que o que já funcionava continua funcionando.
3. **Verificar dependências e versões.** O artigo relata a IA gerando propriedades inexistentes e documentação da versão errada.
4. **Checar o impacto no restante do sistema**, inclusive nos arquivos que a IA não alterou, porque essas ligações estão na cabeça do programador e o modelo não as enxerga.
5. **Avaliar a manutenibilidade**, evitando dívida técnica, que um dos desenvolvedores apontou como redutora da velocidade da equipe.
6. **Checar a segurança** (entradas, credenciais, dados expostos). O artigo não aprofunda esse ponto; ele entra como responsabilidade profissional.
7. **Fazer revisão por outra pessoa e commits pequenos**, para poder reverter mudanças.

**Responsabilidades que permanecem humanas:** definir a intenção e os requisitos, decidir o que aceitar ou recusar, verificar correção e segurança e responder pelo que entra no repositório.

\---

## 5\) Síntese e entregável

### Três boas práticas

1. **Pedir com clareza e em partes pequenas**, indicando arquivos, restrições e documentação.
2. **Verificar antes de aceitar**: ler os diffs, executar, testar e pedir revisão quando o código for importante.
3. **Manter o entendimento e o controle**: não incorporar código que ninguém entende, saber quando fazer à mão e declarar o uso da IA.

### Síntese

> Programar com IA de maneira responsável não significa apenas saber pedir código; significa também saber avaliar, testar e entender o que foi gerado antes de aceitar. O estudo de Sarkar e Drosos mostra que a expertise não desaparece: ela passa a ser usada para guiar a IA, revisar rápido e decidir quando assumir o controle. A confiança precisa ser construída por verificação contínua. Também é preciso saber corrigir quando a IA erra, inventa ou complica demais. Por fim, quem programa continua responsável pelo que entra no projeto, porque a IA é uma ferramenta e não assume essa responsabilidade.

