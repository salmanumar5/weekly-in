
import { User, Team, AvailabilityRecord } from '../types';
import { getCurrentWeekId } from '../utils';

const SESSION_KEY = 'tracker_session';

class BackendService {
  private async request(action: string, method: string = 'GET', body?: any) {
    const url = new URL('/api/tracker', window.location.origin);
    url.searchParams.append('action', action);
    
    if (method === 'GET' && body) {
      Object.keys(body).forEach(key => {
        if (body[key] !== undefined) url.searchParams.append(key, body[key]);
      });
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(error.error || `Server returned ${response.status}`);
      }

      return response.json();
    } catch (e: any) {
      console.error(`API Request Failed [${action}]:`, e);
      throw e;
    }
  }

  // --- Auth ---
  async login(email: string, name: string): Promise<User> {
    const user = await this.request('login', 'POST', { email, name });
    const session = {
      user,
      expiry: Date.now() + (15 * 24 * 60 * 60 * 1000) // 15 days from now
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return user;
  }

  getCurrentSession(): User | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    try {
      const session = JSON.parse(data);
      if (Date.now() > session.expiry) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return session.user;
    } catch {
      return null;
    }
  }

  logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  // --- Teams ---
  async createTeam(name: string, adminId: string): Promise<Team> {
    return this.request('createTeam', 'POST', { teamName: name, adminId });
  }

  async joinTeam(code: string, userId: string): Promise<Team | null> {
    return this.request('joinTeam', 'POST', { code, joinUserId: userId });
  }

  async updateTeamSettings(teamId: string, adminId: string, offDays: number[]): Promise<void> {
    await this.request('updateSettings', 'POST', { teamId, adminId, offDays });
  }

  async removeMember(teamId: string, adminId: string, memberId: string): Promise<void> {
    await this.request('removeMember', 'POST', { teamId, adminId, memberId });
  }

  async getMyTeams(userId: string): Promise<Team[]> {
    return this.request('getTeams', 'GET', { userId });
  }

  async getTeamMembers(ids: string[]): Promise<User[]> {
    return this.request('getTeamMembers', 'GET', { ids: ids.join(',') });
  }

  // --- Availability ---
  async getWeeklyAvailability(teamId: string, weekId: string): Promise<AvailabilityRecord[]> {
    return this.request('getAvailabilities', 'GET', { tId: teamId, wId: weekId });
  }

  async updateAvailability(userId: string, teamId: string, dayIndex: number): Promise<AvailabilityRecord> {
    const weekId = getCurrentWeekId();
    return this.request('updateAvailability', 'POST', { userId, teamId, dayIndex, weekId });
  }
}

export const api = new BackendService();
