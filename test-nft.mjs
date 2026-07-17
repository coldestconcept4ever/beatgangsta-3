import { nodeFileTrace } from '@vercel/nft';
nodeFileTrace(['test-esbuild.cjs']).then(result => {
  console.log(Array.from(result.fileList).filter(f => f.includes('pdf.worker.mjs')));
});
