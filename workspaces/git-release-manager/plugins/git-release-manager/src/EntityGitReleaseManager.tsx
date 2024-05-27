import { useEntity } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
import { Alert } from '@material-ui/lab';
import { GitReleaseManagerFeaturesProps } from './GitReleaseManager';
import { ProjectContext } from './contexts/ProjectContext';
import { UserContext } from './contexts/UserContext';
import { GITHUB_PROJECT_SLUG_ANNOTATION, gitReleaseManagerApiRef } from '.';
import { ContentHeader, Progress } from '@backstage/core-components';
import { InfoCardPlus } from './components';
import { RepoDetailsForm } from './features/RepoDetailsForm/RepoDetailsForm';
import { isProjectValid } from './helpers';
import { Features } from './features/Features';
import { useApi } from '@backstage/core-plugin-api';

const buildProject: Project = (entity: Entity) => {
  const projectSlug =
    entity?.metadata.annotations?.[GITHUB_PROJECT_SLUG_ANNOTATION] || '';

  const [owner, repo] = projectSlug.split('/');

  return {
    owner,
    repo,
    isProvidedViaProps: true,
  };
};

export function EntityGitReleaseManager(props: {
  versioningStrategy: string;
  features?: GitReleaseManagerFeaturesProps;
}) {
  const { entity } = useEntity();

  const project: Project = buildProject(entity);

  const pluginApiClient = useApi(gitReleaseManagerApiRef);

  if (isProjectValid(project)) {
    return <Alert severity="error">Project is not valid</Alert>;
  }

  const userResponse = useAsync(() =>
    pluginApiClient.getUser({ owner: project.owner, repo: project.repo }),
  );

  if (userResponse.error) {
    return <Alert severity="error">{userResponse.error.message}</Alert>;
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
        <div maxWidth={999}>
          <ContentHeader title="Git Release Manager" />

          <InfoCardPlus>
            <RepoDetailsForm />
          </InfoCardPlus>

          {isProjectValid(project) && <Features features={props} />}
        </div>
      </UserContext.Provider>
    </ProjectContext.Provider>
  );
}
