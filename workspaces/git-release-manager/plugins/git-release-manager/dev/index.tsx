/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityGridItem, createDevApp } from '@backstage/dev-utils';
import { Box, Button, Typography, Grid } from '@material-ui/core';

import {
  gitReleaseManagerPlugin,
  GitReleaseManagerPage,
  EntityGitReleaseManager,
  gitReleaseManagerApiRef,
} from '../src/plugin';
import { InfoCardPlus } from '../src/components/InfoCardPlus';
import { Content, Header, Page } from '@backstage/core-components';
import { GITHUB_PROJECT_SLUG_ANNOTATION } from '../src';
import { GitReleaseApi } from '../src/api/GitReleaseClient';

const mockGitReleaseManagerApi: GitReleaseApi = {
  getUser: _args =>
    Promise.resolve({
      user: {
        username: 'backstage-user',
        email: 'guest@backstage.io',
      },
    }),
  getHost: function (): string {
    throw new Error('Function getHost not implemented.');
  },
  getRepoPath: function (args: { owner: string; repo: string }): string {
    throw new Error('Function getRepoPath not implemented.');
  },
  getOwners: () => Promise.resolve({ owners: ['backstage-user'] }),
  getRepositories: function (args: {
    owner: string;
  }): Promise<{ repositories: string[] }> {
    throw new Error('Function getRepositories not implemented.');
  },
  getRecentCommits: function (
    args: { releaseBranchName?: string | undefined } & {
      owner: string;
      repo: string;
    },
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
  getLatestRelease: function (args: { owner: string; repo: string }): Promise<{
    latestRelease: {
      targetCommitish: string;
      tagName: string;
      prerelease: boolean;
      id: number;
      htmlUrl: string;
      body?: string | null | undefined;
    } | null;
  }> {
    throw new Error('Function getLatestRelease not implemented.');
  },
  getRepository: function (args: { owner: string; repo: string }): Promise<{
    repository: {
      pushPermissions: boolean | undefined;
      defaultBranch: string;
      name: string;
    };
  }> {
    throw new Error('Function getRepository not implemented.');
  },
  getCommit: function (
    args: { ref: string } & { owner: string; repo: string },
  ): Promise<{
    commit: {
      sha: string;
      htmlUrl: string;
      commit: { message: string };
      createdAt?: string | undefined;
    };
  }> {
    throw new Error('Function getCommit not implemented.');
  },
  getBranch: function (
    args: { branch: string } & { owner: string; repo: string },
  ): Promise<{
    branch: {
      name: string;
      links: { html: string };
      commit: { sha: string; commit: { tree: { sha: string } } };
    };
  }> {
    throw new Error('Function getBranch not implemented.');
  },
  createRef: function (
    args: { ref: string; sha: string } & { owner: string; repo: string },
  ): Promise<{ reference: { ref: string; objectSha: string } }> {
    throw new Error('Function createRef not implemented.');
  },
  deleteRef: function (
    args: { ref: string } & { owner: string; repo: string },
  ): Promise<{ success: boolean }> {
    throw new Error('Function deleteRef not implemented.');
  },
  getComparison: function (
    args: { base: string; head: string } & { owner: string; repo: string },
  ): Promise<{ comparison: { htmlUrl: string; aheadBy: number } }> {
    throw new Error('Function getComparison not implemented.');
  },
  createRelease: function (
    args: {
      tagName: string;
      name: string;
      targetCommitish: string;
      body: string;
    } & { owner: string; repo: string },
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
    } & { owner: string; repo: string },
  ): Promise<{ tagObject: { tagName: string; tagSha: string } }> {
    throw new Error('Function createTagObject not implemented.');
  },
  createCommit: function (
    args: { message: string; tree: string; parents: string[] } & {
      owner: string;
      repo: string;
    },
  ): Promise<{ commit: { message: string; sha: string } }> {
    throw new Error('Function createCommit not implemented.');
  },
  updateRef: function (
    args: { sha: string; ref: string; force: boolean } & {
      owner: string;
      repo: string;
    },
  ): Promise<{ reference: { ref: string; object: { sha: string } } }> {
    throw new Error('Function updateRef not implemented.');
  },
  merge: function (
    args: { base: string; head: string } & { owner: string; repo: string },
  ): Promise<{
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
    } & { owner: string; repo: string },
  ): Promise<{
    release: { name: string | null; tagName: string; htmlUrl: string };
  }> {
    throw new Error('Function updateRelease not implemented.');
  },
  getAllTags: function (args: { owner: string; repo: string }): Promise<{
    tags: { tagName: string; tagSha: string; tagType: 'tag' | 'commit' }[];
  }> {
    throw new Error('Function getAllTags not implemented.');
  },
  getAllReleases: function (args: { owner: string; repo: string }): Promise<{
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
  getTag: function (
    args: { tagSha: string } & { owner: string; repo: string },
  ): Promise<{
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

const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [GITHUB_PROJECT_SLUG_ANNOTATION]: name,
      },
      name: name,
    },
  } as Entity);

createDevApp()
  .registerApi({
    api: gitReleaseManagerApiRef,
    deps: {},
    factory: () => mockGitReleaseManagerApi,
  })
  .registerPlugin(gitReleaseManagerPlugin)
  .addPage({
    title: 'Entity',
    element: (
      <Page themeId="home">
        <Header title="Entity Page" />
        <Content>
          <Grid container>
            <EntityGridItem
              xs={12}
              md={12}
              entity={entity('backstage/backstage')}
            >
              <EntityGitReleaseManager />
            </EntityGridItem>
          </Grid>
        </Content>
      </Page>
    ),
  })
  .addPage({
    title: 'Dynamic',
    path: '/dynamic',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>Configure plugin via select inputs</Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage />
      </Box>
    ),
  })
  .addPage({
    title: 'Static',
    path: '/static',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>

          <Typography>
            Configure plugin statically by passing props to the
            `GitHubReleaseManagerPage` component
          </Typography>

          <Typography variant="body2">
            Note that the static configuration points towards private
            repositories and will thus not work for everyone.
          </Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'RMaaS-semver',
            versioningStrategy: 'semver',
          }}
        />
      </Box>
    ),
  })
  .addPage({
    title: 'Omit',
    path: '/omit',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>
            Each feature can be individually omitted as well as have success
            callback attached to them
          </Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'playground-semver',
            versioningStrategy: 'semver',
          }}
          features={{
            createRc: {
              onSuccess: args => {
                // eslint-disable-next-line no-console
                console.log(
                  'Custom success callback for Create RC with the following args',
                );
                console.log(JSON.stringify(args, null, 2)); // eslint-disable-line no-console
              },
            },
            promoteRc: {
              omit: true,
            },
            patch: {
              omit: true,
            },
          }}
        />
      </Box>
    ),
  })
  .addPage({
    title: 'Custom',
    path: '/custom',
    element: (
      <Box padding={4}>
        <InfoCardPlus>
          <Typography variant="h4">Dev notes</Typography>
          <Typography>
            The custom feature's return value can either be a React Element or
            an array of React Elements.
          </Typography>
        </InfoCardPlus>

        <GitReleaseManagerPage
          project={{
            owner: 'eengervall-playground',
            repo: 'playground-semver',
            versioningStrategy: 'semver',
          }}
          features={{
            custom: {
              factory: args => {
                return (
                  <InfoCardPlus>
                    <Typography variant="h4">I'm a custom feature</Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        console.log(`Here's my args 🚀`); // eslint-disable-line no-console
                        console.log(JSON.stringify(args, null, 2)); // eslint-disable-line no-console
                      }}
                    >
                      View the arguments for this feature in the console by
                      pressing this button
                    </Button>
                  </InfoCardPlus>
                );
              },
            },
          }}
        />
      </Box>
    ),
  })
  .render();
