/**
 * @file    LoginPage.tsx
 * @module  features/auth 
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, Lock, LogIn, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { ROLE_DASHBOARD } from '@/utils/constants';
import { isApiError } from '@/types/api';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/api';

const loginSchema = z.object({
  username: z.string().min(1, "L'identifiant est obligatoire."),
  password: z.string().min(1, 'Le mot de passe est obligatoire.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setPendingTempPassword } = useAuthStore();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await authApi.login(data.username, data.password);
      setUser(response.user, response.isFirstConnexion);

      if (response.isFirstConnexion) {
        setPendingTempPassword(data.password);
        navigate('/change-password');
        return;
      }

      const dashboard = ROLE_DASHBOARD[response.user.role] ?? '/';
      navigate(dashboard);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiErrorResponse>;
      const apiData = axiosErr.response?.data;
      if (apiData && isApiError(apiData)) {
        setServerError(apiData.error.message);
      } else {
        setServerError('Identifiant ou mot de passe incorrect.');
      }
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#061e38] bg-cover bg-center bg-no-repeat px-4 py-8"
      style={{ backgroundImage: "url('/images/login-background.png')" }}
    >
      <div className="w-full max-w-[400px]">
        <div className="rounded-xl bg-white p-8 shadow-login">
          <div className="mb-6 flex flex-col items-center pb-2 text-center">
            <img
              src="/images/cnss-logo-56586a.png"
              alt="CNSS Bénin"
              className="mb-4 h-12 w-12 object-contain"
            />
            <h1 className="text-xl font-semibold text-cnss-navy">Arrimage IFU</h1>
            <p className="mt-1 text-xs text-cnss-text-muted">
              Système de gestion des identifiants fiscaux
            </p>
          </div>

          {serverError && <Alert className="mb-6">{serverError}</Alert>}

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="flex flex-col gap-6">
            <div className="relative">
              <Input
                label="Identifiant"
                placeholder="Entrez votre identifiant"
                autoComplete="username"
                error={errors.username?.message}
                className="pl-10"
                {...register('username')}
              />
              <UserCircle
                className="pointer-events-none absolute left-3 top-[38px] h-3.5 w-3.5 text-cnss-icon"
                strokeWidth={2}
              />
            </div>

            <div className="relative">
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                className="pl-10 pr-12"
                {...register('password')}
              />
              <Lock
                className="pointer-events-none absolute left-3 top-[38px] h-3.5 w-3.5 text-cnss-icon"
                strokeWidth={2}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[38px] text-cnss-icon hover:text-cnss-text"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={2} />
                )}
              </button>
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Se connecter
              <LogIn className="h-5 w-5 shrink-0" strokeWidth={2} />
            </Button>
          </form>
        </div>

        <footer className="mt-8 space-y-1 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
            CNSS Bénin — Système confidentiel
          </p>
          <p className="text-[10px] text-white/40">
            Tous droits réservés © 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
