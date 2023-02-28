"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTemplate = void 0;
const slugify_1 = __importDefault(require("@sindresorhus/slugify"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const config_1 = require("./helpers/config");
const git_1 = require("./helpers/git");
const secrets_1 = require("./helpers/secrets");
const workflows_1 = require("./helpers/workflows");
const updateTemplate = async () => {
    const [owner, repo] = (0, secrets_1.getOwnerRepo)();
    const config = await (0, config_1.getConfig)();
    // Remove our workflows (not all workflows)
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "graphs.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "response-time.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "setup.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "site.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "summary.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "update-template.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "updates.yml"));
    await (0, fs_extra_1.remove)((0, path_1.join)(".", ".github", "workflows", "uptime.yml"));
    console.log("Removed legacy .github/workflows");
    // Clone and create workflows from this repo
    await (0, fs_extra_1.ensureDir)((0, path_1.join)(".", ".github", "workflows"));
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "graphs.yml"), await (0, workflows_1.graphsCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "response-time.yml"), await (0, workflows_1.responseTimeCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "setup.yml"), await (0, workflows_1.setupCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "site.yml"), await (0, workflows_1.siteCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "summary.yml"), await (0, workflows_1.summaryCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "update-template.yml"), await (0, workflows_1.updateTemplateCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "updates.yml"), await (0, workflows_1.updatesCiWorkflow)());
    await (0, fs_extra_1.writeFile)((0, path_1.join)(".", ".github", "workflows", "uptime.yml"), await (0, workflows_1.uptimeCiWorkflow)());
    console.log("Added new .github/workflows");
    // Delete these specific template files
    const delteFiles = ["README.pt-br.md", ".templaterc.json"];
    for await (const file of delteFiles)
        try {
            if (`${owner}/${repo}` !== "upptime/upptime")
                await (0, fs_extra_1.remove)((0, path_1.join)(".", file));
        }
        catch (error) { }
    console.log("Removed template files");
    const slugs = config.sites.map((site) => site.slug || (0, slugify_1.default)(site.name));
    const filesToKeep = ["LICENSE", "summary.json"];
    // Remove old data from ./api
    try {
        const apiData = await (0, fs_extra_1.readdir)((0, path_1.join)(".", "api"));
        for await (const file of apiData)
            if (!filesToKeep.includes(file) && !slugs.includes(file))
                await (0, fs_extra_1.remove)((0, path_1.join)(".", "api", file));
        console.log("Removed old data from api");
    }
    catch (error) {
        console.log(error);
    }
    // Remove old data from ./graphs
    try {
        const graphsData = await (0, fs_extra_1.readdir)((0, path_1.join)(".", "graphs"));
        for await (const file of graphsData)
            if (!filesToKeep.includes(file) && !slugs.includes(file.replace(".png", "")))
                await (0, fs_extra_1.remove)((0, path_1.join)(".", "graphs", file));
        console.log("Removed old data from graphs");
    }
    catch (error) {
        console.log(error);
    }
    // Remove old data from ./history
    try {
        const historyData = await (0, fs_extra_1.readdir)((0, path_1.join)(".", "history"));
        for await (const file of historyData)
            if (!filesToKeep.includes(file) && !slugs.includes(file.replace(".yml", "")))
                await (0, fs_extra_1.remove)((0, path_1.join)(".", "history", file));
        console.log("Removed old data from history");
    }
    catch (error) {
        console.log(error);
    }
    (0, git_1.commit)(`:arrow_up: Update @upptime to ${await (0, workflows_1.getUptimeMonitorVersion)()}`);
    (0, git_1.push)();
    console.log("All done!");
};
exports.updateTemplate = updateTemplate;
//# sourceMappingURL=update-template.js.map