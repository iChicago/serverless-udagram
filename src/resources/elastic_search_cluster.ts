import { ResourceTypes } from '../../constants';

/**
 * AWS provides multiple ways to restrict access to a Kibana dashboard. 
 * One option to restrict access to Kibana (https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-cognito-auth.html) 
 * would be to use Amazon Cognito (https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html), 
 * service for authentication, authorization, and user management.
 * 
 * Also, you can check if the cluster is created by running the following command
 * aws es list-domain-names
 * aws es describe-elasticsearch-domain --domain-name <domain-name-form-command-above>
 * 
 * search-images-search-dev-4pod2bcbxijtubuls74nzp52v4.us-east-1.es.amazonaws.com/_plugin/kibana
 * if you can't access kibana, you may need to change to do the following updaet
 * Action: 'es:ESHttp*',
 */

export const ElasticSearchCluster = {
  Type: ResourceTypes.AWS_Elasticsearch_Domain,
  Properties: {
    ElasticsearchVersion: '6.3',
    DomainName: "images-search-${self:provider.stage}",
    ElasticsearchClusterConfig: {
      DedicatedMasterEnabled: "false",
      InstanceCount: '1',
      ZoneAwarenessEnabled: "false",
      InstanceType: "t2.small.elasticsearch",
    },
    EBSOptions: {
      EBSEnabled: "true",
      Iops: "0",
      VolumeSize: "10",
      VolumeType: 'gp2',
    },
    AccessPolicies: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            AWS: '*'
          },
          Action: 'es:ESHttp*',
          Resource: "arn:aws:es:${self:provider.region}:${AWS::AccountId}:domain/images-search-${self:provider.stage}/*",
        }
      ],
    }
  },
};