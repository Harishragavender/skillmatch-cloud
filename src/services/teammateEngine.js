import { SEED_SKILLS } from './seedData';
import { normalizeStr } from './matchingEngine';

// Build skill to domain map
const SKILL_DOMAIN_MAP = new Map();
SEED_SKILLS.forEach(sk => {
  SKILL_DOMAIN_MAP.set(normalizeStr(sk.name), sk.domain || 'General');
});

// Domain Complementarity Matrix
const COMPLEMENTARY_SYNERGY = {
  'Backend': ['Frontend', 'UI/UX', 'Cloud/DevOps', 'Mobile'],
  'Frontend': ['Backend', 'AI/ML', 'Cloud/DevOps', 'Data Science'],
  'AI/ML': ['Frontend', 'UI/UX', 'Cloud/DevOps', 'IoT'],
  'Cloud/DevOps': ['Backend', 'Frontend', 'AI/ML', 'Mobile'],
  'UI/UX': ['Backend', 'AI/ML', 'Cloud/DevOps', 'Cybersecurity'],
  'IoT': ['Frontend', 'Cloud/DevOps', 'AI/ML', 'Backend'],
  'Cybersecurity': ['Backend', 'Cloud/DevOps', 'UI/UX'],
  'Data Science': ['Frontend', 'UI/UX', 'Backend', 'Mobile'],
  'Systems': ['Frontend', 'UI/UX', 'Cloud/DevOps'],
};

/**
 * Extracts dominant domains from a student profile
 */
export function getStudentDomains(student) {
  const domains = new Set();
  (student.technicalSkills || []).forEach(sk => {
    const norm = normalizeStr(sk.name);
    let matchedDomain = null;
    for (const [sName, sDomain] of SKILL_DOMAIN_MAP.entries()) {
      if (sName === norm || norm.includes(sName) || sName.includes(norm)) {
        matchedDomain = sDomain;
        break;
      }
    }
    if (matchedDomain) {
      domains.add(matchedDomain);
    }
  });
  return Array.from(domains);
}

/**
 * Calculates complementary compatibility between two students
 */
export function calculateTeammateCompatibility(currentStudent, candidateStudent, targetProject = null) {
  if (!currentStudent || !candidateStudent || currentStudent.id === candidateStudent.id) {
    return {
      compatibilityScore: 0,
      tier: 'Low',
      reasons: [],
      primarySynergy: '',
      complementarySkills: [],
      sharedInterests: [],
    };
  }

  const myDomains = getStudentDomains(currentStudent);
  const candidateDomains = getStudentDomains(candidateStudent);

  // 1. Domain Complementarity Score (50% max)
  let domainSynergyScore = 0;
  const synergyPairs = [];

  myDomains.forEach(myDom => {
    const idealPartners = COMPLEMENTARY_SYNERGY[myDom] || [];
    candidateDomains.forEach(candDom => {
      if (idealPartners.includes(candDom)) {
        domainSynergyScore += 18;
        synergyPairs.push({ myDomain: myDom, candDomain: candDom });
      }
    });
  });

  // Clamp domain synergy score between 20 and 50
  const normalizedDomainScore = Math.min(50, Math.max(20, domainSynergyScore || 25));

  // 2. Complementary Skill Difference Score (25% max)
  // Check skills that candidate has which current student DOES NOT have
  const mySkillNames = (currentStudent.technicalSkills || []).map(s => normalizeStr(s.name));
  const candidateSkills = candidateStudent.technicalSkills || [];
  const complementarySkills = [];

  candidateSkills.forEach(candSkill => {
    const norm = normalizeStr(candSkill.name);
    if (!mySkillNames.includes(norm)) {
      complementarySkills.push(candSkill.name);
    }
  });

  const compSkillScore = Math.min(25, Math.max(10, complementarySkills.length * 6));

  // 3. Shared Interest & Culture Alignment (15% max)
  const myInterests = (currentStudent.interests || []).map(normalizeStr);
  const candInterests = (candidateStudent.interests || []).map(normalizeStr);
  const sharedInterests = [];

  (candidateStudent.interests || []).forEach(interest => {
    if (myInterests.includes(normalizeStr(interest))) {
      sharedInterests.push(interest);
    }
  });

  const interestScore = sharedInterests.length > 0
    ? Math.min(15, sharedInterests.length * 7.5)
    : 5;

  // 4. Project-Specific Gap Coverage (10% max)
  let projectBonus = 8;
  if (targetProject) {
    const requiredSkills = (targetProject.requiredSkills || []).map(normalizeStr);
    const candidateCoversGap = complementarySkills.some(cs => 
      requiredSkills.includes(normalizeStr(cs))
    );
    if (candidateCoversGap) {
      projectBonus = 10;
    }
  }

  // Total Compatibility Score
  const totalScore = Math.min(99, Math.max(45, Math.round(normalizedDomainScore + compSkillScore + interestScore + projectBonus)));

  // Generate dynamic natural language explanation
  let primarySynergy = '';
  const myTopSkills = (currentStudent.technicalSkills || []).slice(0, 2).map(s => s.name).join(' & ');
  const candTopSkills = complementarySkills.slice(0, 2).join(' & ') || (candidateStudent.technicalSkills || []).slice(0, 2).map(s => s.name).join(' & ');

  if (myDomains.includes('AI/ML') && (candidateDomains.includes('UI/UX') || candidateDomains.includes('Frontend'))) {
    primarySynergy = `Strong ${candTopSkills} frontend/design skills complement your ${myTopSkills} ML profile for a full-stack product.`;
  } else if (myDomains.includes('Backend') && (candidateDomains.includes('Frontend') || candidateDomains.includes('UI/UX'))) {
    primarySynergy = `Expertise in ${candTopSkills} perfectly bridges your backend architecture to the user interface.`;
  } else if (myDomains.includes('Frontend') && candidateDomains.includes('Backend')) {
    primarySynergy = `Robust ${candTopSkills} backend experience powers the API and database services for your client interface.`;
  } else if (candidateDomains.includes('Cloud/DevOps')) {
    primarySynergy = `Cloud infrastructure and ${candTopSkills} skills ensure robust deployment for your collaborative projects.`;
  } else if (sharedInterests.length > 0) {
    primarySynergy = `Shared passion in ${sharedInterests.slice(0, 2).join(' & ')} combined with complementary ${candTopSkills} abilities.`;
  } else {
    primarySynergy = `Distinct ${candTopSkills} skillset introduces valuable technical diversity to your project squad.`;
  }

  const reasons = [
    primarySynergy,
    `Brings ${complementarySkills.length} new complementary skills to the team.`,
    sharedInterests.length > 0 ? `Mutual interest in ${sharedInterests.join(', ')}.` : 'Balanced academic experience level.'
  ];

  return {
    candidateId: candidateStudent.id,
    compatibilityScore: totalScore,
    qualityLabel: totalScore >= 90 ? 'Exceptional Match' : totalScore >= 75 ? 'Strong Synergy' : 'Good Match',
    badgeColor: totalScore >= 90 ? 'emerald' : totalScore >= 75 ? 'cyan' : 'amber',
    reasons,
    primarySynergy,
    complementarySkills: complementarySkills.slice(0, 5),
    sharedInterests,
    myDomains,
    candidateDomains,
  };
}

/**
 * Finds and ranks all potential teammates for a student
 */
export function findRecommendedTeammates(currentStudent, allStudents, targetProject = null) {
  if (!currentStudent || !allStudents) return [];

  return allStudents
    .filter(s => s.id !== currentStudent.id && s.role !== 'admin')
    .map(candidate => {
      const match = calculateTeammateCompatibility(currentStudent, candidate, targetProject);
      return {
        ...candidate,
        compatibility: match,
      };
    })
    .sort((a, b) => b.compatibility.compatibilityScore - a.compatibility.compatibilityScore);
}
