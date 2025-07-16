import Markdown from "react-markdown";
import { styles } from "./styles";
import { CityGuide, Guide } from "../services/types";
import { GuideSchedule } from "../llm/schema";
import Summary from "./summary/Summary";
import Schedule from "./schedule/Schedule";
import Gallery from "./gallery/Gallery";

interface Props {
  guide: Guide;
  cityGuide: CityGuide;
  guideSchedule: GuideSchedule;
}

export default function GuidePage({ guideSchedule, guide, cityGuide }: Props) {
  return (
    <html>
      <head>
        <title>Guide</title>
        <style>{styles}</style>
      </head>
      <body>
        <div
          className="cover-container"
          style={{
            backgroundImage: `url(${cityGuide.cover.url})`,
          }}
        >
          <div className="cover-filter"></div>
          <h1 className="cover-title">{cityGuide.name}</h1>
        </div>
        <div className="t-container markdown">
          <Markdown>{cityGuide.intro}</Markdown>
        </div>
        <div className="t-container">
          <Gallery items={cityGuide.gallery_1} />
        </div>
        <div className="t-container markdown">
          <Markdown>{cityGuide.history}</Markdown>
        </div>
        <div className="t-container">
          <Summary summary={guideSchedule.summary} />
        </div>
        <div className="t-container">
          <Gallery items={cityGuide.gallery_2} />
        </div>
        <div className="t-container">
          <Schedule schedule={guideSchedule.schedule} />
        </div>
        <div className="t-container">
          <Gallery items={cityGuide.gallery_3} />
        </div>
        <div className="t-container markdown">
          <h2>Полезные ссылки и материалы</h2>
          <p className="heading-description">
            Сохраните эти ссылки – лучше иметь и не нуждаться, чем нуждаться и
            не иметь
          </p>
          <Markdown>{cityGuide.resources}</Markdown>
        </div>
      </body>
    </html>
  );
}
