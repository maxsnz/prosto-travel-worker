import { ScheduleDay } from "../../llm/schema";
import ScheduleDayItem from "./ScheduleDayItem";
import ScheduleDayPlaceItem from "./ScheduleDayPlaceItem";
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
        <ScheduleDayItem key={day.day} day={day} />
        <div className="places-container">
          {day.plan.map((planItem) => (
            <ScheduleDayPlaceItem
              key={planItem.placeId}
              placeId={planItem.placeId}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default Schedule;
