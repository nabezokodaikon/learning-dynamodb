import {
  createClient
} from "https://raw.githubusercontent.com/chiefbiiko/dynamodb/8d7cd9f1c7ce028dbf0ad15d6b90665e40d30953/mod.ts";
import {
  ClientConfig,
  Credentials,
  Doc,
  DynamoDBClient,
} from "https://raw.githubusercontent.com/chiefbiiko/dynamodb/8d7cd9f1c7ce028dbf0ad15d6b90665e40d30953/mod.ts";
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Context,
} from "https://deno.land/x/lambda@1.11.0/mod.ts";
import "https://deno.land/x/dotenv@v2.0.0/load.ts";


function ok(body: unknown, statusCode = 200): APIGatewayProxyResultV2 {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}

function error(message: string, statusCode = 500): APIGatewayProxyResultV2 {
  return ok({ message: message }, statusCode);
}

async function getPerson(person_id: string): Promise<APIGatewayProxyResultV2> {
  const credentials: Credentials = {
    accessKeyId: Deno.env.get("ACCESS_KEY_ID") as string,
    secretAccessKey: Deno.env.get("SECRET_ACCESS_KEY") as string,
  };
  const clientConfig: ClientConfig = {
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
  _: Context
): Promise<APIGatewayProxyResultV2> {
  const personId = (event as any)["record"]["person_id"];
  console.log(personId);
  const res = await getPerson(personId);
  return res;
}
