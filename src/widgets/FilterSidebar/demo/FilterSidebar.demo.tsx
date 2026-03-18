import { useState } from 'react';
import { FilterSidebar } from '../FilterSidebar';
import type { FilterState } from '../FilterSidebar';

const FilterSidebarDemo = () => {
  const [currentFilters, setCurrentFilters] = useState<FilterState>({
    mainFilter: 'all',
    skills: [],
    authorGender: '',
    cities: [],
  });

  const handleFilterChange = (filters: FilterState) => {
    setCurrentFilters(filters);
    console.log('Фильтры изменены:', filters);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <FilterSidebar onFilterChange={handleFilterChange} />

        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minWidth: '300px',
          }}
        >
          <h3> Полученные фильтры:</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
            {JSON.stringify(currentFilters, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebarDemo;
