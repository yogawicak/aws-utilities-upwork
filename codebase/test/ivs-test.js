const { IvsClient, GetChannelCommand, CreateStreamKeyCommand, ListStreamKeysCommand, DeleteStreamKeyCommand, GetStreamCommand, GetStreamKeyCommand } = require("@aws-sdk/client-ivs");
const { spawnSync } = require("child_process");
const path = require("path");
require("dotenv").config();

function getTerraformOutputs(terrDir) {
    const res = spawnSync("terraform", ["output", "-json"], { cwd: terrDir, encoding: "utf-8" });
    if (res.status !== 0) throw new Error(res.stderr || "terraform output failed");
    return JSON.parse(res.stdout);
}

async function main() {
    const TERRAFORM_DIR = path.join(process.cwd(), "../terraform");
    const outputs = getTerraformOutputs(TERRAFORM_DIR);

    if (!outputs.ivs_channel_arn || !outputs.ivs_channel_playback_url || !outputs.ivs_ingest_endpoint) {
        throw new Error("IVS outputs not found in Terraform. Ensure IVS module is applied and outputs are defined.");
    }

    const channelArn = outputs.ivs_channel_arn.value;
    const playbackUrl = outputs.ivs_channel_playback_url.value;
    const ingestEndpoint = outputs.ivs_ingest_endpoint.value;
    const region = process.env.AWS_REGION || "us-east-1";

    const ivs = new IvsClient({ region });

    console.log("ivsChannelInfo", { channelArn, playbackUrl, ingestEndpoint });

    const channel = await ivs.send(new GetChannelCommand({ arn: channelArn }));
    console.log("channelDetails", { name: channel.channel?.name, type: channel.channel?.type, latencyMode: channel.channel?.latencyMode });

    const keys = await ivs.send(new ListStreamKeysCommand({ channelArn }));
    console.log("streamKeysCount", keys.streamKeys ? keys.streamKeys.length : 0);

    let streamKeyArn = null;
    let streamKeyValue = null;

    if (keys.streamKeys && keys.streamKeys.length > 0) {
        streamKeyArn = keys.streamKeys[0].arn;
        try {
            const got = await ivs.send(new GetStreamKeyCommand({ arn: streamKeyArn }));
            streamKeyValue = got.streamKey?.value || null;
        } catch (e) {
            console.log("getStreamKeyError", e.message);
        }
    } else {
        try {
            const created = await ivs.send(new CreateStreamKeyCommand({ channelArn }));
            streamKeyArn = created.streamKey?.arn || null;
            streamKeyValue = created.streamKey?.value || null;
            console.log("streamKeyCreated", { streamKeyArn });
        } catch (e) {
            console.log("createStreamKeyError", e.message);
        }
    }

    if (streamKeyValue) {
        const rtmpsUrl = `rtmps://${ingestEndpoint}:443/app/${streamKeyValue}`;
        console.log("rtmpsUrl", rtmpsUrl);
    } else {
        console.log("noStreamKeyValue");
    }

    try {
        const stream = await ivs.send(new GetStreamCommand({ channelArn }));
        const state = stream.stream ? stream.stream.state : "NOT_FOUND";
        console.log("streamState", state);
    } catch (e) {
        console.log("streamState", "NOT_FOUND");
    }

    if (process.env.DELETE_NEW_STREAM_KEY === "true" && streamKeyArn && streamKeyValue) {
        try {
            await ivs.send(new DeleteStreamKeyCommand({ arn: streamKeyArn }));
            console.log("streamKeyDeleted", { arn: streamKeyArn });
        } catch (e) {
            console.log("deleteStreamKeyError", e.message);
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
