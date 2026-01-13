# Componente de Loading Personalizado

Sistema completo de loading com tema da barbearia (dourado e preto).

## 📦 Componentes Disponíveis

### 1. **Loading (Principal)**

Componente principal com múltiplas variações e tamanhos.

#### Props:

- `size`: "sm" | "md" | "lg" | "xl" (padrão: "md")
- `variant`: "spinner" | "barber" | "dots" | "pulse" (padrão: "barber")
- `text`: string opcional
- `fullscreen`: boolean (padrão: false)
- `className`: string opcional

#### Exemplos:

```tsx
import { Loading } from "@/components/ui/loading";

// Loading básico com tesoura animada
<Loading />

// Loading grande com texto
<Loading size="lg" text="Carregando serviços..." />

// Loading fullscreen
<Loading fullscreen variant="barber" text="Processando..." />

// Spinner simples
<Loading variant="spinner" size="md" />

// Dots animados
<Loading variant="dots" size="lg" />

// Pulse
<Loading variant="pulse" size="xl" />
```

---

### 2. **LoadingInline**

Loading compacto para usar inline com textos.

```tsx
import { LoadingInline } from "@/components/ui/loading";

<p>
  Buscando dados... <LoadingInline />
</p>;
```

---

### 3. **LoadingButton**

Loading específico para botões (com cores claras).

```tsx
import { LoadingButton } from "@/components/ui/loading";

<Button disabled>
  <LoadingButton />
</Button>;
```

---

### 4. **Skeleton**

Skeleton loader para placeholders.

#### Props:

- `variant`: "text" | "circular" | "rectangular" (padrão: "rectangular")
- `width`: string | number
- `height`: string | number
- `count`: number (repetir skeleton)
- `className`: string opcional

#### Exemplos:

```tsx
import { Skeleton } from "@/components/ui/loading";

// Linha de texto
<Skeleton variant="text" width="60%" />

// Avatar circular
<Skeleton variant="circular" width={48} height={48} />

// Card retangular
<Skeleton variant="rectangular" height={200} />

// Múltiplas linhas
<Skeleton variant="text" count={3} />
```

---

### 5. **LoadingCard**

Card skeleton pré-configurado.

```tsx
import { LoadingCard } from "@/components/ui/loading";

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <LoadingCard />
  <LoadingCard />
  <LoadingCard />
</div>;
```

---

### 6. **LoadingTable**

Skeleton para tabelas.

#### Props:

- `rows`: number (padrão: 5)

```tsx
import { LoadingTable } from "@/components/ui/loading";

{
  isLoading ? <LoadingTable rows={10} /> : <MyTable data={data} />;
}
```

---

## 🎨 Variantes Visuais

### **"barber"** (Padrão)

Tesoura animada com bounce - tema da barbearia.

### **"spinner"**

Spinner circular clássico em dourado.

### **"dots"**

Três pontos com animação bounce sequencial.

### **"pulse"**

Círculo com efeito pulse/ping.

---

## 📐 Tamanhos

- **sm**: 24px (w-6 h-6)
- **md**: 40px (w-10 h-10) - padrão
- **lg**: 64px (w-16 h-16)
- **xl**: 96px (w-24 h-24)

---

## 🎯 Casos de Uso

### Loading de Página Inteira

```tsx
<Loading fullscreen variant="barber" size="xl" text="Carregando..." />
```

### Loading de Seção

```tsx
<div className="h-screen flex items-center justify-center">
  <Loading size="lg" text="Buscando agendamentos..." />
</div>
```

### Loading em Cards/Listas

```tsx
{
  isLoading ? (
    <div className="grid gap-4">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  ) : (
    <ServicesList services={services} />
  );
}
```

### Loading em Botões

```tsx
<Button disabled={isSubmitting}>
  {isSubmitting ? <LoadingButton /> : "Salvar"}
</Button>
```

### Loading Inline

```tsx
<p className="text-white">
  Processando pagamento... <LoadingInline />
</p>
```

### Skeleton de Formulário

```tsx
<div className="space-y-4">
  <Skeleton variant="text" width="30%" />
  <Skeleton variant="rectangular" height={40} />

  <Skeleton variant="text" width="30%" />
  <Skeleton variant="rectangular" height={40} />

  <Skeleton variant="rectangular" width={120} height={40} />
</div>
```

---

## 🎨 Cores do Tema

O componente usa as cores definidas no tema:

- **barber-gold**: `#d4af37` - Dourado principal
- **barber-gold-light**: `#f0d166` - Dourado claro
- **barber-gold-dark**: `#b8941f` - Dourado escuro
- **barber-primary**: `#1a1a1a` - Preto principal
- **barber-primary-light**: `#2d2d2d` - Cinza escuro

---

## ⚡ Performance

Todos os componentes usam:

- ✅ Animações CSS (não JavaScript)
- ✅ `will-change` automático do Tailwind
- ✅ Otimização de re-renders
- ✅ Lightweight (sem dependências externas)

---

## 🔧 Customização

Você pode customizar usando `className`:

```tsx
<Loading variant="barber" size="lg" className="bg-blue-500/20 p-8 rounded-xl" />
```

---

## 📱 Responsivo

Todos os componentes são responsivos e adaptam-se ao container.

```tsx
<Loading
  size="sm" // Mobile
  className="md:w-16 md:h-16" // Desktop
/>
```
