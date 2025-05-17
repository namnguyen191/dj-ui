/// <reference lib="webworker" />

import {
  handleRunJsMessage,
  type InterpolateWorkerEvent,
} from '@dj-ui/core/js-interpolation-worker';

addEventListener('message', (e: MessageEvent<InterpolateWorkerEvent>) => {
  const allowList = new Set<string>(['console', 'JSON', 'Math', 'Intl']);
  handleRunJsMessage(e, allowList);
});
