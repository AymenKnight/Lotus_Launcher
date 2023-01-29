import MainLogo from '@components/main_logo';
import './style/index.scss';
import IpDisplay from '@components/ip_display';
import MainButton from '@components/main_button';
import ServicesStatus from '@components/services_status';
import { useState } from 'react';
import { Child, Command } from '@tauri-apps/api/shell';

interface AppContainerProps {}
export default function AppContainer({}: AppContainerProps) {
  const [child, setChild] = useState<Child | null>(null);
  const [serverState, setServerState] = useState<
    'started' | 'stopped' | 'start' | 'shutdown' | 'loading'
  >('start');
  const command = new Command('start');
  const startTheServer = async () => {
    console.log('child', child);
    if (serverState == 'started' && child) {
      child
        .kill()
        .then(() => {
          console.log('killed child process');
          setServerState('shutdown');
        })
        .catch();
    } else {
      setServerState('loading');
      // const output = await new Command('start').execute();
      command.addListener('close', (data) => {
        console.log(
          `command finished with code ${data.code} and signal ${data.signal}`,
        );
        setChild(null);
      });
      command.addListener('error', (error) =>
        console.log(`command error: "${error}"`),
      );
      command.stdout.addListener('data', (line) => {
        console.log(`command stdout: "${line}"`);
        if (line.includes('Nest application successfully started')) {
          console.log(`The string  contains the word "`);
          setServerState('started');
        } else {
          console.log(`The string  does not contain the word`);
        }
      });
      command.stderr.addListener('data', (line) => {
        console.log(`command stderr: "${line}"`);
        setServerState('stopped');
      });
      command
        .spawn()
        .then((c) => {
          setChild(c);
        })
        .catch();

      // if (output.code === 0) {
      //   setServerState('started');
      //   console.log(output.stdout);
      // } else {
      //   setServerState('stopped');
      //   console.error(output.stderr);
      // }
    }
  };

  return (
    <div className="app-container">
      <MainLogo />
      <div className="middle-wrapper">
        <IpDisplay ipAdr="0.0.0.0" />
        <MainButton
          state={serverState}
          onPress={() => {
            startTheServer();
          }}
        />
      </div>
      <div className="services-container">
        <ServicesStatus
          name="Clinicord services"
          state={
            serverState == 'started'
              ? 'running'
              : serverState == 'loading'
              ? 'loading'
              : 'stopped'
          }
        />
        <ServicesStatus name="Database services" state="stopped" />
      </div>
    </div>
  );
}
