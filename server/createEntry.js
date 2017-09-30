import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "entry",
    Item: { // need journalId, which may be from pathParamaeters
      journalId: event.requestContext.journalId,
      entryId: uuid.v1(),
      title: data.title, // possibly add a 'current'
      // encapsulate in a state variable, don't need deleted or hidden when creating
      hidden: "false",
      deleted: "false",
      createdAt: new Date().getTime()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
