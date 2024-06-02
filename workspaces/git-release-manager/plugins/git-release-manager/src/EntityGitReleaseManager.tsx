import { useEntity } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import useAsync from 'react-use/esm/useAsync';
import { Alert } from '@material-ui/lab';
import { Project, ProjectContext } from './contexts/ProjectContext';
import { UserContext } from './contexts/UserContext';
import { gitReleaseManagerApiRef } from '.';
import { ErrorPanel, Progress } from '@backstage/core-components';
import { isProjectValid } from './helpers';
import { Features } from './features/Features';
import { useApi } from '@backstage/core-plugin-api';
import { GitReleaseManagerFeaturesProps } from './GitReleaseManager';
import {
  GITHUB_PROJECT_SLUG_ANNOTATION,
  GITHUB_PROJECT_VERSIONING_STRATEGY_ANNOTATION,
} from './';
import React from 'react';

const buildProject = (
  entity: Entity,
  versioningStrategy?: Project['versioningStrategy'],
): Project => {
  const projectSlug =
    entity?.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION] || '';

  const fetchVersioningStrategy =
    (entity?.metadata.annotations?.[
      GITHUB_PROJECT_VERSIONING_STRATEGY_ANNOTATION
    ] as 'semver' | 'calver') ||
    versioningStrategy ||
    'semver';

  const [owner, repo] = projectSlug.split('/');

  return {
    owner,
    repo,
    isProvidedViaProps: true,
    versioningStrategy: fetchVersioningStrategy,
  };
};

export function EntityGitReleaseManager(props: {
  versioningStrategy?: 'semver' | 'calver';
  features?: GitReleaseManagerFeaturesProps;
}) {
  const { entity } = useEntity();

  const project = buildProject(entity, props.versioningStrategy);

  const pluginApiClient = useApi(gitReleaseManagerApiRef);

  if (!isProjectValid(project)) {
    return <Alert severity="error">Project is not valid</Alert>;
  }

  const userResponse = useAsync(() =>
    pluginApiClient.getUser({ owner: project.owner, repo: project.repo }),
  );

  if (userResponse.error) {
    return (
      <ErrorPanel
        title={userResponse.error.message}
        error={userResponse.error}
      />
    );
  }

  if (userResponse.loading) {
    return <Progress />;
  }

  if (!userResponse.value?.user.username) {
    return <Alert severity="error">Unable to retrieve username</Alert>;
  }

  const user = userResponse.value.user;

  return (
    <ProjectContext.Provider value={{ project }}>
      <UserContext.Provider value={{ user }}>
        {isProjectValid(project) && <Features features={props.features} />}
      </UserContext.Provider>
    </ProjectContext.Provider>
  );
}
