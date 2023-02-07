import { Child, Command } from '@tauri-apps/api/shell';
import create from 'zustand';
import { invoke } from '@tauri-apps/api';

interface ServicesState {
  serverState:
    | 'starting'
    | 'started'
    | 'stopped'
    | 'stoping'
    | 'error'
    | 'unknown';
  databaseState:
    | 'starting'
    | 'started'
    | 'stopped'
    | 'stoping'
    | 'error'
    | 'unknown';
  serverProcess?: Child;
  serverIp?: string;
  startServer: () => void;
  stopServer: () => void;
  startDatabase: () => void;
  stopDatabase: () => void;
  serverStarted: () => void;
  serverStopped: () => void;
  databaseStarted: () => void;
  databaseStopped: () => void;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
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
    const command = new Command('start');

    if (sp) {
      await sp.kill();
    } else {
      await invoke('kill_api');
    }
    const serverProcess = await command.spawn();
    command.on('close', () => {
      serverStopped();
    });
    command.stdout.addListener('data', (data: string) => {
      if (data.includes('started')) {
        serverStarted();
      }
    });
    command.on('error', (data) => {
      console.log(data);
    });
    command.stderr.addListener('data', (data) => {
      console.log(data);
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
  databaseStarted: () => set({ databaseState: 'started' }),
  databaseStopped: () => set({ databaseState: 'stopped' }),
  stopDatabase: () => set({ databaseState: 'stoping' }),
  startDatabase: () => set({ databaseState: 'starting' }),
}));
invoke('is_api_running').then((isRunning) => {
  if (isRunning === 'true') {
    useServicesStore.getState().serverStarted();
  }
});

export const useServerState = () =>
  useServicesStore((state) => ({
    serverState: state.serverState,
    serverIp: state.serverIp,
  }));
export const useDatabaseState = () =>
  useServicesStore((state) => state.databaseState);
