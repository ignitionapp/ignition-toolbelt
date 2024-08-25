export const fetchDetails = async (url: string, token: string) => {
  let apiUrl, diffUrl;

  const prUrlParts = url.match(
    /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );
  console.log('[DEBUG] prUrlParts', prUrlParts);

  if (prUrlParts) {
    const baseOwner = prUrlParts[1];
    const baseRepo = prUrlParts[2];
    const prNumber = prUrlParts[3];

    apiUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls/${prNumber}`;
    console.log('[DEBUG] apiUrl', apiUrl);
    diffUrl = `https://api.github.com/repos/${baseOwner}/${baseRepo}/pulls/${prNumber}.diff`;
  }

  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  };

  try {
    let compareData;
    if (apiUrl) {
      const compareResponse = await fetch(apiUrl, { headers });
      compareData = await compareResponse.json();
      console.log('[DEBUG] compareData', compareData);
    }

    let diffContent;
    if (diffUrl) {
      const diffResponse = await fetch(diffUrl, {
        headers: {
          ...headers,
          Accept: 'application/vnd.github.v3.diff',
        },
      });
      if (!diffResponse.ok) {
        throw new Error(
          `GitHub API responded with status: ${diffResponse.status}`
        );
      }
      diffContent = await diffResponse.text();
      console.log('[DEBUG] diffContent', diffContent);
    }

    return {
      compareData,
      diffContent,
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
