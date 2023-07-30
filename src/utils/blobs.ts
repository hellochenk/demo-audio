export function mergeBlobs(blobsArray: Blob[]) {
  if (!Array.isArray(blobsArray) || blobsArray.length === 0) {
    throw new Error("Input should be a non-empty array of Blob objects.");
  }

  // 使用 Blob 构造函数来合并 Blob 数组
  const mergedBlob = new Blob(blobsArray, { type: blobsArray[0].type });

  return mergedBlob;
}
