# Regras para o Assistente AI

## Obrigatório: Testar antes de commitar

1. **Testar 3x antes do git** — após qualquer alteração no código, testar o sistema manualmente 3 vezes de formas diferentes, garantindo 100% de certeza que o update funciona.
2. **Commits apenas após os 3 testes** — só depois dos testes bem-sucedidos pode fazer `git add`, `git commit` e `git push`.
3. **Testar 2x depois do git** — após o push, testar novamente o sistema 2 vezes para confirmar que está funcionando igual aos testes anteriores.
4. **Confirmar para o usuário** — depois de tudo testado, avisar que está funcionando.

## Dados de teste

- Se os testes envolverem gravar dados no banco para conferir funcionamento, **excluir os dados de teste após os testes**.
- Ter **certeza absoluta** de que os dados deletados são **somente os de teste** e não dados reais já existentes no banco.
