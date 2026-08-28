"use client";
import Form_layout from "../components/form_layout";
import { ArrowRight, Eye, LockKeyhole } from "lucide-react";
import { EntryZone } from "../../../shared/entry";

export default function NewPassword({ OnClick }: { OnClick: () => void }) {
  return (
    <Form_layout title="Nouveau mot de passe" icon={LockKeyhole}>
      <>
        <EntryZone
          placeholder="********"
          label="Nouveau mot de passe"
          icon={LockKeyhole}
          type="password"
          icon2={Eye}
        />
        <EntryZone
          placeholder="********"
          label="Confirmer le mot de passe"
          icon={LockKeyhole}
          type="passeword"
          icon2={Eye}
        />
        <button
          type="button"
          onClick={OnClick}
          className="btn btn-primary flex h-12 w-full items-center justify-center gap-2"
        >
          Réinitialiser le mot de passe
          <ArrowRight className="size-5" />
        </button>
      </>
    </Form_layout>
  );
}
