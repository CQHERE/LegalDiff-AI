import SamplePage from './pages/SamplePage';
import ApiConfigPage from './pages/ApiConfigPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '文档比对',
    path: '/',
    element: <SamplePage />
  },
  {
    name: 'API 配置',
    path: '/config',
    element: <ApiConfigPage />
  }
];

export default routes;