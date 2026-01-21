
import React, { useState, useEffect, useMemo } from 'react';
import { User, Team, AvailabilityRecord } from './types';
import { getCurrentWeekId, getWeekDates, formatDateRange } from './utils';
import { ICONS } from './constants';
import { api } from './services/backend';
import Sidebar from './components/Sidebar';
import AvailabilityCards from './components/AvailabilityCards';
import TeamTable from './components/TeamTable';
import TeamSettings from './components/TeamSettings';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(api.getCurrentSession());
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [availabilities, setAvailabilities] = useState<AvailabilityRecord[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const currentWeekId = useMemo(() => getCurrentWeekId(), []);
  const weekDates = useMemo(() => getWeekDates(currentWeekId), [currentWeekId]);

  // Derived State
  const activeTeam = useMemo(() => teams.find(t => t.id === activeTeamId) || null, [teams, activeTeamId]);
  
  // Re-fetch everything on load or user change
  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTeamId) {
      fetchTeamAvailabilities();
    }
  }, [activeTeamId]);

  const fetchData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const myTeams = await api.getMyTeams(currentUser.id);
      setTeams(myTeams);
      if (myTeams.length > 0 && !activeTeamId) {
        setActiveTeamId(myTeams[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamAvailabilities = async () => {
    if (!activeTeamId) return;
    try {
      const data = await api.getWeeklyAvailability(activeTeamId, currentWeekId);
      setAvailabilities(data);
    } catch (err) {
      console.error("Failed to fetch availabilities:", err);
    }
  };

  const handleLogin = async (email: string, name: string) => {
    setIsLoading(true);
    try {
      const user = await api.login(email, name);
      setCurrentUser(user);
    } catch (err) {
      alert("Login failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setTeams([]);
    setActiveTeamId(null);
    setAvailabilities([]);
  };

  const handleToggleAvailability = async (dayIndex: number) => {
    if (!currentUser || !activeTeamId) return;
    setIsSyncing(true);
    try {
      const updatedRecord = await api.updateAvailability(currentUser.id, activeTeamId, dayIndex);
      setAvailabilities(prev => {
        const index = prev.findIndex(a => a.id === updatedRecord.id);
        if (index > -1) return prev.map((a, i) => i === index ? updatedRecord : a);
        return [...prev, updatedRecord];
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateTeam = async (name: string) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const newTeam = await api.createTeam(name, currentUser.id);
      setTeams(prev => [...prev, newTeam]);
      setActiveTeamId(newTeam.id);
    } catch (err) {
      alert("Failed to create team.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleJoinTeam = async (code: string) => {
    if (!currentUser) return;
    setIsSyncing(true);
    try {
      const team = await api.joinTeam(code, currentUser.id);
      if (team) {
        setTeams(prev => {
          if (prev.find(t => t.id === team.id)) return prev;
          return [...prev, team];
        });
        setActiveTeamId(team.id);
      } else {
        alert("Invalid team code");
      }
    } catch (err) {
      alert("Failed to join team.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateOffDays = async (newOffDays: number[]) => {
    if (!activeTeam || !currentUser) return;
    setIsSyncing(true);
    try {
      await api.updateTeamSettings(activeTeam.id, currentUser.id, newOffDays);
      setTeams(prev => prev.map(t => t.id === activeTeam.id ? { ...t, offDays: newOffDays } : t));
    } catch (err) {
      alert("Only admins can change settings.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!activeTeam || !currentUser) return;
    if (confirm("Are you sure you want to remove this member?")) {
      setIsSyncing(true);
      try {
        await api.removeMember(activeTeam.id, currentUser.id, memberId);
        setTeams(prev => prev.map(t => t.id === activeTeam.id ? { ...t, memberIds: t.memberIds.filter(id => id !== memberId) } : t));
      } catch (err) {
        alert("Failed to remove member.");
      } finally {
        setIsSyncing(false);
      }
    }
  };

  if (!currentUser) return <Login onLogin={(user) => handleLogin(user.email, user.name)} />;

  return (
    <div className="flex h-screen bg-[#F5F5F7] text-[#1d1d1f] antialiased overflow-hidden">
      <Sidebar 
        teams={teams} 
        activeTeamId={activeTeamId} 
        onSelectTeam={(id) => { setActiveTeamId(id); setShowSettings(false); }} 
        onCreateTeam={handleCreateTeam}
        onJoinTeam={handleJoinTeam}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 relative">
        {/* Sync Indicator */}
        {isSyncing && (
           <div className="fixed top-6 right-6 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white z-50 animate-in fade-in slide-in-from-right-4">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">Syncing...</span>
           </div>
        )}

        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{activeTeam?.name || 'Weekly Tracker'}</h1>
                {activeTeam?.adminId === currentUser.id && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/5 text-black/50 rounded-full border border-black/5">Admin</span>
                )}
              </div>
              <p className="text-black/50 font-medium flex items-center gap-2 mt-1">
                <ICONS.Weekend className="w-4 h-4" />
                Week of {formatDateRange(weekDates)}
              </p>
            </div>
            {activeTeam && activeTeam.adminId === currentUser.id && (
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-xl transition-all duration-300 ${showSettings ? 'bg-white shadow-lg text-blue-600' : 'hover:bg-white/50 text-black/40'}`}
              >
                <ICONS.Settings />
              </button>
            )}
          </div>

          {showSettings && activeTeam ? (
            <TeamSettings 
              team={activeTeam} 
              onUpdateOffDays={handleUpdateOffDays}
              onRemoveMember={handleRemoveMember}
              onClose={() => setShowSettings(false)}
            />
          ) : activeTeam ? (
            <>
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Your Availability</h2>
                    <p className="text-sm text-black/40">Click on a day to toggle between Office and Home</p>
                  </div>
                </div>
                
                <AvailabilityCards 
                  weekDates={weekDates} 
                  team={activeTeam} 
                  availability={availabilities.find(a => a.userId === currentUser.id)}
                  onToggle={handleToggleAvailability}
                />
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Team Overview</h2>
                  <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-widest text-black/30">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> WFO</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> WFH</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-200"></span> Off</span>
                  </div>
                </div>
                <TeamTable 
                  team={activeTeam} 
                  weekDates={weekDates} 
                  availabilities={availabilities}
                  currentUserId={currentUser.id}
                  onToggleCell={(userId, dayIndex) => {
                    if (userId === currentUser.id) handleToggleAvailability(dayIndex);
                  }}
                />
              </section>
            </>
          ) : isLoading ? (
             <div className="h-[40vh] flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-black/10 border-t-black/40 rounded-full animate-spin" />
             </div>
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 bg-white/40 border border-white/60 rounded-[40px] apple-shadow p-12">
               <div className="w-20 h-20 bg-blue-500/10 text-blue-600 rounded-[32px] flex items-center justify-center mb-4">
                 <ICONS.Plus className="w-10 h-10" />
               </div>
               <h3 className="text-2xl font-bold">Ready to start?</h3>
               <p className="text-black/40 max-w-xs mx-auto text-lg">Select a team from the sidebar or create a new one to plan your week.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
