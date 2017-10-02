import uuid from "uuid";
import AWS from 'aws-sdk';
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

AWS.config.update({region:'ap-southeast-2'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'entry',
    Item: { // need journalId, which may be from pathParamaeters
      journalId: event.requestContext.journalId,
      entryId: uuid.v1(),
      title: data.title, // possibly add a 'current'
      content: data.content,
      entryState: data.entryState,
      createdDate: new Date().getTime(),
      updateDate: new Date().getTime()
    }
  };
  console.log(data);

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
};
