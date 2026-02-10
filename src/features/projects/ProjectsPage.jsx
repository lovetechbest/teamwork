import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isHighman } from '../../utils/roles';
import { useProjects } from './hooks/useProjects';
import ProjectForm from './components/ProjectForm';
import ProjectFilters from './components/ProjectFilters';
import ProjectList from './components/ProjectList';
import './ProjectsPage.css';

const INITIAL_FILTER_INPUTS = {
  name: '',
  CompanyOrClientName: '',
  userID: '',
  stack: '',
  communicationApp: '',
  summary: '',
};

const DEBOUNCE_MS = 400;

const ProjectsPage = () => {
  const { role } = useSelector((state) => state.auth);
  const userRole = role || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('userRole') : null);
  const showUserIDFilter = isHighman(userRole);

  const [filterInputs, setFilterInputs] = useState(INITIAL_FILTER_INPUTS);
  const [appliedFilters, setAppliedFilters] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setAppliedFilters({ ...filterInputs }), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filterInputs]);

  const apiFilters = useMemo(() => {
    const f = {};
    if (appliedFilters.name?.trim()) f.name = appliedFilters.name.trim();
    if (appliedFilters.CompanyOrClientName?.trim()) f.CompanyOrClientName = appliedFilters.CompanyOrClientName.trim();
    if (appliedFilters.userID?.trim()) f.userID = appliedFilters.userID.trim();
    if (appliedFilters.stack?.trim()) f.stack = appliedFilters.stack.trim();
    if (appliedFilters.communicationApp?.trim()) f.communicationApp = appliedFilters.communicationApp.trim();
    if (appliedFilters.summary?.trim()) f.summary = appliedFilters.summary.trim();
    return f;
  }, [appliedFilters]);

  const { projects, addProject, updateProject, deleteProject, error, loading, fetchError, fetchLoading } = useProjects(apiFilters);

  const handleClearFilters = () => {
    setFilterInputs(INITIAL_FILTER_INPUTS);
    setAppliedFilters({});
  };

  return (
    <div className="projects-page">
      <ProjectFilters
        filters={filterInputs}
        onChange={setFilterInputs}
        onClear={handleClearFilters}
        showUserIDFilter={showUserIDFilter}
      />
      <ProjectForm onSubmit={addProject} disabled={loading} />
      {error && <p className="error-message">{error}</p>}
      {fetchError && <p className="error-message">{fetchError}</p>}
      {fetchLoading ? (
        <p className="loading-message">Loading projects…</p>
      ) : (
        <ProjectList
          projects={projects}
          updateProject={updateProject}
          deleteProject={deleteProject}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
