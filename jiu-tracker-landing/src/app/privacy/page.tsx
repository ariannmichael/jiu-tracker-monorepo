import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { PrivacyPolicyDocument } from "@/components/privacy-policy-document";

export const metadata: Metadata = {
  title: "Política de Privacidade | Jiu Tracker",
  description:
    "Saiba como o Jiu Tracker coleta, usa e protege seus dados pessoais.",
  alternates: {
    canonical: "/privacy",
  },
};

/** URL curta para App Store / links no app: https://jiu-tracker.com/privacy */
export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Política de Privacidade"
      lastUpdated="Última atualização: março de 2026"
    >
      <PrivacyPolicyDocument />
    </LegalPageShell>
  );
}
