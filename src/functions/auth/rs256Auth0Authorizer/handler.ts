
import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { JwtToken } from '../../../auth/JwtToken'
var jwt = require('jsonwebtoken');


/**
 * Validae user token,
 * Using asymetric algorithm RS256
 * Where we need to use a certificate to validate a token
 * 
 * REMEBER: to change auth0 to sign with rs256 from settings
 */

const cert = `-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIJeaN5qThoHD6HMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMTFWFsaGFydGhpLmV1LmF1dGgwLmNvbTAeFw0yMzA5MjUxMjM3NDFaFw0zNzA2
MDMxMjM3NDFaMCAxHjAcBgNVBAMTFWFsaGFydGhpLmV1LmF1dGgwLmNvbTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALTlCveu9qg1TIPnLy+UEZ6x5csy
PRaTk4S8/p3FycfuYgnHekeTd4hffmvWjS5bKVtLk4pxldIyzA4Fx8pucKBYOk8M
rfGK9xZp5H+TJ77JvT4ZFF1knGp0fRZ2qJ31+IBs1bRE206CBspXKNQb/Mg6KVak
WDCNB2NzFAIsdU7hofiVwh73tkKjLCGOEefAwt/MtxitgD4iQLWjwTq2pBwRrwCI
BZ6xA8UAMzWFlOo9vwWYnQhHlfwoBho1aU+uBpQtC0dyfXSuOJswADFqDpON4FvD
W+5NAI0z1iP3rs8ByebXiQnyu7+wIaFc3693mi/kFbYWF13qWCgV/u1B1FsCAwEA
AaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU+aT6PxpJbXJl7POJSJQq
VVDBatMwDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCSHyxB3nH6
X/yhvgob945BYr6aiDIlHU/5VrZDxib9R/3T+OY5dz2szu9yW8s741HaPSWEyOse
GsrA8i2sj1jZkV3qL45D+roJSmcEMz59e77BTbkUWbC7pfovh6BNdYNyH1KiozAm
U6IywkV/gpjHuxMM7B3w1IJGae8rGDVIk/ZuZsYVR/54aVjsOO+blob96Q1zo9ph
93c9AfD5J00Jz9NjlOJqW5lATe6JwjqN796pBMvCsZZwfi9sYV2OZ7G3IkDtVSbM
FRjyRWV0y5fbwOhtjiqGvfTQ6u+O8FZ1cEoTPiMaPZ+sp5W6/lZ/4CnCoLGce93P
k85VgCKNB9ud
-----END CERTIFICATE-----`

const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub, // unique user id
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
    console.log('User authorized', e.message)

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
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return jwt.verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}

export const main = handler;