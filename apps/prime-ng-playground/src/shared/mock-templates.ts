import type { AnyUIElementTemplate } from '@dj-ui/core';

import pokemonServerSidePaginationTable from '../../public/dj-ui/ui-elements/pokemon-server-side-pagination-table.PRIME_NG_SIMPLE_TABLE.json';
import type { CreateAppUIElementTemplate } from './app-template';

export const mockUIElementTemplates: CreateAppUIElementTemplate<AnyUIElementTemplate>[] = [
  pokemonServerSidePaginationTable,
];

export const mockLayoutTemplates = [];

export const mockRemoteResourceTemplates = [];
