import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  Globe2,
  Camera,
  MapPin,
  MessageCircle,
  Star,
} from 'lucide-react';
import { clientLinkPages, getClientLinkPage } from '@/lib/client-link-pages';
import type { ClientLinkKind } from '@/lib/client-link-pages';
import styles from './links.module.css';

type Props = { params: Promise<{ slug: string }> };

const icons = {
  instagram: Camera,
  whatsapp: MessageCircle,
  website: Globe2,
  location: MapPin,
  review: Star,
  other: ArrowUpRight,
} satisfies Record<ClientLinkKind, typeof Camera>;

const brandIconSrc: Partial<Record<ClientLinkKind, string>> = {
  instagram: '/images/brand-icons/instagram.svg',
  whatsapp: '/images/brand-icons/whatsapp.svg',
  review: '/images/brand-icons/google.svg',
};

export function generateStaticParams() {
  return Object.keys(clientLinkPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const client = getClientLinkPage(slug);
  if (!client) return { title: 'Página não encontrada', robots: { index: false, follow: false } };
  return {
    title: { absolute: `${client.name} | Links & novidades` },
    description: `Encontre os canais da ${client.name}. Uma experiência digital realizada em parceria com a Vektua XYZ.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${client.name} | Todos os links`,
      description: client.intro,
      type: 'website',
    },
  };
}

export default async function ClientLinksPage({ params }: Props) {
  const { slug } = await params;
  const client = getClientLinkPage(slug);
  if (!client) notFound();

  // Keep the action hierarchy and keyboard/tab order aligned; server-side only.
  const sortedLinks = [...client.links].sort((a, b) =>
    Number(b.kind === 'whatsapp') - Number(a.kind === 'whatsapp')
  );

  const accent = client.headlineAccent;
  const accentIndex = accent ? client.headline.indexOf(accent) : -1;

  const palette = {
    '--client-blue': client.palette.blue,
    '--client-yellow': client.palette.yellow,
    '--client-white': client.palette.white,
  } as CSSProperties;

  return (
    <div className={styles.page} style={palette}>
      <a className={styles.skipLink} href="#links">Ir para os links</a>

      <main className={styles.shell}>
        <header className={styles.hero}>
          <div className={styles.logoPanel}>
            <Image
              src={client.artwork.src}
              alt={client.artwork.alt}
              width={client.artwork.width}
              height={client.artwork.height}
              className={styles.artwork}
              priority
              unoptimized
            />
          </div>

          <h1>
            {accent && accentIndex >= 0 ? (
              <>
                {client.headline.slice(0, accentIndex)}
                <span className={styles.headlineAccent}>{accent}</span>
                {client.headline.slice(accentIndex + accent.length)}
              </>
            ) : client.headline}
          </h1>
          <p className={styles.intro}>{client.intro}</p>
        </header>

        <section id="links" className={styles.linksSection} aria-labelledby="links-title">
          <div className={styles.sectionLabel}>
            <h2 id="links-title">Como podemos te ajudar?</h2>
          </div>
          <nav className={styles.linkList} aria-label={`Links da ${client.name}`}>
            {sortedLinks.map((item) => {
              const Icon = icons[item.kind];
              const brandIcon = brandIconSrc[item.kind];
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.clientLink}
                  data-kind={item.kind}
                  aria-label={`${item.label} — abre em nova aba`}
                >
                  <span className={styles.linkIcon}>
                    {brandIcon ? (
                      <Image
                        className={styles.brandIcon}
                        src={brandIcon}
                        width={26}
                        height={26}
                        alt=""
                        aria-hidden="true"
                        unoptimized
                      />
                    ) : (
                      <Icon size={25} strokeWidth={2} aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles.linkCopy}>
                    <strong>{item.label}</strong>
                    {item.description && <small>{item.description}</small>}
                  </span>
                  <ArrowUpRight className={styles.externalIcon} size={22} aria-hidden="true" />
                </a>
              );
            })}
          </nav>
        </section>

        <section className={styles.maker} aria-label="Sobre quem criou esta experiência">
          <p className={styles.makerTitle}>Uma experiência criada pela <strong>Vektua XYZ.</strong></p>
          <div className={styles.makerLinks}>
            <Link href="/contato">Quer uma experiência assim para sua marca? <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <span>{client.name} · <Link href="/" aria-label="Visitar site Vektua XYZ">vektua.xyz</Link></span>
        </footer>
      </main>
    </div>
  );
}
