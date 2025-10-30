import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();

/**
 * Check if a documentation file exists
 */
function docExists(relativePath: string): boolean {
  return existsSync(resolve(PROJECT_ROOT, relativePath));
}

/**
 * Read a documentation file
 */
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
    // Skip code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip headers and empty lines
    if (line.trim().startsWith('#') || !line.trim()) continue;

    // Collect non-empty lines as paragraphs
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
    // Read main documentation files
    const readme = readDocFile('README.md');
    const architecture = readDocFile('docs/architecture.md');
    const backendReadme = readDocFile('apps/backend/README.md');
    const frontendReadme = readDocFile('apps/frontend/README.md');
    const infrastructureReadme = readDocFile('infrastructure/README.md');
    const claudeDoc = readDocFile('.claude/claude.md');

    // Extract project description from README
    let projectDescription = '';
    if (readme) {
      // Get first paragraph after title
      const lines = readme.split('\n').filter((line) => line.trim());
      const descIndex = lines.findIndex((line) => line.trim() && !line.startsWith('#'));
      if (descIndex !== -1) {
        projectDescription = extractSummary(lines.slice(descIndex).join('\n'), 2);
      }
    }

    // Extract architecture overview
    let architectureSummary = '';
    if (architecture) {
      architectureSummary = extractSummary(architecture, 3);
    }

    // Extract service descriptions
    const backendDescription = backendReadme ? extractSummary(backendReadme, 2) : '';
    const frontendDescription = frontendReadme ? extractSummary(frontendReadme, 2) : '';
    const infrastructureDescription = infrastructureReadme
      ? extractSummary(infrastructureReadme, 2)
      : '';

    // List of all documentation files
    const documentationFiles = [
      'README.md',
      'CONTRIBUTING.md',
      'docs/architecture.md',
      'docs/troubleshooting.md',
      'apps/backend/README.md',
      'apps/frontend/README.md',
      'infrastructure/README.md',
      '.claude/claude.md',
      '.claude/agents/backend.md',
      '.claude/agents/devops-engineer.md',
      '.claude/agents/documentation-expert.md',
      '.claude/agents/frontend-developer.md',
      '.claude/agents/test-automator.md',
    ];

    const availableDocs = documentationFiles.filter(docExists);

    return {
      project: {
        name: 'Texas Poker Application',
        description:
          projectDescription ||
          'A full-stack poker application with range analysis and visualization tools.',
      },
      architecture: architectureSummary
        ? {
            overview: architectureSummary,
            documentation: 'docs/architecture.md',
          }
        : null,
      structure: {
        monorepo: true,
        services: [
          {
            name: 'backend',
            path: 'apps/backend/',
            description: backendDescription || 'NestJS backend service',
            documentation: docExists('apps/backend/README.md') ? 'apps/backend/README.md' : null,
          },
          {
            name: 'frontend',
            path: 'apps/frontend/',
            description: frontendDescription || 'React frontend application',
            documentation: docExists('apps/frontend/README.md') ? 'apps/frontend/README.md' : null,
          },
        ],
        infrastructure: {
          path: 'infrastructure/',
          description:
            infrastructureDescription || 'AWS infrastructure with Terraform, EC2, ECR, and Route53',
          documentation: docExists('infrastructure/README.md') ? 'infrastructure/README.md' : null,
        },
      },
      documentation: {
        root: availableDocs.filter((doc) => !doc.includes('/')),
        docs: availableDocs.filter((doc) => doc.startsWith('docs/')),
        services: availableDocs.filter((doc) => doc.startsWith('apps/')),
        infrastructure: availableDocs.filter((doc) => doc.startsWith('infrastructure/')),
        claude: availableDocs.filter((doc) => doc.startsWith('.claude/')),
        all: availableDocs,
      },
    };
  } catch (error) {
    return {
      error: `Failed to get codebase summary: ${error}`,
    };
  }
}
