# 🎨 Sistema de Loading Personalizado - BarberPro

Sistema completo de componentes de loading com tema da barbearia (dourado e preto).

## ✨ Componentes Criados

### 📍 Localização

```
src/components/ui/loading.tsx
```

### 📦 Exportações

- `Loading` - Componente principal com múltiplas variações
- `LoadingInline` - Loading para uso inline
- `LoadingButton` - Loading para botões
- `Skeleton` - Skeleton loader
- `LoadingCard` - Card skeleton pré-configurado
- `LoadingTable` - Table skeleton pré-configurado

---

## 🚀 Uso Rápido

### 1. Loading Básico (Tesoura Animada)

```tsx
import { Loading } from "@/components/ui/loading";

<Loading variant="barber" size="lg" />;
```

### 2. Com Texto

```tsx
<Loading variant="barber" size="lg" text="Carregando agendamentos..." />
```

### 3. Fullscreen

```tsx
<Loading fullscreen variant="barber" size="xl" text="Processando..." />
```

### 4. Em Botões

```tsx
import { LoadingButton } from "@/components/ui/loading";

<Button disabled={isLoading}>
  {isLoading ? <LoadingButton /> : "Salvar"}
</Button>;
```

### 5. Skeleton

```tsx
import { Skeleton } from "@/components/ui/loading";

<Skeleton variant="text" count={3} />
<Skeleton variant="circular" width={64} height={64} />
<Skeleton variant="rectangular" height={200} />
```

---

## 🎯 Variantes Disponíveis

| Variante  | Descrição                 | Uso Ideal                      |
| --------- | ------------------------- | ------------------------------ |
| `barber`  | Tesoura animada 💇‍♂️        | Loading principal da aplicação |
| `spinner` | Spinner circular clássico | Loading genérico               |
| `dots`    | Três pontos saltando      | Loading de busca/espera        |
| `pulse`   | Círculo pulsante          | Loading de status              |

## 📏 Tamanhos

| Tamanho | Dimensões | Contexto                |
| ------- | --------- | ----------------------- |
| `sm`    | 24px      | Botões pequenos, badges |
| `md`    | 40px      | Uso geral (padrão)      |
| `lg`    | 64px      | Seções, cards           |
| `xl`    | 96px      | Fullscreen, hero        |

---

## 📚 Exemplos Práticos

### Carregamento de Lista

```tsx
{
  isLoading ? (
    <div className="flex justify-center py-8">
      <Loading size="lg" variant="barber" text="Carregando agendamentos..." />
    </div>
  ) : (
    <AppointmentsList data={appointments} />
  );
}
```

### Skeleton de Card

```tsx
import { LoadingCard } from "@/components/ui/loading";

{
  isLoading ? (
    <div className="grid grid-cols-3 gap-4">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  ) : (
    <ServicesList services={services} />
  );
}
```

### Loading em Formulário

```tsx
<form onSubmit={handleSubmit}>
  {/* campos do formulário */}

  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? <LoadingButton /> : "Criar Agendamento"}
  </Button>
</form>
```

### Skeleton de Tabela

```tsx
import { LoadingTable } from "@/components/ui/loading";

{
  isLoading ? <LoadingTable rows={10} /> : <DataTable data={data} />;
}
```

---

## 🎨 Cores do Tema

As cores são definidas no `globals.css`:

```css
--barber-gold: #d4af37        /* Dourado principal */
--barber-gold-light: #f0d166  /* Dourado claro */
--barber-gold-dark: #b8941f   /* Dourado escuro */
--barber-primary: #1a1a1a     /* Preto principal */
--barber-primary-light: #2d2d2d /* Cinza escuro */
```

---

## 🔧 Arquivos Modificados

### Novos Arquivos

- ✅ `src/components/ui/loading.tsx` - Componente principal
- ✅ `src/components/ui/LOADING_USAGE.md` - Documentação detalhada
- ✅ `src/app/(panel)/dashboard/demo-loading/page.tsx` - Página de demonstração

### Arquivos Atualizados

- ✅ `src/app/(panel)/dashboard/services/_components/loading.tsx` - Atualizado com novo componente
- ✅ `src/app/(panel)/dashboard/_components/appointments/appointments-list.tsx` - Adicionado loading animado
- ✅ `src/app/(public)/barber/[id]/_components/schedule-content.tsx` - Adicionado loading de horários

---

## 👀 Ver Demonstração

Acesse a página de demonstração:

```bash
# Inicie o servidor
npm run dev

# Acesse no navegador
http://localhost:3000/dashboard/demo-loading
```

A página mostra:

- ✨ Todas as variantes de loading
- 📏 Todos os tamanhos
- 🎨 Exemplos com texto
- 💡 Casos de uso reais
- 🧪 Componentes interativos

---

## ⚡ Performance

- 🚀 Apenas CSS animations (sem JavaScript)
- 🎯 Otimizado com Tailwind
- 📦 Sem dependências externas
- ⚡ Bundle size mínimo

---

## 🎓 Boas Práticas

### ✅ Fazer

- Use `variant="barber"` como padrão (tema da aplicação)
- Adicione texto descritivo quando apropriado
- Use skeletons para melhor UX em listas/cards
- Considere usar `fullscreen` para operações críticas

### ❌ Evitar

- Não use múltiplos loadings fullscreen
- Não abuse de animações (performance)
- Não esqueça de adicionar `aria-label` em loadings importantes
- Não use loading quando o carregamento é instantâneo

---

## 🐛 Troubleshooting

### Loading não aparece

```tsx
// Verifique se importou corretamente
import { Loading } from "@/components/ui/loading";

// Não confunda com outros componentes loading
```

### Cores não funcionam

```bash
# Verifique se o Tailwind está processando o arquivo
# Reinicie o servidor de desenvolvimento
npm run dev
```

### Animação travada

```tsx
// Evite usar muitos loadings simultâneos
// Use skeleton quando possível
```

---

## 📝 Changelog

### Versão 1.0.0 (05/01/2026)

- ✅ Componente Loading principal
- ✅ 4 variantes (barber, spinner, dots, pulse)
- ✅ 4 tamanhos (sm, md, lg, xl)
- ✅ Suporte a texto e fullscreen
- ✅ LoadingInline e LoadingButton
- ✅ Sistema de Skeleton completo
- ✅ LoadingCard e LoadingTable
- ✅ Página de demonstração
- ✅ Documentação completa

---

## 🤝 Contribuindo

Para adicionar novas variantes:

1. Edite `src/components/ui/loading.tsx`
2. Adicione nova case no `renderSpinner()`
3. Documente o uso
4. Adicione exemplo na página demo

---

## 📄 Licença

Este componente faz parte do projeto BarberPro.

---

## 🎉 Pronto para Usar!

O sistema está completo e integrado. Comece a usar importando:

```tsx
import { Loading } from "@/components/ui/loading";
```

Para mais detalhes, consulte [LOADING_USAGE.md](./LOADING_USAGE.md)
