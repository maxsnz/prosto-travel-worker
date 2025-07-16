import ReactDOMServer from "react-dom/server";
import GuidePage from "./templates/GuidePage";
import { cityGuideService, guideService, llmRequestService } from "./services";
import gptService from "./llm/gptService";

const generateGuideHtml = async (guideId: number) => {
  const guide = await guideService.getGuideById(guideId);

  if (guide.status === "ready") {
    return guide.htmlContent;
  }

  const cityGuide = await cityGuideService.getCityGuideById(guide.cityGuideId);

  let completion = await llmRequestService.getCompletion(guide.id);

  if (!completion) {
    completion = await gptService.askGPT({ guide, cityGuide });
  }

  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    <GuidePage guide={guide} cityGuide={cityGuide} guideSchedule={completion} />
  );

  return htmlContent;
};

export default generateGuideHtml;
