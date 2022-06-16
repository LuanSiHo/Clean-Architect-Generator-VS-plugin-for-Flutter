import * as vscode from 'vscode';
import { window, InputBoxOptions, workspace, WorkspaceConfiguration } from 'vscode';
import * as yaml from "js-yaml";
import { FileManager } from "./file_manager";

export class ProjectManager {

    static getProjectPackageName(): string {
        let json = this.getPubspecJsonFile() ?? "";
        let object = JSON.parse(json);
        let projectPackage = object["name"];
        return projectPackage ?? "";
    }

    private static getPubspecJsonFile(): string | undefined {
        let rootPath = FileManager.rootPath;
        let fileData = FileManager.readFileAsString(rootPath, "pubspec.yaml");
        if (fileData === undefined) {
            console.debug("Pubspec.yaml not found");
            return undefined;
        }
        let data = ProjectManager.toJSON(fileData);
        return data;
    }

    private static toJSON(text: string) {
        let json;
        try {
            console.debug(`toJSON: ${text}`);
            json = yaml.load(text, { schema: yaml.JSON_SCHEMA });
        } catch (e) {
            vscode.window.showErrorMessage("Could not parse the selection as YAML.");
            return;
        }
        return JSON.stringify(json, null, this.getIndent());
    }


    public static getEditorConfiguration(): WorkspaceConfiguration {
        let configuration = workspace.getConfiguration("editor");
        return configuration;
    }

    private static getIndent(): number {
        const editorCfg = ProjectManager.getEditorConfiguration();
        if (editorCfg && editorCfg.get("insertSpaces")) {
            const tabSize = editorCfg.get("tabSize");
            if (tabSize && typeof tabSize === "number") {
                return tabSize;
            }
        }
        return 2;
    }
}