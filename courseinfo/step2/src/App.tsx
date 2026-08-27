//This contains the properties that every course part has
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

//The keyword extends means: Take everything from CoursePartBase and add something new.
interface CoursePartDescription extends CoursePartBase {
  description: string;
}

//This inherits everything from CoursePartDescription. This does not mean any string. It means the value can only be: "basic"
interface CoursePartBasic extends CoursePartDescription {
  //The kind property allows TypeScript to identify which type of CoursePart it is.
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

//This is called a union type.
type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

// Exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
};

// Part component
interface PartProps {
  coursePart: CoursePart;
}

const Part = ({ coursePart }: PartProps) => {
  switch (coursePart.kind) {
    case "basic":
      return (
        <div>
          <p>
            <strong>{coursePart.name}</strong> {coursePart.exerciseCount}
          </p>
          <p>{coursePart.description}</p>
        </div>
      );

    case "group":
      return (
        <div>
          <p>
            <strong>{coursePart.name}</strong> {coursePart.exerciseCount}
          </p>
          <p>project exercises: {coursePart.groupProjectCount}</p>
        </div>
      );

    case "background":
      return (
        <div>
          <p>
            <strong>{coursePart.name}</strong> {coursePart.exerciseCount}
          </p>
          <p>{coursePart.description}</p>
          <p>submit to {coursePart.backgroundMaterial}</p>
        </div>
      );

    case "special":
      return (
        <div>
          <p>
            <strong>{coursePart.name}</strong> {coursePart.exerciseCount}
          </p>
          <p>{coursePart.description}</p>
          <p>required skills: {coursePart.requirements.join(", ")}</p>
        </div>
      );

    default:
      return assertNever(coursePart);
  }
};

// Header
interface HeaderProps {
  name: string;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;
};

// Content
interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((coursePart) => (
        <Part key={coursePart.name} coursePart={coursePart} />
      ))}
    </div>
  );
};

// Total
interface TotalProps {
  courseParts: CoursePart[];
}

const Total = ({ courseParts }: TotalProps) => {
  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return <p>Number of exercises {totalExercises}</p>;
};

// App
const App = () => {
  const courseName = "Half Stack application development";

  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is the leisured course part",
      kind: "basic",
    },
    {
      name: "Advanced",
      exerciseCount: 7,
      description: "This is the hard part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://fake-exercise-submit.made-up-url.dev",
      kind: "background",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
