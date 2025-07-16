import { safeValidateGPTResponse } from "./schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

// Test the schema with the example data
async function testSchema() {
  try {
    // Read the example file
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const examplePath = path.join(__dirname, "responseExample.json");
    const exampleData = JSON.parse(fs.readFileSync(examplePath, "utf8"));

    console.log("Testing schema validation...");

    // Test validation
    const result = safeValidateGPTResponse(exampleData);

    if (result.success) {
      console.log("✅ Schema validation passed!");
      console.log("Validated data structure:");
      console.log(`- Summary days: ${result.data.summary.length}`);
      console.log(`- Schedule days: ${result.data.schedule.length}`);
      console.log(
        `- First day plan items: ${result.data.schedule[0]?.plan.length || 0}`
      );
      console.log(
        `- First day places: ${result.data.schedule[0]?.places.length || 0}`
      );
    } else {
      console.log("❌ Schema validation failed:");
      console.log(result.error);
    }

    // Test with invalid data
    console.log("\nTesting with invalid data...");
    const invalidData = {
      summary: [],
      schedule: [],
    };

    const invalidResult = safeValidateGPTResponse(invalidData);
    if (!invalidResult.success) {
      console.log("✅ Correctly rejected invalid data:");
      console.log(invalidResult.error);
    } else {
      console.log("❌ Should have rejected invalid data");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testSchema();
