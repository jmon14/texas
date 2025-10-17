import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const WORK_LOG_DIR = resolve(PROJECT_ROOT, '.cursor');
const WORK_LOG_FILE = resolve(WORK_LOG_DIR, 'agent-work.json');

interface WorkEntry {
  timestamp: string;
  agent: string;
  task: string;
  status: 'started' | 'in-progress' | 'completed' | 'blocked';
  details?: string;
  filesModified?: string[];
}

interface WorkLog {
  sessionId: string;
  entries: WorkEntry[];
}

/**
 * Tracks work done by agents for coordination and progress monitoring
 */
export function trackAgentWork(
  agent: string,
  task: string,
  status: WorkEntry['status'],
  details?: string,
  filesModified?: string[],
): WorkLog {
  const log = loadWorkLog();

  const entry: WorkEntry = {
    timestamp: new Date().toISOString(),
    agent,
    task,
    status,
    details,
    filesModified,
  };

  log.entries.push(entry);
  saveWorkLog(log);

  return log;
}

/**
 * Gets the current work log for this session
 */
export function getWorkLog(): WorkLog {
  return loadWorkLog();
}

/**
 * Clears the work log (starts a new session)
 */
export function clearWorkLog(): void {
  const log: WorkLog = {
    sessionId: generateSessionId(),
    entries: [],
  };
  saveWorkLog(log);
}

function loadWorkLog(): WorkLog {
  if (!existsSync(WORK_LOG_FILE)) {
    return {
      sessionId: generateSessionId(),
      entries: [],
    };
  }

  try {
    const content = readFileSync(WORK_LOG_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    // If corrupted, start fresh
    return {
      sessionId: generateSessionId(),
      entries: [],
    };
  }
}

function saveWorkLog(log: WorkLog): void {
  // Ensure .cursor directory exists
  if (!existsSync(WORK_LOG_DIR)) {
    mkdirSync(WORK_LOG_DIR, { recursive: true });
  }

  writeFileSync(WORK_LOG_FILE, JSON.stringify(log, null, 2), 'utf-8');
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
