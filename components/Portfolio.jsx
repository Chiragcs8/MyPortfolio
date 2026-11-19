'use client';
import { useEffect, useState } from 'react';
import { createSwarm } from '../lib/swarm';
import { profile, projects, jobs, skills, education } from '../lib/data';
import Icon from './Icon';
import ThemeToggle from './ThemeToggle';

const FILTERS = [['all', 'All'], ['fullstack', 'Full-stack'], ['frontend', 'Frontend'], ['web3', 'Web3']];

export default function Portfolio() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const swarm = createSwarm();
    return () => swarm.destroy();
  }, []);

  const visibleCount = projects.filter((project) => filter === 'all' || project.cat === filter).length;

  return (
    <>
      <a className="skip" href="#work">Skip to projects</a>
      <header className="site">
        <div className="wrap nav">
          <a className="brand" href="#top" data-b>{profile.name}</a>
          <nav aria-label="Primary">
            <a href="#work" data-b>Work</a>
            <a href="#experience" data-b>Experience</a>
            <a href="#about" data-b>About</a>
            <a href="#contact" className="navcta" data-b>Get in touch <Icon name="arrow-up-right" /></a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main id="top">
        <div className="wrap">
          <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-copy">
              <h1 id="hero-heading">I’m {profile.name}. I build for the web.</h1>
              <div className="hero-meta" data-b><span>{profile.role}</span><span>{profile.location}</span></div>
              <p className="lead">{profile.intro} You can also find me online as {profile.handle}.</p>
              <div className="cta-row">
                <a className="btn primary" href="#work" data-b>See my work <Icon name="arrow-down" /></a>
                <a className="btn secondary" href={'mailto:' + profile.email} data-b>Email me <Icon name="mail" /></a>
              </div>
              <div className="chips" aria-label="Primary technologies" data-b>
                {['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL'].map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
            <aside className="hero-art" aria-label="Developer profile" data-b>
              <div className="workspace-body">
                <div className="profile-heading" data-build-part><strong data-type>{profile.name}</strong><p data-type>{profile.role}</p></div>
                <dl className="facts" data-build-part>
                  <div className="row"><dt>Looking for</dt><dd data-type>Full stack roles</dd></div>
                  <div className="row"><dt>Now</dt><dd data-type>JadeQuest, full-time</dd></div>
                  <div className="row"><dt>Experience</dt><dd data-type>Since May 2026 + 2 internships</dd></div>
                  <div className="row"><dt>Education</dt><dd data-type>BE in IT, completed</dd></div>
                </dl>
              </div>
              <a className="workspace-footer" data-build-part href={profile.github} target="_blank" rel="noopener noreferrer"><Icon name="code" />Code on GitHub<Icon name="arrow-up-right" /></a>
            </aside>
          </section>

          <section className="s" id="work" aria-labelledby="work-heading">
            <div className="head">
              <h2 id="work-heading" data-b data-type>Selected projects.</h2>
              <p data-b data-type>Full stack apps, browser tools, and Web3 experiments. Explore the code or try a live demo.</p>
            </div>
            <div className="work-tools" data-b>
              <div className="filters" role="group" aria-label="Filter projects">
                {FILTERS.map(([k, label]) => (
                  <button key={k} type="button" data-category={k} aria-pressed={filter === k} aria-controls="projects-grid" onClick={() => setFilter(k)}>{label}</button>
                ))}
              </div>
              <p className="filter-count" aria-live="polite" aria-atomic="true">{visibleCount} projects</p>
            </div>
            <div className="grid" id="projects-grid">
              {projects.map((p) => (
                <article key={p.repo} className="project" data-category={p.cat} data-b hidden={filter !== 'all' && p.cat !== filter}>
                  <div className="project-top" data-build-part><span data-type>{p.label}</span><Icon name="code" /></div>
                  <div className="project-copy" data-build-part><h3 data-type>{p.title}</h3><p data-type>{p.desc}</p></div>
                  <div className="project-footer" data-build-part>
                    <ul className="tags" aria-label="Technologies">{p.tech.map((t) => <li key={t} data-type>{t}</li>)}</ul>
                    <div className="plinks">
                      <a data-type href={'https://github.com/Chiragcs8/' + p.repo} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} code on GitHub`}>View code <Icon name="arrow-up-right" /></a>
                      {p.demo && <a data-type href={p.demo} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.title} demo`}>Open demo <Icon name="arrow-up-right" /></a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="s" id="experience" aria-labelledby="experience-heading">
            <div className="head">
              <h2 id="experience-heading" data-b data-type>Experience.</h2>
            </div>
            <div className="jobs">
              {jobs.map((j) => (
                <article className="job" key={j.company} data-b>
                  <div className="d" data-build-part data-type>{j.date}</div>
                  <div data-build-part>
                    <h3 data-type>{j.company}</h3>
                    <div className="t" data-type>{j.title}</div>
                    <p className="meta" data-type>{j.meta}</p>
                    <ul>{j.bullets.map((b) => <li key={b} data-type>{b}</li>)}</ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="s" id="about" aria-labelledby="about-heading">
            <div className="head">
              <h2 id="about-heading" data-b data-type>Toolkit & background.</h2>
              <p data-b data-type>I work across interfaces, APIs, databases, and access control, with blockchain integrations in my past work. I hold a BE and a Diploma in Information Technology.</p>
            </div>
            <div className="sk">
              {skills.map((s) => (
                <div key={s.title} className="skill-group" data-b>
                  <h3 data-type>{s.title}</h3>
                  <ul>{s.items.map((i) => <li key={i} data-type>{i}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="edu">
              {education.map((e) => (
                <article key={e.kind} data-b>
                  <h3 data-type>{e.title}</h3>
                  <p className="qualification" data-type>{e.kind}</p>
                  <p data-type>{e.school}</p>
                  <p className="meta" data-type>{e.dates}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="contact" id="contact" aria-labelledby="contact-heading" data-b>
            <div>
              <h2 id="contact-heading" data-build-part data-type>Have a role<br />in mind?</h2>
              <p data-build-part data-type>Send me a note about your team and what you’re building. I’m open to full stack and web developer roles.</p>
            </div>
            <div className="contact-links" data-build-part>
              <a className="l" data-type href={'mailto:' + profile.email}>{profile.email}<Icon name="arrow-up-right" /></a>
              <a className="l" data-type href={profile.phoneHref}>{profile.phone}<Icon name="arrow-up-right" /></a>
              <a className="l" data-type href={profile.github} target="_blank" rel="noopener noreferrer">GitHub / Chiragcs8<Icon name="arrow-up-right" /></a>
              <a className="l" data-type href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn / chiragcs98<Icon name="arrow-up-right" /></a>
              <p className="loc" data-type>{profile.location}</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="site">
        <div className="wrap">
          <div className="footer-note"><span>© 2026 {profile.name}</span><span>Full stack development</span></div>
          <div className="crew-dock" data-cursor-dock data-b aria-hidden="true">
            <span className="crew-label">Build complete</span>
            <div className="crew-slots">{Array.from({ length: 8 }, (_, index) => <span className="crew-slot" data-cursor-slot key={index} />)}</div>
          </div>
          <a href="#top">Back to top <Icon name="arrow-up" /></a>
        </div>
      </footer>
    </>
  );
}
