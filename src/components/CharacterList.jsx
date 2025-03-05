import React, { useState } from "react";
import axios from "axios";
import "./CharacterList.css";

const fetchData = async (name) => {
  const response = await axios.get("https://api.disneyapi.dev/character", {
    params: { name },
  });
  console.log("response", response);
  return response.data;
};

import { useQuery } from "@tanstack/react-query";

function CharacterList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [queryTerm, setQueryTerm] = useState("");

  const { isPending, error, data } = useQuery({
    queryKey: ["character", queryTerm],
    queryFn: () => fetchData(queryTerm),
    staleTime: 5 * 100 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: "always",
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const handleSearch = () => {
    setQueryTerm(searchTerm);
  };

  return (
    <div className="container">
      <h2 className="fs-3 text-center mt-2">Search Disney Character</h2>
      <div className="search-bar row my-3 d-flex justify-content-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="search characters..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button className="btn btn-success" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      <div className="row">
        {data?.data?.length ? (
          data.data.map((character) => (
            <div className="col-12 col-md-3 mb-4" key={character._id}>
              <div className="card">
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="card-img-top img-fluid"
                />
                <div className="card-body">
                  <h5 className="card-title">{character.name}</h5>
                  <p className="card-text">
                    <strong>Film:</strong> {character.films}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Not Character Found</p>
        )}
      </div>
    </div>
  );
}

export default CharacterList;
