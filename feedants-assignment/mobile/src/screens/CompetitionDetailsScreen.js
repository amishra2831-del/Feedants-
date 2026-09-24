import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { SectionTitle } from '../components/SectionTitle';
import { Pill } from '../components/Pill';
import { Countdown } from '../components/Countdown';
import { BottomNav } from '../components/BottomNav';
import { colors } from '../constants/theme';
import { api } from '../services/api';

const COMPETITION_ID = process.env.EXPO_PUBLIC_COMPETITION_ID || '';
const money = n => `₹ ${Number(n).toLocaleString('en-IN')}`;
const dateText = value => new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
const timeText = value => new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

export default function CompetitionDetailsScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('About Competition');
  const [submissionUrl, setSubmissionUrl] = useState('');

  async function load(showRefresh = false) {
    if (!COMPETITION_ID) { setLoading(false); return; }
    showRefresh ? setRefreshing(true) : setLoading(true);
    try { const result = await api.getCompetition(COMPETITION_ID); setData(result.data); } catch (e) { Alert.alert('Could not load competition', e.message); } finally { setLoading(false); setRefreshing(false); }
  }
  useEffect(() => { load(); }, []);

  async function register() {
    setBusy(true);
    try { await api.register(COMPETITION_ID); await load(true); Alert.alert('Success', 'You are registered for this competition.'); }
    catch (e) { Alert.alert('Registration', e.message); }
    finally { setBusy(false); }
  }
  async function submit() {
    if (!submissionUrl.trim()) return Alert.alert('Submission', 'Please enter your video URL.');
    setBusy(true);
    try { await api.submit(COMPETITION_ID, submissionUrl.trim()); await load(true); Alert.alert('Submitted', 'Your submission has been saved.'); }
    catch (e) { Alert.alert('Submission', e.message); }
    finally { setBusy(false); }
  }

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary}/><Text style={styles.muted}>Loading competition…</Text></View>;
  if (!data) return <View style={styles.center}><Text style={styles.title}>Set EXPO_PUBLIC_COMPETITION_ID after seeding the database.</Text><Text style={styles.muted}>The API and UI are intentionally data-driven.</Text></View>;

  const tabs = ['About Competition', 'Judging Parameters', 'Rules & Eligibility'];
  const canRegister = data.lifecycle === 'REGISTRATION_OPEN' && !data.userState.isRegistered && data.remainingSpots > 0;
  const canSubmit = data.lifecycle === 'SUBMISSION_OPEN' && data.userState.isRegistered;

  return <View style={styles.screen}>
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)}/>} contentContainerStyle={styles.content}>
      <View style={styles.header}><Ionicons name="arrow-back" size={24} color={colors.text}/><Text style={styles.back}>Go back</Text><View style={styles.lang}><Text style={styles.langActive}>ENG</Text><Text style={styles.langHi}>हिंदी</Text></View></View>

      <Card>
        <View style={styles.titleRow}><View style={{flex:1}}><Text style={styles.title}>{data.title}</Text><View style={styles.pills}><Pill>{data.category}</Pill><Pill>{data.format}</Pill><Text style={styles.winner}>🏆 Winners get certificate</Text></View></View><View style={styles.registered}><Ionicons name="checkmark-circle" size={18} color={colors.primary}/><Text style={styles.registeredText}>{data.userState.isRegistered ? 'Registered' : data.lifecycle === 'REGISTRATION_OPEN' ? 'Open' : data.lifecycle.replace('_',' ')}</Text></View></View>
        <View style={styles.stats}><Stat label="Prize Pool" value={money(data.prizePool)}/><Stat label="Entry Fee" value={money(data.entryFee)}/><View style={styles.stat}><Text style={styles.label}>👥 {data.remainingSpots} spots left</Text><View style={styles.progress}><View style={[styles.progressFill,{width:`${Math.min(data.registeredCount/data.maxParticipants*100,100)}%`}]} /></View><Text style={styles.small}>{data.registeredCount} / {data.maxParticipants} Booked</Text></View></View>
      </Card>

      <Card><View style={styles.judgeRow}><Image source={{uri:data.judge.imageUrl}} style={styles.avatar}/><View style={{flex:1}}><Text style={styles.muted}>Judge</Text><Text style={styles.judge}>{data.judge.name}</Text><Text style={styles.muted}>{data.judge.title}</Text><Text style={styles.muted}>{data.judge.experience}</Text></View><Pressable onPress={() => data.judge.introVideoUrl && Linking.openURL(data.judge.introVideoUrl)} style={styles.play}><Ionicons name="play" size={22} color={colors.primary}/><Text style={styles.muted}>Intro Video</Text></Pressable></View></Card>

      <Countdown target={data.countdownTarget} label={data.lifecycle === 'REGISTRATION_OPEN' ? 'Registration closes in' : data.lifecycle === 'SUBMISSION_OPEN' ? 'Submission closes in' : 'Next milestone'}/>

      <Card><SectionTitle>Important Dates</SectionTitle><View style={styles.dateGrid}><DateCell icon="calendar-outline" label="Register Before" value={data.registrationEndsAt}/><DateCell icon="paper-plane-outline" label="Submission Starts" value={data.submissionStartsAt}/><DateCell icon="cloud-upload-outline" label="Submission Ends" value={data.submissionEndsAt}/><DateCell icon="trophy-outline" label="Result Date" value={data.resultAt}/></View></Card>

      <Card><SectionTitle>Previous Winners</SectionTitle><ScrollView horizontal showsHorizontalScrollIndicator={false}>{data.previousWinners.map((w,i)=><View style={styles.winnerCard} key={`${w.name}-${i}`}><View><Image source={{uri:w.imageUrl}} style={styles.winnerImage}/><View style={styles.miniPlay}><Ionicons name="play" size={12} color={colors.white}/></View></View><Text style={styles.winnerName}>{w.name}</Text><Text style={styles.muted}>{w.position}</Text></View>)}</ScrollView></Card>

      <Card><View style={styles.tabs}>{tabs.map(t=><Pressable key={t} onPress={()=>setTab(t)} style={[styles.tab,tab===t&&styles.tabActive]}><Text style={[styles.tabText,tab===t&&styles.tabTextActive]}>{t}</Text></Pressable>)}</View>{tab==='About Competition'&&<><Text style={styles.body}>{data.description}</Text><Text style={styles.viewMore}>View more⌄</Text></>}{tab==='Judging Parameters'&&data.judgingParameters.map(x=><Text style={styles.bullet} key={x}>• {x}</Text>)}{tab==='Rules & Eligibility'&&data.rules.map(x=><Text style={styles.bullet} key={x}>• {x}</Text>)}</Card>

      <Card><SectionTitle>Rewards (All Positions)</SectionTitle>{data.rewards.map(r=><View style={styles.reward} key={r.position}><Text style={styles.medal}>{r.position <= 3 ? ['🏆','🥈','🥉'][r.position-1] : '☆'}</Text><Text style={styles.rewardLabel}>{r.label}</Text><Text style={styles.amount}>{money(r.amount)}</Text></View>)}</Card>

      <View style={styles.disclaimer}><Ionicons name="information-circle-outline" size={20} color={colors.primary}/><Text style={styles.disclaimerText}>{data.disclaimer}</Text></View>

      <Card><View style={styles.infoRow}><View style={styles.infoBox}><Ionicons name="play-circle" size={26} color={colors.primary}/><Text style={styles.infoTitle}>How will you receive prize money?</Text><Text style={styles.muted}>Watch video to know more</Text></View><View style={styles.infoBox}><Ionicons name="shield-checkmark-outline" size={26} color={colors.text}/><Text style={styles.infoTitle}>Refund policy</Text><Text style={styles.muted}>{data.refundPolicy}</Text><Text style={styles.muted}>{data.paymentNote}</Text></View></View></Card>

      <View style={styles.referral}><Text style={styles.referralTitle}>📣 Refer & Earn more discount</Text><View style={styles.referralRow}><TextInput style={styles.referralInput} value="https://feedants.com/r/referral123" editable={false}/><Pressable style={styles.copy}><Text style={styles.copyText}>Copy Link</Text></Pressable></View><Text style={styles.earn}>You earn {money(data.referralAmount)} for every signup</Text></View>

      <Card><View style={styles.userRow}><Ionicons name="chatbubble-ellipses-outline" size={26} color={colors.text}/><View style={{flex:1}}><Text style={styles.infoTitle}>Hear From Our Users</Text><Text style={styles.muted}>See what participants say about Feedants</Text></View><Ionicons name="chevron-forward" size={20} color={colors.text}/></View></Card>

      {canSubmit && <Card><Text style={styles.infoTitle}>Upload Submission</Text><Text style={styles.muted}>Paste a public video URL for judging.</Text><TextInput placeholder="https://..." value={submissionUrl} onChangeText={setSubmissionUrl} autoCapitalize="none" style={styles.input}/><Pressable style={styles.primaryButton} disabled={busy} onPress={submit}><Text style={styles.buttonText}>{busy ? 'Saving…' : data.userState.hasSubmission ? 'Update Submission' : 'Submit Video'}</Text></Pressable></Card>}

      {!canSubmit && <Pressable style={[styles.primaryButton, !canRegister && styles.disabled]} disabled={!canRegister || busy} onPress={register}><Text style={styles.buttonText}>{data.userState.isRegistered ? 'Registered' : data.lifecycle !== 'REGISTRATION_OPEN' ? data.lifecycle.replace('_',' ') : data.remainingSpots === 0 ? 'Registration Full' : busy ? 'Registering…' : `Register • ${money(data.entryFee)}`}</Text></Pressable>}
    </ScrollView>
    <BottomNav/>
  </View>;
}
function Stat({label,value}){return <View style={styles.stat}><Text style={styles.label}>{label}</Text><Text style={styles.big}>{value}</Text></View>}
function DateCell({icon,label,value}){return <View style={styles.dateCell}><Ionicons name={icon} size={22} color={colors.primary}/><View><Text style={styles.muted}>{label}</Text><Text style={styles.date}>{dateText(value)}</Text><Text style={styles.time}>{timeText(value)}</Text></View></View>}

const styles=StyleSheet.create({screen:{flex:1,backgroundColor:colors.background},content:{padding:14,paddingBottom:24},center:{flex:1,alignItems:'center',justifyContent:'center',padding:24},header:{flexDirection:'row',alignItems:'center',marginBottom:12},back:{fontSize:15,fontWeight:'800',color:colors.text,marginLeft:10},lang:{marginLeft:'auto',flexDirection:'row',borderRadius:20,overflow:'hidden',borderWidth:1,borderColor:colors.border},langActive:{backgroundColor:colors.primary,color:colors.white,paddingHorizontal:10,paddingVertical:6,fontWeight:'800'},langHi:{paddingHorizontal:10,paddingVertical:6,color:colors.text},titleRow:{flexDirection:'row',alignItems:'flex-start'},title:{fontSize:20,fontWeight:'900',color:colors.text},pills:{flexDirection:'row',alignItems:'center',marginTop:8,flexWrap:'wrap'},winner:{fontSize:11,color:colors.primary,fontWeight:'700'},registered:{backgroundColor:colors.primarySoft,borderRadius:10,padding:8,flexDirection:'row',alignItems:'center',gap:4},registeredText:{fontSize:10,fontWeight:'800',color:colors.primaryDark},stats:{flexDirection:'row',marginTop:18,gap:14},stat:{flex:1},label:{fontSize:11,color:colors.muted,fontWeight:'700'},big:{fontSize:24,color:colors.primary,fontWeight:'900',marginTop:2},small:{fontSize:9,color:colors.muted,marginTop:3},progress:{height:5,backgroundColor:'#DCEDEF',borderRadius:5,overflow:'hidden',marginTop:10},progressFill:{height:5,backgroundColor:colors.primary},judgeRow:{flexDirection:'row',alignItems:'center',gap:12},avatar:{width:72,height:72,borderRadius:36},judge:{fontSize:16,fontWeight:'900',color:colors.text,marginVertical:3},play:{alignItems:'center',justifyContent:'center',gap:3},muted:{fontSize:11,color:colors.muted},dateGrid:{flexDirection:'row',flexWrap:'wrap'},dateCell:{width:'50%',flexDirection:'row',gap:9,paddingVertical:12},date:{fontSize:13,color:colors.primary,fontWeight:'900',marginTop:3},time:{fontSize:11,color:colors.text,fontWeight:'700'},winnerCard:{width:104,marginRight:10},winnerImage:{width:94,height:78,borderRadius:12},miniPlay:{position:'absolute',right:3,bottom:3,width:25,height:25,borderRadius:13,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},winnerName:{fontWeight:'800',color:colors.text,fontSize:11,marginTop:6},tabs:{flexDirection:'row',borderBottomWidth:1,borderColor:colors.border,marginBottom:12},tab:{flex:1,paddingBottom:9,alignItems:'center'},tabActive:{borderBottomWidth:3,borderBottomColor:colors.primary},tabText:{fontSize:10,color:colors.muted,fontWeight:'700',textAlign:'center'},tabTextActive:{color:colors.primary},body:{fontSize:13,color:'#56617A',lineHeight:21},viewMore:{textAlign:'center',color:colors.primary,fontWeight:'800',marginTop:7},bullet:{fontSize:13,color:'#56617A',lineHeight:23},reward:{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderColor:'#F0F2F5'},medal:{width:34,fontSize:20},rewardLabel:{flex:1,fontSize:12,fontWeight:'800',color:colors.text},amount:{fontSize:13,color:colors.primary,fontWeight:'900'},disclaimer:{backgroundColor:colors.primarySoft,borderRadius:12,padding:10,flexDirection:'row',gap:8,marginBottom:12},disclaimerText:{fontSize:10,color:colors.text,flex:1,lineHeight:16},infoRow:{flexDirection:'row',gap:14},infoBox:{flex:1},infoTitle:{fontSize:12,fontWeight:'900',color:colors.text,marginVertical:4},referral:{backgroundColor:'#E9FAF1',borderRadius:14,padding:14,marginBottom:12},referralTitle:{fontSize:14,fontWeight:'900',color:colors.text,marginBottom:8},referralRow:{flexDirection:'row'},referralInput:{flex:1,height:38,borderWidth:1,borderColor:'#B8DDD1',backgroundColor:colors.white,borderTopLeftRadius:8,borderBottomLeftRadius:8,paddingHorizontal:8,fontSize:10},copy:{backgroundColor:colors.white,borderWidth:1,borderLeftWidth:0,borderColor:'#B8DDD1',justifyContent:'center',paddingHorizontal:9,borderTopRightRadius:8,borderBottomRightRadius:8},copyText:{fontSize:10,fontWeight:'800',color:colors.primary},earn:{textAlign:'right',fontSize:10,color:colors.primaryDark,fontWeight:'700',marginTop:5},userRow:{flexDirection:'row',alignItems:'center',gap:10},input:{borderWidth:1,borderColor:colors.border,borderRadius:10,paddingHorizontal:12,paddingVertical:10,marginTop:10,marginBottom:10},primaryButton:{backgroundColor:colors.primary,borderRadius:12,padding:15,alignItems:'center',marginBottom:10},disabled:{backgroundColor:'#9FBFC2'},buttonText:{color:colors.white,fontWeight:'900',fontSize:14}});
