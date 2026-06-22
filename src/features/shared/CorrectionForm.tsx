/**
 * @file    CorrectionForm.tsx
 * @module  features/shared
 * @desc    Formulaire de correction IFU après discordance (UC05).
 * @author  CNSS–DSI
 * @since   2026-06
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saisieApi } from '@/api/saisieApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IfuInput } from '@/components/ui/IfuInput';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { ifuOnlySchema, type IfuFormData } from '@/features/agent1/schemas';
import { invalidateMesSaisies, patchMesSaisiesList } from '@/features/shared/mesSaisiesQuery';
import { showErrorToast, showSuccessToast } from '@/store/toastStore';
import { extractApiErrorMessage } from '@/utils/apiError';
import type { CorrectionContext } from '@/types/saisie';

export type CorrectionFormContext = Pick<CorrectionContext, 'numCnss' | 'raisonSociale' | 'ifuActuel'>;

interface CorrectionFormProps {
  onSuccess: () => void | Promise<void>;
  context: CorrectionFormContext;
  showSuccessToast?: boolean;
  isLoadingContext?: boolean;
}

/**
 * Permet à l'agent de corriger son IFU pour une saisie déjà identifiée.
 */
export function CorrectionForm({
  onSuccess,
  context,
  showSuccessToast: shouldShowSuccessToast = true,
  isLoadingContext = false,
}: CorrectionFormProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<IfuFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IfuFormData>({
    resolver: zodResolver(ifuOnlySchema),
    defaultValues: { ifu: '', ifuConfirmation: '' },
  });

  const ifuValue = watch('ifu') ?? '';
  const ifuConfirmValue = watch('ifuConfirmation') ?? '';

  const correctionMutation = useMutation({
    mutationFn: (data: IfuFormData) => saisieApi.correction(context.numCnss, data),
    onSuccess: async (updatedSaisie) => {
      setServerError(null);
      setConfirmOpen(false);
      setPendingData(null);
      patchMesSaisiesList(queryClient, updatedSaisie);
      invalidateMesSaisies(queryClient);
      if (shouldShowSuccessToast) {
        showSuccessToast('Correction enregistrée avec succès.');
      }
      await onSuccess();
    },
    onError: (err) => {
      const message = extractApiErrorMessage(err);
      setServerError(message);
      showErrorToast(message);
      setConfirmOpen(false);
    },
  });

  const onValidSubmit = (data: IfuFormData) => {
    setServerError(null);
    setPendingData(data);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingData) correctionMutation.mutate(pendingData);
  };

  if (isLoadingContext) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <Spinner />
        <p className="text-sm text-cnss-text-muted">Chargement des informations de correction…</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={(e) => void handleSubmit(onValidSubmit)(e)} className="flex flex-col gap-5">
        <Input label="Numéro CNSS" value={context.numCnss} readOnly className="font-mono" />
        <Input label="Raison sociale" value={context.raisonSociale} readOnly />
        <Input
          label="IFU actuel"
          value={context.ifuActuel}
          readOnly
          className="font-mono tracking-widest"
        />

        <IfuInput label="Nouvel IFU" value={ifuValue} error={errors.ifu?.message} {...register('ifu')} />
        <IfuInput
          label="Confirmation nouvel IFU"
          value={ifuConfirmValue}
          error={errors.ifuConfirmation?.message}
          {...register('ifuConfirmation')}
        />

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} disabled={correctionMutation.isPending}>
          Enregistrer la correction
        </Button>
      </form>

      <Modal
        open={confirmOpen}
        onClose={() => {
          if (!correctionMutation.isPending) {
            setConfirmOpen(false);
            setPendingData(null);
          }
        }}
        title="Confirmer la correction"
      >
        <p className="text-sm text-cnss-text">
          Voulez-vous enregistrer la correction de l&apos;IFU pour l&apos;employeur{' '}
          <span className="font-semibold">{context.raisonSociale}</span> (N°{' '}
          <span className="font-mono">{context.numCnss}</span>) ?
        </p>
        {pendingData && (
          <p className="mt-3 font-mono text-sm tracking-widest text-cnss-blue">
            Nouvel IFU : {pendingData.ifu}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={correctionMutation.isPending}
            onClick={() => {
              setConfirmOpen(false);
              setPendingData(null);
            }}
          >
            Annuler
          </Button>
          <Button type="button" isLoading={correctionMutation.isPending} onClick={handleConfirm}>
            Confirmer l&apos;enregistrement
          </Button>
        </div>
      </Modal>
    </>
  );
}
