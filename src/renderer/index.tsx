import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

// // calling IPC exposed from preload script
window.electron.sendEvent({
  name: 'sendEvent',
  payload: { message: 'ping' },
});

window.electron.on('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
