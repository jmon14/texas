import { readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const AGENTS_DIR = resolve(PROJECT_ROOT, '.claude/agents');

interface AgentContext {
  name: string;
  fullContent: string;
  sections: {
    role?: string;
    responsibilities?: string[];
    patterns?: string;
    examples?: string;
  };
}

/**
 * Loads the complete context for a specific agent
 * This allows adopting the agent's persona and following their patterns
 */
export function getAgentContext(agentName: string): AgentContext {
  try {
    // Normalize agent name
    const filename = agentName.includes('.md') 
      ? agentName 
      : agentName.endsWith('-architect')
        ? 'backend.md'
        : `${agentName}.md`;
    
    const agentPath = resolve(AGENTS_DIR, filename);
    const content = readFileSync(agentPath, 'utf-8');

    // Parse sections
    const sections = parseAgentSections(content);

    return {
      name: agentName,
      fullContent: content,
      sections,
    };
  } catch (err) {
    throw new Error(`Agent '${agentName}' not found. Available agents are in .claude/agents/`);
  }
}

function parseAgentSections(content: string): AgentContext['sections'] {
  const sections: AgentContext['sections'] = {};

  // Extract role/description (usually in first paragraph or heading)
  const roleMatch = content.match(/## Role\n\n(.+?)(?=\n##|\n\n##|$)/s);
  if (roleMatch) {
    sections.role = roleMatch[1].trim();
  }

  // Extract responsibilities
  const respMatch = content.match(/## (?:Responsibilities|Key Responsibilities)\n\n([\s\S]+?)(?=\n##|$)/);
  if (respMatch) {
    const respText = respMatch[1];
    sections.responsibilities = respText
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  }

  // Extract patterns section
  const patternsMatch = content.match(/## (?:Patterns|Development Patterns|Architecture Patterns)\n\n([\s\S]+?)(?=\n##|$)/);
  if (patternsMatch) {
    sections.patterns = patternsMatch[1].trim();
  }

  // Extract examples
  const examplesMatch = content.match(/## Examples?\n\n([\s\S]+?)(?=\n##|$)/);
  if (examplesMatch) {
    sections.examples = examplesMatch[1].trim();
  }

  return sections;
}

