import {
  CreateAppCommand,
  CreateAppCommandInput,
  CreateAppCommandOutput,
  CreateBranchCommand,
  CreateBranchCommandInput,
  CreateBranchCommandOutput,
  CreateDomainAssociationCommand,
  CreateDomainAssociationCommandInput,
  CreateDomainAssociationCommandOutput,
  DeleteAppCommand,
  DeleteAppCommandInput,
  DeleteAppCommandOutput,
  DeleteDomainAssociationCommand,
  DeleteDomainAssociationCommandInput,
  DeleteDomainAssociationCommandOutput,
  GetDomainAssociationCommand,
  GetDomainAssociationCommandInput,
  GetDomainAssociationCommandOutput,
  GetJobCommand,
  GetJobCommandInput,
  GetJobCommandOutput,
  StartJobCommand,
  StartJobCommandInput,
  StartJobCommandOutput,
  UpdateAppCommand,
  UpdateAppCommandInput,
  UpdateAppCommandOutput,
} from "@aws-sdk/client-amplify";
import { amplifyClient, route53Client } from "./amplifyClient";
import {
  ChangeResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommandInput,
  ChangeResourceRecordSetsCommandOutput,
  CreateHostedZoneCommand,
  CreateHostedZoneCommandInput,
  CreateHostedZoneCommandOutput,
  DeleteHostedZoneCommand,
  DeleteHostedZoneCommandInput,
  DeleteHostedZoneCommandOutput,
  ListResourceRecordSetsCommand,
  ListResourceRecordSetsCommandInput,
  ListResourceRecordSetsCommandOutput,
} from "@aws-sdk/client-route-53";

//! Amplify commands
export async function AWSCreateDomain(
  params: CreateDomainAssociationCommandInput
): Promise<CreateDomainAssociationCommandOutput | undefined> {
  try {
    const command = new CreateDomainAssociationCommand(params);
    const res: CreateDomainAssociationCommandOutput = await amplifyClient.send(
      command
    );
    return res;
  } catch (error) {
    console.log("Error Creating Domain:", error);
    return undefined;
  }
}

export async function AWSDeleteDomain(
  params: DeleteDomainAssociationCommandInput
): Promise<DeleteDomainAssociationCommandOutput | undefined> {
  try {
    const command = new DeleteDomainAssociationCommand(params);
    const res: DeleteDomainAssociationCommandOutput = await amplifyClient.send(
      command
    );
    return res;
  } catch (error) {
    console.log("Error Deleting Domain:", error);
    return undefined;
  }
}

export async function AWSGetDomain(
  params: GetDomainAssociationCommandInput
): Promise<GetDomainAssociationCommandOutput | undefined> {
  try {
    const command = new GetDomainAssociationCommand(params);
    const res: GetDomainAssociationCommandOutput = await amplifyClient.send(
      command
    );
    return res;
  } catch (error) {
    // console.log("Error Getting Domain:", error);
    return undefined;
  }
}

export async function AWSUpdateApp(
  params: UpdateAppCommandInput
): Promise<UpdateAppCommandOutput | undefined> {
  try {
    const command = new UpdateAppCommand(params);
    const res: UpdateAppCommandOutput = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Updating App:", error);
    return undefined;
  }
}

export async function AWSDeleteApp(
  params: DeleteAppCommandInput
): Promise<DeleteAppCommandOutput | undefined> {
  try {
    const command = new DeleteAppCommand(params);
    const res: DeleteAppCommandOutput = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Updating App:", error);
    return undefined;
  }
}

export async function AWSCreateApp(
  params: CreateAppCommandInput
): Promise<CreateAppCommandOutput | undefined> {
  try {
    const command = new CreateAppCommand(params);
    const res: CreateAppCommandOutput = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Creating App:", error);
    return undefined;
  }
}

export async function AWSCreateBranch(
  params: CreateBranchCommandInput
): Promise<CreateBranchCommandOutput | undefined> {
  try {
    const command = new CreateBranchCommand(params);
    const res: CreateBranchCommandOutput = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Creating Branch:", error);
    return undefined;
  }
}

export async function AWSStartJob(
  params: StartJobCommandInput
): Promise<StartJobCommandOutput | undefined> {
  try {
    const command = new StartJobCommand(params);
    const res: StartJobCommandOutput = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Starting Job:", error);
    return undefined;
  }
}

export async function AWSGetJob(
  params: GetJobCommandInput
): Promise<GetJobCommandOutput | undefined> {
  try {
    const command = new GetJobCommand(params);
    const res: GetJobCommandOutput = await amplifyClient.send(command);
    return res;
  } catch (error) {
    console.log("Error Getting Job:", error);
    return undefined;
  }
}

//! Route53 Commands
export async function AWSListRecords(
  params: ListResourceRecordSetsCommandInput
): Promise<ListResourceRecordSetsCommandOutput | undefined> {
  try {
    const command = new ListResourceRecordSetsCommand(params);
    const res: ListResourceRecordSetsCommandOutput = await route53Client.send(
      command
    );
    return res;
  } catch (error) {
    console.log("Error Listing Records:", error);
    return undefined;
  }
}

export async function AWSChangeRecords(
  params: ChangeResourceRecordSetsCommandInput
): Promise<ChangeResourceRecordSetsCommandOutput | undefined> {
  try {
    const command = new ChangeResourceRecordSetsCommand(params);
    const res: ChangeResourceRecordSetsCommandOutput = await route53Client.send(
      command
    );
    return res;
  } catch (error) {
    console.log("Error Changing Records:", error);
    return undefined;
  }
}

export async function AWSCreateHostedZone(
  params: CreateHostedZoneCommandInput
): Promise<CreateHostedZoneCommandOutput | undefined> {
  try {
    const command = new CreateHostedZoneCommand(params);
    const res: CreateHostedZoneCommandOutput = await route53Client.send(
      command
    );
    return res;
  } catch (error) {
    console.log("Error Creating Hosted Zone:", error);
    return undefined;
  }
}

export async function AWSDeleteHostedZone(
  params: DeleteHostedZoneCommandInput
): Promise<DeleteHostedZoneCommandOutput | undefined> {
  try {
    const command = new DeleteHostedZoneCommand(params);
    const res: DeleteHostedZoneCommandOutput = await route53Client.send(
      command
    );
    return res;
  } catch (error) {
    console.log("Error Deleting Hosted Zone:", error);
    return undefined;
  }
}
