import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();

export async function getCodebaseSummary() {
  try {
    // Read main README
    let projectDescription = 'No README found';
    const readmePath = resolve(PROJECT_ROOT, 'README.md');
    if (existsSync(readmePath)) {
      const readme = readFileSync(readmePath, 'utf-8');
      // Extract first paragraph or title
      const lines = readme.split('\n').filter((line) => line.trim());
      projectDescription = lines.slice(0, 3).join('\n');
    }

    // Check package.json files to understand the stack
    const backendPackagePath = resolve(PROJECT_ROOT, 'apps/backend/package.json');
    const frontendPackagePath = resolve(PROJECT_ROOT, 'apps/frontend/package.json');

    let backendStack = {};
    let frontendStack = {};

    if (existsSync(backendPackagePath)) {
      const pkg = JSON.parse(readFileSync(backendPackagePath, 'utf-8'));
      backendStack = {
        main: pkg.dependencies?.['@nestjs/core'] ? 'NestJS' : 'Node.js',
        database: {
          postgres: !!pkg.dependencies?.typeorm,
          mongodb: !!pkg.dependencies?.mongoose,
        },
      };
    }

    if (existsSync(frontendPackagePath)) {
      const pkg = JSON.parse(readFileSync(frontendPackagePath, 'utf-8'));
      frontendStack = {
        main: pkg.dependencies?.react ? 'React' : 'Unknown',
        stateManagement: pkg.dependencies?.['@reduxjs/toolkit'] ? 'Redux Toolkit' : 'Unknown',
        ui: pkg.dependencies?.['@mui/material'] ? 'Material-UI' : 'Unknown',
      };
    }

    return {
      project: {
        name: 'Texas Poker Application',
        description: projectDescription,
      },
      structure: {
        monorepo: true,
        services: [
          {
            name: 'backend',
            path: 'apps/backend/',
            technology: backendStack,
          },
          {
            name: 'frontend',
            path: 'apps/frontend/',
            technology: frontendStack,
          },
        ],
        infrastructure: {
          path: 'infrastructure/',
          deployment: 'AWS (Terraform)',
        },
        documentation: [
          'README.md',
          'CONTRIBUTING.md',
          'docs/architecture.md',
          'docs/troubleshooting.md',
        ],
      },
    };
  } catch (error) {
    return {
      error: `Failed to get codebase summary: ${error}`,
    };
  }
}
