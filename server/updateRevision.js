import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "revision",
    Key: {
      entryId: event.requestContext.entryId,
      revisionId: event.pathParameters.id
    },
    UpdateExpression: "SET content = :content, modificationReason = :modificationReason",
    ExpressionAttributeValues: {
      ":content": data.content ? data.content : null,
      ":modificationReason": data.modificationReason ? data.modificationReason : null
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
