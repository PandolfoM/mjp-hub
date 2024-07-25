import {
  CreateDomainAssociationCommand,
  CreateDomainAssociationCommandInput,
} from "@aws-sdk/client-amplify";
import { amplifyClient } from "./amplifyClient";

export async function AWSCreateDomain(
  params: CreateDomainAssociationCommandInput
) {
  try {
    const command = new CreateDomainAssociationCommand(params);
    const res = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Creating Domain:", error);
  }
}
