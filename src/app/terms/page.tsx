import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — DES/NIS",
  description: "The terms that govern your use of the DES/NIS website.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 24, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the
        DES/NIS website (the &ldquo;Site&rdquo;). By using the Site, you agree to these Terms.
        If you do not agree, please do not use the Site.
      </p>

      <h2>About our services</h2>
      <p>
        The Site is operated by Veljko Cvetković PR Agencija za računarsko programiranje DESNIS
        Niš (&ldquo;DES/NIS&rdquo;), a sole proprietor registered in Serbia (matični broj
        68358779, PIB 115427960), with its registered address at Zelengorska 6, floor 2, apt.
        9, 18000 Niš, Serbia.
      </p>
      <p>
        The Site presents information about DES/NIS and lets you get in touch with us. Any
        design, development, or related services we provide are governed by a separate written
        agreement or proposal, not by these Terms. Information on the Site is for general
        purposes and may change without notice.
      </p>

      <h2>Using the Site</h2>
      <p>You agree to use the Site lawfully and not to:</p>
      <ul>
        <li>interfere with, disrupt, or attempt to gain unauthorized access to the Site or its systems;</li>
        <li>submit false, misleading, or unlawful information through our forms;</li>
        <li>use the Site to send spam or transmit malicious code; or</li>
        <li>copy, scrape, or reuse the Site&rsquo;s content except as permitted below.</li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The Site and its content — including text, design, graphics, logos, and code — are
        owned by DES/NIS or its licensors and are protected by intellectual-property laws.
        Brand names and logos shown as client work belong to their respective owners. You may
        not use any of this content without our prior written permission.
      </p>

      <h2>Information you submit</h2>
      <p>
        When you contact us through the Site, you&rsquo;re responsible for the accuracy of the
        information you provide. We handle that information as described in our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>Third-party links</h2>
      <p>
        The Site may link to third-party websites or services that we don&rsquo;t control. We
        are not responsible for their content, policies, or practices, and including a link
        does not imply endorsement.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The Site is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
        warranties of any kind, whether express or implied. We do not warrant that the Site
        will be uninterrupted, error-free, or free of harmful components, or that the
        information on it is complete or current.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, DES/NIS will not be liable for any indirect,
        incidental, special, or consequential damages, or any loss of data, revenue, or
        profits, arising from your use of (or inability to use) the Site.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Changes take effect when posted on this
        page, and we&rsquo;ll update the &ldquo;Last updated&rdquo; date above. Your continued
        use of the Site means you accept the revised Terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Serbia, without regard to its
        conflict-of-laws rules.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:veljko@desnis.com">veljko@desnis.com</a>.
      </p>
    </LegalPage>
  );
}
