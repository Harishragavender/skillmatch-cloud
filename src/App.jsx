import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProfilePage } from './pages/student/ProfilePage';
import { EditProfilePage } from './pages/student/EditProfilePage';
import { SkillsManagerPage } from './pages/student/SkillsManagerPage';
import { ProjectDiscoveryPage } from './pages/student/ProjectDiscoveryPage';
import { ProjectDetailsPage } from './pages/student/ProjectDetailsPage';
import { RecommendedProjectsPage } from './pages/student/RecommendedProjectsPage';
import { SkillGapPage } from './pages/student/SkillGapPage';
import { FindTeammatesPage } from './pages/student/FindTeammatesPage';
import { TeammateProfilePage } from './pages/student/TeammateProfilePage';
import { CreateTeamPage } from './pages/student/CreateTeamPage';
import { TeamDetailsPage } from './pages/student/TeamDetailsPage';
import { JoinRequestsPage } from './pages/student/JoinRequestsPage';
import { MyProjectsPage } from './pages/student/MyProjectsPage';
import { ProjectDashboardPage } from './pages/student/ProjectDashboardPage';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { SettingsPage } from './pages/student/SettingsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageProjectsPage } from './pages/admin/ManageProjectsPage';
import { CreateProjectPage } from './pages/admin/CreateProjectPage';
import { EditProjectPage } from './pages/admin/EditProjectPage';
import { ManageStudentsPage } from './pages/admin/ManageStudentsPage';
import { ManageSkillsPage } from './pages/admin/ManageSkillsPage';
import { ManageCategoriesPage } from './pages/admin/ManageCategoriesPage';
import { ManageTeamsPage } from './pages/admin/ManageTeamsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { CloudArchitecturePage } from './pages/admin/CloudArchitecturePage';

export function App() {
  const { currentUser, isAdmin, loading } = useAuth();
  const { theme } = useTheme();

  const [activePage, setActivePage] = useState('landing');
  const [pageParams, setPageParams] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = (page, params = {}) => {
    setActivePage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 animate-spin flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-slate-900 rounded-[14px]" />
          </div>
          <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase animate-pulse">
            Connecting to SkillMatch Cloud...
          </p>
        </div>
      </div>
    );
  }

  // Render Current View
  const renderContent = () => {
    switch (activePage) {
      // Public Views
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return <LoginPage onNavigate={navigate} />;
      case 'register':
        return <RegisterPage onNavigate={navigate} />;
      case 'forgot_password':
        return <ForgotPasswordPage onNavigate={navigate} />;

      // Student Views
      case 'dashboard':
        return <StudentDashboard onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'edit_profile':
        return <EditProfilePage onNavigate={navigate} />;
      case 'skills':
        return <SkillsManagerPage onNavigate={navigate} />;
      case 'projects':
        return <ProjectDiscoveryPage onNavigate={navigate} initialFilters={pageParams} />;
      case 'project_details':
        return <ProjectDetailsPage projectId={pageParams.projectId} onNavigate={navigate} />;
      case 'recommended':
        return <RecommendedProjectsPage onNavigate={navigate} />;
      case 'skillgap':
        return <SkillGapPage projectId={pageParams.projectId} onNavigate={navigate} />;
      case 'teammates':
        return <FindTeammatesPage onNavigate={navigate} targetProject={pageParams.targetProject} />;
      case 'teammate_profile':
        return <TeammateProfilePage studentId={pageParams.studentId} onNavigate={navigate} />;
      case 'create_team':
        return <CreateTeamPage initialProjectId={pageParams.projectId} onNavigate={navigate} />;
      case 'teams':
      case 'team_details':
        return <TeamDetailsPage teamId={pageParams.teamId} onNavigate={navigate} />;
      case 'join_requests':
        return <JoinRequestsPage onNavigate={navigate} />;
      case 'my_projects':
        return <MyProjectsPage onNavigate={navigate} />;
      case 'project_dashboard':
        return <ProjectDashboardPage teamId={pageParams.teamId} onNavigate={navigate} />;
      case 'notifications':
        return <NotificationsPage onNavigate={navigate} />;
      case 'settings':
        return <SettingsPage onNavigate={navigate} />;

      // Admin Views
      case 'admin_dashboard':
        return <AdminDashboard onNavigate={navigate} />;
      case 'admin_projects':
        return <ManageProjectsPage onNavigate={navigate} />;
      case 'admin_create_project':
        return <CreateProjectPage onNavigate={navigate} />;
      case 'admin_edit_project':
        return <EditProjectPage projectId={pageParams.projectId} onNavigate={navigate} />;
      case 'admin_students':
        return <ManageStudentsPage onNavigate={navigate} />;
      case 'admin_skills':
        return <ManageSkillsPage onNavigate={navigate} />;
      case 'admin_categories':
        return <ManageCategoriesPage onNavigate={navigate} />;
      case 'admin_teams':
        return <ManageTeamsPage onNavigate={navigate} />;
      case 'admin_analytics':
        return <AdminAnalyticsPage onNavigate={navigate} />;
      case 'cloud_architecture':
        return <CloudArchitecturePage onNavigate={navigate} />;

      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  const isPublicPage = ['landing', 'login', 'register', 'forgot_password'].includes(activePage);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 dark:bg-[#090d16] light:bg-slate-50 light:text-slate-900 bg-grid-pattern transition-colors">
      {/* Top Navbar with persistent Persona Switcher */}
      <Navbar
        onNavigate={navigate}
        activePage={activePage}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Body */}
      {isPublicPage ? (
        <main className="w-full">
          {renderContent()}
        </main>
      ) : (
        <div className="flex max-w-[1600px] mx-auto">
          {/* Responsive Sidebar */}
          <Sidebar
            activePage={activePage}
            onNavigate={navigate}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          {/* Page Content */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </main>
        </div>
      )}

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}
