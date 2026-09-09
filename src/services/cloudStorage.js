// ============================================================
// SkillMatch Cloud — Storage Layer
// ============================================================
// When Firebase credentials are present, data lives in Cloud
// Firestore with real-time subscriptions.  When they are not,
// everything falls back to localStorage so the app still works
// offline or for quick local demos.
// ============================================================

import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, query, where,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import { db, isLiveFirebaseConfigured } from './firebase';

import {
  SEED_STUDENTS,
  SEED_ADMIN,
  SEED_PROJECTS,
  SEED_SKILLS,
  SEED_CATEGORIES,
  SEED_TEAMS,
  SEED_JOIN_REQUESTS,
  SEED_NOTIFICATIONS,
} from './seedData';

// ────────────────────────────────────────────────────────────
// LOCAL STORAGE KEYS (used in fallback mode)
// ────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  USERS:          'smc_cloud_users',
  PROJECTS:       'smc_cloud_projects',
  SKILLS:         'smc_cloud_skills',
  CATEGORIES:     'smc_cloud_categories',
  TEAMS:          'smc_cloud_teams',
  JOIN_REQUESTS:  'smc_cloud_join_requests',
  BOOKMARKS:      'smc_cloud_bookmarks',
  NOTIFICATIONS:  'smc_cloud_notifications',
};

// ────────────────────────────────────────────────────────────
// IN-MEMORY CACHE + FIRESTORE REAL-TIME SUBSCRIPTIONS
// ────────────────────────────────────────────────────────────
const _cache = {};           // { collectionName: [...docs] }
const _listeners = {};       // { collectionName: unsubscribeFn }

/**
 * Seed Firestore with the full demo dataset.
 * Safe to call multiple times — skips if data already exists.
 * Exported so admin UI can trigger it manually.
 */
export async function seedFirestoreDatabase() {
  if (!isLiveFirebaseConfigured || !db) {
    console.info('CloudStorage: Firebase not configured — skipping Firestore seed.');
    return;
  }

  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    if (!usersSnap.empty) {
      console.info('CloudStorage: Firestore already seeded — skipping.');
      return;
    }

    console.info('CloudStorage: Seeding Firestore with demo dataset…');
    const batch = writeBatch(db);

    // ── Users (students + admin) ──
    const allUsers = [...SEED_STUDENTS, SEED_ADMIN];
    const EMAIL_MAP = {
      'user-alex':    'alex.chen@university.edu',
      'user-sarah':   'sarah.johnson@university.edu',
      'user-marcus':  'marcus.williams@university.edu',
      'user-priya':   'priya.patel@university.edu',
      'user-jordan':  'jordan.lee@university.edu',
      'user-emma':    'emma.garcia@university.edu',
      'user-david':   'david.kim@university.edu',
      'user-zara':    'zara.nguyen@university.edu',
      'user-liam':    'liam.brown@university.edu',
      'user-olivia':  'olivia.taylor@university.edu',
      'user-noah':    'noah.anderson@university.edu',
      'user-ava':     'ava.martinez@university.edu',
      'user-ethan':   'ethan.jackson@university.edu',
      'user-sophia':  'sophia.white@university.edu',
      'user-mason':   'mason.harris@university.edu',
      'user-isabella':'isabella.clark@university.edu',
      'user-logan':   'logan.lewis@university.edu',
      'user-mia':     'mia.walker@university.edu',
      'user-lucas':   'lucas.hall@university.edu',
      'user-charlotte':'charlotte.allen@university.edu',
      'user-aiden':   'aiden.young@university.edu',
      'user-amelia':  'amelia.king@university.edu',
      'user-benjamin':'benjamin.wright@university.edu',
      'user-luna':    'luna.scott@university.edu',
      'admin-001':    'admin@skillmatch.cloud',
    };

    allUsers.forEach((u) => {
      const email =
        u.email ||
        EMAIL_MAP[u.id] ||
        `${(u.name || 'user').toLowerCase().replace(/\s+/g, '.')}@university.edu`;
      const userRef = doc(db, 'users', u.id);
      batch.set(userRef, { ...u, email });
    });

    // ── Projects ──
    SEED_PROJECTS.forEach((p) => {
      const ref = doc(db, 'projects', p.id);
      batch.set(ref, p);
    });

    // ── Skills ──
    SEED_SKILLS.forEach((s) => {
      const ref = doc(db, 'skills', s.id);
      batch.set(ref, s);
    });

    // ── Categories ──
    SEED_CATEGORIES.forEach((c) => {
      const ref = doc(db, 'categories', c.id);
      batch.set(ref, c);
    });

    // ── Teams ──
    SEED_TEAMS.forEach((t) => {
      const ref = doc(db, 'teams', t.id);
      batch.set(ref, t);
    });

    // ── Join Requests ──
    SEED_JOIN_REQUESTS.forEach((r) => {
      const ref = doc(db, 'joinRequests', r.id);
      batch.set(ref, r);
    });

    // ── Notifications ──
    SEED_NOTIFICATIONS.forEach((n) => {
      const ref = doc(db, 'notifications', n.id);
      batch.set(ref, n);
    });

    // ── Default bookmarks for demo user Alex ──
    const bmkRef = doc(db, 'bookmarks', 'user-alex');
    batch.set(bmkRef, {
      userId: 'user-alex',
      projectIds: ['proj-micro-cloud', 'proj-course-rag'],
    });

    await batch.commit();
    console.info('CloudStorage: Firestore seeded successfully ✅');
  } catch (err) {
    console.warn('CloudStorage: Firestore seed failed — likely missing security rules.', err);
    throw err;
  }
}

// ────────────────────────────────────────────────────────────
// REACTIVE COLLECTION HELPER
// ────────────────────────────────────────────────────────────

/**
 * Return the local cache for `collectionName`, optionally
 * subscribing to Firestore real-time updates.
 *
 * @param {string} collectionName
 * @param {object} [opts]
 * @param {boolean} [opts.subscribe=false]  keep cache synced via onSnapshot
 * @param {Array}   [opts.where]           Firestore query filters
 * @returns {Array} cached documents
 */
function getCache(collectionName, opts = {}) {
  if (!_cache[collectionName]) _cache[collectionName] = [];

  // Set up a Firestore real-time listener once per collection
  if (
    opts.subscribe &&
    isLiveFirebaseConfigured &&
    db &&
    !_listeners[collectionName]
  ) {
    const colRef = collection(db, collectionName);
    let q = colRef;
    if (opts.where && Array.isArray(opts.where)) {
      opts.where.forEach((w) => {
        q = query(q, where(w.field, w.op, w.value));
      });
    }

    _listeners[collectionName] = onSnapshot(q, (snap) => {
      _cache[collectionName] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
    });
  }

  return _cache[collectionName];
}

/** Get a single cached document by ID. */
async function getCachedDoc(collectionName, docId) {
  const docs = getCache(collectionName);
  return docs.find((d) => d.id === docId) || null;
}

/**
 * Fallback one-shot Firestore read (no subscription).
 * Used by AuthContext at boot when the cache is still empty.
 */
async function readFirestoreCollection(collectionName) {
  if (!isLiveFirebaseConfigured || !db) return [];
  try {
    const snap = await getDocs(collection(db, collectionName));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

// ────────────────────────────────────────────────────────────
// SEED LOCAL STORAGE (fallback mode only)
// ────────────────────────────────────────────────────────────
export function initLocalStorage() {
  if (isLiveFirebaseConfigured) return; // not needed in cloud mode
  if (!localStorage.getItem(STORAGE_KEYS.USERS))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...SEED_STUDENTS, SEED_ADMIN]));
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS))
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
  if (!localStorage.getItem(STORAGE_KEYS.SKILLS))
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(SEED_SKILLS));
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES))
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  if (!localStorage.getItem(STORAGE_KEYS.TEAMS))
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(SEED_TEAMS));
  if (!localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS))
    localStorage.setItem(STORAGE_KEYS.JOIN_REQUESTS, JSON.stringify(SEED_JOIN_REQUESTS));
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS))
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS))
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify({ 'user-alex': ['proj-micro-cloud', 'proj-course-rag'] }));
}

// ────────────────────────────────────────────────────────────
// USERS / STUDENTS
// ────────────────────────────────────────────────────────────
export async function getCloudUsers() {
  if (isLiveFirebaseConfigured && db) {
    // Use the reactive cache so switches stay synced
    const cached = getCache('users', { subscribe: true });
    if (cached.length > 0) return cached;
    // Cold start: cache is empty — do a one-shot read
    return await readFirestoreCollection('users');
  }
  // Fallback
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

export async function getCloudStudents() {
  const all = await getCloudUsers();
  return all.filter((u) => u.role !== 'admin');
}

export async function getCloudUserById(userId) {
  if (isLiveFirebaseConfigured && db) {
    // Try Firestore direct read first (fast for known IDs)
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch { /* fall through */ }
    // Fall back to collection query
    const all = await getCloudUsers();
    return all.find((u) => u.id === userId) || null;
  }
  // Fallback
  initLocalStorage();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  return users.find((u) => u.id === userId) || null;
}

export async function updateCloudUser(userId, updates) {
  if (isLiveFirebaseConfigured && db) {
    const ref = doc(db, 'users', userId);
    const merged = { ...updates, updatedAt: new Date().toISOString() };
    await setDoc(ref, merged, { merge: true });
    // Update local cache immediately
    const cache = getCache('users');
    const idx = cache.findIndex((u) => u.id === userId);
    if (idx >= 0) cache[idx] = { ...cache[idx], ...merged };
    else cache.push({ id: userId, ...merged });
    return await getCloudUserById(userId);
  }
  // Fallback
  initLocalStorage();
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const idx = users.findIndex((u) => u.id === userId);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('cloud_data_updated'));
    return users[idx];
  }
  return null;
}

// ────────────────────────────────────────────────────────────
// PROJECTS
// ────────────────────────────────────────────────────────────
export async function getCloudProjects() {
  if (isLiveFirebaseConfigured && db) {
    const cached = getCache('projects', { subscribe: true });
    if (cached.length > 0) return cached;
    return await readFirestoreCollection('projects');
  }
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
}

export async function getCloudProjectById(projectId) {
  if (isLiveFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'projects', projectId));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch { /* fall through */ }
    const all = await getCloudProjects();
    return all.find((p) => p.id === projectId) || null;
  }
  initLocalStorage();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  return projects.find((p) => p.id === projectId) || null;
}

export async function createCloudProject(projectData) {
  const newProject = {
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    status: 'Planning',
    featured: false,
    ...projectData,
  };
  if (isLiveFirebaseConfigured && db) {
    await setDoc(doc(db, 'projects', newProject.id), newProject);
    getCache('projects').unshift(newProject);
    return newProject;
  }
  initLocalStorage();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  projects.unshift(newProject);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return newProject;
}

export async function updateCloudProject(projectId, updates) {
  if (isLiveFirebaseConfigured && db) {
    const ref = doc(db, 'projects', projectId);
    const merged = { ...updates, updatedAt: new Date().toISOString() };
    await setDoc(ref, merged, { merge: true });
    const cache = getCache('projects');
    const idx = cache.findIndex((p) => p.id === projectId);
    if (idx >= 0) cache[idx] = { ...cache[idx], ...merged };
    return cache[idx] || null;
  }
  initLocalStorage();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx >= 0) {
    projects[idx] = { ...projects[idx], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    window.dispatchEvent(new Event('cloud_data_updated'));
    return projects[idx];
  }
  return null;
}

export async function deleteCloudProject(projectId) {
  if (isLiveFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'projects', projectId));
    const cache = getCache('projects');
    const idx = cache.findIndex((p) => p.id === projectId);
    if (idx >= 0) cache.splice(idx, 1);
    return true;
  }
  initLocalStorage();
  const projects = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects.filter((p) => p.id !== projectId)));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return true;
}

// ────────────────────────────────────────────────────────────
// SKILLS
// ────────────────────────────────────────────────────────────
export async function getCloudSkills() {
  if (isLiveFirebaseConfigured && db) {
    const cached = getCache('skills', { subscribe: true });
    if (cached.length > 0) return cached;
    return await readFirestoreCollection('skills');
  }
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
}

export async function createCloudSkill(skillData) {
  const newSkill = { id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...skillData };
  if (isLiveFirebaseConfigured && db) {
    await setDoc(doc(db, 'skills', newSkill.id), newSkill);
    getCache('skills').push(newSkill);
    return newSkill;
  }
  initLocalStorage();
  const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
  skills.push(newSkill);
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return newSkill;
}

export async function deleteCloudSkill(skillId) {
  if (isLiveFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'skills', skillId));
    const cache = getCache('skills');
    const idx = cache.findIndex((s) => s.id === skillId);
    if (idx >= 0) cache.splice(idx, 1);
    return true;
  }
  initLocalStorage();
  const skills = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILLS) || '[]');
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills.filter((s) => s.id !== skillId)));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return true;
}

// ────────────────────────────────────────────────────────────
// CATEGORIES
// ────────────────────────────────────────────────────────────
export async function getCloudCategories() {
  if (isLiveFirebaseConfigured && db) {
    const cached = getCache('categories', { subscribe: true });
    if (cached.length > 0) return cached;
    return await readFirestoreCollection('categories');
  }
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
}

export async function createCloudCategory(catData) {
  const newCategory = { id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, icon: 'Layers', ...catData };
  if (isLiveFirebaseConfigured && db) {
    await setDoc(doc(db, 'categories', newCategory.id), newCategory);
    getCache('categories').push(newCategory);
    return newCategory;
  }
  initLocalStorage();
  const categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
  categories.push(newCategory);
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return newCategory;
}

// ────────────────────────────────────────────────────────────
// TEAMS
// ────────────────────────────────────────────────────────────
export async function getCloudTeams() {
  if (isLiveFirebaseConfigured && db) {
    const cached = getCache('teams', { subscribe: true });
    if (cached.length > 0) return cached;
    return await readFirestoreCollection('teams');
  }
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
}

export async function getCloudTeamById(teamId) {
  if (isLiveFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'teams', teamId));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch { /* fall through */ }
    const all = await getCloudTeams();
    return all.find((t) => t.id === teamId) || null;
  }
  initLocalStorage();
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
  return teams.find((t) => t.id === teamId) || null;
}

export async function createCloudTeam(teamData, leader) {
  const newTeam = {
    id: `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    leaderId: leader.id,
    leaderName: leader.name,
    leaderAvatar: leader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    memberIds: [leader.id],
    members: [
      {
        id: leader.id,
        name: leader.name,
        role: 'Team Lead',
        avatar: leader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        skills: (leader.technicalSkills || []).slice(0, 3).map((s) => s.name),
      },
    ],
    status: 'In Progress',
    progress: 10,
    createdAt: new Date().toISOString(),
    ...teamData,
  };
  if (isLiveFirebaseConfigured && db) {
    await setDoc(doc(db, 'teams', newTeam.id), newTeam);
    getCache('teams').unshift(newTeam);
    return newTeam;
  }
  initLocalStorage();
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
  teams.unshift(newTeam);
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return newTeam;
}

export async function updateCloudTeam(teamId, updates) {
  if (isLiveFirebaseConfigured && db) {
    const ref = doc(db, 'teams', teamId);
    await setDoc(ref, updates, { merge: true });
    const cache = getCache('teams');
    const idx = cache.findIndex((t) => t.id === teamId);
    if (idx >= 0) cache[idx] = { ...cache[idx], ...updates };
    return cache[idx] || null;
  }
  initLocalStorage();
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
  const idx = teams.findIndex((t) => t.id === teamId);
  if (idx >= 0) {
    teams[idx] = { ...teams[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    window.dispatchEvent(new Event('cloud_data_updated'));
    return teams[idx];
  }
  return null;
}

export async function leaveCloudTeam(teamId, studentId) {
  if (isLiveFirebaseConfigured && db) {
    const snap = await getDoc(doc(db, 'teams', teamId));
    if (!snap.exists()) return false;
    const team = { id: snap.id, ...snap.data() };
    team.memberIds = (team.memberIds || []).filter((id) => id !== studentId);
    team.members   = (team.members   || []).filter((m) => m.id !== studentId);
    await setDoc(doc(db, 'teams', teamId), team);
    const cache = getCache('teams');
    const idx = cache.findIndex((t) => t.id === teamId);
    if (idx >= 0) cache[idx] = team;
    return true;
  }
  initLocalStorage();
  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
  const idx = teams.findIndex((t) => t.id === teamId);
  if (idx >= 0) {
    teams[idx].memberIds = (teams[idx].memberIds || []).filter((id) => id !== studentId);
    teams[idx].members   = (teams[idx].members   || []).filter((m) => m.id !== studentId);
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    window.dispatchEvent(new Event('cloud_data_updated'));
    return true;
  }
  return false;
}

// ────────────────────────────────────────────────────────────
// JOIN REQUESTS
// ────────────────────────────────────────────────────────────
export async function getCloudJoinRequests() {
  if (isLiveFirebaseConfigured && db) {
    const cached = getCache('joinRequests', { subscribe: true });
    if (cached.length > 0) return cached;
    return await readFirestoreCollection('joinRequests');
  }
  initLocalStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS) || '[]');
}

export async function sendCloudJoinRequest(reqData) {
  if (isLiveFirebaseConfigured && db) {
    // Check for existing pending request
    const q = query(
      collection(db, 'joinRequests'),
      where('teamId', '==', reqData.teamId),
      where('studentId', '==', reqData.studentId),
      where('status', '==', 'pending'),
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error('You already have a pending join request for this team.');
    }

    const newRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...reqData,
    };
    await setDoc(doc(db, 'joinRequests', newRequest.id), newRequest);
    getCache('joinRequests').unshift(newRequest);

    // Notify team leader
    const teamSnap = await getDoc(doc(db, 'teams', reqData.teamId));
    if (teamSnap.exists()) {
      const team = teamSnap.data();
      await sendCloudNotification({
        userId: team.leaderId,
        type: 'join_request',
        title: 'New Join Request',
        message: `${reqData.studentName} requested to join ${team.name}.`,
      });
    }
    return newRequest;
  }

  // Fallback
  initLocalStorage();
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS) || '[]');
  const existing = requests.find(
    (r) => r.teamId === reqData.teamId && r.studentId === reqData.studentId && r.status === 'pending',
  );
  if (existing) throw new Error('You already have a pending join request for this team.');

  const newRequest = {
    id: `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...reqData,
  };
  requests.unshift(newRequest);
  localStorage.setItem(STORAGE_KEYS.JOIN_REQUESTS, JSON.stringify(requests));

  const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
  const targetTeam = teams.find((t) => t.id === reqData.teamId);
  if (targetTeam) {
    await sendCloudNotification({
      userId: targetTeam.leaderId,
      type: 'join_request',
      title: 'New Join Request',
      message: `${reqData.studentName} requested to join ${targetTeam.name}.`,
    });
  }
  window.dispatchEvent(new Event('cloud_data_updated'));
  return newRequest;
}

export async function resolveCloudJoinRequest(requestId, status, teamId, student) {
  if (isLiveFirebaseConfigured && db) {
    const reqRef  = doc(db, 'joinRequests', requestId);
    await setDoc(reqRef, { status }, { merge: true });

    const cache = getCache('joinRequests');
    const ri = cache.findIndex((r) => r.id === requestId);
    if (ri >= 0) cache[ri].status = status;

    if (status === 'accepted') {
      const teamSnap = await getDoc(doc(db, 'teams', teamId));
      if (teamSnap.exists()) {
        const team = { id: teamSnap.id, ...teamSnap.data() };
        if (!team.memberIds.includes(student.id)) {
          team.memberIds.push(student.id);
          team.members = team.members || [];
          team.members.push({
            id: student.id,
            name: student.name,
            role: 'Team Member',
            avatar: student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            skills: (student.technicalSkills || []).slice(0, 3).map((s) => s.name),
          });
          await setDoc(doc(db, 'teams', teamId), team);
          const teamCache = getCache('teams');
          const ti = teamCache.findIndex((t) => t.id === teamId);
          if (ti >= 0) teamCache[ti] = team;
        }
      }
    }

    await sendCloudNotification({
      userId: student.id,
      type: status === 'accepted' ? 'request_accepted' : 'request_rejected',
      title: status === 'accepted' ? 'Join Request Accepted!' : 'Join Request Update',
      message:
        status === 'accepted'
          ? 'Congratulations! You are now a member of the team.'
          : 'Your join request was not accepted at this time.',
    });
    return true;
  }

  // Fallback
  initLocalStorage();
  const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOIN_REQUESTS) || '[]');
  const ri = requests.findIndex((r) => r.id === requestId);
  if (ri >= 0) {
    requests[ri].status = status;
    localStorage.setItem(STORAGE_KEYS.JOIN_REQUESTS, JSON.stringify(requests));

    if (status === 'accepted') {
      const teams = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]');
      const ti = teams.findIndex((t) => t.id === teamId);
      if (ti >= 0) {
        const team = teams[ti];
        if (!team.memberIds.includes(student.id)) {
          team.memberIds.push(student.id);
          team.members = team.members || [];
          team.members.push({
            id: student.id,
            name: student.name,
            role: 'Team Member',
            avatar: student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            skills: (student.technicalSkills || []).slice(0, 3).map((s) => s.name),
          });
          teams[ti] = team;
          localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
        }
      }
    }

    await sendCloudNotification({
      userId: student.id,
      type: status === 'accepted' ? 'request_accepted' : 'request_rejected',
      title: status === 'accepted' ? 'Join Request Accepted!' : 'Join Request Update',
      message:
        status === 'accepted'
          ? 'Congratulations! You are now a member of the team.'
          : 'Your join request was not accepted at this time.',
    });
    window.dispatchEvent(new Event('cloud_data_updated'));
    return true;
  }
  return false;
}

// ────────────────────────────────────────────────────────────
// BOOKMARKS  (single Firestore doc per user)
// ────────────────────────────────────────────────────────────
export async function getCloudBookmarks(userId) {
  if (isLiveFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'bookmarks', userId));
      if (snap.exists()) return snap.data().projectIds || [];
    } catch { /* fall through */ }
    return [];
  }
  initLocalStorage();
  const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '{}');
  return map[userId] || [];
}

export async function toggleCloudBookmark(userId, projectId) {
  if (isLiveFirebaseConfigured && db) {
    const ref = doc(db, 'bookmarks', userId);
    const snap = await getDoc(ref);
    let projectIds = snap.exists() ? snap.data().projectIds || [] : [];

    if (projectIds.includes(projectId)) {
      projectIds = projectIds.filter((id) => id !== projectId);
    } else {
      projectIds = [...projectIds, projectId];
    }

    await setDoc(ref, { userId, projectIds });
    return projectIds;
  }

  // Fallback
  initLocalStorage();
  const map = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '{}');
  const userBmks = map[userId] || [];

  let updated;
  if (userBmks.includes(projectId)) {
    updated = userBmks.filter((id) => id !== projectId);
  } else {
    updated = [...userBmks, projectId];
  }

  map[userId] = updated;
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(map));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return updated;
}

// ────────────────────────────────────────────────────────────
// NOTIFICATIONS  (single Firestore doc per user)
// ────────────────────────────────────────────────────────────
export async function getCloudNotifications(userId) {
  if (isLiveFirebaseConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'notifications', userId));
      if (snap.exists()) return snap.data().items || [];
    } catch { /* fall through */ }
    return [];
  }
  initLocalStorage();
  const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  return all.filter((n) => n.userId === userId || n.userId === 'all');
}

export async function sendCloudNotification(notifData) {
  const newNotif = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notifData,
  };

  if (isLiveFirebaseConfigured && db) {
    const targetUserId = notifData.userId || 'all';
    const ref = doc(db, 'notifications', targetUserId);
    const snap = await getDoc(ref);
    const items = snap.exists() ? snap.data().items || [] : [];
    items.unshift(newNotif);
    await setDoc(ref, { items }, { merge: true });
    return newNotif;
  }

  // Fallback
  initLocalStorage();
  const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  all.unshift(newNotif);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
  window.dispatchEvent(new Event('cloud_data_updated'));
  return newNotif;
}

export async function markCloudNotificationRead(notifId) {
  if (isLiveFirebaseConfigured && db) {
    // We need to find which user doc contains this notif
    // For simplicity, iterate local cache
    const users = await getCloudUsers();
    for (const user of users) {
      const ref  = doc(db, 'notifications', user.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const items = snap.data().items || [];
        const ni = items.findIndex((n) => n.id === notifId);
        if (ni >= 0) {
          items[ni].read = true;
          await setDoc(ref, { items }, { merge: true });
          return true;
        }
      }
    }
    return false;
  }

  // Fallback
  initLocalStorage();
  const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
  const idx = all.findIndex((n) => n.id === notifId);
  if (idx >= 0) {
    all[idx].read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(all));
    return true;
  }
  return false;
}

// ────────────────────────────────────────────────────────────
// DATABASE RESET
// ────────────────────────────────────────────────────────────
export async function resetCloudDatabase() {
  if (isLiveFirebaseConfigured && db) {
    // Clear local cache
    Object.keys(_cache).forEach((k) => (_cache[k] = []));

    // Delete all Firestore docs in each collection
    const collections = ['users', 'projects', 'skills', 'categories', 'teams', 'joinRequests', 'bookmarks', 'notifications'];
    for (const col of collections) {
      const snap = await getDocs(collection(db, col));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    // Re-seed
    await seedFirestoreDatabase();
    window.dispatchEvent(new Event('cloud_data_updated'));
    return;
  }

  // Fallback
  const allUsers = [...SEED_STUDENTS, SEED_ADMIN];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(SEED_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(SEED_SKILLS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(SEED_TEAMS));
  localStorage.setItem(STORAGE_KEYS.JOIN_REQUESTS, JSON.stringify(SEED_JOIN_REQUESTS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify({ 'user-alex': ['proj-micro-cloud', 'proj-course-rag'] }));
  window.dispatchEvent(new Event('cloud_data_updated'));
}
