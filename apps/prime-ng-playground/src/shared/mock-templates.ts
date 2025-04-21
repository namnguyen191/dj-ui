import type { AnyUIElementTemplate } from '@dj-ui/core';

import pokemonWithPaginationRR from '../../public/dj-ui/remote-resources/POKEMON_PAGINATION.REMOTE_RESOURCE.json';
import pokemonServerSidePaginationTable from '../../public/dj-ui/ui-elements/pokemon-server-side-pagination-table.PRIME_NG_SIMPLE_TABLE.json';
import type { AppRemoteResourceTemplate, CreateAppUIElementTemplate } from './app-template';

export const mockUIElementTemplates: CreateAppUIElementTemplate<AnyUIElementTemplate>[] = [
  pokemonServerSidePaginationTable,
];

export const mockLayoutTemplates = [];

export const mockRemoteResourceTemplates: AppRemoteResourceTemplate[] = [pokemonWithPaginationRR];
