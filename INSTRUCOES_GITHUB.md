# Instruções para subir o projeto no GitHub

Siga os passos abaixo na ordem.

---

## Passo 1: Verificar se o Git está instalado

Abra o **PowerShell** ou **Prompt de Comando** e digite:

```powershell
git --version
```

Se aparecer algo como `git version 2.x.x`, está instalado.  
Se não, instale em: https://git-scm.com/download/win

---

## Passo 2: Abrir a pasta do projeto

No PowerShell, vá até a pasta do projeto:

```powershell
cd "C:\Users\msdfe\Downloads\TODASDIARIASDACIDADE-APP"
```

---

## Passo 3: Inicializar o repositório Git

Se ainda não houver um repositório Git na pasta:

```powershell
git init
```

---

## Passo 4: Configurar seu nome e e-mail (se ainda não fez)

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

Use o mesmo e-mail da sua conta do GitHub.

---

## Passo 5: Conferir o que será enviado

Verifique se o `.env` **não** está na lista (ele não deve ser enviado):

```powershell
git status
```

Arquivos como `node_modules`, `.next`, `.env` devem estar no `.gitignore` e não aparecer em `git status`.

---

## Passo 6: Adicionar todos os arquivos

```powershell
git add .
```

---

## Passo 7: Fazer o primeiro commit

```powershell
git commit -m "Primeiro commit: Todas Diárias da Cidade - app completo"
```

---

## Passo 8: Criar o repositório no GitHub

1. Acesse: https://github.com/new  
2. Em **Repository name**, coloque: `TODASDIARIASDACIDADE-APP` (ou outro nome)  
3. Escolha **Private** ou **Public**  
4. **Não** marque "Add a README file"  
5. Clique em **Create repository**

---

## Passo 9: Conectar o projeto ao repositório

O GitHub vai mostrar comandos. Use estes (substitua `SEU_USUARIO` pelo seu usuário do GitHub):

```powershell
git remote add origin https://github.com/SEU_USUARIO/TODASDIARIASDACIDADE-APP.git
```

Exemplo, se seu usuário for `joaosilva`:

```powershell
git remote add origin https://github.com/joaosilva/TODASDIARIASDACIDADE-APP.git
```

---

## Passo 10: Enviar o código para o GitHub

```powershell
git branch -M main
git push -u origin main
```

Se pedir login, use seu usuário e senha do GitHub.  
Se usar autenticação em duas etapas, use um **Personal Access Token** em vez da senha.

---

## Criar um Personal Access Token (se precisar)

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**  
2. **Tokens (classic)** → **Generate new token**  
3. Dê um nome (ex: "TODASDIARIASDACIDADE")  
4. Marque o escopo **repo**  
5. Clique em **Generate token**  
6. Copie o token e use-o como senha quando o Git pedir.

---

## Resumo dos comandos (em sequência)

```powershell
cd "C:\Users\msdfe\Downloads\TODASDIARIASDACIDADE-APP"
git init
git add .
git commit -m "Primeiro commit: Todas Diárias da Cidade"
git remote add origin https://github.com/SEU_USUARIO/TODASDIARIASDACIDADE-APP.git
git branch -M main
git push -u origin main
```

---

## Atualizações futuras

Depois de alterar o código:

```powershell
git add .
git commit -m "Descrição da alteração"
git push
```
