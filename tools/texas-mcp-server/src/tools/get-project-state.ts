import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();

/**
 * Extract unreleased items and latest version from CHANGELOG.md
 */
function getChangelogInfo() {
  const changelogPath = resolve(PROJECT_ROOT, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    return { unreleased: null, latestVersion: null };
  }

  try {
    const content = readFileSync(changelogPath, 'utf-8');
    const lines = content.split('\n');

    // Find [Unreleased] section
    const unreleasedIndex = lines.findIndex((line) =>
      line.trim().toLowerCase().includes('[unreleased]'),
    );

    // Find latest released version (first version after [Unreleased])
    let latestVersion: string | null = null;
    let latestVersionIndex = -1;

    if (unreleasedIndex !== -1) {
      // Look for the first version header after [Unreleased]
      for (let i = unreleasedIndex + 1; i < lines.length; i++) {
        const match = lines[i].match(/^## \[(\d+\.\d+\.\d+)\]/);
        if (match) {
          latestVersion = match[1];
          latestVersionIndex = i;
          break;
        }
      }
    } else {
      // If no [Unreleased] section, find the first version
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/^## \[(\d+\.\d+\.\d+)\]/);
        if (match) {
          latestVersion = match[1];
          latestVersionIndex = i;
          break;
        }
      }
    }

    // Extract unreleased content (everything between [Unreleased] and next version)
    let unreleased: string[] | null = null;
    if (unreleasedIndex !== -1) {
      const nextVersionIndex =
        latestVersionIndex !== -1 && latestVersionIndex > unreleasedIndex
          ? latestVersionIndex
          : lines.length;

      const unreleasedLines = lines
        .slice(unreleasedIndex + 1, nextVersionIndex)
        .filter((line) => line.trim())
        .map((line) => line.trim());

      if (unreleasedLines.length > 0) {
        unreleased = unreleasedLines;
      }
    }

    return {
      unreleased: unreleased && unreleased.length > 0 ? unreleased : null,
      latestVersion,
    };
  } catch {
    return { unreleased: null, latestVersion: null };
  }
}

export async function getProjectState() {
  try {
    // Get git information
    const gitBranch = execSync('git branch --show-current', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();

    const gitStatus = execSync('git status --short', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();

    // Check for running Docker services
    let dockerServices: string[] = [];
    try {
      const dockerPs = execSync('docker-compose ps --services --filter status=running', {
        cwd: PROJECT_ROOT,
        encoding: 'utf-8',
      }).trim();
      dockerServices = dockerPs.split('\n').filter(Boolean);
    } catch {
      // Docker might not be running, that's okay
      dockerServices = [];
    }

    // Get recent commits
    const recentCommits = execSync('git log -5 --oneline', {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
    }).trim();

    // Get changelog information
    const changelogInfo = getChangelogInfo();

    return {
      git: {
        currentBranch: gitBranch,
        hasUncommittedChanges: gitStatus.length > 0,
        uncommittedFiles: gitStatus.split('\n').filter(Boolean),
      },
      docker: {
        runningServices: dockerServices,
      },
      recentCommits: recentCommits.split('\n'),
      changelog: {
        unreleased: changelogInfo.unreleased,
        latestVersion: changelogInfo.latestVersion,
      },
      projectRoot: PROJECT_ROOT,
    };
  } catch (error) {
    return {
      error: `Failed to get project state: ${error}`,
    };
  }
}
