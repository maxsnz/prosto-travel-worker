import { Place, placeService } from "../../services";

const ScheduleDayPlaceItem = ({ placeId }: { placeId: number }) => {
  const place = placeService.getPlaceByIdSync(placeId);

  if (!place) {
    return <div>place {placeId} not found</div>;
  }

  return (
    <div className="places-place">
      <div className="places-place-left">
        <p>
          <strong>{place.name}</strong>
        </p>
        {/* {!!place.motivation && (
          <p>
            <strong>Почему сюда?</strong> {place.motivation}
          </p>
        )} */}
        {!!place.description && (
          <p>
            <strong>Описание:</strong> {place.description}
          </p>
        )}
        {/* {!!place.who && (
          <p>
            <strong>Кому зайдет:</strong> {place.who}
          </p>
        )} */}
      </div>
      <div className="places-place-right">
        {/* {!!place.notes && <p>{place.notes}</p>} */}
        <p>
          Открыть в приложении 📱
          <a href={`https://prstrvl.ru/app/place/${place.id}`}>Prosto Travel</a>
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
  );
};

export default ScheduleDayPlaceItem;
