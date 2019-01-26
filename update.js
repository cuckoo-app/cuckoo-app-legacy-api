import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "jobs",
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'jobId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      jobId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET dateModified = :dateModified, " +
                      "jobStatus = :jobStatus, runtime = :runtime, " +
                      "stdout = :stdout",
    ExpressionAttributeValues: {
      ":dateModified": data.dateModified || null,
      ":jobStatus": data.jobStatus || null,
      ":runtime": data.runtime || null,
      ":stdout": data.stdout || null,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.log(e)
    return failure({ status: false });
  }
}
