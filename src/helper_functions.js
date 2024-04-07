const { errorMessages } = require("./helper_objects.js");
const axios = require("axios");
require("dotenv").config();

const { urlStrings, regexPatterns } = require("./helper_objects.js");

let headers;

const authRepo = () => {
  const githubToken = process.env.GITHUB_TOKEN;

  headers = {
    Accept: "application/vnd.github.v3+json",
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }
};

const filterPullRequestsByDateRange = (pullRequests, startDate, endDate) => {
  const starDateObj = new Date(startDate);
  const endOfDayUTC = new Date(endDate);
  endOfDayUTC.setUTCHours(23, 59, 59, 999);

  return pullRequests
    .filter((pullRequest) => {
      const createdAt = new Date(pullRequest.created_at);
      const mergedAt = new Date(pullRequest.merged_at);
      const updatedAt = new Date(pullRequest.updated_at);
      const closedAt = new Date(pullRequest.closed_at);

      return (
        (createdAt >= starDateObj && createdAt <= endOfDayUTC) ||
        (mergedAt >= starDateObj && mergedAt <= endOfDayUTC) ||
        (updatedAt >= starDateObj && updatedAt <= endOfDayUTC) ||
        (closedAt >= starDateObj && closedAt <= endOfDayUTC)
      );
    })
    .map((pullRequest) => ({
      id: pullRequest.id,
      user: pullRequest.user.login,
      title: pullRequest.title,
      state: pullRequest.state,
      created_at: new Date(pullRequest.created_at)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\//g, "-"),
    }));
};

async function fetchPullRequestsResponse(owner, repo, page, perPage) {
  authRepo();

  const response = await axios.get(urlStrings.pullRequestUrl(owner, repo), {
    params: {
      state: "all",
      page: page,
      per_page: perPage,
    },
    headers: headers,
  });

  return response;
}
async function throwCustomError(error, owner, repo) {
  if (error.status in errorMessages) {
    throw new Error(errorMessages[error.status]);
  } else if (!(await checkExistence(owner))) {
    throw new Error(errorMessages.ownerNotFound(owner));
  } else if (!(await checkExistence(owner, repo))) {
    throw new Error(errorMessages.repoNotFound(owner, repo));
  }
  throw new Error(errorMessages.failedPullRequest(error));
}

async function checkExistence(owner, repo = "") {
  try {
    let apiUrl;
    apiUrl = urlStrings.checkOwner(owner);

    if (repo.length > 0) {
      apiUrl = urlStrings.checkRepo(owner, repo);
    }

    authRepo();

    const response = await axios.get(apiUrl, headers);

    return response.status === 200;
  } catch {
    return false;
  }
}

function checkValidDateRange(startDate, endDate) {
  const datePattern = regexPatterns.datePattern;

  if (!datePattern.test(startDate) || !datePattern.test(endDate)) {
    if (!datePattern.test(startDate)) {
      throw new Error(errorMessages.errorStartDate(startDate));
    } else {
      throw new Error(errorMessages.errorEndDate(endDate));
    }
  }
  if (new Date(startDate) > new Date(endDate)) {
    throw new Error(errorMessages.errorDateInterval(startDate, endDate));
  }
}

module.exports = {
  fetchPullRequestsResponse,
  throwCustomError,
  checkValidDateRange,
  checkExistence,
  filterPullRequestsByDateRange,
};