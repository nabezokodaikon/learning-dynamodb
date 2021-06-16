import "https://deno.land/x/dotenv@v2.0.0/load.ts";

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "https://deno.land/x/lambda@1.11.0/mod.ts";

import {
  createClient,
  Doc,
  DynamoDBClient,
} from "./deps.ts";


function ok(body: unknown, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

function error(message: string, statusCode = 500) {
  return ok({ message: message }, statusCode);
}

async function getPerson(person_id: string) {
  const credentials = {
    accessKeyId: Deno.env.get("ACCESS_KEY_ID") as string,
    secretAccessKey: Deno.env.get("SECRET_ACCESS_KEY") as string,
  };
  const clientConfig = {
    credentials: credentials,
    region: "us-east-1",
  };
  const client: DynamoDBClient = createClient(clientConfig);
  const tableName = "learning-dynamodb";
  const params = {
    TableName: tableName,
    Key: {
      person_id: person_id
    }
  };

  let result: Doc;
  try {
    result = await client.getItem(params);
  } catch (e) {
    return error(`unable to getItem\n${e}`);
  }

  if (result.Item) {
    return ok(result.Item);
  } else {
    return error(`Not Found: ${person_id}`, 404);
  }
}

export async function main(
  event: APIGatewayProxyEventV2,
  context: Context
) {
  return await getPerson("001");
}
