/**
 * @file    ChangePasswordPage.tsx
 * @module  features/auth
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { getPendingTempPassword, useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { PasswordRequirementsChecklist } from '@/components/ui/PasswordRequirementsChecklist';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { IconAlert } from '@/components/ui/icons';
import { ROLE_DASHBOARD } from '@/utils/constants';
import { isApiError } from '@/types/api';
import {
  firstConnexionPasswordSchema,
  type FirstConnexionPasswordFormData,
} from '@/features/shared/changePasswordSchema';
import type { AuthUser } from '@/types/auth';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

interface ChangePasswordFormProps {
  user: AuthUser;
  pendingTempPassword: string;
}

function ChangePasswordForm({ user, pendingTempPassword }: ChangePasswordFormProps) {
  const navigate = useNavigate();
  const { setUser, logout, clearPendingTempPassword } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FirstConnexionPasswordFormData>({
    resolver: zodResolver(firstConnexionPasswordSchema),
  });

  const newPassword = watch('newPassword', '');

  const onSubmit = async (data: FirstConnexionPasswordFormData) => {
    setServerError(null);
    try {
      await authApi.changePassword(
        pendingTempPassword,
        data.newPassword,
        data.confirmPassword,
      );
      setSuccess(true);
      setUser(user, false);
      clearPendingTempPassword();
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

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cnss-bg">
      <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
        <IconAlert className="h-4 w-4 shrink-0 text-amber-600" />
        <span>
          Première connexion — vous devez définir votre mot de passe avant de continuer.
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 py-10">
        <div className="w-full max-w-[440px] rounded-xl border border-cnss-border bg-white p-8 shadow-login">
          <div className="mb-8 flex flex-col items-center text-center">
            <img
              src="/images/cnss-logo-56586a.png"
              alt="CNSS Bénin"
              className="mb-4 h-14 w-14 object-contain"
            />
            <h1 className="text-xl font-bold text-cnss-blue">Définir mon mot de passe</h1>
            <p className="mt-2 text-sm text-cnss-text-muted">
              Votre mot de passe temporaire doit être remplacé.
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-5">
            <div>
              <PasswordInput
                label="Nouveau mot de passe"
                placeholder="Min. 12 caractères"
                autoComplete="new-password"
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <PasswordStrengthIndicator password={newPassword} variant="labeled" />
            </div>

            <PasswordInput
              label="Confirmer le nouveau mot de passe"
              placeholder="Confirmez"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <PasswordRequirementsChecklist password={newPassword} />

            {serverError && <Alert>{serverError}</Alert>}
            {success && (
              <Alert variant="success">Mot de passe enregistré avec succès. Redirection…</Alert>
            )}

            <Button type="submit" isLoading={isSubmitting} className="h-12 w-full">
              Enregistrer mon mot de passe
            </Button>

            <p className="text-center">
              <button
                type="button"
                onClick={() => void handleCancel()}
                disabled={isCancelling || isSubmitting}
                className="text-sm text-cnss-text transition-colors hover:text-cnss-blue hover:underline disabled:opacity-60"
              >
                Annuler et se déconnecter
              </button>
            </p>
          </form>
        </div>

        <footer className="mt-8 max-w-[440px] text-center">
          <p className="text-[11px] text-cnss-footer">
            © 2024 Arrimage IFU — Caisse Nationale de Sécurité Sociale du Bénin. Tous droits
            réservés.
          </p>
        </footer>
      </div>
    </div>
  );
}

export function ChangePasswordPage() {
  const { user, isAuthenticated, isFirstConnexion, isLoading } = useAuthStore();
  const pendingTempPassword = getPendingTempPassword();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cnss-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isFirstConnexion) {
    return <Navigate to={ROLE_DASHBOARD[user.role] ?? '/'} replace />;
  }

  if (!pendingTempPassword) {
    return <Navigate to="/login" replace />;
  }

  return <ChangePasswordForm user={user} pendingTempPassword={pendingTempPassword} />;
}
