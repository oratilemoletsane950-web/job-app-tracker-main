import React, { useMemo, useState } from 'react';
import { ScrollView, View, Pressable, TextInput, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/text';

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Saved';
  date?: string; // YYYY-MM-DD
  nextStep?: string;
  deadline?: string; // YYYY-MM-DD
};
export type DashboardProps = {
  applications?: number;
  interviews?: number;
  offers?: number;
  jobs?: JobApplication[];
  weeklyGoal?: number;
  onAddApplication?: () => void;
  onViewApplications?: () => void;
  onExploreWorkshops?: () => void;
  onOpenApplication?: (job: JobApplication) => void;
  onViewCalendar?: () => void;
  onViewProfile?: () => void;
};

const C = { bg: '#0B0C10', card: '#161820', border: '#323440', white: '#F7F5FA', muted: '#B4B5C3', lavender: '#CFC6FF', blue: '#A5D7FA', green: '#B5E7C7', amber: '#F4D7A1' };
const STATUS = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Saved'] as const;
type Filter = typeof STATUS[number];

function Button({ label, onPress, secondary = false }: { label: string; onPress?: () => void; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !onPress }} disabled={!onPress} onPress={onPress}
    style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 17, paddingVertical: 10, borderRadius: 24, backgroundColor: secondary ? '#FFFFFF16' : '#E7E1FF', borderWidth: secondary ? 1 : 0, borderColor: '#FFFFFF38', opacity: onPress ? 1 : 0.55 }}>
    <Text style={{ fontWeight: '700', color: secondary ? C.white : '#1A1725' }}>{label}</Text>
  </Pressable>;
}
function Panel({ children }: { children: React.ReactNode }) {
  return <View style={{ backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 24, padding: 19, gap: 12 }}>{children}</View>;
}
function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <View style={{ gap: 4 }}><Text variant="h3" style={{ color: C.white }}>{title}</Text>{subtitle ? <Text style={{ color: C.muted }}>{subtitle}</Text> : null}</View>;
}
function Stat({ label, value, color }: { label: string; value: number | string; color: string }) {
  return <View style={{ flexGrow: 1, flexBasis: 120, backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 19, padding: 16, gap: 9 }}>
    <View style={{ width: 30, height: 3, borderRadius: 3, backgroundColor: color }} />
    <Text style={{ color: C.white, fontSize: 29, fontWeight: '800' }}>{value}</Text>
    <Text style={{ color: C.muted, fontSize: 12 }}>{label}</Text>
  </View>;
}
function Progress({ value, color = C.lavender }: { value: number; color?: string }) {
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.min(100, Math.max(0, value)) }} style={{ height: 9, borderRadius: 12, backgroundColor: '#393745', overflow: 'hidden' }}>
    <View style={{ height: '100%', width: `${Math.min(100, Math.max(0, value))}%`, borderRadius: 12, backgroundColor: color }} />
  </View>;
}
const formatDate = (d?: string) => d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : d || 'Not set';

export default function Dashboard({ applications, interviews, offers, jobs = [], weeklyGoal = 5, onAddApplication, onViewApplications, onExploreWorkshops, onOpenApplication, onViewCalendar, onViewProfile }: DashboardProps) {
  const { width } = useWindowDimensions();
  const narrow = width < 420;
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState('');
  const [tasks, setTasks] = useState([false, false, false]);
  const [showAll, setShowAll] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const appliedCount = applications ?? jobs.filter(j => j.status !== 'Saved').length;
  const interviewCount = interviews ?? jobs.filter(j => j.status === 'Interview').length;
  const offerCount = offers ?? jobs.filter(j => j.status === 'Offer').length;
  const savedCount = jobs.filter(j => j.status === 'Saved').length;
  const today = new Date().toLocaleDateString('en-CA');
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7)); weekStart.setHours(0, 0, 0, 0);
  const weekCount = jobs.filter(j => j.date && new Date(`${j.date}T12:00:00`) >= weekStart && j.status !== 'Saved').length;
  const goalPercent = weeklyGoal > 0 ? (weekCount / weeklyGoal) * 100 : 100;
  const responseRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;
  const upcoming = jobs.filter(j => j.deadline && j.deadline >= today).sort((a, b) => (a.deadline || '').localeCompare(b.deadline || '')).slice(0, 3);
  const filtered = useMemo(() => jobs.filter(j => (filter === 'All' || j.status === filter) && `${j.company} ${j.role}`.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => (b.date || '').localeCompare(a.date || '')), [jobs, filter, search]);
  const shown = showAll ? filtered : filtered.slice(0, 4);
  const statusColor = (status: JobApplication['status']) => status === 'Offer' ? C.green : status === 'Interview' ? C.blue : status === 'Rejected' ? '#F1B0B8' : C.lavender;
  const taskLabels = ['Review saved roles and shortlist your favourites', 'Follow up on an application', 'Improve your CV, LinkedIn or GitHub portfolio'];
  return <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ paddingHorizontal: narrow ? 16 : 24, paddingTop: 24, paddingBottom: 70, gap: 24 }} keyboardShouldPersistTaps="handled">
    <View style={{ gap: 7 }}><Text style={{ color: C.lavender, fontSize: 12, fontWeight: '700', letterSpacing: 2 }}>CAREER COMMAND CENTER / 01</Text><Text variant="h1" style={{ color: C.white, fontSize: 33 }}>Welcome back.</Text><Text style={{ color: C.muted }}>A clearer view of your next opportunity.</Text></View>

    <View style={{ borderRadius: 27, overflow: 'hidden', borderWidth: 1, borderColor: '#544E6B' }}>
      <LinearGradient colors={['#39314D', '#1B1928', '#101017']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 23, minHeight: 310, justifyContent: 'space-between', overflow: 'hidden' }}>
        <View pointerEvents="none" style={{ position: 'absolute', right: -72, top: -85, width: 315, height: 315, borderRadius: 180, borderWidth: 1, borderColor: '#D2C9FF66', transform: [{ rotate: '-26deg' }] }}><LinearGradient colors={['#D9D0FF', '#615781', '#191724', '#9788BE']} style={{ flex: 1, borderRadius: 180, opacity: 0.8 }} /></View>
        <View pointerEvents="none" style={{ position: 'absolute', right: 15, top: 24, width: 180, height: 238, borderRadius: 125, borderWidth: 2, borderColor: '#EDE8FF8A', transform: [{ rotate: '42deg' }] }} />
        <View pointerEvents="none" style={{ position: 'absolute', right: 105, top: 36, width: 8, height: 8, borderRadius: 8, backgroundColor: '#FFFFFF' }} />
        <View style={{ alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 7, borderRadius: 24, backgroundColor: '#FFFFFF1D', borderWidth: 1, borderColor: '#FFFFFF35' }}><Text style={{ color: C.white, fontSize: 12 }}>✦  YOUR NEXT CHAPTER</Text></View>
        <View style={{ gap: 12, maxWidth: '88%' }}><Text style={{ color: C.white, fontWeight: '800', fontSize: narrow ? 28 : 34, lineHeight: narrow ? 34 : 40 }}>Make your next move count.</Text><Text style={{ color: '#E4DEED' }}>Build momentum. Track every opportunity.</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 6 }}><Button label="+ Add application" onPress={onAddApplication} /><Button label="View all" secondary onPress={onViewApplications} /></View></View>
      </LinearGradient>
    </View>

    <View style={{ gap: 12 }}><Heading title="Your progress" subtitle="An overview of your job search" /><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}><Stat label="Applications" value={appliedCount} color={C.lavender} /><Stat label="Interviews" value={interviewCount} color={C.blue} /><Stat label="Offers" value={offerCount} color={C.green} /><Stat label="Saved roles" value={savedCount} color={C.amber} /></View></View>

    <Panel><Heading title="Weekly application goal" subtitle="Stay consistent, one application at a time" /><View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}><Text style={{ color: C.white, fontSize: 26, fontWeight: '800' }}>{weekCount} <Text style={{ color: C.muted, fontSize: 15 }}>/ {weeklyGoal} this week</Text></Text><Text style={{ color: C.lavender }}>{Math.min(100, Math.round(goalPercent))}%</Text></View><Progress value={goalPercent} /><Text style={{ color: C.muted }}>{weekCount >= weeklyGoal ? 'Goal reached — great momentum!' : `${Math.max(0, weeklyGoal - weekCount)} more to reach your goal.`}</Text></Panel>

    <Panel><Heading title="Quick actions" subtitle="Jump straight into your next step" /><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}><Button label="+ New application" onPress={onAddApplication} /><Button label="Applications" secondary onPress={onViewApplications} /><Button label="Calendar" secondary onPress={onViewCalendar} /><Button label="My profile" secondary onPress={onViewProfile} /></View></Panel>

    <Panel><Heading title="Application pipeline" subtitle="Where your opportunities stand" />{(['Applied', 'Interview', 'Offer', 'Rejected'] as const).map(s => { const n = jobs.filter(j => j.status === s).length; return <View key={s} style={{ gap: 7 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: C.white }}>{s}</Text><Text style={{ color: C.muted }}>{n}</Text></View><Progress value={jobs.length ? n / jobs.length * 100 : 0} color={statusColor(s)} /></View>; })}<Text style={{ color: C.muted, fontSize: 12 }}>Pipeline breakdown uses the applications supplied to this dashboard.</Text></Panel>

    <Panel><Heading title="Recent applications" subtitle="Search and filter your opportunities" /><TextInput accessibilityLabel="Search applications" placeholder="Search company or role..." placeholderTextColor="#9C9CA9" value={search} onChangeText={setSearch} style={{ minHeight: 48, borderRadius: 14, borderWidth: 1, borderColor: C.border, color: C.white, paddingHorizontal: 14, backgroundColor: '#22242D' }} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{STATUS.map(s => <Pressable key={s} accessibilityRole="button" accessibilityState={{ selected: filter === s }} onPress={() => { setFilter(s); setShowAll(false); }} style={{ minHeight: 42, justifyContent: 'center', borderRadius: 20, paddingHorizontal: 15, backgroundColor: filter === s ? '#D9D1FF' : '#2B2C35' }}><Text style={{ color: filter === s ? '#1B1825' : C.white, fontWeight: '600' }}>{s}</Text></Pressable>)}</ScrollView>{shown.length ? shown.map(j => <Pressable key={j.id} accessibilityRole="button" accessibilityState={{ disabled: !onOpenApplication }} disabled={!onOpenApplication} onPress={() => onOpenApplication?.(j)} style={{ paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.border, gap: 6 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}><Text style={{ color: C.white, fontWeight: '700', flex: 1 }}>{j.role}</Text><Text style={{ color: statusColor(j.status), fontSize: 12, fontWeight: '700' }}>{j.status}</Text></View><Text style={{ color: C.muted }}>{j.company} · {formatDate(j.date)}</Text>{j.nextStep ? <Text style={{ color: C.lavender, fontSize: 12 }}>Next: {j.nextStep}</Text> : null}</Pressable>) : <Text style={{ color: C.muted, paddingVertical: 14 }}>{jobs.length ? 'No applications match your filters.' : 'No applications yet. Add one to see it here.'}</Text>}{filtered.length > 4 ? <Button label={showAll ? 'Show less' : `Show all ${filtered.length} results`} secondary onPress={() => setShowAll(v => !v)} /> : null}<Button label="Open application tracker" secondary onPress={onViewApplications} /></Panel>

    <Panel><Heading title="Upcoming deadlines" subtitle="Important dates on your radar" />{upcoming.length ? upcoming.map(j => <View key={j.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 7 }}><View style={{ flex: 1 }}><Text style={{ color: C.white, fontWeight: '700' }}>{j.company}</Text><Text style={{ color: C.muted }}>{j.nextStep || j.role}</Text></View><Text style={{ color: C.amber }}>{formatDate(j.deadline)}</Text></View>) : <Text style={{ color: C.muted }}>No upcoming deadlines recorded.</Text>}<Button label="View calendar" secondary onPress={onViewCalendar} /></Panel>

    <Panel><Heading title="Today's career checklist" subtitle={`${tasks.filter(Boolean).length} of ${tasks.length} completed · saved for this screen session`} />{taskLabels.map((t, i) => <Pressable key={t} accessibilityRole="checkbox" accessibilityState={{ checked: tasks[i] }} onPress={() => setTasks(old => old.map((v, j) => j === i ? !v : v))} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 }}><View style={{ width: 23, height: 23, borderWidth: 1, borderColor: tasks[i] ? C.green : C.muted, backgroundColor: tasks[i] ? C.green : 'transparent', borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#171B19' }}>{tasks[i] ? '✓' : ''}</Text></View><Text style={{ color: tasks[i] ? C.muted : C.white, flex: 1, textDecorationLine: tasks[i] ? 'line-through' : 'none' }}>{t}</Text></Pressable>)}<Progress value={tasks.filter(Boolean).length / tasks.length * 100} color={C.green} /></Panel>

    <Panel><Heading title="Search insights" subtitle="A simple snapshot of your performance" /><View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}><Stat label="Interview rate" value={`${responseRate}%`} color={C.blue} /><Stat label="Offer rate" value={`${appliedCount ? Math.round(offerCount / appliedCount * 100) : 0}%`} color={C.green} /></View><Text style={{ color: C.muted, fontSize: 12 }}>Rates are based on the totals provided. They are directional indicators, not predictions.</Text></Panel>

    <Panel><Text style={{ color: C.lavender, fontSize: 12, fontWeight: '800', letterSpacing: 2 }}>LEVEL UP / WORKSHOPS</Text><Heading title="Your skills. Your edge." subtitle="Strengthen your LinkedIn, GitHub, CV and interview skills." /><View style={{ gap: 10 }}><Text style={{ color: C.white }}>✦  LinkedIn profile and networking</Text><Text style={{ color: C.white }}>✦  GitHub projects and portfolios</Text><Text style={{ color: C.white }}>✦  CV writing and interview practice</Text></View><View style={{ alignSelf: 'flex-start' }}><Button label="Explore workshops ↗" onPress={onExploreWorkshops} /></View></Panel>

    <Panel><Heading title="Career tip" subtitle="Small improvements add up" /><Text style={{ color: C.muted }}>Tailor the first few lines of your CV to the role you're applying for, and keep a note of the next action for every application.</Text>{showTips ? <Text style={{ color: C.white }}>After an interview, write down the questions you were asked and what you'd improve next time. Review them before your next one.</Text> : null}<View style={{ alignSelf: 'flex-start' }}><Button label={showTips ? 'Hide extra tip' : 'Show another tip'} secondary onPress={() => setShowTips(v => !v)} /></View></Panel>

    <Panel><Heading title={appliedCount ? 'Keep the momentum going' : 'Your journey starts here'} subtitle={appliedCount ? 'Review your opportunities and keep statuses current.' : 'Add your first application to begin tracking your progress.'} /><View style={{ alignSelf: 'flex-start' }}><Button label={appliedCount ? 'Review applications ↗' : 'Add first application ↗'} onPress={appliedCount ? onViewApplications : onAddApplication} /></View></Panel>
  </ScrollView>;
}
