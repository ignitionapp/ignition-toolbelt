
const REGEXP_COMPARE_ACROSS_FORK_URL =
  /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^...]+)...([^:]+):([^?]+)/;

const REGEXP_COMPARE_URL =
  /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^?]+)/;

export const getCompareUrl = async (url: string, defaultBranchName: string) => {
  const compareAcrossForkUrlParts = url.match(REGEXP_COMPARE_ACROSS_FORK_URL);
  if (compareAcrossForkUrlParts) {
    const baseOwner = compareAcrossForkUrlParts[1];
    const baseRepo = compareAcrossForkUrlParts[2];
    const baseBranch = compareAcrossForkUrlParts[3];
    const headOwner = compareAcrossForkUrlParts[4];
    const headBranch = compareAcrossForkUrlParts[5];
    return `https://api.github.com/repos/${baseOwner}/${baseRepo}/compare/${baseBranch}...${headOwner}:${headBranch}`;
  }

  const compareUrlParts = url.match(REGEXP_COMPARE_URL);
  if (compareUrlParts) {
    const baseOwner = compareUrlParts[1];
    const baseRepo = compareUrlParts[2];
    const headBranch = compareUrlParts[3];
    return `https://api.github.com/repos/${baseOwner}/${baseRepo}/compare/${defaultBranchName}...${headBranch}`
  }
};

const getDefaultBranchName = async (url: string, token: string) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const urlParts = url.match(REGEXP_COMPARE_URL);
  if (!urlParts) {
    return;
  }

  const baseOwner = urlParts[1];
  const baseRepo = urlParts[2];
  const repoResponse = await fetch(`https://api.github.com/repos/${baseOwner}/${baseRepo}`, { headers });
  const repoData = await repoResponse.json();
  return repoData.default_branch
}

export const fetchCompare = async (url: string, token: string) => {

  const defaultBranchName = await getDefaultBranchName(url, token)
  const compareUrl = await getCompareUrl(url, defaultBranchName);
  try {
    if (!compareUrl) {
      return { content: '', commits: [] }
    }

    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    };
    const compareResponse = await fetch(compareUrl, { headers });
    const compareData = await compareResponse.json();
    const { files, commits } = compareData;

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
