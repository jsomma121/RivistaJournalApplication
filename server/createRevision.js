import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "revision",
    Item: { // need journalId, which may be from pathParamaeters
      entryId: event.requestContext.entryId,
      revisionId: uuid.v1(),
      content: data.content,
      modificationReason: data.modificationReason,
      // will either need a current attribute which modifies the previous current to false or need to be able to index the createdAt field to sort by new
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
