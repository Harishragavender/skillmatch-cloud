import { calculateProjectMatch } from './matchingEngine';

/**
 * Analyzes skill gaps for a student viewing a specific project
 * @param {Object} student 
 * @param {Object} project 
 */
export function analyzeSkillGap(student, project) {
  if (!student || !project) return null;

  const currentMatch = calculateProjectMatch(student, project);
  const requiredSkills = project.requiredSkills || [];
  const missingSkills = currentMatch.missingSkills || [];
  const matchedSkills = currentMatch.matchedSkills || [];

  // Simulate What-If improvements for each missing skill
  const potentialImprovements = missingSkills.map(missingSkill => {
    // Clone student and simulate having this missing skill at 'Intermediate' level
    const simulatedStudent = {
      ...student,
      technicalSkills: [
        ...(student.technicalSkills || []),
        { name: missingSkill, level: 'Intermediate' }
      ]
    };

    const simulatedMatch = calculateProjectMatch(simulatedStudent, project);
    const scoreDiff = simulatedMatch.totalScore - currentMatch.totalScore;

    return {
      skillName: missingSkill,
      currentScore: currentMatch.totalScore,
      simulatedScore: simulatedMatch.totalScore,
      scoreGain: scoreDiff,
      newTier: simulatedMatch.qualityLabel,
      recommendation: `Adding ${missingSkill} (Intermediate) to your skill profile will increase your compatibility to ${simulatedMatch.totalScore}% (${simulatedMatch.qualityLabel}).`,
    };
  });

  // Calculate if student acquires ALL missing skills
  const fullyUpskilledStudent = {
    ...student,
    technicalSkills: [
      ...(student.technicalSkills || []),
      ...missingSkills.map(sk => ({ name: sk, level: 'Intermediate' }))
    ]
  };
  const maxPossibleMatch = calculateProjectMatch(fullyUpskilledStudent, project);

  return {
    projectId: project.id,
    projectTitle: project.title,
    currentScore: currentMatch.totalScore,
    currentTier: currentMatch.qualityLabel,
    requiredCount: requiredSkills.length,
    acquiredCount: matchedSkills.length,
    missingCount: missingSkills.length,
    hasGap: missingSkills.length > 0,
    matchedSkills,
    missingSkills,
    summaryText: `You already have ${matchedSkills.length} of ${requiredSkills.length} required skills.`,
    potentialImprovements,
    maxPossibleScore: maxPossibleMatch.totalScore,
    maxPossibleTier: maxPossibleMatch.qualityLabel,
    readinessRating: matchedSkills.length === requiredSkills.length 
      ? 'Fully Ready'
      : matchedSkills.length >= Math.ceil(requiredSkills.length / 2) 
        ? 'High Readiness (Minor Gap)' 
        : 'Requires Upskilling',
  };
}
