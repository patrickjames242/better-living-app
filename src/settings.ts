import { StatusBarStyle } from 'react-native';

const AppSettings = {
  useLocalHostDevServer: false,
  apiHostUrl() {
    if (this.useLocalHostDevServer) {
      return '127.0.0.1:8000';
    } else {
      return 'better-living-backend.herokuapp.com';
    }
  },
  defaultStatusBarStyle: (() => {
    const x: StatusBarStyle = 'dark-content';
    return x;
  })(),
};

export default AppSettings;
