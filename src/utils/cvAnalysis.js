/**
 * CV Analysis Utilities
 * Provides scoring, keyword matching, and gap analysis functionality
 */

// Common technical skills and keywords database
export const SKILL_CATEGORIES = {
  'Frontend': ['React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap'],
  'Backend': ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Express', 'Django', 'Spring'],
  'Database': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'DynamoDB'],
  'Cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'CI/CD'],
  'Tools': ['Git', 'GitHub', 'GitLab', 'Jira', 'Confluence', 'Slack', 'Figma', 'Postman', 'VS Code'],
  'Soft Skills': ['Leadership', 'Communication', 'Team work', 'Problem solving', 'Critical thinking', 'Agile', 'Scrum']
};

// Get all skills as a flat array
export const ALL_SKILLS = Object.values(SKILL_CATEGORIES).flat();

/**
 * Extract keywords from text with case-insensitive matching
 */
export const extractKeywords = (text) => {
  if (!text) return [];

  const words = text.toLowerCase()
    .replace(/[^\w\s.-]/g, ' ') // Remove special chars except dots and hyphens
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out very short words

  const phrases = [];

  // Extract 2-word phrases (like "machine learning", "web development")
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
  }

  // Extract 3-word phrases for compound skills
  for (let i = 0; i < words.length - 2; i++) {
    phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }

  return [...new Set([...words, ...phrases])]; // Remove duplicates
};

/**
 * Find skill matches between two sets of keywords
 */
export const findSkillMatches = (cvKeywords, jobKeywords) => {
  const matches = [];
  const cvLower = cvKeywords.map(k => k.toLowerCase());

  ALL_SKILLS.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const hasInCV = cvLower.some(cvWord =>
      cvWord.includes(skillLower) || skillLower.includes(cvWord)
    );
    const hasInJob = jobKeywords.some(jobWord =>
      jobWord.toLowerCase().includes(skillLower) || skillLower.includes(jobWord.toLowerCase())
    );

    if (hasInCV && hasInJob) {
      matches.push({
        skill,
        category: Object.keys(SKILL_CATEGORIES).find(cat =>
          SKILL_CATEGORIES[cat].includes(skill)
        )
      });
    }
  });

  return matches;
};

/**
 * Find missing skills (in job description but not in CV)
 */
export const findMissingSkills = (cvKeywords, jobKeywords) => {
  const missing = [];
  const cvLower = cvKeywords.map(k => k.toLowerCase());

  ALL_SKILLS.forEach(skill => {
    const skillLower = skill.toLowerCase();
    const hasInCV = cvLower.some(cvWord =>
      cvWord.includes(skillLower) || skillLower.includes(cvWord)
    );
    const hasInJob = jobKeywords.some(jobWord =>
      jobWord.toLowerCase().includes(skillLower) || skillLower.includes(jobWord.toLowerCase())
    );

    if (!hasInCV && hasInJob) {
      missing.push({
        skill,
        category: Object.keys(SKILL_CATEGORIES).find(cat =>
          SKILL_CATEGORIES[cat].includes(skill)
        ),
        priority: calculateSkillPriority(skill, jobKeywords)
      });
    }
  });

  // Sort by priority (how many times mentioned in job description)
  return missing.sort((a, b) => b.priority - a.priority);
};

/**
 * Calculate how important a skill is based on job description mentions
 */
const calculateSkillPriority = (skill, jobKeywords) => {
  const skillLower = skill.toLowerCase();
  return jobKeywords.filter(keyword =>
    keyword.toLowerCase().includes(skillLower)
  ).length;
};

/**
 * Calculate overall CV score (0-100)
 */
export const calculateCVScore = (cvText, jobDescription) => {
  if (!cvText || !jobDescription) return 0;

  const cvKeywords = extractKeywords(cvText);
  const jobKeywords = extractKeywords(jobDescription);
  const skillMatches = findSkillMatches(cvKeywords, jobKeywords);
  const missingSkills = findMissingSkills(cvKeywords, jobKeywords);

  // Scoring factors (total = 100 points)
  let score = 0;

  // 1. Keyword Match Score (40 points)
  const keywordMatchRatio = skillMatches.length / Math.max(jobKeywords.length * 0.1, 1);
  score += Math.min(keywordMatchRatio * 40, 40);

  // 2. CV Length Score (15 points) - optimal length between 400-800 words
  const wordCount = cvText.split(/\s+/).length;
  if (wordCount >= 400 && wordCount <= 800) {
    score += 15;
  } else if (wordCount >= 300 && wordCount <= 1000) {
    score += 10;
  } else {
    score += 5;
  }

  // 3. Section Completeness Score (20 points)
  const sections = ['experience', 'education', 'skills'];
  const foundSections = sections.filter(section =>
    cvText.toLowerCase().includes(section)
  );
  score += (foundSections.length / sections.length) * 20;

  // 4. Skill Diversity Score (15 points)
  const skillCategories = [...new Set(skillMatches.map(m => m.category))];
  score += (skillCategories.length / Object.keys(SKILL_CATEGORIES).length) * 15;

  // 5. Missing Critical Skills Penalty (10 points)
  const criticalMissing = missingSkills.filter(skill => skill.priority >= 2);
  score += Math.max(10 - (criticalMissing.length * 2), 0);

  return Math.round(Math.max(0, Math.min(100, score)));
};

/**
 * Generate detailed analysis report
 */
export const generateAnalysisReport = (cvText, jobDescription) => {
  const cvKeywords = extractKeywords(cvText);
  const jobKeywords = extractKeywords(jobDescription);
  const skillMatches = findSkillMatches(cvKeywords, jobKeywords);
  const missingSkills = findMissingSkills(cvKeywords, jobKeywords);
  const score = calculateCVScore(cvText, jobDescription);

  // Group matches by category
  const matchesByCategory = SKILL_CATEGORIES;
  Object.keys(matchesByCategory).forEach(category => {
    matchesByCategory[category] = skillMatches.filter(m => m.category === category);
  });

  // Group missing skills by category
  const missingByCategory = {};
  Object.keys(SKILL_CATEGORIES).forEach(category => {
    missingByCategory[category] = missingSkills.filter(m => m.category === category);
  });

  return {
    score,
    totalSkillMatches: skillMatches.length,
    totalMissingSkills: missingSkills.length,
    skillMatches,
    missingSkills: missingSkills.slice(0, 10), // Top 10 most important missing skills
    matchesByCategory,
    missingByCategory,
    wordCount: cvText.split(/\s+/).length,
    recommendations: generateRecommendations(score, missingSkills, cvText)
  };
};

/**
 * Generate personalized recommendations based on analysis
 */
const generateRecommendations = (score, missingSkills, cvText) => {
  const recommendations = [];

  if (score < 60) {
    recommendations.push({
      type: 'critical',
      title: 'Low Match Score',
      description: 'Your CV needs significant optimization for this role',
      action: 'Consider adding more relevant keywords and skills'
    });
  }

  if (missingSkills.length > 5) {
    recommendations.push({
      type: 'warning',
      title: 'Missing Key Skills',
      description: `${missingSkills.length} important skills not found in your CV`,
      action: `Focus on adding: ${missingSkills.slice(0, 3).map(s => s.skill).join(', ')}`
    });
  }

  const wordCount = cvText.split(/\s+/).length;
  if (wordCount < 300) {
    recommendations.push({
      type: 'info',
      title: 'CV Too Short',
      description: 'Your CV might be too brief for this role',
      action: 'Consider adding more detail to your experience sections'
    });
  } else if (wordCount > 1000) {
    recommendations.push({
      type: 'info',
      title: 'CV Too Long',
      description: 'Your CV might be too lengthy for quick screening',
      action: 'Consider condensing to the most relevant information'
    });
  }

  if (score >= 80) {
    recommendations.push({
      type: 'success',
      title: 'Excellent Match!',
      description: 'Your CV is well-optimized for this position',
      action: 'Review the optimized version and apply with confidence'
    });
  }

  return recommendations;
};
