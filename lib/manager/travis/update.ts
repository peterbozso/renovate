import is from '@sindresorhus/is';
import detectIndent from 'detect-indent';
import { UpdateDependencyConfig } from '../common';
import { logger } from '../../logger';

export function updateDependency({
  fileContent,
  upgrade,
}: UpdateDependencyConfig): string | null {
  try {
    logger.debug(`travis.updateDependency(): ${upgrade.newValue}`);
    const indent = detectIndent(fileContent).indent || '  ';
    let quote: string;
    if (is.string(upgrade.currentValue[0])) {
      quote =
        fileContent.split(`'`).length > fileContent.split(`"`).length
          ? `'`
          : `"`;
    } else {
      quote = '';
    }
    let newString = `node_js:\n`;
    // TODO: `newValue` is a string!
    (upgrade.newValue as any).forEach(version => {
      newString += `${indent}- ${quote}${version}${quote}\n`;
    });
    return fileContent.replace(/node_js:(\n\s+-[^\n]+)+\n/, newString);
  } catch (err) {
    logger.debug({ err }, 'Error setting new .travis.yml node versions');
    return null;
  }
}
