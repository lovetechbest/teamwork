import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useProjects } from './hooks/useProjects';
import { fetchUsers } from '../../store/users/userActions';
import { isHighman } from '../../utils/roles';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { role, userId } = useSelector(state => state.auth);
  const userRole = role || localStorage.getItem("userRole");
  const isManager = isHighman(userRole);
  
  const [keywordFilter, setKeywordFilter] = useState('');
  const [stackFilter, setStackFilter] = useState('');
  const [communicationAppFilter, setCommunicationAppFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState({});

  const { projects, addProject, updateProject, deleteProject, refreshProjects, loading, error } = useProjects(appliedFilters);
  const [editingId, setEditingId] = useState(null);

  // Fetch users for manager filter
  useEffect(() => {
    if (isManager) {
      const loadUsers = async () => {
        try {
          const usersList = await fetchUsers();
          setUsers(usersList || []);
        } catch (err) {
          console.error("Failed to load users:", err);
        }
      };
      loadUsers();
    }
  }, [isManager]);

  // Debounce keyword filter
  useEffect(() => {
    const timer = setTimeout(() => {
      applyFilters();
    }, 300);
    return () => clearTimeout(timer);
  }, [keywordFilter, stackFilter, communicationAppFilter, userFilter]);

  const applyFilters = () => {
    const filters = {};
    
    // Keyword filter - search in name, summary, or CompanyOrClientName
    if (keywordFilter.trim()) {
      filters.name = keywordFilter.trim();
    }
    
    // Category filters
    if (stackFilter) filters.stack = stackFilter;
    if (communicationAppFilter) filters.communicationApp = communicationAppFilter;
    
    // User filter (for managers)
    if (isManager && userFilter) {
      filters.userID = userFilter;
    }
    
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    setKeywordFilter('');
    setStackFilter('');
    setCommunicationAppFilter('');
    setUserFilter('');
    setAppliedFilters({});
  };

  const hasActiveFilters = keywordFilter || stackFilter || communicationAppFilter || userFilter;

  const handleSubmit = async (projectData) => {
    if (editingId) {
      await updateProject(editingId, projectData);
      setEditingId(null);
    } else {
      await addProject(projectData);
    }
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const editingProject = editingId ? projects.find(p => (p._id || p.id) === editingId) : null;

  // Extract unique values for category dropdowns from projects
  const uniqueStacks = [...new Set(projects.flatMap(p => {
    const stack = Array.isArray(p.stack) ? p.stack : (p.stack ? [p.stack] : []);
    return stack.map(s => s.trim()).filter(s => s);
  }))].sort();

  const uniqueCommunicationApps = [...new Set(projects
    .map(p => p.communicationApp)
    .filter(app => app && app.trim())
  )].sort();

  return (
    <div className="projects-page">
      <div className="projects-layout">
        <aside className="projects-form-col">
          <ProjectForm 
            onSubmit={handleSubmit} 
            editingProject={editingProject}
            onCancel={editingId ? handleCancel : null}
          />
        </aside>
        <main className="projects-list-col">
          <div className="projects-filters">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label htmlFor="keyword-filter">Search Keywords</label>
              <input
                type="text"
                id="keyword-filter"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                placeholder="Search by name, company, or summary..."
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="stack-filter">Stack</label>
              <select
                id="stack-filter"
                value={stackFilter}
                onChange={(e) => setStackFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Stacks</option>
                {uniqueStacks.map(stack => (
                  <option key={stack} value={stack}>{stack}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="communication-filter">Communication App</label>
              <select
                id="communication-filter"
                value={communicationAppFilter}
                onChange={(e) => setCommunicationAppFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Apps</option>
                {uniqueCommunicationApps.map(app => (
                  <option key={app} value={app}>{app}</option>
                ))}
              </select>
            </div>

            {isManager && (
              <div className="filter-group">
                <label htmlFor="user-filter">User</label>
                <select
                  id="user-filter"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Users</option>
                  {users.map(user => {
                    const userId = user.uniqueID || user._id || user.id || user.userID;
                    const userName = user.name || user.userID || `User ${userId}`;
                    return (
                      <option key={userId} value={userId}>{userName}</option>
                    );
                  })}
                </select>
              </div>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            )}
          </div>

          {loading && <p>Loading projects...</p>}
          {error && <p className="error-text">{error}</p>}
          {!loading && !error && (
            <ProjectList 
              projects={projects} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              editingId={editingId}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
