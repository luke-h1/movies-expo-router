import styles from "./privacy-policy.module.css";

export default function PrivacyPolicyScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: October 12, 2025</p>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Introduction</h2>
            <p className={styles.sectionText}>
              This privacy policy describes how Expo Movies (&quot;we&quot;,
              &quot;our&quot;, or &quot;us&quot;) collects, uses, and shares
              your information when you use our application.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Information We Collect</h2>
            <p className={styles.sectionTextWithMargin}>
              We collect no information that you provide directly to us,
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
            <p className={styles.sectionTextWithMargin}>
              We use the information we collect to:
            </p>
            <ul className={styles.list}>
              <li>Process and respond to your AI queries</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Third-Party Services</h2>
            <p className={styles.sectionText}>
              We use third-party services including The Movie Database (TMDB)
              API for movie and TV show information. Please note that these
              services have their own privacy policies.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data Security</h2>
            <p className={styles.sectionText}>
              We implement appropriate security measures to protect your
              information. However, no method of transmission over the internet
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
            <p className={styles.sectionText}>
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new privacy policy on
              this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Us</h2>
            <p className={styles.sectionTextWithMargin}>
              If you have any questions about this privacy policy, please
              contact us through our GitHub repository.
            </p>
            <a
              href="https://github.com/luke-h1/movies-expo-router"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitHub Repository
            </a>
          </section>
        </main>

        <div className={styles.spacer} />
      </div>
    </div>
  );
}
