import { education, profile, skills } from './data.js';

export const site = {
  url: 'https://www.chiragcs.in',
  name: profile.handle,
  title: `${profile.handle} (Chirag Chavda) | Full Stack Developer`,
  description: 'Chiragcs is the portfolio of Chirag Chavda, a full stack developer in Ahmedabad, India. Explore React, Next.js, Node.js and Web3 projects.',
  image: '/social-card.png',
};

const personId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;

export const portfolioSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': personId,
      name: profile.name,
      alternateName: [profile.handle, 'Chiragcs8', 'chiragcs98'],
      url: `${site.url}/`,
      jobTitle: profile.role,
      sameAs: [profile.github, profile.linkedin],
      homeLocation: { '@type': 'Place', name: profile.location },
      knowsAbout: skills.flatMap((group) => group.items),
      alumniOf: education.map((item) => ({ '@type': 'EducationalOrganization', name: item.school })),
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: `${site.url}/`,
      name: site.name,
      alternateName: `${profile.name} Portfolio`,
      description: site.description,
      inLanguage: 'en-IN',
      publisher: { '@id': personId },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${site.url}/#profile`,
      url: `${site.url}/`,
      name: site.title,
      description: site.description,
      inLanguage: 'en-IN',
      mainEntity: { '@id': personId },
      isPartOf: { '@id': websiteId },
    },
  ],
};
