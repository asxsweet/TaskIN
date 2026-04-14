import { ensureBucket } from "../lib/minio";

ensureBucket()
  .then(() => {
    console.log("MinIO bucket ready");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
