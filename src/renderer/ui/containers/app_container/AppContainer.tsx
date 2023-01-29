import MainLogo from '@components/main_logo';
import './style/index.scss';
import IpDisplay from '@components/ip_display';
import MainButton from '@components/main_button';
import ServicesStatus from '@components/services_status';
import { useEffect, useState } from 'react';
import { Command } from '@tauri-apps/api/shell';
interface AppContainerProps {}
export default function AppContainer({}: AppContainerProps) {
  const [first, setfirst] = useState<string[]>([]);
  const startTheServer = async () => {
    // await invoke('start_the_server')
    //   .then((message) => console.log(message))
    //   .catch((error) => console.error(error));
    const output = await new Command('start').execute();
    console.log('output file :', output.stdout);
    console.log('output code :', output.code);
    console.log('output error :', output.stderr);
  };
  useEffect(() => {
    startTheServer();

    return () => {};
  }, []);

  return (
    <div className="app-container">
      <MainLogo />
      <div className="middle-wrapper">
        <IpDisplay ipAdr="0.0.0.0" />
        <MainButton state="start" onPress={() => {}} />
      </div>
      <div className="services-container">
        <ServicesStatus name="Clinicord services" state="stopped" />
        <ServicesStatus name="Clinicord services" state="stopped" />
      </div>
    </div>
  );
}
