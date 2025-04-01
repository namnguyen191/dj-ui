/// <reference lib="webworker" />

import {
  handleRunJsMessage,
  type InterpolateWorkerEvent,
  ZInterpolateWorkerEvent,
} from '@dj-ui/core/js-interpolation-worker';

addEventListener('message', (e) => {
  const allowList = new Set<string>(['console', 'JSON', 'Math', 'Intl']);

  const { error } = ZInterpolateWorkerEvent.safeParse(e.data);

  if (error) {
    console.warn('Js runner received a message that is not a InterpolateWorkerEvent');
    return;
  }

  handleRunJsMessage(e as MessageEvent<InterpolateWorkerEvent>, allowList);
});
