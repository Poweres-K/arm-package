const fs = require("fs");
const path = require("path");

const getGraphqlContentFromDirArray = async (arrayDir) => {
  const graphqlMainBody = {};
  await Promise.all(
    arrayDir.map(async (dirPath) => {
      const allFiles = fs.readdirSync(dirPath);
      await Promise.all(
        allFiles.map(async (file) => {
          const filePath = path.join(dirPath, file);
          const content = await fs.promises.readFile(filePath, "utf-8");
          const oprationNames = content
            .toString()
            // match everything that start wurh mutation or query until first occurace of ( or {
            .match(/(?<=mutation\s|query\s)(.*?)(?=\(|{)/g);
          const queryBody = content
            .toString()
            // match everything that start wurh mutation or query until 2 new lines of newline end
            .match(/(mutation|query)(\n|.)*?(?=\n\n|$|\nquery)/g);
          if (oprationNames?.length >= 1) {
            for (let index = 0; index < oprationNames.length; index++) {
              graphqlMainBody[oprationNames[index].trim()] = {
                body: queryBody[index],
                fragments: [
                  ...new Set(queryBody[index].match(/(?<=\.\.\.)\w*?(?=\s)/g)),
                ],
              };
            }
          }
        })
      );
    })
  );

  return graphqlMainBody;
};

// ########################################
// Function to generate fragment
const getFragmentFromDirName = async (fragmentPath) => {
  const flagmentObject = {};

  const allFiles = fs.readdirSync(fragmentPath);
  await Promise.all(
    allFiles.map(async (file) => {
      const filePath = path.join(fragmentPath, file);

      let content = await fs.promises.readFile(filePath, "utf-8");
      content = content.replace(/#.*/g, "");
      const fragmentNames = content
        .toString()
        // match everything that start wurh mutation or query until first occurace of ( or {
        .match(/(?<=fragment\s)(.*?)(?=\(|{|\son)/g);

      const fragmentBody = content
        .toString()
        //     // match everything that start wurh mutation or query until 2 new lines of newline end
        .match(/(fragment\s)(\n|.)*?(?=fragment|$)/g);

      if (fragmentNames?.length >= 1) {
        for (let index = 0; index < fragmentNames.length; index++) {
          flagmentObject[fragmentNames[index]] = {
            body: fragmentBody[index],
            fragments: [
              ...new Set(fragmentBody[index].match(/(?<=\.\.\.)\w+?(?=\s)/g)),
            ],
          };
        }
      }
    })
  );

  // fs.writeFileSync("fragment.json", JSON.stringify(flagmentObject));
  return flagmentObject;
};

["new-backend", "old-backend", "storefront", "hasura-content-builder"].map(
  async (folderName) => {
    const mutationPath = path.join(__dirname, `graphql/${folderName}/mutation`);
    const queryPath = path.join(__dirname, `graphql/${folderName}/query`);
    const fragmentPath = path.join(__dirname, `graphql/${folderName}/fragment`);
    const [graphqlContent, fragementContent] = await Promise.all([
      await getGraphqlContentFromDirArray([mutationPath, queryPath]),
      await getFragmentFromDirName(fragmentPath),
    ]);
    const dropPath = path.join(__dirname, `./src/graphqlSource/${folderName}`);

    fs.writeFileSync(
      path.join(dropPath, "fragment.json"),
      JSON.stringify(fragementContent)
    );

    fs.writeFileSync(
      path.join(dropPath, "query.json"),
      JSON.stringify(graphqlContent)
    );
  }
);

// const mutationPath = path.join(__dirname, "./new-backend/mutation");
// const queryPath = path.join(__dirname, "./new-backend/query");
// const fragmentPath = path.join(__dirname, "./new-backend/fragment");

// ########################################
// Function to generate Mutation and Query
// (async () => {
//   const gqlMainBody = {};
//   await Promise.all(
//     [mutationPath, queryPath].map(async (dirPath) => {
//       const allFiles = fs.readdirSync(dirPath);
//       await Promise.all(
//         allFiles.map(async (file) => {
//           const filePath = path.join(dirPath, file);
//           const content = await fs.promises.readFile(filePath, "utf-8");
//           const oprationNames = content
//             .toString()
//             // match everything that start wurh mutation or query until first occurace of ( or {
//             .match(/(?<=mutation\s|query\s)(.*?)(?=\(|{)/g);
//           const queryBody = content
//             .toString()
//             // match everything that start wurh mutation or query until 2 new lines of newline end
//             .match(/(mutation|query)(\n|.)*?(?=\n\n|$|\nquery)/g);
//           if (oprationNames?.length >= 1) {
//             for (let index = 0; index < oprationNames.length; index++) {
//               gqlMainBody[oprationNames[index].trim()] = {
//                 body: queryBody[index],
//                 fragments: [
//                   ...new Set(queryBody[index].match(/(?<=\.\.\.)\w*?(?=\s)/g)),
//                 ],
//               };
//             }
//           }
//         })
//       );
//     })
//   );

//   fs.writeFileSync("gqlBody.json", JSON.stringify(gqlMainBody));
//   console.log("done");
// })();

// ########################################
// generate sigle one
// (async () => {
//   const filePath = path.join(queryPath, "getDashboardCollectionNB.gql");

//   const content = await fs.promises.readFile(filePath, "utf-8");

//   const oprationNames = content
//     .toString()
//     // match everything that start wurh mutation or query until first occurace of ( or {
//     .match(/(?<=mutation\s|query\s)(.*?)(?=\(|{)/g);
//   const queryBody = content
//     .toString()
//     // match everything that start wurh mutation or query until 2 new lines of newline end
//     .match(/(mutation|query)(\n|.)*?(?=\n\n|$|\nquery)/g);
//   console.log(oprationNames);
//   console.log(queryBody);
//   console.log("name length ==>", oprationNames?.length);
//   console.log("body length ==>", queryBody?.length);
// })();
