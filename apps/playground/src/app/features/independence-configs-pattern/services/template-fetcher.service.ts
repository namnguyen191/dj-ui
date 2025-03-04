import { Injectable } from '@angular/core';
import { LayoutTemplate, RemoteResourceTemplate, UIElementTemplate } from '@dj-ui/core';
import { Observable, of } from 'rxjs';

const mockCard = {
  id: 'carbon_text_card_test',
  type: 'CARBON_TEXT_CARD',
  remoteResourceIds: ['JOKE_API_REMOTE_RESOURCE'],
  options: {
    title: 'Neocaridina',
    subTitle: 'Beginner level species',
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/2347/2347004.png',
    imageUrl:
      'https://coburgaquarium.com.au/cdn/shop/files/CoburgAquariumBloodyMaryAquariumShrimp.jpg?v=1697349869',
    body: 'Neocaridina shrimp are a popular species of freshwater shrimp often kept in aquariums due to their small size, vibrant colors, and ease of care. The most famous type is the Neocaridina davidi, commonly known as the Cherry Shrimp because of its bright red coloration, though they come in many colors, including blue, yellow, and green.\n\nThey reproduce easily in the right conditions, which makes them a favorite for hobbyists looking to create a self-sustaining shrimp colony.',
    clickable: true,
  },
  eventsHooks: {
    onCardClicked: [
      {
        type: 'showTestNotification',
      },
      {
        type: 'navigate',
        payload: {
          navigationType: 'internal',
          url: '/dui-e2e/button-patterns',
        },
      },
    ],
  },
};

@Injectable({
  providedIn: 'root',
})
export class TemplateFetcherService {
  getLayoutTemplate(id: string): Observable<LayoutTemplate> {
    return of({
      id,
      uiElementInstances: [
        {
          id: 'instance-1',
          uiElementTemplateId: mockCard.id,
        },
      ],
    } as LayoutTemplate);
  }

  getUIElementTemplate(_id: string): Observable<UIElementTemplate> {
    return of(mockCard as UIElementTemplate);
  }

  getRemoteResourceTemplate(id: string): Observable<RemoteResourceTemplate> {
    return of({ id } as RemoteResourceTemplate);
  }
}
