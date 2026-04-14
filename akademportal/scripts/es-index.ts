import { indexAllWorks } from "../lib/elasticsearch";

indexAllWorks()
  .then(() => {
    console.log("Elasticsearch indexing complete");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
