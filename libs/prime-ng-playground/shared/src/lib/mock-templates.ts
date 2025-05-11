import type { AnyUIElementTemplate } from '@dj-ui/core';

import pokemonWithPaginationRR from '../lib/dj-ui-templates/remote-resources/POKEMON_PAGINATION.REMOTE_RESOURCE.json';
import pokemonParallelRR from '../lib/dj-ui-templates/remote-resources/POKEMON_PARALLEL.REMOTE_RESOURCE.json';
import top50Pokemons from '../lib/dj-ui-templates/remote-resources/TOP_50_POKEMONS.REMOTE_RESOURCE.json';
import usPopWithPaginationRR from '../lib/dj-ui-templates/remote-resources/US_POP_PAGINATION.REMOTE_RESOURCE.json';
import blueDiamondNeocaridina from '../lib/dj-ui-templates/ui-elements/blue-diamond-neocaridina-image.PRIME_NG_SIMPLE_IMAGE.json';
import homeIntroductionText from '../lib/dj-ui-templates/ui-elements/home-introduction.PRIME_NG_SIMPLE_TEXT.json';
import sampleMixRequestsTable from '../lib/dj-ui-templates/ui-elements/mix-requests-table.PRIME_NG_SIMPLE_TABLE.json';
import pokemonInMemoryPaginationTable from '../lib/dj-ui-templates/ui-elements/pokemon-in-memory-pagination-table.PRIME_NG_SIMPLE_TABLE.json';
import pokemonServerSidePaginationTable from '../lib/dj-ui-templates/ui-elements/pokemon-server-side-pagination-table.PRIME_NG_SIMPLE_TABLE.json';
import samplePokemonTableRowImage from '../lib/dj-ui-templates/ui-elements/pokemon-table-row-image.PRIME_NG_SIMPLE_IMAGE.json';
import purpleMetallicCaridina from '../lib/dj-ui-templates/ui-elements/purple-metallic-caridina-image.PRIME_NG_SIMPLE_IMAGE.json';
import sampleImagesCarousel from '../lib/dj-ui-templates/ui-elements/sample-images-carousel.PRIME_NG_IMAGES_CAROUSEL.json';
import sampleLayout from '../lib/dj-ui-templates/ui-elements/sample-layout.SIMPLE_GRID_LAYOUT.json';
import shrimpsIntroductionCard from '../lib/dj-ui-templates/ui-elements/shrimps-introduction-card.PRIME_NG_CARD.json';
import sulawesiWhiteSockImage from '../lib/dj-ui-templates/ui-elements/sulawesi-whitesock-image.PRIME_NG_SIMPLE_IMAGE.json';
import type { AppRemoteResourceTemplate, CreateAppUIElementTemplate } from './app-template';

export const mockUIElementTemplates: CreateAppUIElementTemplate<AnyUIElementTemplate>[] = [
  sampleLayout,
  pokemonServerSidePaginationTable,
  sulawesiWhiteSockImage,
  blueDiamondNeocaridina,
  purpleMetallicCaridina,
  sampleImagesCarousel,
  samplePokemonTableRowImage,
  sampleMixRequestsTable,
  pokemonInMemoryPaginationTable,
  homeIntroductionText,
  shrimpsIntroductionCard,
];

export const mockRemoteResourceTemplates: AppRemoteResourceTemplate[] = [
  pokemonWithPaginationRR,
  pokemonParallelRR,
  usPopWithPaginationRR,
  top50Pokemons,
];
