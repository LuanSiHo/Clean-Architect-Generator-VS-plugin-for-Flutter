import { WriteFileOptions, writeFileSync, existsSync, readFile, readFileSync, fstat } from "fs";
import * as path from 'path';
import * as vscode from 'vscode';
import { window, InputBoxOptions, workspace, WorkspaceConfiguration } from 'vscode';
import { isUndefined } from 'util';
import * as fs from "fs";

export class FileManager {
    static isFlutterProject() {
        let rootPath = FileManager.rootPath;
        if (!existsSync(path.join(rootPath, 'pubspec.yaml'))) {
            vscode.window.showErrorMessage('pubspec.yaml not found')
            return false;
        }
        return true;
    }

    static get rootPath() {
        let rootPath = workspace.rootPath;
        if (isUndefined(rootPath)) {
            return '';
        }
        return rootPath;
    }

    static readFileAsString(filePath: string, fileName: string): string | undefined {
        if (!this.doesFileExist(filePath, fileName)) { return undefined; }
        let fileBuffer = readFileSync(path.join(filePath, fileName));
        let fileData = fileBuffer.toString();
        return fileData;
    }

    static createDirectory(dirPath: string) {
        if (existsSync(dirPath)) {
            return;
        }
        try {
            if (!fs.existsSync(dirPath)) {
                FileManager.createDirectory(path.join(dirPath, ".."));
                fs.mkdirSync(dirPath);
            }
        } catch (e) {
            throw e;
        }
    }

    public static createFile(pathValue: string, fileName: string, data: string) {
        let filePath = path.join(pathValue, fileName);
        writeFileSync(filePath, data);
    }

    static doesFileExist(filePath: string, fileName: string): boolean {
        return existsSync(path.join(filePath, fileName));
    }
}