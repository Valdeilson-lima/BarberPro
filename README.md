# BarberPro

BarberPro é uma plataforma completa de agendamento para barbearias construída com Next.js (App Router) e Prisma. O projeto combina uma landing page pública para captação de clientes, páginas públicas de agendamento e um painel administrativo protegido para gestão de serviços, horários, perfil e lembretes.

> Para um mergulho técnico completo consulte o documento [CONTEXT.md](CONTEXT.md).

## ✂️ Principais Funcionalidades

**Barbearias (Dashboard)**

- CRUD de serviços com preço em centavos, duração em horas/minutos e status ativo/inativo.
- Configuração granular de horários de atendimento (intervalos de 30 minutos) e fuso horário oficial.
- Widgets de lembretes internos com criação e exclusão direta no painel.
- Geração de link público compartilhável para página de agendamento.

**Clientes (Público)**

- Página dedicada da barbearia em [/barber/[id]](<src/app/(public)/barber/%5Bid%5D/page.tsx>) com foto, endereço e lista de serviços.
- Fluxo guiado de agendamento: escolha do serviço → seleção de data → horários disponíveis validados em tempo real.
- Formulários com máscaras (telefone, moeda) e validação Zod para reduzir erros antes do envio.

## 🧱 Stack e Arquitetura

- **Framework:** Next.js 16 (App Router, Server Components, `reactCompiler` ligado em [next.config.ts](next.config.ts)).
- **Linguagem:** TypeScript com `strict` e alias `@/*` (ver [tsconfig.json](tsconfig.json)).
- **UI:** TailwindCSS v4 com tema proprietário definido em [src/app/globals.css](src/app/globals.css), Radix UI, shadcn/ui e ícones lucide-react.
- **Formulários:** React Hook Form + Zod para validação compartilhada entre client & server actions.
- **Auth:** NextAuth.js v5 beta com GitHub provider e Prisma Adapter configurado em [src/lib/auth.ts](src/lib/auth.ts).
- **Banco:** PostgreSQL via Prisma Client gerado em [src/generated/prisma](src/generated/prisma) e instanciado em [src/lib/prisma.ts](src/lib/prisma.ts).
- **Notificações:** Sonner para feedback imediato.
- **Internacionalização:** date-fns com locale `pt-BR` nos componentes de data/horário.

## 🗂️ Estrutura de Pastas

| Pasta                                                    | Descrição                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| [src/app/(public)](<src/app/(public)>)                   | Landing page, componentes públicos e fluxo de agendamento.         |
| [src/app/(panel)/dashboard](<src/app/(panel)/dashboard>) | Painel autenticado (serviços, perfil, lembretes, planos).          |
| [src/components/ui](src/components/ui)                   | Design system (Button, Card, Dialog, Select, etc.).                |
| [src/utils](src/utils)                                   | Helpers como `formatValue`, `formatPhone`, validações de horários. |
| [src/lib](src/lib)                                       | Configurações compartilhadas (auth, prisma, helpers).              |
| [prisma](prisma)                                         | Schema, migrações e configuração do ORM.                           |

## 🗃️ Modelos de Dados (Prisma)

| Model          | Destaques                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `User`         | Representa a barbearia; campos para endereço, telefone, `times` (slots), `status` e relacionamentos com services/appointments/reminders/subscription. |
| `Service`      | Nome, descrição, duração (min), preço (centavos) e `status` para soft delete.                                                                         |
| `Appointment`  | Dados do cliente, `appointmentDate`, `time`, referência ao serviço e ao usuário (barbeiro).                                                           |
| `Reminder`     | Lembretes internos vinculados ao usuário.                                                                                                             |
| `Subscription` | Controle de plano (`Plan` enum) e `priceId` para billing futuro.                                                                                      |

## ⚙️ Server Actions e APIs Principais

- `createNewService`, `updateService`, `deleteService` em [src/app/(panel)/dashboard/services/\_actions](<src/app/(panel)/dashboard/services/_actions>). Revalidam `/dashboard/services` após cada mutação.
- `createNewAppointment` em [src/app/(public)/barber/[id]/\_actions/create-appointments.ts](<src/app/(public)/barber/%5Bid%5D/_actions/create-appointments.ts>): valida payload, normaliza data e cria o agendamento.
- `updateProfile` em [src/app/(panel)/dashboard/profile/\_actions/update-profile.ts](<src/app/(panel)/dashboard/profile/_actions/update-profile.ts>): atualiza dados da barbearia e horários configurados.
- `createReminder` / `deleteReminder` em [src/app/(panel)/dashboard/\_actions](<src/app/(panel)/dashboard/_actions>): mantém a lista de lembretes atualizada.
- `getInfoSchedule`, `getAllServices`, `getReminders`, `getTimesBarber`, `getUserData` em pastas `_data-access` para centralizar queries server-side.
- API pública [src/app/api/schedule/get-appointments/route.ts](src/app/api/schedule/get-appointments/route.ts) retorna `blockedTimes` considerando duração do serviço já reservado.

## 🌐 Variáveis de Ambiente

| Variável                                | Função                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`                          | String de conexão PostgreSQL usada pelo Prisma.                           |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Credenciais do provider GitHub no NextAuth.                               |
| `AUTH_SECRET` (ou `NEXTAUTH_SECRET`)    | Assinatura dos tokens NextAuth.                                           |
| `NEXTAUTH_URL`                          | URL base usada pelo NextAuth em produção.                                 |
| `NEXT_PUBLIC_BASE_URL`                  | Domínio público usado no fetch dos agendamentos e no botão “copiar link”. |

> Garanta que `NEXT_PUBLIC_BASE_URL` seja o mesmo domínio acessível pelos clientes para evitar bloqueios no fetch de horários.

## 🧭 Principais Fluxos

**Fluxo de Agendamento (cliente):**

1. Cliente acessa `/barber/[id]`; [getInfoSchedule](<src/app/(public)/barber/%5Bid%5D/_data-access/get-info-schedule.ts>) carrega dados da barbearia.
2. Em [ScheduleContent](<src/app/(public)/barber/%5Bid%5D/_components/schedule-content.tsx>) o usuário escolhe serviço e data.
3. `fetchBlockedTimes` chama `/api/schedule/get-appointments` com `barberId` + `date` para descobrir horários ocupados.
4. [ScheduleTimesList](<src/app/(public)/barber/%5Bid%5D/_components/schedule-times-list.tsx>) cruza slots (`user.times`) com bloqueios e duração do serviço via `isSlotSequenceAvailable`.
5. Formulário valida com Zod e envia `createNewAppointment`; Sonner mostra feedback e o form é resetado.

**Fluxo de Gestão de Serviços (admin):**

1. `ServiceContent` obtém serviços ativos via [getAllServices](<src/app/(panel)/dashboard/services/_data-access/get-all-services.ts>).
2. [ServicesList](<src/app/(panel)/dashboard/services/_components/services-list.tsx>) renderiza cards, abre `DialogServices` para criar/editar ou confirma exclusão via toast.
3. `DialogServices` usa `useDialogServiceForm` para validar campos, aplica máscara de moeda e converte para centavos antes das server actions.
4. Após cada mutação, a lista é revalidada (`revalidatePath`) e o router é atualizado (`router.refresh`).

## 🛠️ Como rodar o projeto

1. **Instale dependências**
   ```bash
   pnpm install
   # ou npm install / yarn install / bun install
   ```
2. **Configure o `.env`**
   ```env
   DATABASE_URL="postgresql://user:password@host:port/db"
   AUTH_GITHUB_ID="..."
   AUTH_GITHUB_SECRET="..."
   AUTH_SECRET="..."
   NEXTAUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
3. **Rode as migrações (opcional em dev)**
   ```bash
   npx prisma migrate dev
   # ou, se o schema já estiver atualizado:
   npx prisma generate
   ```
4. **Inicie o servidor**
   ```bash
   pnpm dev
   ```
5. Acesse `http://localhost:3000` para a landing page ou `http://localhost:3000/dashboard` após autenticar via GitHub.

## 📜 Scripts Disponíveis

| Script                   | Descrição                                              |
| ------------------------ | ------------------------------------------------------ |
| `pnpm dev`               | Inicia o Next.js em modo desenvolvimento.              |
| `pnpm build`             | Gera build de produção.                                |
| `pnpm start`             | Serve o build de produção.                             |
| `npx prisma migrate dev` | Sincroniza schema com o banco local.                   |
| `npx prisma studio`      | Inspeciona dados via UI (necessário configurar antes). |

## 🔧 Solução de Problemas Comuns

### Erro de Hidratação React

Se você encontrar o erro "A tree hydrated but some attributes of the server rendered HTML didn't match", a causa mais comum são extensões de navegador (Grammarly, gerenciadores de senha, etc.) que modificam o DOM.

**Solução:**
1. Adicione `suppressHydrationWarning` ao elemento `<html>` em [src/app/layout.tsx](src/app/layout.tsx):
   ```tsx
   <html lang="pt-BR" suppressHydrationWarning>
   ```
2. Teste em modo incógnito/privado para descartar extensões.
3. Verifique se todos os componentes UI são importados de `@/components/ui/*` e não diretamente do Radix UI.

### Importações de Componentes UI

Sempre importe componentes do diretório local:
```tsx
// ✅ Correto
import { ScrollArea } from "@/components/ui/scroll-area";

// ❌ Incorreto
import { ScrollArea } from "@radix-ui/react-scroll-area";
```

## 📚 Documentação Complementar

- [CONTEXT.md](CONTEXT.md) traz o detalhamento completo de arquitetura, validações, actions e otimizações.
- O schema Prisma atualizado está em [prisma/schema.prisma](prisma/schema.prisma).
- Componentes críticos ficam documentados em seus respectivos diretórios `_components`.

Se encontrar qualquer divergência entre este README e o contexto técnico, priorize o que está descrito em [CONTEXT.md](CONTEXT.md) e atualize ambos os arquivos para manter o alinhamento do time.
