import { NextApiRequest, NextApiResponse } from 'next';
import { typeResolver } from '@component-controls/structured-types/react';
import { parseFiles } from '@component-controls/structured-types';

import { createTempFile } from '../../src/api/create-temp-file';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { code, config } = req.query as { code?: string; config?: string };
  const options = {
    resolvers: [typeResolver],
    ...(config ? JSON.parse(config) : undefined),
  };
  const { lang = 'typescript' } = options?.tsOptions || {};
  const extension = lang === 'javascript' ? 'jsx' : 'tsx';
  const result = createTempFile(
    extension,
    fileNames => {
      return parseFiles(fileNames, options);
    },
    code,
  );
  res.json(result);
};