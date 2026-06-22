/**
 * @file    UsersPage.tsx
 * @module  features/admin
 */

import { FunnelX, KeyRound, Search, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { utilisateursApi } from '@/api/utilisateursApi';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { UserAvatar } from '@/components/ui/UserAvatar';
import {
  IconLock,
  IconPencil,
  IconUserCheck,
  IconUserSlash,
} from '@/components/ui/icons';
import { CreateUserDrawer, type CreateUserFormValues } from '@/features/admin/CreateUserDrawer';
import { EditUserDrawer } from '@/features/admin/EditUserDrawer';
import { ResetPasswordDrawer } from '@/features/admin/ResetPasswordDrawer';
import { RoleBadge, TablePagination } from '@/features/admin/adminShared';
import { extractApiErrorMessage } from '@/utils/apiError';
import { formatCreationDate, formatRelativeLogin } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import { ROLE_LABELS } from '@/utils/roleLabels';
import type { AdminUser, UserListFilters } from '@/types/admin';
import type { UserRole } from '@/types/auth';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from '@/components/ui/DataTable';
import { Card } from '@/components/ui/Card';

const PAGE_SIZE = 5;

const DEFAULT_FILTERS: UserListFilters = { page: 1, limit: PAGE_SIZE };

const ROLE_OPTIONS: UserRole[] = ['agent1', 'agent2', 'controleur', 'admin'];

const tableActionBtn =
  'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors';

const tableActionIcon = 'h-6 w-6 shrink-0';

const SEARCH_DEBOUNCE_MS = 300;

export function UsersPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserListFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null);
  const [toggleError, setToggleError] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [resetPassword, setResetPassword] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['utilisateurs', filters],
    queryFn: () => utilisateursApi.getList(filters),
  });

  const pageUsers = data?.items ?? [];
  const activeCount = data?.activeCount ?? 0;
  const page = filters.page ?? 1;
  const hasActiveFilters = Boolean(filters.search || filters.role || filters.status);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const search = searchInput.trim() || undefined;
      setFilters((current) =>
        current.search === search ? current : { ...current, search, page: 1 },
      );
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const resetFilters = () => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  };

  const createMutation = useMutation({
    mutationFn: utilisateursApi.create,
    onSuccess: (result) => {
      setCreatedPassword(result.temporaryPassword);
      setCreateError(null);
      void queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
    onError: (err) => setCreateError(extractApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { nom: string; prenom: string; role: UserRole };
    }) => utilisateursApi.update(id, payload),
    onSuccess: () => {
      setEditingUser(null);
      setEditOpen(false);
      setEditError(null);
      void queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
    onError: (err) => setEditError(extractApiErrorMessage(err)),
  });

  const toggleMutation = useMutation({
    mutationFn: utilisateursApi.toggleActive,
    onSuccess: () => {
      setToggleTarget(null);
      setToggleError(null);
      void queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
    onError: (err) => setToggleError(extractApiErrorMessage(err)),
  });

  const resetMutation = useMutation({
    mutationFn: utilisateursApi.resetPassword,
    onSuccess: (result) => {
      setResetPassword(result.temporaryPassword);
      setResetError(null);
      void queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
    onError: (err) => setResetError(extractApiErrorMessage(err)),
  });

  const openToggleConfirm = (user: AdminUser) => {
    setToggleError(null);
    setToggleTarget(user);
  };

  const closeToggleConfirm = () => {
    if (toggleMutation.isPending) return;
    setToggleTarget(null);
    setToggleError(null);
  };

  const confirmToggle = () => {
    if (!toggleTarget) return;
    toggleMutation.mutate(toggleTarget.id);
  };

  const openCreate = () => {
    setCreatedPassword(null);
    setCreateError(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreatedPassword(null);
    setCreateError(null);
  };

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setEditError(null);
    setEditOpen(true);
  };

  const openReset = (user: AdminUser) => {
    setResetTarget(user);
    setResetPassword(null);
    setResetError(null);
    setResetOpen(true);
  };

  const closeReset = () => {
    setResetOpen(false);
    setResetTarget(null);
    setResetPassword(null);
    setResetError(null);
  };

  const confirmReset = () => {
    if (!resetTarget) return;
    resetMutation.mutate(resetTarget.id);
  };

  const handleCreate = (values: CreateUserFormValues) => {
    if (!values.role) return;
    createMutation.mutate({
      username: values.username.trim(),
      nom: values.nom.trim(),
      prenom: values.prenom.trim(),
      role: values.role,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cnss-blue">Utilisateurs du système</h1>
          <p className="mt-1 text-sm text-cnss-text">
            Gérez les accès et les permissions des agents de l&apos;IFU.
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-3xl font-bold leading-none text-cnss-blue">
              {activeCount.toLocaleString('fr-FR')}
            </p>
            <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Utilisateurs actifs
            </p>
          </div>
          <div className="h-12 w-px shrink-0 bg-cnss-border" aria-hidden />
          <Button onClick={openCreate} className="h-11 bg-cnss-blue px-5 hover:bg-cnss-primary-dark">
            <UserPlus className="h-4 w-4" strokeWidth={2.5} />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative">
            <Input
              label="Recherche"
              placeholder="Nom, prénom ou identifiant…"
              uppercaseLabel
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
            <Search
              className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-cnss-icon"
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Rôle
            </label>
            <select
              className="h-[46px] rounded border border-cnss-border bg-cnss-input-bg px-3 text-sm"
              value={filters.role ?? ''}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  role: (e.target.value as UserRole) || undefined,
                  page: 1,
                }))
              }
            >
              <option value="">Tous les rôles</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-cnss-text-muted">
              Statut
            </label>
            <select
              className="h-[46px] rounded border border-cnss-border bg-cnss-input-bg px-3 text-sm"
              value={filters.status ?? ''}
              onChange={(e) =>
                setFilters((current) => ({
                  ...current,
                  status: (e.target.value as UserListFilters['status']) || undefined,
                  page: 1,
                }))
              }
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Désactivé</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap justify-end gap-3 border-t border-cnss-border pt-4">
            <Button variant="ghost" onClick={resetFilters}>
              <FunnelX className="h-4 w-4" strokeWidth={2} />
              Réinitialiser
            </Button>
          </div>
        )}
      </Card>

      <Card padding="none" className="overflow-hidden">
        <DataTable className="border-0 shadow-none">
          <DataTableHead>
            <tr>
              <DataTableHeaderCell>Nom complet</DataTableHeaderCell>
              <DataTableHeaderCell>Identifiant</DataTableHeaderCell>
              <DataTableHeaderCell>Rôle</DataTableHeaderCell>
              <DataTableHeaderCell>Statut</DataTableHeaderCell>
              <DataTableHeaderCell>Date création</DataTableHeaderCell>
              <DataTableHeaderCell>Dernière connexion</DataTableHeaderCell>
              <DataTableHeaderCell className="min-w-[15rem] text-right">Actions</DataTableHeaderCell>
            </tr>
          </DataTableHead>
          <DataTableBody>
            {pageUsers.length === 0 ? (
              <DataTableRow>
                <DataTableCell colSpan={7} className="py-12 text-center text-sm text-cnss-text-muted">
                  Aucun utilisateur ne correspond aux critères sélectionnés.
                </DataTableCell>
              </DataTableRow>
            ) : (
              pageUsers.map((user) => (
              <DataTableRow
                key={user.id}
                className={cn(!user.isActive && 'bg-cnss-input-bg/60 text-cnss-text-muted')}
              >
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    <UserAvatar prenom={user.prenom} nom={user.nom} size="sm" />
                    <span className="font-medium">
                      {user.prenom} {user.nom}
                    </span>
                  </div>
                </DataTableCell>
                <DataTableCell className="font-mono text-sm">{user.username}</DataTableCell>
                <DataTableCell>
                  <RoleBadge role={user.role} />
                </DataTableCell>
                <DataTableCell>
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-2 text-sm text-cnss-success">
                      <span className="h-2 w-2 rounded-full bg-cnss-success" />
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-sm text-cnss-text-muted">
                      <IconLock className="h-4 w-4" />
                      Désactivé
                    </span>
                  )}
                </DataTableCell>
                <DataTableCell>{formatCreationDate(user.dtCreation)}</DataTableCell>
                <DataTableCell>{formatRelativeLogin(user.dtLastLogin)}</DataTableCell>
                <DataTableCell className="min-w-[15rem]">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      title="Réinitialiser le mot de passe"
                      onClick={() => openReset(user)}
                      className={cn(
                        tableActionBtn,
                        'text-cnss-text-muted hover:bg-cnss-input-bg hover:text-cnss-blue',
                      )}
                    >
                      <KeyRound className={tableActionIcon} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      title={user.isActive ? 'Désactiver le compte' : 'Activer le compte'}
                      onClick={() => openToggleConfirm(user)}
                      className={cn(
                        tableActionBtn,
                        user.isActive
                          ? 'text-cnss-error hover:bg-cnss-error-bg'
                          : 'text-cnss-success hover:bg-cnss-success-bg',
                      )}
                    >
                      {user.isActive ? (
                        <IconUserSlash className={tableActionIcon} />
                      ) : (
                        <IconUserCheck className={tableActionIcon} />
                      )}
                    </button>
                    <button
                      type="button"
                      title="Modifier"
                      onClick={() => openEdit(user)}
                      className={cn(
                        tableActionBtn,
                        'text-cnss-blue hover:bg-cnss-input-bg',
                      )}
                    >
                      <IconPencil className={tableActionIcon} />
                    </button>
                  </div>
                </DataTableCell>
              </DataTableRow>
              ))
            )}
          </DataTableBody>
        </DataTable>

        <TablePagination
          page={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          label="utilisateurs"
        />
      </Card>

      <CreateUserDrawer
        open={createOpen}
        onClose={closeCreate}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        createdPassword={createdPassword}
        error={createError}
      />

      <EditUserDrawer
        open={editOpen}
        user={editingUser}
        onClose={() => {
          setEditOpen(false);
          setEditingUser(null);
          setEditError(null);
        }}
        onSubmit={(payload) => {
          if (!editingUser) return;
          updateMutation.mutate({ id: editingUser.id, payload });
        }}
        isLoading={updateMutation.isPending}
        error={editError}
      />

      <ResetPasswordDrawer
        open={resetOpen}
        user={resetTarget}
        onClose={closeReset}
        onConfirm={confirmReset}
        isLoading={resetMutation.isPending}
        temporaryPassword={resetPassword}
        error={resetError}
      />

      <Modal
        open={toggleTarget !== null}
        onClose={closeToggleConfirm}
        title={toggleTarget?.isActive ? 'Désactiver le compte' : 'Activer le compte'}
      >
        {toggleTarget && (
          <div>
            <p className="text-sm text-cnss-text">
              {toggleTarget.isActive ? (
                <>
                  Voulez-vous désactiver le compte de{' '}
                  <strong>
                    {toggleTarget.prenom} {toggleTarget.nom}
                  </strong>{' '}
                  ({toggleTarget.username}) ? L&apos;utilisateur ne pourra plus se connecter à la
                  plateforme.
                </>
              ) : (
                <>
                  Voulez-vous réactiver le compte de{' '}
                  <strong>
                    {toggleTarget.prenom} {toggleTarget.nom}
                  </strong>{' '}
                  ({toggleTarget.username}) ? L&apos;utilisateur pourra à nouveau accéder à la
                  plateforme.
                </>
              )}
            </p>

            {toggleError && <Alert className="mt-4">{toggleError}</Alert>}

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={closeToggleConfirm} disabled={toggleMutation.isPending}>
                Annuler
              </Button>
              <Button
                variant={toggleTarget.isActive ? 'danger' : 'primary'}
                onClick={confirmToggle}
                isLoading={toggleMutation.isPending}
              >
                {toggleTarget.isActive ? 'Désactiver' : 'Activer'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
