/**
 * @file    Agent2NouvelleContresaisiePage.tsx
 * @module  features/agent2
 */

import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { ContresaisieForm } from './ContresaisieForm';

export function Agent2NouvelleContresaisiePage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Nouvelle contre-saisie"
        subtitle="Saisie de contrôle des identifiants fiscaux uniques des employeurs"
        breadcrumb={[
          { label: 'Tableau de bord', to: '/agent2/dashboard' },
          'Nouvelle contre-saisie',
        ]}
      />
      <Card>
        <ContresaisieForm onSuccess={() => navigate('/agent2/dashboard')} />
      </Card>
    </div>
  );
}
