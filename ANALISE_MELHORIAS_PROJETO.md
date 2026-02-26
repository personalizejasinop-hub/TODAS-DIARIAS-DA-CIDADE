# Análise Completa – Melhorias para Todas Diárias da Cidade

## Sobre a referência diaria.app

O site **diaria.app** foi analisado como referência. Principais características:

| Plano | Preço | Benefícios |
|-------|-------|------------|
| **Profissional** | R$ 19,90/mês | Candidaturas ilimitadas, 100% do valor para o profissional, contato direto, avaliações |
| **Empresarial** | R$ 29,90/mês | Vagas ilimitadas, **acesso total ao banco de profissionais**, avaliações antes de contratar, contato direto, sem comissões |

**Diferencial do diaria.app:** Contratantes têm acesso ao banco completo de profissionais; candidatos veem vagas e podem negociar via WhatsApp.

A comparação também considerou: **GetNinjas**, **Parafuzo**, **+Diarista** e documentação interna.

---

## Visibilidade cruzada (implementado)

Para alinhar ao diferencial do diaria.app, foi implementada a **visibilidade cruzada**:

- **Empresas contratantes** veem **todos os candidatos** cadastrados (aba "Candidatos" no app)
- **Candidatos** veem **todas as empresas** cadastradas (aba "Empresas" no app)

### O que foi feito

| Item | Arquivo | Descrição |
|------|---------|-----------|
| RLS Supabase | `scripts/007_visibilidade_cruzada.sql` | Políticas para contratantes verem perfis de candidatos e vice-versa |
| API Candidatos | `app/api/candidates/route.ts` | Lista todos os candidatos (acesso: contratantes e admin) |
| API Contratantes | `app/api/contratantes/route.ts` | Lista todos os contratantes (acesso: candidatos e admin) |
| Banco Candidatos | `components/contratante/banco-candidatos.tsx` | Tela com busca e link WhatsApp para cada candidato |
| Lista Empresas | `components/candidate/lista-empresas.tsx` | Tela com busca e link WhatsApp para cada empresa |
| Navegação | `bottom-nav.tsx`, `app-shell.tsx` | Aba "Candidatos" (contratantes) e "Empresas" (candidatos) |

### Como ativar

1. Execute o script `scripts/007_visibilidade_cruzada.sql` no **Supabase SQL Editor**.
2. As APIs e telas já estão integradas; basta publicar o app.

---

## O que já está bem implementado

| Área | Status | Observação |
|------|--------|------------|
| Cadastro/Login | ✅ | E-mail, senha, recuperação de senha |
| Onboarding Candidato | ✅ | Escolaridade, interesse, diárias, disponibilidade |
| Onboarding Contratante | ✅ | Tipo PF/PJ, dados, áreas (sem Escolaridade) |
| Feed de vagas | ✅ | Busca, filtros por categoria |
| Detalhe da vaga | ✅ | Candidatura com mensagem inicial |
| Candidaturas | ✅ | Lista com status, chat |
| Chat/Mensagens | ✅ | Inbox, conversas por vaga |
| Minhas Vagas | ✅ | Abas, cards, stats |
| Criar Vaga | ✅ | Multi-step (básico, local, pagamento) |
| Gestão de Candidatos | ✅ | Aceitar/Recusar, chat |
| Perfil | ✅ | Dados básicos, switch mode |
| Admin /admin | ✅ | Painel, usuários reais, vagas, categorias, denúncias |
| Supabase | ✅ | Auth, profiles, vagas, candidaturas, messages |
| **Visibilidade cruzada** | ✅ | Empresas veem todos candidatos; candidatos veem todas empresas (estilo diaria.app) |

---

## Melhorias sugeridas (priorizadas)

### Prioridade alta (MVP)

#### 1. CEP autocomplete

**Problema:** CEP é digitado manualmente.  
**Solução:** Integrar ViaCEP para preencher endereço automaticamente.

```
GET https://viacep.com.br/ws/{cep}/json/
```

**Onde:** `CriarVaga`, `StepDadosContratante`, onboarding.

---

#### 2. Validação de datas

**Problema:** Data fim pode ser anterior à data início.  
**Solução:** Garantir `dataFim >= dataInicio` em `CriarVaga` e no backend.

---

#### 3. Minha Agenda (calendário)

**Problema:** Candidato só usa dias da semana + turnos, sem calendário.  
**Solução:** Tela “Minha Agenda” com calendário mensal para marcar disponibilidade e bloqueio ao aceitar vaga.

**Referência:** GetNinjas e Parafuzo usam calendário para agendamento.

---

#### 4. Convidar talentos

**Problema:** Contratante não consegue buscar e convidar candidatos diretamente.  
**Solução:** Tela “Convidar Talentos” com busca por categoria, raio e avaliação; envio de convite para candidatura.

**Referência:** GetNinjas e Parafuzo permitem contratar direto sem depender só de candidaturas espontâneas.

---

#### 5. Finalizar serviço

**Problema:** Não há fluxo para marcar a vaga como concluída.  
**Solução:** Botão “Concluir” na gestão de candidatos ou no detalhe da vaga; liberar avaliação após conclusão.

---

#### 6. Regra de chat

**Problema:** Chat pode ser aberto sem candidatura ou convite.  
**Solução:** Permitir chat apenas quando:

- Candidatura enviada, ou  
- Convidado pelo contratante.

---

### Prioridade média

#### 7. Modal de filtros avançados

**Problema:** Filtros por categoria são básicos.  
**Solução:** Modal com:

- Categoria  
- Localização  
- Raio  
- Tipo PF/PJ  
- Modalidade (presencial/home office)  
- Urgência  
- Faixa de valor  

---

#### 8. Alerta de habilidade incompatível

**Problema:** Candidato pode se candidatar sem ter a habilidade exigida.  
**Solução:** Na tela de candidatura, avisar se o candidato não marcou a habilidade exigida pela vaga.

---

#### 9. Edição de perfil completa

**Problema:** Perfil não permite editar especialidades, taxa mínima, raio, etc.  
**Solução:** Tela de edição completa para candidato e contratante.

---

#### 10. Orçamentos (como GetNinjas)

**Problema:** Contratante publica preço fixo; em GetNinjas o cliente recebe até 4 orçamentos.  
**Solução (futuro):** Permitir vagas “solicitar orçamento” em que candidatos enviam propostas de valor.

---

### Prioridade baixa (fase 2)

| # | Melhoria | Descrição |
|---|----------|-----------|
| 11 | Score de agilidade real | Cálculo com tempo de resposta e confirmação |
| 12 | Pagamento integrado | Pix, cartão, etc. |
| 13 | Push notifications | Notificações de novas vagas/convites |
| 14 | Admin: banners | Configuração de banners na home |
| 15 | Admin: configurações | Raio padrão, limites, termos |
| 16 | “Digitando” no chat | Indicador de digitação |
| 17 | Avaliação obrigatória | Exigir avaliação após conclusão |

---

## Comparação com concorrentes

| Funcionalidade | GetNinjas | Parafuzo | +Diarista | Nosso projeto |
|----------------|-----------|----------|-----------|---------------|
| Orçamentos grátis | ✅ | ✅ | ✅ | ❌ |
| Profissionais avaliados | ✅ | ✅ | ✅ | ⚠️ Parcial |
| Calendário/agenda | ✅ | ✅ | ✅ | ❌ |
| Convidar talentos | ✅ | ✅ | ✅ | ❌ |
| Pagamento no app | ✅ | ✅ | ✅ | ❌ |
| Chat com candidato | ✅ | ✅ | ✅ | ✅ |
| Tipos de limpeza | ✅ | ✅ | ✅ | ⚠️ Categorias |
| Validação de documentos | ✅ | ✅ | ❌ | ❌ |

---

## Checklist de implementação sugerida

### Fase 1 (1–2 semanas)

- [ ] CEP autocomplete (ViaCEP)  
- [ ] Validação de datas em CriarVaga  
- [ ] Regra de chat (só abrir com candidatura ou convite)  

### Fase 2 (2–4 semanas)

- [ ] Minha Agenda (calendário)  
- [ ] Convidar Talentos  
- [ ] Finalizar serviço  

### Fase 3 (4+ semanas)

- [ ] Modal de filtros avançados  
- [ ] Alerta de habilidade incompatível  
- [ ] Edição de perfil completa  

---

## Resumo executivo

- **Estado atual:** ~75% do MVP implementado, com Supabase e admin em `/admin`.

- **Principais lacunas:**  
  - Minha Agenda  
  - Convidar Talentos  
  - Finalizar serviço  
  - CEP autocomplete  
  - Regra de chat  

- **Melhorias rápidas:**  
  - CEP autocomplete  
  - Validação de datas  
  - Regra de chat  

- **Diferenciais potenciais:**  
  - Foco em “diárias da cidade” (local)  
  - Admin com visão de usuários reais  
  - Fluxo simples e direto  
