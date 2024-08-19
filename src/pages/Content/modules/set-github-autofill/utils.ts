const REGEXP_COMPARE_URL =
  /https:\/\/github\.com\/([^/]+)\/([^/]+)\/compare\/([^...]+)...([^:]+):([^?]+)/;

export const getCompareUrl = (url: string) => {
  const compareUrlParts = url.match(REGEXP_COMPARE_URL);
  if (compareUrlParts) {
    const baseOwner = compareUrlParts[1];
    const baseRepo = compareUrlParts[2];
    const baseBranch = compareUrlParts[3];
    const headOwner = compareUrlParts[4];
    const headBranch = compareUrlParts[5];

    return `https://api.github.com/repos/${baseOwner}/${baseRepo}/compare/${baseBranch}...${headOwner}:${headBranch}`;
  }
};

export const fetchCompare = async (url: string, token: string) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  const compareUrl = getCompareUrl(url);
  try {
    if (!compareUrl) {
      return { content: '', commits: [] }
    }

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
