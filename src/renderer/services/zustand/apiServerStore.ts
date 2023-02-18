import { Child, Command } from '@tauri-apps/api/shell';
import create from 'zustand';
import { invoke } from '@tauri-apps/api';
import { DB_ENV } from '@constants/db';

interface ApiServerState {
  serverState:
    | 'starting'
    | 'started'
    | 'stopped'
    | 'stoping'
    | 'error';
  serverProcess?: Child;
  serverIp?: string;
  error?: string;
  startServer: () => void;
  stopServer: () => void;
  serverStarted: () => void;
  serverStopped: () => void;
  serverError: () => void;
}

export const useApiServerStore = create<ApiServerState>((set, get) => ({
  serverState: 'stopped',
  databaseState: 'stopped',
  startServer: async () => {
    const {
      serverProcess: sp,
      serverState,
      serverStarted,
      serverStopped,
    } = get();
    if (serverState === 'started') {
      return;
    }

    const dbUrl = `postgresql://${DB_ENV.username}:root@localhost:${DB_ENV.port}/${DB_ENV.name}?schema=public`;
    const args = ['-u',dbUrl,"-p","3000"];
    const command = new Command('start',args);

    if (sp) {
      await sp.kill();
    } else {
      await invoke('kill_api');
    }
    const serverProcess = await command.spawn();
    command.on('close', () => {
      if (get().serverState !== 'error') serverStopped();
    });
    command.stdout.addListener('data', (data: string) => {
      console.log(data);
      if (data.includes('started')) {
        serverStarted();
      }
    });

    command.stderr.addListener('data', (data) => {
      get().serverError();
    });

    return set({ serverState: 'starting', serverProcess, serverIp: undefined });
  },
  stopServer: async () => {
    const { serverProcess } = get();
    if (serverProcess) {
      await serverProcess.kill();
    } else {
      invoke('kill_api').then(() => {
        get().serverStopped();
      });
    }
    return set({ serverState: 'stoping', serverIp: undefined });
  },
  serverStarted: async () => {
    const serverIp = (await invoke('get_ip')) as string | undefined;
    return set({ serverState: 'started', serverIp });
  },
  serverStopped: () => set({ serverState: 'stopped', serverIp: undefined }),
  serverError: () => set({ serverState: 'error' }),
}));
invoke('is_api_running').then((isRunning) => {
  if (isRunning === 'true') {
    useApiServerStore.getState().serverStarted();
  }
});

export const useApiServer = () =>
  useApiServerStore((state) => ({
    serverState: state.serverState,
    serverIp: state.serverIp,
  }));
