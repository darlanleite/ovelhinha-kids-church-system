# 🐑 Ovelhinha — Sistema de Gestão Kids para Igrejas

## Visão Geral
Sistema web para igrejas gerenciarem a área kids com pulseiras de LED (ESP32-C3 + BLE).
Pais deixam seus filhos na área kids e recebem uma pulseira numerada. Quando há algum problema,
a equipe aciona a pulseira do pai pelo sistema, que acende o LED. O pai vai até a recepção.

**Tagline:** "Cada criança, no lugar certo."
**Site em produção:** https://ovelhinha.vercel.app
**Repositório:** https://github.com/darlanleite/ovelhinha-kids-church-system

---

## Stack Técnica
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (estado global com persist no localStorage)
- React Router DOM
- React Query (@tanstack/react-query)
- Recharts (gráficos)
- Sonner (toast notifications)
- Playwright (testes)
- Deploy: Vercel (auto-deploy via GitHub)

---

## Estrutura de Pastas
```
src/
  pages/          → telas do sistema
  components/     → componentes reutilizáveis
  store/          → estado global (Zustand)
    useStore.ts   → store principal
    types.ts      → interfaces TypeScript
    mockData.ts   → dados simulados
  hooks/          → hooks customizados
  lib/            → utilitários
  App.tsx         → rotas e providers
  index.css       → estilos globais
files/            → documentação do projeto (HTML)
```

---

## Rotas do Sistema
| Rota | Componente | Acesso |
|------|-----------|--------|
| `/` | Login | Público |
| `/dashboard` | Dashboard | reception |
| `/cadastro` | Cadastro | reception |
| `/acionar` | Acionar | reception |
| `/pulseiras` | Pulseiras | reception |
| `/relatorios` | Relatorios | reception |
| `/configuracoes` | Configuracoes | reception |
| `/tia` | TiaDaSala | tia |

**Autenticação:** roles `reception` e `tia`. Tia usa código de 4 dígitos do dia gerado pela recepção.

---

## Identidade Visual — Ovelhinha

### Cores (usar exatamente esses valores)
```
Primária · Azul Céu:    #5B8CFF  → botões, header, links
Secundária · Âmbar:     #FFB347  → pulseira, badges
Sucesso · Verde Mint:   #3ECFAA  → confirmações, "pai chegou"
Urgência · Coral:       #FF6B6B  → chamadas abertas, alertas
Background · Lã:        #F0EDE8  → fundo login, cards neutros
Background alt:         #F8F9FC  → fundo principal
Texto principal:        #1A1F36
Texto secundário:       #6B7280
Borda:                  #E8EAF0
```

### Tipografia
- Títulos/Logo: **Nunito** (peso 800/900, letter-spacing -0.02em)
- Corpo: **DM Sans** (peso 400/500)
- Números/Códigos: **DM Mono**

### Logo
A logo é uma ovelha SVG estilizada com:
- Corpo de lã: círculos sobrepostos em #F0EDE8
- Rosto: elipse em #5B8CFF com olhinhos brancos
- Pulseirinha no braço: retângulo em #FFB347 (referência ao produto)
- Perninhas: #D9D4CC
- Componente: `src/components/OvelhinhaLogo.tsx` (props: size, white)

---

## Interfaces TypeScript (types.ts)

```typescript
Child {
  id, name, birthDate, roomId, medicalNotes
  guardians: Guardian[]
  braceletNumber: string | null
  authorizedPickup: string | null  // pessoa autorizada a buscar
  status: 'present' | 'called' | 'left'
  checkedInAt: string
}

Guardian { id, name, phone }

Bracelet {
  id, number
  espId: string | null  // MAC address do ESP32 ex: "A4:B2:C1:D3"
  status: 'available' | 'in-use' | 'charging' | 'offline'
  battery: number  // 0-100
  guardianName: string | null
  childId: string | null
}

Call {
  id, childId, braceletNumber
  roomId: string           // sala de onde partiu a chamada
  reason, reasonIcon
  status: 'open' | 'answered' | 'reactivated'
  answeredBy: 'reception' | 'tia' | null
  createdAt, answeredAt: string | null
}

Room { id, name, emoji, ageRange }

ServiceHistory { id, date, serviceName, childrenCount, callsCount }

AppSettings { churchName, reactivateMinutes, dailyCode }
```

---

## Actions do Store (useStore.ts)

```typescript
login(role, roomId?)       → autentica usuário
logout()                   → desloga
addChild(child)            → cadastra criança
updateChild(id, updates)   → atualiza criança
addCall(call)              → cria chamada
answerCall(callId, answeredBy) → encerra chamada + libera pulseira + volta status criança
reactivateCall(callId)     → reabre chamada
updateBracelet(id, updates)→ atualiza pulseira
addBracelet(bracelet)      → registra nova pulseira
updateSettings(updates)    → atualiza configurações da igreja
addRoom / removeRoom / updateRoom → gerenciar salas
```

**Importante:** `answerCall` faz 3 coisas ao mesmo tempo:
1. Marca call como `answered` com `answeredAt` e `answeredBy`
2. Volta status da criança para `present`
3. Libera a pulseira: `status: 'available'`, `guardianName: null`, `childId: null`

---

## Funcionalidades — 31 no total, 4 fases

### 🔴 Fase 1 — MVP (essencial)
- 1.1 Cadastro rápido na chegada (nome + pulseira em <30s)
- 1.3 Modo sem impressora (número sequencial #44)
- 2.1 Chamar pelo nome ou número
- 3.1 Dashboard em tempo real
- Hardware: LED acende/apaga

### 🔵 Fase 2 — Muito útil
- 1.2 Impressão de etiqueta (nome + QR Code + número)
- 1.4 Múltiplos responsáveis (pai e mãe com pulseiras diferentes)
- 1.5 Cadastro recorrente (check-in em 1 clique)
- 2.2 Chamar por QR Code (tia aponta câmera)
- 2.3 Motivo da chamada com cor (🚽🤒😢⚠️🍼📝)
- 2.5 Reacionamento automático (pisca mais rápido após X min)
- 4.1 Login da tia por código de 4 dígitos
- 4.2 Scanner de QR Code nativo no celular
- 4.3 Busca por nome ou número
- 4.4 Lista só da sua turma
- 4.5 Notificação de confirmação no celular da tia

### 🟡 Fase 3 — Segurança
- 2.4 Encerrar chamada ("Pai chegou" → pulseira apaga)
- 3.2 Lista de crianças presentes com filtros
- 3.3 Gestão de pulseiras (status + bateria)
- 3.4 Check-out por pulseira (criança só sai com par correto)
- 3.5 Histórico e relatórios por culto
- 3.6 Configurações do sistema
- 5.1 Liberação de saída por pulseira
- 5.2 Autorização de terceiros (avó, tio)
- 5.3 Alerta de pulseira fora do alcance
- 5.4 Log de todos os eventos

### ⚪ Fase 4 — Crescimento futuro
- 6.1 Notificação por WhatsApp automático
- 6.2 Múltiplas igrejas / filiais
- 6.3 Presença e frequência mensal
- 6.4 Integração com sistemas da igreja (Ekklesia, Excel)
- 6.5 Vibração na pulseira (motor haptic)
- 1.6 Foto da criança no cadastro

---

## Arquitetura de Hardware (ESP32-C3)

```
[Tablet da recepção]
        ↓ Wi-Fi (HTTP/WebSocket)
[Roteador da Igreja]
        ↓ Wi-Fi
[Gateway 1]  [Gateway 2]  [Gateway 3]   ← ESP32-C3 fixo na tomada
        ↓ BLE 5.0 (comando por ID)
[Pulseiras dos pais]                     ← ESP32-C3 + LED RGB
```

### Componentes por pulseira
- ESP32-C3 Super Mini (~R$14) — Wi-Fi + BLE 5.0 embutidos, 22.5x18mm
- LED RGB 5mm catodo comum (~R$2)
- Bateria LiPo 3.7V 500mAh (~R$15) — autonomia ~8h
- Módulo TP4056 USB-C (~R$5) — carregador
- Resistores 220Ω — proteção do LED

### Como funciona a correlação pulseira ↔ criança
- Cada pulseira tem número físico gravado (ex: #07)
- O ESP32-C3 tem um MAC address único (espId: "A4:B2:C1:D3")
- Na configuração inicial: número #07 é mapeado ao espId
- Na recepção: recepcionista só digita o número #07 no cadastro

### Fluxo de acionamento
1. Recepcionista clica "Chamar pai" no sistema
2. Sistema envia via Wi-Fi ao gateway mais próximo
3. Gateway envia via BLE para a pulseira pelo ID
4. LED acende (cor varia por motivo: vermelho=urgência, amarelo=banheiro)
5. Pai vai à recepção → recepcionista clica "Pai chegou"
6. LED apaga + pulseira liberada + criança volta para "presente"

---

## Status do Projeto

### ✅ Concluído
- Interface web completa (todas as 8 telas)
- Estado global com Zustand + persist
- Dados simulados realistas (12 crianças, 20 pulseiras, 2 chamadas)
- Identidade visual Ovelhinha aplicada
- Deploy automático no Vercel via GitHub
- Types atualizados: espId, authorizedPickup, roomId, answeredBy

### 🔄 Em andamento
- Ajustes visuais de identidade (logo SVG nas telas)

### ⏳ Próximos passos
1. Testar todas as telas e corrigir bugs visuais
2. Implementar backend Node.js com API REST
3. Criar firmware ESP32-C3 (Arduino/PlatformIO)
4. Conectar frontend ao backend real via WebSocket
5. Testar com hardware físico

---

## Convenções de Código
- Componentes: PascalCase (Ex: `DashboardLayout.tsx`)
- Hooks: camelCase com prefixo use (Ex: `useStore.ts`)
- Sempre usar `as const` em status literals do Zustand
- Toast com ícone 🐑: `toast("Pulseira #07 acionada! 🐑")`
- Limpar localStorage ao testar novos mocks: `localStorage.removeItem('ovelhinha-storage')`
