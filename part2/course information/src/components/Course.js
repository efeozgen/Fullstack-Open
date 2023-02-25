import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => {
  var chapters = course.parts.map((chapter) => {
    return chapter.exercises;
  });
  var total = chapters.reduce((sum, order) => sum + order, 0);

  return (
    <div>
      <Header header={course.name} />

      {course.parts.map((part) => (
        <Content key={part.id} part={part} />
      ))}
      <h4> total of {total} exercises </h4>
    </div>
  );
};

export default Course;
