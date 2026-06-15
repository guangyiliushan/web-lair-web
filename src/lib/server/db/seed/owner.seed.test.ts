import { describe, it, expect, vi, beforeEach } from 'vitest';

// 模拟 drizzle 数据库
const mockDb = {
	select: vi.fn().mockReturnThis(),
	from: vi.fn().mockReturnThis(),
	where: vi.fn().mockResolvedValue([]),
	update: vi.fn().mockReturnThis(),
	set: vi.fn().mockReturnThis()
};

vi.mock('$lib/server/db', () => ({
	db: mockDb
}));

vi.mock('$lib/server/db/app-role.schema', () => ({
	userRole: { userId: 'user_id', role: 'role' }
}));

vi.mock('$lib/server/db/auth.schema', () => ({
	user: { id: 'id', emailVerified: 'email_verified' }
}));

// 动态导入，确保 mock 先生效
interface TestContext {
	auth: {
		api: {
			signUpEmail: (_: {
				body: { email: string; password: string; name: string };
			}) => Promise<{ user: { id: string } }>;
		};
	};
	env: { OWNER_EMAIL: string; OWNER_PASSWORD: string };
}

let seedOwner: (ctx: TestContext) => Promise<void>;

beforeEach(() => {
	vi.clearAllMocks();
});

describe('seedOwner', () => {
	it('skips when env vars are not set', async () => {
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const mod = await import('$lib/server/db/seed/owner.seed');
		seedOwner = mod.seedOwner;

		mockDb.where.mockResolvedValue([]);

		await seedOwner({ auth: {} as never, env: { OWNER_EMAIL: '', OWNER_PASSWORD: '' } });

		expect(consoleSpy).toHaveBeenCalledWith(
			'[seed] OWNER_EMAIL / OWNER_PASSWORD not set, skipping'
		);
		consoleSpy.mockRestore();
	});

	it('skips when owner already exists', async () => {
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		mockDb.where.mockResolvedValue([{ id: 'existing-owner' }]);

		await seedOwner({
			auth: {} as never,
			env: { OWNER_EMAIL: 'a@b.com', OWNER_PASSWORD: 'secret123' }
		});

		expect(consoleSpy).toHaveBeenCalledWith('[seed] Owner already exists, skipping');
		consoleSpy.mockRestore();
	});

	it('creates owner when none exists', async () => {
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		mockDb.where.mockResolvedValue([]);

		const mockAuth = {
			api: {
				signUpEmail: vi.fn().mockResolvedValue({ user: { id: 'new-owner-id' } })
			}
		};

		await seedOwner({
			auth: mockAuth,
			env: { OWNER_EMAIL: 'owner@example.com', OWNER_PASSWORD: 'strongpass1' }
		});

		expect(mockAuth.api.signUpEmail).toHaveBeenCalledWith({
			body: { email: 'owner@example.com', password: 'strongpass1', name: 'Owner' }
		});
		expect(consoleSpy).toHaveBeenCalledWith('[seed] Owner created and verified: owner@example.com');
		consoleSpy.mockRestore();
	});
});
