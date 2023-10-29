import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { JwtToken } from '../../../auth/JwtToken'
import middy from '@middy/core'
//import secretsManager from '@middy/secrets-manager'
import * as AWS from 'aws-sdk';
var jwt = require('jsonwebtoken');
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

/**
 * Validae user token,
 * Using symetric algorithm HS256
 * Where we need to use a secret to validate a token
 */

const secretId = process.env.AUTH_0_SECRET_ID
const secretField = process.env.AUTH_0_SECRET_FIELD
const secretManagerClient = new XAWS.SecretsManager();

// cache secret if the same lambda instance is reused. to save some mony.
let cachedSecret: string;

const handler = middy(async (event: APIGatewayTokenAuthorizerEvent , context): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = await verifyToken(
      event.authorizationToken,
      "auth0Secret",//context["AUTH0_SECRET"][secretField]
    )
    console.log('User was authorized', decodedToken)

    return {
      principalId: decodedToken.sub, //sub is user id
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
});

async function verifyToken(authHeader: string, secret: string): Promise<JwtToken> {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  // if we are not using middileware, we can get the secret like this
  const secretsObject: any = await getSecretsObject();
  console.log('secret was returned ', secretsObject[secretField]);
  const secretFromSecretManager = secretsObject[secretField];

  return jwt.verify(token, secretFromSecretManager) as JwtToken
}

// will be using middleware instead
async function getSecretsObject(){
  if(cachedSecret) return cachedSecret;

  const data = await secretManagerClient.getSecretValue({SecretId: secretId}).promise();
  cachedSecret = data.SecretString;

  return JSON.parse(cachedSecret);
}

// secretsManager({
//   fetchData: {
//     apiToken: 'dev/api_token'
//   },
//   awsClientOptions: {
//     region: 'us-east-1'
//   },
//   setToContext: true
// })

// handler.use(
//   secretsManager({
//     cacheExpiry: 60000,
//     // Throw an error if can't read the secret
//     throwOnFailedCall: true,
//     secrets: {
//       AUTH0_SECRET: secretId
//     }
//   })
// )

export const main = handler;