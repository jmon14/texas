#!/usr/bin/env node

/**
 * Manual test script to verify MCP tools work
 * Run: node test-manual.js
 */

import { getProjectState } from './build/tools/get-project-state.js';
import { getCodebaseSummary } from './build/tools/get-codebase-summary.js';
import { getAgentInfo } from './build/tools/get-agent-info.js';
import { getUserPreferences } from './build/tools/get-user-preferences.js';

console.log('🧪 Testing MCP Tools...\n');

console.log('1️⃣  Testing get_user_preferences...');
const userPreferences = await getUserPreferences();
console.log(JSON.stringify(userPreferences, null, 2));
console.log('\n');

console.log('2️⃣  Testing get_project_state...');
const projectState = await getProjectState();
console.log(JSON.stringify(projectState, null, 2));
console.log('\n');

console.log('3️⃣  Testing get_codebase_summary...');
const codebaseSummary = await getCodebaseSummary();
console.log(JSON.stringify(codebaseSummary, null, 2));
console.log('\n');

console.log('4️⃣  Testing get_agent_info...');
const agentInfo = await getAgentInfo();
console.log(JSON.stringify(agentInfo, null, 2));
console.log('\n');

console.log('✅ All tools tested successfully!');
