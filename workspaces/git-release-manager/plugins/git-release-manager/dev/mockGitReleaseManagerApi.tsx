import {
  Branch,
  GitReleaseApi,
  OwnerRepo,
  Release,
  Repository,
  User,
} from '../src/api/GitReleaseClient';

interface OwnerData {
  user: User;
  repositories: Record<
    string,
    {
      repo: Repository;
      latestRelease: Release | null;
      branches?: Record<string, Branch>;
    }
  >;
}

const DATA: Record<string, OwnerData> = {
  goodreleaser: {
    user: {
      username: 'goodreleaser',
      email: 'goodreleaser@backstage.io',
    },
    repositories: {
      repo_sem_ver: {
        repo: {
          pushPermissions: true,
          defaultBranch: 'main',
          name: 'repo_sem_ver',
        },
        latestRelease: {
          htmlUrl: 'https://mock_release_html_url',
          id: 1,
          prerelease: false,
          tagName: 'rc-1.2.3',
          targetCommitish: 'rc-1.2.3',
        },
        branches: {
          'rc-1.2.3': {
            commit: {
              commit: {
                tree: {
                  sha: 'mock_branch_commit_commit_tree_sha',
                },
              },
              sha: 'mock_branch_commit_sha',
            },
            links: {
              html: 'https://mock_branch_links_html',
            },
            name: 'rc-1.2.3',
          },
        },
      },
      no_release: {
        repo: {
          pushPermissions: true,
          defaultBranch: 'main',
          name: 'no_release',
        },
        latestRelease: null,
      },
      repo_calendar_ver: {
        repo: {
          pushPermissions: true,
          defaultBranch: 'main',
          name: 'repo_calendar_ver',
        },
        latestRelease: {
          htmlUrl: 'https://mock_release_html_url',
          id: 1,
          prerelease: false,
          tagName: 'rc-2023-06-02',
          targetCommitish: 'rc-2023-06-02',
        },
        branches: {
          'rc-2023-06-02': {
            commit: {
              commit: {
                tree: {
                  sha: 'mock_branch_commit_commit_tree_sha',
                },
              },
              sha: 'mock_branch_commit_sha',
            },
            links: {
              html: 'https://mock_branch_links_html',
            },
            name: 'rc-2023-06-02',
          },
        },
      },
    },
  },
  badreleaser: {
    user: {
      username: 'badreleaser',
      email: 'badreleaser@backstage.io',
    },
    repositories: {
      repo_no_ver: {
        repo: {
          pushPermissions: true,
          defaultBranch: 'main',
          name: 'repo_no_ver',
        },
        latestRelease: null,
      },
    },
  },
};

export const mockGitReleaseManagerApi: GitReleaseApi = {
  getUser: () =>
    Promise.resolve({
      user: { username: 'goodreleaser' },
    }),
  getOwners: () => Promise.resolve({ owners: Object.keys(DATA) }),
  getRepositories: (args: { owner: string }) =>
    Promise.resolve({
      repositories: Object.values(DATA[args.owner].repositories).map(
        r => r.repo.name,
      ),
    }),
  getRepository: (args: OwnerRepo) => {
    return Promise.resolve({
      repository: DATA[args.owner].repositories[args.repo].repo,
    });
  },

  getLatestRelease: (args: OwnerRepo) => {
    const latestRelease =
      DATA[args.owner].repositories[args.repo].latestRelease;

    return Promise.resolve({ latestRelease });
  },

  getBranch: function (args: { branch: string } & OwnerRepo): Promise<{
    branch: {
      name: string;
      links: { html: string };
      commit: { sha: string; commit: { tree: { sha: string } } };
    };
  }> {
    return Promise.resolve({
      branch: DATA[args.owner].repositories[args.repo].branches![args.branch],
    });
  },
  // -----

  getHost: function (): string {
    throw new Error('Function getHost not implemented.');
  },
  getRepoPath: function (args: OwnerRepo): string {
    throw new Error('Function getRepoPath not implemented.');
  },

  getRecentCommits: function (
    args: { releaseBranchName?: string | undefined } & OwnerRepo,
  ): Promise<{
    recentCommits: {
      htmlUrl: string;
      sha: string;
      author: { htmlUrl?: string | undefined; login?: string | undefined };
      commit: { message: string };
      firstParentSha?: string | undefined;
    }[];
  }> {
    throw new Error('Function getRecentCommits not implemented.');
  },

  getCommit: function (args: { ref: string } & OwnerRepo): Promise<{
    commit: {
      sha: string;
      htmlUrl: string;
      commit: { message: string };
      createdAt?: string | undefined;
    };
  }> {
    throw new Error('Function getCommit not implemented.');
  },

  createRef: function (
    args: { ref: string; sha: string } & OwnerRepo,
  ): Promise<{ reference: { ref: string; objectSha: string } }> {
    throw new Error('Function createRef not implemented.');
  },
  deleteRef: function (
    args: { ref: string } & OwnerRepo,
  ): Promise<{ success: boolean }> {
    throw new Error('Function deleteRef not implemented.');
  },
  getComparison: function (
    args: { base: string; head: string } & OwnerRepo,
  ): Promise<{ comparison: { htmlUrl: string; aheadBy: number } }> {
    throw new Error('Function getComparison not implemented.');
  },
  createRelease: function (
    args: {
      tagName: string;
      name: string;
      targetCommitish: string;
      body: string;
    } & OwnerRepo,
  ): Promise<{
    release: { name: string | null; htmlUrl: string; tagName: string };
  }> {
    throw new Error('Function createRelease not implemented.');
  },
  createTagObject: function (
    args: {
      tag: string;
      taggerEmail?: string | undefined;
      message: string;
      object: string;
      taggerName: string;
    } & OwnerRepo,
  ): Promise<{ tagObject: { tagName: string; tagSha: string } }> {
    throw new Error('Function createTagObject not implemented.');
  },
  createCommit: function (
    args: { message: string; tree: string; parents: string[] } & OwnerRepo,
  ): Promise<{ commit: { message: string; sha: string } }> {
    throw new Error('Function createCommit not implemented.');
  },
  updateRef: function (
    args: { sha: string; ref: string; force: boolean } & OwnerRepo,
  ): Promise<{ reference: { ref: string; object: { sha: string } } }> {
    throw new Error('Function updateRef not implemented.');
  },
  merge: function (args: { base: string; head: string } & OwnerRepo): Promise<{
    merge: {
      htmlUrl: string;
      commit: { message: string; tree: { sha: string } };
    };
  }> {
    throw new Error('Function merge not implemented.');
  },
  updateRelease: function (
    args: {
      releaseId: number;
      tagName: string;
      body?: string | undefined;
      prerelease?: boolean | undefined;
    } & OwnerRepo,
  ): Promise<{
    release: { name: string | null; tagName: string; htmlUrl: string };
  }> {
    throw new Error('Function updateRelease not implemented.');
  },
  getAllTags: function (args: OwnerRepo): Promise<{
    tags: { tagName: string; tagSha: string; tagType: 'tag' | 'commit' }[];
  }> {
    throw new Error('Function getAllTags not implemented.');
  },
  getAllReleases: function (args: OwnerRepo): Promise<{
    releases: {
      id: number;
      name: string | null;
      tagName: string;
      createdAt: string | null;
      htmlUrl: string;
    }[];
  }> {
    throw new Error('Function getAllReleases not implemented.');
  },
  getTag: function (args: { tagSha: string } & OwnerRepo): Promise<{
    tag: {
      date: string;
      username: string;
      userEmail: string;
      objectSha: string;
    };
  }> {
    throw new Error('Function getTag not implemented.');
  },
};
