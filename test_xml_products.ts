import * as fs from 'fs';

const input = `<?xml version="1.0" encoding="UTF-8"?>
<Settings xmlns:x="https://ccl.dev/xml" name="Plugins-en" version="1">
	<Section path="00000000/ampire.dspdef">
		<Attributes numClasses="1">
			<DateTime x:id="modifiedTime" time="1900/01/01 00:00:00.000"/>
			<Version x:id="version" vendor="PreSonus" url="http://www.presonussoftware.com"/>
			<List x:id="Classes">
				<ClassDescription classID="{B6407C28-0F92-4538-9E7F-9B867B3FEA74}" category="AudioEffect" name="Ampire"
				                  subCategory="(Native)/Distortion">
					<PersistentAttributes x:id="attributes">
						<Attribute id="Class:Folder" value="(Native)/Distortion"/>
					</PersistentAttributes>
				</ClassDescription>
			</List>
		</Attributes>
	</Section>
</Settings>`;

const tagMatches = Array.from(input.matchAll(/<([a-zA-Z0-9_-]+)\s+([^>]+)>/gi));
console.log("Found tags:");
for (const match of tagMatches) {
    if (match[1] === 'ClassDescription') {
        process.stdout.write("Matches ClassDescription: " + match[2] + "\n");
    }
}
