// scripts/seed-owner.ts
// 用法:
//   1. pnpm dev （启动 dev server）
//   2. $env:OWNER_EMAIL="admin@example.com"; $env:OWNER_PASSWORD="strongpassword"; pnpm db:seed-owner
//
// 环境变量:
//   OWNER_EMAIL    — admin 邮箱（必须在 ADMIN_ALLOWED_EMAILS 中）
//   OWNER_PASSWORD — 密码
//   OWNER_NAME     — 显示名称（默认 "Admin"）
//   ORIGIN         — SvelteKit server 地址（默认 http://localhost:5173）

const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';
const EMAIL = process.env.OWNER_EMAIL;
const PASSWORD = process.env.OWNER_PASSWORD;
const NAME = process.env.OWNER_NAME || 'Admin';

if (!EMAIL || !PASSWORD) {
	console.error('OWNER_EMAIL and OWNER_PASSWORD are required.');
	process.exit(1);
}

async function main() {
	const signUpRes = await fetch(`${ORIGIN}/api/auth/sign-up/email`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: NAME })
	});

	if (!signUpRes.ok) {
		const err = await signUpRes.json().catch(() => ({}));
		console.error('Sign-up failed:', signUpRes.status, err);
		process.exit(1);
	}

	console.log(`User created: ${EMAIL}`);
	console.log('');
	console.log('Next steps:');
	console.log('  1. Mark emailVerified=true via pnpm db:studio');
	console.log('  2. Insert into admin_account via pnpm db:studio');
	console.log('  Or use the setup wizard: visit /admin/setup in browser');
}

main();
