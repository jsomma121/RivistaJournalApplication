import uuid from 'uuid';
import AWS from 'aws-sdk';
import * as dynamoDbLib from './libs/dynamodb-lib';
import {success, failure } from './libs/response-lib';

AWS.config.update({region:'ap-southeast-2'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'journal',
    Item: {
      userid: event.requestContext.identity.cognitoIdentityId,
      journalid: uuid.v1(),
      journalTitle: data.journalTitle,
      enteries: [],
      createdAt: new Date().getTime()  
    }
  };

  try {
    const result = await dynamoDbLib.call('put', params);
    callback(null, success(params.Item));

  } catch(e) {
      console.log(e.body);
      callback(null, failure({status:failure}))

  }
};