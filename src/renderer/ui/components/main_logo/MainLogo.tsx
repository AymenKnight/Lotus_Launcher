import Logo from 'toSvg/main_logo.svg?icon';
import './style/index.scss';
interface MainLogoProps {}
export default function MainLogo({}: MainLogoProps) {
  return (
    <div className="main-logo">
      <Logo width={30} height={30} />
      <span>CLINICORD</span>
    </div>
  );
}
