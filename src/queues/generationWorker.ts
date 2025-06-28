import { Worker, Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis();

const guideGeneratedQueue = new Queue("guide-generated", { connection });

const generationWorker = new Worker(
  "generate-guide",
  async (job) => {
    const { guideId, userId, city, templateVersion } = job.data;

    console.log("[WORKER] Generating guide for", city);

    // TODO: Implement generation logic
    // const htmlContent = await generateGuideHTML(city, templateVersion);

    // await saveGuideToStrapi(guideId, htmlContent);

    await guideGeneratedQueue.add("guide-generated", {
      guideId,
      userId,
    });
  },
  { connection }
);
