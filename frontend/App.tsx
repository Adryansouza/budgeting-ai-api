import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { categories, formatCurrency, transactions, type Transaction } from './src/mockData';
import { styles } from './src/styles';
import { colors } from './src/theme';

type Tab = 'Início' | 'Histórico' | 'Registrar' | 'Resumo' | 'Perfil';
type SheetState = 'closed' | 'entry' | 'recording' | 'success';
type AuthStage = 'onboarding' | 'login' | 'register' | 'recovery';
const barHeights = [28, 50, 37, 58, 25, 64, 40];
const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = { Alimentação: 'restaurant-outline', Transporte: 'car-outline', Moradia: 'home-outline', Lazer: 'game-controller-outline' };
const transactionIcons: Record<string, keyof typeof Ionicons.glyphMap> = { Transporte: 'car-outline', Alimentação: 'restaurant-outline', Moradia: 'home-outline', Salário: 'wallet-outline', 'Novo lançamento': 'receipt-outline' };

function Icon({ name, size = 20, color = colors.ink }: { name: keyof typeof Ionicons.glyphMap; size?: number; color?: string }) { return <Ionicons name={name} size={size} color={color} />; }
function RoundIcon({ name, onPress }: { name: keyof typeof Ionicons.glyphMap; onPress?: () => void }) { return <Pressable onPress={onPress} style={styles.iconButton}><Icon name={name} size={20} /></Pressable>; }

export default function App() {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<Tab>('Início');
  const [sheet, setSheet] = useState<SheetState>('closed');
  const [signedIn, setSignedIn] = useState(false);
  const [entry, setEntry] = useState('');
  const [items, setItems] = useState(transactions);
  const visibleTransactions = useMemo(() => items.slice(0, tab === 'Início' ? 3 : items.length), [items, tab]);

  function saveEntry(): void {
    if (!entry.trim()) return;
    setItems((current) => [{ id: String(Date.now()), title: entry.trim(), category: 'Novo lançamento', date: 'Agora', value: -35, icon: '◉' }, ...current]);
    setSheet('success');
  }

  if (!signedIn) return <SafeAreaView style={styles.safe}><StatusBar style="light" /><AuthFlow onComplete={() => setSignedIn(true)} /></SafeAreaView>;
  return <SafeAreaView style={styles.safe}><StatusBar style="light" /><View style={styles.app}><View style={styles.shell}>
    {tab === 'Início' && <Home compact={width < 355} onRecord={() => setSheet('entry')} onHistory={() => setTab('Histórico')} items={visibleTransactions} />}
    {tab === 'Histórico' && <History items={visibleTransactions} />}
    {tab === 'Resumo' && <Summary />}
    {tab === 'Perfil' && <Profile />}
  </View><BottomNav active={tab} onChange={(next) => next === 'Registrar' ? setSheet('entry') : setTab(next)} />
  <EntryModal state={sheet} entry={entry} onChange={setEntry} onClose={() => setSheet('closed')} onRecord={() => setSheet('recording')} onStop={() => setSheet('entry')} onSave={saveEntry} onHistory={() => { setSheet('closed'); setTab('Histórico'); }} /></View></SafeAreaView>;
}

function AuthFlow({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<AuthStage>('onboarding');
  const [slide, setSlide] = useState(0);
  const slides = [
    ['Registre seus gastos do seu jeito', 'Fale ou escreva como se estivesse apenas anotando.'],
    ['Fale ou escreva naturalmente', 'O Fluxo transforma uma frase curta em um lançamento claro.'],
    ['Entenda para onde seu dinheiro vai', 'Veja o que importa sem transformar sua rotina em planilhas.'],
  ];
  if (stage === 'onboarding') return <View style={styles.auth}><Text style={styles.brand}>Fluxo</Text><Text style={styles.authTitle}>{slides[slide][0]}</Text><Text style={styles.authCopy}>{slides[slide][1]}</Text><View style={styles.dots}>{slides.map((_, index) => <View key={index} style={[styles.dot, index === slide && styles.dotActive]} />)}</View><Pressable style={styles.authButton} onPress={() => slide < 2 ? setSlide(slide + 1) : setStage('login')}><Text style={styles.authButtonText}>{slide < 2 ? 'Continuar' : 'Começar'}</Text></Pressable><Pressable onPress={() => setStage('login')}><Text style={styles.authLink}>Pular</Text></Pressable></View>;
  const isRegister = stage === 'register';
  const isRecovery = stage === 'recovery';
  const title = isRecovery ? 'Recupere sua senha' : isRegister ? 'Crie sua conta' : 'Bem-vindo de volta';
  const copy = isRecovery ? 'Enviaremos um link para redefinir sua senha.' : isRegister ? 'Comece a organizar sua vida financeira.' : 'Entre para acessar o seu Fluxo.';
  return <View style={styles.auth}><Pressable onPress={() => setStage('login')}><Text style={styles.back}>← Voltar</Text></Pressable><Text style={styles.brand}>Fluxo</Text><Text style={styles.authTitle}>{title}</Text><Text style={styles.authCopy}>{copy}</Text>
    {isRegister && <><Text style={styles.inputLabel}>Nome</Text><TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor={colors.muted} /></>}
    <Text style={styles.inputLabel}>E-mail</Text><TextInput style={styles.input} placeholder="voce@email.com" placeholderTextColor={colors.muted} keyboardType="email-address" autoCapitalize="none" />
    {!isRecovery && <><Text style={styles.inputLabel}>Senha</Text><TextInput style={styles.input} placeholder="Sua senha" placeholderTextColor={colors.muted} secureTextEntry />{isRegister && <><Text style={styles.inputLabel}>Confirmar senha</Text><TextInput style={styles.input} placeholder="Confirme sua senha" placeholderTextColor={colors.muted} secureTextEntry /><Text style={styles.terms}>Ao criar sua conta, você concorda com os Termos de uso e a Política de privacidade.</Text></>}</>}
    <Pressable style={styles.authButton} onPress={isRecovery ? () => setStage('login') : onComplete}><Text style={styles.authButtonText}>{isRecovery ? 'Enviar link' : isRegister ? 'Criar conta' : 'Entrar'}</Text></Pressable>
    {!isRecovery && <Pressable onPress={() => setStage(stage === 'login' ? 'recovery' : 'login')}><Text style={styles.authLink}>{stage === 'login' ? 'Esqueci minha senha' : 'Já tenho uma conta'}</Text></Pressable>}
    {stage === 'login' && <Pressable onPress={() => setStage('register')}><Text style={styles.authLink}>Criar minha conta</Text></Pressable>}
  </View>;
}

function Home({ compact, onRecord, onHistory, items }: { compact: boolean; onRecord: () => void; onHistory: () => void; items: Transaction[] }) {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
    <View style={[styles.spread, styles.header]}><View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View><RoundIcon name="notifications-outline" /></View>
    <Text style={styles.greeting}>Olá, Adryan</Text><Text style={styles.subtitle}>Seu dinheiro, sob controle.</Text>
    <LinearGradient colors={['#314124', '#1E2C18', '#152111']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.balancePanel}><View pointerEvents="none" style={styles.gloss} /><Text style={styles.balanceLabel}>SALDO DO MÊS</Text><Text style={[styles.balance, compact && { fontSize: 29 }]}>R$ 2.450,00</Text><Text style={styles.trend}>↑ 4,78% em relação ao mês passado</Text>
      <View style={styles.bars}>{barHeights.map((height, index) => <View key={`${days[index]}-${index}`} style={styles.barWrap}><View style={[styles.bar, { height }, index === 0 || index === 4 ? styles.barAccent : null]} /><Text style={styles.day}>{days[index]}</Text></View>)}</View>
      <View style={styles.actionRow}><Pressable style={styles.primaryButton} onPress={onRecord}><Icon name="add-circle-outline" size={18} /><Text style={styles.primaryText}>Registrar</Text></Pressable><Pressable style={styles.secondaryButton} onPress={onHistory}><Icon name="arrow-forward" size={18} /><Text style={styles.secondaryText}>Histórico</Text></Pressable></View>
    </LinearGradient>
    <View style={styles.spread}><Text style={styles.sectionTitle}>Visão do mês</Text><Text style={styles.link}>Ver resumo</Text></View>
    <View style={styles.grid}>{categories.map((category, index) => <LinearGradient key={category.name} colors={index === 3 ? ['#D7FF00', '#A8D900'] : ['#283720', '#1D2A18']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.categoryCard, index === 3 && styles.categoryCardActive]}><View style={styles.categoryIcon}><Icon name={categoryIcons[category.name]} size={18} /></View><Text style={[styles.categoryTitle, index === 3 && styles.categoryActiveText]}>{category.name}</Text><Text style={[styles.categoryValue, index === 3 && styles.categoryActiveText]}>{category.value}</Text></LinearGradient>)}</View>
    <View style={[styles.spread, { marginTop: 28 }]}><Text style={styles.sectionTitle}>Recentes</Text><Text style={styles.link}>Ver todos</Text></View>{items.map((item) => <TransactionRow key={item.id} item={item} />)}
  </ScrollView>;
}

function History({ items }: { items: Transaction[] }) {
  const [filter, setFilter] = useState('Todos');
  const shown = items.filter((item) => filter === 'Todos' || (filter === 'Receitas' ? item.value > 0 : item.value < 0));
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><Text style={styles.screenTitle}>Lançamentos</Text><Text style={styles.screenSubtitle}>Acompanhe cada movimento do seu mês.</Text>
    <View style={styles.filterRow}>{['Todos', 'Despesas', 'Receitas'].map((name) => <Pressable key={name} onPress={() => setFilter(name)} style={[styles.filter, filter === name && styles.filterActive]}><Text style={[styles.filterText, filter === name && styles.filterActiveText]}>{name}</Text></Pressable>)}</View>{shown.map((item) => <TransactionRow key={item.id} item={item} />)}</ScrollView>;
}

function Summary() {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><Text style={styles.screenTitle}>Resumo</Text><Text style={styles.screenSubtitle}>Outubro de 2026</Text>
    <View style={styles.summaryHero}><Text style={styles.summaryCaption}>SALDO DISPONÍVEL</Text><Text style={styles.summaryNumber}>R$ 2.450,00</Text><Text style={styles.trend}>↑ R$ 850,00 acima do planejado</Text></View>
    <View style={styles.metricRow}><Metric label="Entradas" value="R$ 5.800" color={colors.income} /><Metric label="Saídas" value="R$ 3.350" color={colors.expense} /></View><Text style={styles.sectionTitle}>Por categoria</Text><View style={styles.ring}><Text style={styles.ringText}>R$ 2.258</Text></View>
    {categories.map((category) => <View key={category.name} style={styles.setting}><View style={styles.settingIcon}><Icon name={categoryIcons[category.name]} size={18} color={colors.lime} /></View><Text style={styles.settingText}>{category.name}</Text><Text style={styles.link}>{category.value}</Text></View>)}</ScrollView>;
}

function Profile() {
  return <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}><Text style={styles.screenTitle}>Perfil</Text><Text style={styles.screenSubtitle}>Sua conta e preferências.</Text>
    <View style={styles.profileCard}><View style={styles.profileAvatar}><Text style={[styles.avatarText, { fontSize: 28 }]}>A</Text></View><Text style={styles.profileName}>Adryan Albuquerque</Text><Text style={styles.profileMail}>adryan@email.com</Text></View>
    {['Editar perfil', 'Privacidade', 'Notificações', 'Ajuda e suporte', 'Sair da conta'].map((name, index) => <Pressable key={name} style={styles.setting}><View style={styles.settingIcon}><Icon name={(['person-outline', 'lock-closed-outline', 'notifications-outline', 'help-circle-outline', 'log-out-outline'] as const)[index]} size={19} color={colors.lime} /></View><Text style={styles.settingText}>{name}</Text><Icon name="chevron-forward" size={18} color={colors.muted} /></Pressable>)}</ScrollView>;
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) { return <View style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={[styles.metricNumber, { color }]}>{value}</Text></View>; }
function TransactionRow({ item }: { item: Transaction }) { const income = item.value > 0; return <View style={styles.transaction}><View style={styles.row}><View style={styles.transactionIcon}><Icon name={income ? 'arrow-down-outline' : transactionIcons[item.category] || 'receipt-outline'} size={18} color={income ? colors.lime : colors.white} /></View><View style={{ flex: 1 }}><Text style={styles.transactionTitle}>{item.title}</Text><Text style={styles.transactionMeta}>{item.category} · {item.date}</Text></View><Text style={[styles.transactionValue, { color: income ? colors.income : colors.expense }]}>{income ? '+' : '−'} {formatCurrency(Math.abs(item.value))}</Text></View></View>; }

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const nav: { name: Tab; icon: keyof typeof Ionicons.glyphMap }[] = [{ name: 'Início', icon: 'home-outline' }, { name: 'Histórico', icon: 'receipt-outline' }, { name: 'Registrar', icon: 'add' }, { name: 'Resumo', icon: 'pie-chart-outline' }, { name: 'Perfil', icon: 'person-outline' }];
  return <View style={styles.nav}>{nav.map((item) => <Pressable key={item.name} onPress={() => onChange(item.name)} style={styles.navItem}>{item.name === 'Registrar' ? <View style={styles.navActive}><Icon name="add" size={27} color={colors.lime} /></View> : <><Icon name={item.icon} size={20} color={active === item.name ? colors.ink : '#7D857A'} /><Text style={[styles.navLabel, active === item.name && { color: colors.ink }]}>{item.name}</Text></>}</Pressable>)}</View>;
}

function EntryModal({ state, entry, onChange, onClose, onRecord, onStop, onSave, onHistory }: { state: SheetState; entry: string; onChange: (value: string) => void; onClose: () => void; onRecord: () => void; onStop: () => void; onSave: () => void; onHistory: () => void }) {
  if (state === 'closed') return null;
  if (state === 'success') return <Modal visible transparent animationType="fade"><View style={styles.modalSuccess}><View style={styles.successCard}><View style={styles.successBadge}><Icon name="checkmark" size={34} /></View><Text style={styles.successTitle}>Despesa registrada</Text><Text style={styles.successValue}>R$ 35,00</Text><Text style={styles.successMeta}>Novo lançamento · Hoje</Text><View style={[styles.sheetActions, { width: '100%', marginTop: 28 }]}><Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Desfazer</Text></Pressable><Pressable style={styles.primaryButton} onPress={onHistory}><Text style={styles.primaryText}>Ver histórico</Text></Pressable></View></View></View></Modal>;
  return <Modal visible transparent animationType="slide"><View style={styles.overlay}><LinearGradient colors={['#2C3A25', '#172014']} style={styles.sheet}><View style={styles.sheetHandle} />{state === 'recording' ? <View style={styles.recording}><Text style={styles.sheetTitle}>Ouvindo...</Text><View style={styles.wave}>{[20, 36, 50, 30, 43, 24, 46].map((height, index) => <View key={index} style={[styles.waveBar, { height }]} />)}</View><Text style={styles.recordingText}>Pode falar naturalmente.</Text><View style={[styles.sheetActions, { width: '100%' }]}><Pressable style={styles.secondaryButton} onPress={onClose}><Text style={styles.secondaryText}>Cancelar</Text></Pressable><Pressable style={[styles.primaryButton, { backgroundColor: colors.expense }]} onPress={onStop}><Icon name="stop" size={15} /><Text style={styles.primaryText}>Parar</Text></Pressable></View></View> : <><Text style={styles.sheetTitle}>Registrar agora</Text><Text style={styles.sheetCopy}>Escreva do seu jeito ou fale para registrar.</Text><TextInput value={entry} onChangeText={onChange} placeholder="Ex.: Gastei 35 reais no Uber" placeholderTextColor={colors.muted} style={styles.textArea} multiline autoFocus /><View style={styles.sheetActions}><Pressable style={styles.secondaryButton} onPress={onRecord}><Icon name="mic-outline" size={18} /><Text style={styles.secondaryText}>Falar</Text></Pressable><Pressable style={styles.primaryButton} onPress={onSave}><Text style={styles.primaryText}>Confirmar</Text></Pressable></View></>}</LinearGradient></View></Modal>;
}
