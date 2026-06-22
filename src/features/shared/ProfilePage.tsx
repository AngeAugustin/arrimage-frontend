/**
 * @file    ProfilePage.tsx
 * @module  features/shared
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { IconLock, IconHistory } from '@/components/ui/icons';
import { getUserInitials, ROLE_LABELS } from '@/utils/roleLabels';
import { formatDate } from '@/utils/formatDate';
import { isApiError } from '@/types/api';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/features/shared/changePasswordSchema';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

export function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.me,
    enabled: !!user,
  });

  const profileUser = profile?.user ?? user;

  useEffect(() => {
    if (profile) {
      setUser(profile.user, profile.isFirstConnexion);
    }
  }, [profile, setUser]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError(null);
    setSuccess(false);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
      setSuccess(true);
      reset();
      if (profileUser) {
        setUser(profileUser, false);
      }
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const apiData = axiosErr.response?.data;
      if (apiData && isApiError(apiData)) {
        setServerError(apiData.error.message);
      } else {
        setServerError('Une erreur inattendue est survenue.');
      }
    }
  };

  if (!profileUser) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const initials = getUserInitials(profileUser.prenom, profileUser.nom);

  return (
    <div>
      <PageHeader title="Mon Profil" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card padding="lg" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cnss-navy text-2xl font-bold text-white">
              {initials}
            </div>
            <h2 className="mt-4 text-lg font-bold text-cnss-blue">
              {profileUser.prenom} {profileUser.nom.toUpperCase()}
            </h2>
            <div className="mt-2">
              <Badge variant="success">{ROLE_LABELS[profileUser.role]}</Badge>
            </div>
          </div>

          <hr className="my-6 border-cnss-border" />

          <dl className="space-y-4">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                Dernière connexion
              </dt>
              <dd className="mt-1 text-sm font-medium text-cnss-navy">
                {profileUser.dtLastLogin ? formatDate(profileUser.dtLastLogin) : '—'}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                Identifiant
              </dt>
              <dd className="mt-1 text-sm font-medium text-cnss-navy">{profileUser.username}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
                Statut Compte
              </dt>
              <dd className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${profileUser.isActive ? 'bg-cnss-success' : 'bg-cnss-error'}`}
                />
                <span className="text-sm font-medium text-cnss-navy">
                  {profileUser.isActive ? 'Actif' : 'Inactif'}
                </span>
              </dd>
            </div>
          </dl>
        </Card>

        <Card padding="lg" className="lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cnss-border bg-cnss-input-bg text-cnss-blue">
              <IconLock className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-cnss-blue">Sécurité</h2>
          </div>

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5">
            <PasswordInput
              label="Mot de passe actuel"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <PasswordInput
                  label="Nouveau mot de passe"
                  placeholder="Min. 8 caractères"
                  autoComplete="new-password"
                  error={errors.newPassword?.message}
                  {...register('newPassword')}
                />
                <PasswordStrengthIndicator password={newPassword} />
              </div>
              <PasswordInput
                label="Confirmer le nouveau mot de passe"
                placeholder="Confirmez"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            {serverError && <Alert>{serverError}</Alert>}
            {success && (
              <Alert variant="success">Mot de passe mis à jour avec succès.</Alert>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4 pt-2">
              <p className="max-w-md text-xs text-cnss-text-muted">
                Votre mot de passe doit contenir des majuscules, des chiffres et des caractères
                spéciaux pour une sécurité optimale.
              </p>
              <Button
                type="submit"
                variant="secondary"
                isLoading={isSubmitting}
                className="rounded-lg px-5 !font-semibold"
              >
                <IconHistory className="h-5 w-5 shrink-0" />
                Mettre à jour
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
