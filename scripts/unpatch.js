import { execSync } from 'node:child_process';

try {
	execSync('npx patch-package --reverse', { stdio: 'inherit' });
} catch {
	// Patch was already reversed or not applied — that's fine
}
