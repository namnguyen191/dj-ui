import type { AnyUIElementTemplate } from '@dj-ui/core';

import pokemonWithPaginationRR from '../lib/dj-ui-templates/remote-resources/POKEMON_PAGINATION.REMOTE_RESOURCE.json';
import pokemonServerSidePaginationTable from '../lib/dj-ui-templates/ui-elements/pokemon-server-side-pagination-table.PRIME_NG_SIMPLE_TABLE.json';
import type { AppRemoteResourceTemplate, CreateAppUIElementTemplate } from './app-template';

export const mockUIElementTemplates: CreateAppUIElementTemplate<AnyUIElementTemplate>[] = [
  pokemonServerSidePaginationTable,
];

export const mockLayoutTemplates = [];

export const mockRemoteResourceTemplates: AppRemoteResourceTemplate[] = [pokemonWithPaginationRR];
