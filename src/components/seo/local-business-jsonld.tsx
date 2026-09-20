const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rodlab-studio-pwa.vercel.app").replace(/\/$/, "");

export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "RodLab Studio",
    description:
      "Agence digitale à Lomé, Togo : création de sites web, applications mobiles, identité visuelle, community management et formation en ligne.",
    url: SITE_URL,
    image: `${SITE_URL}/icons/logo-mark.png`,
    telephone: "+22870088668",
    email: "contact@rodlabstudio.tg",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bd du Mono, Tokoin",
      addressLocality: "Lomé",
      addressCountry: "TG",
    },
    foundingDate: "2018",
    sameAs: ["https://facebook.com/rodlabstudio", "https://instagram.com/rodlabstudio"],
    areaServed: { "@type": "Country", name: "Togo" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
