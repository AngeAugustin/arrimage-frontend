/**
 * @file    ContresaisieForm.tsx
 * @module  features/agent2
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saisieApi } from '@/api/saisieApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IfuInput } from '@/components/ui/IfuInput';
import { Alert } from '@/components/ui/Alert';
import { EmployerBar } from '@/components/ui/EmployerBar';
import { IconSearch } from '@/components/ui/icons';
import { saisieSchema, type SaisieFormData } from '@/features/agent1/schemas';
import { invalidateMesSaisies, patchMesSaisiesList } from '@/features/shared/mesSaisiesQuery';
import { showErrorToast, showSuccessToast } from '@/store/toastStore';
import { extractApiErrorMessage } from '@/utils/apiError';
import { validateIFU } from '@/utils/validateIFU';

interface ContresaisieFormProps {
  onSuccess: () => void | Promise<void>;
}

export function ContresaisieForm({ onSuccess }: ContresaisieFormProps) {
  const queryClient = useQueryClient();
  const [lookedUpEmployeur, setLookedUpEmployeur] = useState<{
    raisonSociale: string;
    numCnss: string;
  } | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

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
    mutationFn: (numCnss: string) => saisieApi.getAttente(numCnss),
    onSuccess: (data, numCnss) => {
      setLookedUpEmployeur({ raisonSociale: data.raisonSociale, numCnss });
      setLookupError(null);
    },
    onError: (err) => {
      setLookedUpEmployeur(null);
      setLookupError(extractApiErrorMessage(err));
    },
  });

  const contresaisieMutation = useMutation({
    mutationFn: ({ numCnss, ifu, ifuConfirmation }: SaisieFormData) =>
      saisieApi.contresaisie(numCnss, { ifu, ifuConfirmation }),
    onSuccess: async (updatedSaisie) => {
      setServerError(null);
      showSuccessToast('Contre-saisie enregistrée avec succès.');
      reset();
      setLookedUpEmployeur(null);
      patchMesSaisiesList(queryClient, updatedSaisie);
      invalidateMesSaisies(queryClient);
      await onSuccess();
    },
    onError: (err) => {
      const message = extractApiErrorMessage(err);
      setServerError(message);
      showErrorToast(message);
    },
  });

  const onSubmit = (data: SaisieFormData) => {
    setServerError(null);
    contresaisieMutation.mutate(data);
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
              if (serverError) setServerError(null);
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

      {serverError && <Alert>{serverError}</Alert>}

      <Button
        type="submit"
        isLoading={isSubmitting || contresaisieMutation.isPending}
        disabled={!canSubmit}
      >
        Enregistrer la contre-saisie
      </Button>
    </form>
  );
}
