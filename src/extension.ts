import * as vscode from 'vscode';
import {Utils} from './helper/utils';
import * as path from 'path';
import { FileManager } from './helper/file_manager';
import { ProjectManager } from './helper/project_manager';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('clean-architect-generator.generateFeature', async () => {

		// check if this is a Flutter Projec
		if (!FileManager.isFlutterProject()) {
			vscode.window.showErrorMessage('This is not a Flutter Project');
			return;
		}

		// get input from user
		var featureName = await vscode.window.showInputBox({
			placeHolder: 'Please enter your feature name',
		});
		featureName = featureName?.toLowerCase().trim();
		featureName = featureName?.replaceAll(" ", "_");
		Utils.setFeatureName(featureName ?? "");
		Utils.setPackageName(ProjectManager.getProjectPackageName());

		// get resources path, contain template files
		let resourcePath = path.join(__dirname, "../resources");
		let rootPath = FileManager.rootPath;
		// parse template file
		let featureMapString = FileManager.readFileAsString(resourcePath,'feature_map.txt');
		let paths = featureMapString?.split("\n") ?? [];

		for(var filePath of paths) {
			let arrPath = filePath.split("/");
			if (arrPath.length >= 0) {
				
				var fileName = arrPath[arrPath.length - 1];
				
				// create directory if needed
				var dirPath = Utils.generateContent(filePath.replace(fileName, ""));
				dirPath = path.join(rootPath, dirPath);
				FileManager.createDirectory(dirPath);

				// generate content from template file
				var content = FileManager.readFileAsString(resourcePath, fileName) ?? "";
				content = Utils.generateContent(content);

				// create file name
				fileName = fileName.replace(".txt", ".dart");
				fileName = Utils.generateContent(fileName);

				// create file with content
				FileManager.createFile(dirPath, fileName, content);
			}
		}
		vscode.window.showInformationMessage(`${featureName} created successfully`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
