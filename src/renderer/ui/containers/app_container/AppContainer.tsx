import MainLogo from '@components/main_logo';
import './style/index.scss';
import IpDisplay from '@components/ip_display';
import MainButton from '@components/main_button';
import ServicesStatus from '@components/services_status';
interface AppContainerProps {}
export default function AppContainer({}: AppContainerProps) {
  return (
    <div className="app-container">
      <MainLogo />
      <div className="middle-wrapper">
        <IpDisplay ipAdr="0.0.0.0" />
        <MainButton state="start" />
      </div>
      <div className="services-container">
        <ServicesStatus name="Clinicord services" state="stopped" />
        <ServicesStatus name="Clinicord services" state="stopped" />
      </div>
    </div>
  );
}
