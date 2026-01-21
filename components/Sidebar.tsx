
import React, { useState } from 'react';
import { Team, User } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  teams: Team[];
  activeTeamId: string | null;
  onSelectTeam: (id: string) => void;
  onCreateTeam: (name: string) => void;
  onJoinTeam: (code: string) => void;
  currentUser: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  teams, 
  activeTeamId, 
  onSelectTeam, 
  onCreateTeam, 
  onJoinTeam,
  currentUser,
  onLogout
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [teamInput, setTeamInput] = useState('');

  return (
    <aside className="w-72 border-r border-black/5 flex flex-col bg-[#F5F5F7]">
      <div className="p-8">
        <h1 className="text-xl font-bold tracking-tight mb-8">Weekly Tracker</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between text-[11px] font-bold tracking-widest text-black/30 uppercase pl-1">
            <span>Your Teams</span>
            <div className="flex gap-2">
              <button onClick={() => setShowJoin(!showJoin)} className="hover:text-black transition-colors" title="Join Team">
                <ICONS.Logout className="w-4 h-4 rotate-180" />
              </button>
              <button onClick={() => setShowCreate(!showCreate)} className="hover:text-black transition-colors" title="Create Team">
                <ICONS.Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5 overflow-y-auto no-scrollbar max-h-[60vh]">
            {showCreate && (
              <div className="p-3 bg-white/50 rounded-2xl border border-white mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <input 
                  autoFocus
                  className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-black/20"
                  placeholder="Team name..."
                  value={teamInput}
                  onChange={e => setTeamInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && teamInput) {
                      onCreateTeam(teamInput);
                      setTeamInput('');
                      setShowCreate(false);
                    }
                  }}
                />
              </div>
            )}

            {showJoin && (
              <div className="p-3 bg-white/50 rounded-2xl border border-white mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <input 
                  autoFocus
                  className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-black/20"
                  placeholder="Invite code..."
                  value={teamInput}
                  onChange={e => setTeamInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && teamInput) {
                      onJoinTeam(teamInput);
                      setTeamInput('');
                      setShowJoin(false);
                    }
                  }}
                />
              </div>
            )}

            {teams.map(team => (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                className={`w-full group relative flex flex-col items-start p-4 rounded-2xl transition-all duration-300 ${
                  activeTeamId === team.id 
                  ? 'bg-white shadow-xl shadow-black/5 ring-1 ring-black/5' 
                  : 'hover:bg-white/40'
                }`}
              >
                <div className="flex justify-between w-full items-start mb-1">
                  <span className={`text-sm font-bold ${activeTeamId === team.id ? 'text-black' : 'text-black/60'}`}>
                    {team.name}
                  </span>
                  {team.adminId === currentUser.id && (
                    <span className="text-[9px] font-bold uppercase text-black/30 border border-black/5 px-1.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium text-black/30">
                  {team.memberIds.length} members
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto p-8 pt-0">
        <div className="p-4 bg-white/40 rounded-3xl flex items-center gap-3 border border-white/60">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-2xl object-cover bg-gray-100 ring-4 ring-white shadow-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-black truncate">{currentUser.name}</p>
            <p className="text-[10px] font-medium text-black/30 truncate">{currentUser.email}</p>
          </div>
          <button onClick={onLogout} className="text-black/30 hover:text-red-500 transition-colors">
            <ICONS.Logout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
