import { invoke } from '@tauri-apps/api';
import { Child } from '@tauri-apps/api/shell';
import create from 'zustand';
import { join, resolveResource } from '@tauri-apps/api/path';
import { DbServerLauncher } from '../dbLauncher';
import { useApiServerStore } from './apiServerStore';
import { appWindow } from "@tauri-apps/api/window";

export interface DBServerState {
  serverState:
    | 'starting'
    | 'Initializing'
    | 'migrating'
    | 'started'
    | 'stopped'
    | 'stoping'|"Checking"
    | 'error';
  serverProcess?: Child;
  error?:
    | 'table_not_exist'
    | 'db_not_exist'
    | 'db_not_initialized'
    | 'unable_to_initiate'
    | 'unable_to_migrate'
    | 'unable_to_start'
    | 'initiated_but_not_migrated';
    info?:string
  startServer: () => void;
  stopServer: () => void;
  serverStarted: () => void;
  serverStopped: () => void;
  serverError: () => void;
}
const dataDir = await resolveResource('Binaries/ThirdParty/PostgreSQL/');
const dbLauncher = new DbServerLauncher({
  dataDir: await join(dataDir, 'data'),
  dbName: 'mydb',
  port: '5432',
  username: 'postgres',
  logFile: await join(dataDir, 'data', 'logfile.log'),
  migrationFile: await join(dataDir, 'bin', 'pg_mg.dll'),
});
export const useDBServerStore = create<DBServerState>((set, get) => ({
  serverState: 'stopped',
  startServer: async () => {
    if (get().serverState == 'started') return;
   if(get().serverState=="stopped") set({ serverState: 'Checking' });
    if ((await invoke('is_bd_initialized')) == 'true') {
      const isReady = await dbLauncher.isDbReady();
      if (isReady) {
        const isTableExist = await dbLauncher.isDbMigrated();
        if (!isTableExist) {
          if (get().serverState == 'Initializing') {
            set({ error: 'table_not_exist', serverState: 'migrating' });
            const created = await dbLauncher.createDb();
            if (!created) {
              get().stopServer();
              return set({ serverState: 'error', error: 'unable_to_migrate' });
            } else {
              get().serverStarted();
            }
          } else {
            get().stopServer();
            return set({
              serverState: 'error',
              error: 'initiated_but_not_migrated',
            });
          }
        } else {
          get().serverStarted();
        }
      } else {
        set({
          serverState:
            get().serverState != 'Initializing'
              ? 'starting'
              : get().serverState,
        });
        const child = await dbLauncher.startServer({
          onServerStopped: () => get().serverStopped(),
        });
        if (!child) {
          get().stopServer();
          return set({ serverState: 'error', error: 'unable_to_start' });
        }
        set({ serverProcess: child });
        if (get().serverState == 'Initializing') {
          get().startServer();
        } else get().serverStarted();
      }
    } else {
      set({ error: 'db_not_initialized', serverState: 'Initializing' });
      const initd = await dbLauncher.initServer();
      if (!initd) {
        get().stopServer();

        set({ serverState: 'error', error: 'unable_to_initiate' });
      } else get().startServer();
    }
  },

  stopServer: async () => {
    useApiServerStore.getState().stopServer();
    set({ serverState: 'stoping' });
    await dbLauncher.stopServer();
    await get().serverProcess?.kill();
    get().serverStopped();
  },
  serverStarted: async () => {
    invoke('set_server_state', {state: "started"})
     set({ serverState: 'started' ,error:undefined});
     return useApiServerStore.getState().startServer();
  },
  serverStopped: () =>{
    invoke('set_server_state', {state: "stopped"})
    set({
      serverState: 'stopped',
      serverProcess: undefined,
      error: undefined,
    })},
  serverError: () => set({ serverState: 'error' }),
}));


dbLauncher.isDbReady().then((res) => {
  if (res) {
    useDBServerStore.getState().startServer();
  }
}
);
