import {
  AllCommunityModule,
  ModuleRegistry,
  provideGlobalGridOptions,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

// The tool styles grids with the legacy CSS-file themes (ag-grid.css +
// ag-theme-alpine + custom .ag-* rules). Opt every grid into legacy theming so
// ag-grid v35's default Theming API doesn't conflict (error #239).
provideGlobalGridOptions({ theme: 'legacy' });
