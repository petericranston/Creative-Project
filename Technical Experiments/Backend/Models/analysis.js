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

module.exports = { calculateDominance };
