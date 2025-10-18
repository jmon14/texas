import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const AGENTS_DIR = resolve(PROJECT_ROOT, '.claude/agents');

interface AgentInfo {
  name: string;
  filename: string;
  description: string;
  responsibilities: string[];
}

export async function getAgentInfo() {
  try {
    if (!existsSync(AGENTS_DIR)) {
      return {
        error: 'No agents directory found at .claude/agents/',
      };
    }

    const agentFiles = readdirSync(AGENTS_DIR).filter((file) => file.endsWith('.md'));

    const agents: AgentInfo[] = agentFiles.map((filename) => {
      const content = readFileSync(resolve(AGENTS_DIR, filename), 'utf-8');

      // Parse YAML frontmatter if it exists
      let name = filename.replace('.md', '');
      let description = '';

      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const nameMatch = frontmatter.match(/name:\s*(.+)/);
        const descMatch = frontmatter.match(/description:\s*(.+)/);

        if (nameMatch) name = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
      }

      // Extract responsibilities (look for bullet points under ## Core Responsibilities or similar)
      const responsibilities: string[] = [];
      const responsibilitiesMatch = content.match(
        /##\s*(?:Core\s*)?Responsibilities([\s\S]*?)(?=\n##|\n---|\z)/i,
      );
      if (responsibilitiesMatch) {
        const section = responsibilitiesMatch[1];
        const bullets = section.match(/^[-*]\s*(.+)/gm);
        if (bullets) {
          responsibilities.push(...bullets.map((b) => b.replace(/^[-*]\s*/, '').trim()));
        }
      }

      return {
        name,
        filename,
        description,
        responsibilities,
      };
    });

    return {
      agentsDirectory: AGENTS_DIR,
      agents,
      totalAgents: agents.length,
    };
  } catch (error) {
    return {
      error: `Failed to get agent info: ${error}`,
    };
  }
}
