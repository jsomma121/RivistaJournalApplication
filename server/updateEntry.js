import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "entry",
    Key: {
      journalId: event.requestContext.journalId,
      entryId: event.pathParameters.id
    },
    UpdateExpression: "SET title = :title, hidden = :hidden, deleted = :deleted",
    ExpressionAttributeValues: {
      ":title": data.title ? data.title : null,
      ":hidden": data.hidden ? data.hidden : null,
      ":deleted": data.deleted ? data.deleted : null,
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    callback(null, success({ status: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
