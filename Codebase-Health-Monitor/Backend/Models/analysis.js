function calculateDominance(users, totalCommits) {
  return users
    .map((user) => {
      const score = Math.round(
        user.commits * 0.4 + user.additions * 0.4 + user.deletions * 0.2,
      ); //Calculating each users score based off commits, lines added and lines removed from the project
      return { ...user, dominanceScore: score }; //Adds it to the array of users
    })
    .sort((a, b) => b.dominanceScore - a.dominanceScore); //Organses the users from most dominant to least
}

function calculateHealthScore(contributors, timeline, lastUpdated) {
  //Getting data from contributor data
  const totalCommits = contributors.reduce((sum, u) => sum + u.commits, 0);
  const totalAdditions = contributors.reduce((sum, u) => sum + u.additions, 0);
  const totalDeletions = contributors.reduce((sum, u) => sum + u.deletions, 0);

  const days = (Date.now() - new Date(lastUpdated)) / 86400000; //checks the last commit date against the current date and puts it in days
  const recencyScore = Math.max(0, Math.round(100 - days / 1.8)); //Gives it a score from 0 days to 180 (6 months)

  //How spread the workload is
  const topShare =
    Math.max(...contributors.map((u) => u.commits)) / totalCommits; //Calculates the highest committer divided by all commits for a dominance score
  const spreadScore = Math.round((1 - topShare) * 100); //Inverts it so high dominance is a low score and puts it into a percentage

  //Average commits per week
  const weeks = new Set(timeline.map((e) => e.day.slice(0, 7))).size || 1;
  const commitsPerWeek = totalCommits / weeks;
  const frequencyScore = Math.min(100, Math.round((commitsPerWeek / 5) * 100));

  //Amount of deletions vs additions
  const ratioScore = Math.min(
    100,
    Math.round((totalDeletions / (totalAdditions || 1)) * 100),
  );

  //Averaging the four calculations
  const overall = Math.round(
    (recencyScore + spreadScore + frequencyScore + ratioScore) / 4,
  );

  return {
    overall,
  };
}

module.exports = { calculateDominance, calculateHealthScore };
