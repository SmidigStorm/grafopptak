# 🎨 Admin Dashboard Layout og Struktur

## 📊 Overordnet arkitektur

### Tech stack

- **Frontend**: Next.js 15 + TypeScript
- **UI Library**: Shadcn/ui (New York stil, Neutral farger)
- **Styling**: Tailwind CSS med CSS variables
- **Icons**: Lucide React

### Filstruktur

```
app/
├── admin/
│   ├── layout.tsx          # Hovedlayout med sidebar og header
│   ├── page.tsx            # Dashboard-side
│   ├── regelsett/
│   │   └── page.tsx        # Regelsett-administrasjon
│   └── fagkoder/
│       └── page.tsx        # Fagkode-administrasjon
├── layout.tsx              # Root layout
└── page.tsx                # Redirect til /admin
```

## 🏗️ Layout-komponenter

### AdminLayout (`/app/admin/layout.tsx`)

**Ansvar**: Hovedlayout for hele admin-området

**Struktur**:

- `SidebarProvider` wrapper
- `Sidebar` med navigasjon
- `Header` med trigger og brukerinfo
- `Main` content area

**Navigasjon**:

- Dashboard (BarChart3)
- Institusjoner (Building)
- Utdanningstilbud (GraduationCap)
- Regelsett (FileText)
- Fagkoder (Database)
- Søkere (Users)
- Innstillinger (Settings)

### Dashboard (`/app/admin/page.tsx`)

**Ansvar**: Hovedoversikt og hurtighandlinger

**Komponenter**:

1. **Statistikk-kort**: Grid med 4 KPI-er

   - Institusjoner (24)
   - Utdanningstilbud (127)
   - Aktive søkere (2,847)
   - Regelsett (45)

2. **Hurtighandlinger**: 3 action-kort

   - Nytt utdanningstilbud
   - Nytt regelsett
   - Rapporter

3. **Aktivitets-feed**: Siste endringer
   - Fargekodede indikatorer
   - Tidsstempler
   - Kontekstuelle beskrivelser

## 🎨 Design-system

### Fargepalett

- **Primary**: Shadcn/ui neutral palette
- **CSS Variables**: Støtter både light/dark mode
- **Status-farger**:
  - Grønn: Aktiv/Success
  - Gul: Utkast/Warning
  - Blå: Info/Updated
  - Oransje: Pending/Alert

### Komponenter brukt

- `Card` - Innholdskort
- `Button` - Handlinger (3 varianter: default, outline, ghost)
- `Table` - Datavisning
- `Sidebar` - Navigasjon
- `Badge/Span` - Status-indikatorer

### Layout-mønstre

- **Desktop-first**: Optimalisert for admin-bruk
- **Sidebar + Main**: Klassisk admin-pattern
- **Grid layouts**: Responsive cards og tabeller
- **Konsistent spacing**: 6-units mellom seksjoner

## 🔗 Routing-struktur

### Implementerte ruter

- `/` → Redirect til `/admin`
- `/admin` → Dashboard
- `/admin/regelsett` → Regelsett-administrasjon
- `/admin/fagkoder` → Fagkode-administrasjon

### Planlagte ruter

- `/admin/institusjoner` → Institusjons-CRUD
- `/admin/utdanningstilbud` → Utdanningstilbud-CRUD
- `/admin/sokere` → Søker-administrasjon
- `/admin/innstillinger` → Systeminnstillinger

## 📱 Responsive design

### Breakpoints (Tailwind)

- `md:` - 768px+ (tablet)
- `lg:` - 1024px+ (desktop)

### Mobile considerations

- Sidebar kollapser til hamburger-meny
- Grid layouts stacker vertikalt
- Tabeller får horizontal scroll
- Touch-friendly button sizes

## 🎯 UX-prinsipper

### Navigasjon

- **Konsistent sidebar**: Alltid tilgjengelig
- **Breadcrumbs**: Implisitt via sidebar highlighting
- **Quick actions**: Prominente handlinger på dashboard

### Feedback

- **Status-indikatorer**: Farger og badges
- **Loading states**: Skeleton komponenter tilgjengelig
- **Error handling**: Toast/alert patterns (planlagt)

### Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **Keyboard navigation**: Shadcn/ui har innebygd støtte
- **Screen readers**: ARIA labels via Lucide icons

## 💡 Designbeslutninger

### Hvorfor Shadcn/ui?

- **Professional look**: Perfekt for admin-tools
- **TypeScript-first**: Type safety
- **Customizable**: Vi eier komponentene
- **Modern**: Følger beste praksis

### Hvorfor New York stil?

- **Clean og minimal**: Reduserer distraksjoner
- **God kontrast**: Lesbarhet i admin-kontekst
- **Konsistent**: Profesjonelt uttrykk

### Hvorfor sidebar layout?

- **Desktop-optimalisert**: Admin-brukere på store skjermer
- **Rask navigasjon**: Alltid synlig
- **Skalerbar**: Enkelt å legge til nye seksjoner

## 🚀 Performance

### Optimalisering

- **Server Components**: Next.js 15 app router
- **CSS Variables**: Dynamisk theming uten JS
- **Tree shaking**: Shadcn/ui importerer kun brukte komponenter
- **Bundle splitting**: Automatisk via Next.js

### Metrics

- **Initial load**: ~1.2s (development)
- **Bundle size**: Optimalisert via Next.js
- **Render performance**: React 18 optimalisering
