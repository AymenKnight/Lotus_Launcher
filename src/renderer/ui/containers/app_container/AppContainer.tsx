import MainLogo from '@components/main_logo';
import './style/index.scss';
import IpDisplay from '@components/ip_display';
import MainButton from '@components/main_button';
import ServicesStatus from '@components/services_status';
import { useApiServer, useApiServerStore } from '@stores/apiServerStore';
import { useDBServerStore } from '@stores/dbServerStore';
import { useEffect } from 'react';
import { ask } from '@tauri-apps/api/dialog';

interface AppContainerProps {}
export default function AppContainer({}: AppContainerProps) {
  const { serverState, serverIp } = useApiServer();
  const { serverState: dbState, error } = useDBServerStore();
  const isTauri = !!(window as any).window.__TAURI_IPC__;
  useEffect(() => {
    const preventRefresh = (e: KeyboardEvent) => {
      if (e.key === 'F5'|| (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', preventRefresh, false);
    return () => {
      window.removeEventListener('keydown', preventRefresh, false);
    }
  }, [])
  
  return (
    <div className="app-container">
      <MainLogo />
      {isTauri ? (
        <>
          <div className="middle-wrapper">
            {serverIp && <IpDisplay ipAdr={serverIp} />}
            <MainButton
              state={dbState=="started"?serverState=="stopped"?"starting": serverState:dbState}
              onPress={async () => {
                if(dbState === 'started') {  
                  const confirmed = await ask('Are you sure you want to stop the server?',{title:"Stop the server",type:"warning"});
                  if(!confirmed) return;
              
                  if(serverState === 'stopped')
                    useApiServerStore.getState().startServer();
                  else  useDBServerStore.getState().stopServer();
                }
                else  {
                  useDBServerStore.getState().startServer();
                }
                
              }}
            />
          </div>
          <div className="services-container">
            <ServicesStatus name="Database services" state={dbState} />
            <ServicesStatus name="Clinicord services" state={serverState} />
          </div>
        </>
      ) : (
        <span>
          The dev server is running. You only can access it through the tauri
          app.
        </span>
      )}
      {error && <span>{error}</span>}
    </div>
  );
}
