import { SummaryDay } from "../../llm/schema";
import { plural } from "../../utils/plural";
import { styles } from "./styles";

interface Props {
  summary: SummaryDay[];
}

const Summary = ({ summary }: Props) => (
  <>
    <style>{styles}</style>
    <h2 style={{ marginBottom: "10px" }}>
      Быстрый чек-лист to-do на {summary.length}{" "}
      {plural(summary.length, "день", "дня", "дней")}
    </h2>
    <p>Что успеем посмотреть и увидеть за мини-отпуск</p>
    <table className="summary-table" width="100%">
      <thead>
        <tr>
          <th style={{ width: "10%" }}>День</th>
          <th style={{ width: "30%" }}>Утро</th>
          <th style={{ width: "30%" }}>День</th>
          <th style={{ width: "30%" }}>Вечер</th>
        </tr>
      </thead>
      <tbody>
        {summary.map((day) => (
          <tr key={day.day}>
            <td width="10%">{day.day}</td>
            <td width="30%">{day.morning}</td>
            <td width="30%">{day.afternoon}</td>
            <td width="30%">{day.evening}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

export default Summary;
