import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCloudProjects,
  getCloudStudents,
  getCloudSkills,
  getCloudCategories,
  getCloudTeams,
  getCloudJoinRequests,
  getCloudBookmarks,
  toggleCloudBookmark,
  createCloudProject,
  updateCloudProject,
  deleteCloudProject,
  createCloudSkill,
  deleteCloudSkill,
  createCloudCategory,
  createCloudTeam,
  updateCloudTeam,
  leaveCloudTeam,
  sendCloudJoinRequest,
  resolveCloudJoinRequest,
  resetCloudDatabase,
  seedFirestoreDatabase,
} from '../services/cloudStorage';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const { addToast, loadNotifications } = useNotifications();

  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAllData = useCallback(async () => {
    try {
      const [projList, studList, skillList, catList, teamList, reqList] = await Promise.all([
        getCloudProjects(),
        getCloudStudents(),
        getCloudSkills(),
        getCloudCategories(),
        getCloudTeams(),
        getCloudJoinRequests(),
      ]);
      setProjects(projList);
      setStudents(studList);
      setSkills(skillList);
      setCategories(catList);
      setTeams(teamList);
      setJoinRequests(reqList);

      if (currentUser) {
        const bMarks = await getCloudBookmarks(currentUser.id);
        setBookmarks(bMarks);
        await loadNotifications(currentUser.id);
      }
    } catch (err) {
      console.error('Error refreshing cloud data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshAllData();

    const handleCloudUpdate = () => {
      refreshAllData();
    };

    window.addEventListener('cloud_data_updated', handleCloudUpdate);
    return () => {
      window.removeEventListener('cloud_data_updated', handleCloudUpdate);
    };
  }, [refreshAllData]);

  // Project Actions
  const handleCreateProject = async (data) => {
    const created = await createCloudProject(data);
    addToast('Project created successfully in the cloud!', 'success');
    await refreshAllData();
    return created;
  };

  const handleUpdateProject = async (id, data) => {
    const updated = await updateCloudProject(id, data);
    addToast('Project updated successfully.', 'success');
    await refreshAllData();
    return updated;
  };

  const handleDeleteProject = async (id) => {
    await deleteCloudProject(id);
    addToast('Project deleted.', 'info');
    await refreshAllData();
  };

  // Skill Actions
  const handleCreateSkill = async (data) => {
    const created = await createCloudSkill(data);
    addToast(`Skill "${data.name}" added to cloud database.`, 'success');
    await refreshAllData();
    return created;
  };

  const handleDeleteSkill = async (id) => {
    await deleteCloudSkill(id);
    addToast('Skill removed.', 'info');
    await refreshAllData();
  };

  // Category Actions
  const handleCreateCategory = async (data) => {
    const created = await createCloudCategory(data);
    addToast(`Category "${data.name}" added.`, 'success');
    await refreshAllData();
    return created;
  };

  // Team Actions
  const handleCreateTeam = async (teamData) => {
    if (!currentUser) return;
    const created = await createCloudTeam(teamData, currentUser);
    addToast(`Team "${created.name}" created successfully!`, 'success');
    await refreshAllData();
    return created;
  };

  const handleUpdateTeam = async (teamId, updates) => {
    const updated = await updateCloudTeam(teamId, updates);
    addToast('Team workspace updated.', 'success');
    await refreshAllData();
    return updated;
  };

  const handleLeaveTeam = async (teamId) => {
    if (!currentUser) return;
    await leaveCloudTeam(teamId, currentUser.id);
    addToast('You have left the team.', 'info');
    await refreshAllData();
  };

  // Join Requests
  const handleSendJoinRequest = async (teamId, message, compatibilityScore) => {
    if (!currentUser) return;
    try {
      await sendCloudJoinRequest({
        teamId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentAvatar: currentUser.avatar,
        studentDepartment: currentUser.department,
        studentSkills: (currentUser.technicalSkills || []).map(s => s.name),
        message,
        compatibilityScore,
      });
      addToast('Join request sent to the team leader!', 'success');
      await refreshAllData();
    } catch (err) {
      addToast(err.message || 'Failed to send request.', 'warning');
    }
  };

  const handleResolveJoinRequest = async (requestId, status, teamId, student) => {
    await resolveCloudJoinRequest(requestId, status, teamId, student);
    addToast(status === 'accepted' ? `Accepted ${student.name} into the team!` : `Declined request.`, 'info');
    await refreshAllData();
  };

  // Bookmarking
  const handleToggleBookmark = async (projectId) => {
    if (!currentUser) return;
    const updated = await toggleCloudBookmark(currentUser.id, projectId);
    setBookmarks(updated);
    const isBookmarked = updated.includes(projectId);
    addToast(isBookmarked ? 'Project saved to bookmarks.' : 'Project removed from bookmarks.', 'info');
  };

  // Reset Data to Factory Seeds
  const handleResetData = () => {
    resetCloudDatabase();
    addToast('Cloud database reset to default demo dataset.', 'info');
    refreshAllData();
  };

  // Manual Firestore seed (admin action)
  const handleSeedFirestore = async () => {
    try {
      await seedFirestoreDatabase();
      addToast('Firestore seeded with demo data successfully!', 'success');
      await refreshAllData();
    } catch (err) {
      addToast('Firestore seed failed — check security rules.', 'warning');
    }
  };

  return (
    <DataContext.Provider
      value={{
        loading,
        projects,
        students,
        skills,
        categories,
        teams,
        joinRequests,
        bookmarks,
        refreshAllData,
        createProject: handleCreateProject,
        updateProject: handleUpdateProject,
        deleteProject: handleDeleteProject,
        createSkill: handleCreateSkill,
        deleteSkill: handleDeleteSkill,
        createCategory: handleCreateCategory,
        createTeam: handleCreateTeam,
        updateTeam: handleUpdateTeam,
        leaveTeam: handleLeaveTeam,
        sendJoinRequest: handleSendJoinRequest,
        resolveJoinRequest: handleResolveJoinRequest,
        toggleBookmark: handleToggleBookmark,
        isBookmarked: (id) => bookmarks.includes(id),
        resetDatabase: handleResetData,
        seedFirestore: handleSeedFirestore,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
