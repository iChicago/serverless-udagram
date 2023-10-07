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
import elasticSearchSync from '@functions/dynamoDb/elasticSearchSync';
import {DynamoDBTableGroup} from './src/resources/dynamo_db_table_group';
import {DynamoDBTableImage} from './src/resources/dynamo_db_table_image';
import {DynamoDBTableWebsokcetConnectinos} from './src/resources/dynamo_db_table_websocket_connections';
import {S3Bucket} from './src/resources/s3_bucket';
import {BucketPolicy} from './src/resources/bucket_policy';
import {SendUploadNotificationsPermission} from './src/resources/send_upload_notifications_permission';
import {ElasticSearchCluster} from './src/resources/elastic_search_cluster';

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
      THUMBNAILS_S3_BUCKET: "serverless-udagram-thumbnail-${self:provider.stage}",
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
        ],
      }
    }
  },
  // import the function via paths
  functions: {
     hello,
     getGroups,
     createGroup,
     getGtoupImages,
     getImage,
     createImage,
     sendUploadNotifications,
     websocketConnect,
     websocketDisconnect,
     elasticSearchSync,
  },
  // create resources
  resources: {
    Resources: {
      DynamoDBTableGroup: DynamoDBTableGroup,
      DynamoDBTableImage: DynamoDBTableImage,
      DynamoDBTableWebsokcetConnectinos: DynamoDBTableWebsokcetConnectinos,
      S3Bucket: S3Bucket,
      BucketPolicy: BucketPolicy,
      SendUploadNotificationsPermission: SendUploadNotificationsPermission,
      ElasticSearchCluster: ElasticSearchCluster,
    }
  },
  package: { individually: true },
  custom: {
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
