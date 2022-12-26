const core = require('@actions/core');
const { context, GitHub } = require('@actions/github');

async function run() {
    try {
        //Get input
        const tag = process.env.TAG || process.env.INPUT_TAG || '';
        console.log(`Searching for tag: ${tag}`);

        // Get owner and repo from context of payload that triggered the action
        const { owner, repo } = context.repo

        const github = new GitHub(process.env.GITHUB_TOKEN);
        let exists = 'false';
        let version = 1;

        try {
            const getRefResponse = await github.git.listRefs({
                owner,
                repo,
                ref: `tags`
            });

            if (getRefResponse.status === 200) {
                const tags = getRefResponse.data.filter((e) => e.ref && e.ref.includes(tag))
                if (tags.length) {
                    console.log("Tag was found");
                    exists = 'true';
                }
                version = tags.length + 1
            }
        } catch(error) {
            console.log("Tag was not found");
        }

        core.setOutput('exists', exists);
        core.setOutput('version', version);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();