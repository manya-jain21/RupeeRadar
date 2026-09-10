export interface PersonnelUser {
  id: string;
  username: string;
  email: string;
  name: string;
  badgeId: string;
  role: string;
  clearanceLevel: string;
  passwords: string[];
}

// Authorized personnel list - restricted to Aditya and Manya only
export const AUTHORIZED_PERSONNEL: PersonnelUser[] = [
  {
    id: 'usr_aditya_01',
    username: 'aditya',
    email: 'aditya@rupeeradar.in',
    name: 'Aditya Kumar',
    badgeId: 'RR-ADITYA-01',
    role: 'Lead Intelligence Officer',
    clearanceLevel: 'LEVEL-5 TOP SECRET',
    passwords: ['aditya@ruppeeradar', 'aditya@rupeeradar'],
  },
  {
    id: 'usr_manya_02',
    username: 'manya',
    email: 'manya@rupeeradar.in',
    name: 'Manya Jain',
    badgeId: 'RR-MANYA-02',
    role: 'Senior Cyber Analyst',
    clearanceLevel: 'LEVEL-5 TOP SECRET',
    passwords: ['manya@ruppeeradar', 'manya@rupeeradar'],
  },
];

export function authenticatePersonnel(identifier: string, pass: string): { success: boolean; user?: Omit<PersonnelUser, 'passwords'>; error?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'Both Personnel ID and Access Key are required.' };
  }

  // Find user by username, email, or badge ID
  const personnel = AUTHORIZED_PERSONNEL.find(
    (u) =>
      u.username.toLowerCase() === cleanId ||
      u.email.toLowerCase() === cleanId ||
      u.badgeId.toLowerCase() === cleanId
  );

  if (!personnel) {
    return {
      success: false,
      error: 'Access Denied: Terminal restricted to authorized personnel (Aditya & Manya only).',
    };
  }

  const passwordValid = personnel.passwords.some((p) => p === cleanPass);

  if (!passwordValid) {
    return {
      success: false,
      error: 'Authentication failed: Invalid security key provided.',
    };
  }

  return {
    success: true,
    user: {
      id: personnel.id,
      username: personnel.username,
      email: personnel.email,
      name: personnel.name,
      badgeId: personnel.badgeId,
      role: personnel.role,
      clearanceLevel: personnel.clearanceLevel,
    },
  };
}
