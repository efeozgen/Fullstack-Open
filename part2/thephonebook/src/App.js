import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import NotError from "./components/NotError";
import NotSuccess from "./components/NotSuccess";
import axios from "axios";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const deletePerson = (id) => {
    const person = persons.filter((n) => n.id === id);

    if (window.confirm(`Delete ${person[0].name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((n) => n.id !== id));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (newName === "" || newNumber === "") {
      window.alert(`Please enter name and number`);
    } else {
      if (
        persons.filter((person) => person.name === personObject.name).length > 0
      ) {
        if (
          window.confirm(
            `${newName}  is already added the phonebook, replace the old number with a new one ? `
          )
        ) {
          const person = persons.find((n) => n.name === newName);

          personService
            .update(person.id, { ...person, number: newNumber })
            .then((returnedPerson) => {
              setPersons(
                persons.map((n) => (n.name === newName ? returnedPerson : n))
              );
              setSuccessMessage(`"${newName}"s number is updated`);
              setNewName("");
              setNewNumber("");
              setTimeout(() => {
                setSuccessMessage(null);
              }, 3000);
            })
            .catch((error) => {
              setErrorMessage(
                `[ERROR]: Person is not found, might have been deleted`
              );
              setTimeout(() => {
                setErrorMessage(null);
              }, 3000);
            });
        }
      } else {
        personService
          .create(personObject)
          .then((newPerson) => {
            setPersons(persons.concat(newPerson));
            setSuccessMessage(`Person succesfully added`);
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setErrorMessage(`${error.response.data.error}`);
          });
        setTimeout(() => {
          setErrorMessage(null);
          setSuccessMessage(null);
        }, 3000);
      }
    }
  };

  const names = persons.map((person) => person.name);

  return (
    <div>
      <h2>Phonebook</h2>
      <NotError errorMessage={errorMessage} />
      <NotSuccess successMessage={successMessage} />
      <Filter value={newFilter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        newFilter={newFilter}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
