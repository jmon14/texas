import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();

function docExists(relativePath: string): boolean {
  return existsSync(resolve(PROJECT_ROOT, relativePath));
}

function readDocFile(relativePath: string): string | null {
  if (!docExists(relativePath)) return null;
  try {
    return readFileSync(resolve(PROJECT_ROOT, relativePath), 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Extract first meaningful content from markdown (first few paragraphs, skip code blocks)
 */
function extractSummary(content: string, maxParagraphs: number = 3): string {
  if (!content) return '';

  const lines = content.split('\n');
  const paragraphs: string[] = [];
  let inCodeBlock = false;
  let paragraphCount = 0;

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip headers and empty lines
    if (line.trim().startsWith('#') || !line.trim()) continue;

    if (line.trim()) {
      const currentParagraph = paragraphs[paragraphs.length - 1] || '';
      if (currentParagraph && !currentParagraph.endsWith('.') && !currentParagraph.endsWith('!')) {
        paragraphs[paragraphs.length - 1] = currentParagraph + ' ' + line.trim();
      } else {
        paragraphs.push(line.trim());
        paragraphCount++;
        if (paragraphCount >= maxParagraphs) break;
      }
    }
  }

  return paragraphs.join(' ').trim();
}

export async function getCodebaseSummary() {
  try {
    const readme = readDocFile('README.md');
    const architecture = readDocFile('docs/architecture.md');
    const troubleshooting = readDocFile('docs/troubleshooting.md');
    const backendReadme = readDocFile('apps/backend/README.md');
    const frontendReadme = readDocFile('apps/frontend/README.md');
    const infrastructureReadme = readDocFile('infrastructure/README.md');
    const contributing = readDocFile('CONTRIBUTING.md');

    let projectDescription = '';
    if (readme) {
      const lines = readme.split('\n').filter((line) => line.trim());
      const descIndex = lines.findIndex((line) => line.trim() && !line.startsWith('#'));
      if (descIndex !== -1) {
        projectDescription = extractSummary(lines.slice(descIndex).join('\n'), 2);
      }
    }

    const architectureSummary = architecture ? extractSummary(architecture, 3) : '';
    const backendDescription = backendReadme ? extractSummary(backendReadme, 2) : '';
    const frontendDescription = frontendReadme ? extractSummary(frontendReadme, 2) : '';
    const infrastructureDescription = infrastructureReadme
      ? extractSummary(infrastructureReadme, 2)
      : '';

    const documentationFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'CHANGELOG.md',
      'docs/architecture.md',
      'docs/troubleshooting.md',
      'apps/backend/README.md',
      'apps/frontend/README.md',
      'infrastructure/README.md',
    ];

    const availableDocs = documentationFiles.filter(docExists);

    return {
      project: {
        name: 'Texas Poker Application',
        description: projectDescription || 'A full-stack poker application.',
      },
      architecture: architectureSummary
        ? {
            overview: architectureSummary,
            documentation: docExists('docs/architecture.md') ? 'docs/architecture.md' : null,
          }
        : null,
      structure: {
        monorepo: true,
        services: [
          {
            name: 'backend',
            path: 'apps/backend/',
            description: backendDescription || 'Backend service',
            documentation: docExists('apps/backend/README.md') ? 'apps/backend/README.md' : null,
          },
          {
            name: 'frontend',
            path: 'apps/frontend/',
            description: frontendDescription || 'Frontend application',
            documentation: docExists('apps/frontend/README.md') ? 'apps/frontend/README.md' : null,
          },
        ],
        infrastructure: {
          path: 'infrastructure/',
          description: infrastructureDescription || 'Infrastructure and deployment configuration',
          documentation: docExists('infrastructure/README.md') ? 'infrastructure/README.md' : null,
        },
      },
      documentation: {
        available: availableDocs,
        docs: availableDocs.filter((doc) => doc.startsWith('docs/')),
        services: availableDocs.filter((doc) => doc.startsWith('apps/')),
        infrastructure: availableDocs.filter((doc) => doc.startsWith('infrastructure/')),
        root: availableDocs.filter((doc) => !doc.includes('/')),
        notes: {
          contributing: contributing ? extractSummary(contributing, 2) : '',
          troubleshooting: troubleshooting ? extractSummary(troubleshooting, 2) : '',
        },
      },
    };
  } catch (error) {
    return {
      error: `Failed to get codebase summary: ${error}`,
    };
  }
}
