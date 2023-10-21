import type { AWS } from '@serverless/typescript';

import hello from '@functions/http/hello';
import getGroups from '@functions/http/getGtoups';
import createGroup from '@functions/http/createGtoup';
import getGtoupImages from '@functions/http/getGtoupImages';
import websocketConnect from '@functions/websocket/websocketConnect';
import websocketDisconnect from '@functions/websocket/websocketDisconnect';
import getImage from '@functions/http/getImage';
import createImage from '@functions/http/createImage';
import sendUploadNotifications from '@functions/s3/sendUploadNotifications';
import resizeImage from '@functions/s3/resizeImage';
import hs256Auth0Authorizer from '@functions/auth/hs256Auth0Authorizer';
// import elasticSearchSync from '@functions/dynamoDb/elasticSearchSync';
import {DynamoDBTableGroup} from './src/resources/dynamo_db_table_group';
import {DynamoDBTableImage} from './src/resources/dynamo_db_table_image';
import {DynamoDBTableWebsokcetConnectinos} from './src/resources/dynamo_db_table_websocket_connections';
import {S3Bucket} from './src/resources/s3_bucket';
import {S3BucketThumpnails} from './src/resources/s3_bucket_thumpnails';
import {BucketPolicy} from './src/resources/bucket_policy';
import {BucketPolicyThumpnails} from './src/resources/bucket_policy_thumpnails';
import {SendUploadNotificationsPermission} from './src/resources/send_upload_notifications_permission';
import {GatewayResponseDefault4XX} from './src/resources/gateway_response_default_4xx';
import {KMSKey} from './src/resources/kms_key';
import {KMSKeyAlias} from './src/resources/kms_key_alias';
import {Auth0Secret} from './src/resources/auth0_secret';
// import {ElasticSearchCluster} from './src/resources/elastic_search_cluster';
import {SNSTopicImages} from './src/resources/sns_topic_images';
import {SNSTopicPolicy} from './src/resources/sns_topic_policy';

const serverlessConfiguration: AWS = {
  configValidationMode: 'error',
  service: 'myservice',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
  ],
  provider: {
    stage: "${opt: stage, 'dev'}",
    region: 'us-east-1',
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      metrics: true,
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      GROUPS_TABLE: "Groups-${self:provider.stage}",
      IMAGES_TABLE: "Images-${self:provider.stage}",
      CONNECTIONS_TABLE: "Connections-${self:provider.stage}",
      IMAGE_ID_INDEX: "ImageIdIndex",
      IMAGES_S3_BUCKET: "myservice-attachments-${self:provider.stage}",
      SIGNED_URL_EXPIRATION: "300",
      THUMBNAILS_S3_BUCKET: "myservice-attachments-thumbnail-${self:provider.stage}",
      AUTH_0_SECRET_ID: "Auth0Secret-${self:provider.stage}",
      AUTH_0_SECRET_FIELD: "auth0Secret",
    },
    iam:{
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:PutItem',
              'dynamodb:GetItem',
            ],
            Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.GROUPS_TABLE}",
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:PutItem',
            ],
            Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.IMAGES_TABLE}",
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
            ],
            Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.IMAGES_TABLE}/index/${self:provider.environment.IMAGE_ID_INDEX}",
          },
          {
            Effect: 'Allow',
            Action: [
              's3:GetObject',
              's3:PutObject',
            ],
            Resource: "arn:aws:s3:::${self:provider.environment.IMAGES_S3_BUCKET}/*",
          },
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Scan',
              'dynamodb:PutItem',
              'dynamodb:DeleteItem',
            ],
            Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}",
          },
          {
            Effect: 'Allow',
            Action: [
              's3:PutObject',
            ],
            Resource: "arn:aws:s3:::${self:provider.environment.THUMBNAILS_S3_BUCKET}/*",
          },
          {
            Effect: 'Allow',
            Action: ['secretsmanager:GetSecretValue'],
            Resource: { Ref: 'Auth0Secret' },
          },
          {
            Effect: 'Allow',
            Action: ['kms:Decrypt'],
            Resource: { 'Fn::GetAtt': ['KMSKey', 'Arn'] },
          },
        ],
      }
    }
  },
  // import the function via paths
  functions: {
     hs256Auth0Authorizer,
     hello,
     getGroups,
     createGroup,
     getGtoupImages,
     getImage,
     createImage,
     sendUploadNotifications,
     websocketConnect,
     websocketDisconnect,
     resizeImage,
    //  elasticSearchSync,
  },
  // create resources
  resources: {
    Resources: {
      GatewayResponseDefault4XX: GatewayResponseDefault4XX,
      DynamoDBTableGroup: DynamoDBTableGroup,
      DynamoDBTableImage: DynamoDBTableImage,
      DynamoDBTableWebsokcetConnectinos: DynamoDBTableWebsokcetConnectinos,
      SNSTopicImages: SNSTopicImages,
      SNSTopicPolicy: SNSTopicPolicy,
      S3Bucket: S3Bucket,
      S3BucketThumpnails: S3BucketThumpnails,
      BucketPolicy: BucketPolicy,
      BucketPolicyThumpnails: BucketPolicyThumpnails,
      SendUploadNotificationsPermission: SendUploadNotificationsPermission,
      KMSKey,
      KMSKeyAlias,
      Auth0Secret,
      // ElasticSearchCluster: ElasticSearchCluster,
    }
  },
  package: { individually: true },
  custom: {
    // we cuould add to to environment variable as usual, be we don't need to pass it to lambda function
    topicName: "snsTopicImages-${self:provider.stage}",
    topicArn: "arn:aws:sns:${self:provider.region}:${AWS::AccountId}:${self:custom.topicName}",
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
