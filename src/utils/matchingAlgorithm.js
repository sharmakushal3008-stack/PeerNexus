/**
 * Computes Jaccard Similarity between two sets of skills
 * J(A, B) = |A ∩ B| / |A ∪ B|
 */
export function calculateJaccardSimilarity(skillsA = [], skillsB = []) {
  if (!skillsA.length || !skillsB.length) return 0;
  
  const setA = new Set(skillsA.map(s => s.toLowerCase().trim()));
  const setB = new Set(skillsB.map(s => s.toLowerCase().trim()));
  
  let intersectionCount = 0;
  setA.forEach(skill => {
    if (setB.has(skill)) intersectionCount++;
  });
  
  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : Number((intersectionCount / unionCount).toFixed(2));
}

/**
 * Computes Mutual Complementarity Index between two students
 * checks if Student A teaches what Student B wants, AND Student B teaches what Student A wants.
 */
export function calculateComplementarityIndex(studentA, studentB) {
  const aOffers = studentA.skillsOffered || [];
  const aWants = studentA.skillsWanted || [];
  const bOffers = studentB.skillsOffered || [];
  const bWants = studentB.skillsWanted || [];

  // Match A's offers with B's wants
  const aToBMatch = aOffers.filter(skill => 
    bWants.some(w => w.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(w.toLowerCase()))
  ).length;

  // Match B's offers with A's wants
  const bToAMatch = bOffers.filter(skill => 
    aWants.some(w => w.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(w.toLowerCase()))
  ).length;

  const totalPossible = Math.max(1, (aOffers.length + bOffers.length) / 2);
  const score = Math.min(100, Math.round(((aToBMatch + bToAMatch) / totalPossible) * 100));
  
  return {
    score,
    aToBMatchCount: aToBMatch,
    bToAMatchCount: bToAMatch,
    isBiDirectional: aToBMatch > 0 && bToAMatch > 0
  };
}

/**
 * Calculates student-to-project compatibility score
 */
export function calculateProjectCompatibility(user, project) {
  const userOffered = user.skillsOffered || [];
  const requiredSkills = project.rolesNeeded.flatMap(r => r.skills || []);

  const matchingSkills = userOffered.filter(userSkill =>
    requiredSkills.some(req => req.toLowerCase().includes(userSkill.toLowerCase()) || userSkill.toLowerCase().includes(req.toLowerCase()))
  );

  const skillCoverage = requiredSkills.length > 0 ? (matchingSkills.length / requiredSkills.length) : 0.5;
  const yearWeight = user.year.includes("4th Year") ? 1.15 : 1.0;
  
  const rawScore = (skillCoverage * 80) + (user.reputation / 100 * 20);
  const finalScore = Math.min(99, Math.max(40, Math.round(rawScore * yearWeight)));

  return {
    finalScore,
    matchingSkills,
    coveragePercentage: Math.round(skillCoverage * 100)
  };
}
