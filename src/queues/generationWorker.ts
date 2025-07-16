import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";
import { guideService } from "../services";
import generateGuideHtml from "../generateGuideHtml";
import { generateGuideHash } from "../utils/generateHash";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

const guideGeneratedQueue = new Queue("generate-guide-response", {
  connection,
});

const generationWorker = new Worker(
  "generate-guide-request",
  async (job) => {
    const { guideId, userId } = job.data;
    try {
      console.log("[WORKER] Generating guide", job.data);

      const htmlContent = await generateGuideHtml(guideId);

      console.log("[WORKER] Guide generated");

      const guideHash = generateGuideHash(guideId, userId);

      await guideService.updateGuide(guideId, {
        htmlContent,
        status: "ready",
        publicId: guideHash,
      });

      await guideGeneratedQueue.add("generate-guide-response", {
        guideId,
        userId,
        isSuccess: true,
        guideHash,
      });
    } catch (error) {
      console.error("[WORKER] Error generating guide", error);

      await guideGeneratedQueue.add("generate-guide-response", {
        guideId,
        userId,
        isSuccess: false,
      });
    }
  },
  { connection }
);
