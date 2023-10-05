import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "${self:provider.environment.IMAGES_S3_BUCKET}",
        existing: true,
        forceDeploy: true,
        event: "s3:ObjectCreated:*",
        rules: [
          { prefix: 'images/'},
          { suffix: '.png'},
        ],
      }
    },
  ],
};
