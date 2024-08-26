const getApiUrl = (url: string) => {
  const urlParts = url.match(
    /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );

  if (!urlParts) {
    return
  }

  const baseOwner = urlParts[1];
  const baseRepo = urlParts[2];
  const prNumber = urlParts[3];
  const baseUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls/${prNumber}`;

  return {
    prUrl: baseUrl,
    diffUrl: `${baseUrl}.diff`,
    commitsUrl: `${baseUrl}/commits`
  }
}

export const fetchGithubData = async (url: string, token: string) => {
  try {
    const apiUrl = getApiUrl(url)
    if (!apiUrl) {
      throw new Error('Unable to get API URL')
    }

    const { diffUrl, commitsUrl, prUrl } = apiUrl
    const [diffResponse, commitsResponse, prResponse] = await Promise.all([
      fetch(diffUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      }),
      fetch(commitsUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }),
      fetch(prUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }),
    ]);

    // pull request - body, labels, title
    if (!prResponse.ok) {
      throw new Error(
        `GitHub API responded with status: ${prResponse.status}`
      );
    }
    const prData = await prResponse.text();
    console.log('[DEBUG] prData', prData)

    // diff
    if (!diffResponse.ok) {
      throw new Error(
        `GitHub API responded with status: ${diffResponse.status}`
      );
    }
    const diff = await diffResponse.text();

    // commits
    if (!commitsResponse.ok) {
      throw new Error(
        `GitHub API responded with status: ${commitsResponse.status}`
      );
    }
    const commitsData = await commitsResponse.json();
    console.log('[DEBUG] commitsData', commitsData)


    return {
      commitsData,
      diff,
      prData
    };
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
};

// export const fetchCompare = async (url: string, token: string) => {
//   const headers = {
//     Authorization: `token ${token}`,
//     Accept: 'application/vnd.github.v3+json',
//   };

//   const compareUrl = getCompareUrl(url);
//   try {
//     if (!compareUrl) {
//       return { content: '', commits: [] }
//     }

//     const compareResponse = await fetch(compareUrl, { headers });
//     const compareData = await compareResponse.json();
//     const { files, commits } = compareData;

//     let content = '';
//     for (const commit of commits) {
//       content += `commit ${commit.sha}\n`;
//       content += `Author: ${commit.commit.author.name} <${commit.commit.author.email}>\n`;
//       content += `Date:   ${new Date(commit.commit.author.date).toUTCString()}\n\n`;
//       content += `    ${commit.commit.message}\n\n`;

//       for (const file of files) {
//         content += `diff --git a/${file.filename} b/${file.filename}\n`;
//         content += `index ${file.sha}..${file.sha} 100644\n`;
//         content += `--- a/${file.filename}\n`;
//         content += `+++ b/${file.filename}\n`;
//         content += `${file.patch}\n\n`;
//       }

//       content += '\n';
//     }

//     return { content, commits }
//   } catch (error) {
//     console.error('Error fetching details:', error);
//     throw error;
//   }
// };
