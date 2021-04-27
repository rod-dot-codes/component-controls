import * as path from 'path';
import { run, AxeResults } from 'axe-core';
import { loadConfigurations } from '@component-controls/config';
import { renderExample } from '@component-controls/test-renderers';
import { reactRunDOM } from '@component-controls/test-renderers';
import renderer, { act } from 'react-test-renderer';
import { renderErr } from '@component-controls/test-renderers';
import '@component-controls/jest-axe-matcher';

import doc, {
  overview,
} from '../../../core/jest-extract/test/fixtures/story/VariantButton.docs';

describe('VariantButton', () => {
  const configPath = path.resolve(__dirname, '.config');
  const config = loadConfigurations(configPath);
  describe('overview', () => {
    const example = overview;

    let rendered;
    act(() => {
      rendered = renderExample({
        example,
        doc,
        config,
      });
    });
    if (!rendered) {
      renderErr();
      return;
    }
    it('snapshot', () => {
      const component = renderer.create(rendered);
      expect(component.toJSON()).toMatchSnapshot();
    });
    it('accessibility', async () => {
      const results = await reactRunDOM<AxeResults>(rendered, run);
      expect(results).toHaveNoAxeViolations();
    });
  });
});