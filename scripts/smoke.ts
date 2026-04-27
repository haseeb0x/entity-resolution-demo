// Node-side runner for the smoke test. Uses tsx so that TypeScript and
// path aliases resolve directly. Run with: `npm run smoke`.
import { runSmokeTest } from '../src/lib/matching/smoke-test';

runSmokeTest();
