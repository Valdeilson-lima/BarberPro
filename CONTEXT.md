# BarberPro – Documento de Contexto Técnico

## 1. Arquitetura e Stack Tecnológica

- **Framework:** Next.js 16.0.10 (App Router + Server Components) com `reactCompiler` habilitado em [next.config.ts](next.config.ts).
- **Linguagem:** TypeScript 5 com paths `@/*` e `strict` ativo ([tsconfig.json](tsconfig.json)).
- **UI e Estilo:** TailwindCSS v4 (importado em [src/app/globals.css](src/app/globals.css)), tema proprietário com variáveis `--barber-*`, `Radix UI` + `shadcn/ui`, ícones `lucide-react`, animações `tw-animate-css`.
- **Formulários:** React Hook Form 7.68 + Zod 4 via `@hookform/resolvers`.
- **State/UX:** Toasts via `sonner`, sheet/dialog via Radix, `clsx` + `tailwind-merge` (helper `cn` em [src/lib/utils.ts](src/lib/utils.ts)).
- **Autenticação:** NextAuth.js v5 beta com GitHub Provider e Prisma Adapter (ver [src/lib/auth.ts](src/lib/auth.ts)); `SessionProvider` global em [src/components/session.auth.tsx](src/components/session.auth.tsx).
- **Banco:** PostgreSQL via Prisma ORM 7.2 (`PrismaClient` adaptado para `@prisma/adapter-pg` em [src/lib/prisma.ts](src/lib/prisma.ts)). Models gerados para browser em [src/generated/prisma](src/generated/prisma/models).
- **Internacionalização:** `date-fns` 4.1 para manipulação e formatação (locale `pt-BR` configurado nos componentes de data).
- **Infra auxiliares:** API Route para bloqueio de horários em [src/app/api/schedule/get-appointments/route.ts](src/app/api/schedule/get-appointments/route.ts), fetch público via `NEXT_PUBLIC_BASE_URL`.

```jsonc
// Trecho de package.json
"dependencies": {
  "next": "16.0.10",
  "react": "19.2.1",
  "next-auth": "^5.0.0-beta.30",
  "@prisma/client": "^7.2.0",
  "react-hook-form": "^7.68.0",
  "zod": "^4.2.1",
  "sonner": "^2.0.7"
}
```

## 2. Estrutura de Pastas e Organização

| Pasta                                                    | Propósito                                                                                     |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [src/app/(public)](<src/app/(public)>)                   | Landing page, componentes públicos e agendamento do cliente `/barber/[id]`.                   |
| [src/app/(panel)/dashboard](<src/app/(panel)/dashboard>) | Área autenticada com páginas de serviços, perfil, planos e widgets (appointments, reminders). |
| [src/components/ui](src/components/ui)                   | Design system derivado do shadcn (button, card, dialog, select, etc.).                        |
| [src/utils](src/utils)                                   | Helpers de formatação (telefone, moeda), validações de horários e máscaras.                   |
| [src/lib](src/lib)                                       | Integrações (NextAuth, Prisma, Session helper).                                               |
| [src/app/\*\*/\_actions](src/app)                        | Server Actions específicas de cada feature.                                                   |
| [src/app/\*\*/\_data-access](src/app)                    | Queries compartilhadas que rodam no servidor.                                                 |
| [prisma](prisma)                                         | Schema, migrações SQL e lock file.                                                            |

## 3. Endpoints e Rotas Principais

### Rotas Públicas

- `/` – Landing page com [Header](<src/app/(public)/_components/header.tsx>), [Hero](<src/app/(public)/_components/hero.tsx>), [Professionals](<src/app/(public)/_components/professionals.tsx>) e [Footer](<src/app/(public)/_components/footer.tsx>).
- `/barber/[id]` – Página pública de agendamento renderizada por [src/app/(public)/barber/[id]/page.tsx](<src/app/(public)/barber/[id]/page.tsx>); consome `getInfoSchedule` e renderiza [ScheduleContent](<src/app/(public)/barber/[id]/_components/schedule-content.tsx>).

### Rotas Protegidas (Dashboard)

- `/dashboard` – Home autenticada ([src/app/(panel)/dashboard/page.tsx](<src/app/(panel)/dashboard/page.tsx>)) com widgets `Appointments` e `Reminders`.
- `/dashboard/services` – Gestão de serviços ([page.tsx](<src/app/(panel)/dashboard/services/page.tsx>)).
- `/dashboard/profile` – Configuração do perfil da barbearia ([page.tsx](<src/app/(panel)/dashboard/profile/page.tsx>)).
- `/dashboard/plans` – Placeholder para planos/assinaturas.
- `/api/schedule/get-appointments` – API GET que retorna `blockedTimes` para um barbeiro/data, usado na composição dos horários.

## 4. Models e Schema do Banco de Dados (Prisma)

O schema completo está em [prisma/schema.prisma](prisma/schema.prisma). Principais entidades:

### User (Barbearia)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  address       String?
  phone         String?
  timeZone      String?
  times         String[] @default([])
  status        Boolean  @default(true)
  services      Service[]
  appointments  Appointment[]
  reminders     Reminder[]
  subscriptions Subscription?
}
```

- Relacionamentos 1:N com `Service`, `Appointment`, `Reminder`; 1:1 com `Subscription`.
- `times` armazena slots de 30 min usados para validar disponibilidade.

### Service

```prisma
model Service {
  id          String   @id @default(cuid())
  name        String
  description String
  duration    Int      // minutos
  price       Int      // centavos
  status      Boolean  @default(true)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  appointments Appointment[]
}
```

- `status` permite soft delete.

### Appointment

```prisma
model Appointment {
  id              String   @id @default(cuid())
  name            String   // cliente
  email           String
  phone           String
  appointmentDate DateTime
  time            String   // HH:mm
  serviceId       String
  userId          String
  service Service @relation(fields: [serviceId], references: [id])
  user    User    @relation(fields: [userId], references: [id])
}
```

- `appointmentDate` guarda a data; o horário específico fica em `time`.

### Subscription

- Status da assinatura com enum `Plan { BASIC, PROFESSIONAL }` e `priceId` (integração futura com Stripe).

### Reminder

- `description` + `userId`; usado para to-dos internos no dashboard.

## 5. Validação e Schemas Zod

| Arquivo                                                                                                                                                                     | Schema                                                                                     | Notas                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| [dialog-service-form.tsx](<src/app/(panel)/dashboard/services/_components/dialog-service-form.tsx>)                                                                         | `formSchema` exige `name`, `description`, `price` (string), `hours` e `minuts`.            | Usado no hook `useDialogServiceForm` para o modal CRUD.                            |
| [schedule-form.tsx](<src/app/(public)/barber/[id]/_components/schedule-form.tsx>)                                                                                           | `appointmentSchema` valida `name`, `email`, `phone`, `date`, `serviceId`.                  | A data é `Date`; a action converte para ISO string.                                |
| [profile-form.tsx](<src/app/(panel)/dashboard/profile/_components/profile-form.tsx>)                                                                                        | `profileFormSchema` exige `name`, `status`, `timeZone`; `address` e `phone` opcionais.     | `status` é string (`active`/`inactive`) e convertido para boolean antes da action. |
| [create-service.ts](<src/app/(panel)/dashboard/services/_actions/create-service.ts>) & [update-service.ts](<src/app/(panel)/dashboard/services/_actions/update-service.ts>) | Schema server-side com `name`, `description`, `price` (number), `duration`.                | Garante coerência mesmo se o form for burlado.                                     |
| [delete-service.ts](<src/app/(panel)/dashboard/services/_actions/delete-service.ts>)                                                                                        | `serviceId` obrigatório.                                                                   | Faz soft delete (`status: false`).                                                 |
| [create-appointments.ts](<src/app/(public)/barber/[id]/_actions/create-appointments.ts>)                                                                                    | Schema exige `name`, `email`, `phone`, `date` (string ISO), `time`, `serviceId`, `userId`. | Normaliza `appointmentDate` para meia-noite antes de persistir.                    |
| [update-profile.ts](<src/app/(panel)/dashboard/profile/_actions/update-profile.ts>)                                                                                         | Schema com `status` boolean, `times` opcional.                                             | Revalida `/dashboard/profile` após salvar.                                         |
| [reminder-form.tsx](<src/app/(panel)/dashboard/_components/remindres/reminder-form.tsx>) & [create-reminder.ts](<src/app/(panel)/dashboard/_actions/create-reminder.ts>)    | `description` mínimo 5 chars.                                                              | Retorna mensagens amigáveis exibidas com Sonner.                                   |

## 6. Componentes Principais e Props

### UI Reutilizável (shadcn)

| Componente                     | Localização                            | Observações                                                                          |
| ------------------------------ | -------------------------------------- | ------------------------------------------------------------------------------------ |
| Button, Input, Textarea, Label | [src/components/ui](src/components/ui) | Casados com tema `barber-*`; aceitam variantes herdadas do shadcn.                   |
| Dialog, Sheet, Collapsible     | Idem                                   | Usados em `DialogServices`, `SidebarDashboard` (Sheet mobile) e seletor de horários. |
| Select, Form, Card, ScrollArea | Idem                                   | Facilita responsividade e acessibilidade.                                            |

### Componentes de Funcionalidade

| Componente | Path | Props-chave | Responsabilidade |
| DialogServices | [src/app/(panel)/dashboard/services/\_components/dialog-services.tsx](<src/app/(panel)/dashboard/services/_components/dialog-services.tsx>) | `serviceId?`, `initialValues?`, `closeModal()` | Modal para criar/editar serviço; converte preço para centavos e duração para minutos. |
| ServicesList | [services-list.tsx](<src/app/(panel)/dashboard/services/_components/services-list.tsx>) | `services: Service[]` | Renderiza cards, dispara dialog ou exclusão com confirmação Sonner. |
| ScheduleContent | [schedule-content.tsx](<src/app/(public)/barber/[id]/_components/schedule-content.tsx>) | `barber: User & { services; subscriptions }` | Form completo de agendamento, busca horários bloqueados via API e renderiza slots disponíveis. |
| ScheduleTimesList | [schedule-times-list.tsx](<src/app/(public)/barber/[id]/_components/schedule-times-list.tsx>) | `selectedDate`, `requiredSlots`, `blockedTimes`, `barberTimes`, `onSelectTime` | Garante que intervalos consecutivos estejam livres (usa `isSlotSequenceAvailable`). |
| ProfileContent | [profile.tsx](<src/app/(panel)/dashboard/profile/_components/profile.tsx>) | `user` | Gera matriz de horários 30/30, configura time zone e dispara `updateProfile`. |
| SidebarDashboard | [sidebar.tsx](<src/app/(panel)/dashboard/_components/sidebar.tsx>) | `children` | Sidebar fixa no desktop, Sheet no mobile, colapsável com ícones. |
| ReminderList | [reminder-list.tsx](<src/app/(panel)/dashboard/_components/remindres/reminder-list.tsx>) | `reminders: Reminder[]` | Lista lembretes, abre dialog com `ReminderContent`, permite exclusão. |
| ButtonCopyLink | [button-copy-link.tsx](<src/app/(panel)/dashboard/_components/button-copy-link.tsx>) | `userId` | Copia link público usando `NEXT_PUBLIC_BASE_URL`. |

```tsx
// Exemplo: validação de slots em ScheduleTimesList
const sequenceOK = isSlotSequenceAvailable(
  timeSlot.time,
  requiredSlots,
  barberTimes,
  blockedTimes
);
const slotIsPast = dateIsToday && isSlotinThePast(timeSlot.time);
const slotEnabled = timeSlot.available && sequenceOK && !slotIsPast;
```

## 7. Actions e Server Functions

| Action                 | Path                                                                                                                | Parâmetros                                              | Side-effects                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------- |
| `createNewService`     | [services/\_actions/create-service.ts](<src/app/(panel)/dashboard/services/_actions/create-service.ts>)             | `{ name, description, price, duration }`                | Usa sessão Auth.js, cria Service e `revalidatePath("/dashboard/services")`. |
| `updateService`        | [services/\_actions/update-service.ts](<src/app/(panel)/dashboard/services/_actions/update-service.ts>)             | `{ serviceId, name, description, price, duration }`     | Garante duração mínima de 30 min; revalida serviços.                        |
| `deleteService`        | [services/\_actions/delete-service.ts](<src/app/(panel)/dashboard/services/_actions/delete-service.ts>)             | `{ serviceId }`                                         | Soft delete (`status = false`).                                             |
| `createNewAppointment` | [barber/[id]/\_actions/create-appointments.ts](<src/app/(public)/barber/[id]/_actions/create-appointments.ts>)      | `{ name, email, phone, date, time, serviceId, userId }` | Converte data ISO para `Date`, cria Appointment.                            |
| `updateProfile`        | [profile/\_actions/update-profile.ts](<src/app/(panel)/dashboard/profile/_actions/update-profile.ts>)               | `{ name, address?, phone?, status, timeZone, times? }`  | Atualiza dados da barbearia e horários; revalida perfil.                    |
| `getAllServices`       | [services/\_data-access/get-all-services.ts](<src/app/(panel)/dashboard/services/_data-access/get-all-services.ts>) | `{ userId }`                                            | Query server-side de serviços ativos (status true).                         |
| `getInfoSchedule`      | [barber/[id]/\_data-access/get-info-schedule.ts](<src/app/(public)/barber/[id]/_data-access/get-info-schedule.ts>)  | `{ userId }`                                            | Retorna usuário + serviços ativos para consumo público.                     |
| **Extras relevantes**  | `createReminder`, `deleteReminder`, `getReminders`, `getTimesBarber`, `getUserData`                                 | —                                                       | Fornecem suporte para widgets e formulários do dashboard.                   |

## 8. Utils e Funções Auxiliares

| Função                                                  | Local                                                                             | Descrição                                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `changeCurrency(event)`                                 | [src/utils/formatValue.ts](src/utils/formatValue.ts)                              | Máscara live de moeda brasileira no input.                                             |
| `convertRealToCents(amount)`                            | Idem                                                                              | Converte string "R$ 50,00" em inteiro 5000 (centavos).                                 |
| `formatValue(value)`                                    | Idem                                                                              | Usa `Intl.NumberFormat` pt-BR para exibir preços `Service`.                            |
| `formatPhone(value)` / `exractPhoneNumber(value)`       | [src/utils/formatPhone.ts](src/utils/formatPhone.ts)                              | Aplica máscara `(99) 99999-9999` e remove caracteres para persistência.                |
| `isToday`, `isSlotinThePast`, `isSlotSequenceAvailable` | [schedule-utils.ts](<src/app/(public)/barber/[id]/_components/schedule-utils.ts>) | Validam disponibilidade de horários considerando sequência necessária para um serviço. |
| `cn(...classes)`                                        | [src/lib/utils.ts](src/lib/utils.ts)                                              | Merge utilitário para Tailwind.                                                        |

## 9. Features e Funcionalidades

### Barbearias (Admin)

- CRUD de serviços com preço em centavos, descrição rica e duração (horas/minutos).
- Configuração de horários disponíveis (matriz 30/30) e fuso horário oficial.
- Visualização rápida de horários configurados (widget `AppointmentsList`, pronto para evolução).
- Lembretes internos com CRUD básico.
- Link público compartilhável para captar clientes (`ButtonCopyLink`).

### Clientes (Público)

- Página da barbearia com foto, endereço e lista de serviços.
- Seleção de serviço -> data -> horário disponível (com validação automática).
- Formulário com máscara de telefone e validação de email.
- Feedback via toast após agendar.

## 10. Variáveis de Ambiente Necessárias

| Variável                                | Uso                                                    | Referência                                                                                                                                                                    |
| --------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                          | Conexão PostgreSQL para Prisma Client.                 | [src/lib/prisma.ts](src/lib/prisma.ts)                                                                                                                                        |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Provider GitHub no NextAuth v5.                        | [src/lib/auth.ts](src/lib/auth.ts)                                                                                                                                            |
| `AUTH_SECRET` (ou `NEXTAUTH_SECRET`)    | Criptografia dos tokens NextAuth.                      | Carregado automaticamente pelo NextAuth (não hardcoded).                                                                                                                      |
| `NEXTAUTH_URL`                          | Callback base do NextAuth em produção.                 | Configuração Next.js.                                                                                                                                                         |
| `NEXT_PUBLIC_BASE_URL`                  | Construir rotas públicas e chamada da API de horários. | [schedule-content.tsx](<src/app/(public)/barber/[id]/_components/schedule-content.tsx>), [button-copy-link.tsx](<src/app/(panel)/dashboard/_components/button-copy-link.tsx>) |

> **Nota:** mantenha os valores públicos (`NEXT_PUBLIC_*`) alinhados com o domínio implantado para que os fetches client-side funcionem.

## 11. Fluxos Principais

### Fluxo de Agendamento

1. Cliente abre `/barber/[id]`; `getInfoSchedule` recupera barber + serviços.
2. Em [ScheduleContent](<src/app/(public)/barber/[id]/_components/schedule-content.tsx>), o usuário escolhe serviço (`Select`) e data (`DateTimerPicker`).
3. `fetchBlockedTimes` consulta `/api/schedule/get-appointments` para saber horários ocupados.
4. `ScheduleTimesList` aplica `isSlotSequenceAvailable` + `isSlotinThePast` para liberar apenas slots válidos.
5. Formulário coleta dados pessoais, aplica máscaras e dispara `createNewAppointment`.
6. Toast confirma sucesso e o formulário é resetado.

### Fluxo de Gestão de Serviços

1. Admin abre `/dashboard/services`; `ServiceContent` chama `getAllServices` usando o `userId` da sessão.
2. `ServicesList` renderiza cards com preço formatado (`formatValue`).
3. Ao clicar em “Adicionar/Editar”, `DialogServices` abre com `useDialogServiceForm`.
4. Submissão dispara `createNewService` ou `updateService`, que validam novamente via Zod no servidor.
5. `revalidatePath` atualiza a lista sem full reload; `router.refresh()` garante UI sync.

## 12. Temas e Customizações CSS

Core definido em [globals.css](src/app/globals.css) usando OKLCH.

| Token                    | Valor (OKLCH)         | Hex aproximado | Uso                    |
| ------------------------ | --------------------- | -------------- | ---------------------- |
| `--barber-primary`       | `oklch(0.15 0 0)`     | `#1a1a1a`      | Fundo sólido, sidebar. |
| `--barber-primary-light` | `oklch(0.21 0 0)`     | `#2d2d2d`      | Cartões e painéis.     |
| `--barber-gold`          | `oklch(0.78 0.12 85)` | `#d4af37`      | Destaques/CTAs.        |
| `--barber-gold-light`    | `oklch(0.86 0.12 85)` | `#f0d166`      | Hover/acentos.         |
| `--barber-gold-dark`     | `oklch(0.68 0.12 85)` | `#b8941f`      | Bordas e botões.       |
| `--barber-red`           | `oklch(0.35 0.15 25)` | `#8b0000`      | Estados destrutivos.   |
| `--barber-red-light`     | `oklch(0.45 0.18 25)` | `#a61010`      | Hover de erros.        |
| `--barber-red-dark`      | `oklch(0.28 0.12 25)` | `#6b0000`      | Botões críticos.       |

Dark mode redefine vars para fundos escuros e bordas translúcidas.

## 13. Responsividade e Breakpoints

- Sidebar: oculta no mobile e renderizada dentro de `Sheet` (hambúrguer). Em desktop, `SidebarDashboard` aceita estado colapsado (20px) ou expandido (64px).
- Cards do dashboard usam `grid grid-cols-1 lg:grid-cols-2` para adaptar Appointments/Reminders.
- Listas de horários (`ScheduleTimesList`) usam `grid-cols-4 md:grid-cols-5`, ajustando o número de botões.

## 14. Tratamento de Erros e Validações

- **Client-side:** RHF + Zod exibem `FormMessage` ao lado dos inputs; máscaras evitam valores inválidos.
- **Server-side:** todas as actions revalidam os schemas; erros retornam `{ error: string }` e são exibidos via `toast.error`.
- **Banco:** operações Prisma em try/catch retornam mensagens genéricas para o cliente e `console.error` detalhado no servidor.
- **API Route:** `/api/schedule/get-appointments` retorna status 400/404/500 conforme cenário.

## 15. Otimizações e Boas Práticas

- **Server Components + Actions:** evitam APIs REST extras e compartilham sessão com `auth()` diretamente.
- **Prisma Adapter PG:** melhora a compatibilidade com plataformas serverless mantendo pooling via `@prisma/adapter-pg`.
- **Image e Fonts:** `next/image` para avatars externos (GitHub) e `next/font` com Geist Sans/Mono minimizam FOUT.
- **Revalidação seletiva:** `revalidatePath` após mutations garante consistência sem rebuild global.
- **State colocalizado:** hooks personalizados (`useDialogServiceForm`, `useProfileForm`, `useReminderForm`) encapsulam validações e defaults.
- **UX imediata:** Sonner para feedback, `ButtonCopyLink` usa clipboard API, campos usam máscaras (telefone, moeda) para reduzir erros.
- **Extensibilidade:** Widgets (`AppointmentsList`) e `Subscription` model já existem para evoluções futuras (planos pagos, lista real de agendamentos).

---

Este documento consolida os pontos necessários para onboarding, manutenção e evolução do BarberPro. Atualize-o sempre que novos fluxos, models ou integrações forem adicionados.
