
import React, { useState } from 'react';
import { Team } from '../types';
import { ICONS, DAYS_OF_WEEK } from '../constants';

interface TeamSettingsProps {
  team: Team;
  onUpdateOffDays: (offDays: number[]) => void;
  onRemoveMember: (memberId: string) => void;
  onClose: () => void;
}

const TeamSettings: React.FC<TeamSettingsProps> = ({ team, onUpdateOffDays, onRemoveMember, onClose }) => {
  const [copied, setCopied] = useState(false);

  const toggleDay = (dayIndex: number) => {
    const newOffDays = team.offDays.includes(dayIndex)
      ? team.offDays.filter(d => d !== dayIndex)
      : [...team.offDays, dayIndex].sort();
    onUpdateOffDays(newOffDays);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(team.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Team Settings</h2>
        <button onClick={onClose} className="text-sm font-medium text-blue-600 hover:underline">Done</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invite Code Card */}
        <div className="bg-white/70 p-8 rounded-[32px] border border-white apple-shadow space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-black/30">Team Invite Code</p>
            <p className="text-sm text-black/50">Share this code with teammates to let them join</p>
          </div>
          <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl border border-black/5">
            <span className="text-2xl font-black tracking-tighter text-black">{team.code}</span>
            <button 
              onClick={copyCode}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl text-[10px] font-bold uppercase shadow-sm border border-black/5 hover:bg-gray-50 active:scale-95 transition-all"
            >
              {copied ? 'Copied!' : <><ICONS.Copy className="w-3.5 h-3.5" /> Copy</>}
            </button>
          </div>
        </div>

        {/* Off Days Configuration */}
        <div className="bg-white/70 p-8 rounded-[32px] border border-white apple-shadow space-y-6">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-black/30">Weekend / Off Days</p>
            <p className="text-sm text-black/50">These days will be locked for all members</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day, idx) => {
              const isActive = team.offDays.includes(idx);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(idx)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase border transition-all duration-300 ${
                    isActive 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-white text-black/40 border-black/5 hover:border-black/20'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Members Management */}
      <div className="bg-white/70 p-8 rounded-[32px] border border-white apple-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-black/30">Members ({team.memberIds.length})</p>
            <p className="text-sm text-black/50">Manage who has access to this team's tracker</p>
          </div>
        </div>
        <div className="divide-y divide-black/5 border-t border-black/5">
          {team.memberIds.map(memberId => (
            <div key={memberId} className="py-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center font-bold text-black/40 border border-black/5">
                  {memberId === team.adminId ? 'A' : 'M'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-black">Member ID: {memberId}</span>
                  <span className="text-[10px] font-medium text-black/30">Joined via invite code</span>
                </div>
              </div>
              {memberId !== team.adminId && (
                <button 
                  onClick={() => onRemoveMember(memberId)}
                  className="p-2 text-black/20 hover:text-red-500 transition-colors"
                >
                  <ICONS.Trash />
                </button>
              )}
              {memberId === team.adminId && (
                <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 bg-black/5 px-2 py-1 rounded-full border border-black/5">Team Admin</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;
