import { Metadata } from 'next';
import HealthDashboard from '@/components/admin/HealthDashboard';

export const metadata: Metadata = {
  title: 'System Health - ArtistryHub Admin',
  description: 'Monitor system health, services, and performance metrics',
};

export default function HealthPage() {
  return <HealthDashboard />;
}
