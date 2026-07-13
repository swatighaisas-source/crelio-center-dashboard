import { TRAINING_COURSES } from "../../data/accountOverview";

export function OnlineTrainingsPanel() {
  return (
    <aside className="ao-trainings">
      <h2 className="ao-trainings__title">Online Trainings</h2>
      <ul className="ao-trainings__list">
        {TRAINING_COURSES.map((course) => (
          <li key={course.id} className="ao-training-card">
            <div className={`ao-training-thumb ${course.thumbClass}`} aria-hidden />
            <div className="ao-training-card__body">
              <h3 className="ao-training-card__title">{course.title}</h3>
              <p className="ao-training-card__desc">{course.description}</p>
              <button type="button" className="ao-training-card__link">
                Register Now
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="ao-trainings__all">
        Check all courses
      </button>
    </aside>
  );
}
