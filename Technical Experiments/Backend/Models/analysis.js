function calculateDominance(users, totalCommits) {
  return users
    .map((user) => {
      const score = Math.round((user.commits / totalCommits) * 100); //Calculating what percentage of commits each user committed
      return { ...user, dominanceScore: score }; //Adds it to the array of users
    })
    .sort((a, b) => b.dominanceScore - a.dominanceScore); //Organses the users from most dominant to least
}

module.exports = { calculateDominance };
