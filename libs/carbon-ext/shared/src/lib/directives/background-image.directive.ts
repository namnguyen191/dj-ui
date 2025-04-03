import { Directive, input, type InputSignalWithTransform } from '@angular/core';

@Directive({
  selector: '[backgroundImage]',
  host: {
    '[style.backgroundImage]': 'imageUrlSig()',
  },
})
export class BackgroundImageDirective {
  readonly imageUrlSig: InputSignalWithTransform<string, unknown> = input.required({
    alias: 'backgroundImage',
    transform: (imgUrl) => `url(${imgUrl})`,
  });
}
