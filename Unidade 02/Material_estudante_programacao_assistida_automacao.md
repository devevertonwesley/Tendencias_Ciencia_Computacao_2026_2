# Programação Assistida e Automação com IA

## Identificação
* Nome: Everton Wesley Pereira Oliveira
* Turma: Quinta / Vespertino
* Data: 13/09/2026
* Ferramenta de IA utilizada: Gemini

---

## 1. Problema
Desenvolver um jogo interativo da forca em Python em que o usuário precisa adivinhar uma palavra secreta sorteada aleatoriamente antes que suas tentativas acabem.

---

## 2. Entrada
* Letras (caracteres alfabéticos únicos) digitadas via teclado (input) pelo jogador ao longo das rodadas.

---

## 3. Processamento
1. Sortear uma palavra aleatória de uma lista pré-definida.
2. Validar a entrada do usuário (verificar se é apenas uma letra alfabética e se já foi tentada anteriormente).
3. Atualizar o histórico de letras tentadas e acertadas.
4. Exibir a palavra formatada com as letras corretas visíveis nas posições certas e os caracteres não descobertos representados por '_'.
5. Decrementar o contador de tentativas restantes em caso de erro.
6. Verificar continuamente as condições de vitória (todas as letras descobertas) ou derrota (tentativas esgotadas).

---

## 4. Saída esperada
* Feedback visual a cada rodada (estado da palavra mascarada, tentativas restantes e histórico de letras tentadas).
* Mensagens informando se o palpite foi correto, se houve repetição de caractere ou se a entrada é inválida.
* Mensagem final de vitória ou derrota revelando a palavra secreta.

---

## 5. Prompt utilizado
PAPEL: Atue como desenvolvedor Python sênior.
CONTEXTO: Estou desenvolvendo um jogo da forca em terminal para a disciplina de Tendências em Ciência da Computação.
PROBLEMA: Criar um script interativo do Jogo da Forca em Python.
ENTRADA: Uma entrada de texto do usuário contendo uma letra por vez.
SAÍDA ESPERADA: A exibição da palavra mascarada com '_', histórico de tentativas, contagem de vidas e mensagens de vitória/derrota.
LINGUAGEM: Python 3.
RESTRIÇÕES: Utilizar apenas a biblioteca padrão (ex: random). Não utilizar dependências externas.
CRITÉRIOS DE QUALIDADE: Código limpo, sem bugs de estado, com validação de entrada de dados.
CASOS DE TESTE: Tratar letras repetidas, entradas inválidas (números/símbolos/múltiplas letras) e letras maiúsculas/minúsculas.

---

## 6. Código inicial

# 1. Inicialização do Jogo
palavra_secreta = "programacao".lower()
letras_tentadas = []
tentativas_restantes = 6
palavra_exibida = ['_'] * len(palavra_secreta)

print("Bem-vindo ao Jogo da Forca!")
print("Adivinhe a palavra secreta.")

# 2. Loop Principal do Jogo
while tentativas_restantes > 0 and ''.join(palavra_exibida) != palavra_secreta:
    print("\n" + "-"*30)
    print(f"Palavra: {' '.join(palavra_exibida)}")
    print(f"Tentativas restantes: {tentativas_restantes}")
    print(f"Letras já tentadas: {', '.join(sorted(letras_tentadas))}")

    letra = input("Digite uma letra: ").lower()

    if not letra.isalpha() or len(letra) != 1:
        print("Por favor, digite apenas uma letra válida.")
        continue

    if letra in letras_tentadas:
        print("Você já tentou esta letra. Tente outra.")
        continue

    letras_tentadas.append(letra)

    if letra in palavra_secreta:
        print(f"Boa! A letra '{letra}' está na palavra.")
        for i, char in enumerate(palavra_secreta):
            if char == letra:
                palavra_exibida[i] = letra
    else:
        print(f"Que pena! A letra '{letra}' não está na palavra.")
        tentativas_restantes -= 1

# 3. Verificação de Vitória ou Derrota
print("\n" + "-"*30)
if ''.join(palavra_exibida) == palavra_secreta:
    print(f"Parabéns! Você adivinhou a palavra: '{palavra_secreta}'")
    print("VOCÊ VENCEU!")
else:
    print(f"Fim de jogo! Você ficou sem tentativas.")
    print(f"A palavra secreta era: '{palavra_secreta}'")
    print("VOCÊ PERDEU!")

---

## 7. Análise crítica
* Lógica e Funcionamento: O código inicial é totalmente funcional, mas apresenta baixa eficiência no gerenciamento de dados.
* Estrutura de Dados: Utiliza listas (letras_tentadas) para controle de busca, o que tem complexidade O(N) em vez de O(1).
* Mutação de Estado: A lista palavra_exibida sofre mutações contínuas a cada acerto através de loops manuais e atualização por índices, o que torna a solução mais propensa a erros de estado em cenários complexos.
* Flexibilidade: A palavra secreta era estática ("programacao") e o código não estava modularizado dentro de uma função reaproveitável.

---

## 8. Casos de teste

### Teste 1: Caso Normal
* Entrada: Sequência de letras válidas (a, p, r, o, g, m, c).
* Resultado Esperado: A palavra revela as letras digitadas e exibe a mensagem de vitória ao completar a palavra secreta.
* Resultado Obtido: Sucesso. O sistema preencheu os campos e identificou a vitória corretamente.

### Teste 2: Caso Limite / Validação
* Entrada: Caracteres especiais (#), números (5), múltiplas letras (abc) e a mesma letra repetida (a, a).
* Resultado Esperado: O programa deve alertar sobre o erro de entrada sem gastar vidas nem alterar o progresso.
* Resultado Obtido: Sucesso. Nenhuma vida foi descontada e mensagens claras foram exibidas.

### Teste 3: Caso de Erro / Derrota
* Entrada: Digitar 6 letras incorretas consecutivas (z, x, y, k, w, v).
* Resultado Esperado: O número de tentativas deve diminuir até zero e o jogo deve encerrar exibindo a mensagem de derrota com a palavra correta.
* Resultado Obtido: Sucesso. Tentativas decrementadas até o fim do jogo e mensagem de derrota disparada.

---

## 9. Problemas encontrados
1. Verificação Ineficiente: A busca por letras tentadas na lista realiza iterações desnecessárias à medida que o jogo avança.
2. Atualização Manual de Índices: Uso do laço for i, char in enumerate(...) para alterar palavra_exibida, gerando complexidade de estado dispensável.
3. Falta de Reutilização: O script corre diretamente sem estar isolado em uma função estruturada, além de não possuir uma lista diversificada de palavras.

---

## 10. Prompt de refatoração
Revise o código abaixo.
O programa já funciona. Agora analise:
- clareza;
- organização;
- duplicação;
- nomes de variáveis e funções;
- tratamento de erros e gerenciamento de estado.

Sugira melhorias sem alterar o comportamento esperado. Em especial:
1. Substitua o uso de list por set para busca rápida O(1).
2. Derive a palavra mascarada dinamicamente para evitar mutação direta de estado.
3. Encapsule o código dentro de uma função principal jogar_forca() e sorteie a palavra a partir de uma lista pré-definida.

---

## 11. Código refatorado

import random

def jogar_forca():
    # Lista de palavras para o jogo
    palavras = ["programacao", "python", "computador", "algoritmo", "desenvolvimento", "inteligencia"]
    palavra_secreta = random.choice(palavras).lower()

    # Sets para buscas mais eficientes e gerenciamento de estado
    letras_tentadas = set()
    letras_acertadas = set()
    tentativas_restantes = 6

    print("Bem-vindo ao Jogo da Forca!")
    print("Adivinhe a palavra secreta.")

    # Conjunto de letras únicas da palavra secreta para verificação de vitória
    letras_unicas_palavra = set(palavra_secreta)

    # Loop principal do jogo
    while tentativas_restantes > 0 and letras_acertadas != letras_unicas_palavra:
        print("\n" + "-"*30)

        # Exibição dinâmica da palavra com base nas letras acertadas
        palavra_a_mostrar = "".join([letra if letra in letras_acertadas else "_" for letra in palavra_secreta])
        print(f"Palavra: {palavra_a_mostrar}")

        print(f"Tentativas restantes: {tentativas_restantes}")
        print(f"Letras já tentadas: {', '.join(sorted(list(letras_tentadas)))}")

        letra = input("Digite uma letra: ").lower()

        # Validação da entrada do usuário
        if not letra.isalpha() or len(letra) != 1:
            print("Por favor, digite apenas uma letra válida.")
            continue

        # Verifica se a letra já foi tentada
        if letra in letras_tentadas:
            print("Você já tentou esta letra. Tente outra.")
            continue

        # Adiciona a letra ao conjunto de letras tentadas
        letras_tentadas.add(letra)

        # Verifica se a letra está na palavra secreta
        if letra in palavra_secreta:
            print(f"Boa! A letra '{letra}' está na palavra.")
            letras_acertadas.add(letra)
        else:
            print(f"Que pena! A letra '{letra}' não está na palavra.")
            tentativas_restantes -= 1

    # Verificação final de Vitória ou Derrota
    print("\n" + "-"*30)

    if letras_acertadas == letras_unicas_palavra:
        print(f"Parabéns! Você adivinhou a palavra: '{palavra_secreta}'")
        print("VOCÊ VENCEU!")
    else:
        print(f"Fim de jogo! Você ficou sem tentativas.")
        print(f"A palavra secreta era: '{palavra_secreta}'")
        print("VOCÊ PERDEU!")

# Para rodar o jogo:
jogar_forca()

---

## 12. Comparação

Critério | Versão Inicial | Versão Refatorada
Funcionamento correto | 5 | 5
Clareza | 3 | 5
Organização | 3 | 5
Legibilidade | 4 | 5
Tratamento de erros | 4 | 5
Facilidade de manutenção | 3 | 5

---

## 13. Reflexão

* Onde a IA mais ajudou? A IA se destacou ao sugerir otimizações de baixo nível na estrutura de dados (uso de set no lugar de list), além de encapsular o programa dentro de uma função reutilizável.
* Onde a IA errou? No fluxo inicial passivo, tendia a gerar código imperativo com atualização direta por índice em lista. O direcionamento do programador foi essencial para forçar padrões de programação limpa.
* O que precisei modificar? Foi preciso ajustar os prompts para exigir derivabilidade visual sem mutação de listas ([letra if letra in letras_acertadas else "_"]) e incluir tratamento funcional completo.
* Consigo explicar o código? Sim, o código utiliza conjuntos (set) para comparação matematicamente eficiente de interseção de caracteres, tornando o código expressivo, sem mutações manuais de estado e de fácil leitura.

---

## 14. Take Away

"Programar com IA não significa deixar a IA programar por mim. Significa..."
...utilizar a inteligência artificial como uma assistente para acelerar a exploração de alternativas e a refatoração, mantendo a responsabilidade técnica, a validação por testes e o domínio completo sobre o funcionamento e qualidade do software.

### 5 Regras para o uso responsável da IA em programação:
1. Analisar e compreender antes de executar: Nunca copie e cole código gerado sem entender o que cada instrução executa.
2. Validar com testes robustos: Crie cenários normais, de borda e de falha para testar exaustivamente as respostas da IA.
3. Proteger dados sensíveis: Jamais envie credenciais, tokens, chaves de API ou dados confidenciais nos prompts.
4. Assumir a responsabilidade: A responsabilidade por eventuais falhas, vulnerabilidades ou bugs é inteiramente do desenvolvedor humano, e não da ferramenta de IA.
5. Desenvolver incrementalmente: Solicite auxílio da IA em pequenas partes (função por função), facilitando a revisão crítica e o aprendizado.
