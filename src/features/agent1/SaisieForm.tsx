/**
 * @file    SaisieForm.tsx
 * @module  features/agent1
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeurApi } from '@/api/employeurApi';
import { saisieApi } from '@/api/saisieApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IfuInput } from '@/components/ui/IfuInput';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { EmployerBar } from '@/components/ui/EmployerBar';
import { IconSearch } from '@/components/ui/icons';
import { CorrectionForm, type CorrectionFormContext } from '@/features/shared/CorrectionForm';
import { invalidateMesSaisies, patchMesSaisiesList } from '@/features/shared/mesSaisiesQuery';
import { showErrorToast, showSuccessToast } from '@/store/toastStore';
import { extractApiErrorCode, extractApiErrorMessage } from '@/utils/apiError';
import { validateIFU } from '@/utils/validateIFU';
import { saisieSchema, type SaisieFormData } from './schemas';
import type { Saisie } from '@/types/saisie';

interface SaisieFormProps {
  onSuccess: (saisie: Saisie) => void | Promise<void>;
  onCorrectionSuccess?: () => void | Promise<void>;
}

export function SaisieForm({ onSuccess, onCorrectionSuccess }: SaisieFormProps) {
  const queryClient = useQueryClient();
  const [lookedUpEmployeur, setLookedUpEmployeur] = useState<{
    raisonSociale: string;
    numCnss: string;
  } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverErrorCode, setServerErrorCode] = useState<string | null>(null);
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [correctionContext, setCorrectionContext] = useState<CorrectionFormContext | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SaisieFormData>({
    resolver: zodResolver(saisieSchema),
    defaultValues: { numCnss: '', ifu: '', ifuConfirmation: '' },
  });

  const ifuValue = watch('ifu') ?? '';
  const ifuConfirmValue = watch('ifuConfirmation') ?? '';
  const numCnssValue = watch('numCnss') ?? '';
  const numCnssField = register('numCnss');

  const lookupMutation = useMutation({
    mutationFn: (numCnss: string) => employeurApi.getByNumCnss(numCnss),
    onSuccess: (data, numCnss) => {
      setLookedUpEmployeur({ raisonSociale: data.raisonSociale, numCnss });
      setLookupError(null);
    },
    onError: (err) => {
      setLookedUpEmployeur(null);
      setLookupError(extractApiErrorMessage(err));
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SaisieFormData) => saisieApi.create(data),
    onSuccess: async (saisie) => {
      setServerError(null);
      showSuccessToast('Saisie enregistrée avec succès.');
      reset();
      setLookedUpEmployeur(null);
      patchMesSaisiesList(queryClient, saisie);
      invalidateMesSaisies(queryClient);
      await onSuccess(saisie);
    },
    onError: (err) => {
      const message = extractApiErrorMessage(err);
      const code = extractApiErrorCode(err);
      setServerError(message);
      setServerErrorCode(code);
      showErrorToast(message);
    },
  });

  const correctionContextMutation = useMutation({
    mutationFn: (numCnss: string) => saisieApi.getCorrectionContext(numCnss),
    onSuccess: (context) => {
      setCorrectionContext({
        numCnss: context.numCnss,
        raisonSociale: context.raisonSociale,
        ifuActuel: context.ifuActuel,
      });
      setCorrectionModalOpen(true);
    },
    onError: (err) => {
      showErrorToast(extractApiErrorMessage(err));
      setCorrectionModalOpen(false);
      setCorrectionContext(null);
    },
  });

  const onSubmit = (data: SaisieFormData) => {
    setServerError(null);
    setServerErrorCode(null);
    createMutation.mutate(data);
  };

  const handleOpenCorrection = () => {
    if (!numCnssValue) return;
    if (lookedUpEmployeur) {
      setCorrectionContext({
        numCnss: numCnssValue,
        raisonSociale: lookedUpEmployeur.raisonSociale,
        ifuActuel: '',
      });
      setCorrectionModalOpen(true);
    }
    correctionContextMutation.mutate(numCnssValue);
  };

  const handleCorrectionSuccess = async () => {
    setCorrectionModalOpen(false);
    setCorrectionContext(null);
    setServerError(null);
    setServerErrorCode(null);
    reset();
    setLookedUpEmployeur(null);
    showSuccessToast('Correction enregistrée avec succès.');
    await onCorrectionSuccess?.();
  };

  const handleLookup = () => {
    if (numCnssValue) lookupMutation.mutate(numCnssValue);
  };

  const canSubmit =
    !!lookedUpEmployeur &&
    numCnssValue === lookedUpEmployeur.numCnss &&
    validateIFU(ifuValue) &&
    validateIFU(ifuConfirmValue) &&
    ifuValue === ifuConfirmValue;

  return (
    <>
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-6">
      {lookedUpEmployeur && (
        <EmployerBar
          raisonSociale={lookedUpEmployeur.raisonSociale}
          numCnss={lookedUpEmployeur.numCnss}
        />
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Numéro CNSS"
            placeholder="N° CNSS..."
            error={errors.numCnss?.message}
            {...numCnssField}
            onChange={(e) => {
              numCnssField.onChange(e);
              if (lookedUpEmployeur && e.target.value !== lookedUpEmployeur.numCnss) {
                setLookedUpEmployeur(null);
                setLookupError(null);
              }
              if (serverError) {
                setServerError(null);
                setServerErrorCode(null);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLookup();
              }
              if (e.key === 'Tab' && !e.shiftKey && numCnssValue) {
                handleLookup();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          isLoading={lookupMutation.isPending}
          disabled={!numCnssValue}
          onClick={handleLookup}
        >
          <IconSearch className="h-4 w-4" />
          Rechercher
        </Button>
      </div>

      {lookupError && <Alert>{lookupError}</Alert>}

      <IfuInput
        label="IFU"
        value={ifuValue}
        error={errors.ifu?.message}
        {...register('ifu')}
      />
      <IfuInput
        label="Confirmation IFU"
        value={ifuConfirmValue}
        error={errors.ifuConfirmation?.message}
        {...register('ifuConfirmation')}
      />

      {serverError && (
        <Alert>
          <div className="flex w-full flex-wrap items-center gap-3">
            <span className="flex-1">{serverError}</span>
            {serverErrorCode === 'DUPLICATE_CNSS' && (
              <Button
                type="button"
                variant="secondary"
                className="ml-auto h-8 shrink-0 px-3 text-xs"
                isLoading={correctionContextMutation.isPending}
                onClick={handleOpenCorrection}
              >
                Modifier
              </Button>
            )}
          </div>
        </Alert>
      )}

        <Button type="submit" isLoading={isSubmitting || createMutation.isPending} disabled={!canSubmit}>
          Enregistrer la saisie
        </Button>
      </form>

      <Modal
        open={correctionModalOpen}
        onClose={() => {
          setCorrectionModalOpen(false);
          setCorrectionContext(null);
        }}
        title="Correction IFU"
      >
        {correctionContext && (
          <CorrectionForm
            key={correctionContext.numCnss}
            context={correctionContext}
            onSuccess={handleCorrectionSuccess}
            showSuccessToast={false}
            isLoadingContext={correctionContextMutation.isPending && !correctionContext.ifuActuel}
          />
        )}
      </Modal>
    </>
  );
}
