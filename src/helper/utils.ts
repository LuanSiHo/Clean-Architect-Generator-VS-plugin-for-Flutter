
export class Utils {
    private static featureName = "";
    private static packageName = "";

    static setFeatureName(value: string) {
        Utils.featureName = value;
    }

    static setPackageName(value: string) {
        Utils.packageName = value;
    }

    static generateContent(value: string): string {
        var formattedFeatureName = Utils.featureName.toLowerCase();
        var content = value;
        if (content.includes("\$\$\$package_name")) {
            content = content.replaceAll("\$\$\$package_name", Utils.packageName);
        }

        if (content.includes("\$\$\$feature_name")) {
            content = content.replaceAll("\$\$\$feature_name", formattedFeatureName);
        }

        if (content.includes("\$\$\$FeatureName")) {
            let parts = formattedFeatureName.split("_");
            formattedFeatureName = "";
            for (var part of parts) {
                if (part.length > 1) {
                    formattedFeatureName = formattedFeatureName.concat(part.substring(0, 1).toUpperCase()).concat(part.substring(1));
                } else if (part.length == 1) {
                    formattedFeatureName = formattedFeatureName.concat(part.substring(0, 1).toUpperCase());
                }
            }
            content = content.replaceAll("\$\$\$FeatureName", formattedFeatureName);
        }

        if (formattedFeatureName.length > 0) {
            let featureName = formattedFeatureName.substring(0, 1).toLowerCase() + formattedFeatureName.substring(1);
            content = content.replaceAll("\$\$\$featureName", featureName);
        }
        return content;
    }
}

