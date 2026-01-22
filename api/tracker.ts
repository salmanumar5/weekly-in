
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../lib/db';
import { Status } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const db = await getDb();
  const { method } = req;
  const { action } = req.query;

  try {
    switch (action) {
      case 'login':
        if (method !== 'POST') return res.status(405).end();
        const { email, name } = req.body;
        let user: any = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (!user) {
          const newUser = {
            id: `u_${Math.random().toString(36).substr(2, 9)}`,
            name,
            email: email.toLowerCase(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
            createdAt: new Date()
          };
          await db.collection('users').insertOne(newUser as any);
          user = newUser;
        }
        return res.json(user);

      case 'getTeams':
        const { userId } = req.query;
        const teams = await db.collection('teams').find({ memberIds: userId }).toArray();
        return res.json(teams);

      case 'getTeamMembers':
        const { ids } = req.query;
        if (!ids) return res.json([]);
        const memberIds = (ids as string).split(',');
        const members = await db.collection('users').find({ id: { $in: memberIds } }).toArray();
        return res.json(members);

      case 'createTeam':
        const { teamName, adminId } = req.body;
        const newTeam = {
          id: `t_${Math.random().toString(36).substr(2, 9)}`,
          name: teamName,
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          adminId,
          offDays: [0, 6],
          memberIds: [adminId]
        };
        await db.collection('teams').insertOne(newTeam as any);
        return res.json(newTeam);

      case 'joinTeam':
        const { code, joinUserId } = req.body;
        const teamToJoin: any = await db.collection('teams').findOne({ code: code.toUpperCase() });
        if (!teamToJoin) return res.status(404).json({ error: 'Team not found' });
        
        if (!teamToJoin.memberIds.includes(joinUserId)) {
          await db.collection('teams').updateOne(
            { id: teamToJoin.id },
            { $push: { memberIds: joinUserId } } as any
          );
          teamToJoin.memberIds.push(joinUserId);
        }
        return res.json(teamToJoin);

      case 'updateAvailability':
        const { userId: uId, teamId, dayIndex, weekId } = req.body;
        const teamRef: any = await db.collection('teams').findOne({ id: teamId });
        if (!teamRef) return res.status(404).json({ error: 'Team not found' });
        if (teamRef.offDays.includes(dayIndex)) return res.status(400).json({ error: 'Cannot modify weekend' });

        let record: any = await db.collection('availabilities').findOne({ userId: uId, teamId, weekId });

        if (record) {
          const newDays = [...record.days];
          newDays[dayIndex] = newDays[dayIndex] === Status.WFO ? Status.WFH : Status.WFO;
          await db.collection('availabilities').updateOne(
            { _id: record._id },
            { $set: { days: newDays, updatedAt: Date.now() } } as any
          );
          record.days = newDays;
        } else {
          const days = Array(7).fill(Status.WFO);
          teamRef.offDays.forEach((idx: number) => { if(idx >=0 && idx < 7) days[idx] = Status.WKND; });
          days[dayIndex] = Status.WFH;
          
          record = {
            id: `a_${Math.random().toString(36).substr(2, 9)}`,
            userId: uId,
            teamId,
            weekId,
            days,
            updatedAt: Date.now()
          };
          await db.collection('availabilities').insertOne(record as any);
        }
        return res.json(record);

      case 'getAvailabilities':
        const { tId, wId } = req.query;
        const avails = await db.collection('availabilities').find({ teamId: tId, weekId: wId }).toArray();
        return res.json(avails);

      case 'updateSettings':
        const { teamId: targetTeamId, adminId: authAdminId, offDays } = req.body;
        const authTeam: any = await db.collection('teams').findOne({ id: targetTeamId });
        if (!authTeam || authTeam.adminId !== authAdminId) return res.status(403).json({ error: 'Unauthorized' });
        
        await db.collection('teams').updateOne(
          { id: targetTeamId },
          { $set: { offDays } } as any
        );
        return res.json({ success: true });

      case 'removeMember':
        const { teamId: remTeamId, adminId: remAdminId, memberId: targetMemberId } = req.body;
        const remTeam: any = await db.collection('teams').findOne({ id: remTeamId });
        if (!remTeam || remTeam.adminId !== remAdminId) return res.status(403).json({ error: 'Unauthorized' });
        if (remTeam.adminId === targetMemberId) return res.status(400).json({ error: 'Cannot remove the admin' });

        await db.collection('teams').updateOne(
          { id: remTeamId },
          { $pull: { memberIds: targetMemberId } } as any
        );
        return res.json({ success: true });

      default:
        return res.status(404).json({ error: 'Action not found' });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
