import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';
import { DeploymentTypes } from '../../../../constants';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'groups',
        cors: true,
        authorizer: {
          //name: 'hs256Auth0Authorizer',
          name: 'rs256Auth0Authorizer',
        }, 
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
  deploymentSettings: {
    type: DeploymentTypes.Linear10PercentEvery1Minute,
    alias: "CreateGroupAlias"
  },
};
