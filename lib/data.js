export const profile = {
  name: 'Chirag Chavda',
  handle: 'Chiragcs',
  role: 'Full Stack Developer',
  location: 'Ahmedabad, Gujarat, India',
  intro: 'I build web apps with React, Next.js, and Node.js, from the interface to the APIs and database. I’m based in Ahmedabad and looking for a remote full stack role.',
  email: 'chirag56065@gmail.com',
  phone: '+91 90232 23051',
  phoneHref: 'tel:+919023223051',
  github: 'https://github.com/Chiragcs8',
  linkedin: 'https://www.linkedin.com/in/chiragcs98/',
};

export const projects = [
  { title: 'KnowledgeHive', cat: 'fullstack', label: 'Full-stack / learning platform', desc: 'A MERN learning platform with student, instructor and admin roles. Includes course creation, enrollment, content delivery, payments and role-based authentication.', tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'], repo: 'KnowledgeHive' },
  { title: 'Unnati AI', cat: 'fullstack', label: 'Full-stack / AI career tools', desc: 'An AI career-coach application with resume tools, cover-letter flows and interview practice. Uses Gemini for generated content, Clerk for sign-in and Prisma for data.', tech: ['Next.js', 'Gemini', 'Clerk', 'Prisma'], repo: 'Unnati_AI', demo: 'https://unnatiaicareercoach.vercel.app' },
  { title: 'AuthPlatform', cat: 'fullstack', label: 'Full-stack / access management', desc: 'Multi-role authentication and profile management with five role-specific dashboards, protected routes, JWT sessions and a PostgreSQL data model.', tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'], repo: 'auth-platform', demo: 'https://auth-platform-three.vercel.app' },
  { title: 'RecipeFinder', cat: 'fullstack', label: 'Full-stack / recipe discovery', desc: 'Find recipes using available ingredients, explore cooking details and save favorites. A React interface works with an Express backend and MongoDB.', tech: ['React', 'Express', 'MongoDB', 'Axios'], repo: 'RecipeFinder' },
  { title: 'ToolVault', cat: 'frontend', label: 'Frontend / browser utilities', desc: 'A browser-based collection of developer utilities, including a JSON formatter, text converters and encoding tools, built with Next.js and TypeScript.', tech: ['Next.js', 'TypeScript', 'React'], repo: 'ToolVault', demo: 'https://toolvault-free-tools.vercel.app' },
  { title: 'Desktop-style portfolio', cat: 'frontend', label: 'Frontend / interactive interface', desc: 'A desktop-inspired portfolio with draggable windows, a dock, a project explorer and terminal-style navigation. Built with React, GSAP and Zustand.', tech: ['React', 'Vite', 'GSAP', 'Zustand'], repo: 'Portfolio' },
  { title: 'Crypto ICO Marketplace', cat: 'web3', label: 'Web3 / token marketplace', desc: 'A decentralized application for creating ERC-20 tokens, launching pre-sale campaigns and buying tokens. Wallet integration connects the interface to Solidity contracts, with token-logo uploads through IPFS.', tech: ['Next.js', 'Solidity', 'Ethers.js', 'Web3Modal', 'IPFS'], repo: 'Crypto_ICO_Marketplace', demo: 'https://crypto-ico-marketplace-cs.vercel.app' },
  { title: 'Crypto Wallet Extension', cat: 'web3', label: 'Web3 / browser extension', desc: 'A React browser-extension interface for creating and recovering wallets, viewing balances and connecting to blockchain services through a Node.js backend.', tech: ['React', 'Node.js', 'Express', 'Moralis'], repo: 'Crypto_Wallet_Extension' },
  { title: 'Ethereum Gas Tracker', cat: 'web3', label: 'Web3 / real-time data', desc: 'An Ethereum gas-price dashboard with a React frontend, a Node.js backend and WebSocket-based live updates.', tech: ['React', 'Vite', 'Node.js', 'WebSockets'], repo: 'Ethereum-Gas-Tracker' },
];

export const jobs = [
  { date: 'May 2026 - present', company: 'JadeQuest', title: 'Full-stack and blockchain developer', meta: 'Full-time · Onsite · Ahmedabad', bullets: [
    'Contributed responsive interfaces and business modules to a B2B/B2C wholesale marketplace.',
    'Developed a multi-tenant supply-chain platform with dynamic workflows and blockchain-based provenance tracking.',
    'Built a government portal integrating React with Hyperledger Fabric across three departmental modules.',
    'Developed Student ERP, ESS and HRMS applications with React and Next.js.'] },
  { date: 'January - April 2026', company: 'Kalpit Evolution', title: 'Full Stack Developer intern', meta: 'Internship · Hybrid · Ahmedabad', bullets: [
    'Worked on web and decentralized applications as a full-stack and blockchain development intern.',
    'Developed core logistics-platform modules, including API validation, integrations and user workflows.',
    'Contributed to a document-integrity system for digital-file verification and tamper detection using cryptographic validation.',
    'Prepared a multi-device account-access solution with controlled authorization workflows.'] },
  { date: 'June - July 2025', company: 'CreArt Solutions', title: 'MERN Stack Developer intern', meta: 'Internship · Onsite · Ahmedabad', bullets: [
    'Built MERN applications with responsive React interfaces, Node.js/Express APIs and JWT authentication.',
    'Developed and tested RESTful CRUD APIs using MongoDB, Postman and Git/GitHub.',
    'Worked on deployments and frontend-backend integration under delivery timelines.'] },
];

export const skills = [
  { title: 'Interfaces', items: ['JavaScript, TypeScript', 'React, Next.js', 'Tailwind CSS, Bootstrap', 'Responsive design'] },
  { title: 'APIs and data', items: ['Node.js, Express', 'REST APIs, WebSockets', 'MongoDB, PostgreSQL', 'Mongoose, JWT, RBAC'] },
  { title: 'Web3 (past work)', items: ['Solidity, ERC-20', 'Ethers.js, Web3.js', 'Web3Modal, IPFS', 'Hyperledger Fabric'] },
  { title: 'Workflow', items: ['Git, GitHub, Postman', 'VS Code, Vercel', 'Render, Railway, Neon', 'API testing'] },
];

export const education = [
  { kind: 'Completed / Bachelor of Engineering', title: 'Information Technology', school: 'SAL College of Engineering', dates: 'August 2023 - June 2026 · CGPA 7.8' },
  { kind: 'Completed / Diploma', title: 'Information Technology', school: 'Government Polytechnic Ahmedabad', dates: 'September 2020 - July 2023 · CGPA 7.83' },
];
