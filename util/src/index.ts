/**
 * RoactRodux Build Utility
 *
 * Since RoactRodux isn't natively supportable by roblox-ts, gotta write a script to replace the require with a roblox-ts require.
 */

import path = require("path");
import fs = require("fs-extra");

const libDir = path.join(process.cwd(), "roact-rodux", "lib");

function replaceRoactRequire(text: string) {
	text = text.replace(
		/^local Roact = require\([\w\.]+\.Roact\)/gi,
		`local RoactModule = assert(script.Parent.Parent.Parent:FindFirstChild("roact"), "@rbxts/roact not found, is it installed?")\n` +
			`local Roact = require(RoactModule.roact.src)`,
	);

	return text;
}

fs.readdir(libDir, (err, files) => {
	fs.ensureDirSync(path.join(process.cwd(), "out"));

	if (err) {
		console.error(err);
	}
	const matching = files.filter(file => file.match(/^(\w+)\.lua$/));
	for (const matched of matching) {
		if (matched.match(/^(connect\.lua|StoreProvider\.lua)$/)) {
			console.log("replace", matched);

			let text = replaceRoactRequire(
				fs.readFileSync(path.join(libDir, matched)).toString(),
			);

			fs.writeFileSync(path.join(process.cwd(), "out", matched), text);
		} else {
			fs.copyFileSync(
				path.join(libDir, matched),
				path.join(process.cwd(), "out", matched),
			);
		}
	}
});
