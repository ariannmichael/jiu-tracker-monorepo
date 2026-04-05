import type { Metadata } from "next";
import { LegalPageShell } from "@/components/legal-page-shell";
import { TermsOfUseDocument } from "@/components/terms-of-use-document";

export const metadata: Metadata = {
  title: "Termos de Uso | Jiu Tracker",
  description:
    "Termos de uso do aplicativo Jiu Tracker, incluindo assinaturas e condições gerais.",
  alternates: {
    canonical: "/terms",
  },
};

/** EULA / termos para App Store: https://jiu-tracker.com/terms */
export default function TermsOfUsePage() {
  return (
    <LegalPageShell
      title="Termos de Uso"
      lastUpdated="Última atualização: março de 2026"
    >
      <TermsOfUseDocument />
    </LegalPageShell>
  );
}
