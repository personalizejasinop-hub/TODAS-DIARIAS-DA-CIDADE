# Análise e Referências - Todas Diárias da Cidade

## O que já está pronto

### Fluxo 0 — Onboarding + Login + Recuperação
- **Tela 0.1 Boas-vindas**: ✅ Implementada (Sou Candidato / Sou Contratante / Entrar / Cadastre-se)
- **Tela 0.2 Login**: ✅ E-mail, senha, Google, Facebook, Esqueceu senha
- **Tela 0.3 Redefinir senha**: ✅ Campo e fluxo de envio
- **Tela 0.4 Completar perfil**: ⚠️ Parcial — onboarding atual é focado em candidato (escolaridade, interesse, diárias, disponibilidade). Falta wizard unificado para "Como quer usar?" + dados essenciais (nome, telefone, CEP) + preferências (raio, categorias)

### Área do Candidato
- **C1 Home / Feed**: ✅ Implementada (cards, busca, filtros por categoria)
- **C2 Detalhe da Vaga**: ✅ Título, categoria, valor, endereço, data, descrição, requisitos, sobre contratante
- **C3 Confirmar candidatura**: ✅ Mensagem inicial, templates, alerta fora do raio
- **C4 Candidaturas**: ✅ Lista com status (Enviada, Em análise, etc.), chat, cancelar
- **C5 Mensagens**: ✅ Inbox com conversas e vaga vinculada
- **C6 Chat**: ✅ Mensagens, atalhos rápidos, resumo da vaga
- **C7 Minha Agenda**: ⚠️ Não existe — `step-disponibilidade` usa dias da semana + turnos, não calendário mensal
- **C8 Histórico de gigs**: ⚠️ Parcial — `minhas-diarias` existe mas com status diferente (confirmado/aguardando/finalizado) e sem filtros de avaliação
- **C9 Perfil**: ✅ Campos básicos (nome, email, etc.) — falta edição de especialidades, taxa mínima, raio, score visível
- **C10 Avaliar contratante**: ✅ `AvaliacaoModal` existe com nota, comentário e tags

### Área do Contratante
- **E1 Cadastro PF/PJ**: ⚠️ Não específico — usa o mesmo cadastro genérico
- **E2 Minhas Vagas**: ✅ Abas (Todas/Abertas/Preenchidas/Finalizadas), cards, stats
- **E3 Criar Nova Vaga**: ✅ Multi-step (básico, local/data, pagamento/requisitos), CEP, Home Office, validação
- **E4 Detalhe da Vaga**: ⚠️ Usa `GestaoCandidatos` como overlay — falta abas Detalhes/Candidatos/Mensagens/Config
- **E5 Gestão de Candidatos**: ✅ Aceitar/Recusar/Chat, score, especialidades, distância
- **E6 Convidar Talentos**: ❌ Não existe
- **E7 Chat**: ✅ Mesmo componente do candidato
- **E8 Finalizar serviço**: ❌ Não existe
- **E9 Avaliar candidato**: ✅ Modal existe
- **E10 Perfil**: ✅ Dados básicos, falta PF/PJ completo, endereço, toggle "bloquear fora do raio"

### Admin
- **A1 Login Admin**: ⚠️ Acesso via 5 taps no domínio (não é login com usuário/senha)
- **A2 Dashboard**: ✅ Cards, gráficos, categorias, usuários recentes
- **A3 Usuários**: ✅ `AdminUsers` existente
- **A4 Vagas**: ✅ `AdminVagas` existente
- **A5 Categorias**: ✅ `AdminDiarias` — CRUD de diárias
- **A6 Denúncias**: ✅ `AdminDenuncias` existente
- **A7 Banners e Push**: ❌ Não existe
- **A8 Configurações**: ❌ Não existe

### Regras de Status
- **Status de Vaga**: ✅ Tipos definidos em `types.ts` e mock-data
- **Status de Candidatura**: ✅ Tipos definidos
- **Chat**: ⚠️ Chat abre sem validação de candidatura/convite — regra anti-spam não implementada

---

## Sugestões de melhoria

### 1. **Admin em canto pequeno com login**
- **Hoje**: Admin aparece como 5ª aba no bottom nav quando logado como admin (via 5 taps no domínio).
- **Sugestão**: 
  - Remover Admin da navegação principal.
  - Adicionar link discreto no canto inferior da tela de boas-vindas (ex: "Acesso admin" em texto pequeno).
  - Exigir login com **usuário e senha específicos** (ex: admin@diarias.app + senha).
  - Não usar o mesmo fluxo de login de candidato/contratante.

### 2. **Unificação de contas (Candidato + Contratante)**
- **Hoje**: `switchMode` existe e funciona.
- **Melhoria**: Garantir que o onboarding não se repita ao alternar entre modos. Perfil único com dados completos para ambos.

### 3. **Calendário de disponibilidade**
- **Hoje**: Apenas dias da semana + turnos.
- **Sugestão**: Adicionar tela "Minha Agenda" com calendário mensal (clique para marcar/desmarcar disponível) e bloqueio automático ao aceitar vaga.

### 4. **Feed unificado com MOCK_VAGAS**
- **Hoje**: `CandidateHome` usa `MOCK_OPPORTUNITIES` com estrutura diferente de `MOCK_VAGAS`.
- **Sugestão**: Unificar em `MOCK_VAGAS` e usar o mesmo tipo `Vaga` em todo o app.

### 5. **Modal de filtros avançados**
- **Hoje**: Filtros por categoria simples.
- **Sugestão**: Modal completo com: categoria, localização, raio, tipo PF/PJ, modalidade, urgência, faixa de valor.

### 6. **Alerta de especialidade incompatível**
- Na tela de candidatura (C2/C3): avisar se o candidato não marcou a habilidade exigida pela vaga.

### 7. **Validação de datas**
- Em `CriarVaga`: garantir que data fim ≥ data início.

### 8. **CEP autocomplete**
- Integrar API ViaCEP (ou similar) para preencher endereço automaticamente.

### 9. **Score de agilidade**
- Implementar cálculo real (70% tempo resposta + 30% confirmação) e exibir "Score em construção" quando amostra &lt; 10 chats.

### 10. **Integração de backend**
- Toda a persistência é mock/localStorage. Para MVP real, considerar: Supabase, Firebase ou API própria.

---

## O que ainda falta fazer (checklist)

### Prioridade Alta (MVP)

| # | Tarefa | Onde |
|---|--------|------|
| 1 | **Admin**: Login com usuário/senha em tela separada, link discreto no canto | `login-screen.tsx`, novo `admin-login.tsx` |
| 2 | **Admin**: Remover admin da bottom nav do app principal; admin só acessível após login dedicado | `app-shell.tsx`, `bottom-nav.tsx` |
| 3 | **Completar perfil**: Etapa 1 "Como quer usar?" + dados essenciais (nome, telefone, CEP) + raio | `onboarding-flow.tsx`, novos steps |
| 4 | **Cadastro Contratante PF/PJ**: Campos específicos (CPF/CNPJ, empresa, etc.) | Novo fluxo ou step condicional |
| 5 | **Minha Agenda**: Calendário mensal para marcar disponibilidade + bloqueio ao aceitar vaga | Novo `minha-agenda.tsx` |
| 6 | **Convidar Talentos**: Busca por categoria + raio + avaliação + envio de convite | Novo `convidar-talentos.tsx` |
| 7 | **Finalizar serviço**: Botão "Concluir" no contrato após o dia; liberar avaliação | `gestao-candidatos.tsx` ou detalhe da vaga |
| 8 | **Detalhe da vaga (contratante)**: Abas Detalhes/Candidatos/Mensagens/Config com Pausar/Encerrar/Editar/Turbinar | `app-shell.tsx` overlay |
| 9 | **Persistir candidaturas**: Salvar no store/supabase ao candidatar | `store.ts`, `vaga-detail.tsx` |
| 10 | **Regra de chat**: Só abrir se candidatura enviada OU convite recebido | `chat-view.tsx`, `app-shell.tsx` |

### Prioridade Média

| # | Tarefa |
|---|--------|
| 11 | Modal de filtros avançados no feed |
| 12 | Alerta de habilidade incompatível na candidatura |
| 13 | Edição de perfil completo (candidato e contratante) |
| 14 | Tela de histórico com filtros (Todos/Concluídos/Avaliados/ Não avaliados) |
| 15 | Integrar AvaliacaoModal no fluxo pós-serviço |
| 16 | CEP autocomplete |
| 17 | Validação data fim ≥ data início |

### Prioridade Baixa (Fase 2)

| # | Tarefa |
|---|--------|
| 18 | Admin: Banners e Push |
| 19 | Admin: Configurações (raio padrão, limites, termos) |
| 20 | Cálculo real do Score de Agilidade |
| 21 | Pagamento / destaque pago |
| 22 | "Digitando" / "visto por último" no chat |
| 23 | Agenda por horário (não só dia) |

---

## Resumo executivo

- **~70%** do MVP está implementado em termos de UI e fluxos básicos.
- **Principais lacunas**: Admin com login próprio e discreto, Minha Agenda (calendário), Convidar Talentos, Finalizar serviço, Cadastro PF/PJ completo, persistência real.
- **Principais melhorias sugeridas**: Admin em canto com login, feed unificado, modal de filtros, validações e integração backend.
