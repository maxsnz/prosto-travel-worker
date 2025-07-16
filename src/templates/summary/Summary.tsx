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
          <tr>
            <td width="10%">1</td>
            <td width="30%">
              Завтрак в кофейне «Маяк», Золотые ворота, Дмитриевский собор
            </td>
            <td width="30%">Музей-башня, книжная лавка, обед и кофе-брейк</td>
            <td width="30%">Козлов вал + ужин в 22А Kitchen &amp; Bar</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

export default Summary;
