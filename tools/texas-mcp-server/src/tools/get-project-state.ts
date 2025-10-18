import { execSync } from 'child_process';

const PROJECT_ROOT = process.cwd();

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
      projectRoot: PROJECT_ROOT,
    };
  } catch (error) {
    return {
      error: `Failed to get project state: ${error}`,
    };
  }
}
