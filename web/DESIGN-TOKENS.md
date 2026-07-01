# 🍎 DEBO Design Tokens — Apple Brand

> Diseño inspirado en Apple, para la app de finanzas personales DEBO.
> Extraído de Open Design (nexu-io/open-design) — Brand: Apple

---

## 🎨 Colores

### Brand

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--debo-blue` | `#0066cc` | `#2173bb` | Acción principal, links |
| `--debo-blue-hover` | `#2384d9` | `#4494d1` | Hover de botones |
| `--debo-blue-active` | `#004da6` | `#1e5d94` | Active/pressed |
| `--debo-blue-light` | `#2997ff` | `#4494d1` | Links secundarios |

### Surfaces

| Token | Light | Dark |
|-------|-------|------|
| `--debo-bg` | `#ffffff` | `#141414` |
| `--debo-bg-secondary` | `#f5f5f5` | `#1d1d1d` |
| `--debo-bg-tertiary` | `#fafafa` | `#272727` |
| `--debo-bg-elevated` | `#ffffff` | `#272727` |

### Texto

| Token | Light | Dark |
|-------|-------|------|
| `--debo-text` | `#1f1f1f` | `#dcdcdc` |
| `--debo-text-secondary` | `#595959` | `#adadad` |
| `--debo-text-tertiary` | `#8c8c8c` | `#7e7e7e` |

### Semantic

| Estado | Color | Background |
|--------|-------|------------|
| ✅ Success | `#52c41a` | `#f6ffed` |
| ⚠️ Warning | `#faad14` | `#fffbe6` |
| ❌ Error | `#ff4d4f` | `#fff2f0` |
| ℹ️ Info | `#0066cc` | `#e6f7ff` |

---

## 📐 Tipografía

| Token | Valor | Uso |
|-------|-------|-----|
| `--debo-font` | `'SF Pro HK', system-ui, ...` | Font principal |
| `--debo-font-mono` | `'SFMono-Regular', Consolas, ...` | Font mono |
| `--debo-fs-h1` | 38px | Page titles |
| `--debo-fs-h2` | 32px | Section titles |
| `--debo-fs-h3` | 26px | Card titles |
| `--debo-fs-h4` | 22px | Subsection titles |
| `--debo-fs-body` | 14px | Body text |

---

## 📏 Spacing

| Token | px | Ejemplo |
|-------|----|---------|
| `--debo-space-xs` | 4px | Íconos pequeños |
| `--debo-space-sm` | 8px | Gap entre elementos |
| `--debo-space-md` | 12px | Padding inputs |
| `--debo-space-lg` | 16px | Padding cards |
| `--debo-space-xl` | 20px | Gap secciones |
| `--debo-space-2xl` | 24px | Padding modales |
| `--debo-space-3xl` | 32px | Margen secciones |
| `--debo-space-4xl` | 48px | Padding hero |

---

## 🎯 Border Radius (Apple-style)

| Token | px | Uso |
|-------|----|-----|
| `--debo-radius-sm` | 5px | Inputs |
| `--debo-radius` | 8px | Cards, modales |
| `--debo-radius-lg` | 10px | Cards grandes |
| `--debo-radius-full` | 9999px | Badges, pills |

---

## 🧩 Componentes

### Button
```html
<button class="btn btn-primary">Comenzar</button>
<button class="btn btn-secondary">Cancelar</button>
<button class="btn btn-ghost">Ver más</button>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Card
```html
<div class="card">
  <h3>Balance total</h3>
  <p>$12,500.00</p>
</div>
```

### Input
```html
<input class="input" type="text" placeholder="Monto" />
```

### Badge
```html
<span class="badge badge-success">Pagado</span>
<span class="badge badge-warning">Pendiente</span>
<span class="badge badge-error">Vencido</span>
```

### Alert
```html
<div class="alert alert-info">
  <span class="alert-icon">ℹ️</span>
  <div class="alert-content">
    <div class="alert-title">Información</div>
    <p>Tu balance se actualizó.</p>
  </div>
</div>
```

---

> **Versión:** 1.0.0 | **Brand:** Apple (Open Design) | **Proyecto:** DEBO
