/**
 * semantic-release
 *
 * Version is derived from Conventional Commits on the release branches:
 *   fix: → patch · feat: → minor · feat!: / BREAKING CHANGE: → major
 *
 * `main` publishes stable releases. `develop` (optional) publishes
 * prereleases tagged `-beta.N`. The package is private, so nothing is
 * published to npm: the release is a Git tag, a GitHub Release and an
 * updated CHANGELOG.md / package.json committed back to the branch.
 */
const config = {
  branches: ['main', { name: 'develop', prerelease: 'beta' }],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};

export default config;
