import { ScheduleDay } from "../../llm/schema";
import { styles } from "./styles";

interface Props {
  schedule: ScheduleDay[];
}

const Schedule = ({ schedule }: Props) => (
  <div className="schedule-container">
    <style>{styles}</style>
    {schedule.map((day) => (
      <div className="schedule-day t565" key={day.day}>
        <div className="schedule-day-title">
          День {day.day} — {day.title}
        </div>
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
        <div className="places-container">
          {day.places.map((place) => (
            <div className="places-place">
              <div className="places-place-left">
                <p>
                  <strong>{place.title}</strong>
                </p>
                {!!place.motivation && (
                  <p>
                    <strong>Почему сюда?</strong> {place.motivation}
                  </p>
                )}
                {!!place.description && (
                  <p>
                    <strong>Описание:</strong> {place.description}
                  </p>
                )}
                {!!place.who && (
                  <p>
                    <strong>Кому зайдет:</strong> {place.who}
                  </p>
                )}
              </div>
              <div className="places-place-right">
                {!!place.notes && <p>{place.notes}</p>}
                <p>
                  Открыть в приложении 📱
                  <a href={`https://prstrvl.ru/app/place/${place.placeId}`}>
                    Prosto Travel
                  </a>
                </p>
                {place.tags.length > 0 && (
                  <div className="places-place-right-tags">
                    Теги:{" "}
                    {place.tags.map((tag) => (
                      <span key={tag} className="places-place-right-tag">
                        #{tag}{" "}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default Schedule;
