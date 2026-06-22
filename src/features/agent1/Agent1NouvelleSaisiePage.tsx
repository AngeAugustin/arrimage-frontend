/**
 * @file    Agent1NouvelleSaisiePage.tsx
 * @module  features/agent1
 */

import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { SaisieForm } from './SaisieForm';

export function Agent1NouvelleSaisiePage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Nouvelle saisie IFU"
        subtitle="Saisie initiale des identifiants fiscaux uniques des employeurs"
        breadcrumb={[
          { label: 'Tableau de bord', to: '/agent1/dashboard' },
          'Nouvelle saisie',
        ]}
      />
      <Card>
        <SaisieForm
          onSuccess={() => navigate('/agent1/dashboard')}
          onCorrectionSuccess={() => navigate('/agent1/dashboard')}
        />
      </Card>
    </div>
  );
}
