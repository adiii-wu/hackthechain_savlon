export interface Candidate {
  id: string;
  name: string;
  title: string;
  avatar: string;
  compositeRating: number;
  trustScore: number;
  proctorScore: number;
  activityStatus: 'HyperActive' | 'Learning' | 'Dormant';
  skills: string[];
  sbtCount: number;
  githubHandle: string;
  commits30d: number;
  prs30d: number;
  openSourceProjects: number;
  certifications: Certification[];
  referrals: Referral[];
  assessments: Assessment[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  ipfsHash: string;
  sbtId: string;
  verified: boolean;
}

export interface Referral {
  id: string;
  from: string;
  role: string;
  company: string;
  date: string;
  ipfsHash: string;
  verified: boolean;
}

export interface Assessment {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  proctorScore: number;
  date: string;
  duration: string;
}

export const candidates: Candidate[] = [
  {
    id: 'c001',
    name: 'Arjun Mehta',
    title: 'Senior Frontend Engineer',
    avatar: 'AM',
    compositeRating: 924,
    trustScore: 96,
    proctorScore: 98,
    activityStatus: 'HyperActive',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Web3'],
    sbtCount: 7,
    githubHandle: 'arjunmehta-dev',
    commits30d: 142,
    prs30d: 18,
    openSourceProjects: 4,
    certifications: [
      { id: 'cert1', name: 'B.Tech Computer Science', issuer: 'IIT Bombay', date: '2022-05-15', ipfsHash: 'QmX7F3...a9c2', sbtId: '#SBT-0041', verified: true },
      { id: 'cert2', name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', date: '2023-08-10', ipfsHash: 'QmR2K9...b7f1', sbtId: '#SBT-0089', verified: true },
      { id: 'cert3', name: 'React Advanced Certification', issuer: 'Meta', date: '2024-01-20', ipfsHash: 'QmP5L1...c3d4', sbtId: '#SBT-0112', verified: true },
    ],
    referrals: [
      { id: 'ref1', from: 'Priya Singh', role: 'Engineering Manager', company: 'Razorpay', date: '2024-03-01', ipfsHash: 'QmT8N2...e5f6', verified: true },
      { id: 'ref2', from: 'Vikram Rao', role: 'CTO', company: 'Zepto', date: '2024-06-15', ipfsHash: 'QmU3M7...g9h0', verified: true },
    ],
    assessments: [
      { id: 'ass1', name: 'Frontend Architecture Deep Dive', score: 94, maxScore: 100, proctorScore: 98, date: '2024-10-05', duration: '90 min' },
      { id: 'ass2', name: 'System Design Fundamentals', score: 88, maxScore: 100, proctorScore: 96, date: '2024-11-12', duration: '60 min' },
    ],
  },
  {
    id: 'c002',
    name: 'Priya Sharma',
    title: 'ML Engineer',
    avatar: 'PS',
    compositeRating: 887,
    trustScore: 91,
    proctorScore: 94,
    activityStatus: 'HyperActive',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'FastAPI'],
    sbtCount: 5,
    githubHandle: 'priya-ml',
    commits30d: 89,
    prs30d: 11,
    openSourceProjects: 3,
    certifications: [
      { id: 'cert4', name: 'M.S. Artificial Intelligence', issuer: 'IISc Bangalore', date: '2023-06-20', ipfsHash: 'QmA4B5...i1j2', sbtId: '#SBT-0067', verified: true },
      { id: 'cert5', name: 'Google Cloud Professional ML', issuer: 'Google', date: '2024-02-14', ipfsHash: 'QmC6D7...k3l4', sbtId: '#SBT-0093', verified: true },
    ],
    referrals: [
      { id: 'ref3', from: 'Anil Kumar', role: 'Director of AI', company: 'Sarvam AI', date: '2024-07-22', ipfsHash: 'QmE8F9...m5n6', verified: true },
    ],
    assessments: [
      { id: 'ass3', name: 'ML Deployment & MLOps', score: 91, maxScore: 100, proctorScore: 94, date: '2024-09-18', duration: '75 min' },
    ],
  },
  {
    id: 'c003',
    name: 'Rahul Kapoor',
    title: 'Blockchain Developer',
    avatar: 'RK',
    compositeRating: 756,
    trustScore: 78,
    proctorScore: 82,
    activityStatus: 'Learning',
    skills: ['Solidity', 'Rust', 'Web3.js', 'Hardhat', 'IPFS'],
    sbtCount: 3,
    githubHandle: 'rahul-chain',
    commits30d: 34,
    prs30d: 4,
    openSourceProjects: 2,
    certifications: [
      { id: 'cert6', name: 'B.E. Information Technology', issuer: 'NIT Trichy', date: '2021-07-30', ipfsHash: 'QmG0H1...o7p8', sbtId: '#SBT-0023', verified: true },
    ],
    referrals: [],
    assessments: [
      { id: 'ass4', name: 'Solidity Smart Contracts', score: 76, maxScore: 100, proctorScore: 82, date: '2024-08-03', duration: '60 min' },
    ],
  },
  {
    id: 'c004',
    name: 'Sneha Patel',
    title: 'Full Stack Developer',
    avatar: 'SP',
    compositeRating: 612,
    trustScore: 64,
    proctorScore: 71,
    activityStatus: 'Dormant',
    skills: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
    sbtCount: 2,
    githubHandle: 'sneha-fullstack',
    commits30d: 8,
    prs30d: 1,
    openSourceProjects: 0,
    certifications: [
      { id: 'cert7', name: 'B.Sc. Information Systems', issuer: 'Mumbai University', date: '2022-04-10', ipfsHash: 'QmI2J3...q9r0', sbtId: '#SBT-0011', verified: true },
    ],
    referrals: [],
    assessments: [],
  },
];

export const platformStats = {
  totalCandidates: 12487,
  verifiedSBTs: 38924,
  assessmentsRun: 94210,
  avgTrustScore: 84.3,
};

export const sentinelQuestions = [
  {
    id: 'q1',
    question: 'In React, what is the primary purpose of the `useCallback` hook?',
    options: [
      'To memoize the return value of a function',
      'To memoize a function definition between renders',
      'To trigger a side effect after rendering',
      'To create a persistent reference to a DOM element',
    ],
    correct: 1,
    timeLimit: 60,
  },
  {
    id: 'q2',
    question: 'Which of the following best describes a Soulbound Token (SBT)?',
    options: [
      'A fungible ERC-20 token tied to a smart contract',
      'A transferable NFT representing ownership of a digital asset',
      'A non-transferable NFT permanently bound to a wallet address',
      'A stablecoin pegged to a real-world asset',
    ],
    correct: 2,
    timeLimit: 60,
  },
  {
    id: 'q3',
    question: 'In system design, what is the role of a "circuit breaker" pattern?',
    options: [
      'To manage database connection pools efficiently',
      'To detect failures and prevent cascading failures in distributed systems',
      'To encrypt inter-service communication',
      'To load balance traffic across multiple servers',
    ],
    correct: 1,
    timeLimit: 90,
  },
  {
    id: 'q4',
    question: 'What does IPFS stand for and what is its primary function?',
    options: [
      'Internet Protocol File System — a UNIX file system standard',
      'InterPlanetary File System — a distributed, peer-to-peer file storage protocol',
      'Immutable Proof File Storage — a blockchain anchoring system',
      'Integrated Protocol File Service — a cloud CDN layer',
    ],
    correct: 1,
    timeLimit: 60,
  },
];
