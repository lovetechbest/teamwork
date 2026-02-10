import React from 'react';
import './ProjectFilters.css';

const FILTER_KEYS = [
  { key: 'name', label: 'Name' },
  { key: 'CompanyOrClientName', label: 'Company / Client' },
  { key: 'userID', label: 'User ID' },
  { key: 'stack', label: 'Stack' },
  { key: 'communicationApp', label: 'Communication App' },
  { key: 'summary', label: 'Summary' },
];

const ProjectFilters = ({ filters, onChange, onClear, showUserIDFilter = false }) => {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const keysToShow = showUserIDFilter
    ? FILTER_KEYS
    : FILTER_KEYS.filter(({ key }) => key !== 'userID');

  return (
    <div className="project-filters-bar">
      <div className="project-filters-bar__row">
        {keysToShow.map(({ key, label }) => (
          <div key={key} className="project-filters-bar__field">
            <span className="project-filters-bar__label">{label}</span>
            <input
              id={`filter-${key}`}
              type="text"
              className="project-filters-bar__input"
              value={filters[key] ?? ''}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={label}
            />
          </div>
        ))}
        <button type="button" onClick={onClear} className="project-filters-bar__clear">
          Clear
        </button>
      </div>
    </div>
  );
};

export default ProjectFilters;
