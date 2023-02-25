import React from "react";
import Person from "./Person";

const Persons = ({ persons, newFilter, deletePerson }) => {
  const toShow = persons.filter((x) =>
    x.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <ul>
      {toShow.map((n) => (
        <Person key={n.id} person={n} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

export default Persons;
