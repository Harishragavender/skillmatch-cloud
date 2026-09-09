/**
 * SkillMatch Cloud - Deterministic Multi-Factor Project Matching Engine
 * Formula breakdown:
 * - Skill Match: 50%
 * - Interest Match: 25%
 * - Technology Match: 15%
 * - Difficulty Match: 10%
 * Total: 100%
 */

const LEVEL_MULTIPLIER = {
  'Advanced': 1.0,
  'Intermediate': 0.8,
  'Beginner': 0.6,
};

const DIFFICULTY_MAP = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
};

/**
 * Normalizes skill strings for case-insensitive matching
 */
export function normalizeStr(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Calculates match score between a student profile and a project
 * @param {Object} student 
 * @param {Object} project 
 * @returns {Object} detailed match results
 */
export function calculateProjectMatch(student, project) {
  if (!student || !project) {
    return {
      totalScore: 0,
      qualityLabel: 'Low Match',
      qualityTier: 'low',
      badgeColor: 'rose',
      breakdown: { skill: 0, interest: 0, technology: 0, difficulty: 0 },
      reasons: [],
      missingSkills: [],
      matchedSkills: [],
    };
  }

  // 1. Skill Match (50% max)
  const studentSkillMap = new Map();
  (student.technicalSkills || []).forEach(sk => {
    studentSkillMap.set(normalizeStr(sk.name), sk.level || 'Intermediate');
  });

  const requiredSkills = project.requiredSkills || [];
  let skillWeightSum = 0;
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(reqSkillName => {
    const normReq = normalizeStr(reqSkillName);
    let matched = false;

    for (const [normUserSkill, level] of studentSkillMap.entries()) {
      if (normUserSkill === normReq || normUserSkill.includes(normReq) || normReq.includes(normUserSkill)) {
        matched = true;
        const multiplier = LEVEL_MULTIPLIER[level] || 0.8;
        skillWeightSum += multiplier;
        matchedSkills.push({ name: reqSkillName, level });
        break;
      }
    }

    if (!matched) {
      missingSkills.push(reqSkillName);
    }
  });

  const skillScore = requiredSkills.length > 0 
    ? Math.min(50, Math.round((skillWeightSum / requiredSkills.length) * 50))
    : 35;

  // 2. Interest Match (25% max)
  const studentInterests = (student.interests || []).map(normalizeStr);
  const projectCatNorm = normalizeStr(project.category);
  let interestMatches = 0;

  studentInterests.forEach(interest => {
    if (interest && (projectCatNorm.includes(interest) || interest.includes(projectCatNorm))) {
      interestMatches += 1;
    }
  });

  // Check if project has additional category tags or keywords
  const interestScore = interestMatches > 0 ? 25 : 8;

  // 3. Technology Match (15% max)
  const studentTechs = (student.preferredTechnologies || []).map(normalizeStr);
  const projectTechs = (project.technologies || []).map(normalizeStr);
  let techMatches = 0;

  projectTechs.forEach(tech => {
    if (studentTechs.some(st => st.includes(tech) || tech.includes(st))) {
      techMatches += 1;
    }
  });

  const techScore = projectTechs.length > 0
    ? Math.min(15, Math.round((techMatches / projectTechs.length) * 15))
    : 10;

  // 4. Difficulty Match (10% max)
  const studentLevelNum = DIFFICULTY_MAP[student.experienceLevel] || 2;
  const projectDiffNum = DIFFICULTY_MAP[project.difficulty] || 2;
  const diffDelta = Math.abs(studentLevelNum - projectDiffNum);

  let diffScore = 10;
  if (diffDelta === 1) diffScore = 7.5;
  if (diffDelta >= 2) diffScore = 4;

  // Total
  const totalScore = Math.min(100, Math.max(0, Math.round(skillScore + interestScore + techScore + diffScore)));

  // Quality Tier & Label
  let qualityLabel = 'Low Match';
  let qualityTier = 'low';
  let badgeColor = 'rose';

  if (totalScore >= 90) {
    qualityLabel = 'Excellent Match';
    qualityTier = 'excellent';
    badgeColor = 'emerald';
  } else if (totalScore >= 75) {
    qualityLabel = 'Strong Match';
    qualityTier = 'strong';
    badgeColor = 'cyan';
  } else if (totalScore >= 60) {
    qualityLabel = 'Good Match';
    qualityTier = 'good';
    badgeColor = 'amber';
  } else if (totalScore >= 40) {
    qualityLabel = 'Moderate Match';
    qualityTier = 'moderate';
    badgeColor = 'orange';
  }

  // Generate transparent human-readable reasons
  const reasons = [];
  if (matchedSkills.length === requiredSkills.length && requiredSkills.length > 0) {
    reasons.push(`✓ Complete skill match (${matchedSkills.length}/${requiredSkills.length} required skills)`);
  } else if (matchedSkills.length > 0) {
    reasons.push(`✓ ${matchedSkills.length} of ${requiredSkills.length} required skills satisfied`);
  } else {
    reasons.push(`⚠️ Missing ${missingSkills.length} core technical requirements`);
  }

  if (interestMatches > 0) {
    reasons.push(`✓ Strong category alignment in ${project.category}`);
  }

  if (techMatches > 0) {
    reasons.push(`✓ ${techMatches} overlapping preferred technologies`);
  }

  if (diffDelta === 0) {
    reasons.push(`✓ Perfect difficulty match for your ${student.experienceLevel || 'Intermediate'} level`);
  } else if (diffDelta === 1) {
    reasons.push(`✓ Achievable challenge curve (${project.difficulty})`);
  }

  return {
    totalScore,
    qualityLabel,
    qualityTier,
    badgeColor,
    breakdown: {
      skill: skillScore,
      interest: interestScore,
      technology: techScore,
      difficulty: diffScore,
    },
    reasons,
    missingSkills,
    matchedSkills,
    requiredCount: requiredSkills.length,
    matchedCount: matchedSkills.length,
  };
}

/**
 * Calculates match percentage for a collection of projects
 */
export function rankProjectsForStudent(student, projects) {
  if (!student || !projects) return [];
  return projects.map(proj => {
    const match = calculateProjectMatch(student, proj);
    return {
      ...proj,
      match,
    };
  }).sort((a, b) => b.match.totalScore - a.match.totalScore);
}
