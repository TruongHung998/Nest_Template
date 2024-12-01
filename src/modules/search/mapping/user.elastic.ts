export const userIndex = {
	index: 'users',
	mappings: {
		properties: {
			id: { type: 'keyword' },
			username: { type: 'text' },
			name: { type: 'text' },
			createdAt: { type: 'date' },
		},
	},
};
