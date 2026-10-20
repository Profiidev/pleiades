import { browser } from '$app/environment';
import { sleep } from '$lib/util/interval.svelte';

// oxlint-disable-next-line no-unnecessary-type-parameters
export const createWebsocket = <T>() => {
  let updater: WebSocket | undefined | false = $state(browser && undefined);
  let interval = 0;
  let disconnected = false;

  const connect = (handleMessage: (msg: T) => void, path?: string) => {
    if (updater === false || updater) {
      return;
    }
    connectWebsocket(handleMessage, path);
  };

  const connectWebsocket = (handleMessage: (msg: T) => void, path?: string) => {
    updater = new WebSocket(path ?? '/api/ws/updater');

    // oxlint-disable-next-line prefer-add-event-listener
    updater.onmessage = (event) => {
      const msg: T = JSON.parse(event.data);
      handleMessage(msg);
    };

    // oxlint-disable-next-line prefer-add-event-listener
    updater.onclose = async () => {
      clearInterval(interval);
      if (disconnected) {
        return;
      }
      await sleep(1000);
      connectWebsocket(handleMessage);
    };

    // oxlint-disable-next-line no-unsafe-type-assertion
    interval = setInterval(() => {
      if (
        !updater ||
        updater.readyState === updater.CLOSING ||
        updater.readyState === updater.CLOSED
      ) {
        clearInterval(interval);
        return;
      }

      updater.send('heartbeat');
    }, 10_000) as unknown as number;
  };

  const disconnect = () => {
    if (updater) {
      disconnected = true;
      updater.close();
      updater = undefined;
    }
  };

  return {
    connect,
    disconnect,
    get updater() {
      return updater;
    }
  };
};
