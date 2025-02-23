import mockTablesDemo from '../../../public/sample-templates/layouts/TABLES_DEMO.LAYOUT.json';
import mockJokeAPIRR from '../../../public/sample-templates/remote-resources/JOKE_API_REMOTE_RESOURCE.json';
import mockPokemonPaginationRR from '../../../public/sample-templates/remote-resources/POKEMON_PAGINATION.REMOTE_RESOURCE.json';
import mockPokemonParallelRR from '../../../public/sample-templates/remote-resources/POKEMON_PARALLEL.REMOTE_RESOURCE.json';
import mockUsPopRR from '../../../public/sample-templates/remote-resources/US_POP.REMOTE_RESOURCE.json';
import mockUsPopPaginationRR from '../../../public/sample-templates/remote-resources/US_POP_PAGINATION.REMOTE_RESOURCE.json';
import mockCarouselCard from '../../../public/sample-templates/ui-elements/CAROUSEL_CARD_TEST.CARBON_CAROUSEL_CARD.json';
import mockCarousel from '../../../public/sample-templates/ui-elements/CAROUSEL_TEST.CARBON_CAROUSEL.json';
import mockinMemoryPaginationTable from '../../../public/sample-templates/ui-elements/IN_MEMORY_PAGINATION.CARBON_TABLE.json';
import mockMixRequestsTable from '../../../public/sample-templates/ui-elements/MIX_REQUESTS.CARBON_TABLE.json';
import mockParallelRequestsTable from '../../../public/sample-templates/ui-elements/POKEMON_PARALLEL_REQUEST.CARBON_TABLE.json';
import mockServerSidePaginationTable from '../../../public/sample-templates/ui-elements/SERVER_SIDE_PAGINATION.CARBON_TABLE.json';
import mockTextCardTable from '../../../public/sample-templates/ui-elements/TEXT_CARD_TEST.CARBON_TEXT_CARD.json';

export const mockUIElementTemplates = [
  mockCarouselCard,
  mockCarousel,
  mockinMemoryPaginationTable,
  mockMixRequestsTable,
  mockParallelRequestsTable,
  mockServerSidePaginationTable,
  mockTextCardTable,
];

export const mockLayoutTemplates = [mockTablesDemo];

export const mockRemoteResourceTemplates = [
  mockJokeAPIRR,
  mockPokemonPaginationRR,
  mockPokemonParallelRR,
  mockUsPopPaginationRR,
  mockUsPopRR,
];
