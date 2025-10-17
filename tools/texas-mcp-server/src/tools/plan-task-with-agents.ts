import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const AGENTS_DIR = resolve(PROJECT_ROOT, '.claude/agents');

interface AgentPlan {
  agent: string;
  role: 'lead' | 'support' | 'review';
  reason: string;
  order: number;
}

interface TaskAnalysis {
  taskType: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedAgents: number;
  agentPlan: AgentPlan[];
  workflow: string[];
}

/**
 * Analyzes a task and determines which agents should be involved
 */
export function planTaskWithAgents(taskDescription: string): TaskAnalysis {
  const agents = loadAllAgents();
  const plan: AgentPlan[] = [];
  const taskLower = taskDescription.toLowerCase();
  
  // Detect task domains
  const domains = {
    backend: /backend|api|endpoint|database|nest|postgres|mongo|auth|migration|schema/i.test(taskDescription),
    frontend: /frontend|ui|component|react|redux|material-ui|mui|form|page|route|state/i.test(taskDescription),
    devops: /deploy|infrastructure|docker|aws|terraform|ci\/cd|pipeline|server|nginx|ssl/i.test(taskDescription),
    testing: /test|spec|coverage|e2e|integration|unit test|mock|jest/i.test(taskDescription),
    docs: /document|readme|changelog|guide|documentation|wiki|api doc/i.test(taskDescription),
  };

  const taskType: string[] = [];
  let order = 1;

  // Determine which agents are needed
  if (domains.backend) {
    taskType.push('backend');
    plan.push({
      agent: 'backend-architect',
      role: domains.frontend ? 'lead' : 'lead',
      reason: 'Backend API and database work required',
      order: order++,
    });
  }

  if (domains.frontend) {
    taskType.push('frontend');
    plan.push({
      agent: 'frontend-developer',
      role: domains.backend ? 'lead' : 'lead',
      reason: 'UI components and state management needed',
      order: order++,
    });
  }

  if (domains.devops) {
    taskType.push('infrastructure');
    plan.push({
      agent: 'devops-engineer',
      role: plan.length > 0 ? 'support' : 'lead',
      reason: 'Infrastructure or deployment changes required',
      order: order++,
    });
  }

  if (domains.testing) {
    taskType.push('testing');
    plan.push({
      agent: 'test-automator',
      role: 'review',
      reason: 'Test coverage and quality assurance needed',
      order: order++,
    });
  } else if (plan.length > 0) {
    // Always add testing for feature work
    plan.push({
      agent: 'test-automator',
      role: 'review',
      reason: 'Test coverage required for all features',
      order: order++,
    });
  }

  if (domains.docs || plan.length > 0) {
    taskType.push('documentation');
    plan.push({
      agent: 'documentation-expert',
      role: 'review',
      reason: 'Documentation updates required',
      order: order++,
    });
  }

  // Determine complexity
  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  if (plan.length >= 4) complexity = 'complex';
  else if (plan.length >= 2) complexity = 'moderate';

  // Generate workflow steps
  const workflow = generateWorkflow(plan);

  return {
    taskType: taskType.length > 0 ? taskType : ['general'],
    complexity,
    estimatedAgents: plan.length,
    agentPlan: plan,
    workflow,
  };
}

function loadAllAgents(): string[] {
  try {
    const files = readdirSync(AGENTS_DIR);
    return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  } catch (err) {
    return [];
  }
}

function generateWorkflow(plan: AgentPlan[]): string[] {
  const workflow: string[] = [];
  
  // Lead agents work in parallel
  const leads = plan.filter(p => p.role === 'lead');
  if (leads.length > 0) {
    workflow.push(`Phase 1: Development (Parallel)`);
    leads.forEach(agent => {
      workflow.push(`  - ${agent.agent}: ${agent.reason}`);
    });
  }

  // Support agents follow
  const support = plan.filter(p => p.role === 'support');
  if (support.length > 0) {
    workflow.push(`Phase 2: Infrastructure`);
    support.forEach(agent => {
      workflow.push(`  - ${agent.agent}: ${agent.reason}`);
    });
  }

  // Review agents come last
  const review = plan.filter(p => p.role === 'review');
  if (review.length > 0) {
    workflow.push(`Phase 3: Quality Assurance`);
    review.forEach(agent => {
      workflow.push(`  - ${agent.agent}: ${agent.reason}`);
    });
  }

  return workflow;
}

