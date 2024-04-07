const {
  fetchPullRequestsResponse,
  throwCustomError,
  checkValidDateRange,
  filterPullRequestsByDateRange,
} = require("./helper_functions.js");

async function getPullRequests({ owner, repo, startDate, endDate }) {
  checkValidDateRange(startDate, endDate);

  try {
    const allPullRequests = [];
    let nextPage = true;
    let page = 1;
    const perPage = 100;
    while (nextPage) {
      const response = await fetchPullRequestsResponse(
        owner,
        repo,
        page,
        perPage
      );

      const responsePullRequests = response.data;
      const nextPageHeader = response.headers.link;
      allPullRequests.push(
        ...filterPullRequestsByDateRange(
          responsePullRequests,
          startDate,
          endDate
        )
      );

      nextPage = nextPageHeader && nextPageHeader.includes('rel="next"');
      page++;
    }

    return allPullRequests.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } catch (error) {
    throwCustomError(error, owner, repo);
  }
}

module.exports = { getPullRequests };