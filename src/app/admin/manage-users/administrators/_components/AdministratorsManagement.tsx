"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cancelAdministratorInvitation, getAdminManagementData, inviteAdministrator, removeAdministratorAccess } from "@/lib/admin-invitations";
import { inviteAdministratorSchema } from "@/lib/schemas/admin-invitation.schema";

type ManagementData = Extract<Awaited<ReturnType<typeof getAdminManagementData>>, { success: true }>['data'];
type InviteFormInput = z.input<typeof inviteAdministratorSchema>;

/** Charge les comptes et invitations, valide les actions et présente les états métier de l'administration. */
export default function AdministratorsManagement() {
  const [data, setData] = useState<ManagementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingAction, setPendingAction] = useState("");
  const [removing, setRemoving] = useState<ManagementData["administrators"][number] | null>(null);
  const form = useForm<InviteFormInput>({ resolver: zodResolver(inviteAdministratorSchema), mode: "onChange", defaultValues: { email: "" } });

  /** Recharge les données via l'action serveur autorisée, et garde un état réessayable si l'accès échoue. */
  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const result = await getAdminManagementData();
    if (!result.success) {
      setData(null);
      setLoadError(result.message);
    } else {
      setData(result.data);
    }
    setLoading(false);
  }, []);

  /** Charge la première vue dès que le composant de gestion est affiché. */
  useEffect(() => { void Promise.resolve().then(loadData); }, [loadData]);

  /** Crée une invitation après validation client puis vérification serveur, et actualise la liste après succès. */
  const submitInvitation = async (values: InviteFormInput) => {
    setPendingAction("invite");
    const result = await inviteAdministrator(values);
    if (result.success) {
      toast.success(result.message);
      form.reset();
      await loadData();
    } else {
      toast.error(result.message);
    }
    setPendingAction("");
  };

  /** Annule l'invitation sélectionnée et actualise la liste sans révéler de jeton. */
  const cancelInvitation = async (invitationId: string) => {
    setPendingAction(invitationId);
    const result = await cancelAdministratorInvitation({ invitationId });
    if (result.success) {
      toast.success(result.message);
      await loadData();
    } else toast.error(result.message);
    setPendingAction("");
  };

  /** Retire l'accès après confirmation explicite et laisse la session du compte utilisateur intacte. */
  const confirmRemoval = async () => {
    if (!removing) return;
    setPendingAction(removing.userId);
    const result = await removeAdministratorAccess({ userId: removing.userId });
    if (result.success) {
      toast.success(result.message);
      setRemoving(null);
      await loadData();
    } else toast.error(result.message);
    setPendingAction("");
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 text-brand-ink">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">Administrateurs</h1>
        <p className="text-brand-ink-muted">Gérez les personnes qui disposent d’un accès complet au back-office.</p>
      </header>

      <section className="rounded-sm border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Inviter un administrateur</h2>
        <p className="mt-1 text-brand-ink-muted">La personne invitée devra se connecter avec cette adresse e-mail et recevra un accès complet au back-office.</p>
        <form onSubmit={form.handleSubmit(submitInvitation)} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="administrator-email">Adresse e-mail</Label>
            <Input id="administrator-email" type="email" autoComplete="email" aria-invalid={Boolean(form.formState.errors.email)} {...form.register("email")} />
            {form.formState.errors.email && <p className="text-sm text-destructive" role="alert">{form.formState.errors.email.message}</p>}
          </div>
          <Button type="submit" disabled={!form.formState.isValid || pendingAction === "invite"} className="h-11 bg-brand-green text-primary-foreground hover:bg-brand-green-dark">
            {pendingAction === "invite" ? "Envoi…" : "Envoyer l’invitation"}
          </Button>
        </form>
      </section>

      {loading ? (
        <p role="status" className="rounded-sm border border-border bg-card p-5 text-brand-ink-muted">Chargement des administrateurs et invitations…</p>
      ) : loadError ? (
        <section role="alert" className="rounded-sm border border-border bg-card p-5">
          <p className="text-brand-ink-muted">{loadError}</p>
          <Button variant="outline" className="mt-3 h-11" onClick={() => void loadData()}>Réessayer</Button>
        </section>
      ) : data ? (
        <>
          <section className="rounded-sm border border-border bg-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Accès actifs ({data.administratorCount})</h2>
            {data.administrators.length === 0 ? <p className="mt-4 text-brand-ink-muted">Aucun administrateur actif.</p> : (
              <ul className="mt-3 divide-y divide-border">
                {data.administrators.map((administrator) => {
                  const disabledReason = administrator.isCurrent ? "Votre propre accès ne peut pas être retiré ici." : data.administratorCount <= 1 ? "Le dernier administrateur ne peut pas être retiré." : "";
                  return <li key={administrator.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0"><p className="font-semibold">{administrator.name}</p><p className="break-all text-brand-ink-muted">{administrator.email}</p></div>
                    <div className="flex flex-col items-start gap-1 sm:items-end">
                      <Button type="button" variant="outline" disabled={Boolean(disabledReason) || pendingAction === administrator.userId} onClick={() => setRemoving(administrator)} className="h-11">Retirer l’accès</Button>
                      {disabledReason && <p className="max-w-xs text-sm text-brand-ink-muted">{disabledReason}</p>}
                    </div>
                  </li>;
                })}
              </ul>
            )}
          </section>

          <section className="rounded-sm border border-border bg-card p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold">Invitations en attente ({data.invitations.length})</h2>
            {data.invitations.length === 0 ? <p className="mt-4 text-brand-ink-muted">Aucune invitation en attente.</p> : (
              <ul className="mt-3 divide-y divide-border">
                {data.invitations.map((invitation) => <li key={invitation.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="break-all font-semibold">{invitation.email}</p>
                    <p className="text-brand-ink-muted">Invité par {invitation.invitedBy} · expire le {formatInvitationDate(invitation.expiresAt)}</p>
                    <span className={`inline-flex border px-2 py-1 text-sm ${invitation.status === "EXPIRED" ? "border-brand-danger/20 bg-brand-danger-bg text-destructive" : "border-brand-yellow/20 bg-brand-yellow-bg text-brand-ink"}`}>
                      {invitation.status === "EXPIRED" ? "Expirée" : "En attente"}
                    </span>
                  </div>
                  <Button type="button" variant="outline" className="h-11" disabled={pendingAction === invitation.id} onClick={() => void cancelInvitation(invitation.id)}>
                    {pendingAction === invitation.id ? "Annulation…" : "Annuler l’invitation"}
                  </Button>
                </li>)}
              </ul>
            )}
          </section>
        </>
      ) : null}

      <Dialog open={Boolean(removing)} onOpenChange={(open) => !pendingAction && !open && setRemoving(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-brand-ink">Retirer cet accès administrateur ?</DialogTitle>
            <DialogDescription>{removing?.name} ne pourra plus accéder au back-office. Son compte utilisateur et ses données seront conservés.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" className="h-11" disabled={Boolean(pendingAction)} onClick={() => setRemoving(null)}>Annuler</Button>
            <Button type="button" variant="destructive" className="h-11" disabled={Boolean(pendingAction)} onClick={() => void confirmRemoval()}>{pendingAction ? "Retrait…" : "Confirmer le retrait"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Formate l'expiration avec la locale française sans créer de style ou de date approximative. */
function formatInvitationDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
