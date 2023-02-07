import MainLogo from '@components/main_logo';
import './style/index.scss';
import IpDisplay from '@components/ip_display';
import MainButton from '@components/main_button';
import ServicesStatus from '@components/services_status';
import { useServerState, useServicesStore } from '@stores/servicesStore';

interface AppContainerProps {}
export default function AppContainer({}: AppContainerProps) {
  const { serverState, serverIp } = useServerState();

  return (
    <div className="app-container">
      <MainLogo />
      <div className="middle-wrapper">
        {serverIp && <IpDisplay ipAdr={serverIp} />}
        <MainButton
          state={serverState}
          onPress={() => {
            if (serverState === 'stopped')
              useServicesStore.getState().startServer();
            if (serverState === 'started')
              useServicesStore.getState().stopServer();
          }}
        />
      </div>
      <div className="services-container">
        <ServicesStatus name="Database services" state="stopped" />
        <ServicesStatus name="Clinicord services" state={serverState} />
      </div>
    </div>
  );
}
