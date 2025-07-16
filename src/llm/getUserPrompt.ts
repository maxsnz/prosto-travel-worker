import { CityGuide, Place } from "../services";

export const getUserPrompt = ({
  cityGuide,
  days,
  places,
}: {
  cityGuide: CityGuide;
  days: number;
  places: Place[];
}) => {
  const placesData = places
    .map((p, i) => {
      const lines = [`${i + 1}. ${p.name}`];

      if (p.address) lines.push(`Адрес: ${p.address}`);
      if (p.description) lines.push(`Описание: ${p.description}`);
      if (p.coords) lines.push(`Координаты: ${p.coords}`);
      if (p.mapLink) lines.push(`Карта: ${p.mapLink}`);
      if (p.tags?.length) lines.push(`Теги: ${p.tags.join(", ")}`);

      return lines.join("\n");
    })
    .join("\n\n");

  return `Вот входные данные для гида:
Город: ${cityGuide.cityName}
Количество дней: ${days}
Места, которые можно использовать:

${placesData}
  `;
};
