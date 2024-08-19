const REGEXP_PR_URL = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
const REGEXP_COMPARE_URL =
  /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^...]+)...([^:]+):([^?]+)/;

export const getApiUrls = (url: string) => {
  const result: Record<string, string> = {};

  const compareUrlParts = url.match(REGEXP_COMPARE_URL);
  if (compareUrlParts) {
    const baseOwner = compareUrlParts[1];
    const baseRepo = compareUrlParts[2];
    const baseBranch = compareUrlParts[3];
    const headOwner = compareUrlParts[4];
    const headBranch = compareUrlParts[5];

    result.compareUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/compare/${baseBranch}...${headOwner}:${headBranch}`;
  }

  // NOTE - This is not used at the moment
  const prUrlParts = url.match(REGEXP_PR_URL);
  if (prUrlParts) {
    const baseOwner = prUrlParts[1];
    const baseRepo = prUrlParts[2];
    const prNumber = prUrlParts[3];
    result.diffUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls/${prNumber}.diff`;
  }

  return result;
};

export const fetchCompare = async (url: string, token: string) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const { compareUrl } = getApiUrls(url);
  try {
    if (!compareUrl) {
      return
    }

    const compareResponse = await fetch(compareUrl, { headers });
    const { files, commits } = await compareResponse.json();

    let content = '';
    for (const commit of commits) {
      content += `commit ${commit.sha}\n`;
      content += `Author: ${commit.commit.author.name} <${commit.commit.author.email}>\n`;
      content += `Date:   ${new Date(commit.commit.author.date).toUTCString()}\n\n`;
      content += `    ${commit.commit.message}\n\n`;

      for (const file of files) {
        content += `diff --git a/${file.filename} b/${file.filename}\n`;
        content += `index ${file.sha}..${file.sha} 100644\n`;
        content += `--- a/${file.filename}\n`;
        content += `+++ b/${file.filename}\n`;
        content += `${file.patch}\n\n`;
      }

      content += '\n';
    }

    return { content, commits }
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
};
