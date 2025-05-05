import type { AnyUIElementTemplate } from '@dj-ui/core';

import pokemonWithPaginationRR from '../lib/dj-ui-templates/remote-resources/POKEMON_PAGINATION.REMOTE_RESOURCE.json';
import blueDiamondNeocaridina from '../lib/dj-ui-templates/ui-elements/blue-diamond-neocaridina-image.PRIME_NG_SIMPLE_IMAGE.json';
import pokemonServerSidePaginationTable from '../lib/dj-ui-templates/ui-elements/pokemon-server-side-pagination-table.PRIME_NG_SIMPLE_TABLE.json';
import purpleMetallicCaridina from '../lib/dj-ui-templates/ui-elements/purple-metallic-caridina-image.PRIME_NG_SIMPLE_IMAGE.json';
import sampleImagesCarousel from '../lib/dj-ui-templates/ui-elements/sample-images-carousel.PRIME_NG_IMAGES_CAROUSEL.json';
import sampleLayout from '../lib/dj-ui-templates/ui-elements/sample-layout.SIMPLE_GRID_LAYOUT.json';
import sulawesiWhiteSockImage from '../lib/dj-ui-templates/ui-elements/sulawesi-whitesock-image.PRIME_NG_SIMPLE_IMAGE.json';
import type { AppRemoteResourceTemplate, CreateAppUIElementTemplate } from './app-template';

export const mockUIElementTemplates: CreateAppUIElementTemplate<AnyUIElementTemplate>[] = [
  sampleLayout,
  pokemonServerSidePaginationTable,
  sulawesiWhiteSockImage,
  blueDiamondNeocaridina,
  purpleMetallicCaridina,
  sampleImagesCarousel,
];

export const mockRemoteResourceTemplates: AppRemoteResourceTemplate[] = [pokemonWithPaginationRR];
