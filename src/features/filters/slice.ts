import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FiltersState, ToggleCategoryPayload } from './types';
import { initialFilterState } from './types';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFilterState,
  reducers: {
    toggleSubcategorySelection: (state, action: PayloadAction<number>) => {
      const subcategoryId = action.payload.toString();
      const index = state.skills.indexOf(subcategoryId);

      if (index === -1) {
        state.skills.push(subcategoryId);
      } else {
        state.skills.splice(index, 1);
      }
    },

    toggleCategorySelection: (state, action: PayloadAction<ToggleCategoryPayload>) => {
      const { categoryId, subcategoryIds, isDeselecting } = action.payload;
      const subcategoryIdStrings = subcategoryIds.map((id) => id.toString());

      if (isDeselecting) {
        state.skills = state.skills.filter(
          (id) => !subcategoryIdStrings.includes(id) && id !== categoryId.toString(),
        );
      } else {
        subcategoryIdStrings.forEach((id) => {
          if (!state.skills.includes(id)) {
            state.skills.push(id);
          }
        });

        if (subcategoryIds.length === 0 && !state.skills.includes(categoryId.toString())) {
          state.skills.push(categoryId.toString());
        }
      }
    },

    setMainFilter: (state, action: PayloadAction<string>) => {
      state.mainFilter = action.payload;
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setAuthorGender: (state, action: PayloadAction<string>) => {
      state.authorGender = action.payload;
    },

    toggleCitySelection: (state, action: PayloadAction<number>) => {
      const cityId = action.payload;
      const index = state.cities.indexOf(cityId);

      if (index === -1) {
        state.cities.push(cityId);
      } else {
        state.cities.splice(index, 1);
      }
    },

    resetFilters: (state) => {
      state.mainFilter = initialFilterState.mainFilter;
      state.searchQuery = initialFilterState.searchQuery;
      state.skills = [...initialFilterState.skills];
      state.authorGender = initialFilterState.authorGender;
      state.cities = [...initialFilterState.cities];
    },

    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      if (action.payload.mainFilter !== undefined) {
        state.mainFilter = action.payload.mainFilter;
      }
      if (action.payload.searchQuery !== undefined) {
        state.searchQuery = action.payload.searchQuery;
      }
      if (action.payload.skills !== undefined) {
        state.skills = action.payload.skills;
      }
      if (action.payload.authorGender !== undefined) {
        state.authorGender = action.payload.authorGender;
      }
      if (action.payload.cities !== undefined) {
        state.cities = action.payload.cities;
      }
    },
  },
});

export const {
  toggleSubcategorySelection,
  toggleCategorySelection,
  setMainFilter,
  setSearchQuery,
  setAuthorGender,
  toggleCitySelection,
  resetFilters,
  setFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
