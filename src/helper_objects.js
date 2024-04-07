const errorMessages = {
  notFound: "Resource not found",
  authenticationFailed: "Authentication failed. Please check your credentials",
  rateLimitExceeded: "Rate limit exceeded. Please try again later",
  permissionDenied: "Permission denied. You don't have access to this resource",
  serverError: "Internal server error. Please try again later",
  ownerNotFound: function (owner) {
    return `Owner: ${owner} not found.`;
  },
  repoNotFound: function (owner, repo) {
    return `Repository: ${repo} not found under the specified owner: ${owner}`;
  },
  errorStartDate: function (startDate) {
    return `Invalid Start Date Format :${startDate} YYYY-MM-DD`;
  },
  errorEndDate: function (endDate) {
    return `Invalid Start Date Format :${endDate} YYYY-MM-DD`;
  },
  errorDateInterval: function (startDate, endDate) {
    return `Start Date : ${startDate} , must be before End Date ${endDate}`;
  },
  failedPullRequest: function (error) {
    return `Failed to fetch pull requests: ${error}`;
  },
};

const regexPatterns = {
  datePattern: /^\d{4}-\d{2}-\d{2}$/,
};

urlStrings = {
  checkOwner: function (owner) {
    return `https://api.github.com/users/${owner}`;
  },
  checkRepo: function (owner, repo) {
    return `https://api.github.com/repos/${owner}/${repo}`;
  },
  pullRequestUrl: function (owner, repo) {
    return `https://api.github.com/repos/${owner}/${repo}/pulls`;
  },

  urlHeaders: "application/vnd.github.v3+json",
};

const rawData = {
  headers: { link: "" },
  data: [
    {
      id: 1,
      title: "true",
      user: {
        login: "user1",
      },
      state: "closed",
      created_at: "2022-07-01T00:00:00.000Z",
      merged_at: "2022-07-01T00:00:00.000Z",
      updated_at: "2022-07-01T00:00:00.000Z",
      closed_at: "2022-07-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "true",
      user: {
        login: "user2",
      },
      state: "closed",
      created_at: "2022-07-10T00:00:00.000Z",
      updated_at: "2022-07-10T00:00:00.000Z",
      merged_at: "2022-07-10T00:00:00.000Z",
      closed_at: "2022-07-10T00:00:00.000Z",
    },
    {
      id: 3,
      title: "true",
      user: {
        login: "user3",
      },
      state: "closed",
      created_at: "2022-07-01T00:00:00.000Z",
      updated_at_at: "2022-07-01T00:00:00.000Z",
      merged_at: "2022-07-01T00:00:00.000Z",
      closed_at: "2022-07-01T00:00:00.000Z",
    },
  ],
};

processedData = [
  {
    id: 1,
    title: "true",
    user: "user1",
    state: "closed",
    created_at: "07-01-2022",
  },
  {
    id: 3,
    title: "true",
    user: "user3",
    state: "closed",
    created_at: "07-01-2022",
  },
];

module.exports = {
  errorMessages,
  regexPatterns,
  urlStrings,
  rawData,
  processedData,
};