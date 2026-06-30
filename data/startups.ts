export interface Startup {
  id: string;
  name: string;
  logo: string;
  sector: string;
  description: string;
  longDescription: string;
  founded: number;
  funding: string;
  fundingNum: number;
  stage: string;
  employees: string;
  employeesNum: number;
  website: string;
  tags: string[];
  investors: string[];
  isUnicorn?: boolean;
  isSoonicorn?: boolean;
  // Verification fields
  verified?: boolean;
  verificationLevel?: 'basic' | 'medium' | 'high';
  source?: 'admin' | 'user_submission';
  linkedin?: string;
  founder?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyId: string;
  startupId?: string; // links to startups collection
  location: string;
  type: string;
  experience: string;
  category: string;
  description: string;
  salary?: string;
  skills?: string[];
  applyType?: 'redirect' | 'internal';
  applyLink?: string | null;
  companyEmail?: string | null;
  source?: 'manual' | 'scraped';
}

export interface CityStats {
  label: string;
  value: string;
  subtext: string;
  icon: string;
}

export interface Neighbourhood {
  id: string;
  name: string;
  personality: string;
  bestFor: string;
  rent1BHK: string;
  rent2BHK: string;
  insiderTip: string;
  vibe: string;
}

export interface Brewery {
  name: string;
  area: string;
  signature: string;
  mustKnow: string;
}

export interface Restaurant {
  name: string;
  area: string;
  cuisine: string;
  rating: string;
  notes: string;
}

export const cityStats: CityStats[] = [
  { label: 'Metro Population', value: '11.6M', subtext: '2.39% annual growth', icon: '🏙️' },
  { label: 'GSDP', value: '₹17.82L Cr', subtext: '10.7% growth rate', icon: '📈' },
  { label: 'IT Exports', value: '₹3.13L Cr', subtext: '16.6% YoY growth', icon: '💻' },
  { label: 'IT Jobs', value: '9.33L+', subtext: '932,000+ direct', icon: '👩‍💻' },
  { label: 'GCCs', value: '355+', subtext: '20% of India total', icon: '🏢' },
  { label: 'Total Startups', value: '9,000+', subtext: '#4 in India', icon: '🚀' },
  { label: 'Unicorns', value: '3', subtext: 'Darwinbox, Zenoti, HighRadius', icon: '🦄' },
  { label: 'Avg SW Salary', value: '₹32.9 LPA', subtext: 'Median total comp', icon: '💰' },
  { label: 'Liveability', value: '#1 India', subtext: 'WeAreCity 2026', icon: '🏆' },
  { label: 'QoL Index', value: '176.63', subtext: 'Very High (Numbeo)', icon: '⭐' },
  { label: 'Airport Growth', value: '31M PAX', subtext: '11% YoY at RGIA', icon: '✈️' },
  { label: 'Metro Network', value: '69 km', subtext: '57 stations + Pink Line', icon: '🚇' },
];

export const startups: Startup[] = [
  {
    id: 'darwinbox',
    name: 'Darwinbox',
    logo: '🧬',
    sector: 'HRTech',
    description: 'End-to-end HRTech SaaS platform for enterprises. Processing 500M+ data points with Agentic AI.',
    longDescription: 'Darwinbox is a new-gen enterprise HRTech platform built for large enterprises. It covers the entire employee lifecycle — from hire to retire — including recruiting, core HR, payroll, talent management, and analytics. Their Agentic AI platform processes 500M+ data points. In 2025, they raised ~$180M (KKR, Partners Group, OTPP), totalling $307M+. Backed by Microsoft, Peak XV, Lightspeed, Salesforce.',
    founded: 2015,
    funding: '$307M+',
    fundingNum: 2500,
    stage: 'Unicorn',
    employees: '1,000+',
    employeesNum: 1200,
    website: 'https://darwinbox.com',
    tags: ['HRTech', 'SaaS', 'Enterprise', 'AI', 'Unicorn'],
    investors: ['KKR', 'Partners Group', 'Microsoft', 'Peak XV', 'Lightspeed', 'Salesforce'],
    isUnicorn: true,
  },
  {
    id: 'zenoti',
    name: 'Zenoti',
    logo: '💅',
    sector: 'Beauty/Wellness SaaS',
    description: 'Cloud-based SaaS for beauty, wellness, and fitness businesses globally.',
    longDescription: 'Zenoti provides an all-in-one, cloud-based software solution for beauty and wellness businesses, including spas, salons, med spas, and fitness centres. They serve 30,000+ businesses across 50+ countries. Valued at $1.5B+, backed by Advent International, Tiger Global, and Steadview Capital.',
    founded: 2010,
    funding: '$250M+',
    fundingNum: 2000,
    stage: 'Unicorn',
    employees: '1,500+',
    employeesNum: 1500,
    website: 'https://zenoti.com',
    tags: ['Beauty', 'Wellness', 'SaaS', 'Cloud', 'Unicorn'],
    investors: ['Advent International', 'Tiger Global', 'Steadview'],
    isUnicorn: true,
  },
  {
    id: 'highradius',
    name: 'HighRadius',
    logo: '💳',
    sector: 'FinTech',
    description: 'AI-powered fintech SaaS for accounts receivable and treasury management.',
    longDescription: 'HighRadius provides AI-powered Integrated Receivables and Treasury Management solutions. Their Autonomous Finance platform helps enterprises automate financial operations across order-to-cash, treasury, and payments workflows. Valued at $1B+, backed by Iconiq Capital and Tiger Global.',
    founded: 2006,
    funding: '$475M+',
    fundingNum: 3800,
    stage: 'Unicorn',
    employees: '3,000+',
    employeesNum: 3000,
    website: 'https://highradius.com',
    tags: ['FinTech', 'SaaS', 'AI', 'Enterprise', 'Unicorn'],
    investors: ['Iconiq Capital', 'Tiger Global', 'Citi'],
    isUnicorn: true,
  },
  {
    id: 'skyroot',
    name: 'Skyroot Aerospace',
    logo: '🚀',
    sector: 'SpaceTech',
    description: "India's first private space launch company. Built Vikram-S, India's first privately developed rocket.",
    longDescription: 'Founded by former ISRO scientists Pawan Kumar Chandana and Naga Bharath Daka. Skyroot launched India\'s first private rocket (Vikram-S) in November 2022. Building the Vikram series of orbital launch vehicles. In March 2026, raised ₹100 crore through NCDs from BlackRock. Valued at ~$489M.',
    founded: 2018,
    funding: '$95M+',
    fundingNum: 780,
    stage: 'Series C',
    employees: '300+',
    employeesNum: 350,
    website: 'https://skyroot.in',
    tags: ['SpaceTech', 'DeepTech', 'Aerospace', 'Rockets'],
    investors: ['Temasek', 'Graph Ventures', 'Sherpalo', 'BlackRock'],
    isSoonicorn: true,
  },
  {
    id: 'brightchamps',
    name: 'BrightChamps',
    logo: '📚',
    sector: 'EdTech',
    description: 'Global EdTech platform teaching coding, financial literacy, and robotics to kids.',
    longDescription: 'BrightChamps is a global edtech platform focused on building essential 21st-century skills in children through courses in coding, data science, financial literacy, and robotics. Valued at ~$650M with presence across 30+ countries.',
    founded: 2020,
    funding: '$63M',
    fundingNum: 510,
    stage: 'Series B',
    employees: '500+',
    employeesNum: 500,
    website: 'https://brightchamps.com',
    tags: ['EdTech', 'Coding', 'Kids', 'Global'],
    investors: ['PremjiInvest', 'GSV Ventures', 'BEENEXT'],
    isSoonicorn: true,
  },
  {
    id: 'nephroplus',
    name: 'NephroPlus',
    logo: '🏥',
    sector: 'HealthTech',
    description: "Asia's largest dialysis network with 350+ centres across 5 countries.",
    longDescription: "NephroPlus is Asia's largest network of dialysis centres, providing dialysis treatment through 350+ centres across India, Nepal, Philippines, Bangladesh, and Kenya. Focused on making quality dialysis accessible and affordable.",
    founded: 2009,
    funding: '$199M',
    fundingNum: 1600,
    stage: 'Growth',
    employees: '5,000+',
    employeesNum: 5000,
    website: 'https://nephroplus.com',
    tags: ['HealthTech', 'Dialysis', 'Healthcare', 'Medical'],
    investors: ['Bessemer', 'Abraaj', 'Investcorp'],
    isSoonicorn: true,
  },
  {
    id: 'recykal',
    name: 'Recykal',
    logo: '♻️',
    sector: 'CleanTech',
    description: 'Digital recycling marketplace and waste management platform.',
    longDescription: 'Recykal is a technology-driven waste management company that enables online buy/sell of recyclable waste, EPR compliance, and sustainability services. Their digital platform connects waste generators, aggregators, and recyclers for a circular economy.',
    founded: 2015,
    funding: '$30M',
    fundingNum: 240,
    stage: 'Series B',
    employees: '200+',
    employeesNum: 200,
    website: 'https://recykal.com',
    tags: ['CleanTech', 'Recycling', 'Sustainability', 'Circular Economy'],
    investors: ['Circulate Capital', 'Aavishkaar Capital'],
  },
  {
    id: 'credgenics',
    name: 'Credgenics',
    logo: '🤖',
    sector: 'FinTech',
    description: 'AI-powered debt resolution and collections platform for lenders.',
    longDescription: 'Credgenics provides an AI-powered SaaS platform for debt resolution and collections management. Their technology helps lenders automate and optimize the debt recovery process using machine learning and natural language processing. Valued at ~$340M.',
    founded: 2018,
    funding: '$78M',
    fundingNum: 630,
    stage: 'Series B',
    employees: '400+',
    employeesNum: 400,
    website: 'https://credgenics.com',
    tags: ['FinTech', 'AI', 'Debt Resolution', 'SaaS'],
    investors: ['Baring PE', 'Yashish Dahiya'],
  },
  {
    id: 'fourth-partner',
    name: 'Fourth Partner Energy',
    logo: '☀️',
    sector: 'CleanTech',
    description: 'Distributed solar energy solutions for commercial and industrial customers.',
    longDescription: 'Fourth Partner Energy is one of India\'s leading distributed solar energy companies, providing end-to-end solar solutions for commercial and industrial customers. They have a portfolio of 1 GW+ across rooftop and ground-mounted installations.',
    founded: 2010,
    funding: '$710M+',
    fundingNum: 5700,
    stage: 'Growth',
    employees: '500+',
    employeesNum: 500,
    website: 'https://fourthpartner.co',
    tags: ['CleanTech', 'Solar', 'Renewable Energy', 'Sustainability'],
    investors: ['IFC', 'ADB', 'DEG', 'Norfund'],
  },
  {
    id: 'jeh-aerospace',
    name: 'Jeh Aerospace',
    logo: '✈️',
    sector: 'Aerospace & Defence',
    description: 'Aerospace and defence manufacturing backed by General Catalyst.',
    longDescription: 'Jeh Aerospace specializes in precision engineering and manufacturing for the aerospace and defence industry. Backed by General Catalyst, they serve global OEMs with critical aerospace components and assemblies.',
    founded: 2019,
    funding: '$25M',
    fundingNum: 200,
    stage: 'Series A',
    employees: '150+',
    employeesNum: 150,
    website: 'https://jehaerospace.com',
    tags: ['Aerospace', 'Defence', 'Manufacturing', 'DeepTech'],
    investors: ['General Catalyst'],
  },
  {
    id: 'swipe',
    name: 'Swipe',
    logo: '📱',
    sector: 'SaaS',
    description: 'GST billing, inventory management, and payments for SMBs.',
    longDescription: 'Swipe is a smart billing and inventory management SaaS designed for small and medium businesses. The platform handles GST invoicing, inventory tracking, payment collection, and financial reporting, all optimized for mobile-first Indian SMBs.',
    founded: 2018,
    funding: '$15M',
    fundingNum: 120,
    stage: 'Series A',
    employees: '100+',
    employeesNum: 100,
    website: 'https://getswipe.in',
    tags: ['SaaS', 'SMB', 'Billing', 'FinTech'],
    investors: ['Accel', 'RTP Global'],
  },
  {
    id: 'bhanzu',
    name: 'Bhanzu',
    logo: '🧮',
    sector: 'EdTech',
    description: 'Math learning platform making mathematics fun for students globally.',
    longDescription: 'Bhanzu (formerly Exploring Infinities) is an edtech company that aims to eliminate math phobia by making mathematics fun and engaging. Founded by Neelakantha Bhanu, the world record holder for fastest human calculator, the platform provides live 1-on-1 maths classes.',
    founded: 2020,
    funding: '$17M',
    fundingNum: 140,
    stage: 'Series A',
    employees: '200+',
    employeesNum: 200,
    website: 'https://bhanzu.com',
    tags: ['EdTech', 'Math', 'Learning', 'Kids'],
    investors: ['Eight Roads', 'Matrix Partners'],
  },
  {
    id: 'liquidnitro',
    name: 'Liquidnitro Games',
    logo: '🎮',
    sector: 'Gaming',
    description: 'AAA mobile gaming studio creating next-gen gaming experiences.',
    longDescription: 'Liquidnitro Games is a Hyderabad-based game studio creating high-quality mobile and PC gaming experiences. They focus on AAA-quality mobile games with console-level graphics and gameplay mechanics.',
    founded: 2019,
    funding: '$5M',
    fundingNum: 40,
    stage: 'Seed',
    employees: '50+',
    employeesNum: 50,
    website: 'https://liquidnitro.com',
    tags: ['Gaming', 'Mobile', 'Entertainment'],
    investors: ['Y Combinator'],
  },
  {
    id: 'endiya',
    name: 'Endiya Partners',
    logo: '💎',
    sector: 'VC Fund',
    description: 'Hyderabad-based VC fund — $225M AUM focused on enterprise tech, SaaS, healthcare, and deep tech.',
    longDescription: 'Endiya Partners is a venture capital firm based in Hyderabad, focused on early-stage investments in enterprise tech, SaaS, healthcare, and deep tech. With Fund III at $125M (2024), they have $225M total AUM. Portfolio includes Darwinbox, Zluri, Qapita, SigTuple.',
    founded: 2016,
    funding: '$225M AUM',
    fundingNum: 0,
    stage: 'Fund III',
    employees: '30+',
    employeesNum: 30,
    website: 'https://endiya.com',
    tags: ['VC', 'Investment', 'Enterprise', 'DeepTech'],
    investors: [],
  },
  {
    id: 'dhruva-space',
    name: 'Dhruva Space',
    logo: '🛰️',
    sector: 'SpaceTech',
    description: 'Space-grade solar panels and satellite subsystems for the global space industry.',
    longDescription: 'Dhruva Space designs and manufactures space-grade solar panels, satellite platforms, and mission support services. They provide end-to-end satellite solutions from design to on-orbit management.',
    founded: 2012,
    funding: '$10M',
    fundingNum: 80,
    stage: 'Series A',
    employees: '80+',
    employeesNum: 80,
    website: 'https://dhruvaspace.com',
    tags: ['SpaceTech', 'Satellites', 'Aerospace', 'DeepTech'],
    investors: ['Indian Angel Network', 'IAN Fund'],
  },
  {
    id: 'marut-drones',
    name: 'Marut Drones',
    logo: '🛸',
    sector: 'AgriTech',
    description: 'Drone-based precision farming solutions for Indian agriculture.',
    longDescription: 'Marut Drones specializes in agricultural drones for precision farming. Their AI-powered drone solutions help farmers with crop spraying, monitoring, and analytics, improving yield while reducing costs and chemical usage. AI4TG Grand Challenge finalist.',
    founded: 2019,
    funding: '$5M',
    fundingNum: 40,
    stage: 'Seed',
    employees: '60+',
    employeesNum: 60,
    website: 'https://marutdrones.com',
    tags: ['AgriTech', 'Drones', 'AI', 'Farming'],
    investors: ['AIC-T-Hub'],
  },
  {
    id: 'coschool',
    name: 'Coschool',
    logo: '🎓',
    sector: 'EdTech',
    description: 'Collaborative education platform transforming school learning.',
    longDescription: 'Coschool is rebuilding the education technology stack for schools across India, making learning more collaborative, interactive, and data-driven for students and teachers alike.',
    founded: 2020,
    funding: '$3M',
    fundingNum: 25,
    stage: 'Pre-Series A',
    employees: '40+',
    employeesNum: 40,
    website: 'https://coschool.in',
    tags: ['EdTech', 'Schools', 'Learning'],
    investors: ['GSV Ventures'],
  },
  {
    id: 'smartron',
    name: 'Smartron',
    logo: '📟',
    sector: 'Hardware & IoT',
    description: 'Platform company building connected devices and IoT solutions.',
    longDescription: 'Smartron is a platform company building connected devices and platforms, including laptops, IoT solutions, and consumer electronics. Valued at $200-250M with partnerships across hardware and smart city implementations.',
    founded: 2014,
    funding: '$16M',
    fundingNum: 130,
    stage: 'Series A',
    employees: '100+',
    employeesNum: 100,
    website: 'https://smartron.com',
    tags: ['Hardware', 'IoT', 'Consumer Electronics', 'SmartCity'],
    investors: ['GEM Group', 'TAQNIA'],
    isSoonicorn: true,
  },
  {
    id: 'frontlines',
    name: 'Frontlines EduTech',
    logo: '🎯',
    sector: 'EdTech',
    description: 'Online platform for competitive exam preparation and career guidance.',
    longDescription: 'Frontlines EduTech provides comprehensive online education for government job exam preparation, competitive exams, and career development programmes targeted at students across India.',
    founded: 2018,
    funding: '$8M',
    fundingNum: 65,
    stage: 'Series A',
    employees: '120+',
    employeesNum: 120,
    website: 'https://frontlinesedutech.com',
    tags: ['EdTech', 'ExamPrep', 'Careers'],
    investors: ['Angel Investors'],
  },
  {
    id: 'vizen',
    name: 'Vizen Life Sciences',
    logo: '🧪',
    sector: 'LifeSciences',
    description: 'Pharmaceutical formulations and healthcare solutions company.',
    longDescription: 'Vizen Life Sciences focuses on pharmaceutical formulations and healthcare innovations, developing novel drug delivery systems and specialty medicines for the Indian and global markets.',
    founded: 2017,
    funding: '$12M',
    fundingNum: 100,
    stage: 'Series A',
    employees: '80+',
    employeesNum: 80,
    website: 'https://vizenlifesciences.com',
    tags: ['LifeSciences', 'Pharma', 'Healthcare'],
    investors: ['Private Equity'],
  },
];

export const jobs: Job[] = [
  { id: '1', title: 'Senior Frontend Engineer', company: 'Darwinbox', companyId: 'darwinbox', location: 'Hyderabad', type: 'Full-time', experience: '4-6 years', category: 'Engineering', description: 'Build next-gen HR platform frontend with React & TypeScript. Work on Agentic AI interfaces.', salary: '₹28-42 LPA' },
  { id: '2', title: 'ML Engineer', company: 'Zenoti', companyId: 'zenoti', location: 'Hyderabad', type: 'Full-time', experience: '3-5 years', category: 'Data Science', description: 'Design and deploy ML pipelines for beauty/wellness recommendation engine.', salary: '₹25-38 LPA' },
  { id: '3', title: 'Propulsion Engineer', company: 'Skyroot Aerospace', companyId: 'skyroot', location: 'Hyderabad', type: 'Full-time', experience: '5-8 years', category: 'Engineering', description: 'Design and test rocket propulsion systems for the Vikram series launch vehicles.', salary: '₹20-35 LPA' },
  { id: '4', title: 'Product Manager', company: 'HighRadius', companyId: 'highradius', location: 'Hyderabad', type: 'Full-time', experience: '4-7 years', category: 'Product', description: 'Lead product strategy for Autonomous Finance AI platform.', salary: '₹30-50 LPA' },
  { id: '5', title: 'Full Stack Developer', company: 'Swipe', companyId: 'swipe', location: 'Hyderabad', type: 'Full-time', experience: '2-4 years', category: 'Engineering', description: 'Build scalable billing and inventory management features.', salary: '₹15-25 LPA' },
  { id: '6', title: 'Data Scientist', company: 'Credgenics', companyId: 'credgenics', location: 'Hyderabad', type: 'Full-time', experience: '3-5 years', category: 'Data Science', description: 'Build ML models for debt resolution and NLP-based collection optimization.', salary: '₹22-35 LPA' },
  { id: '7', title: 'Backend Engineer (Go)', company: 'Darwinbox', companyId: 'darwinbox', location: 'Hyderabad', type: 'Full-time', experience: '3-5 years', category: 'Engineering', description: 'Build high-throughput microservices processing 500M+ data points.', salary: '₹25-40 LPA' },
  { id: '8', title: 'DevOps Engineer', company: 'Zenoti', companyId: 'zenoti', location: 'Hyderabad', type: 'Full-time', experience: '3-6 years', category: 'Engineering', description: 'Manage cloud infrastructure serving 30,000+ businesses across 50+ countries.', salary: '₹20-32 LPA' },
  { id: '9', title: 'Solar System Designer', company: 'Fourth Partner Energy', companyId: 'fourth-partner', location: 'Hyderabad', type: 'Full-time', experience: '2-4 years', category: 'Engineering', description: 'Design distributed solar energy systems for C&I customers.', salary: '₹10-18 LPA' },
  { id: '10', title: 'GNC Engineer', company: 'Skyroot Aerospace', companyId: 'skyroot', location: 'Hyderabad', type: 'Full-time', experience: '3-6 years', category: 'Engineering', description: 'Develop guidance, navigation and control algorithms for launch vehicles.', salary: '₹18-30 LPA' },
  { id: '11', title: 'Cybersecurity Analyst', company: 'HighRadius', companyId: 'highradius', location: 'Hyderabad', type: 'Full-time', experience: '3-5 years', category: 'Security', description: 'Secure financial data pipelines and ensure SOC 2 compliance.', salary: '₹18-28 LPA' },
  { id: '12', title: 'EdTech Content Lead', company: 'BrightChamps', companyId: 'brightchamps', location: 'Hyderabad', type: 'Full-time', experience: '3-5 years', category: 'Content', description: 'Create engaging coding and robotics curriculum for K-12 students globally.', salary: '₹12-20 LPA' },
  { id: '13', title: 'Drone Pilot & AI Trainer', company: 'Marut Drones', companyId: 'marut-drones', location: 'Hyderabad', type: 'Full-time', experience: '1-3 years', category: 'Operations', description: 'Operate agricultural drones and train AI crop analysis models.', salary: '₹8-15 LPA' },
  { id: '14', title: 'Game Developer (Unity)', company: 'Liquidnitro Games', companyId: 'liquidnitro', location: 'Hyderabad', type: 'Full-time', experience: '2-5 years', category: 'Engineering', description: 'Build AAA-quality mobile games with console-level graphics.', salary: '₹15-28 LPA' },
  { id: '15', title: 'Investment Analyst', company: 'Endiya Partners', companyId: 'endiya', location: 'Hyderabad', type: 'Full-time', experience: '2-4 years', category: 'Finance', description: 'Evaluate enterprise tech and deep tech startup investments.', salary: '₹18-30 LPA' },
];

export const neighbourhoods: Neighbourhood[] = [
  { id: 'hitec-city', name: 'HITEC City / Madhapur', personality: 'The Silicon Epicentre', bestFor: 'Corporate employees at MNCs; GCC workers; proximity to work above all', rent1BHK: '₹28,000–₹32,000', rent2BHK: '₹40,000–₹45,000', insiderTip: 'Durgam Cheruvu (Secret Lake) in Kavuri Hills is an underrated gem, walking distance from the main tech corridor.', vibe: '🏙️' },
  { id: 'gachibowli', name: 'Gachibowli', personality: 'The Polished Alternative', bestFor: 'IT professionals wanting more space and newer infrastructure; families', rent1BHK: '₹22,000–₹26,000', rent2BHK: '₹35,000–₹40,000', insiderTip: 'The Gachibowli Stadium area has great sports infrastructure — indoor badminton, cricket, cycling tracks.', vibe: '🌿' },
  { id: 'kondapur', name: 'Kondapur', personality: 'The Sweet Spot', bestFor: 'IT corridor proximity without full pricing; couples and young families', rent1BHK: '₹18,000–₹22,000', rent2BHK: '₹28,000–₹32,000', insiderTip: 'Third Wave Coffee Kondapur first floor is the go-to work café.', vibe: '☕' },
  { id: 'financial-district', name: 'Financial District / Kokapet', personality: 'The New Frontier', bestFor: 'Those ahead of the curve; investors; Financial District office workers', rent1BHK: '₹24,000–₹28,000', rent2BHK: '₹35,000–₹40,000', insiderTip: 'Tansen (Fine Dine Restaurant of Year 2026) and Beer Cartel are both here.', vibe: '🏗️' },
  { id: 'jubilee-hills', name: 'Jubilee Hills / Banjara Hills', personality: 'The Lifestyle Quarter', bestFor: 'Senior professionals; founders; nightlife and culture lovers', rent1BHK: '₹30,000–₹40,000', rent2BHK: '₹50,000–₹55,000', insiderTip: 'The pub crawl triangle at Broadway, Prost, and Forge on Road 45 is the best evening in the city.', vibe: '🍸' },
  { id: 'miyapur', name: 'Miyapur / Kukatpally', personality: 'Budget Zones with Metro Access', bestFor: 'Freshers, budget-conscious professionals, families', rent1BHK: '₹14,000–₹20,000', rent2BHK: '₹22,000–₹28,000', insiderTip: 'Kukatpally has Ironhill — city\'s largest microbrewery at 25,000 sq ft — a genuine surprise.', vibe: '🚇' },
  { id: 'secunderabad', name: 'Secunderabad', personality: 'The Underrated Classic', bestFor: 'People with rail commute; old-school Hyderabad charm lovers', rent1BHK: '₹15,000–₹22,000', rent2BHK: '₹25,000–₹35,000', insiderTip: 'Best Irani chai in the city. Sunday antique market at Laad Bazaar extension is a local secret.', vibe: '🫖' },
  { id: 'manikonda', name: 'Manikonda / Tolichowki', personality: 'The Practical Middle Ground', bestFor: 'Value-conscious IT pros; food lovers; no metro needed', rent1BHK: '₹18,000–₹22,000', rent2BHK: '₹27,000–₹31,000', insiderTip: 'Tolichowki is the carnivore capital — best non-veg on a budget.', vibe: '🍗' },
];

export const breweries: Brewery[] = [
  { name: 'The Hoppery', area: 'Jubilee Hills', signature: 'Lager, wheat, IPA, stout, cinnamon ale (6 on tap)', mustKnow: 'Split-level glasshouse with stunning Durgam Cheruvu lake views; live music Thu & Sat' },
  { name: 'Zythum Brewing Co.', area: 'Jubilee Hills', signature: 'Belgian witbier, hefeweizen, Czech pilsner, West Coast IPA, mango cider', mustKnow: 'Grandest brewpub; 3-level seating around central atrium' },
  { name: 'Prost Brewpub', area: 'Jubilee Hills', signature: 'Wheat, blonde, vanilla stout, Red Rice Ale', mustKnow: "First Hyderabad brewery (2016); city's jet-setter crowd" },
  { name: 'Forge Breu-Hous', area: 'Jubilee Hills', signature: 'Wit, lager, IPA, pineapple sour, strawberry cider (8 taps)', mustKnow: 'Best outdoor section; loud DJ inside; expert brewer team' },
  { name: 'Broadway The Brewery', area: 'Jubilee Hills', signature: 'Wit, hefeweizen, chocolate vanilla stout, winter ale', mustKnow: 'Walking distance from Prost and Forge — perfect pub crawl' },
  { name: 'Zero40 Brewing', area: 'Jubilee Hills + Financial District', signature: 'Tropical lager, rauchbier, 8 signature + seasonal', mustKnow: "Named after Hyderabad's dialling code (+040)" },
  { name: 'Red Rhino Craft Brewery', area: 'HITEC City', signature: '5 signature + 3 seasonal', mustKnow: 'IT crowd favourite; all beers food-pairing-optimized' },
  { name: 'Ironhill Hyderabad', area: 'Kukatpally', signature: 'Afterlife Ale, L.O.S.T. Lager, Sinnerman Stout (8 signature)', mustKnow: '25,000 sqft; first microbrewery in Kukatpally; regular live music' },
];

export const restaurants: Restaurant[] = [
  { name: 'Cafe Bahar', area: 'Basheerbagh', cuisine: 'Biryani', rating: '#1 Local', notes: 'Ranked #1 by local foodies; old-school dum biryani' },
  { name: 'Hotel Shadab', area: 'Old City', cuisine: 'Biryani', rating: '4.4/5', notes: 'Near Charminar; always crowded by 1 PM' },
  { name: 'Bawarchi (RTC)', area: 'RTC X Roads', cuisine: 'Biryani', rating: 'Legendary', notes: 'The OG since 1994; RTC X Roads branch is the original' },
  { name: 'Paradise', area: 'Secunderabad', cuisine: 'Biryani', rating: '4.3/5', notes: 'Most iconic; huge portions; not overly spiced' },
  { name: 'Terrai', area: 'Raidurgam', cuisine: 'Neo-Telangana', rating: 'Condé Nast Hot List', notes: "First Neo-Telangana restaurant; Condé Nast 2025 Hot List" },
  { name: 'Tansen', area: 'Financial District', cuisine: 'Mughal Fine Dining', rating: 'Restaurant of Year 2026', notes: 'Luxury Mughal cuisine; live Sufi music' },
  { name: 'Yi Jing', area: 'Banjara Hills', cuisine: 'Chinese/Asian', rating: '5.0/5', notes: 'Extraordinary dumplings; best dim sum in city' },
  { name: 'Pista House', area: 'Multiple', cuisine: 'Haleem/Biryani', rating: 'Best Haleem 2025', notes: 'Best Haleem Award 2025; visit during Ramzan' },
];

export const sectors = ['HRTech', 'FinTech', 'SpaceTech', 'EdTech', 'HealthTech', 'CleanTech', 'SaaS', 'Gaming', 'AgriTech', 'LifeSciences', 'Aerospace & Defence', 'Hardware & IoT', 'Beauty/Wellness SaaS', 'VC Fund'];
export const stages = ['Seed', 'Pre-Series A', 'Series A', 'Series B', 'Series C', 'Growth', 'Unicorn', 'Fund III'];

export const fundingSectors = [
  { sector: 'HRTech', amount: 311.7, deals: 40 },
  { sector: 'Healthcare', amount: 640, deals: 35 },
  { sector: 'Enterprise SaaS', amount: 115, deals: 28 },
  { sector: 'SpaceTech', amount: 125.8, deals: 12 },
  { sector: 'Beauty Tech', amount: 260.4, deals: 18 },
  { sector: 'FinTech', amount: 65.2, deals: 22 },
  { sector: 'CleanTech', amount: 59.7, deals: 15 },
  { sector: 'EdTech', amount: 45, deals: 20 },
];

export const hyderabadVsBangalore = [
  { metric: 'GSDP Growth', hyderabad: '10.7%', bangalore: '~10%', edge: 'Hyderabad' },
  { metric: 'IT Exports', hyderabad: '₹3.13L Cr', bangalore: '₹5.5L Cr', edge: 'Bangalore' },
  { metric: 'GCCs', hyderabad: '355+', bangalore: '700+', edge: 'Bangalore' },
  { metric: 'Startups', hyderabad: '9,000+', bangalore: '10,000+', edge: 'Bangalore' },
  { metric: 'Unicorns', hyderabad: '3', bangalore: '50+', edge: 'Bangalore' },
  { metric: 'Liveability #1', hyderabad: '#1 India', bangalore: '#2 India', edge: 'Hyderabad' },
  { metric: 'Avg Net Salary', hyderabad: '₹1,04,371', bangalore: '₹92,789', edge: 'Hyderabad' },
  { metric: '1BHK Rent (IT)', hyderabad: '₹18K-32K', bangalore: '₹25K-40K', edge: 'Hyderabad' },
  { metric: 'Traffic Commute', hyderabad: '58-59 min', bangalore: '75-90 min', edge: 'Hyderabad' },
  { metric: 'Airport to City', hyderabad: '35-45 min', bangalore: '60-90 min', edge: 'Hyderabad' },
];
