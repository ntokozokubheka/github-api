const { getPullRequests } = require("../src/consume_github_api.js");
const axios = require("axios");
const {
  errorMessages,
  urlStrings,
  rawData,
  processedData,
} = require("../src/helper_objects.js");

describe("getPullRequests", () => {
  let mockParams, headers, page, perPage;

  beforeEach(() => {
    page = 1;
    perPage = 100;
    headers = {
      Accept: urlStrings.urlHeaders,
      Authorization: "Bearer None",
    };
    mockParams = {
      owner: "mockOwner",
      repo: "mockRepo",
      startDate: "2022-06-31",
      endDate: "2022-07-01",
    };

    spyOn(axios, "get").and.returnValues(Promise.resolve(rawData));
  });

  it("should be called with valid arguments", async () => {
    
    process.env.GITHUB_TOKEN = "None";
    
    await getPullRequests(mockParams);

    expect(axios.get).toHaveBeenCalledOnceWith(
      urlStrings.pullRequestUrl(mockParams.owner, mockParams.repo),
      {
        params: {
          state: "all",
          page: page,
          per_page: perPage,
        },
        headers,
      }
    );
  });

  it("should process mock data correctly", async () => {
    const result = await getPullRequests(mockParams);

    expect(result).toEqual(processedData);
  });

  it("should return error for invalid start date", async () => {
    mockParams.startDate = 0;

    await expectAsync(getPullRequests(mockParams)).toBeRejectedWithError(
      errorMessages.errorStartDate(0)
    );
  });

  it("should return error for invalid end date", async () => {
    mockParams.endDate = 0;

    await expectAsync(getPullRequests(mockParams)).toBeRejectedWithError(
      errorMessages.errorEndDate(0)
    );
  });
});
