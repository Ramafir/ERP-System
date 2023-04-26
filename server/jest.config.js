module.exports = {
    bail: true,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    coverageDirectory: 'tests/coverage',
    testEnvironment: 'node',
    globalSetup: './tests/bootstrap.js',
    setupFilesAfterEnv: ['./tests/setup.js']
};
