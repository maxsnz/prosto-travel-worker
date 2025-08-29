import { ScheduleDay } from "../../llm/schema";
import { styles } from "./styles";

interface Props {
  day: ScheduleDay;
}

const ScheduleDayItem = ({ day }: Props) => (
  <div className="t-container t565__container">
    {day.plan.map((item) => (
      <div key={item.index} className="t565__item t-item">
        <div className="t-width t-width_12 t565__mainblock">
          <div className="t565__col">
            <div className="t565__linewrapper">
              <div className="t565__line" style={{ width: "1px" }}></div>
              <div
                className="t565__circle"
                style={{
                  width: "40px",
                  height: "40px",
                  borderWidth: "2px",
                  background: "#ff793a",
                }}
              >
                <div className="t565__number t-name t-name_md"></div>
              </div>
            </div>
            <div className="t565__block" style={{ padding: "0 54px" }}>
              <div className="t565__title t-name t-name_lg">
                <strong>
                  {item.time} {item.title}
                </strong>
              </div>
              <div className="t565__descr t-text t-text_xs">
                {item.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ScheduleDayItem;
